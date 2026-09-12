import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Phone, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2, 
  X, 
  Send,
  Maximize2,
  Minimize2,
  Sparkles,
  CreditCard,
  QrCode,
  Banknote,
  Percent
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
  const [customSize] = useState<string>('Free Size');
  const [customColor] = useState<string>('Standard');

  // Optional Custom Discount Percentage State (%)
  const [discountPercent, setDiscountPercent] = useState<string>('');

  // 3D Payment Method Modal State
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [cashTendered, setCashTendered] = useState<string>('');

  // WhatsApp Bill Confirmation Modal State
  const [dispatchedInvoice, setDispatchedInvoice] = useState<{ invoice: Invoice; customer: Customer } | null>(null);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // Dedicated Customer Input Fields
  const [customerPhoneInput, setCustomerPhoneInput] = useState<string>(selectedCustomer ? selectedCustomer.phone : '');
  const [customerNameInput, setCustomerNameInput] = useState<string>(selectedCustomer ? selectedCustomer.name : '');

  const [isProcessingCheckout, setIsProcessingCheckout] = useState<boolean>(false);
  
  // Whole Screen Feature for entire Fast Billing view
  const [isWholeScreen, setIsWholeScreen] = useState<boolean>(false);

  // Sync state with native browser Fullscreen API (e.g. Esc key pressed)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsWholeScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleWholeScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Native fullscreen failed:', err);
      });
      setIsWholeScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn('Native exit fullscreen failed:', err);
        });
      }
      setIsWholeScreen(false);
    }
  };

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
      description: 'Custom added item',
      image: '',
      swatches: [{ name: colorStr, hex: '#4A5568' }],
      variants: [{
        id: `v-custom-${Date.now()}`,
        size: sizeStr,
        color: colorStr,
        colorHex: '#4A5568',
        sku: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        stock: 50
      }]
    };

    setLocalProducts(prev => [newProduct, ...prev]);
    onAddToCart(newProduct, newProduct.variants[0]);
    setShowCustomModal(false);
    setCustomName('');
    setCustomPrice('');
  };

  // Filter products by category and search
  const filteredProducts = localProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.variants.some(v => v.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Open item modal for size selection
  const handleProductCardClick = (product: Product) => {
    setActiveModalProduct(product);
    if (product.swatches.length > 0) {
      setSelectedColor(product.swatches[0].name);
    }
    const availVariants = product.variants;
    if (availVariants.length > 0) {
      setSelectedSize(availVariants[0].size);
    }
  };

  const handleConfirmAddToCart = () => {
    if (!activeModalProduct) return;
    const targetVariant = activeModalProduct.variants.find(
      v => v.color === selectedColor && v.size === selectedSize
    ) || activeModalProduct.variants[0];

    onAddToCart(activeModalProduct, targetVariant);
    setActiveModalProduct(null);
  };

  // Quick lookup customer by phone with STRICT NUMERIC VALIDATION
  const handlePhoneInputChange = (rawVal: string) => {
    // Only allow numbers 0-9, + sign, and spaces
    const cleanPhone = rawVal.replace(/[^0-9+\s]/g, '');
    setCustomerPhoneInput(cleanPhone);

    if (cleanPhone.length >= 3) {
      const matched = customers.find(c => c.phone.includes(cleanPhone) || c.name.toLowerCase().includes(cleanPhone.toLowerCase()));
      if (matched) {
        onSelectCustomer(matched);
        setCustomerNameInput(matched.name);
      }
    }
  };

  // Shopper Name Input with STRICT ALPHABETIC VALIDATION
  const handleNameInputChange = (rawVal: string) => {
    // Only allow letters, spaces, hyphens and apostrophes
    const cleanName = rawVal.replace(/[^a-zA-Z\s\-']/g, '');
    setCustomerNameInput(cleanName);
  };

  // Clear customer profile
  const handleClearCustomerProfile = () => {
    onSelectCustomer(null);
    setCustomerPhoneInput('');
    setCustomerNameInput('');
  };

  // Financial calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Percent Discount Calculation
  const percentValue = parseFloat(discountPercent) || 0;
  const manualPercentDiscount = Math.round((subtotal * percentValue) / 100);

  // VIP Coin Discount Calculation
  let coinDiscount = 0;
  if (selectedCustomer && redeemCoins && selectedCustomer.coinsBalance > 0) {
    coinDiscount = Math.min(Math.max(0, subtotal - manualPercentDiscount), selectedCustomer.coinsBalance);
  }

  const totalDiscount = manualPercentDiscount + coinDiscount;
  const taxableAmount = Math.max(0, subtotal - totalDiscount);
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
      phone: customerPhoneInput.trim() || '+919820144820',
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
        discount: totalDiscount,
        tax,
        total: grandTotal,
        coinsEarned,
        coinsRedeemed: coinDiscount,
        whatsappStatus: 'Delivered'
      };

      onCompleteCheckout(newInvoice, activeCustomerForBill);
      setIsProcessingCheckout(false);
      setShowPaymentModal(false);

      // Open WhatsApp Dispatch Popup
      setDispatchedInvoice({
        invoice: newInvoice,
        customer: activeCustomerForBill
      });

    }, 1200);
  };

  // Screen Mode Container Classes
  const containerClasses = isWholeScreen
    ? 'fixed inset-0 z-50 bg-background p-4 sm:p-6 w-screen h-screen overflow-hidden shadow-2xl space-y-3'
    : 'lg:grid lg:grid-cols-12 gap-4 lg:gap-6 min-h-[calc(100vh-6rem)] lg:h-[calc(100vh-6rem)] overflow-y-auto lg:overflow-hidden pb-24 lg:pb-0';

  const innerGridClasses = isWholeScreen
    ? 'flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6 overflow-hidden flex-1 min-h-0'
    : 'contents';

  return (
    <div className={`flex flex-col ${containerClasses} transition-all duration-300`}>
      
      {/* WHOLE SCREEN INNER GRID WRAPPER */}
      <div className={innerGridClasses}>
      
      {/* LEFT SECTION (65% width): Garment Matrix & Categories */}
      <div className="lg:col-span-8 flex flex-col space-y-4 lg:overflow-hidden pr-1">
        
        {/* Category Pills, Search & WHOLE SCREEN TOGGLE BUTTON */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5 bg-card p-2.5 rounded-2xl border border-border shadow-2xs">
          <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Search */}
            <div className="relative w-36 sm:w-44 shrink-0">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search SKU, name..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring font-mono"
              />
            </div>

            {/* ADD CUSTOM GARMENT BUTTON */}
            <button
              onClick={() => {
                setCustomName('');
                setShowCustomModal(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 font-bold text-xs shadow-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap"
              title="Add Custom Cloth / Garment Line Item"
            >
              <Plus size={13} />
              <span>Custom Item</span>
            </button>

            {/* WHOLE SCREEN TOGGLE BUTTON */}
            <button
              onClick={toggleWholeScreen}
              className="px-2.5 py-1.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-bold text-xs shadow-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap"
              title={isWholeScreen ? "Exit Fullscreen POS" : "Expand to Whole Screen POS"}
            >
              {isWholeScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span className="hidden sm:inline">{isWholeScreen ? 'Exit Full Screen' : 'Full Screen'}</span>
            </button>
          </div>
        </div>

        {/* Product Touch Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-3">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -2 }}
                onClick={() => handleProductCardClick(product)}
                className="bg-card border border-border rounded-2xl p-3.5 flex flex-col justify-between hover:border-primary/50 transition-all shadow-2xs cursor-pointer group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-muted-foreground mb-1">
                    <span>{product.category}</span>
                    <span className="text-primary">{product.variants.length} Sizes</span>
                  </div>

                  <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Swatches Color Pills */}
                  <div className="flex items-center gap-1 my-1.5">
                    {product.swatches.map((sw) => (
                      <span
                        key={sw.name}
                        className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: sw.hex }}
                        title={sw.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
                  <div className="font-mono text-sm font-extrabold text-foreground">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>

                  <button className="p-1.5 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground text-primary transition-all">
                    <Plus size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION (35% width): Cart, Customer Directory, & Checkout */}
      <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-4 flex flex-col justify-between shadow-xl space-y-3 overflow-y-auto max-h-full">
        
        {/* CUSTOMER DIRECTORY & VIP SELECTION */}
        <div className="space-y-2 border-b border-border/60 pb-3 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User size={13} className="text-primary" /> Customer Profile
            </span>

            {selectedCustomer && (
              <button
                onClick={handleClearCustomerProfile}
                className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {/* Line 1: Phone Number Input */}
            <div className="relative">
              <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search / Enter Phone Number (+91)..."
                value={customerPhoneInput}
                onChange={(e) => handlePhoneInputChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-input border border-border rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              />
            </div>

            {/* Line 2: Big Size Shopper Name Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Shopper Full Name..."
                value={customerNameInput}
                onChange={(e) => handleNameInputChange(e.target.value)}
                className="w-full px-3 py-2 text-xs font-extrabold bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs placeholder:font-normal"
              />
            </div>
          </div>

          {/* ACTIVE CUSTOMER VIP BADGE CARD */}
          {selectedCustomer ? (
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
                  {selectedCustomer.name}
                  <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-600 px-1.5 py-0.5 rounded">
                    {selectedCustomer.tier} VIP
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                  Reward Balance: <span className="font-bold text-primary">{selectedCustomer.coinsBalance} Coins</span>
                </div>
              </div>

              {selectedCustomer.coinsBalance > 0 && (
                <button
                  onClick={() => onToggleRedeemCoins(!redeemCoins)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    redeemCoins
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-secondary text-foreground hover:bg-muted'
                  }`}
                >
                  {redeemCoins ? 'Coins Applied' : 'Use Coins'}
                </button>
              )}
            </div>
          ) : (
            <div className="text-[10px] text-muted-foreground bg-muted/40 p-2 rounded-xl border border-border/60 text-center">
              Guest Shopper selected • +5% Reward Coins will auto-credit upon receipt
            </div>
          )}
        </div>

        {/* CART ITEMS LIST */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-[90px]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground space-y-1.5">
              <ShoppingBag size={28} className="text-muted-foreground/50" />
              <p className="text-xs font-medium">Cart is empty</p>
              <p className="text-[10px] opacity-70">Click items on the matrix to add to checkout cart</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-background border border-border/80 flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-foreground truncate">{item.product.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {item.variant.color} / {item.variant.size}
                  </div>
                  <div className="font-mono text-xs font-bold text-primary mt-0.5">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 border border-border rounded-xl p-0.5 bg-card">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                    >
                      <Minus size={11} />
                    </button>
                    <span className="font-mono font-bold px-1 text-xs">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="p-1 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="p-1 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FINANCIAL BILL SUMMARY & CHECKOUT BUTTON */}
        <div className="space-y-2.5 border-t border-border/60 pt-2.5 shrink-0">
          
          {/* OPTIONAL DISCOUNT PERCENTAGE (%) INPUT BAR */}
          <div className="p-2 rounded-xl bg-muted/40 border border-border/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-foreground flex items-center gap-1">
                <Percent size={12} className="text-primary" /> Optional Discount %
              </label>
              
              {/* Quick Preset Pills */}
              <div className="flex items-center gap-1 text-[10px]">
                {['5', '10', '15', '20'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setDiscountPercent(discountPercent === p ? '' : p)}
                    className={`px-1.5 py-0.5 rounded font-mono font-bold transition-all ${
                      discountPercent === p
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background hover:bg-muted text-muted-foreground border border-border/60'
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Enter discount % (e.g. 10)..."
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full pl-3 pr-7 py-1 text-xs bg-background border border-border rounded-lg font-mono font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
            </div>
          </div>

          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {manualPercentDiscount > 0 && (
              <div className="flex justify-between text-primary font-bold">
                <span>Manual Discount ({discountPercent}%)</span>
                <span>- ₹{manualPercentDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {coinDiscount > 0 && (
              <div className="flex justify-between text-primary font-bold">
                <span>VIP Coin Discount</span>
                <span>- ₹{coinDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>GST Tax (5%)</span>
              <span>₹{tax.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-sm font-extrabold text-foreground pt-1.5 border-t border-border">
              <span>Grand Total</span>
              <span className="text-primary font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (cart.length > 0) {
                setShowPaymentModal(true);
              }
            }}
            disabled={cart.length === 0}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send size={15} />
            <span>Process Bill & Dispatch WhatsApp</span>
          </button>

        </div>

      </div>

      </div>

      {/* ITEM VARIANT SIZE SELECTOR MODAL */}
      <AnimatePresence>
        {activeModalProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-6 relative"
            >
              <button
                onClick={() => setActiveModalProduct(null)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-primary">{activeModalProduct.category}</span>
                <h3 className="text-xl font-extrabold text-foreground">{activeModalProduct.name}</h3>
              </div>

              {/* Color Swatch Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">1. Color Swatch</label>
                <div className="grid grid-cols-3 gap-2">
                  {activeModalProduct.swatches.map((swatch) => (
                    <button
                      key={swatch.name}
                      onClick={() => setSelectedColor(swatch.name)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                        selectedColor === swatch.name
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-secondary hover:bg-muted text-foreground'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: swatch.hex }} />
                      {swatch.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector Matrix */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">2. Apparel Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {activeModalProduct.variants
                    .filter(v => v.color === selectedColor)
                    .map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedSize(variant.size)}
                        className={`py-3 rounded-xl border text-sm font-extrabold flex flex-col items-center justify-center ${
                          selectedSize === variant.size
                            ? 'border-primary bg-primary text-primary-foreground shadow-md'
                            : 'border-border bg-secondary hover:bg-muted text-foreground'
                        }`}
                      >
                        <span>{variant.size}</span>
                        <span className="text-[10px] font-normal opacity-80">{variant.stock} left</span>
                      </button>
                    ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="font-mono text-xl font-extrabold text-primary">₹{activeModalProduct.price.toLocaleString('en-IN')}</div>
                <button
                  onClick={handleConfirmAddToCart}
                  className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:opacity-90"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3D PAYMENT METHOD MODAL */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-6"
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-foreground">Select Payment Mode</h3>
                <p className="text-xs text-muted-foreground">Total Bill Amount: <span className="font-mono font-bold text-primary">₹{grandTotal.toLocaleString('en-IN')}</span></p>
              </div>

              {/* PAYMENT MODES SELECTOR */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-border bg-background hover:bg-muted text-foreground'
                  }`}
                >
                  <QrCode size={20} />
                  <span>UPI QR</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-border bg-background hover:bg-muted text-foreground'
                  }`}
                >
                  <CreditCard size={20} />
                  <span>Card POS</span>
                </button>

                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-border bg-background hover:bg-muted text-foreground'
                  }`}
                >
                  <Banknote size={20} />
                  <span>Cash</span>
                </button>
              </div>

              {/* DYNAMIC PAYMENT UI DISPLAY */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 text-center">
                {paymentMethod === 'upi' && (
                  <div className="space-y-3">
                    <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-border shadow-md flex items-center justify-center">
                      <QrCode size={120} className="text-slate-900" />
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">Scan QR with GPay, PhonePe or Paytm</div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3 py-4">
                    <CreditCard size={48} className="mx-auto text-primary animate-pulse" />
                    <div className="text-xs font-bold text-foreground">Tap or Insert Card on POS Terminal</div>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="space-y-3 text-left">
                    <label className="text-xs font-bold text-foreground">Cash Given by Shopper (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="w-full p-3 bg-input border border-border rounded-xl text-sm font-mono font-bold"
                    />
                    {parseFloat(cashTendered) >= grandTotal && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-mono text-xs font-bold flex justify-between">
                        <span>Return Change to Customer:</span>
                        <span>₹{(parseFloat(cashTendered) - grandTotal).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckoutSubmit}
                disabled={isProcessingCheckout}
                className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessingCheckout ? (
                  <span>Processing & Dispatching...</span>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Confirm Payment & Dispatch WhatsApp Bill</span>
                  </>
                )}
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WHATSAPP BILL DISPATCH CONFIRMATION POPUP */}
      <AnimatePresence>
        {dispatchedInvoice && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-5 text-foreground"
            >
              <button
                onClick={() => setDispatchedInvoice(null)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary"
              >
                <X size={18} />
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-extrabold">Bill Sent to WhatsApp!</h3>
                <p className="text-xs text-muted-foreground">Receipt delivered to <span className="font-bold text-foreground">{dispatchedInvoice.customer.name}</span> ({dispatchedInvoice.customer.phone})</p>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-border pb-2 text-muted-foreground">
                  <span>Invoice ID:</span>
                  <span className="font-bold text-foreground">{dispatchedInvoice.invoice.id}</span>
                </div>
                
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Amount Paid:</span>
                  <span className="font-bold text-primary">₹{dispatchedInvoice.invoice.total.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-emerald-600 pt-1 border-t border-border">
                  <span>Reward Coins Credited:</span>
                  <span className="font-bold">+ {dispatchedInvoice.invoice.coinsEarned} Coins</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDispatchedInvoice(null)}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:opacity-90"
                >
                  Start New Bill
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD CUSTOM GARMENT MODAL */}
      <AnimatePresence>
        {showCustomModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-5"
            >
              <button
                onClick={() => setShowCustomModal(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary cursor-pointer"
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
                      onChange={(e) => setCustomCategory(e.target.value as 'Shirts' | 'Trousers' | 'Denim' | 'Jackets' | 'Knits')}
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

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(false)}
                    className="px-4 py-2 rounded-xl border border-border font-semibold hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:opacity-90"
                  >
                    Add to Cart
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
