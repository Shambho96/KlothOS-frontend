import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  DollarSign, 
  Sparkles,
  UserCheck,
  Percent
} from 'lucide-react';
import type { DeadStockItem, ViewMode } from '../types';

interface AnalyticsViewProps {
  deadStockItems?: DeadStockItem[];
  onTriggerClearance?: (item: DeadStockItem) => void;
  onSelectView?: (view: ViewMode) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'quarter'>('7d');
  const [hoveredDataIndex, setHoveredDataIndex] = useState<number | null>(null);

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

  return (
    <div className="space-y-8 pb-16">
      
      {/* HEADER & TIMEFRAME SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <TrendingUp size={22} className="text-primary" /> Store Intelligence & Visitor Revenue
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time walk-in conversion, attributed revenue, and garment category analytics.
          </p>
        </div>

        {/* Timeframe Filter Pills */}
        <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-border shrink-0 self-start sm:self-auto">
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
              {t === '7d' ? 'Last 7 Days' : t === '30d' ? 'Last 30 Days' : 'This Quarter'}
            </button>
          ))}
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
            <p className="font-mono text-2xl font-black text-foreground">₹4,87,200</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight size={14} />
              <span>+14.8% vs last week</span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/60">
            Attributed WhatsApp Revenue: <strong className="text-foreground font-mono">₹3,92,400</strong>
          </div>
        </div>

        {/* Card 2: Total Walk-in Visitors */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-3 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Store Walk-in Visitors</span>
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <Users size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-black text-foreground">1,420</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight size={14} />
              <span>+8.2% footfall surge</span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/60">
            Avg Daily Footfall: <strong className="text-foreground font-mono">203 shoppers/day</strong>
          </div>
        </div>

        {/* Card 3: Total Paying Customers */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-3 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Paying Customers</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-black text-foreground">982</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <Percent size={13} />
              <span>69.1% Conversion Rate</span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/60">
            Repeat Walk-in Buyers: <strong className="text-foreground font-mono">375 (38.2%)</strong>
          </div>
        </div>

        {/* Card 4: Average Cart Value */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-3 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Average Order Value</span>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-black text-foreground">₹4,960</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
              <Sparkles size={13} />
              <span>2.3 items / checkout</span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/60">
            Highest Basket: <strong className="text-foreground font-mono">₹18,499 (VIP Kabir)</strong>
          </div>
        </div>

      </div>

      {/* REVENUE GRAPH & CONVERSION FUNNEL SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT GRAPH (65% width): Interactive Daily Revenue Trend */}
        <div className="lg:col-span-8 bg-card rounded-3xl p-6 border border-border shadow-xs space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                Daily Revenue Performance
              </h3>
              <p className="text-xs text-muted-foreground">Daily sales breakdown in ₹ Rupees</p>
            </div>
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              Peak Day: Saturday (₹1.05L)
            </span>
          </div>

          {/* SVG Bar Chart with Hover Tooltips */}
          <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 relative border-b border-border">
            {weeklyData.map((d, index) => {
              const heightPercent = (d.revenue / maxRevenue) * 100;
              const isHovered = hoveredDataIndex === index;

              return (
                <div 
                  key={d.day}
                  onMouseEnter={() => setHoveredDataIndex(index)}
                  onMouseLeave={() => setHoveredDataIndex(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] font-mono px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap pointer-events-none border border-slate-700"
                    >
                      <span className="font-bold text-primary">{d.day}:</span> ₹{d.revenue.toLocaleString('en-IN')} ({d.buyers} buyers)
                    </motion.div>
                  )}

                  {/* Animated Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`w-full max-w-[48px] rounded-t-xl transition-all ${
                      isHovered ? 'bg-primary shadow-lg scale-105' : 'bg-primary/80 hover:bg-primary'
                    }`}
                  />
                  
                  <span className="text-xs font-bold text-muted-foreground mt-3 group-hover:text-primary transition-colors">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <span>Total 7-Day Revenue: <strong className="font-mono text-foreground font-bold">₹4,94,800</strong></span>
            <span>Avg Daily Revenue: <strong className="font-mono text-foreground font-bold">₹70,685/day</strong></span>
          </div>
        </div>

        {/* RIGHT FUNNEL (35% width): Walk-ins to Paying Customer Conversion */}
        <div className="lg:col-span-4 bg-card rounded-3xl p-6 border border-border shadow-xs space-y-6 flex flex-col justify-between">
          <div className="border-b border-border pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              Walk-in Conversion Funnel
            </h3>
            <p className="text-xs text-muted-foreground">Store visitors vs actual paying buyers</p>
          </div>

          {/* Funnel Progress Bars */}
          <div className="space-y-4">
            
            {/* Stage 1: Total Store Walk-ins */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">1. Total Store Walk-ins</span>
                <span className="font-mono font-bold text-foreground">1,420 shoppers (100%)</span>
              </div>
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full w-full" />
              </div>
            </div>

            {/* Stage 2: Fitting Room / Tried On */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">2. Garments Tried On</span>
                <span className="font-mono font-bold text-amber-600">1,140 shoppers (80.2%)</span>
              </div>
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[80.2%]" />
              </div>
            </div>

            {/* Stage 3: Completed WhatsApp Invoiced Payment */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground font-bold">3. Paying Customers</span>
                <span className="font-mono font-bold text-primary">982 buyers (69.1%)</span>
              </div>
              <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[69.1%]" />
              </div>
            </div>

          </div>

          {/* Conversion Benchmark Badge */}
          <div className="p-3.5 bg-emerald-100/70 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 rounded-2xl text-xs space-y-1 border border-emerald-200 dark:border-emerald-800">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-600" /> High Conversion Rate
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              69.1% of store walk-ins completed a purchase with paperless WhatsApp receipts.
            </p>
          </div>
        </div>

      </div>

      {/* CATEGORY REVENUE BREAKDOWN */}
      <div className="bg-card rounded-3xl p-6 border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="font-bold text-base text-foreground">Garment Category Revenue Share</h3>
            <p className="text-xs text-muted-foreground">Sales distribution across apparel categories</p>
          </div>
          <span className="text-xs font-mono font-bold text-foreground">5 Categories Active</span>
        </div>

        <div className="space-y-3">
          {categoryBreakdown.map((cat) => (
            <div key={cat.name} className="space-y-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">{cat.name}</span>
                <span className="font-mono font-bold text-foreground">
                  ₹{cat.revenue.toLocaleString('en-IN')} <span className="text-muted-foreground font-normal text-[11px]">({cat.percentage}%)</span>
                </span>
              </div>
              <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`${cat.color} h-full rounded-full transition-all duration-500`} 
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
