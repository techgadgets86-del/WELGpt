import {
  Customer,
  CustomerNotification,
  Subscription,
  SubscriptionNotification,
  SubscriptionCreatedNotification,
  Transaction,
  TransactionNotification,
} from '@paddle/paddle-node-sdk';
import { upsertCustomer, upsertSubscription, syncUserAccess } from './db';
import { getPaddleServer } from './server';

export type AnyCustomerPayload = Customer | CustomerNotification;
export type AnySubscriptionPayload = Subscription | SubscriptionNotification | SubscriptionCreatedNotification;
export type AnyTransactionPayload = Transaction | TransactionNotification;

/**
 * Handles customer.created and customer.updated events.
 * Mirrors customer state into database.
 */
export async function handleCustomerEvent(customer: AnyCustomerPayload): Promise<void> {
  console.log(`[Paddle Webhook] Processing customer event: ${customer.id} (${customer.email})`);

  await upsertCustomer({
    customer_id: customer.id,
    email: customer.email,
    created_at: customer.createdAt,
    updated_at: customer.updatedAt,
  });
}

/**
 * Handles subscription.created, subscription.updated, subscription.canceled,
 * subscription.activated, subscription.past_due, subscription.paused, subscription.resumed.
 * Mirrors subscription state and syncs user access.
 */
export async function handleSubscriptionEvent(subscription: AnySubscriptionPayload): Promise<void> {
  console.log(`[Paddle Webhook] Processing subscription event: ${subscription.id} status=${subscription.status}`);

  // Extract primary price and product IDs from subscription items
  const primaryItem = subscription.items?.[0];
  const priceId = primaryItem?.price?.id || '';
  const productId = primaryItem?.price?.productId || primaryItem?.product?.id || '';

  // Ensure customer exists in database
  if (subscription.customerId) {
    try {
      const paddle = getPaddleServer();
      const customer = await paddle.customers.get(subscription.customerId);
      if (customer) {
        await upsertCustomer({
          customer_id: customer.id,
          email: customer.email,
          created_at: customer.createdAt,
          updated_at: customer.updatedAt,
        });
      }
    } catch (err) {
      console.warn(`[Paddle Webhook] Could not fetch customer ${subscription.customerId} details:`, err);
    }
  }

  await upsertSubscription({
    subscription_id: subscription.id,
    customer_id: subscription.customerId,
    status: subscription.status,
    price_id: priceId,
    product_id: productId,
    scheduled_change_action: subscription.scheduledChange?.action || null,
    scheduled_change_at: subscription.scheduledChange?.effectiveAt || null,
    created_at: subscription.createdAt,
    updated_at: subscription.updatedAt,
  });
}

/**
 * Handles transaction.completed event.
 * Ensures customer and payment records are mirrored.
 */
export async function handleTransactionCompleted(transaction: AnyTransactionPayload): Promise<void> {
  console.log(`[Paddle Webhook] Processing transaction.completed: ${transaction.id}`);

  if (transaction.customerId) {
    try {
      const paddle = getPaddleServer();
      const customer = await paddle.customers.get(transaction.customerId);
      if (customer) {
        await upsertCustomer({
          customer_id: customer.id,
          email: customer.email,
          created_at: customer.createdAt,
          updated_at: customer.updatedAt,
        });
      }
    } catch (err) {
      console.warn(`[Paddle Webhook] Could not fetch customer for transaction ${transaction.id}:`, err);
    }

    // Sync user access
    await syncUserAccess(transaction.customerId);
  }
}
