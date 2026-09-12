import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Barcode, 
  CheckCircle2, 
  Zap, 
  MessageSquare,
  BarChart3,
  Award,
  Tv
} from 'lucide-react';

const CHAPTERS = [
  {
    id: 1,
    time: '00:00 - 00:05',
    title: '1. Lightning POS Billing',
    subtitle: 'Scan barcodes & process offline/online sales in < 0.8 seconds',
    icon: Barcode,
    accent: 'from-amber-500 to-orange-600',
  },
  {
    id: 2,
    time: '00:05 - 00:10',
    title: '2. WhatsApp Paperless Bill',
    subtitle: 'Zero paper costs. Bills & reward points delivered directly on WhatsApp',
    icon: MessageSquare,
    accent: 'from-emerald-500 to-teal-600',
  },
  {
    id: 3,
    time: '00:10 - 00:15',
    title: '3. AI Deadstock Liquidator',
    subtitle: 'Identify slow-moving sizes & launch instant clearance campaigns',
    icon: BarChart3,
    accent: 'from-blue-500 to-indigo-600',
  },
  {
    id: 4,
    time: '00:15 - 00:20',
    title: '4. Automated VIP Loyalty',
    subtitle: 'Automate tier upgrades & turn one-time shoppers into repeat VIPs',
    icon: Award,
    accent: 'from-purple-500 to-pink-600',
  },
];

