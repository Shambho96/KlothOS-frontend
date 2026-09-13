import type { Product, Customer, DeadStockItem, LoyaltyRules, CampaignCohort, StoreSettings, CustomTierConfig, BroadcastLog, StaffMember, AuditLogEntry } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Supima Cutaway Oxford Shirt',
    category: 'Shirts',
    price: 2899,
    description: '100% Long-staple Supima cotton with hand-tailored cutaway collar.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
    swatches: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Olive', hex: '#556B2F' }
    ],
    variants: [
      { id: 'v-101', size: 'S', color: 'White', colorHex: '#FFFFFF', stock: 12, sku: 'SHIRT-WHT-S' },
      { id: 'v-102', size: 'M', color: 'White', colorHex: '#FFFFFF', stock: 18, sku: 'SHIRT-WHT-M' },
      { id: 'v-103', size: 'L', color: 'White', colorHex: '#FFFFFF', stock: 14, sku: 'SHIRT-WHT-L' },
      { id: 'v-104', size: 'XL', color: 'White', colorHex: '#FFFFFF', stock: 8, sku: 'SHIRT-WHT-XL' },
      { id: 'v-105', size: 'S', color: 'Sky Blue', colorHex: '#87CEEB', stock: 9, sku: 'SHIRT-SKY-S' },
      { id: 'v-106', size: 'M', color: 'Sky Blue', colorHex: '#87CEEB', stock: 15, sku: 'SHIRT-SKY-M' },
      { id: 'v-107', size: 'L', color: 'Sky Blue', colorHex: '#87CEEB', stock: 11, sku: 'SHIRT-SKY-L' },
      { id: 'v-108', size: 'XL', color: 'Sky Blue', colorHex: '#87CEEB', stock: 6, sku: 'SHIRT-SKY-XL' },
      { id: 'v-109', size: 'S', color: 'Olive', colorHex: '#556B2F', stock: 7, sku: 'SHIRT-OLV-S' },
      { id: 'v-110', size: 'M', color: 'Olive', colorHex: '#556B2F', stock: 10, sku: 'SHIRT-OLV-M' },
      { id: 'v-111', size: 'L', color: 'Olive', colorHex: '#556B2F', stock: 8, sku: 'SHIRT-OLV-L' },
      { id: 'v-112', size: 'XL', color: 'Olive', colorHex: '#556B2F', stock: 4, sku: 'SHIRT-OLV-XL' }
    ]
  },
  {
    id: 'prod-2',
    name: 'Pleated Italian Wool Trousers',
    category: 'Trousers',
    price: 4499,
    description: 'Double-pleated Vitale Barberis Canonico wool with tab waistband.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    swatches: [
      { name: 'Espresso', hex: '#3B2F2F' },
      { name: 'Charcoal', hex: '#36454F' }
    ],
    variants: [
      { id: 'v-201', size: '30', color: 'Espresso', colorHex: '#3B2F2F', stock: 6, sku: 'TROUS-ESP-30' },
      { id: 'v-202', size: '32', color: 'Espresso', colorHex: '#3B2F2F', stock: 9, sku: 'TROUS-ESP-32' },
      { id: 'v-203', size: '34', color: 'Espresso', colorHex: '#3B2F2F', stock: 12, sku: 'TROUS-ESP-34' },
      { id: 'v-204', size: '36', color: 'Espresso', colorHex: '#3B2F2F', stock: 14, sku: 'TROUS-ESP-36' },
      { id: 'v-205', size: '30', color: 'Charcoal', colorHex: '#36454F', stock: 8, sku: 'TROUS-CHA-30' },
      { id: 'v-206', size: '32', color: 'Charcoal', colorHex: '#36454F', stock: 14, sku: 'TROUS-CHA-32' },
      { id: 'v-207', size: '34', color: 'Charcoal', colorHex: '#36454F', stock: 10, sku: 'TROUS-CHA-34' },
      { id: 'v-208', size: '36', color: 'Charcoal', colorHex: '#36454F', stock: 5, sku: 'TROUS-CHA-36' }
    ]
  },
  {
    id: 'prod-3',
    name: 'Raw Selvedge Denim 14oz',
    category: 'Denim',
    price: 5299,
    description: 'Unwashed Japanese shuttle-loom selvedge indigo denim.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    swatches: [
      { name: 'Deep Indigo', hex: '#1A237E' }
    ],
    variants: [
      { id: 'v-301', size: '30', color: 'Deep Indigo', colorHex: '#1A237E', stock: 9, sku: 'DENIM-IND-30' },
      { id: 'v-302', size: '32', color: 'Deep Indigo', colorHex: '#1A237E', stock: 16, sku: 'DENIM-IND-32' },
      { id: 'v-303', size: '34', color: 'Deep Indigo', colorHex: '#1A237E', stock: 11, sku: 'DENIM-IND-34' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Unstructured Linen Safari Jacket',
    category: 'Jackets',
    price: 7999,
    description: 'Pure Normandy linen jacket with horn buttons and bellows pockets.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
    swatches: [
      { name: 'Sand Beige', hex: '#D2B48C' },
      { name: 'Sage', hex: '#9CAF88' }
    ],
    variants: [
      { id: 'v-401', size: '38', color: 'Sand Beige', colorHex: '#D2B48C', stock: 4, sku: 'JACK-SND-38' },
      { id: 'v-402', size: '40', color: 'Sand Beige', colorHex: '#D2B48C', stock: 8, sku: 'JACK-SND-40' },
      { id: 'v-403', size: '42', color: 'Sand Beige', colorHex: '#D2B48C', stock: 5, sku: 'JACK-SND-42' },
      { id: 'v-404', size: '38', color: 'Sage', colorHex: '#9CAF88', stock: 3, sku: 'JACK-SGE-38' },
      { id: 'v-405', size: '40', color: 'Sage', colorHex: '#9CAF88', stock: 7, sku: 'JACK-SGE-40' },
      { id: 'v-406', size: '42', color: 'Sage', colorHex: '#9CAF88', stock: 4, sku: 'JACK-SGE-42' }
    ]
  },
  {
    id: 'prod-5',
    name: 'Silk Resort Collar Shirt',
    category: 'Shirts',
    price: 3499,
    description: 'Sand-washed mulberry silk with relaxed cuban open collar.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    swatches: [
      { name: 'Terracotta', hex: '#E07A5F' },
      { name: 'Midnight', hex: '#1D2D44' }
    ],
    variants: [
      { id: 'v-501', size: 'M', color: 'Terracotta', colorHex: '#E07A5F', stock: 8, sku: 'SILK-TER-M' },
      { id: 'v-502', size: 'L', color: 'Terracotta', colorHex: '#E07A5F', stock: 12, sku: 'SILK-TER-L' },
      { id: 'v-503', size: 'XL', color: 'Terracotta', colorHex: '#E07A5F', stock: 6, sku: 'SILK-TER-XL' },
      { id: 'v-504', size: 'M', color: 'Midnight', colorHex: '#1D2D44', stock: 10, sku: 'SILK-MID-M' },
      { id: 'v-505', size: 'L', color: 'Midnight', colorHex: '#1D2D44', stock: 14, sku: 'SILK-MID-L' }
    ]
  },
  {
    id: 'prod-6',
    name: 'Cashmere Knit Crewneck',
    category: 'Knits',
    price: 6899,
    description: '2-ply Mongolian cashmere light sweater for evening layering.',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
    swatches: [
      { name: 'Oatmeal', hex: '#E3D5CA' },
      { name: 'Navy', hex: '#000080' }
    ],
    variants: [
      { id: 'v-601', size: 'S', color: 'Oatmeal', colorHex: '#E3D5CA', stock: 5, sku: 'KNIT-OAT-S' },
      { id: 'v-602', size: 'M', color: 'Oatmeal', colorHex: '#E3D5CA', stock: 9, sku: 'KNIT-OAT-M' },
      { id: 'v-603', size: 'L', color: 'Oatmeal', colorHex: '#E3D5CA', stock: 7, sku: 'KNIT-OAT-L' },
      { id: 'v-604', size: 'M', color: 'Navy', colorHex: '#000080', stock: 8, sku: 'KNIT-NVY-M' },
      { id: 'v-605', size: 'L', color: 'Navy', colorHex: '#000080', stock: 6, sku: 'KNIT-NVY-L' }
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Kabir Mehta',
    phone: '+919930012345',
    email: 'kabir.mehta@example.com',
    tier: 'Black VIP',
    totalSpend: 84500,
    coinsBalance: 4200,
    preferredFit: 'Size L / 34',
    preferredCategory: 'Shirts & Trousers',
    joinedDate: '2024-03-15',
    lastVisitDaysAgo: 12,
    orderHistory: [
      {
        id: 'INV-2026-089',
        date: '2026-08-28',
        items: [
          { name: 'Unstructured Linen Safari Jacket', variant: 'Sand Beige / 42', qty: 1, price: 7999 },
          { name: 'Supima Cutaway Oxford Shirt', variant: 'White / L', qty: 1, price: 2899 }
        ],
        subtotal: 10898,
        discount: 545,
        tax: 517,
        total: 10870,
        coinsEarned: 543,
        coinsRedeemed: 0,
        whatsappStatus: 'Delivered'
      },
      {
        id: 'INV-2026-041',
        date: '2026-06-14',
        items: [
          { name: 'Pleated Italian Wool Trousers', variant: 'Espresso / 34', qty: 2, price: 4499 }
        ],
        subtotal: 8998,
        discount: 450,
        tax: 427,
        total: 8975,
        coinsEarned: 449,
        coinsRedeemed: 1200,
        whatsappStatus: 'Read'
      }
    ]
  },
  {
    id: 'cust-2',
    name: 'Ananya Sharma',
    phone: '+919820098765',
    email: 'ananya.s@example.com',
    tier: 'Gold',
    totalSpend: 42900,
    coinsBalance: 2150,
    preferredFit: 'Size M / 32',
    preferredCategory: 'Denim & Knits',
    joinedDate: '2024-07-22',
    lastVisitDaysAgo: 28,
    orderHistory: [
      {
        id: 'INV-2026-062',
        date: '2026-07-19',
        items: [
          { name: 'Raw Selvedge Denim 14oz', variant: 'Deep Indigo / 32', qty: 1, price: 5299 },
          { name: 'Silk Resort Collar Shirt', variant: 'Terracotta / M', qty: 1, price: 3499 }
        ],
        subtotal: 8798,
        discount: 440,
        tax: 418,
        total: 8776,
        coinsEarned: 439,
        coinsRedeemed: 0,
        whatsappStatus: 'Delivered'
      }
    ]
  },
  {
    id: 'cust-3',
    name: 'Rohan Verma',
    phone: '+919711054321',
    email: 'rohan.v@example.com',
    tier: 'Silver',
    totalSpend: 14800,
    coinsBalance: 740,
    preferredFit: 'Size XL / 36',
    preferredCategory: 'Trousers',
    joinedDate: '2025-01-10',
    lastVisitDaysAgo: 52,
    orderHistory: [
      {
        id: 'INV-2026-015',
        date: '2026-01-20',
        items: [
          { name: 'Pleated Italian Wool Trousers', variant: 'Charcoal / 36', qty: 1, price: 4499 }
        ],
        subtotal: 4499,
        discount: 0,
        tax: 225,
        total: 4724,
        coinsEarned: 225,
        coinsRedeemed: 0,
        whatsappStatus: 'Read'
      }
    ]
  },
  {
    id: 'cust-4',
    name: 'Vikramaditya Roy',
    phone: '+919892044332',
    email: 'vroy@example.com',
    tier: 'Black VIP',
    totalSpend: 112000,
    coinsBalance: 5600,
    preferredFit: 'Size L / 34',
    preferredCategory: 'Jackets & Silk',
    joinedDate: '2023-11-04',
    lastVisitDaysAgo: 5,
    orderHistory: [
      {
        id: 'INV-2026-095',
        date: '2026-09-04',
        items: [
          { name: 'Unstructured Linen Safari Jacket', variant: 'Sage / 40', qty: 1, price: 7999 },
          { name: 'Cashmere Knit Crewneck', variant: 'Navy / L', qty: 1, price: 6899 }
        ],
        subtotal: 14898,
        discount: 745,
        tax: 708,
        total: 14861,
        coinsEarned: 743,
        coinsRedeemed: 1500,
        whatsappStatus: 'Delivered'
      }
    ]
  },
  {
    id: 'cust-5',
    name: 'Siddharth Rao',
    phone: '+919833011223',
    email: 'siddharth@example.com',
    tier: 'Gold',
    totalSpend: 38400,
    coinsBalance: 1920,
    preferredFit: 'Size M / 32',
    preferredCategory: 'Shirts',
    joinedDate: '2024-09-18',
    lastVisitDaysAgo: 48,
    orderHistory: [
      {
        id: 'INV-2026-033',
        date: '2026-05-02',
        items: [
          { name: 'Supima Cutaway Oxford Shirt', variant: 'Sky Blue / M', qty: 2, price: 2899 }
        ],
        subtotal: 5798,
        discount: 290,
        tax: 275,
        total: 5783,
        coinsEarned: 289,
        coinsRedeemed: 0,
        whatsappStatus: 'Delivered'
      }
    ]
  }
];

