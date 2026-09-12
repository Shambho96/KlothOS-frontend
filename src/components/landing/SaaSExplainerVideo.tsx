import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { 
  Play, 
  Pause, 
  RotateCcw, 
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
    time: 'Module 01',
    title: '1. Fast Apparel POS Billing',
    subtitle: 'Scan barcodes, pick sizes (S, M, L, XL) & complete checkouts in seconds',
    icon: Barcode,
  },
  {
    id: 2,
    time: 'Module 02',
    title: '2. WhatsApp Paperless Bills',
    subtitle: 'Send instant PDF tax invoices & reward points directly to customer WhatsApp',
    icon: MessageSquare,
  },
  {
    id: 3,
    time: 'Module 03',
    title: '3. Deadstock Size Radar',
    subtitle: 'Identify slow-moving apparel sizes & launch targeted WhatsApp clearance deals',
    icon: BarChart3,
  },
  {
    id: 4,
    time: 'Module 04',
    title: '4. VIP Loyalty & CRM',
    subtitle: 'Track customer lifetime spend, manage Silver/Gold/Black VIP tiers & coins',
    icon: Award,
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
                KLOTHOS SAAS MODULE DEMO
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                Interactive Preview
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              4 Core modules matching the exact KlothOS store theme
            </p>
          </div>
        </div>

        {/* TIME CODE DISPLAY & PLAYBACK CONTROLS */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border/80">
            Module {activeChapter + 1} of 4
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

      {/* MAIN VIDEO STAGE AREA - MATCHING KLOTHOS APP THEME */}
      <div className="relative aspect-[16/9] min-h-[380px] sm:min-h-[460px] bg-background text-foreground overflow-hidden flex flex-col justify-between p-6 sm:p-10 border-b border-border/60">
        
        {/* AMBIENT BACKGROUND GLOW MATCHING PRIMARY & SECONDARY */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

        {/* SCENE HEADER */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-mono tracking-widest uppercase text-primary font-bold">
              KlothOS Operating System • Module {activeChapter + 1}
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground border border-border bg-card px-2.5 py-1 rounded-md shadow-sm">
            Live Store Register
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
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left"
              >
                <div ref={scannerRef} className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
                    <Zap className="w-3.5 h-3.5" /> Apparel POS Register
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Fast Counter <span className="text-primary">Checkout & Billing</span>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Select clothing items, pick size & color tags, apply customer loyalty coins, and calculate GST totals instantly at the store register.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Barcode Search
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Size Matrix
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> GST Auto-Calc
                    </div>
                  </div>
                </div>

                {/* VISUAL POS SCANNER DEMO BOX */}
                <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-xl relative overflow-hidden space-y-3">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-2">
                    <span className="text-xs font-mono text-muted-foreground">POS Register • Bandra Store</span>
                    <span className="text-xs font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                      LIVE CART
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-background border border-border/80 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-foreground">Italian Linen Shirt</div>
                      <div className="text-xs text-muted-foreground">Size L • Color: Navy</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-primary">₹3,450</div>
                      <div className="text-[10px] text-emerald-600 font-medium">+172 Reward Coins</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-background border border-border/80 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-foreground">Tailored Trouser</div>
                      <div className="text-xs text-muted-foreground">Size 32 • Sand Beige</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-primary">₹4,200</div>
                      <div className="text-[10px] text-emerald-600 font-medium">+210 Reward Coins</div>
                    </div>
                  </div>

                  {/* BARCODE ITEM SELECTION */}
                  <div className="relative py-2.5 px-3.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between overflow-hidden">
                    <div className="flex items-center gap-2 text-primary text-xs font-mono font-bold">
                      <Barcode className="w-4 h-4" /> Added: Raw Denim Jacket (Size XL)
                    </div>
                    <span className="text-xs font-mono font-bold text-primary">₹5,800</span>
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
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-semibold">
                    <MessageSquare className="w-3.5 h-3.5" /> Paperless Billing
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Send Digital Receipts <span className="text-emerald-600">on WhatsApp</span>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Eliminate paper invoices. Send customer receipts directly to their WhatsApp with attached PDF tax invoices and live reward coin updates.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> WhatsApp Message Dispatch
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant PDF Download
                    </div>
                  </div>
                </div>

                {/* VIRTUAL WHATSAPP PHONE DISPLAY */}
                <div ref={phoneRef} className="max-w-sm mx-auto w-full bg-card border border-border rounded-3xl p-4 shadow-xl relative text-foreground">
                  <div className="w-20 h-3 bg-muted rounded-full mx-auto mb-3" />
                  
                  {/* CHAT HEADER */}
                  <div className="bg-emerald-500/10 p-3 rounded-xl flex items-center gap-3 mb-3 border border-emerald-500/20">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                      K
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">KlothOS Store Official</div>
                      <div className="text-[10px] text-emerald-600 font-medium">Verified Business Account</div>
                    </div>
                  </div>

                  {/* WHATSAPP MESSAGE BUBBLE */}
                  <div className="space-y-2">
                    <div className="bg-background p-3.5 rounded-2xl rounded-tl-none border border-border text-xs text-foreground space-y-2">
                      <p className="font-semibold text-emerald-600">
                        Hi Rohan! Thank you for shopping at KlothOS Store 🎉
                      </p>
                      <p className="text-muted-foreground">Here is your digital tax receipt for Invoice #KL-9402.</p>
                      
                      <div className="p-2.5 rounded-lg bg-card border border-border flex items-center justify-between text-[11px]">
                        <span className="font-mono text-foreground">TaxInvoice_KL9402.pdf</span>
                        <span className="text-emerald-600 font-bold">124 KB</span>
                      </div>

                      <div className="pt-1 text-[11px] text-primary flex items-center justify-between border-t border-border">
                        <span>⭐ Earned Reward Coins:</span>
                        <span className="font-bold text-primary">+382 Coins</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-right text-muted-foreground pr-1">
                      Delivered 12:44 PM • Read ✓✓
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: DEADSTOCK SIZE RADAR */}
            {activeChapter === 2 && (
              <motion.div
                key="stage-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-semibold">
                    <BarChart3 className="w-3.5 h-3.5" /> Inventory Intelligence
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Clear Deadstock <span className="text-secondary">By Apparel Size</span>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Identify non-moving clothing sizes (e.g. Size XL sitting &gt; 30 days) and send targeted WhatsApp discount offers directly to past buyers of that size.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-secondary" /> Size Breakdown Matrix
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-secondary" /> WhatsApp Broadcast
                    </div>
                  </div>
                </div>

                {/* GRAPHICAL CHART DEMO */}
                <div ref={chartRef} className="bg-card border border-border rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Size Turnover Velocity</span>
                    <span className="text-secondary font-mono font-bold">Bandra Outlet</span>
                  </div>

                  <div className="h-32 flex items-end gap-3 px-2 border-b border-border pb-2">
                    <div className="flex-1 bg-muted rounded-t-lg h-[40%] relative">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground">Size S</span>
                    </div>
                    <div className="flex-1 bg-secondary rounded-t-lg h-[90%] relative">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-secondary font-bold">Size M</span>
                    </div>
                    <div className="flex-1 bg-muted rounded-t-lg h-[65%] relative">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground">Size L</span>
                    </div>
                    <div className="flex-1 bg-primary rounded-t-lg h-[25%] relative animate-pulse">
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-primary font-bold">Size XL</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
                    <div className="text-foreground">
                      <span>Action: Launch 20% discount on Size XL to 142 past buyers</span>
                    </div>
                    <button className="px-3 py-1 rounded bg-primary text-primary-foreground font-bold text-[11px] hover:opacity-90 transition-opacity">
                      Clear Deadstock
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 4: VIP LOYALTY CRM */}
            {activeChapter === 3 && (
              <motion.div
                key="stage-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 text-xs font-semibold">
                    <Award className="w-3.5 h-3.5" /> Customer CRM & VIP Tiers
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    Track Customer LTV & <span className="text-purple-600">Manage VIP Tiers</span>
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Track customer lifetime spend across Silver, Gold, and Black VIP tiers. View phone numbers, order ledgers, and reward coin balances.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" /> Silver / Gold / Black Tiers
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" /> Reward Coins Ledger
                    </div>
                  </div>
                </div>

                {/* VIP CARD PREVIEW */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl relative space-y-4 text-foreground">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-600 font-bold text-xs">
                        VIP
                      </div>
                      <div>
                        <div className="text-sm font-bold text-foreground">Rohan Sharma</div>
                        <div className="text-[10px] text-muted-foreground">+91 98201 44820</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      Black VIP Member
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-background border border-border">
                      <div className="text-muted-foreground text-[10px]">Total Store Spend</div>
                      <div className="text-base font-bold text-foreground font-mono">₹1,42,800</div>
                    </div>
                    <div className="p-3 rounded-xl bg-background border border-border">
                      <div className="text-muted-foreground text-[10px]">Reward Coin Balance</div>
                      <div className="text-base font-bold text-purple-600 font-mono">1,450 Coins</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-xs text-foreground">
                    <span>⚡ Redeemable at counter</span>
                    <span className="font-bold text-primary">₹1,450 OFF</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* BOTTOM TIMELINE PROGRESS BAR */}
        <div className="relative z-10 space-y-2 pt-4 border-t border-border/60">
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden relative cursor-pointer"
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const clickX = e.clientX - rect.left;
                 const newProgress = (clickX / rect.width) * 100;
                 setProgress(newProgress);
               }}>
            <div
              className="h-full bg-gradient-to-r from-primary via-amber-500 to-teal-600 transition-all duration-100 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>

      {/* CHAPTER SELECTOR NAVIGATION BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60 bg-card">
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
