import React, { useState, useEffect } from 'react';
import { KlothOSLogo } from '../components/KlothOSLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  Smartphone, 
  Flame, 
  ChevronRight, 
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
  Star
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
  const [simStep, setSimStep] = useState<1 | 2 | 3>(1);
  const [simBillSent, setSimBillSent] = useState<boolean>(false);

  // Interactive ROI Calculator State
  const [calcBillsPerMonth, setCalcBillsPerMonth] = useState<number>(1200);
  const [calcDeadStockValue, setCalcDeadStockValue] = useState<number>(350000);

  // Feature Showcase Active Tab
  const [activeFeatureTab, setActiveFeatureTab] = useState<'matrix' | 'whatsapp' | 'deadstock'>('matrix');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  // ROI Calculations
  const paperCostSavedYearly = Math.round(calcBillsPerMonth * 12 * 6.5); // ₹6.50 per paper invoice
  const checkoutHoursSavedMonthly = Math.round((calcBillsPerMonth * 2.5) / 60); // 2.5 mins saved per checkout
  const deadStockRecoveredYearly = Math.round(calcDeadStockValue * 0.45); // 45% liquidation lift
  const totalValueAddedYearly = paperCostSavedYearly + deadStockRecoveredYearly + (checkoutHoursSavedMonthly * 12 * 350);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground relative overflow-x-hidden">
      
      {/* AMBIENT BACKGROUND GLOW BLOBS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10 opacity-60 dark:opacity-40">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-48 right-1/4 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[160px]" />
      </div>

      {/* PUBLIC NAVBAR */}
      <header className="h-20 px-6 sm:px-12 border-b border-border/80 bg-card/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <KlothOSLogo size={38} />
          <span className="font-extrabold text-xl tracking-tight text-foreground">
            KlothOS
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-muted-foreground">
          <a href="#simulator" className="hover:text-foreground transition-colors">Live Simulator</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#calculator" className="hover:text-foreground transition-colors">ROI Calculator</a>
          <a href="#comparison" className="hover:text-foreground transition-colors">Comparison</a>
        </nav>

        {/* Right Auth Buttons & Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl bg-secondary/80 hover:bg-muted text-foreground border border-border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-xs"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <>
                <Sun size={15} className="text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon size={15} className="text-primary" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2.5 text-xs font-bold text-foreground hover:bg-secondary rounded-xl border border-border transition-all cursor-pointer"
          >
            Sign In
          </button>

          <button
            onClick={onLogin}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl shadow-md hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Flame size={15} /> Launch POS &rarr;
          </button>
        </div>
      </header>

      {/* BODY CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-12 space-y-24">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl bg-card/60 backdrop-blur-xl border border-border/80 p-8 sm:p-14 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-extrabold tracking-wide uppercase shadow-xs"
              >
                <Sparkles size={14} /> Zero Barcode Scanners Needed &bull; Built for Apparel Boutiques
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-6xl font-black text-foreground tracking-tight leading-[1.08]"
              >
                Bill Clothes in 3 Taps.{' '}
                <span className="bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent underline decoration-primary/30 decoration-wavy">
                  Retain Walk-ins on WhatsApp.
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-muted-foreground font-normal leading-relaxed max-w-2xl"
              >
                KlothOS replaces legacy barcode scanners with a lightning-fast garment touch matrix. Automate paperless WhatsApp invoicing, customer loyalty, and targeted dead-stock clearance in one seamless operating system.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <button
                  onClick={onLogin}
                  className="px-8 py-4 bg-primary text-primary-foreground font-black text-sm rounded-2xl shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer"
                >
                  <Flame size={20} /> Launch Fast Billing <ArrowRight size={18} />
                </button>

                <a
                  href="#simulator"
                  className="px-6 py-4 bg-secondary text-secondary-foreground hover:text-foreground font-bold text-sm rounded-2xl border border-border hover:bg-muted transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Smartphone size={18} className="text-primary" /> Try Interactive Simulator
                </a>
              </motion.div>

              {/* Stat Highlights Pill */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-6 grid grid-cols-3 gap-6 border-t border-border/60 text-xs"
              >
                <div>
                  <p className="font-mono text-2xl font-black text-foreground">3 Taps</p>
                  <p className="text-muted-foreground font-medium">Average checkout speed</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-black text-primary">97.4%</p>
                  <p className="text-muted-foreground font-medium">WhatsApp receipt open rate</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-black text-foreground">4.2x</p>
                  <p className="text-muted-foreground font-medium">Customer repeat visits</p>
                </div>
              </motion.div>
            </div>

            {/* Right Live App Mock Card Frame */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-2xl bg-card border border-border/80 shadow-2xl p-5 overflow-hidden">
                {/* Header bar of mock frame */}
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-destructive/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="ml-2 font-mono text-[11px] text-muted-foreground">pos.klothos.app</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live Register #01
                  </span>
                </div>

                {/* Mock POS Garment Grid Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <ShoppingBag size={14} className="text-primary" /> Fast Touch Matrix
                    </span>
                    <span className="text-[10px] text-muted-foreground">Category: Shirts</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {SIMULATOR_ITEMS.slice(0, 2).map((item) => (
                      <div key={item.id} className="p-3 rounded-xl bg-secondary/60 border border-border/60 text-xs space-y-1">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-foreground truncate">{item.name}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{item.size} &bull; {item.color}</span>
                        <div className="flex justify-between items-center pt-1">
                          <span className="font-bold font-mono text-primary">₹{item.price}</span>
                          <span className="text-[9px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">+ Add</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Simulated Receipt Preview Pill */}
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-primary text-[11px]">
                      <span className="flex items-center gap-1">
                        <MessageSquare size={14} /> Instant WhatsApp Bill
                      </span>
                      <span className="font-mono text-emerald-600">DELIVERED</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Invoice #INV-8842 sent to Rohan S. (+91 98201 44820) with 172 Loyalty Coins credited.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge overlay */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-5 -left-5 bg-card/90 backdrop-blur-md border border-border p-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-xs z-20 hidden sm:flex"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
                  <Zap size={18} />
                </div>
                <div>
                  <p className="font-bold text-foreground">2.1 Seconds Checkout</p>
                  <p className="text-[10px] text-muted-foreground">Zero manual barcode typing</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SECTION: INTERACTIVE 3-STEP POS & WHATSAPP SIMULATOR */}
        <section id="simulator" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20">
              Interactive Test Drive
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Experience KlothOS Right Now
            </h2>
            <p className="text-sm text-muted-foreground">
              Try the 3-step billing process below and watch the simulated WhatsApp paperless invoice get generated live!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-card/40 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-10 shadow-lg">
            
            {/* Left Steps Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step Indicators */}
              <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
                <button
                  onClick={() => setSimStep(1)}
                  className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    simStep === 1 ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-secondary/60 text-muted-foreground'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-primary-foreground/20 text-primary-foreground flex items-center justify-center text-[10px]">1</span>
                  Select Item
                </button>
                <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                <button
                  onClick={() => setSimStep(2)}
                  className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    simStep === 2 ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-secondary/60 text-muted-foreground'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-primary-foreground/20 text-primary-foreground flex items-center justify-center text-[10px]">2</span>
                  Select Customer
                </button>
                <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                <button
                  onClick={() => setSimStep(3)}
                  className={`flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    simStep === 3 ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-secondary/60 text-muted-foreground'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-primary-foreground/20 text-primary-foreground flex items-center justify-center text-[10px]">3</span>
                  Send Bill
                </button>
              </div>

              {/* Step 1: Garment Matrix Selector */}
              {simStep === 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground">Step 1: Tap a Garment to Add to Cart</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SIMULATOR_ITEMS.map((item) => {
                      const isSelected = simSelectedItem.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSimSelectedItem(item)}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-primary/10 border-primary ring-2 ring-primary/30' 
                              : 'bg-card border-border hover:bg-secondary/60'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-primary/20 text-primary">
                              {item.tag}
                            </span>
                            {isSelected && <CheckCircle2 size={16} className="text-primary" />}
                          </div>
                          <p className="font-bold text-xs text-foreground">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground">{item.size} &bull; {item.color}</p>
                          <p className="font-mono text-xs font-bold text-primary pt-2">₹{item.price}</p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setSimStep(2)}
                      className="px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
                    >
                      Next: Choose Customer &rarr;
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Customer Selector */}
              {simStep === 2 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground">Step 2: Select Walk-In Customer</h3>
                  <div className="space-y-2.5">
                    {SIMULATOR_CUSTOMERS.map((cust) => {
                      const isSelected = simSelectedCustomer.id === cust.id;
                      return (
                        <button
                          key={cust.id}
                          onClick={() => setSimSelectedCustomer(cust)}
                          className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-primary/10 border-primary ring-2 ring-primary/30' 
                              : 'bg-card border-border hover:bg-secondary/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={`https://api.dicebear.com/9.x/notionists/svg?seed=${cust.name.replace(' ', '')}`}
                              alt={cust.name}
                              className="w-10 h-10 rounded-full bg-secondary border border-border"
                            />
                            <div className="text-left">
                              <p className="font-bold text-xs text-foreground">{cust.name}</p>
                              <p className="text-[11px] text-muted-foreground">{cust.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              {cust.tier}
                            </span>
                            {isSelected && <CheckCircle2 size={18} className="text-primary" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between pt-2">
                    <button
                      onClick={() => setSimStep(1)}
                      className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      &larr; Back to Garment
                    </button>
                    <button
                      onClick={() => setSimStep(3)}
                      className="px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer"
                    >
                      Next: Review & Send Bill &rarr;
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Send Bill & Trigger WhatsApp */}
              {simStep === 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground">Step 3: Trigger Instant WhatsApp Paperless Bill</h3>
                  
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-3 text-xs">
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Selected Item:</span>
                      <span className="font-bold text-foreground">{simSelectedItem.name} ({simSelectedItem.size})</span>
                    </div>
                    <div className="flex justify-between border-b border-border pb-2">
                      <span className="text-muted-foreground">Customer:</span>
                      <span className="font-bold text-foreground">{simSelectedCustomer.name} ({simSelectedCustomer.phone})</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-foreground pt-1">
                      <span>Grand Total:</span>
                      <span className="font-mono text-primary">₹{simSelectedItem.price}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setSimStep(2)}
                      className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      &larr; Change Customer
                    </button>

                    <button
                      onClick={() => setSimBillSent(true)}
                      className={`px-8 py-3.5 text-xs font-black rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                        simBillSent 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-primary text-primary-foreground hover:shadow-primary/30 hover:scale-[1.02]'
                      }`}
                    >
                      {simBillSent ? (
                        <>
                          <CheckCircle2 size={18} /> WhatsApp Bill Sent!
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Generate & Deliver Invoice &rarr;
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right iPhone Simulated WhatsApp Screen */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[320px] rounded-[36px] bg-slate-950 p-3 shadow-2xl border-4 border-slate-800 text-slate-100">
                {/* Notch & Speaker Bar */}
                <div className="flex justify-center pb-2">
                  <div className="w-24 h-4 bg-slate-800 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
                  </div>
                </div>

                {/* WhatsApp Chat Top Header */}
                <div className="bg-emerald-800 p-3 rounded-t-2xl flex items-center gap-2.5">
                  <KlothOSLogo size={24} />
                  <div className="flex-1">
                    <p className="font-bold text-xs leading-none text-white">KlothOS Flagship</p>
                    <p className="text-[9px] text-emerald-200">Verified Business Account</p>
                  </div>
                </div>

                {/* Chat Body Bubble */}
                <div className="bg-slate-900 min-h-[280px] p-3 rounded-b-2xl space-y-3 font-sans text-xs">
                  <div className="bg-emerald-950/80 border border-emerald-800/60 p-3 rounded-2xl rounded-tl-xs space-y-2 text-[11px] shadow-sm">
                    <p className="font-semibold text-emerald-300">
                      Hello {simSelectedCustomer.name}! 🛍️
                    </p>
                    <p className="text-slate-300">
                      Thank you for visiting KlothOS Bandra Flagship. Here is your digital tax invoice:
                    </p>
                    
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 space-y-1">
                      <p className="font-bold text-white text-[10px]">Invoice #INV-2026-904</p>
                      <p className="text-slate-400 text-[10px]">{simSelectedItem.name} ({simSelectedItem.size})</p>
                      <p className="font-mono text-emerald-400 font-bold text-[11px]">Total Paid: ₹{simSelectedItem.price}</p>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1">
                      <span>Coins Earned: +{Math.round(simSelectedItem.price * 0.05)}</span>
                      <span>18:32 ✔✔</span>
                    </div>
                  </div>

                  {simBillSent && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center text-[10px] text-emerald-400 font-bold bg-emerald-950/40 p-2 rounded-xl border border-emerald-800/40"
                    >
                      ⚡ Customer received receipt on WhatsApp!
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: INTERACTIVE ROI CALCULATOR */}
        <section id="calculator" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
              Interactive ROI Model
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Calculate Your Boutique's Annual Savings
            </h2>
            <p className="text-sm text-muted-foreground">
              Adjust the sliders below to estimate your exact paper costs saved, checkout hours recovered, and unlocked dead-stock capital.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-card/60 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-10 shadow-lg">
            
            {/* Left Sliders */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Slider 1: Monthly Bills */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Monthly Bills Processed:</span>
                  <span className="font-mono text-primary font-black text-sm">{calcBillsPerMonth.toLocaleString()} bills / mo</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={calcBillsPerMonth}
                  onChange={(e) => setCalcBillsPerMonth(Number(e.target.value))}
                  className="w-full h-2.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                  <span>200 bills</span>
                  <span>2,500 bills</span>
                  <span>5,000 bills</span>
                </div>
              </div>

              {/* Slider 2: Dead Stock Capital */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">Estimated Rack Dead-Stock Capital:</span>
                  <span className="font-mono text-amber-500 font-black text-sm">₹{calcDeadStockValue.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="50000"
                  value={calcDeadStockValue}
                  onChange={(e) => setCalcDeadStockValue(Number(e.target.value))}
                  className="w-full h-2.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                  <span>₹50,000</span>
                  <span>₹10,000,000</span>
                  <span>₹2,000,000</span>
                </div>
              </div>
            </div>

            {/* Right Live Savings Output Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-card via-card to-accent/40 border border-border p-6 rounded-2xl space-y-6 shadow-md">
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Calculator size={16} className="text-primary" /> Projected Yearly Impact
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-muted-foreground">Paper Invoices Saved:</span>
                  <span className="font-mono font-bold text-foreground text-sm">₹{paperCostSavedYearly.toLocaleString('en-IN')} / yr</span>
                </div>

                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-muted-foreground">Cashier Time Recovered:</span>
                  <span className="font-mono font-bold text-foreground text-sm">{checkoutHoursSavedMonthly} hrs / month</span>
                </div>

                <div className="flex justify-between items-center border-b border-border pb-3">
                  <span className="text-muted-foreground">Dead-Stock Liquidation Lift:</span>
                  <span className="font-mono font-bold text-amber-500 text-sm">₹{deadStockRecoveredYearly.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-1">
                <p className="text-[10px] uppercase font-extrabold text-primary tracking-widest">Total Estimated Value Created</p>
                <p className="font-mono text-3xl font-black text-primary">₹{totalValueAddedYearly.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-muted-foreground font-medium pt-1">
                  Based on paper cost reduction, employee productivity gain, and dead-stock clearance lift.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: TABBED FEATURE SHOWCASE */}
        <section id="features" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Engineered Specially for Fashion Retailers
            </h2>
          </div>

          {/* Feature Tabs Selector */}
          <div className="flex justify-center gap-2 max-w-xl mx-auto bg-card border border-border p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveFeatureTab('matrix')}
              className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeFeatureTab === 'matrix' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Touch Garment Matrix
            </button>
            <button
              onClick={() => setActiveFeatureTab('whatsapp')}
              className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeFeatureTab === 'whatsapp' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              WhatsApp Invoicing
            </button>
            <button
              onClick={() => setActiveFeatureTab('deadstock')}
              className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeFeatureTab === 'deadstock' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dead-Stock Radar
            </button>
          </div>

          {/* Feature Tab Contents */}
          <div className="bg-card/60 backdrop-blur-xl border border-border/80 rounded-3xl p-8 sm:p-12 shadow-lg">
            {activeFeatureTab === 'matrix' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold">
                    <ShoppingBag size={22} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">Tap & Bill in Seconds</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Say goodbye to bulky barcode scanners and missing price tags. KlothOS presents an intuitive color & size matrix allowing cashiers to select items with single taps.
                  </p>
                  <ul className="space-y-2 text-xs font-semibold text-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Single tap size/color swatches</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Instant stock sync across registers</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Built-in custom discounts & coin redemption</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-secondary/60 border border-border space-y-3">
                  <p className="text-xs font-bold text-foreground">Matrix Performance Benchmark</p>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-muted-foreground mb-1">
                        <span>KlothOS Touch Matrix</span>
                        <span className="text-primary">2.1 seconds</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[25%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-muted-foreground mb-1">
                        <span>Legacy Barcode POS</span>
                        <span>14.5 seconds</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-muted-foreground/40 rounded-full w-[90%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeFeatureTab === 'whatsapp' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold">
                    <MessageSquare size={22} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">97% Open Rate Paperless Bills</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Paper receipts end up in the trash. KlothOS auto-delivers official PDF & interactive text invoices directly to the customer's WhatsApp number.
                  </p>
                  <ul className="space-y-2 text-xs font-semibold text-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Automatic WhatsApp Cloud API integration</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Zero paper roll printing costs</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Track bill delivery & read receipts</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 text-xs space-y-2">
                  <p className="font-bold text-emerald-400">Meta API Verified Delivery Status</p>
                  <p className="text-muted-foreground text-[11px]">Average delivery latency: 840ms across all Indian telecom networks.</p>
                </div>
              </motion.div>
            )}

            {activeFeatureTab === 'deadstock' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
                    <BarChart3 size={22} />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">Clear Idle Rack Capital Fast</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    KlothOS automatically tracks rack age for every garment SKU. Identify slow-moving items over 60 days idle and liquidate them to relevant customer cohorts.
                  </p>
                  <ul className="space-y-2 text-xs font-semibold text-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-500" /> Automatic rack-age detection (30/60/90 days)</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-500" /> Idle capital valuation counter</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-500" /> Targeted clearance triggers</li>
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                  <p className="font-bold text-amber-500">Rack Capital Liquidation Engine</p>
                  <p className="text-muted-foreground text-[11px]">Boutiques report an average ₹2.4 Lakhs in unlocked capital within 30 days of implementation.</p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* SECTION: LEGACY VS KLOTHOS COMPARISON */}
        <section id="comparison" className="scroll-mt-28 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20">
              Why Upgrade
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Legacy POS vs. KlothOS Operating System
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse bg-card/60 backdrop-blur-xl border border-border rounded-3xl shadow-lg">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-extrabold uppercase tracking-wider">
                  <th className="p-4 sm:p-6">Feature</th>
                  <th className="p-4 sm:p-6 bg-secondary/40 text-muted-foreground">Legacy Barcode POS</th>
                  <th className="p-4 sm:p-6 bg-primary/10 text-primary font-black">KlothOS Touch OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-foreground">Checkout Method</td>
                  <td className="p-4 sm:p-6 text-muted-foreground bg-secondary/20">Barcode scanner gun required</td>
                  <td className="p-4 sm:p-6 font-bold text-foreground bg-primary/5">3-tap Garment Touch Matrix</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-foreground">Receipt Delivery</td>
                  <td className="p-4 sm:p-6 text-muted-foreground bg-secondary/20">Thermal paper rolls (Gets thrown away)</td>
                  <td className="p-4 sm:p-6 font-bold text-emerald-600 dark:text-emerald-400 bg-primary/5">Instant WhatsApp Paperless Invoice</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-foreground">Hardware Needed</td>
                  <td className="p-4 sm:p-6 text-muted-foreground bg-secondary/20">Heavy desktop, barcode gun, thermal printer</td>
                  <td className="p-4 sm:p-6 font-bold text-foreground bg-primary/5">Any iPad, Laptop, or Tablet browser</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-foreground">Dead-Stock Monitoring</td>
                  <td className="p-4 sm:p-6 text-muted-foreground bg-secondary/20">Manual spreadsheet checks</td>
                  <td className="p-4 sm:p-6 font-bold text-amber-500 bg-primary/5">Automated Rack-Age Radar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1 rounded-full border border-primary/20">
              Trusted by Top Boutiques
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Loved by Fashion Retailers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Vikram Merchant',
                role: 'Founder, Bandra Linen Atelier',
                text: 'Switching to KlothOS eliminated barcode scanners completely. Our cashiers bill items in seconds, and customers love getting receipts on WhatsApp!',
                seed: 'Vikram'
              },
              {
                name: 'Radhika Sen',
                role: 'Owner, Juhu Silk & Apparel',
                text: 'The dead-stock clearance feature alone recovered ₹3.2 Lakhs in idle rack capital within our first month of operation.',
                seed: 'Radhika'
              },
              {
                name: 'Karan Mehra',
                role: 'Director, Kala Ghoda Denims',
                text: 'Zero paper roll printing costs and 97% WhatsApp open rate. KlothOS is hands down the best POS investment we have made.',
                seed: 'Karan'
              }
            ].map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground italic leading-relaxed">"{t.text}"</p>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                  <img
                    src={`https://api.dicebear.com/9.x/notionists/svg?seed=${t.seed}`}
                    alt={t.name}
                    className="w-9 h-9 rounded-full bg-secondary border border-border"
                  />
                  <div>
                    <p className="font-bold text-xs text-foreground">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/90 via-primary to-amber-500 text-primary-foreground p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Modernize Your Store Billing?
          </h2>
          <p className="text-sm sm:text-base font-medium max-w-xl mx-auto opacity-95">
            Launch KlothOS in under 2 minutes. Zero hardware setup required.
          </p>
          <div className="flex justify-center pt-2">
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-slate-950 text-white hover:bg-slate-900 font-black text-sm rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer"
            >
              <Flame size={20} className="text-primary" /> Launch POS Dashboard Now &rarr;
            </button>
          </div>
        </section>
      </main>

      {/* STICKY FLOATING CONVERSION BAR ON SCROLL */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-card/90 backdrop-blur-xl border border-border px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 text-xs max-w-md w-[92%]"
          >
            <KlothOSLogo size={28} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground truncate">KlothOS Touch POS</p>
              <p className="text-[10px] text-muted-foreground truncate">Bill clothes in 3 taps on WhatsApp</p>
            </div>
            <button
              onClick={onLogin}
              className="px-4 py-2 bg-primary text-primary-foreground font-black text-xs rounded-xl shadow-md hover:opacity-90 transition-all shrink-0 cursor-pointer"
            >
              Launch &rarr;
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIGN IN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-2 text-center">
                <KlothOSLogo size={44} className="mx-auto" />
                <h3 className="text-xl font-extrabold text-foreground">Sign In to Register</h3>
                <p className="text-xs text-muted-foreground">Select store outlet and enter cashier PIN to launch POS</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5 text-left">
                  <label className="font-bold text-foreground">Select Store Branch</label>
                  <select 
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="w-full p-3 bg-input border border-border rounded-xl font-medium focus:ring-2 focus:ring-ring"
                  >
                    <option value="bandra-west">Bandra West Flagship (#01)</option>
                    <option value="juhu-studio">Juhu Studio (#02)</option>
                    <option value="kala-ghoda">Kala Ghoda Atelier (#03)</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="font-bold text-foreground">Cashier PIN</label>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN"
                    className="w-full p-3 bg-input border border-border rounded-xl font-mono text-center text-sm font-bold tracking-widest focus:ring-2 focus:ring-ring"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-primary-foreground font-black text-xs rounded-xl shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock size={15} /> Authenticate & Open Register &rarr;
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card/40 py-8 px-6 text-center text-xs text-muted-foreground space-y-2">
        <p>&copy; 2026 KlothOS Operating System. All rights reserved.</p>
        <p className="text-[10px]">Meta WhatsApp Cloud API v19.0 Verified Partner</p>
      </footer>
    </div>
  );
};

export default LandingView;