export const INITIAL_DEAD_STOCK: DeadStockItem[] = [
  {
    id: 'ds-1',
    sku: 'TROUS-ESP-36',
    name: 'Pleated Italian Wool Trousers',
    variant: 'Espresso / Size 36',
    rackAgeDays: 112,
    unitsLeft: 14,
    pricePerUnit: 4499,
    idleCapital: 62986,
    targetCohort: 'Customers wearing Size 36 / XL (Inactive > 45 Days)'
  },
  {
    id: 'ds-2',
    sku: 'DENIM-IND-30',
    name: 'Raw Selvedge Denim 14oz',
    variant: 'Deep Indigo / Size 30',
    rackAgeDays: 98,
    unitsLeft: 9,
    pricePerUnit: 5299,
    idleCapital: 47691,
    targetCohort: 'Customers wearing Size 30 (Inactive > 45 Days)'
  },
  {
    id: 'ds-3',
    sku: 'SHIRT-OLV-XL',
    name: 'Supima Cutaway Oxford Shirt',
    variant: 'Olive / Size XL',
    rackAgeDays: 94,
    unitsLeft: 12,
    pricePerUnit: 2899,
    idleCapital: 34788,
    targetCohort: 'Customers wearing Size XL / 36 (Inactive > 45 Days)'
  },
  {
    id: 'ds-4',
    sku: 'JACK-SGE-42',
    name: 'Unstructured Linen Safari Jacket',
    variant: 'Sage / Size 42',
    rackAgeDays: 105,
    unitsLeft: 4,
    pricePerUnit: 7999,
    idleCapital: 31996,
    targetCohort: 'Past Linen Safari Buyers'
  }
];

