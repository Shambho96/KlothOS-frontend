export type ViewMode = 
  | 'landing' 
  | 'pos' 
  | 'analytics' 
  | 'inventory'
  | 'customers'
  | 'campaign'
  | 'settings';

export type StaffRole = 
  | 'Super Admin' 
  | 'Store Manager' 
  | 'Inventory Lead' 
  | 'Cashier' 
  | 'Marketing Lead'
  | 'super_admin' 
  | 'store_manager' 
  | 'pos_cashier' 
  | 'inventory_clerk' 
  | 'marketing_lead';

export interface DashboardPermissions {
  pos: boolean;
  analytics: boolean;
  customers: boolean;
  campaign: boolean;
  campaigns?: boolean;
  settings: boolean;
  inventoryManage?: boolean;
  refundsApprove?: boolean;
  exportData?: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  outletAssigned?: string;
  outlets?: string[];
  pinCode: string;
  avatarUrl?: string;
  status: 'Active' | 'Inactive' | 'active' | 'inactive';
  lastActive: string;
  permissions: DashboardPermissions;
}

export interface RolePermissionsConfig {
  roleName: StaffRole;
  description: string;
  badgeStyle: string;
  defaultPermissions: DashboardPermissions;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  staffName?: string;
  actorName?: string;
  staffRole?: StaffRole;
  actorRole?: StaffRole;
  action: string;
  module?: string;
  category?: string;
  ipAddress: string;
}

export interface OutletInfo {
  id: string;
  name: string;
  code: string;
  address: string;
  isPrimary: boolean;
}

export interface StoreSettings {
  storeName?: string;
  storeLegalName?: string;
  brandName?: string;
  gstin: string;
  address?: string;
  city?: string;
  phone?: string;
  supportEmail?: string;
  supportPhone?: string;
  receiptHeader?: string;
  receiptFooter?: string;
  receiptFooterNote?: string;
  metaApiStatus?: 'Live & Verified' | 'Pending' | 'Disconnected';
  autoSendWhatsapp?: boolean;
  outlets?: OutletInfo[];
}

export type CustomerTier = 'Silver' | 'Gold' | 'Black VIP' | string;

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Shirts' | 'Trousers' | 'Denim' | 'Jackets' | 'Knits';
  price: number;
  description: string;
  image: string;
  variants: ProductVariant[];
  swatches: { name: string; hex: string }[];
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Invoice {
  id: string;
  date: string;
  items: {
    name: string;
    variant: string;
    qty: number;
    price: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  coinsEarned: number;
  coinsRedeemed: number;
  whatsappStatus: 'Delivered' | 'Read' | 'Sent';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  tier: CustomerTier;
  totalSpend: number;
  coinsBalance: number;
  preferredFit: string; // e.g. "Size L / 34"
  preferredCategory: string;
  joinedDate: string;
  lastVisitDaysAgo: number;
  orderHistory: Invoice[];
}

export interface DeadStockItem {
  id: string;
  sku: string;
  name: string;
  variant: string;
  rackAgeDays: number;
  unitsLeft: number;
  pricePerUnit: number;
  idleCapital: number;
  targetCohort: string;
}

export interface CustomTierConfig {
  id: string;
  name: string;
  minSpend: number;
  cashbackPercentage: number;
  colorGradient: string; // e.g. 'from-slate-900 via-slate-800 to-black'
  badgeStyle: string; // e.g. 'bg-amber-400 text-slate-950'
  perks: string[];
}

export interface PassThemeConfig {
  cardGradient: string; // 'gold-noir' | 'tangerine-velvet' | 'emerald-luxe' | 'midnight-sapphire' | 'rose-gold'
  patternStyle: 'woven' | 'monogram' | 'geometric';
  cardTitle: string;
  accentColor: string;
}

export interface RedemptionConfig {
  maxRedeemPercentagePerBill: number; // e.g. 50%
  minCoinsThreshold: number; // e.g. 100
  coinsEarnMultiplier: number; // e.g. 1
}

export interface LoyaltyRules {
  cashbackPercentage: number; // default global fallback %
  pointExpiryDays: number; // e.g., 90
  silverThreshold: number; // ₹0
  goldThreshold: number; // ₹25,000
  blackVipThreshold: number; // ₹75,000
  pointsPerRupee: number; // 1 point = ₹1
  tiers: CustomTierConfig[];
  passTheme: PassThemeConfig;
  redemptionConfig: RedemptionConfig;
  welcomeMessageTemplate: string;
}

export interface CustomCohortFilter {
  sizeFilter?: string;
  idleDaysMin?: number;
  tierFilter?: string;
  categoryFilter?: string;
  minSpend?: number;
}

export interface CtaButton {
  id: string;
  label: string;
  type: 'reply' | 'url';
  value: string;
}

export interface CampaignTemplate {
  headerType: 'text' | 'image';
  headerImageUrl?: string;
  bodyText: string;
  ctaButtons: CtaButton[];
  couponCode?: string;
  discountValue?: string;
}

export interface CampaignCohort {
  id: string;
  name: string;
  description: string;
  estimatedReach: number;
  recommendedTemplate: string;
  customFilter?: CustomCohortFilter;
  templateConfig?: CampaignTemplate;
}

export interface BroadcastLog {
  id: string;
  date: string;
  cohortName: string;
  reachCount: number;
  openRate: string;
  templateUsed: string;
  status: 'Delivered' | 'Scheduled';
  revenueAttributed: number;
}

