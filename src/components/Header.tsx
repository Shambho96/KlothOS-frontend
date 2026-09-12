import React from 'react';
import { Search, Sun, Moon, Menu } from 'lucide-react';
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
  const viewTitles: Record<string, string> = {
    pos: 'Fast Billing & Garment Matrix',
    analytics: 'Store Intelligence & Revenue Analytics',
    customers: 'Customer Directory & Preferences',
    campaign: 'WhatsApp Campaign Broadcast Studio'
  };

  return (
    <header className="h-16 px-6 bg-card border-b border-border flex items-center justify-between sticky top-0 z-20 shadow-xs transition-colors">
      {/* Left Title */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Hamburger Menu (Mobile Only) */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-2 rounded-xl text-foreground hover:bg-secondary transition-colors"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-base md:text-lg font-bold text-foreground tracking-tight truncate max-w-[200px] md:max-w-none">
          {viewTitles[currentView] || 'KlothOS SaaS Dashboard'}
        </h1>
      </div>

      {/* Center Search Bar if in POS view */}
      {currentView === 'pos' && (
        <div className="relative max-w-md w-full hidden md:block">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Quick search shirt, trousers, linen, SKU or size..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
      )}

      {/* Right Actions & Theme Toggle */}
      <div className="flex items-center gap-3">
        
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl bg-secondary hover:bg-muted text-foreground border border-border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          title={isDarkMode ? "Switch to Light Tangerine Mode" : "Switch to Dark Tangerine Mode"}
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
