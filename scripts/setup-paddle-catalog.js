const { Paddle, Environment } = require('@paddle/paddle-node-sdk');
const fs = require('fs');
const path = require('path');

// Read API Key from command line argument, or env var, or .env.local
let apiKey = process.argv[2] || process.env.PADDLE_API_KEY;

if (!apiKey) {
  const envLocalPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, 'utf8');
    const match = content.match(/PADDLE_API_KEY="?([^"\n\r]+)"?/);
    if (match) apiKey = match[1];
  }
}

if (!apiKey) {
  console.error('Error: PADDLE_API_KEY not found. Pass it as: node scripts/setup-paddle-catalog.js <YOUR_API_KEY>');
  process.exit(1);
}

const paddle = new Paddle(apiKey, {
  environment: Environment.production,
});

const CATALOG_CONFIG = [
  {
    name: 'Premium',
    productName: 'WelGPT Premium',
    description: 'Unlimited Personalized AI Coaching, Adaptive Daily Plans, Soundscapes, and Biohacking Routines.',
    taxCategory: 'saas',
    prices: {
      monthly: {
        description: 'WelGPT Premium - Monthly with 7-day free trial',
        unitPrice: { amount: '999', currencyCode: 'USD' }, // $9.99
        billingCycle: { interval: 'month', frequency: 1 },
        trialPeriod: { interval: 'day', frequency: 7 },
        unitPriceOverrides: [
          { countryCodes: ['GB'], unitPrice: { amount: '799', currencyCode: 'GBP' } },   // £7.99
          { countryCodes: ['IE'], unitPrice: { amount: '899', currencyCode: 'EUR' } },   // €8.99
          { countryCodes: ['AU'], unitPrice: { amount: '1499', currencyCode: 'AUD' } },  // A$14.99
        ],
      },
      annual: {
        description: 'WelGPT Premium - Annual with 7-day free trial',
        unitPrice: { amount: '4999', currencyCode: 'USD' }, // $49.99
        billingCycle: { interval: 'year', frequency: 1 },
        trialPeriod: { interval: 'day', frequency: 7 },
        unitPriceOverrides: [
          { countryCodes: ['GB'], unitPrice: { amount: '3999', currencyCode: 'GBP' } },  // £39.99
          { countryCodes: ['IE'], unitPrice: { amount: '4499', currencyCode: 'EUR' } },  // €44.99
          { countryCodes: ['AU'], unitPrice: { amount: '6999', currencyCode: 'AUD' } },  // A$69.99
        ],
      },
    },
  },
];

async function setupCatalog() {
  console.log('================================================================');
  console.log('🚀 Setting up Paddle Live Product Catalog for WelGPT');
  console.log('================================================================');

  const createdCatalog = {};

  for (const item of CATALOG_CONFIG) {
    console.log(`\nCreating Product: ${item.productName}...`);
    let product;
    try {
      product = await paddle.products.create({
        name: item.productName,
        description: item.description,
        taxCategory: item.taxCategory,
      });
      console.log(`✔ Created Product "${item.productName}" -> ID: ${product.id}`);
    } catch (err) {
      console.error(`❌ Failed to create product "${item.productName}":`, err.detail || err.message);
      if (err.code === 'forbidden') {
        console.error('\n⚠️ PERMISSION ERROR: Your Paddle API key does not have permission to create/read Products.');
        console.error('Please visit Paddle Dashboard > Developer Tools > Authentication, edit your API key or create a new one, and enable:');
        console.error('  - Products: Read & Write');
        console.error('  - Prices: Read & Write');
      }
      process.exit(1);
    }

    // Create Monthly Price
    console.log(`  Creating Monthly Price for ${item.name}...`);
    const monthlyPrice = await paddle.prices.create({
      productId: product.id,
      description: item.prices.monthly.description,
      unitPrice: item.prices.monthly.unitPrice,
      billingCycle: item.prices.monthly.billingCycle,
      trialPeriod: item.prices.monthly.trialPeriod,
      unitPriceOverrides: item.prices.monthly.unitPriceOverrides,
    });
    console.log(`  ✔ Monthly Price ID: ${monthlyPrice.id}`);

    // Create Annual Price
    console.log(`  Creating Annual Price for ${item.name}...`);
    const annualPrice = await paddle.prices.create({
      productId: product.id,
      description: item.prices.annual.description,
      unitPrice: item.prices.annual.unitPrice,
      billingCycle: item.prices.annual.billingCycle,
      trialPeriod: item.prices.annual.trialPeriod,
      unitPriceOverrides: item.prices.annual.unitPriceOverrides,
    });
    console.log(`  ✔ Annual Price ID: ${annualPrice.id}`);

    createdCatalog[item.name.toLowerCase()] = {
      productId: product.id,
      monthPriceId: monthlyPrice.id,
      yearPriceId: annualPrice.id,
    };
  }

  console.log('\n================================================================');
  console.log('🎉 Product Catalog Successfully Created in Paddle Live Account!');
  console.log('================================================================');
  console.log(JSON.stringify(createdCatalog, null, 2));

  // Update .env.local with newly created price IDs
  const envLocalPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envLocalPath)) {
    let content = fs.readFileSync(envLocalPath, 'utf8');

    const replaceOrAppend = (key, val) => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(content)) {
        content = content.replace(regex, `${key}="${val}"`);
      } else {
        content += `\n${key}="${val}"`;
      }
    };

    if (createdCatalog.premium) {
      replaceOrAppend('NEXT_PUBLIC_PADDLE_PRICE_PREMIUM_MONTH', createdCatalog.premium.monthPriceId);
      replaceOrAppend('NEXT_PUBLIC_PADDLE_PRICE_PREMIUM_YEAR', createdCatalog.premium.yearPriceId);
      // Also map to pro/starter for backwards compatibility
      replaceOrAppend('NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTH', createdCatalog.premium.monthPriceId);
      replaceOrAppend('NEXT_PUBLIC_PADDLE_PRICE_PRO_YEAR', createdCatalog.premium.yearPriceId);
    }

    fs.writeFileSync(envLocalPath, content, 'utf8');
    console.log('\n✔ Updated .env.local with new Price IDs!');
  }
}

setupCatalog().catch((err) => {
  console.error('Fatal error during catalog setup:', err);
  process.exit(1);
});
