import { adminDb } from '@/lib/firebaseAdmin';
import { CustomerRecord, SubscriptionRecord, isSubscriptionAccessGranted } from './access';

const CUSTOMERS_COLLECTION = 'customers';
const SUBSCRIPTIONS_COLLECTION = 'subscriptions';
const USERS_COLLECTION = 'users';

/**
 * Idempotently upserts customer record into Firestore.
 * Keyed strictly on customer_id.
 */
export async function upsertCustomer(record: {
  customer_id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string | null;
}): Promise<CustomerRecord> {
  const customerRef = adminDb.collection(CUSTOMERS_COLLECTION).doc(record.customer_id);
  const existingSnap = await customerRef.get();

  const now = new Date().toISOString();
  let userId = record.user_id || null;

  // If user_id wasn't passed, attempt to link with existing user by email
  if (!userId && record.email) {
    const userSnap = await adminDb
      .collection(USERS_COLLECTION)
      .where('email', '==', record.email.toLowerCase())
      .limit(1)
      .get();

    if (!userSnap.empty) {
      userId = userSnap.docs[0].id;
    }
  }

  const existingData = existingSnap.data() as CustomerRecord | undefined;

  // Protect against out-of-order older deliveries
  if (existingData?.updated_at && record.updated_at) {
    if (new Date(record.updated_at).getTime() < new Date(existingData.updated_at).getTime()) {
      console.log(`Skipping older customer event for ${record.customer_id}`);
      return existingData;
    }
  }

  const customerData: CustomerRecord = {
    customer_id: record.customer_id,
    email: record.email.toLowerCase(),
    user_id: userId || existingData?.user_id || null,
    created_at: existingData?.created_at || record.created_at || now,
    updated_at: record.updated_at || now,
  };

  await customerRef.set(customerData, { merge: true });

  // If linked to a Firebase user, mirror paddleCustomerId onto user document
  if (customerData.user_id) {
    await adminDb.collection(USERS_COLLECTION).doc(customerData.user_id).set(
      {
        paddleCustomerId: customerData.customer_id,
        updatedAt: now,
      },
      { merge: true }
    );
  }

  return customerData;
}

/**
 * Idempotently upserts subscription record into Firestore.
 * Keyed strictly on subscription_id.
 */
export async function upsertSubscription(record: {
  subscription_id: string;
  customer_id: string;
  status: string;
  price_id: string;
  product_id: string;
  scheduled_change_action?: string | null;
  scheduled_change_at?: string | null;
  created_at?: string;
  updated_at?: string;
}): Promise<SubscriptionRecord> {
  const subRef = adminDb.collection(SUBSCRIPTIONS_COLLECTION).doc(record.subscription_id);
  const existingSnap = await subRef.get();
  const existingData = existingSnap.data() as SubscriptionRecord | undefined;

  const now = new Date().toISOString();

  // Out-of-order delivery protection
  if (existingData?.updated_at && record.updated_at) {
    if (new Date(record.updated_at).getTime() < new Date(existingData.updated_at).getTime()) {
      console.log(`Skipping older subscription delivery for ${record.subscription_id}`);
      return existingData;
    }
  }

  const subData: SubscriptionRecord = {
    subscription_id: record.subscription_id,
    customer_id: record.customer_id,
    status: record.status,
    price_id: record.price_id,
    product_id: record.product_id,
    scheduled_change_action: record.scheduled_change_action || null,
    scheduled_change_at: record.scheduled_change_at || null,
    created_at: existingData?.created_at || record.created_at || now,
    updated_at: record.updated_at || now,
  };

  await subRef.set(subData, { merge: true });

  // Sync access state to matching user(s)
  await syncUserAccess(subData.customer_id, subData);

  return subData;
}

/**
 * Resolves user from customer_id or email, then updates their premium status
 * based on the active subscription grant rules.
 */
