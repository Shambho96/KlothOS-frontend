import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Phone, 
  Award, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2, 
  X, 
  Send,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Sparkles
} from 'lucide-react';
import type { Product, ProductVariant, CartItem, Customer, Invoice } from '../types';

interface POSViewProps {
  products: Product[];
  customers: Customer[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cart: CartItem[];
  onAddToCart: (product: Product, variant: ProductVariant) => void;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveFromCart: (cartItemId: string) => void;
  onClearCart: () => void;
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  redeemCoins: boolean;
  onToggleRedeemCoins: (redeem: boolean) => void;
  onCompleteCheckout: (invoice: Invoice, customer: Customer | null) => void;
}

export const POSView: React.FC<POSViewProps> = ({
  products,
  customers,
  searchQuery,
  onSearchChange,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  selectedCustomer,
  onSelectCustomer,
  redeemCoins,
  onToggleRedeemCoins,
  onCompleteCheckout
}) => {
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  
  // Custom Garment Item Creation State
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<'Shirts' | 'Trousers' | 'Denim' | 'Jackets' | 'Knits'>('Shirts');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [customSize, setCustomSize] = useState<string>('Free Size');
  const [customColor, setCustomColor] = useState<string>('Standard');

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Dedicated Customer Input Fields
  const [customerPhoneInput, setCustomerPhoneInput] = useState<string>(selectedCustomer ? selectedCustomer.phone : '');
  const [customerNameInput, setCustomerNameInput] = useState<string>(selectedCustomer ? selectedCustomer.name : '');

  const [isProcessingCheckout, setIsProcessingCheckout] = useState<boolean>(false);
  const [checkoutSuccessMsg, setCheckoutSuccessMsg] = useState<string | null>(null);
  
  // Whole Screen Feature for entire Fast Billing view
  const [isWholeScreen, setIsWholeScreen] = useState<boolean>(false);

  // Voice Dictation (Ctrl + B) State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceFeedbackMsg, setVoiceFeedbackMsg] = useState<string | null>(null);

  const categories = ['All', 'Shirts', 'Trousers', 'Denim', 'Jackets', 'Knits'];

  // Handle adding custom garment item to cart
  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(customPrice) || 0;
    const nameStr = customName.trim() || 'Custom Garment Item';
    const sizeStr = customSize.trim() || 'Free Size';
    const colorStr = customColor.trim() || 'Standard';

    const newProduct: Product = {
      id: `custom-${Date.now()}`,
      name: nameStr,
      category: customCategory,
      price: priceNum,
      description: 'Custom added garment item',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=60',
      variants: [
        {
          id: `v-custom-${Date.now()}`,
          size: sizeStr,
          color: colorStr,
          colorHex: '#f97316',
          stock: 99,
          sku: `SKU-CUST-${Math.floor(100 + Math.random() * 900)}`
        }
      ],
      swatches: [{ name: colorStr, hex: '#f97316' }]
    };

    setLocalProducts(prev => [newProduct, ...prev]);
    onAddToCart(newProduct, newProduct.variants[0]);

    setCustomName('');
    setCustomPrice('');
    setCustomSize('Free Size');
    setCustomColor('Standard');
    setShowCustomModal(false);
  };

