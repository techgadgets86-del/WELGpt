export interface Tier {
  name: string;
  description: string;
  features: string[];
  priceId: {
    month: string;
    year: string;
  };
  badge?: string;
  popular?: boolean;
  isFree?: boolean;
  buttonText?: string;
}

export const TIERS: Tier[] = [
  {
    name: 'WelGPT Free',
    description: 'Experience the core protocols. Free gives you the tools.',
    isFree: true,
    buttonText: 'Start Free',
    features: [
      '3 WelBuddy Messages / day',
      '1 Active Custom Routine',
      'Core Meditation Library',
      'Basic Workouts & Nutrition',
      'Basic Progress Tracking',
      '5 Inspiration Generations / day',
    ],
    priceId: {
      month: '',
      year: '',
    },
  },
  {
    name: 'WelGPT Premium',
    description: 'The ultimate commitment to your mind, body, and energy. Strictly personal.',
    badge: '7-Day Free Trial',
    popular: true,
    buttonText: 'Start 7-Day Free Trial',
    features: [
      'Unlimited WelBuddy AI Co-Pilot',
      'Adaptive Daily Plans & Auto-Scheduling',
      'Unlimited Routines & Generation',
      'Full Custom Nutrition & Training Plans',
      'Detailed Weekly Insights & Analytics',
      'Premium Soundscapes & Unlimited Inspiration',
    ],
    priceId: {
      month: process.env.NEXT_PUBLIC_PADDLE_PRICE_PREMIUM_MONTH || process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTH || 'pri_01m30qhbzrs6gyp4nddqnszyat',
      year: process.env.NEXT_PUBLIC_PADDLE_PRICE_PREMIUM_YEAR || process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_YEAR || 'pri_01m30qhbzrs6gyp4nddqnszyat',
    },
  },
];
