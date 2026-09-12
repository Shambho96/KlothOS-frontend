import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Users,
  Zap,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  Tag,
  ChevronRight,
  Eye,
  Play,
  Plus,
  X,
  Image,
  FileText,
  ArrowUpRight,
  FlameKindling,
  Gift,
  ShoppingBag,
  Bell,
  Check,
} from 'lucide-react';
import type { CampaignCohort, BroadcastLog, Customer } from '../types';

interface CampaignViewProps {
  cohorts: CampaignCohort[];
  customers: Customer[];
  broadcastLogs: BroadcastLog[];
  onSendCampaign: (cohortId: string, log: BroadcastLog) => void;
}

// ─── Pre-built Campaign Template Presets ───────────────────────────────────
const CAMPAIGN_PRESETS = [
  {
    id: 'flash-sale',
    name: 'Flash Sale Alert',
    icon: FlameKindling,
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
    badgeColor: 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300',
    description: 'Time-limited offer for all active customers',
    template: 'Hey {{firstName}}! 🔥 FLASH SALE at KlothOS! Get FLAT 20% OFF on all Shirts & Trousers today ONLY. Show this message at checkout. Expires midnight tonight!\n\nUse code: FLASH20'
  },
  {
    id: 'new-arrival',
    name: 'New Arrival Drop',
    icon: ShoppingBag,
    iconColor: 'text-sky-500',
    bgColor: 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800',
    badgeColor: 'bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300',
    description: 'Announce fresh inventory to loyal customers',
    template: 'Hi {{firstName}} 👋 Fresh drops have landed at KlothOS Bandra West!\n\n✨ Supima Oxford Shirts\n✨ Italian Wool Trousers\n✨ Raw Selvedge Denim 14oz\n\nYour {{tierName}} loyalty points give you EARLY ACCESS today. Visit us or reply to hold your size!'
  },
  {
    id: 'birthday-coupon',
    name: 'Birthday Reward',
    icon: Gift,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    badgeColor: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
    description: 'Auto-send birthday surprise to members',
    template: '🎉 Happy Birthday {{firstName}}!\n\nAs a KlothOS {{tierName}} member, we have a special birthday gift for you — ₹500 bonus coins credited to your WhatsApp Member Pass!\n\nValid for 7 days. View your pass & redeem: https://klothos.app/pass'
  },
  {
    id: 'win-back',
    name: 'Win-Back Campaign',
    icon: Bell,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    badgeColor: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    description: 'Re-engage customers inactive for 45+ days',
    template: 'We miss you, {{firstName}}! 💙\n\nIt has been a while since we last saw you at KlothOS. We have kept your {{coinsBalance}} loyalty coins warm — and added an exclusive 10% comeback offer just for you.\n\nReply "BACK" or visit us at Bandra West. Valid this week only!'
  }
];

// ─── Cohort Filter Badge Renderer ───────────────────────────────────────────
const CohortFilterBadge: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary border border-primary/20">
    <Tag size={9} /> {label}: {value}
  </span>
);

