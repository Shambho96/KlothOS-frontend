import React, { useState } from 'react';
import { Sun, Moon, Menu, Store, CheckCircle2, ChevronDown } from 'lucide-react';
import type { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  isDarkMode,
  onToggleDarkMode,
  onOpenMobileMenu
}) => {
  const [selectedOutlet, setSelectedOutlet] = useState<string>('Bandra West Flagship');
  const [showOutletDropdown, setShowOutletDropdown] = useState<boolean>(false);

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

      {/* Right Actions & Theme Toggle */}
      <div className="flex items-center gap-3">
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

    </header>
  );
};