export async function syncUserAccess(
  customerId: string,
  latestSubscription?: SubscriptionRecord
): Promise<void> {
  const customerSnap = await adminDb.collection(CUSTOMERS_COLLECTION).doc(customerId).get();
  const customerData = customerSnap.data() as CustomerRecord | undefined;

  const email = customerData?.email;
  const userId = customerData?.user_id;

  // Find user document by user_id, paddleCustomerId, or email
  let userDocs: FirebaseFirestore.DocumentSnapshot[] = [];

  if (userId) {
    const doc = await adminDb.collection(USERS_COLLECTION).doc(userId).get();
    if (doc.exists) userDocs.push(doc);
  }

  if (userDocs.length === 0) {
    const snapByCustId = await adminDb
      .collection(USERS_COLLECTION)
      .where('paddleCustomerId', '==', customerId)
      .get();
    if (!snapByCustId.empty) {
      userDocs = snapByCustId.docs;
    }
  }

  if (userDocs.length === 0 && email) {
    const snapByEmail = await adminDb
      .collection(USERS_COLLECTION)
      .where('email', '==', email.toLowerCase())
      .get();
    if (!snapByEmail.empty) {
      userDocs = snapByEmail.docs;
    }
  }

  if (userDocs.length === 0) {
    console.warn(`No user found for customer_id ${customerId} (email: ${email}) to sync access.`);
    return;
  }

  // Determine active subscription if not provided
  let sub = latestSubscription;
  if (!sub) {
    const subsSnap = await adminDb
      .collection(SUBSCRIPTIONS_COLLECTION)
      .where('customer_id', '==', customerId)
      .get();

    for (const doc of subsSnap.docs) {
      const data = doc.data() as SubscriptionRecord;
      if (isSubscriptionAccessGranted(data.status)) {
        sub = data;
        break;
      }
    }
  }

  const hasAccess = sub
    ? isSubscriptionAccessGranted(sub.status, {
        action: sub.scheduled_change_action || '',
        effectiveAt: sub.scheduled_change_at || undefined,
      })
    : false;

  const now = new Date().toISOString();

  for (const userDoc of userDocs) {
    console.log(`Updating access for user ${userDoc.id}: hasAccess=${hasAccess}, status=${sub?.status}`);

    await userDoc.ref.set(
      {
        isPremium: hasAccess,
        paddleCustomerId: customerId,
        paddleSubscriptionId: sub?.subscription_id || null,
        subscriptionStatus: sub?.status || 'none',
        subscriptionPriceId: sub?.price_id || null,
        subscriptionProductId: sub?.product_id || null,
        subscriptionScheduledChange: sub?.scheduled_change_action || null,
        updatedAt: now,
        ...(hasAccess
          ? {
              aiPlanTokens: 999,
              aiChatTokens: 9999,
            }
          : {}),
      },
      { merge: true }
    );
  }
}

/**
 * Helper to fetch a customer by customer_id
 */
export async function getCustomer(customerId: string): Promise<CustomerRecord | null> {
  const snap = await adminDb.collection(CUSTOMERS_COLLECTION).doc(customerId).get();
  if (!snap.exists) return null;
  return snap.data() as CustomerRecord;
}

/**
 * Helper to find customer by user email or user_id
 */
export async function findCustomerByUser(userId: string, email?: string): Promise<CustomerRecord | null> {
  // Check by user_id first
  const snapByUserId = await adminDb
    .collection(CUSTOMERS_COLLECTION)
    .where('user_id', '==', userId)
    .limit(1)
    .get();

  if (!snapByUserId.empty) {
    return snapByUserId.docs[0].data() as CustomerRecord;
  }

  // Check by email
  if (email) {
    const snapByEmail = await adminDb
      .collection(CUSTOMERS_COLLECTION)
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (!snapByEmail.empty) {
      return snapByEmail.docs[0].data() as CustomerRecord;
    }
  }

  // Also check if user profile has paddleCustomerId
  const userDoc = await adminDb.collection(USERS_COLLECTION).doc(userId).get();
  if (userDoc.exists) {
    const custId = userDoc.data()?.paddleCustomerId;
    if (custId) {
      return getCustomer(custId);
    }
  }

  return null;
}

/**
 * Helper to get all subscriptions for a customer
 */
export async function getSubscriptionsForCustomer(customerId: string): Promise<SubscriptionRecord[]> {
  const snap = await adminDb
    .collection(SUBSCRIPTIONS_COLLECTION)
    .where('customer_id', '==', customerId)
    .get();

  return snap.docs.map((doc) => doc.data() as SubscriptionRecord);
}