// ─── Status Dot ──────────────────────────────────────────────────────────────
const StatusDot: React.FC<{ status: BroadcastLog['status'] }> = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
    status === 'Delivered'
      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
  }`}>
    {status === 'Delivered'
      ? <CheckCircle2 size={10} />
      : <Clock size={10} />
    }
    {status}
  </span>
);

export const CampaignView: React.FC<CampaignViewProps> = ({
  cohorts,
  customers,
  broadcastLogs,
  onSendCampaign,
}) => {
  const [activeTab, setActiveTab] = useState<'compose' | 'cohorts' | 'logs'>('compose');
  const [selectedPreset, setSelectedPreset] = useState<string>('flash-sale');
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(cohorts[0]?.id ?? null);
  const [messageBody, setMessageBody] = useState<string>(CAMPAIGN_PRESETS[0].template);
  const [headerType, setHeaderType] = useState<'text' | 'image'>('text');
  const [headerImageUrl, setHeaderImageUrl] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('FLASH20');
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const selectedCohort = cohorts.find(c => c.id === selectedCohortId);
  const selectedPresetData = CAMPAIGN_PRESETS.find(p => p.id === selectedPreset);

  // KPI Aggregates from logs
  const totalSent = broadcastLogs.reduce((sum, l) => sum + l.reachCount, 0);
  const totalRevenue = broadcastLogs.reduce((sum, l) => sum + l.revenueAttributed, 0);
  const avgOpenRate = broadcastLogs.length > 0
    ? Math.round(broadcastLogs.reduce((sum, l) => sum + parseFloat(l.openRate), 0) / broadcastLogs.length)
    : 0;
  const deliveredCount = broadcastLogs.filter(l => l.status === 'Delivered').length;

  const handlePresetSelect = (presetId: string) => {
    const preset = CAMPAIGN_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      setMessageBody(preset.template);
      if (presetId === 'flash-sale') setCouponCode('FLASH20');
      else if (presetId === 'birthday-coupon') setCouponCode('BDAY500');
      else if (presetId === 'win-back') setCouponCode('BACK10');
      else setCouponCode('ARRIVAL10');
    }
  };

  const handleSendNow = () => {
    if (!selectedCohort) return;
    setIsSending(true);

    setTimeout(() => {
      const newLog: BroadcastLog = {
        id: `log-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        cohortName: selectedCohort.name,
        reachCount: selectedCohort.estimatedReach,
        openRate: `${Math.floor(72 + Math.random() * 20)}%`,
        templateUsed: selectedPresetData?.name || 'Custom',
        status: scheduleType === 'now' ? 'Delivered' : 'Scheduled',
        revenueAttributed: Math.round(selectedCohort.estimatedReach * (1200 + Math.random() * 800))
      };
      onSendCampaign(selectedCohort.id, newLog);
      setIsSending(false);
      setSentSuccess(`Campaign sent to ${selectedCohort.estimatedReach} customers via WhatsApp!`);
      setTimeout(() => setSentSuccess(null), 5000);
    }, 1800);
  };

  // Simulated preview values
  const previewName = customers[0]?.name?.split(' ')[0] || 'Rohan';
  const previewTier = customers[0]?.tier || 'Gold';
  const previewCoins = customers[0]?.coinsBalance || 680;
  const previewMessage = messageBody
    .replace('{{firstName}}', previewName)
    .replace('{{tierName}}', previewTier)
    .replace('{{coinsBalance}}', previewCoins.toString())
    .replace('{{preferredSize}}', 'Size L / 34')
    .replace('{{couponCode}}', couponCode);

  return (
    <div className="space-y-4">

      {/* ── TOP KPI STRIP ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Broadcasts',
            value: broadcastLogs.length,
            sub: `${deliveredCount} Delivered`,
            icon: Send,
            color: 'text-primary',
            bg: 'bg-primary/10'
          },
          {
            label: 'Total Customers Reached',
            value: totalSent.toLocaleString('en-IN'),
            sub: 'All campaigns combined',
            icon: Users,
            color: 'text-sky-600',
            bg: 'bg-sky-100 dark:bg-sky-950'
          },
          {
            label: 'Avg. WhatsApp Open Rate',
            value: `${avgOpenRate}%`,
            sub: 'Industry avg: 58%',
            icon: Eye,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 dark:bg-emerald-950'
          },
          {
            label: 'Revenue Attributed',
            value: `₹${totalRevenue.toLocaleString('en-IN')}`,
            sub: 'From campaign-driven purchases',
            icon: TrendingUp,
            color: 'text-amber-600',
            bg: 'bg-amber-100 dark:bg-amber-950'
          }
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card p-4 rounded-2xl border border-border shadow-xs hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
                <div className={`p-2 rounded-xl ${kpi.bg}`}>
                  <Icon size={16} className={kpi.color} />
                </div>
              </div>
              <p className="font-mono text-xl font-black text-foreground">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── TAB BAR ── */}
      <div className="bg-card p-1 rounded-2xl border border-border flex items-center gap-1 shadow-xs w-fit">
        {([
          { id: 'compose', label: 'Compose Campaign', icon: MessageSquare },
          { id: 'cohorts', label: 'Customer Cohorts', icon: Users },
          { id: 'logs', label: 'Broadcast Log', icon: BarChart3 },
        ] as const).map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TAB 1 — COMPOSE CAMPAIGN
      ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT — Config Panel */}
          <div className="lg:col-span-7 space-y-5">

            {/* ─ Preset Template Picker ─ */}
            <div className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Sparkles size={16} className="text-primary" /> Choose Campaign Template
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {CAMPAIGN_PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const isActive = selectedPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                        isActive
                          ? `${preset.bgColor} ring-2 ring-primary/30 border-primary/40`
                          : 'bg-secondary/40 border-border hover:bg-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-1.5 rounded-lg ${isActive ? preset.badgeColor : 'bg-muted'}`}>
                          <Icon size={14} className={isActive ? preset.iconColor : 'text-muted-foreground'} />
                        </div>
                        {isActive && <Check size={14} className="text-primary" />}
                      </div>
                      <p className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {preset.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{preset.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─ Message Body Editor ─ */}
            <div className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <FileText size={16} className="text-primary" /> Message Body
                </h3>
                <span className="text-[10px] text-muted-foreground font-mono">{messageBody.length} chars</span>
              </div>

              {/* Header Type Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-bold">Header:</span>
                {(['text', 'image'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setHeaderType(type)}
                    className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      headerType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type === 'image' ? <Image size={12} /> : <FileText size={12} />}
                    {type === 'text' ? 'Text Only' : 'Image + Caption'}
                  </button>
                ))}
              </div>

              {/* Image URL input if image header */}
              {headerType === 'image' && (
                <input
                  type="text"
                  placeholder="Paste image URL (Unsplash, CDN, etc.)..."
                  value={headerImageUrl}
                  onChange={e => setHeaderImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring"
                />
              )}

              {/* Message Textarea */}
              <textarea
                rows={7}
                value={messageBody}
                onChange={e => setMessageBody(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring font-mono leading-relaxed resize-none"
                placeholder="Write your WhatsApp message here..."
              />

              {/* Dynamic Variable Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground font-bold mr-1">Insert variable:</span>
                {['{{firstName}}', '{{tierName}}', '{{coinsBalance}}', '{{preferredSize}}', '{{couponCode}}'].map(v => (
                  <button
                    key={v}
                    onClick={() => setMessageBody(prev => prev + v)}
                    className="px-2 py-0.5 text-[10px] font-mono font-bold bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-foreground whitespace-nowrap">Coupon Code:</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-1.5 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring font-mono font-bold uppercase tracking-widest"
                  placeholder="e.g. FLASH20"
                />
              </div>
            </div>

            {/* ─ Cohort Selector ─ */}
            <div className="bg-card rounded-2xl border border-border p-5 space-y-3 shadow-xs">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Users size={16} className="text-primary" /> Select Target Cohort
              </h3>
              <div className="space-y-2">
                {cohorts.map(cohort => {
                  const isSelected = selectedCohortId === cohort.id;
                  return (
                    <button
                      key={cohort.id}
                      onClick={() => setSelectedCohortId(cohort.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20'
                          : 'bg-secondary/30 border-border hover:bg-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {cohort.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                            ~{cohort.estimatedReach} recipients
                          </span>
                          {isSelected && <Check size={14} className="text-primary shrink-0" />}
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{cohort.description}</p>
                      {/* Filter badges */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {cohort.customFilter?.sizeFilter && (
                          <CohortFilterBadge label="Size" value={cohort.customFilter.sizeFilter} />
                        )}
                        {cohort.customFilter?.tierFilter && (
                          <CohortFilterBadge label="Tier" value={cohort.customFilter.tierFilter} />
                        )}
                        {cohort.customFilter?.idleDaysMin && (
                          <CohortFilterBadge label="Inactive" value={`${cohort.customFilter.idleDaysMin}+ days`} />
                        )}
                        {cohort.customFilter?.categoryFilter && (
                          <CohortFilterBadge label="Category" value={cohort.customFilter.categoryFilter} />
                        )}
                        {cohort.customFilter?.minSpend && (
                          <CohortFilterBadge label="Min Spend" value={`₹${cohort.customFilter.minSpend.toLocaleString('en-IN')}`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─ Schedule ─ */}
            <div className="bg-card rounded-2xl border border-border p-5 space-y-3 shadow-xs">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Calendar size={16} className="text-primary" /> Delivery Schedule
              </h3>
              <div className="flex items-center gap-3">
                {(['now', 'later'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setScheduleType(type)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      scheduleType === type
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {type === 'now' ? <Zap size={14} /> : <Clock size={14} />}
                    {type === 'now' ? 'Send Immediately' : 'Schedule for Later'}
                  </button>
                ))}
              </div>

              {scheduleType === 'later' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 gap-3"
                >
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="px-3 py-2 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    className="px-3 py-2 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </motion.div>
              )}
            </div>

            {/* ─ Send Actions ─ */}
            <div className="space-y-3">
              {sentSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2"
                >
                  <CheckCircle2 size={16} /> {sentSuccess}
                </motion.div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewOpen(true)}
                  className="flex-1 py-3 bg-secondary text-secondary-foreground font-bold text-xs rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-2 border border-border cursor-pointer"
                >
                  <Eye size={16} /> Preview WhatsApp
                </button>
                <button
                  onClick={handleSendNow}
                  disabled={!selectedCohortId || isSending}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:opacity-95 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSending ? (
                    <><Clock size={16} className="animate-spin" /> Dispatching...</>
                  ) : scheduleType === 'now' ? (
                    <><Send size={16} /> Send Campaign Now</>
                  ) : (
                    <><Calendar size={16} /> Schedule Broadcast</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — Live WhatsApp Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden sticky top-6">
              {/* Preview Header */}
              <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  <span className="font-bold text-sm">Live WhatsApp Preview</span>
                </div>
                {selectedCohort && (
                  <span className="text-[10px] bg-primary-foreground/20 px-2 py-0.5 rounded-full font-mono">
                    ~{selectedCohort.estimatedReach} recipients
                  </span>
                )}
              </div>

              {/* Mock Phone */}
              <div className="bg-[#E5DDD5] dark:bg-[#111b21] p-4 space-y-3 min-h-[500px]">
                {/* WhatsApp Contact Header */}
                <div className="bg-[#075E54] text-white p-3 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-black text-sm">K</div>
                  <div>
                    <p className="font-bold text-sm leading-none">KlothOS Bandra West</p>
                    <p className="text-[10px] text-emerald-200">Official Business Account ✓</p>
                  </div>
                </div>

                {/* Message Bubble */}
                <motion.div
                  key={messageBody + selectedPreset}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-[#202c33] rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-700 overflow-hidden max-w-[92%]"
                >
                  {/* Image header if applicable */}
                  {headerType === 'image' && (
                    <div className="w-full bg-slate-200 dark:bg-slate-700 overflow-hidden" style={{ aspectRatio: '16/9' }}>
                      {headerImageUrl ? (
                        <img
                          src={headerImageUrl}
                          alt="Campaign header"
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Image size={24} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="p-3.5 space-y-2.5">
                    <p className="text-xs text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                      {previewMessage}
                    </p>

                    {/* Coupon Pill */}
                    {couponCode && (
                      <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg p-2 flex items-center gap-2">
                        <Tag size={12} className="text-amber-600 shrink-0" />
                        <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-300 tracking-widest">
                          {couponCode}
                        </span>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 font-mono">
                      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <CheckCircle2 size={11} className="text-sky-500" />
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="border-t border-slate-200 dark:border-slate-700">
                    {(selectedCohort?.templateConfig?.ctaButtons || []).slice(0, 2).map(btn => (
                      <button
                        key={btn.id}
                        className="w-full py-2 text-sky-600 font-bold text-[11px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0 flex items-center justify-center gap-1.5"
                      >
                        {btn.type === 'url' ? <ArrowUpRight size={12} /> : <MessageSquare size={12} />}
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Reply buttons mock */}
                <div className="flex gap-2 mt-2">
                  <div className="bg-white dark:bg-slate-800 rounded-full px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-xs border border-slate-200 dark:border-slate-700">
                    👍 Interested
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-full px-3 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 shadow-xs border border-slate-200 dark:border-slate-700">
                    ❌ Not Now
                  </div>
                </div>
              </div>

              {/* Reach & Stats Footer */}
              {selectedCohort && (
                <div className="px-4 py-3 bg-card border-t border-border grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="font-mono font-black text-foreground">{selectedCohort.estimatedReach}</p>
                    <p className="text-[10px] text-muted-foreground">Recipients</p>
                  </div>
                  <div>
                    <p className="font-mono font-black text-emerald-600">~87%</p>
                    <p className="text-[10px] text-muted-foreground">Est. Delivery</p>
                  </div>
                  <div>
                    <p className="font-mono font-black text-amber-600">~74%</p>
                    <p className="text-[10px] text-muted-foreground">Est. Open Rate</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 2 — CUSTOMER COHORTS
      ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'cohorts' && (
        <div className="space-y-4">

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Users className="text-primary" size={22} />
                <h2 className="text-xl font-black">Customer Cohorts & Segments</h2>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl">
                Smart audience segments auto-built from your customer data. Each cohort is ready to receive a targeted WhatsApp campaign.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono font-black text-2xl text-amber-400">
                {cohorts.reduce((s, c) => s + c.estimatedReach, 0)}
              </p>
              <p className="text-xs text-slate-300">Total reachable customers</p>
            </div>
          </div>

          {/* Cohort Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cohorts.map((cohort, idx) => (
              <motion.div
                key={cohort.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="bg-card rounded-2xl border border-border p-5 shadow-xs hover:shadow-md transition-all hover:border-primary/30 space-y-4"
              >
                {/* Cohort Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-foreground leading-tight">{cohort.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{cohort.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-black text-xl text-primary">{cohort.estimatedReach}</p>
                    <p className="text-[10px] text-muted-foreground">Recipients</p>
                  </div>
                </div>

                {/* Filter Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {cohort.customFilter?.sizeFilter && (
                    <CohortFilterBadge label="Size" value={cohort.customFilter.sizeFilter} />
                  )}
                  {cohort.customFilter?.tierFilter && (
                    <CohortFilterBadge label="Tier" value={cohort.customFilter.tierFilter} />
                  )}
                  {cohort.customFilter?.idleDaysMin && (
                    <CohortFilterBadge label="Inactive" value={`${cohort.customFilter.idleDaysMin}+ days`} />
                  )}
                  {cohort.customFilter?.categoryFilter && (
                    <CohortFilterBadge label="Category" value={cohort.customFilter.categoryFilter} />
                  )}
                  {cohort.customFilter?.minSpend && (
                    <CohortFilterBadge label="Min Spend" value={`₹${cohort.customFilter.minSpend.toLocaleString('en-IN')}`} />
                  )}
                </div>

                {/* Recommended Template Preview */}
                <div className="bg-secondary/40 p-3 rounded-xl border border-border text-[11px] text-muted-foreground leading-relaxed">
                  <span className="text-[10px] font-bold uppercase text-primary block mb-1">Recommended Message</span>
                  <p className="line-clamp-3">{cohort.recommendedTemplate}</p>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSelectedCohortId(cohort.id);
                      setActiveTab('compose');
                    }}
                    className="flex-1 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play size={13} /> Use in Campaign
                  </button>
                  <button
                    className="px-3 py-2 bg-secondary text-secondary-foreground font-bold text-xs rounded-xl hover:bg-muted border border-border transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB 3 — BROADCAST LOG
      ═══════════════════════════════════════════════════════════ */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          {/* Log Table */}
          <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <BarChart3 size={16} className="text-primary" /> Campaign Broadcast History
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  All WhatsApp broadcasts with delivery stats and attributed revenue
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-foreground bg-secondary px-3 py-1 rounded-xl border border-border">
                {broadcastLogs.length} campaigns
              </span>
            </div>

            {broadcastLogs.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-muted-foreground space-y-3">
                <Send size={36} className="opacity-20" />
                <p className="font-bold text-sm">No campaigns sent yet</p>
                <p className="text-xs text-center max-w-xs">
                  Compose and send your first WhatsApp campaign from the "Compose Campaign" tab.
                </p>
                <button
                  onClick={() => setActiveTab('compose')}
                  className="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl cursor-pointer hover:opacity-95 transition-all mt-2"
                >
                  <Plus size={14} className="inline mr-1" /> Create First Campaign
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border bg-secondary/40 text-muted-foreground font-bold uppercase tracking-wider">
                      <th className="px-4 py-3">Campaign / Cohort</th>
                      <th className="px-4 py-3">Template</th>
                      <th className="px-4 py-3 text-right">Sent To</th>
                      <th className="px-4 py-3 text-right">Open Rate</th>
                      <th className="px-4 py-3 text-right">Revenue ₹</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {broadcastLogs.map((log, idx) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-foreground">{log.cohortName}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold rounded-full">
                            {log.templateUsed}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold text-foreground">
                          {log.reachCount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                            <ArrowUpRight size={12} /> {log.openRate}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                          ₹{log.revenueAttributed.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <StatusDot status={log.status} />
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-muted-foreground">
                          {log.date}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-border bg-muted/30">
                    <tr>
                      <td colSpan={2} className="px-4 py-3 font-black text-xs text-foreground uppercase tracking-wide">
                        Totals
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-foreground">
                        {totalSent.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-emerald-600">
                        {avgOpenRate}%
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-amber-600">
                        ₹{totalRevenue.toLocaleString('en-IN')}
                      </td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FULL PREVIEW MODAL ── */}
      <AnimatePresence>
        {previewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden"
            >
              <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  <span className="font-bold text-sm">WhatsApp Full Message Preview</span>
                </div>
                <button onClick={() => setPreviewOpen(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="bg-[#E5DDD5] dark:bg-[#111b21] p-4 space-y-3">
                <div className="bg-[#075E54] text-white p-3 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-black text-sm">K</div>
                  <div>
                    <p className="font-bold text-sm">KlothOS Bandra West</p>
                    <p className="text-[10px] text-emerald-200">Official Business ✓</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#202c33] rounded-2xl shadow-md border border-slate-200/60 dark:border-slate-700 overflow-hidden">
                  {headerType === 'image' && headerImageUrl && (
                    <img
                      src={headerImageUrl}
                      alt="Campaign"
                      className="w-full object-cover"
                      style={{ maxHeight: '180px' }}
                    />
                  )}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                      {previewMessage}
                    </p>
                    {couponCode && (
                      <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 p-2 rounded-lg flex items-center gap-2">
                        <Tag size={12} className="text-amber-600" />
                        <span className="font-mono font-bold text-amber-700 dark:text-amber-300 text-xs tracking-widest">{couponCode}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700">
                    {(selectedCohort?.templateConfig?.ctaButtons || []).map(btn => (
                      <div key={btn.id} className="py-2.5 text-center text-sky-600 font-bold text-xs border-b border-slate-100 dark:border-slate-700 last:border-0 flex items-center justify-center gap-1.5">
                        {btn.type === 'url' ? <ArrowUpRight size={12} /> : <MessageSquare size={12} />}
                        {btn.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 flex gap-3">
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="flex-1 py-2.5 bg-secondary text-secondary-foreground font-bold text-xs rounded-xl hover:bg-muted border border-border cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => { setPreviewOpen(false); handleSendNow(); }}
                  disabled={!selectedCohortId || isSending}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:opacity-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send size={14} /> Confirm & Send
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
