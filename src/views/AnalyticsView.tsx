import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ArrowUpRight, 
  DollarSign, 
  Sparkles,
  BarChart3,
  Store,
  Send,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import type { DeadStockItem, ViewMode } from '../types';

interface AnalyticsViewProps {
  deadStockItems?: DeadStockItem[];
  onTriggerClearance?: (item: DeadStockItem) => void;
  onSelectView?: (view: ViewMode) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onSelectView }) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'quarter'>('7d');
  const [selectedOutlet, setSelectedOutlet] = useState<'bandra' | 'juhu' | 'indiranagar'>('bandra');
  const [clearanceModalItem, setClearanceModalItem] = useState<{ size: string; category: string; days: number; count: number } | null>(null);
  const [campaignSuccess, setCampaignSuccess] = useState<boolean>(false);

  // Weekly Revenue Trend Mock Data
  const weeklyData = [
    { day: 'Mon', revenue: 54200, walkins: 160, buyers: 112 },
    { day: 'Tue', revenue: 62800, walkins: 185, buyers: 128 },
    { day: 'Wed', revenue: 48900, walkins: 142, buyers: 98 },
    { day: 'Thu', revenue: 74500, walkins: 210, buyers: 152 },
    { day: 'Fri', revenue: 89100, walkins: 260, buyers: 184 },
    { day: 'Sat', revenue: 105400, walkins: 315, buyers: 218 },
    { day: 'Sun', revenue: 52300, walkins: 148, buyers: 90 },
  ];

  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue));

  // Category Sales Breakdown
  const categoryBreakdown = [
    { name: 'Shirts', revenue: 168200, percentage: 34.7, color: 'bg-primary' },
    { name: 'Trousers', revenue: 142800, percentage: 29.5, color: 'bg-amber-500' },
    { name: 'Denim', revenue: 89400, percentage: 18.5, color: 'bg-sky-500' },
    { name: 'Jackets', revenue: 56200, percentage: 11.6, color: 'bg-emerald-500' },
    { name: 'Knits', revenue: 27600, percentage: 5.7, color: 'bg-purple-500' },
  ];

  const handleLaunchClearance = () => {
    setCampaignSuccess(true);
    setTimeout(() => {
      setCampaignSuccess(false);
      setClearanceModalItem(null);
      if (onSelectView) {
        onSelectView('campaign');
      }
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16 text-foreground">
      
      {/* HEADER & OUTLET / TIMEFRAME SELECTORS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <TrendingUp size={22} className="text-primary" /> Store Intelligence & Revenue Analytics
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time walk-in conversion, attributed revenue, and garment category analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Outlet Switcher */}
          <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-border">
            <Store size={14} className="text-primary ml-2" />
            <select
              value={selectedOutlet}
              onChange={(e) => setSelectedOutlet(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-foreground outline-none cursor-pointer pr-2"
            >
              <option value="bandra">Bandra West Store</option>
              <option value="juhu">Juhu Studio</option>
              <option value="indiranagar">Indiranagar Outlet</option>
            </select>
          </div>

          {/* Timeframe Filter Pills */}
          <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-border shrink-0">
            {(['7d', '30d', 'quarter'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  timeframe === t
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === '7d' ? '7 Days' : t === '30d' ? '30 Days' : 'Quarter'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 CORE KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-3 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Total Store Revenue</span>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-extrabold text-foreground">₹4,87,200</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight size={14} />
              <span>+14.8% vs last week</span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/60">
            WhatsApp Receipt Revenue: <strong className="text-foreground font-mono">₹3,92,400</strong>
          </div>
        </div>

        {/* Card 2: Walk-In Conversion Rate */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-3 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Checkout Conversion</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-extrabold text-foreground">68.4%</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight size={14} />
              <span>+5.2% vs last week</span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/60">
            Avg Checkout Speed: <strong className="text-foreground font-mono">0.8 Seconds</strong>
          </div>
        </div>

        {/* Card 3: Deadstock Recovered */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-3 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Deadstock Recovered</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
              <BarChart3 size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-extrabold text-foreground">₹1,42,500</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight size={14} />
              <span>+38% Liquidation Lift</span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/60">
            Slow Sizes Cleared: <strong className="text-foreground font-mono">42 Garments</strong>
          </div>
        </div>

        {/* Card 4: VIP Retention Rate */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-3 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">VIP Customer Loyalty</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-extrabold text-foreground">42.8%</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight size={14} />
              <span>+8.1% Repeat Shoppers</span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/60">
            Reward Coins Issued: <strong className="text-foreground font-mono">24,350 Coins</strong>
          </div>
        </div>

      </div>

      {/* CHARTS & CATEGORY BREAKDOWN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT (7 cols): Revenue Trend Chart */}
        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-foreground">Revenue & Walk-In Traffic</h3>
              <p className="text-xs text-muted-foreground">Daily store performance over past 7 days</p>
            </div>
            <span className="text-xs font-mono text-primary font-bold">Peak: Sat (₹1.05L)</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-border pb-2">
            {weeklyData.map((d) => {
              const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div
                    className="w-full bg-primary/80 group-hover:bg-primary rounded-t-xl transition-all relative"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-background border border-border px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-md transition-opacity pointer-events-none">
                      ₹{d.revenue.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground font-bold">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT (5 cols): Category Revenue Share */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 shadow-xl space-y-5">
          <div className="border-b border-border/60 pb-3">
            <h3 className="text-base font-extrabold text-foreground">Category Revenue Share</h3>
            <p className="text-xs text-muted-foreground">Sales breakdown by garment type</p>
          </div>

          <div className="space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">{cat.name}</span>
                  <span className="font-mono text-muted-foreground">₹{cat.revenue.toLocaleString('en-IN')} ({cat.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color}`} style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 1-CLICK DEADSTOCK CLEARANCE MODAL */}
      <AnimatePresence>
        {clearanceModalItem && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-5 text-foreground"
            >
              <button
                onClick={() => setClearanceModalItem(null)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary"
              >
                <X size={18} />
              </button>

              <div className="space-y-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/30 flex items-center justify-center mx-auto">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-extrabold">Clear Deadstock Size</h3>
                <p className="text-xs text-muted-foreground">
                  Target <span className="font-bold text-foreground">{clearanceModalItem.category} ({clearanceModalItem.size})</span> sitting for {clearanceModalItem.days} days
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border space-y-2 text-xs font-mono">
                <div className="flex justify-between text-muted-foreground">
                  <span>Slow Stock Units:</span>
                  <span className="font-bold text-foreground">{clearanceModalItem.count} Garments</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Target WhatsApp Audience:</span>
                  <span className="font-bold text-primary">142 Past Buyers of {clearanceModalItem.size}</span>
                </div>
                <div className="flex justify-between text-emerald-600 pt-2 border-t border-border">
                  <span>Recommended Clearance Offer:</span>
                  <span className="font-bold">20% OFF Voucher</span>
                </div>
              </div>

              {campaignSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold text-center flex items-center justify-center gap-2 font-mono">
                  <CheckCircle2 size={16} /> Campaign Dispatched on WhatsApp!
                </div>
              ) : (
                <button
                  onClick={handleLaunchClearance}
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={16} />
                  <span>Launch WhatsApp Clearance Campaign</span>
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