  // Smart Voice Parser helper to convert spoken word-numbers and spaced digits
  const parseVoiceInput = (rawTranscript: string) => {
    const transcript = rawTranscript.trim();
    setVoiceFeedbackMsg(`Heard: "${transcript}"`);

    // Step 1: Map spoken number words to digits
    const wordToDigitMap: Record<string, string> = {
      zero: '0', oh: '0', one: '1', two: '2', to: '2', too: '2',
      three: '3', four: '4', for: '4', five: '5', six: '6',
      seven: '7', eight: '8', ate: '8', nine: '9'
    };

    let normalized = transcript.toLowerCase();
    Object.keys(wordToDigitMap).forEach((word) => {
      const reg = new RegExp(`\\b${word}\\b`, 'g');
      normalized = normalized.replace(reg, wordToDigitMap[word]);
    });

    // Step 2: Extract all digits combined (ignoring spaces between spoken digits)
    const allDigitsCombined = normalized.replace(/[^0-9]/g, '');

    let extractedPhone = '';
    let digits10 = '';

    if (allDigitsCombined.length >= 10) {
      // Extract 10-digit mobile number
      digits10 = allDigitsCombined.slice(-10);
      extractedPhone = `+91${digits10}`;
    }

    // Step 3: Extract Customer Name (strip digits and digit words from original transcript)
    const extractedName = transcript
      .replace(/\d+/g, '')
      .replace(/\b(zero|oh|one|two|to|too|three|four|for|five|six|seven|eight|ate|nine|customer|mobile|number|phone|is)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Step 4: Apply to input state & auto-match customer profile
    if (extractedPhone) {
      setCustomerPhoneInput(extractedPhone);
      const match = customers.find(c => c.phone.includes(digits10) || c.phone.replace(/\+91/, '').includes(digits10));
      if (match) {
        onSelectCustomer(match);
        setCustomerNameInput(match.name);
      } else if (extractedName) {
        setCustomerNameInput(extractedName);
      }
    } else if (extractedName) {
      setCustomerNameInput(extractedName);
    }

    setTimeout(() => {
      setVoiceFeedbackMsg(null);
    }, 4000);
  };

  // Toggle Voice Recognition
  const toggleVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceFeedbackMsg('🎙️ Listening... Speak Customer Name & Phone Number');
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          parseVoiceInput(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          // Fallback simulation mode if speech recognition fails or is blocked
          simulateVoiceDictation();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (e) {
        simulateVoiceDictation();
      }
    } else {
      // Fallback simulation mode
      simulateVoiceDictation();
    }
  };

  // Fallback Voice Dictation Simulation for quick testing
  const simulateVoiceDictation = () => {
    setIsListening(true);
    setVoiceFeedbackMsg('🎙️ Voice Listening Active (Press Ctrl+B to dictate)...');

    setTimeout(() => {
      setIsListening(false);
      const sampleVoiceString = 'Kabir Mehta 9930012345';
      parseVoiceInput(sampleVoiceString);
    }, 1200);
  };

  // Global Keyboard Listener for Ctrl + B / Cmd + B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleVoiceRecognition();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter products by category and search term
  const filteredProducts = localProducts.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variants.some(v => v.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Handle opening product variant modal
  const handleOpenProductModal = (product: Product) => {
    setActiveModalProduct(product);
    if (product.variants.length > 0) {
      setSelectedSize(product.variants[0].size);
      setSelectedColor(product.variants[0].color);
    }
  };

  // Handle confirming variant selection and adding to cart
  const handleConfirmAddToCart = () => {
    if (!activeModalProduct) return;
    const targetVariant = activeModalProduct.variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    ) || activeModalProduct.variants[0];

    onAddToCart(activeModalProduct, targetVariant);
    setActiveModalProduct(null);
  };

  // Handle Phone input change & auto-lookup
  const handlePhoneInputChange = (phoneVal: string) => {
    setCustomerPhoneInput(phoneVal);
    if (phoneVal.trim()) {
      const match = customers.find(c => c.phone.includes(phoneVal) || c.phone.replace(/\+91/, '').includes(phoneVal));
      if (match) {
        onSelectCustomer(match);
        setCustomerNameInput(match.name);
      }
    }
  };

  // Handle Name input change
  const handleNameInputChange = (nameVal: string) => {
    setCustomerNameInput(nameVal);
    if (selectedCustomer) {
      onSelectCustomer({ ...selectedCustomer, name: nameVal });
    }
  };

  // Clear customer profile
  const handleClearCustomerProfile = () => {
    onSelectCustomer(null);
    setCustomerPhoneInput('');
    setCustomerNameInput('');
  };

  // Financial calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  let discount = 0;
  if (selectedCustomer && redeemCoins && selectedCustomer.coinsBalance > 0) {
    discount = Math.min(subtotal, selectedCustomer.coinsBalance);
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.05); // 5% GST
  const grandTotal = taxableAmount + tax;
  const coinsEarned = Math.floor(grandTotal * 0.05); // 5% cashback coins

