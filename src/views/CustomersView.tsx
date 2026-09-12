import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Phone, 
  CheckCheck, 
  FileText,
  Crown,
  Plus,
  Trash2,
  Sparkles,
  Award,
  Check,
  X,
  ChevronRight
} from 'lucide-react';
import type { Customer, CustomTierConfig } from '../types';

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
  selectedCustomer,
  customTiers,
  onSelectCustomer,
  onOpenReceipt,
  onCreateCustomTier,
  onDeleteCustomTier,
  onUpdateCustomerTier
}) => {
  const [activeTab, setActiveTab] = useState<'directory' | 'tiers'>('directory');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Custom Tier Form State
  const [newTierName, setNewTierName] = useState<string>('');
  const [newMinSpend, setNewMinSpend] = useState<string>('50000');
  const [newCashback, setNewCashback] = useState<string>('8');
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);

  // Helper to get badge style for any tier
  const getTierBadgeStyle = (tierName: string) => {
    const found = customTiers.find(t => t.name.toLowerCase() === tierName.toLowerCase());
    if (found?.badgeStyle) return found.badgeStyle;
    if (tierName === 'Black VIP') return 'bg-slate-950 text-white font-extrabold border border-slate-700';
    if (tierName === 'Gold') return 'bg-amber-400 text-slate-950 font-bold';
    if (tierName === 'Silver') return 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100 font-semibold';
    return 'bg-primary/20 text-primary font-bold';
  };

  // Filter customers
  const filteredCustomers = customers.filter(c => {
    const matchesTier = tierFilter === 'All' || c.tier.toLowerCase() === tierFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.preferredFit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const activeCust = selectedCustomer || (filteredCustomers.length > 0 ? filteredCustomers[0] : customers[0]);

  // Submit custom tier
  const handleSaveTierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameStr = newTierName.trim() || 'Custom Tier';
    const spendNum = parseFloat(newMinSpend) || 0;
    const cashbackNum = parseFloat(newCashback) || 5;
    const preset = COLOR_PRESETS[selectedPresetIdx];

    const newTierObj: CustomTierConfig = {
      id: `tier-${Date.now()}`,
      name: nameStr,
      minSpend: spendNum,
      cashbackPercentage: cashbackNum,
      colorGradient: preset.gradient,
      badgeStyle: preset.badge,
      perks: [`${cashbackNum}% Coins Cashback`, 'Paperless WhatsApp Receipts', 'Digital Member Pass']
    };

    onCreateCustomTier(newTierObj);
    setShowCreateModal(false);
    setNewTierName('');
    setNewMinSpend('50000');
    setNewCashback('8');
    setSelectedPresetIdx(0);
  };

  return (
    <div className="space-y-4">
      
      {/* TOP ACTION HEADER & TABS BAR */}
      <div className="bg-card p-4 rounded-2xl border border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-secondary/60 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users size={15} className="text-primary" />
            Customer Roster ({customers.length})
          </button>
          
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tiers'
                ? 'bg-card text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Crown size={15} className="text-amber-500" />
            Custom Tiers & Loyalty ({customTiers.length})
          </button>
        </div>

        {/* Action Button: Create Tier */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={15} /> Create Custom Tier
          </button>
        </div>
      </div>

      {/* TAB 1: CUSTOMER DIRECTORY VIEW */}
      {activeTab === 'directory' && (
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:h-[calc(100vh-11rem)] h-auto">
          
          {/* LEFT SIDE (60% width): Directory Table */}
          <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-5 flex flex-col justify-between space-y-4 shadow-xs overflow-hidden">
            
            {/* Filter Controls */}
            <div className="space-y-3 pb-3 border-b border-border">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search name, phone (+91...), size preference..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                {/* Tier Filter Pills */}
                <div className="flex items-center gap-1 shrink-0 bg-secondary p-1 rounded-xl overflow-x-auto max-w-full scrollbar-none">
                  <button
                    onClick={() => setTierFilter('All')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      tierFilter === 'All'
                        ? 'bg-card text-foreground shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All ({customers.length})
                  </button>
                  {customTiers.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTierFilter(t.name)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap ${
                        tierFilter.toLowerCase() === t.name.toLowerCase()
                          ? 'bg-card text-foreground shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Directory Table */}
            <div className="flex-1 overflow-x-auto overflow-y-auto pr-1">
              <table className="w-full text-xs text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider sticky top-0 bg-card z-10">
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3">Fit Size</th>
                    <th className="py-2.5 px-3">Total Spend</th>
                    <th className="py-2.5 px-3 text-right">Coins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCustomers.map((cust) => {
                    const isSelected = activeCust?.id === cust.id;
                    const badgeClass = getTierBadgeStyle(cust.tier);

                    return (
                      <tr
                        key={cust.id}
                        onClick={() => onSelectCustomer(cust)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-primary/10 font-medium'
                            : 'hover:bg-secondary/40'
                        }`}
                      >
                        {/* Name & Phone */}
                        <td className="py-3 px-3">
                          <p className="font-bold text-foreground">{cust.name}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">{cust.phone}</p>
                        </td>

                        {/* Custom Tier Badge */}
                        <td className="py-3 px-3">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full inline-block ${badgeClass}`}>
                            {cust.tier}
                          </span>
                        </td>

                        {/* Preferred Fit */}
                        <td className="py-3 px-3 font-semibold text-foreground">
                          {cust.preferredFit}
                        </td>

                        {/* Total Spend */}
                        <td className="py-3 px-3 font-mono font-bold text-foreground">
                          ₹{cust.totalSpend.toLocaleString('en-IN')}
                        </td>

                        {/* Coins */}
                        <td className="py-3 px-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                          {cust.coinsBalance.toLocaleString('en-IN')} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT SIDE (40% width): Customer Profile Drawer & Tier Switcher */}
          {activeCust ? (
            <div className="lg:col-span-5 bg-card rounded-2xl border border-border p-5 flex flex-col shadow-xs overflow-y-auto space-y-6">
              
              {/* Profile Header */}
              <div className="space-y-4 pb-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-black text-lg flex items-center justify-center shadow-md">
                      {activeCust.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground leading-tight">{activeCust.name}</h3>
                      <p className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <Phone size={12} /> {activeCust.phone}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full ${getTierBadgeStyle(activeCust.tier)}`}>
                    {activeCust.tier}
                  </span>
                </div>

                {/* Tier Switcher Dropdown */}
                <div className="bg-secondary/60 p-3 rounded-xl border border-border space-y-1.5">
                  <label className="text-[10px] text-muted-foreground uppercase font-bold flex items-center justify-between">
                    <span>Assign Loyalty Tier</span>
                    <Crown size={12} className="text-amber-500" />
                  </label>
                  <select
                    value={activeCust.tier}
                    onChange={(e) => onUpdateCustomerTier(activeCust.id, e.target.value)}
                    className="w-full bg-input border border-border rounded-lg px-2.5 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                  >
                    {customTiers.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} (Min ₹{t.minSpend.toLocaleString('en-IN')} - {t.cashbackPercentage}% Coins)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fit Preferences & Category Pill */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-accent/40 p-3 rounded-xl border border-accent text-xs">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Preferred Fit & Size
                    </span>
                    <span className="font-bold text-accent-foreground text-sm">
                      {activeCust.preferredFit}
                    </span>
                  </div>

                  <div className="bg-secondary p-3 rounded-xl border border-border text-xs">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                      Category Affinity
                    </span>
                    <span className="font-bold text-foreground text-xs">
                      {activeCust.preferredCategory}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Metrics Summary */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-muted/50 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-muted-foreground block">Lifetime Spend</span>
                  <span className="font-mono font-bold text-foreground">₹{activeCust.totalSpend.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Coins Balance</span>
                  <span className="font-mono font-bold text-amber-600">₹{activeCust.coinsBalance}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">Last Visit</span>
                  <span className="font-bold text-foreground">{activeCust.lastVisitDaysAgo}d ago</span>
                </div>
              </div>

              {/* Order History Timeline */}
              <div className="space-y-3 flex-1">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText size={14} className="text-primary" /> WhatsApp Purchase History ({activeCust.orderHistory.length})
                </h4>

                <div className="space-y-3">
                  {activeCust.orderHistory.map((invoice) => (
                    <div 
                      key={invoice.id} 
                      onClick={() => onOpenReceipt(invoice.id)}
                      className="bg-secondary/40 p-3.5 rounded-xl border border-border space-y-2 text-xs hover:border-primary/40 transition-colors cursor-pointer"
                      title="Click to view WhatsApp digital invoice"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="font-mono text-primary flex items-center gap-1">
                          <FileText size={13} /> {invoice.id}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          <CheckCheck size={12} /> {invoice.whatsappStatus}
                        </span>
                      </div>

                      <p className="text-[10px] text-muted-foreground font-mono">{invoice.date}</p>

                      {/* Items List */}
                      <div className="space-y-1 text-[11px] border-t border-b border-border/60 py-2">
                        {invoice.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-foreground">
                            <span>{item.name} ({item.variant})</span>
                            <span className="font-mono font-semibold">₹{item.price.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-muted-foreground text-[10px]">
                          +{invoice.coinsEarned} coins earned
                        </span>
                        <span className="font-mono font-bold text-foreground">
                          Total: ₹{invoice.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="lg:col-span-5 bg-card rounded-2xl border border-border p-8 flex flex-col items-center justify-center text-center text-muted-foreground">
              <Users size={36} className="opacity-30 mb-2" />
              <p className="font-bold text-sm">Select a customer from the roster</p>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: CUSTOM TIER MANAGEMENT & BUILDER */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-700">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Crown className="text-amber-400" size={24} />
                <h2 className="text-xl font-black tracking-tight">Custom Loyalty Tiers Architecture</h2>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl">
                Configure personalized membership tiers according to your store strategy. Set spend thresholds, cashback multipliers, badge visual themes, and WhatsApp pass privileges.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-300 transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus size={16} /> Create Custom Tier
            </button>
          </div>

          {/* Tier Cards Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customTiers.map((tier) => {
              const memberCount = customers.filter(c => c.tier.toLowerCase() === tier.name.toLowerCase()).length;
              const isStandard = ['Silver', 'Gold', 'Black VIP'].includes(tier.name);

              return (
                <div 
                  key={tier.id}
                  className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  {/* Card Top Header */}
                  <div className={`p-5 bg-gradient-to-r ${tier.colorGradient || 'from-slate-800 to-slate-900'} text-white space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-3 py-1 rounded-full ${tier.badgeStyle}`}>
                        {tier.name}
                      </span>
                      <span className="text-[11px] bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-mono font-bold">
                        {memberCount} Active Member{memberCount === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-white/80 font-medium">Minimum Spend Required</p>
                      <p className="text-2xl font-black font-mono">₹{tier.minSpend.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Card Body: Specs & Perks */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      
                      {/* Specs Pill */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-secondary/60 p-2.5 rounded-xl border border-border text-center">
                          <span className="text-[10px] text-muted-foreground block font-bold">Cashback Rate</span>
                          <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                            {tier.cashbackPercentage}% Coins
                          </span>
                        </div>
                        <div className="bg-secondary/60 p-2.5 rounded-xl border border-border text-center">
                          <span className="text-[10px] text-muted-foreground block font-bold">Privilege Pass</span>
                          <span className="font-bold text-foreground text-xs">WhatsApp VIP</span>
                        </div>
                      </div>

                      {/* Perks List */}
                      <div className="space-y-1.5 pt-2">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Award size={12} className="text-primary" /> Included Privileges
                        </p>
                        <ul className="space-y-1 text-xs">
                          {tier.perks.map((perk, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-foreground/90">
                              <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <button
                        onClick={() => {
                          setTierFilter(tier.name);
                          setActiveTab('directory');
                        }}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        View Members ({memberCount}) <ChevronRight size={14} />
                      </button>

                      {!isStandard && (
                        <button
                          onClick={() => onDeleteCustomTier(tier.id)}
                          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Delete Custom Tier"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* CREATE CUSTOM TIER MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Top Bar */}
              <div className="bg-primary text-primary-foreground px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown size={20} className="text-amber-300" />
                  <h3 className="font-bold text-base">Create Custom Loyalty Tier</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-primary-foreground transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSaveTierSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
                
                {/* Live Card Preview */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={13} className="text-amber-500" /> Live Member Card & Badge Preview
                  </label>
                  
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${COLOR_PRESETS[selectedPresetIdx].gradient} text-white shadow-lg space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-3 py-0.5 rounded-full ${COLOR_PRESETS[selectedPresetIdx].badge}`}>
                        {newTierName.trim() || 'Tier Name Preview'}
                      </span>
                      <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full">
                        WhatsApp VIP Pass
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <p className="text-[10px] text-white/70 font-semibold uppercase">Spend Requirement</p>
                        <p className="text-lg font-bold font-mono">
                          ₹{(parseFloat(newMinSpend) || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/70 font-semibold uppercase">Cashback Rate</p>
                        <p className="text-lg font-bold font-mono text-amber-300">
                          {newCashback || '0'}% Coins
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid Inputs: Tier Name, Spend, Cashback */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Tier Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Tier Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Diamond VIP"
                      value={newTierName}
                      onChange={(e) => setNewTierName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring font-semibold"
                    />
                  </div>

                  {/* Min Spend */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Min Spend (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1000"
                      placeholder="e.g. 50000"
                      value={newMinSpend}
                      onChange={(e) => setNewMinSpend(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring font-mono font-bold"
                    />
                  </div>

                  {/* Cashback % */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Cashback Coins %</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="30"
                      step="0.5"
                      placeholder="e.g. 8"
                      value={newCashback}
                      onChange={(e) => setNewCashback(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Color Palette Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground block">
                    Choose Visual Theme & Badge Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {COLOR_PRESETS.map((preset, idx) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setSelectedPresetIdx(idx)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                          selectedPresetIdx === idx
                            ? 'border-primary ring-2 ring-primary/20 bg-accent/40'
                            : 'border-border bg-secondary/40 hover:bg-secondary'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full shrink-0 shadow-2xs" 
                          style={{ backgroundColor: preset.accentHex }}
                        />
                        <span className="text-[11px] font-bold text-foreground truncate">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>



                {/* Footer Buttons */}
                <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-secondary text-secondary-foreground font-bold text-xs rounded-xl hover:bg-muted transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:opacity-95 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check size={16} /> Save Custom Tier
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
