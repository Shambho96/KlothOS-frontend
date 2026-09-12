import React, { useState, useEffect, useRef } from 'react';
import { KlothOSLogo } from '../components/KlothOSLogo';
import { Gsap3DCanvas } from '../components/landing/Gsap3DCanvas';
import { Gsap3DTiltCard } from '../components/landing/Gsap3DTiltCard';
import { SaaSExplainerVideo } from '../components/landing/SaaSExplainerVideo';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  Lock, 
  X, 
  Sun, 
  Moon, 
  Zap, 
  BarChart3, 
  ShoppingBag, 
  Calculator, 
  CheckCircle2, 
  Send,
  Play,
  TrendingUp,
  Layers,
  Award,
  Tv
} from 'lucide-react';

interface LandingViewProps {
  onLogin: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

// Sample items for Interactive POS Simulator
const SIMULATOR_ITEMS = [
  { id: 'item-1', name: 'Italian Linen Shirt', category: 'Shirts', size: 'Size L', color: 'Navy', price: 3450, tag: 'Bestseller' },
  { id: 'item-2', name: 'Tailored Trouser', category: 'Trousers', size: 'Size 32', color: 'Sand Beige', price: 4200, tag: 'Trending' },
  { id: 'item-3', name: 'Raw Denim Jacket', category: 'Denim', size: 'Size XL', color: 'Indigo', price: 5800, tag: 'Limited' }
];

const SIMULATOR_CUSTOMERS = [
  { id: 'c-1', name: 'Rohan Sharma', tier: 'Black VIP', phone: '+91 98201 44820', coins: 1450 },
  { id: 'c-2', name: 'Ananya Mehta', tier: 'Gold', phone: '+91 98110 33921', coins: 680 },
  { id: 'c-3', name: 'Priya Kapoor', tier: 'Silver', phone: '+91 98332 11984', coins: 210 }
];

export const LandingView: React.FC<LandingViewProps> = ({ 
  onLogin, 
  isDarkMode, 
  onToggleDarkMode 
}) => {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [storeId, setStoreId] = useState<string>('bandra-west');
  const [pin, setPin] = useState<string>('1234');
  
  // Sticky CTA bar visible after scroll
  const [showStickyCta, setShowStickyCta] = useState<boolean>(false);

  // Interactive POS Simulator State
  const [simSelectedItem, setSimSelectedItem] = useState(SIMULATOR_ITEMS[0]);
  const [simSelectedCustomer, setSimSelectedCustomer] = useState(SIMULATOR_CUSTOMERS[0]);
  const [simBillSent, setSimBillSent] = useState<boolean>(false);

  // Interactive ROI Calculator State
  const [calcBillsPerMonth, setCalcBillsPerMonth] = useState<number>(1200);
  const [calcDeadStockValue, setCalcDeadStockValue] = useState<number>(350000);

  // Hero refs for GSAP entrance
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(heroBadgeRef.current, { y: -20, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' })
        .from(heroHeadingRef.current, { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
        .from(heroButtonsRef.current, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    });
    return () => ctx.revert();
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const scrollToDemo = () => {
    const el = document.getElementById('saas-video-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ROI Calculations
  const paperCostSavedYearly = Math.round(calcBillsPerMonth * 12 * 6.5); // ₹6.50 per paper invoice
  const checkoutHoursSavedMonthly = Math.round((calcBillsPerMonth * 2.5) / 60); // 2.5 mins saved per checkout
  const deadStockRecoveredYearly = Math.round(calcDeadStockValue * 0.45); // 45% liquidation lift
  const totalValueAddedYearly = paperCostSavedYearly + deadStockRecoveredYearly + (checkoutHoursSavedMonthly * 12 * 350);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground relative overflow-x-hidden">
      
      {/* 3D GSAP PARTICLES CANVAS BACKGROUND */}
      <Gsap3DCanvas className="opacity-40 dark:opacity-60" />

      {/* AMBIENT BACKGROUND GLOW BLOBS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] pointer-events-none overflow-hidden -z-10 opacity-70 dark:opacity-40">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-primary/25 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-48 right-1/4 w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[170px]" />
      </div>

      {/* PUBLIC NAVBAR */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <KlothOSLogo size={40} />
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#saas-video-section" className="hover:text-foreground transition-colors">Architecture</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#simulator" className="hover:text-foreground transition-colors">Interactive POS</a>
            <a href="#roi-calculator" className="hover:text-foreground transition-colors">ROI Calculator</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Enterprise</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Login to Store</span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center flex flex-col items-center">
        
        {/* HERO BADGE */}
        <div ref={heroBadgeRef} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md shadow-sm">
          <Sparkles className="w-4 h-4 text-primary animate-spin" />
          <span>Next-Generation Apparel Retail Operating System</span>
        </div>

        {/* HERO MAIN HEADING */}
        <h1 ref={heroHeadingRef} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1] text-foreground mb-6">
          The Operating System Built for <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary via-amber-500 to-teal-600 bg-clip-text text-transparent">
            Multi-Billion Dollar Fashion Brands
          </span>
        </h1>

        {/* HERO SUBTEXT */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mb-10 leading-relaxed font-normal">
          Unify offline POS billing, paperless WhatsApp invoices, size-level deadstock liquidation, and automated VIP retention into one seamless cloud SaaS platform.
        </p>

        {/* HERO CALL TO ACTION BUTTONS */}
        <div ref={heroButtonsRef} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:opacity-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group"
          >
            <span>Launch Live Demo Store</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={scrollToDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-card border border-border/80 font-semibold text-base hover:bg-muted transition-all flex items-center justify-center gap-3"
          >
            <Play className="w-4 h-4 text-primary fill-primary" />
            <span>Watch Product Video</span>
          </button>
        </div>

        {/* 3D HERO FLOATING METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          
          <Gsap3DTiltCard glowColor="rgba(216, 121, 67, 0.2)">
            <div className="p-6 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xl space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
                <span>SPEED METRIC</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-foreground font-mono">&lt; 0.8s</div>
              <p className="text-xs text-muted-foreground">Average checkout & billing processing time per customer</p>
            </div>
          </Gsap3DTiltCard>

          <Gsap3DTiltCard glowColor="rgba(82, 117, 117, 0.2)">
            <div className="p-6 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xl space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
                <span>PAPERLESS SAVINGS</span>
                <MessageSquare className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-extrabold text-foreground font-mono">₹1.2L+</div>
              <p className="text-xs text-muted-foreground">Annual paper bill savings per store via WhatsApp dispatch</p>
            </div>
          </Gsap3DTiltCard>

          <Gsap3DTiltCard glowColor="rgba(231, 138, 83, 0.2)">
            <div className="p-6 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-xl space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-xs font-mono">
                <span>INVENTORY RECOVERY</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-extrabold text-foreground font-mono">45% Lift</div>
              <p className="text-xs text-muted-foreground">Deadstock capital liquidation with AI Size Matrix targeting</p>
            </div>
          </Gsap3DTiltCard>

        </div>

      </header>

      {/* ANIMATED PRODUCT EXPLAINER VIDEO SECTION */}
      <section id="saas-video-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
          <Tv className="w-3.5 h-3.5" /> What Is KlothOS SaaS?
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          See the Complete SaaS Architecture in Action
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base mb-8">
          Interactive step-by-step product walkthrough demonstrating how KlothOS connects store counters, WhatsApp messaging, and AI deadstock analytics.
        </p>

        {/* INTERACTIVE VIDEO COMPONENT */}
        <SaaSExplainerVideo />
      </section>

      {/* GSAP 3D FEATURE SHOWCASE MATRIX */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> Core Product Pillars
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Engineered for High-Volume Apparel Retail
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Every tool is designed specifically for fashion stores—eliminating friction at checkout while driving repeat customer revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Gsap3DTiltCard maxRotation={15}>
            <div className="h-full p-8 rounded-3xl border border-border/80 bg-card hover:border-primary/50 transition-all shadow-lg flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">0.8s Ultra POS</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Blazing fast billing interface built for high-footfall apparel stores. Scan tags, auto-apply discounts, and process payments without delays.
                </p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-2 border-t border-border/60 pt-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Offline store sync</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Multi-counter support</li>
              </ul>
            </div>
          </Gsap3DTiltCard>

          <Gsap3DTiltCard maxRotation={15}>
            <div className="h-full p-8 rounded-3xl border border-border/80 bg-card hover:border-emerald-500/50 transition-all shadow-lg flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">WhatsApp Receipts</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Send digital PDF bills directly to customer WhatsApp. Zero paper cost, 98% open rates, and instant loyalty coin updates.
                </p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-2 border-t border-border/60 pt-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Official Business API</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Single-click PDF download</li>
              </ul>
            </div>
          </Gsap3DTiltCard>

          <Gsap3DTiltCard maxRotation={15}>
            <div className="h-full p-8 rounded-3xl border border-border/80 bg-card hover:border-blue-500/50 transition-all shadow-lg flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">AI Deadstock Radar</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Matrix analysis pinpoints non-moving size variants (e.g. Size 38 Trousers sitting &gt; 45 days) and automates targeted clearance campaigns.
                </p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-2 border-t border-border/60 pt-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Automated cash recovery</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Size breakdown heatmaps</li>
              </ul>
            </div>
          </Gsap3DTiltCard>

          <Gsap3DTiltCard maxRotation={15}>
            <div className="h-full p-8 rounded-3xl border border-border/80 bg-card hover:border-purple-500/50 transition-all shadow-lg flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Automated VIP Loyalty</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Reward shoppers with coin points (Silver, Gold, Black VIP). Trigger birthday discounts and exclusive catalog drops on WhatsApp.
                </p>
              </div>
              <ul className="text-xs text-muted-foreground space-y-2 border-t border-border/60 pt-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> Tiered membership rules</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> LTV tracking dashboard</li>
              </ul>
            </div>
          </Gsap3DTiltCard>

        </div>
      </section>

      {/* HANDS-ON INTERACTIVE POS SIMULATOR WIDGET */}
      <section id="simulator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl shadow-2xl p-6 sm:p-12">
          
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5" /> Hands-On Interactive Simulator
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Experience the KlothOS Checkout Flow
            </h2>
            <p className="text-sm text-muted-foreground">
              Select an apparel item and customer below to see how KlothOS instantly calculates totals, applies VIP rewards, and dispatches a WhatsApp bill.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ITEM & CUSTOMER SELECTOR PANEL */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* STEP 1: SELECT ITEM */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">
                  Step 1: Select Item to Scan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SIMULATOR_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSimSelectedItem(item);
                        setSimBillSent(false);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        simSelectedItem.id === item.id
                          ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/30'
                          : 'border-border/80 bg-background hover:bg-muted/50'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
                        {item.tag}
                      </span>
                      <div className="font-bold text-sm text-foreground mt-2">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.size} • {item.color}</div>
                      <div className="text-sm font-mono font-bold text-foreground mt-2">₹{item.price.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* STEP 2: SELECT CUSTOMER */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">
                  Step 2: Select VIP Customer Profile
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SIMULATOR_CUSTOMERS.map((cust) => (
                    <button
                      key={cust.id}
                      onClick={() => {
                        setSimSelectedCustomer(cust);
                        setSimBillSent(false);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        simSelectedCustomer.id === cust.id
                          ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/30'
                          : 'border-border/80 bg-background hover:bg-muted/50'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded">
                        {cust.tier}
                      </span>
                      <div className="font-bold text-sm text-foreground mt-2">{cust.name}</div>
                      <div className="text-xs font-mono text-muted-foreground">{cust.phone}</div>
                      <div className="text-xs font-mono text-amber-600 font-medium mt-1">{cust.coins} Coins</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SIMULATED BILL SUMMARY ACTION */}
              <div className="p-6 rounded-2xl bg-muted/40 border border-border/80 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Cart Total (GST 12% Incl.)</div>
                  <div className="text-2xl font-extrabold font-mono text-foreground">
                    ₹{Math.round(simSelectedItem.price * 1.12).toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium mt-0.5">
                    + {Math.round(simSelectedItem.price * 0.05)} Reward Coins Earned
                  </div>
                </div>

                <button
                  onClick={() => setSimBillSent(true)}
                  disabled={simBillSent}
                  className="px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{simBillSent ? 'Bill Sent on WhatsApp!' : 'Process & Dispatch WhatsApp Bill'}</span>
                </button>
              </div>

            </div>

            {/* LIVE WHATSAPP PREVIEW SCREEN */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-border bg-slate-950 text-white p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">WhatsApp Simulator</span>
                </div>

                {simBillSent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-3"
                  >
                    <div className="bg-emerald-950/80 border border-emerald-800 p-3 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">K</div>
                      <div>
                        <div className="text-xs font-bold">KlothOS Store Official</div>
                        <div className="text-[10px] text-emerald-400">Message Delivered</div>
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs space-y-3">
                      <p className="font-semibold text-emerald-400">
                        Hello {simSelectedCustomer.name}! Thank you for your purchase at KlothOS.
                      </p>
                      
                      <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                        <div>Item: {simSelectedItem.name} ({simSelectedItem.size})</div>
                        <div>Price: ₹{simSelectedItem.price.toLocaleString()}</div>
                        <div>Total Bill: ₹{Math.round(simSelectedItem.price * 1.12).toLocaleString()}</div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-300">TaxInvoice_#KL7741.pdf</span>
                        <span className="text-emerald-400 font-bold">Download PDF</span>
                      </div>

                      <div className="text-[11px] text-amber-300 border-t border-slate-800 pt-2 flex justify-between">
                        <span>New Loyalty Coin Balance:</span>
                        <span className="font-bold">{simSelectedCustomer.coins + Math.round(simSelectedItem.price * 0.05)} Coins</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="py-16 text-center text-slate-500 space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-700 animate-pulse" />
                    <div className="text-xs">Click "Process & Dispatch WhatsApp Bill" to see live simulation</div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* DYNAMIC FINANCIAL ROI CALCULATOR */}
      <section id="roi-calculator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card via-background to-card p-6 sm:p-12 shadow-2xl">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 text-xs font-semibold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" /> Savings & Profit Calculator
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground">
              Calculate Your Store's Annual ROI
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              See how much paper cost, checkout labor, and deadstock capital KlothOS recovers for your store.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* SLIDERS INPUT */}
            <div className="lg:col-span-6 space-y-8">
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-foreground">Monthly Bill / Invoice Volume</label>
                  <span className="text-base font-bold font-mono text-primary">{calcBillsPerMonth.toLocaleString()} Bills/Mo</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={calcBillsPerMonth}
                  onChange={(e) => setCalcBillsPerMonth(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                  <span>200 bills</span>
                  <span>5,000 bills</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-foreground">Estimated Non-Moving Deadstock Value</label>
                  <span className="text-base font-bold font-mono text-primary">₹{calcDeadStockValue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="25000"
                  value={calcDeadStockValue}
                  onChange={(e) => setCalcDeadStockValue(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
                  <span>₹50,000</span>
                  <span>₹20,000,000</span>
                </div>
              </div>

            </div>

            {/* FINANCIAL PROJECTION DISPLAY BOX */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl border border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-2xl space-y-6">
                
                <div className="text-xs font-mono text-primary uppercase font-bold tracking-wider">
                  PROJECTED ANNUAL VALUE ADDED
                </div>

                <div className="text-4xl sm:text-6xl font-extrabold text-foreground font-mono">
                  ₹{totalValueAddedYearly.toLocaleString()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60">
                  <div>
                    <div className="text-xs text-muted-foreground">Paper Bill Savings</div>
                    <div className="text-lg font-bold font-mono text-emerald-600">₹{paperCostSavedYearly.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Deadstock Recovered</div>
                    <div className="text-lg font-bold font-mono text-blue-600">₹{deadStockRecoveredYearly.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Checkout Hours Saved</div>
                    <div className="text-lg font-bold font-mono text-purple-600">{checkoutHoursSavedMonthly * 12} Hrs/Yr</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ENTERPRISE MARQUEE & METRICS SECTION */}
      <section id="testimonials" className="py-16 border-t border-b border-border/60 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-foreground">₹120Cr+</div>
              <div className="text-xs text-muted-foreground mt-1">Processed Volume</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-foreground">450+</div>
              <div className="text-xs text-muted-foreground mt-1">Active Retail Outlets</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-foreground">99.99%</div>
              <div className="text-xs text-muted-foreground mt-1">Cloud Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-foreground">3.8M+</div>
              <div className="text-xs text-muted-foreground mt-1">WhatsApp Bills Sent</div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER & CTA */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center space-y-8">
        <KlothOSLogo size={48} className="mx-auto" />
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          KlothOS SaaS Inc. • Empowering fashion brands with real-time POS, WhatsApp paperless receipts, and AI deadstock liquidation.
        </p>
        <div className="text-xs text-muted-foreground border-t border-border/60 pt-8">
          © {new Date().getFullYear()} KlothOS. All rights reserved. Built for high-volume retail.
        </div>
      </footer>

      {/* STICKY BOTTOM BAR ON SCROLL */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-full bg-card/90 border border-primary/40 backdrop-blur-2xl shadow-2xl flex items-center gap-6"
          >
            <div className="hidden sm:block text-xs font-semibold">
              Ready to upgrade your store?
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
            >
              <span>Login to Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STORE SELECTOR & LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <KlothOSLogo size={48} className="mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-foreground">Select Store Outlet</h3>
                  <p className="text-xs text-muted-foreground">Select your store counter location to access POS & Analytics</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-2">Store Outlet</label>
                    <select
                      value={storeId}
                      onChange={(e) => setStoreId(e.target.value)}
                      className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="bandra-west">Bandra West Flagship Store (Terminal #01)</option>
                      <option value="juhu">Juhu Apparel Studio (Terminal #02)</option>
                      <option value="indiranagar">Indiranagar Bengaluru (Terminal #01)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-2">Cashier / Staff PIN</label>
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="1234"
                      className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Enter KlothOS POS</span>
                  </button>
                </form>

                <div className="p-3 rounded-xl bg-muted/40 text-center text-xs text-muted-foreground">
                  Demo Credentials pre-filled for testing.
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