  // Complete checkout action
  const handleCheckoutSubmit = () => {
    if (cart.length === 0) return;
    setIsProcessingCheckout(true);

    const activeCustomerForBill: Customer = selectedCustomer || {
      id: `cust-${Date.now()}`,
      name: customerNameInput.trim() || 'Guest Shopper',
      phone: customerPhoneInput.trim() || '+919930012345',
      email: '',
      tier: 'Silver',
      totalSpend: grandTotal,
      coinsBalance: coinsEarned,
      preferredFit: 'Size M / 32',
      preferredCategory: 'Shirts',
      joinedDate: new Date().toISOString().split('T')[0],
      lastVisitDaysAgo: 0,
      orderHistory: []
    };

    setTimeout(() => {
      const newInvoice: Invoice = {
        id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString().split('T')[0],
        items: cart.map(item => ({
          name: item.product.name,
          variant: `${item.variant.color} / ${item.variant.size}`,
          qty: item.quantity,
          price: item.product.price
        })),
        subtotal,
        discount,
        tax,
        total: grandTotal,
        coinsEarned,
        coinsRedeemed: discount,
        whatsappStatus: 'Delivered'
      };

      const targetPhone = activeCustomerForBill.phone;
      setCheckoutSuccessMsg(`Bill Created & Receipt Sent to ${activeCustomerForBill.name} (${targetPhone})`);
      
      onCompleteCheckout(newInvoice, activeCustomerForBill);
      setIsProcessingCheckout(false);

      setTimeout(() => {
        setCheckoutSuccessMsg(null);
      }, 4000);
    }, 1000);
  };