export const INITIAL_LOYALTY_RULES: LoyaltyRules = {
  cashbackPercentage: 5,
  pointExpiryDays: 90,
  silverThreshold: 0,
  goldThreshold: 25000,
  blackVipThreshold: 75000,
  pointsPerRupee: 1,
  tiers: [
    {
      id: 'tier-silver',
      name: 'Silver Member',
      minSpend: 0,
      cashbackPercentage: 3,
      colorGradient: 'from-slate-700 via-slate-600 to-slate-800',
      badgeStyle: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
      perks: ['Paperless WhatsApp Receipts', '3% Checkout Cashback', 'Digital Member Pass']
    },
    {
      id: 'tier-gold',
      name: 'Gold Insider',
      minSpend: 25000,
      cashbackPercentage: 5,
      colorGradient: 'from-amber-700 via-amber-600 to-yellow-800',
      badgeStyle: 'bg-amber-400 text-slate-950 font-extrabold',
      perks: ['5% Checkout Cashback', 'Complimentary Alterations', 'Priority Trunk Show Access']
    },
    {
      id: 'tier-black-vip',
      name: 'Black VIP Elite',
      minSpend: 75000,
      cashbackPercentage: 8,
      colorGradient: 'from-slate-950 via-slate-900 to-black',
      badgeStyle: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 font-black',
      perks: ['8% Checkout Cashback', 'Personal Stylist Concierge', 'Home Fitting Trials', 'No Coin Expiry']
    }
  ],
  passTheme: {
    cardGradient: 'gold-noir',
    patternStyle: 'monogram',
    cardTitle: 'KlothOS Boutique Pass',
    accentColor: '#e05d38'
  },
  redemptionConfig: {
    maxRedeemPercentagePerBill: 50,
    minCoinsThreshold: 100,
    coinsEarnMultiplier: 1
  },
  welcomeMessageTemplate: 'Welcome to KlothOS VIP Loyalty, {{customerName}}! 🎁 You are now enrolled as a {{tierName}} member. Current Balance: {{coinsBalance}} points. View pass: https://klothos.app/pass'
};

