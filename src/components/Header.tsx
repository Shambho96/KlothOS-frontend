import React, { useState } from 'react';
import { Search, Sun, Moon, Menu, Store, Keyboard, CheckCircle2, ChevronDown } from 'lucide-react';
import type { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenMobileMenu
}) => {
  const [selectedOutlet, setSelectedOutlet] = useState<string>('Bandra West Flagship');
  const [showOutletDropdown, setShowOutletDropdown] = useState<boolean>(false);
  const [showShortcutModal, setShowShortcutModal] = useState<boolean>(false);

  const viewTitles: Record<string, string> = {
    pos: 'Apparel POS Register & Fast Billing',
    analytics: 'Store Intelligence & Size Matrix Radar',
    customers: 'VIP Customer CRM & Rewards Directory',
    campaign: 'WhatsApp Campaign Studio & Broadcasts'
  };

  const OUTLETS = [
    'Bandra West Flagship',
    'Juhu Apparel Studio',
    'Indiranagar Outlet'
  ];

  return (
    <header className="h-16 px-4 sm:px-6 bg-card border-b border-border flex items-center justify-between sticky top-0 z-20 shadow-xs transition-colors">
      {/* Left Title & Mobile Menu */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-2 rounded-xl text-foreground hover:bg-secondary transition-colors"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-base md:text-lg font-extrabold text-foreground tracking-tight truncate">
            {viewTitles[currentView] || 'KlothOS SaaS Dashboard'}
          </h1>

          {/* STORE OUTLET SELECTOR BADGE */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowOutletDropdown(!showOutletDropdown)}
              className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted border border-border text-xs font-semibold text-foreground flex items-center gap-1.5 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Store size={13} className="text-primary" />
              <span>{selectedOutlet}</span>
              <ChevronDown size={12} className="text-muted-foreground" />
            </button>

            {showOutletDropdown && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-xl py-1 z-30 text-xs font-medium">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-muted-foreground tracking-wider border-b border-border/60">
                  Switch Active Store
                </div>
                {OUTLETS.map((outlet) => (
                  <button
                    key={outlet}
                    onClick={() => {
                      setSelectedOutlet(outlet);
                      setShowOutletDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center justify-between ${
                      selectedOutlet === outlet ? 'text-primary font-bold bg-primary/10' : 'text-foreground'
                    }`}
                  >
                    <span>{outlet}</span>
                    {selectedOutlet === outlet && <CheckCircle2 size={13} className="text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center Search Bar if in POS view */}
      {currentView === 'pos' && (
        <div className="relative max-w-md w-full hidden md:block px-4">
          <Search size={16} className="absolute left-7 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search item, size (S, M, L, XL), SKU or price..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono"
          />
        </div>
      )}

      {/* Right Actions & Theme Toggle */}
      <div className="flex items-center gap-3">
        
        {/* KEYBOARD SHORTCUT HELPER BUTTON */}
        <button
          onClick={() => setShowShortcutModal(!showShortcutModal)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-xs font-mono font-medium text-muted-foreground hover:text-foreground transition-colors"
          title="POS Keyboard Shortcuts"
        >
          <Keyboard size={14} className="text-primary" />
          <span>[?] Keys</span>
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl bg-secondary hover:bg-muted text-foreground border border-border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
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
      </div>

      {/* SHORTCUTS MODAL POPUP */}
      {showShortcutModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Keyboard size={16} className="text-primary" /> POS Shortcuts Guide
              </h3>
              <button
                onClick={() => setShowShortcutModal(false)}
                className="text-xs text-muted-foreground hover:text-foreground font-bold"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center p-2 rounded bg-muted/40">
                <span className="text-muted-foreground">Focus Search Bar</span>
                <span className="bg-background border border-border px-2 py-0.5 rounded font-bold">/</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-muted/40">
                <span className="text-muted-foreground">Process WhatsApp Bill</span>
                <span className="bg-background border border-border px-2 py-0.5 rounded font-bold">Enter</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-muted/40">
                <span className="text-muted-foreground">Clear Active Cart</span>
                <span className="bg-background border border-border px-2 py-0.5 rounded font-bold">Esc</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