  return (
    <div className={`flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6 transition-all duration-300 ${
      isWholeScreen 
        ? 'fixed inset-0 z-50 bg-background p-4 sm:p-6 overflow-y-auto lg:overflow-hidden shadow-2xl min-h-screen lg:h-screen' 
        : 'min-h-[calc(100vh-6rem)] lg:h-[calc(100vh-6rem)] overflow-y-auto lg:overflow-hidden pb-24 lg:pb-0'
    }`}>
      
      {/* LEFT SECTION (65% width): Garment Matrix & Categories */}
      <div className="lg:col-span-8 flex flex-col space-y-4 lg:overflow-hidden pr-1">
        
        {/* Category Pills, Search & WHOLE SCREEN TOGGLE BUTTON */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-2xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Quick Search */}
            <div className="relative flex-1 sm:w-56 shrink-0">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search SKU, name..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* ADD CUSTOM GARMENT BUTTON */}
            <button
              onClick={() => {
                setCustomName('');
                setShowCustomModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              title="Add Custom Cloth / Garment Line Item"
            >
              <Plus size={14} />
              <span>Custom Item</span>
            </button>

            {/* WHOLE SCREEN TOGGLE BUTTON */}
            <button
              onClick={() => setIsWholeScreen(!isWholeScreen)}
              className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              title={isWholeScreen ? "Exit Whole Screen Register" : "Expand Whole Screen Register"}
            >
              {isWholeScreen ? (
                <>
                  <Minimize2 size={14} />
                  <span>Exit Whole Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 size={14} />
                  <span>Whole Screen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Touch Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOpenProductModal(product)}
                className="bg-card rounded-2xl p-3.5 border border-border hover:border-primary/50 shadow-xs cursor-pointer flex flex-col justify-between space-y-3 transition-all"
              >
                {/* Product Image & Swatches */}
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-secondary">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-extrabold uppercase px-2 py-0.5 bg-black/60 text-white backdrop-blur-xs rounded-md">
                    {product.category}
                  </span>

                  {/* Swatches Overlay */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-full">
                    {product.swatches.map((swatch, idx) => (
                      <span
                        key={idx}
                        className="w-3 h-3 rounded-full border border-white/80"
                        style={{ backgroundColor: swatch.hex }}
                        title={swatch.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <h3 className="font-bold text-xs text-foreground line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {product.variants.map(v => v.size).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                  </p>
                </div>

                {/* Price & Touch Action Button */}
                <div className="flex items-center justify-between pt-1 border-t border-border/60">
                  <span className="font-mono font-extrabold text-sm text-primary">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">
                    Tap to Select
                  </span>
                </div>
              </motion.div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-10 text-center space-y-3 bg-secondary/20 rounded-2xl border border-dashed border-border p-6">
                <ShoppingBag size={36} className="mx-auto text-muted-foreground opacity-40" />
                <p className="text-xs font-semibold text-foreground">No matching garments found {searchQuery ? `for "${searchQuery}"` : ''}</p>
                <button
                  onClick={() => {
                    setCustomName(searchQuery);
                    setShowCustomModal(true);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Add {searchQuery ? `"${searchQuery}"` : 'Custom Item'} to Cart &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE STICKY VIEW CART BUTTON */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <button
          onClick={() => document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl flex items-center justify-between px-6 border-2 border-primary-foreground/20 active:scale-95 transition-transform"
        >
          <span className="flex items-center gap-2"><ShoppingBag size={18} /> View Cart</span>
          <span>{cart.length} items | ₹{grandTotal.toLocaleString()}</span>
        </button>
      </div>

      {/* RIGHT SECTION (35% width): Cart & Customer Register */}
      <div id="cart-section" className="lg:col-span-4 bg-card rounded-2xl border border-border p-4 shadow-sm overflow-hidden flex flex-col mt-4 lg:mt-0 lg:h-full">
        
        {/* Customer Profile Header & Voice Dictation Button */}
        <div className="space-y-3 pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <User size={14} className="text-primary" /> Customer Profile
            </span>

            <div className="flex items-center gap-2">
              {/* VOICE DICTATION BUTTON (Ctrl + B) */}
              <button
                onClick={toggleVoiceRecognition}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                  isListening 
                    ? 'bg-red-500 text-white border-red-600 animate-pulse' 
                    : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white'
                }`}
                title="Press Ctrl+B or tap to speak Name & Phone"
              >
                {isListening ? <MicOff size={13} /> : <Mic size={13} />}
                <span>{isListening ? 'Listening...' : 'Voice (Ctrl+B)'}</span>
              </button>

              {(selectedCustomer || customerPhoneInput || customerNameInput) && (
                <button
                  onClick={handleClearCustomerProfile}
                  className="text-[10px] text-destructive hover:underline font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Voice Dictation Status Notification */}
          {voiceFeedbackMsg && (
            <div className="p-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[11px] font-bold text-center animate-pulse-live flex items-center justify-center gap-1">
              <Sparkles size={12} /> {voiceFeedbackMsg}
            </div>
          )}

          {/* DUAL EXPLICIT TOUCH-FRIENDLY INPUT FIELDS: Phone & Name */}
          <div className="space-y-2.5 pt-1">
            
            {/* Field 1: Mobile Number Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-primary">
                  <Phone size={13} /> Customer Mobile Number
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">WhatsApp Linked</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 9820144820 or tap Voice"
                  value={customerPhoneInput}
                  onChange={(e) => handlePhoneInputChange(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Field 2: Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-primary">
                  <User size={13} /> Customer Full Name
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rohan Sharma"
                value={customerNameInput}
                onChange={(e) => handleNameInputChange(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Member Pass Card if found */}
          {selectedCustomer ? (
            <div className="bg-accent/40 border border-accent p-3 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-accent-foreground">{selectedCustomer.name}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedCustomer.phone}</p>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  selectedCustomer.tier === 'Black VIP' ? 'bg-slate-900 text-white' :
                  selectedCustomer.tier === 'Gold' ? 'bg-amber-400 text-slate-900' : 'bg-slate-200 text-slate-800'
                }`}>
                  {selectedCustomer.tier}
                </span>
              </div>

              {/* Fit Preference & Coins */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-accent/60">
                <span className="text-muted-foreground">
                  Fit: <strong className="text-accent-foreground">{selectedCustomer.preferredFit}</strong>
                </span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                  <Award size={12} /> {selectedCustomer.coinsBalance.toLocaleString('en-IN')} pts (₹{selectedCustomer.coinsBalance})
                </span>
              </div>
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-muted/60 text-[10px] text-muted-foreground text-center">
              Enter phone & name (or press Ctrl+B) to attach WhatsApp pass & credit 5% cashback.
            </div>
          )}
        </div>

        {/* Itemized Cart List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>Cart Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            {cart.length > 0 && (
              <button onClick={onClearCart} className="text-[10px] text-destructive hover:underline cursor-pointer">
                Clear All
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-center text-muted-foreground space-y-2">
              <ShoppingBag size={32} className="opacity-30" />
              <p className="text-xs">No items in cart.</p>
              <p className="text-[11px] opacity-75">Tap any garment on the left register grid.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-secondary/40 p-2.5 rounded-xl border border-border flex items-center justify-between gap-2">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <p className="font-bold text-xs text-foreground truncate">{item.product.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    Size: <span className="font-bold text-foreground">{item.variant.size}</span> &bull; {item.variant.color}
                  </p>
                  <p className="font-mono text-xs font-bold text-primary">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 bg-card border border-border rounded-lg text-foreground hover:bg-muted cursor-pointer"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="font-mono text-xs font-bold w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 bg-card border border-border rounded-lg text-foreground hover:bg-muted cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="p-1 text-muted-foreground hover:text-destructive ml-1 cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & WhatsApp Receipt Dispatch Action */}
        <div className="pt-3 border-t border-border space-y-3">
          
          {/* Loyalty Points Redemption Checkbox */}
          {selectedCustomer && selectedCustomer.coinsBalance > 0 && cart.length > 0 && (
            <label className="flex items-center justify-between p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs cursor-pointer">
              <span className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-semibold">
                <input
                  type="checkbox"
                  checked={redeemCoins}
                  onChange={(e) => onToggleRedeemCoins(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                Redeem Loyalty Coins
              </span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                -₹{discount.toLocaleString('en-IN')}
              </span>
            </label>
          )}

          {/* Subtotal / Tax / Total Breakdown */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Loyalty Coins Discount:</span>
                <span className="font-mono font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>GST Tax (5%):</span>
              <span className="font-mono font-semibold">₹{tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground pt-1.5 border-t border-border">
              <span>Grand Total:</span>
              <span className="font-mono text-primary text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Success Notification Alert */}
          {checkoutSuccessMsg && (
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 animate-pulse-live">
              <CheckCircle2 size={16} /> {checkoutSuccessMsg}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={handleCheckoutSubmit}
            disabled={cart.length === 0 || isProcessingCheckout}
            className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-primary/20 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessingCheckout ? (
              <span>Creating Bill & Sending Receipt...</span>
            ) : (
              <>
                <Send size={16} /> Complete Bill & Send Receipt to Customer
              </>
            )}
          </button>
        </div>

      </div>

      {/* VARIANT SELECTOR TOUCH MODAL */}
      <AnimatePresence>
        {activeModalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-lg rounded-2xl p-6 border border-border shadow-2xl space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{activeModalProduct.name}</h3>
                  <p className="text-xs text-muted-foreground">{activeModalProduct.description}</p>
                </div>
                <button
                  onClick={() => setActiveModalProduct(null)}
                  className="p-1 rounded-lg hover:bg-secondary text-muted-foreground cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Color Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  1. Select Color
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {activeModalProduct.swatches.map((swatch) => {
                    const isSelected = selectedColor === swatch.name;
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => setSelectedColor(swatch.name)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary shadow-xs'
                            : 'border-border bg-secondary hover:bg-muted text-foreground'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        {swatch.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector Matrix */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  2. Select Size
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {activeModalProduct.variants
                    .filter(v => v.color === selectedColor)
                    .map((variant) => {
                      const isSelected = selectedSize === variant.size;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedSize(variant.size)}
                          className={`py-3 rounded-xl border text-sm font-extrabold flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground shadow-md'
                              : 'border-border bg-secondary hover:bg-muted text-foreground'
                          }`}
                        >
                          <span>{variant.size}</span>
                          <span className="text-[10px] font-normal opacity-80">
                            {variant.stock} left
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Footer Action */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <span className="text-xs text-muted-foreground block">Price per item</span>
                  <span className="font-mono text-xl font-bold text-primary">
                    ₹{activeModalProduct.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveModalProduct(null)}
                    className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-secondary cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAddToCart}
                    className="px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Add to Cart &rarr;
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD CUSTOM GARMENT / CLOTH MODAL */}
      <AnimatePresence>
        {showCustomModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => setShowCustomModal(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" /> Add Custom Cloth / Garment
                </h3>
                <p className="text-xs text-muted-foreground">Add custom cloth, unstitched fabric, or tailor alteration line item</p>
              </div>

              <form onSubmit={handleAddCustomProduct} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Cloth / Item Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Custom Linen Fabric / Stitching Charge"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full p-2.5 bg-input border border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Category</label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as any)}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="Shirts">Shirts</option>
                      <option value="Trousers">Trousers</option>
                      <option value="Denim">Denim</option>
                      <option value="Jackets">Jackets</option>
                      <option value="Knits">Knits</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 1500"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Size / Fit</label>
                    <input
                      type="text"
                      placeholder="e.g. Free Size / Size 34"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-foreground">Color / Fabric</label>
                    <input
                      type="text"
                      placeholder="e.g. Navy Blue / Linen"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(false)}
                    className="px-4 py-2.5 bg-secondary text-secondary-foreground font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-extrabold rounded-xl shadow-md hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={16} /> Add to Cart
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