export const SaaSExplainerVideo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const scannerRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Auto-play progress timeline
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0; // Loop back
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync active chapter based on progress (0-100 mapped to 4 chapters)
  useEffect(() => {
    const nextChapter = Math.min(3, Math.floor((progress / 100) * 4));
    if (nextChapter !== activeChapter) {
      setActiveChapter(nextChapter);
    }
  }, [progress, activeChapter]);

  // GSAP micro-animations on chapter change
  useEffect(() => {
    if (activeChapter === 0 && scannerRef.current) {
      gsap.fromTo(
        scannerRef.current,
        { y: -20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }
      );
    } else if (activeChapter === 1 && phoneRef.current) {
      gsap.fromTo(
        phoneRef.current,
        { x: 30, opacity: 0, rotate: 4 },
        { x: 0, opacity: 1, rotate: 0, duration: 0.7, ease: 'power3.out' }
      );
    } else if (activeChapter === 2 && chartRef.current) {
      gsap.fromTo(
        chartRef.current,
        { scaleY: 0, transformOrigin: 'bottom' },
        { scaleY: 1, duration: 0.8, ease: 'elastic.out(1, 0.6)' }
      );
    }
  }, [activeChapter]);

  const handleChapterClick = (index: number) => {
    setActiveChapter(index);
    setProgress(index * 25 + 2);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setProgress(0);
    setActiveChapter(0);
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-12 rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl shadow-primary/10 overflow-hidden relative">
      
      {/* HEADER TOP BAR WITH BADGE */}
      <div className="px-6 py-4 border-b border-border/60 bg-muted/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Tv className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground text-sm tracking-wide">
                PRODUCT DEMO & ARCHITECTURE
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                Live Interactive Animation
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              See how KlothOS transforms apparel retail operations end-to-end
            </p>
          </div>
        </div>

        {/* TIME CODE DISPLAY & PLAYBACK CONTROLS */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground bg-background/80 px-3 py-1.5 rounded-lg border border-border/60">
            00:{Math.floor((progress / 100) * 20).toString().padStart(2, '0')} / 00:20
          </span>

          <button
            onClick={togglePlay}
            className="p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            title={isPlaying ? 'Pause Demo' : 'Play Demo'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-secondary/20 hover:bg-secondary/40 text-foreground transition-colors"
            title="Restart Video Demo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN VIDEO STAGE AREA */}
      <div className="relative aspect-[16/9] min-h-[380px] sm:min-h-[460px] bg-slate-950 text-white overflow-hidden flex flex-col justify-between p-6 sm:p-10">
        
        {/* AMBIENT CANVAS MESH GLOW INSIDE VIDEO */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />

        {/* SCENE HEADER (DYNAMIC ACCORDING TO CHAPTER) */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono tracking-widest uppercase text-emerald-400 font-medium">
              KlothOS Core SaaS Engine v2.4 • Step {activeChapter + 1} of 4
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400 border border-slate-800 bg-slate-900/80 px-2.5 py-1 rounded-md">
            100% Real-Time Cloud Sync
          </span>
        </div>

        {/* CHAPTER CONTENT STAGES */}
        <div className="relative z-10 my-auto py-6">
          <AnimatePresence mode="wait">
            
            {/* STAGE 1: LIGHTNING POS BILLING */}
            {activeChapter === 0 && (
              <motion.div
                key="stage-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div ref={scannerRef} className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium">
                    <Zap className="w-3.5 h-3.5" /> High-Speed Checkout Engine
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                    Scan & Bill In <span className="text-amber-400">0.8 Seconds</span>
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Staff scans apparel tags via hardware scanner or phone camera. Size matrix, stock levels, GST, and VIP loyalty points auto-calculate instantly.
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" /> Offline Sync
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" /> Multi-Counter Support
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" /> Auto Tax Audit
                    </div>
                  </div>
                </div>

                {/* VISUAL POS SCANNER DEMO BOX */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-xs font-mono text-slate-400">Terminal #01 • Bandra West Store</span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      LIVE REGISTER
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-100">Italian Linen Blazer (Navy)</div>
                        <div className="text-xs text-slate-400">SKU: LNN-BLZ-42 • Size: 42</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-amber-400">₹8,990</div>
                        <div className="text-[10px] text-emerald-400">+180 Reward Coins</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-100">Egyptian Cotton Chino</div>
                        <div className="text-xs text-slate-400">SKU: EGY-CHN-32 • Size: 32</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-amber-400">₹3,450</div>
                        <div className="text-[10px] text-emerald-400">+69 Reward Coins</div>
                      </div>
                    </div>

                    {/* ANIMATED BARCODE SCANNING BEAM */}
                    <div className="relative py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-2 bg-amber-400 shadow-[0_0_15px_#f59e0b] animate-ping" />
                      <div className="flex items-center gap-2 text-amber-300 text-xs font-mono">
                        <Barcode className="w-4 h-4 animate-bounce" /> Scanning item... SKU: SILK-DRS-S
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300">₹4,200</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: WHATSAPP PAPERLESS BILL */}
            {activeChapter === 1 && (
              <motion.div
                key="stage-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                    <MessageSquare className="w-3.5 h-3.5" /> Instant WhatsApp Integration
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                    Send Smart Bills <span className="text-emerald-400">Directly on WhatsApp</span>
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Ditch thermal paper rolls and save up to ₹1.2 Lakhs annually per store. Customers receive branded PDF receipts, live reward points, and single-click return links.
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Official WhatsApp API
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant PDF Download
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Thermal Printing
                    </div>
                  </div>
                </div>

                {/* VIRTUAL WHATSAPP PHONE DISPLAY */}
                <div ref={phoneRef} className="max-w-sm mx-auto w-full bg-slate-900 border border-slate-750 rounded-3xl p-4 shadow-2xl relative">
                  <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-3" />
                  
                  {/* CHAT HEADER */}
                  <div className="bg-emerald-900/60 p-3 rounded-xl flex items-center gap-3 mb-3 border border-emerald-750">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                      K
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100">KlothOS Store Official</div>
                      <div className="text-[10px] text-emerald-300">Verified Business Account</div>
                    </div>
                  </div>

                  {/* WHATSAPP MESSAGE BUBBLE */}
                  <div className="space-y-2">
                    <div className="bg-slate-800 p-3.5 rounded-2xl rounded-tl-none border border-slate-700 text-xs text-slate-200 space-y-2">
                      <p className="font-semibold text-emerald-300">
                        Hi Priya! Thank you for shopping at KlothOS Bandra 🎉
                      </p>
                      <p>Here is your digital tax invoice for Bill #KL-9402.</p>
                      
                      <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-300">Invoice_KL9402.pdf</span>
                        <span className="text-emerald-400 font-bold">124 KB</span>
                      </div>

                      <div className="pt-1 text-[11px] text-amber-300 flex items-center justify-between border-t border-slate-700">
                        <span>⭐ Earned Loyalty Coins:</span>
                        <span className="font-bold text-amber-400">+249 Coins</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-right text-slate-500 pr-1">
                      Delivered 12:44 PM • Read ✓✓
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: AI DEADSTOCK LIQUIDATOR */}
            {activeChapter === 2 && (
              <motion.div
                key="stage-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium">
                    <BarChart3 className="w-3.5 h-3.5" /> Intelligence Matrix
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                    Unlock Cash Flow from <span className="text-blue-400">Deadstock Inventory</span>
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Identify non-moving size variations (e.g. Size 38 Trousers sitting &gt; 45 days). KlothOS automatically recommends targeted discounts to specific VIP shoppers.
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" /> Size-Level Analytics
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" /> Instant Clearance Campaigns
                    </div>
                  </div>
                </div>

                {/* GRAPHICAL CHART DEMO */}
                <div ref={chartRef} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">Deadstock Liquidation Radar</span>
                    <span className="text-blue-400 font-mono">+38% Capital Recovered</span>
                  </div>

                  <div className="h-32 flex items-end gap-3 px-2 border-b border-slate-800 pb-2">
                    <div className="flex-1 bg-slate-800 rounded-t-lg h-[40%] relative group">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400">Size S</span>
                    </div>
                    <div className="flex-1 bg-blue-500 rounded-t-lg h-[90%] relative">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-blue-300 font-bold">Size M</span>
                    </div>
                    <div className="flex-1 bg-slate-800 rounded-t-lg h-[65%] relative">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400">Size L</span>
                    </div>
                    <div className="flex-1 bg-amber-500 rounded-t-lg h-[25%] relative animate-pulse">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-300 font-bold">Size XL (Alert)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-blue-200">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>AI Suggestion: Launch 20% discount on Size XL to 142 past buyers</span>
                    </div>
                    <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-500 transition-colors">
                      Run Campaign
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 4: AUTOMATED VIP LOYALTY */}
            {activeChapter === 3 && (
              <motion.div
                key="stage-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium">
                    <Award className="w-3.5 h-3.5" /> Retention Engine
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
                    Turn Walk-Ins Into <span className="text-purple-400">High-LTV VIP Customers</span>
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Automate tiered rewards (Silver, Gold, Black VIP). Track total lifetime value per customer and trigger automated WhatsApp greetings with exclusive previews.
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" /> Automatic Tier Escalation
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-400" /> Birthday / Anniversary Triggers
                    </div>
                  </div>
                </div>

                {/* VIP CARD PREVIEW */}
                <div className="bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-purple-800/50 rounded-2xl p-6 shadow-2xl relative space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 font-bold text-xs">
                        VIP
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Rohan Sharma</div>
                        <div className="text-[10px] text-purple-300">Black VIP Tier Member</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Top 1% Shopper
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Total Lifetime Value</div>
                      <div className="text-base font-bold text-white font-mono">₹1,42,800</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Reward Coin Balance</div>
                      <div className="text-base font-bold text-purple-300 font-mono">2,450 Coins</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-700/50 flex items-center justify-between text-xs text-purple-200">
                    <span>⚡ Next reward unlocked in 550 coins</span>
                    <span className="font-bold text-amber-300">₹500 Voucher</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* BOTTOM TIMELINE PROGRESS BAR */}
        <div className="relative z-10 space-y-2 pt-4 border-t border-slate-800">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer"
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const clickX = e.clientX - rect.left;
                 const newProgress = (clickX / rect.width) * 100;
                 setProgress(newProgress);
               }}>
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-purple-500 transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>

      {/* CHAPTER SELECTOR NAVIGATION BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60 bg-card/60">
        {CHAPTERS.map((ch, idx) => {
          const Icon = ch.icon;
          const isActive = activeChapter === idx;

          return (
            <button
              key={ch.id}
              onClick={() => handleChapterClick(idx)}
              className={`p-4 text-left transition-all relative flex flex-col justify-between group ${
                isActive ? 'bg-primary/10' : 'hover:bg-muted/50'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
              )}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {ch.time}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <h4 className={`text-sm font-semibold mb-1 ${isActive ? 'text-foreground font-bold' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {ch.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {ch.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