export const INITIAL_COHORTS: CampaignCohort[] = [
  {
    id: 'coh-1',
    name: 'Customers wearing Size L / 34 (Inactive > 45 Days)',
    description: 'Targeted size-matched cohort with high repeat affinity for trousers & shirts.',
    estimatedReach: 84,
    recommendedTemplate: 'Hi {{firstName}}! We noticed your favorite size {{preferredSize}} has fresh luxury arrivals at KlothOS. Tap to claim ₹500 VIP bonus points valid for 48 hrs: https://klothos.app/pass',
    customFilter: { sizeFilter: 'Size L / 34', idleDaysMin: 45 },
    templateConfig: {
      headerType: 'image',
      headerImageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
      bodyText: 'Hi {{firstName}}! We noticed your favorite fit {{preferredSize}} has fresh luxury arrivals at KlothOS Bandra West.\n\nUse your exclusive VIP code {{couponCode}} to claim ₹500 instant cashback on your WhatsApp Member Pass!',
      ctaButtons: [
        { id: 'btn-1', label: 'Reserve Size L on WhatsApp', type: 'reply', value: 'reserve_size_l' },
        { id: 'btn-2', label: 'View Digital Pass', type: 'url', value: 'https://klothos.app/pass' }
      ],
      couponCode: 'VIPFIT500',
      discountValue: '₹500 OFF'
    }
  },
  {
    id: 'coh-2',
    name: 'Black Tier VIP Spenders (>₹75k Lifetime)',
    description: 'Exclusive preview invitation to private seasonal boutique fittings.',
    estimatedReach: 32,
    recommendedTemplate: 'Greetings {{firstName}}! As a KlothOS Black VIP member, you have early access to our Normandy Linen capsule before public display. Private fitting slot: https://klothos.app/vip',
    customFilter: { tierFilter: 'Black VIP', minSpend: 75000 },
    templateConfig: {
      headerType: 'text',
      bodyText: 'Greetings {{firstName}}! As a KlothOS Black VIP member, you are cordially invited to an exclusive private preview of our Normandy Linen & Silk Resort Capsule before public display.\n\nBook your private fitting concierge with code {{couponCode}}.',
      ctaButtons: [
        { id: 'btn-3', label: 'Book Private Fitting Slot', type: 'reply', value: 'book_vip_slot' },
        { id: 'btn-4', label: 'Chat with Personal Stylist', type: 'reply', value: 'chat_stylist' }
      ],
      couponCode: 'BLACKVIP2026',
      discountValue: '15% VIP Special'
    }
  },
  {
    id: 'coh-3',
    name: 'Dead-Stock Clearance: Size 36 & XL Buyers',
    description: 'Automated broadcast to liquidate items sitting on racks past 90 days.',
    estimatedReach: 68,
    recommendedTemplate: 'Special Flash Secret: {{firstName}}, we have reserved 1 of our last Italian Wool Trousers (Size 36) at 25% off for you. Show this WhatsApp receipt at checkout!',
    customFilter: { sizeFilter: 'Size 36 / XL', idleDaysMin: 90 },
    templateConfig: {
      headerType: 'image',
      headerImageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
      bodyText: 'Special Rack Liquidation Secret: {{firstName}}, we have reserved 1 of our last Italian Wool Trousers (Size 36) at FLAT 25% OFF for you.\n\nShow code {{couponCode}} at our Bandra counter or reply to hold!',
      ctaButtons: [
        { id: 'btn-5', label: 'Hold Item for 24 Hrs', type: 'reply', value: 'hold_clearance_item' }
      ],
      couponCode: 'CLEARANCE25',
      discountValue: '25% OFF'
    }
  },
  {
    id: 'coh-4',
    name: 'Past Linen Safari & Resort Collar Buyers',
    description: 'Cross-sell cohort for luxury casual outerwear.',
    estimatedReach: 46,
    recommendedTemplate: 'Hi {{firstName}}! Loved your previous Linen Safari Purchase? Our new Silk Resort Shirts just landed in Bandra West. Claim 5% cashback on your WhatsApp member card!',
    customFilter: { categoryFilter: 'Jackets & Silk' },
    templateConfig: {
      headerType: 'text',
      bodyText: 'Hi {{firstName}}! Loved your previous Linen Safari purchase? Our new Mulberry Silk Resort Shirts just arrived in Bandra West.\n\nClaim 5% instant cashback automatically added to your WhatsApp Member Pass!',
      ctaButtons: [
        { id: 'btn-6', label: 'View Silk Swatches', type: 'reply', value: 'view_swatches' }
      ],
      couponCode: 'RESORT5',
      discountValue: '5% Cashback'
    }
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeLegalName: 'KlothOS Apparel Pvt. Ltd.',
  brandName: 'KlothOS',
  gstin: '27AABCK9930H1Z8',
  address: 'Shop 4 & 5, Turner Road, Opposite Art Gallery, Bandra West',
  city: 'Mumbai, MH - 400050',
  phone: '+919930099300',
  metaApiStatus: 'Live & Verified',
  receiptFooterNote: 'Thank you for shopping at KlothOS. Exchanges permitted within 14 days with valid WhatsApp receipt. Loyalty coins expire in 90 days.',
  autoSendWhatsapp: true
};

export const INITIAL_CUSTOM_TIERS: CustomTierConfig[] = [
  {
    id: 'tier-silver',
    name: 'Silver',
    minSpend: 0,
    cashbackPercentage: 3,
    colorGradient: 'from-slate-600 to-slate-800',
    badgeStyle: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    perks: ['3% Cashback Coins', 'Paperless WhatsApp Receipts', 'Digital Member Pass']
  },
  {
    id: 'tier-gold',
    name: 'Gold',
    minSpend: 25000,
    cashbackPercentage: 5,
    colorGradient: 'from-amber-400 to-amber-600',
    badgeStyle: 'bg-amber-400 text-slate-950 font-bold',
    perks: ['5% Cashback Coins', 'Complimentary In-store Alterations', 'Priority WhatsApp Dispatch']
  },
  {
    id: 'tier-black-vip',
    name: 'Black VIP',
    minSpend: 75000,
    cashbackPercentage: 10,
    colorGradient: 'from-slate-950 via-slate-900 to-black',
    badgeStyle: 'bg-slate-950 text-white font-extrabold border border-slate-700',
    perks: ['10% Cashback Coins', 'Personal Stylist Concierge', 'Early Access to New Drops', 'Zero-wait Express POS']
  },
  {
    id: 'tier-platinum-custom',
    name: 'Platinum Elite',
    minSpend: 150000,
    cashbackPercentage: 15,
    colorGradient: 'from-cyan-500 via-sky-600 to-indigo-700',
    badgeStyle: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold shadow-xs',
    perks: ['15% Cashback Coins', 'Home Fitting Try-On Service', 'Free Custom Embroidery & Monogramming', 'Dedicated Account Manager']
  }
];

export const INITIAL_BROADCAST_LOGS: BroadcastLog[] = [
  {
    id: 'log-001',
    date: '2026-09-08',
    cohortName: 'Black Tier VIP Spenders (>₹75k Lifetime)',
    reachCount: 32,
    openRate: '91%',
    templateUsed: 'New Arrival Drop',
    status: 'Delivered',
    revenueAttributed: 52400
  },
  {
    id: 'log-002',
    date: '2026-09-05',
    cohortName: 'Dead-Stock Clearance: Size 36 & XL Buyers',
    reachCount: 68,
    openRate: '76%',
    templateUsed: 'Flash Sale Alert',
    status: 'Delivered',
    revenueAttributed: 38900
  },
  {
    id: 'log-003',
    date: '2026-09-01',
    cohortName: 'Customers wearing Size L / 34 (Inactive > 45 Days)',
    reachCount: 84,
    openRate: '82%',
    templateUsed: 'Win-Back Campaign',
    status: 'Delivered',
    revenueAttributed: 61200
  },
  {
    id: 'log-004',
    date: '2026-09-12',
    cohortName: 'Past Linen Safari & Resort Collar Buyers',
    reachCount: 46,
    openRate: '79%',
    templateUsed: 'New Arrival Drop',
    status: 'Scheduled',
    revenueAttributed: 0
  }
];

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Vikramaditya Sharma',
    email: 'vikram@klothos.io',
    phone: '+91 98765 43210',
    role: 'super_admin',
    outlets: ['All Outlets'],
    status: 'active',
    pinCode: '9988',
    lastActive: 'Just now',
    permissions: {
      pos: true,
      analytics: true,
      customers: true,
      campaign: true,
      campaigns: true,
      settings: true,
      inventoryManage: true,
      refundsApprove: true,
      exportData: true
    }
  },
  {
    id: 'staff-2',
    name: 'Priya Sundaram',
    email: 'priya.s@klothos.io',
    phone: '+91 98221 11009',
    role: 'store_manager',
    outlets: ['Connaught Place Flagship'],
    status: 'active',
    pinCode: '4412',
    lastActive: '12 mins ago',
    permissions: {
      pos: true,
      analytics: true,
      customers: true,
      campaign: true,
      campaigns: true,
      settings: false,
      inventoryManage: true,
      refundsApprove: true,
      exportData: true
    }
  },
  {
    id: 'staff-3',
    name: 'Aarav Mehta',
    email: 'aarav.m@klothos.io',
    phone: '+91 97110 55432',
    role: 'pos_cashier',
    outlets: ['Connaught Place Flagship'],
    status: 'active',
    pinCode: '1234',
    lastActive: '1 hour ago',
    permissions: {
      pos: true,
      analytics: false,
      customers: true,
      campaign: false,
      campaigns: false,
      settings: false,
      inventoryManage: false,
      refundsApprove: false,
      exportData: false
    }
  },
  {
    id: 'staff-4',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@klothos.io',
    phone: '+91 99008 88765',
    role: 'inventory_clerk',
    outlets: ['Indiranagar Boutique', 'Connaught Place Flagship'],
    status: 'active',
    pinCode: '7766',
    lastActive: '3 hours ago',
    permissions: {
      pos: true,
      analytics: false,
      customers: false,
      campaign: false,
      campaigns: false,
      settings: false,
      inventoryManage: true,
      refundsApprove: false,
      exportData: false
    }
  },
  {
    id: 'staff-5',
    name: 'Rohan Malhotra',
    email: 'rohan.m@klothos.io',
    phone: '+91 98199 33211',
    role: 'marketing_lead',
    outlets: ['All Outlets'],
    status: 'inactive',
    pinCode: '5544',
    lastActive: '4 days ago',
    permissions: {
      pos: false,
      analytics: true,
      customers: true,
      campaign: true,
      campaigns: true,
      settings: false,
      inventoryManage: false,
      refundsApprove: false,
      exportData: true
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: '2026-09-13 21:40:12',
    actorName: 'Vikramaditya Sharma',
    actorRole: 'super_admin',
    action: 'Updated POS Permission for Priya Sundaram',
    category: 'permission',
    ipAddress: '103.21.124.89'
  },
  {
    id: 'audit-002',
    timestamp: '2026-09-13 20:15:44',
    actorName: 'Priya Sundaram',
    actorRole: 'store_manager',
    action: 'Approved Refund of ₹4,499 (Inv #KL-8891)',
    category: 'security',
    ipAddress: '122.160.42.11'
  },
  {
    id: 'audit-003',
    timestamp: '2026-09-13 18:02:10',
    actorName: 'Vikramaditya Sharma',
    actorRole: 'super_admin',
    action: 'Added new staff member Aarav Mehta (POS Cashier)',
    category: 'staff',
    ipAddress: '103.21.124.89'
  },
  {
    id: 'audit-004',
    timestamp: '2026-09-12 16:30:00',
    actorName: 'Ananya Deshmukh',
    actorRole: 'inventory_clerk',
    action: 'Stock Audit completed for Indiranagar Branch',
    category: 'settings',
    ipAddress: '115.240.88.5'
  }
];

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'KlothOS Menswear Flagship',
  gstin: '07AAAAA0000A1Z5',
  supportEmail: 'contact@klothos.io',
  supportPhone: '+91 11 4988 7000',
  receiptHeader: 'KlothOS Menswear • Premium Apparel & Tailoring',
  receiptFooter: 'Thank you for shopping with KlothOS. Returns accepted within 14 days with original bill.',
  outlets: [
    { id: 'out-1', name: 'Connaught Place Flagship', code: 'DEL-CP-01', address: 'Block C, Inner Circle, CP, New Delhi 110001', isPrimary: true },
    { id: 'out-2', name: 'Indiranagar Boutique', code: 'BLR-IND-02', address: '100ft Road, Indiranagar, Bengaluru 560038', isPrimary: false },
    { id: 'out-3', name: 'Bandra West Lounge', code: 'MUM-BND-03', address: 'Linking Road, Bandra West, Mumbai 400050', isPrimary: false }
  ]
};

