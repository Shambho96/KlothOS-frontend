import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WhatsAppReceiptModal } from './components/WhatsAppReceiptModal';

import { LandingView } from './views/LandingView';
import { POSView } from './views/POSView';
import { AnalyticsView } from './views/AnalyticsView';
import { CustomersView } from './views/CustomersView';
import { CampaignView } from './views/CampaignView';

import type { 
  ViewMode, 
  Product, 
  ProductVariant, 
  CartItem, 
  Customer, 
  Invoice, 
  DeadStockItem,
  CustomTierConfig,
  BroadcastLog
} from './types';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_DEAD_STOCK,
  INITIAL_CUSTOM_TIERS,
  INITIAL_COHORTS,
  INITIAL_BROADCAST_LOGS
} from './data/mockData';

// Helper to determine initial view mode and auth status from URL pathname
function getInitialRoute(): { isAuthenticated: boolean; currentView: ViewMode } {
  const path = window.location.pathname.replace(/^\//, '').toLowerCase();
  const validDashboardViews: ViewMode[] = ['pos', 'analytics', 'customers', 'campaign'];
  
  if (validDashboardViews.includes(path as ViewMode)) {
    return { isAuthenticated: true, currentView: path as ViewMode };
  }
  return { isAuthenticated: false, currentView: 'pos' };
}

export function App() {
  const initialRoute = getInitialRoute();

  // Theme Toggle State with instant synchronization & localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('klothos_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark class to document element on state changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('klothos_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('klothos_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialRoute.isAuthenticated);
  
  // Dashboard View State
  const [currentView, setCurrentView] = useState<ViewMode>(initialRoute.currentView);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Data State
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [deadStockItems] = useState<DeadStockItem[]>(INITIAL_DEAD_STOCK);
  const [customTiers, setCustomTiers] = useState<CustomTierConfig[]>(INITIAL_CUSTOM_TIERS);
  const [broadcastLogs, setBroadcastLogs] = useState<BroadcastLog[]>(INITIAL_BROADCAST_LOGS);

  const handleSendCampaign = (_cohortId: string, log: BroadcastLog) => {
    setBroadcastLogs((prev) => [log, ...prev]);
  };

  const handleCreateCustomTier = (newTier: CustomTierConfig) => {
    setCustomTiers((prev) => [...prev, newTier]);
  };

  const handleDeleteCustomTier = (tierId: string) => {
    setCustomTiers((prev) => prev.filter((t) => t.id !== tierId));
  };

  const handleUpdateCustomerTier = (customerId: string, newTierName: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, tier: newTierName } : c))
    );
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer((prev) => (prev ? { ...prev, tier: newTierName } : null));
    }
  };

  // Cart & POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(INITIAL_CUSTOMERS[0]);
  const [redeemCoins, setRedeemCoins] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Receipt Modal State
  const [receiptModalOpen, setReceiptModalOpen] = useState<boolean>(false);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  // Handle Dead-Stock Clearance Action
  const handleTriggerClearance = (_item: DeadStockItem) => {
    // Action trigger for dead stock item clearance
  };

  // Synchronize Browser URL on View or Auth changes
  const navigateTo = (view: ViewMode | 'landing', auth: boolean = true) => {
    setMobileMenuOpen(false); // Close mobile menu on navigation
    if (!auth || view === 'landing') {
      setIsAuthenticated(false);
      window.history.pushState({}, '', '/');
    } else {
      setIsAuthenticated(true);
      setCurrentView(view as ViewMode);
      window.history.pushState({}, '', `/${view}`);
    }
  };

  // Handle Browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialRoute();
      setIsAuthenticated(route.isAuthenticated);
      setCurrentView(route.currentView);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Add Item to Cart
  const handleAddToCart = (product: Product, variant: ProductVariant) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variant.id === variant.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `cart-${Date.now()}-${Math.random()}`,
            product,
            variant,
            quantity: 1
          }
        ];
      }
    });
  };

  // Cart Quantity Controls
  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
    setRedeemCoins(false);
  };

  // Complete Bill & Checkout
  const handleCompleteCheckout = (invoice: Invoice, customer: Customer | null) => {
    setActiveInvoice(invoice);

    if (customer) {
      setCustomers((prevCusts) => {
        const exists = prevCusts.some((c) => c.id === customer.id);
        if (exists) {
          return prevCusts.map((c) => {
            if (c.id === customer.id) {
              const newBalance = c.coinsBalance - invoice.coinsRedeemed + invoice.coinsEarned;
              return {
                ...c,
                coinsBalance: Math.max(0, newBalance),
                totalSpend: c.totalSpend + invoice.total,
                orderHistory: [invoice, ...c.orderHistory],
                lastVisitDaysAgo: 0
              };
            }
            return c;
          });
        } else {
          return [
            {
              ...customer,
              coinsBalance: invoice.coinsEarned,
              totalSpend: invoice.total,
              orderHistory: [invoice],
              lastVisitDaysAgo: 0
            },
            ...prevCusts
          ];
        }
      });
      setSelectedCustomer(customer);
    }

    setCart([]);
    setRedeemCoins(false);
    setReceiptModalOpen(true);
  };

  // UNAUTHENTICATED: Render Public Marketing Landing Page at http://localhost:5173/
  if (!isAuthenticated) {
    return (
      <LandingView 
        onLogin={() => navigateTo('pos', true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
    );
  }

  // AUTHENTICATED: Render Full SaaS Store Dashboard
  const renderDashboardView = () => {
    switch (currentView) {
      case 'pos':
        return (
          <POSView
            products={products}
            customers={customers}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            redeemCoins={redeemCoins}
            onToggleRedeemCoins={setRedeemCoins}
            onCompleteCheckout={handleCompleteCheckout}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView
            deadStockItems={deadStockItems}
            onTriggerClearance={handleTriggerClearance}
            onSelectView={(v) => navigateTo(v, true)}
          />
        );
      case 'customers':
        return (
          <CustomersView
            customers={customers}
            selectedCustomer={selectedCustomer}
            customTiers={customTiers}
            onSelectCustomer={setSelectedCustomer}
            onOpenReceipt={(invId) => {
              const foundCust = customers.find(c => c.orderHistory.some(i => i.id === invId));
              const foundInv = customers.flatMap(c => c.orderHistory).find(i => i.id === invId);
              if (foundInv) {
                if (foundCust) setSelectedCustomer(foundCust);
                setActiveInvoice(foundInv);
                setReceiptModalOpen(true);
              }
            }}
            onCreateCustomTier={handleCreateCustomTier}
            onDeleteCustomTier={handleDeleteCustomTier}
            onUpdateCustomerTier={handleUpdateCustomerTier}
          />
        );
      case 'campaign':
        return (
          <CampaignView
            cohorts={INITIAL_COHORTS}
            customers={customers}
            broadcastLogs={broadcastLogs}
            onSendCampaign={handleSendCampaign}
          />
        );
      default:
        return (
          <POSView
            products={products}
            customers={customers}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            redeemCoins={redeemCoins}
            onToggleRedeemCoins={setRedeemCoins}
            onCompleteCheckout={handleCompleteCheckout}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Persistent Collapsible Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => navigateTo(v, true)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={() => navigateTo('landing', false)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Dashboard Header */}
        <Header
          currentView={currentView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* View Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderDashboardView()}
        </main>
      </div>

      {/* Simulated WhatsApp Paperless Invoice Modal */}
      <WhatsAppReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        invoice={activeInvoice}
        customer={selectedCustomer}
      />
    </div>
  );
}

export default App;
