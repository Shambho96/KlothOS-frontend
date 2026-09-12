import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Phone, 
  Crown, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ChevronRight,
  Receipt,
  MessageSquare,
  LayoutGrid,
  List,
  Eye
} from 'lucide-react';
import type { Customer, CustomTierConfig } from '../types';
import { Gsap3DTiltCard } from '../components/landing/Gsap3DTiltCard';

interface CustomersViewProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  customTiers: CustomTierConfig[];
  onSelectCustomer: (customer: Customer) => void;
  onOpenReceipt: (invoiceId: string) => void;
  onCreateCustomTier: (newTier: CustomTierConfig) => void;
  onDeleteCustomTier: (tierId: string) => void;
  onUpdateCustomerTier: (customerId: string, newTierName: string) => void;
}

const COLOR_PRESETS = [
  {
    name: 'Gold Premium',
    gradient: 'from-amber-400 via-amber-500 to-amber-700',
    badge: 'bg-amber-400 text-slate-950 font-bold',
    accentHex: '#f59e0b'
  },
  {
    name: 'Platinum Elite',
    gradient: 'from-cyan-500 via-sky-600 to-indigo-700',
    badge: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold shadow-xs',
    accentHex: '#06b6d4'
  },
  {
    name: 'Black VIP',
    gradient: 'from-slate-950 via-slate-900 to-black',
    badge: 'bg-slate-950 text-white font-extrabold border border-slate-700',
    accentHex: '#0f172a'
  },
  {
    name: 'Emerald Luxe',
    gradient: 'from-emerald-600 via-teal-700 to-slate-900',
    badge: 'bg-emerald-500 text-white font-extrabold shadow-xs',
    accentHex: '#10b981'
  },
  {
    name: 'Royal Purple',
    gradient: 'from-purple-600 via-indigo-700 to-slate-900',
    badge: 'bg-purple-600 text-white font-extrabold shadow-xs',
    accentHex: '#8b5cf6'
  },
  {
    name: 'Crimson Velvet',
    gradient: 'from-rose-600 via-red-700 to-slate-950',
    badge: 'bg-rose-600 text-white font-extrabold shadow-xs',
    accentHex: '#f43f5e'
  },
  {
    name: 'Silver Classic',
    gradient: 'from-slate-600 to-slate-800',
    badge: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-bold',
    accentHex: '#64748b'
  }
];

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  customTiers,
  onCreateCustomTier,
  onDeleteCustomTier
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'tiers'>('directory');
  const [viewFormat, setViewFormat] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [activeCustomerDetail, setActiveCustomerDetail] = useState<Customer | null>(customers[0] || null);
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);

  // Form State for Tier creation
  const [newTierName, setNewTierName] = useState<string>('');
  const [newMinSpend, setNewMinSpend] = useState<string>('50000');
  const [newCashback, setNewCashback] = useState<string>('8');
  const [selectedPresetIdx] = useState<number>(0);

  const getTierBadgeStyle = (tierName: string) => {
    const found = customTiers.find(t => t.name.toLowerCase() === tierName.toLowerCase());
    if (found?.badgeStyle) return found.badgeStyle;

    if (tierName === 'Black VIP') return 'bg-slate-950 text-white font-extrabold border border-slate-700';
    if (tierName === 'Gold') return 'bg-amber-400 text-slate-950 font-bold';
    return 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-bold';
  };

  const filteredCustomers = customers.filter(cust => {
    const matchesSearch = 
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone.includes(searchQuery) ||
      cust.preferredCategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = tierFilter === 'All' || cust.tier === tierFilter || (tierFilter === 'Top 1% Spend' && cust.totalSpend >= 100000);
    return matchesSearch && matchesTier;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTierName.trim()) return;

    const preset = COLOR_PRESETS[selectedPresetIdx];
    const newTier: CustomTierConfig = {
      id: `tier-${Date.now()}`,
      name: newTierName.trim(),
      minSpend: parseFloat(newMinSpend) || 0,
      cashbackPercentage: parseFloat(newCashback) || 5,
      colorGradient: preset.gradient,
      badgeStyle: preset.badge,
      perks: ['Free alterations', 'Early drop access']
    };

    onCreateCustomTier(newTier);
    setNewTierName('');
    setShowCreateModal(false);
  };

  const handleResendReceipt = () => {
    setResendSuccess(true);
    setTimeout(() => {
      setResendSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-16 text-foreground">
      
      {/* HEADER & TOP CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Users size={22} className="text-primary" /> VIP Customer CRM & Loyalty Directory
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage customer lifetime spend, reward coin balances, and tiered membership rules.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-border shrink-0">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'directory'
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Customer Directory
          </button>
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'tiers'
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Membership Tier Rules
          </button>
        </div>
      </div>

      {/* DIRECTORY VIEW */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          
          {/* SEARCH, SMART FILTERS & GRID/LIST VIEW TOGGLE */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-2xs">
            
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, phone (+91), or preferred clothing size..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
              
              {/* Category & Tier Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {['All', 'Black VIP', 'Gold', 'Silver', 'Top 1% Spend'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTierFilter(tf)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      tierFilter === tf
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* GRID vs LIST TABLE VIEW TOGGLE */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border shrink-0">
                <button
                  onClick={() => setViewFormat('grid')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewFormat === 'grid'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="3D Card Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewFormat('table')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewFormat === 'table'
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Data Table / List View"
                >
                  <List size={15} />
                </button>
              </div>

            </div>

          </div>

          {/* MAIN SIDE-BY-SIDE SPLIT LAYOUT CONTAINER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: DIRECTORY LIST / GRID (COL 7 or 12) */}
            <div className={`transition-all duration-300 ${activeCustomerDetail ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
              
              {/* GRID VIEW FORMAT */}
              {viewFormat === 'grid' && (
                <div className={`grid gap-4 ${activeCustomerDetail ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                  {filteredCustomers.map((cust) => {
                    const isSelected = activeCustomerDetail?.id === cust.id;
                    return (
                      <Gsap3DTiltCard key={cust.id} maxRotation={8} glowColor="rgba(216, 121, 67, 0.15)">
                        <div
                          onClick={() => setActiveCustomerDetail(cust)}
                          className={`bg-card border rounded-3xl p-5 shadow-lg space-y-4 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden ${
                            isSelected ? 'border-primary ring-2 ring-primary/30 bg-primary/5' : 'border-border'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-border/60 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                {cust.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-extrabold text-sm text-foreground">{cust.name}</h3>
                                <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                                  <Phone size={10} /> {cust.phone}
                                </div>
                              </div>
                            </div>

                            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase ${getTierBadgeStyle(cust.tier)}`}>
                              {cust.tier}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <div className="p-2.5 rounded-2xl bg-background border border-border">
                              <div className="text-[10px] text-muted-foreground">Spend</div>
                              <div className="text-sm font-extrabold text-foreground mt-0.5">
                                ₹{cust.totalSpend.toLocaleString('en-IN')}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-2xl bg-background border border-border">
                              <div className="text-[10px] text-muted-foreground">Coins</div>
                              <div className="text-sm font-extrabold text-primary mt-0.5">
                                {cust.coinsBalance}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-muted-foreground text-[11px]">Fit: <strong className="text-foreground">{cust.preferredFit}</strong></span>
                            <button className="text-primary font-bold hover:underline flex items-center gap-1 text-xs">
                              {isSelected ? 'Viewing Side-by-Side' : 'View Side-by-Side'} <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </Gsap3DTiltCard>
                    );
                  })}
                </div>
              )}

              {/* LIST / DATA TABLE VIEW FORMAT */}
              {viewFormat === 'table' && (
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-muted/50 border-b border-border/80 text-muted-foreground font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="p-4">Customer Name</th>
                          <th className="p-4">Phone Number</th>
                          <th className="p-4">Tier</th>
                          <th className="p-4 text-right">Spend</th>
                          <th className="p-4 text-right">Coins</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {filteredCustomers.map((cust) => {
                          const isSelected = activeCustomerDetail?.id === cust.id;
                          return (
                            <tr
                              key={cust.id}
                              onClick={() => setActiveCustomerDetail(cust)}
                              className={`transition-colors cursor-pointer ${
                                isSelected ? 'bg-primary/10 font-bold' : 'hover:bg-muted/40'
                              }`}
                            >
                              <td className="p-4 font-bold text-foreground flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                                  {cust.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span>{cust.name}</span>
                              </td>
                              <td className="p-4 text-muted-foreground">{cust.phone}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase ${getTierBadgeStyle(cust.tier)}`}>
                                  {cust.tier}
                                </span>
                              </td>
                              <td className="p-4 text-right font-extrabold text-foreground">₹{cust.totalSpend.toLocaleString('en-IN')}</td>
                              <td className="p-4 text-right font-extrabold text-primary">{cust.coinsBalance} Coins</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveCustomerDetail(cust);
                                  }}
                                  className={`p-1.5 rounded-xl transition-all ${
                                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
                                  }`}
                                  title="View Side-by-Side Details"
                                >
                                  <Eye size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: STICKY SIDE-BY-SIDE CUSTOMER DETAIL PANEL (COL 5) */}
            <AnimatePresence>
              {activeCustomerDetail && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="lg:col-span-5 sticky top-20 bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-6 text-foreground"
                >
                  {/* PANEL HEADER WITH CLOSE BUTTON */}
                  <div className="flex items-start justify-between border-b border-border pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-extrabold text-lg">
                        {activeCustomerDetail.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-extrabold">{activeCustomerDetail.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase ${getTierBadgeStyle(activeCustomerDetail.tier)}`}>
                            {activeCustomerDetail.tier}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone size={11} /> {activeCustomerDetail.phone}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveCustomerDetail(null)}
                      className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
                      title="Close Side-by-Side Panel"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* LTV & COIN BALANCE CARDS */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3.5 rounded-2xl bg-background border border-border space-y-1">
                      <div className="text-muted-foreground text-[10px]">Total Lifetime Value</div>
                      <div className="text-lg font-extrabold text-foreground">
                        ₹{activeCustomerDetail.totalSpend.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-background border border-border space-y-1">
                      <div className="text-muted-foreground text-[10px]">Reward Coin Balance</div>
                      <div className="text-lg font-extrabold text-primary">
                        {activeCustomerDetail.coinsBalance} Coins
                      </div>
                    </div>
                  </div>

                  {/* CUSTOMER PREFERENCES */}
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Preferred Fit & Size:</span>
                      <strong className="text-foreground font-mono">{activeCustomerDetail.preferredFit}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Favorite Category:</span>
                      <strong className="text-foreground font-mono">{activeCustomerDetail.preferredCategory}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since:</span>
                      <span className="text-foreground font-mono">{activeCustomerDetail.joinedDate}</span>
                    </div>
                  </div>

                  {/* PURCHASE HISTORY LEDGER */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Receipt size={14} className="text-primary" /> Purchase & Invoice Ledger
                    </h4>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {activeCustomerDetail.orderHistory.length === 0 ? (
                        <div className="p-3 rounded-xl bg-background border border-border text-center text-xs text-muted-foreground font-mono">
                          Invoice #KL-9402 • ₹12,440 • Delivered ✓
                        </div>
                      ) : (
                        activeCustomerDetail.orderHistory.map((order) => (
                          <div
                            key={order.id}
                            className="p-3 rounded-xl bg-background border border-border flex items-center justify-between text-xs font-mono"
                          >
                            <div>
                              <div className="font-bold text-foreground">{order.id}</div>
                              <div className="text-[10px] text-muted-foreground">{order.date}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-primary">₹{order.total.toLocaleString('en-IN')}</div>
                              <div className="text-[10px] text-emerald-600">WhatsApp Sent ✓</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* RESEND RECEIPT BUTTON */}
                  {resendSuccess ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold font-mono text-center flex items-center justify-center gap-2">
                      <Check size={16} /> WhatsApp Bill Resent Successfully!
                    </div>
                  ) : (
                    <button
                      onClick={handleResendReceipt}
                      className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageSquare size={14} />
                      <span>Resend WhatsApp Receipt PDF</span>
                    </button>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      )}

      {/* MEMBERSHIP TIERS CONFIGURATION VIEW */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-card p-4 rounded-2xl border border-border">
            <div>
              <h3 className="font-extrabold text-sm text-foreground">Configured Loyalty Tiers</h3>
              <p className="text-xs text-muted-foreground">Automatic tier escalation based on store spending thresholds</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Create Custom Tier
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customTiers.map((tier) => (
              <div
                key={tier.id}
                className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden"
              >
                <div className={`h-24 rounded-2xl bg-gradient-to-r ${tier.colorGradient || 'from-slate-900 to-black'} p-4 flex flex-col justify-between text-white shadow-md`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold tracking-widest uppercase">KlothOS VIP</span>
                    <Crown size={18} />
                  </div>
                  <div className="font-extrabold text-lg">{tier.name}</div>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Minimum Store Spend:</span>
                    <span className="font-bold text-foreground">₹{tier.minSpend.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Cashback Reward Rate:</span>
                    <span className="font-bold text-primary">{tier.cashbackPercentage}% Coins</span>
                  </div>
                </div>

                {tier.id.startsWith('tier-') && (
                  <button
                    onClick={() => onDeleteCustomTier(tier.id)}
                    className="w-full py-2 rounded-xl bg-destructive/10 text-destructive font-bold text-xs hover:bg-destructive/20 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={12} /> Delete Tier Rule
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE TIER MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-5 text-foreground"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold">Create Loyalty Tier Rule</h3>
                <p className="text-xs text-muted-foreground">Define spend threshold & reward coin percentage</p>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold">Tier Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diamond VIP"
                    value={newTierName}
                    onChange={(e) => setNewTierName(e.target.value)}
                    className="w-full p-2.5 bg-input border border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold">Min Spend (₹)</label>
                    <input
                      type="number"
                      required
                      value={newMinSpend}
                      onChange={(e) => setNewMinSpend(e.target.value)}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold">Reward Rate (%)</label>
                    <input
                      type="number"
                      required
                      value={newCashback}
                      onChange={(e) => setNewCashback(e.target.value)}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl border border-border font-semibold hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:opacity-90"
                  >
                    Create Tier
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
