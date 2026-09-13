import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ArrowUpRight, 
  DollarSign, 
  ShoppingBag,
  Store,
  Send,
  AlertTriangle,
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  Banknote,
  MessageSquare,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { DeadStockItem, ViewMode } from '../types';

interface AnalyticsViewProps {
  deadStockItems?: DeadStockItem[];
  onTriggerClearance?: (item: DeadStockItem) => void;
  onSelectView?: (view: ViewMode) => void;
}

const RechartsCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const conversion = Math.round((data.buyers / data.walkins) * 100);
    return (
      <div className="bg-popover text-popover-foreground border border-border p-3 rounded-2xl shadow-xl font-mono text-xs space-y-1.5 z-50">
        <p className="font-extrabold text-foreground border-b border-border/80 pb-1">{label} Performance</p>
        <p className="text-primary font-extrabold flex items-center justify-between gap-4">
          <span>Revenue:</span>
          <span>₹{data.revenue.toLocaleString('en-IN')}</span>
        </p>
        <p className="text-sky-600 dark:text-sky-400 font-bold flex items-center justify-between gap-4">
          <span>Walk-Ins:</span>
          <span>{data.walkins} visitors</span>
        </p>
        <p className="text-muted-foreground flex items-center justify-between gap-4 text-[11px]">
          <span>Buyers / Conv:</span>
          <span className="text-foreground font-semibold">{data.buyers} ({conversion}%)</span>
        </p>
      </div>
    );
  }
  return null;
};

const CategoryCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover text-popover-foreground border border-border p-2.5 rounded-2xl shadow-xl font-mono text-xs z-50 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: data.hex }} />
        <span className="font-bold text-foreground">{data.name}:</span>
        <span className="font-extrabold text-primary">₹{data.revenue.toLocaleString('en-IN')}</span>
        <span className="text-muted-foreground text-[11px]">({data.percentage}%)</span>
      </div>
    );
  }
  return null;
};

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

  // Category Sales Breakdown with Hex Colors for Recharts Pie
  const categoryBreakdown = [
    { name: 'Shirts', revenue: 168200, percentage: 34.7, color: 'bg-primary', hex: '#6366f1' },
    { name: 'Trousers', revenue: 142800, percentage: 29.5, color: 'bg-amber-500', hex: '#f59e0b' },
    { name: 'Denim', revenue: 89400, percentage: 18.5, color: 'bg-sky-500', hex: '#0ea5e9' },
    { name: 'Jackets', revenue: 56200, percentage: 11.6, color: 'bg-emerald-500', hex: '#10b981' },
    { name: 'Knits', revenue: 27600, percentage: 5.7, color: 'bg-purple-500', hex: '#a855f7' },
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

      {/* 3 CORE KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
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

        {/* Card 3: Average Order Value (AOV) */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-3 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Average Order Value (AOV)</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-mono text-2xl font-extrabold text-foreground">₹2,840</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight size={14} />
              <span>+9.4% vs last week</span>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground pt-2 border-t border-border/60">
            Avg Units Per Basket: <strong className="text-foreground font-mono">2.4 Garments</strong>
          </div>
        </div>

      </div>

      {/* CHARTS & CATEGORY BREAKDOWN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT (7 cols): Recharts Revenue & Walk-In Trend Chart */}
        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-3 gap-2">
            <div>
              <h3 className="text-base font-extrabold text-foreground">Revenue & Walk-In Traffic</h3>
              <p className="text-xs text-muted-foreground">Daily store performance over past 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                <span className="text-muted-foreground">Revenue (₹)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
                <span className="text-muted-foreground">Walk-Ins</span>
              </div>
              <span className="text-xs font-mono text-primary font-bold hidden sm:inline ml-2">Peak: Sat (₹1.05L)</span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'monospace' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}`}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'monospace' }}
                />
                <Tooltip content={<RechartsCustomTooltip />} />
                <Bar yAxisId="left" dataKey="revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={22} name="Revenue (₹)" />
                <Bar yAxisId="right" dataKey="walkins" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={22} name="Walk-Ins" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT (5 cols): Recharts Category Donut & Sales Share */}
        <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-border/60 pb-3">
            <h3 className="text-base font-extrabold text-foreground">Category Revenue Share</h3>
            <p className="text-xs text-muted-foreground">Sales breakdown by garment type</p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="revenue"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.hex} stroke="var(--card)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CategoryCustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Billed</span>
              <span className="text-xs font-mono font-extrabold text-foreground">₹4.87L</span>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-border/60">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: cat.hex }} />
                  <span className="text-foreground">{cat.name}</span>
                </div>
                <span className="font-mono text-muted-foreground">₹{cat.revenue.toLocaleString('en-IN')} ({cat.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PAYMENT MODE BREAKDOWN & WHATSAPP RECEIPT ADOPTION */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-3 gap-2">
          <div>
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <CreditCard size={18} className="text-primary" /> Payment Mode Breakdown & Digital Receipts
            </h3>
            <p className="text-xs text-muted-foreground">Distribution of billing payment channels & WhatsApp invoice adoption</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 font-mono text-xs font-bold">
            <Zap size={14} /> 84.2% WhatsApp Receipt Rate
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Payment Method 1: UPI */}
          <div className="p-4 rounded-2xl bg-background border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <QrCode size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">UPI / QR Scan</h4>
                  <p className="text-[10px] text-muted-foreground">GPay, PhonePe, Paytm</p>
                </div>
              </div>
              <span className="text-xs font-mono font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                58.0%
              </span>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-bold text-foreground">₹2,82,500</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '58%' }} />
              </div>
            </div>
          </div>

          {/* Payment Method 2: Cards */}
          <div className="p-4 rounded-2xl bg-background border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Credit & Debit Cards</h4>
                  <p className="text-[10px] text-muted-foreground">Visa, Mastercard, RuPay</p>
                </div>
              </div>
              <span className="text-xs font-mono font-extrabold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded-lg">
                28.0%
              </span>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-bold text-foreground">₹1,36,400</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>
          </div>

          {/* Payment Method 3: Cash */}
          <div className="p-4 rounded-2xl bg-background border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                  <Banknote size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Store Cash</h4>
                  <p className="text-[10px] text-muted-foreground">Physical POS Drawer</p>
                </div>
              </div>
              <span className="text-xs font-mono font-extrabold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                14.0%
              </span>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-bold text-foreground">₹68,300</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '14%' }} />
              </div>
            </div>
          </div>

        </div>

        {/* WHATSAPP DIGITAL RECEIPT FOOTER HIGHLIGHT */}
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary text-primary-foreground">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="font-bold text-foreground">WhatsApp Instant Receipt Adoption</p>
              <p className="text-muted-foreground text-[11px]">₹3,92,400 out of ₹4.87L revenue billed directly via paperless WhatsApp PDF receipts.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-mono shrink-0">
            <div className="text-right">
              <span className="block text-[10px] text-muted-foreground uppercase font-bold">Paper Saved</span>
              <span className="font-extrabold text-primary">1,240 Receipts</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-muted-foreground uppercase font-bold">Repeat Opt-Ins</span>
              <span className="font-extrabold text-emerald-600">92.4%</span>
            </div>
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
