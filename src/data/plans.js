export const membershipPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    category: 'plans',
    slug: 'basic',
    description: 'Essential gym access for fitness enthusiasts starting their journey.',
    features: [
      { text: 'Access to Gym Floor & Cardio', included: true },
      { text: 'Standard Lockers & Showers', included: true },
      { text: '1 Free Physical Evaluation', included: true },
      { text: 'Access to Group Classes', included: false },
      { text: '1-on-1 Personal Trainer', included: false },
      { text: 'Free Customized Nutrition Plan', included: false },
    ],
    pricing: {
      monthly: 29,
      quarterly: 79,
      yearly: 278,
    },
    popular: false,
  },
  {
    id: 'elite',
    name: 'Elite Plan',
    category: 'plans',
    slug: 'elite',
    description: 'Our most popular plan with full facility access and coaching sessions.',
    features: [
      { text: 'Unlimited Gym & Cardio Access', included: true },
      { text: 'VIP Lockers & Sauna Access', included: true },
      { text: 'Monthly Physical Evaluations', included: true },
      { text: 'Full Access to Group Classes', included: true },
      { text: '2 Personal Coaching Sessions/mo', included: true },
      { text: 'Free Customized Nutrition Plan', included: false },
    ],
    pricing: {
      monthly: 59,
      quarterly: 159,
      yearly: 566,
    },
    popular: true,
  },
  {
    id: 'vip',
    name: 'VIP Plan',
    category: 'plans',
    slug: 'vip',
    description: 'Ultimate premium experience with unlimited coaching and 24/7 access.',
    features: [
      { text: '24/7 Full Facility Access', included: true },
      { text: 'Private VIP Lounge & Sauna', included: true },
      { text: 'Weekly Physical Evaluations', included: true },
      { text: 'Unlimited Group Classes', included: true },
      { text: '8 Personal Coaching Sessions/mo', included: true },
      { text: 'Free Customized Nutrition Plan', included: true },
    ],
    pricing: {
      monthly: 99,
      quarterly: 269,
      yearly: 950,
    },
    popular: false,
  },
];

export const billingPeriods = [
  { id: 'monthly', label: 'Monthly', suffix: '/mo' },
  { id: 'quarterly', label: 'Quarterly', suffix: '/3mo', discount: 'Save 10%' },
  { id: 'yearly', label: 'Yearly', suffix: '/yr', discount: 'Save 20%' },
];
