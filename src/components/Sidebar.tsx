import React, { useState } from 'react';
import { 
  ShoppingBag, 
  BarChart3, 
  Users, 
  ChevronLeft,
  ChevronRight,
  Store,
  LogOut,
  Megaphone
} from 'lucide-react';
import type { ViewMode } from '../types';
import { KlothOSLogo } from './KlothOSLogo';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  onLogout,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const [selectedStore, setSelectedStore] = useState<string>('Bandra West Flagship');

  const navItems: { id: ViewMode; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'pos', label: 'Fast Billing', icon: ShoppingBag, badge: 'FAST' },
    { id: 'analytics', label: 'Store Intelligence', icon: BarChart3 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'campaign', label: 'Campaign', icon: Megaphone, badge: 'NEW' }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-30 transition-opacity"
          onClick={() => setMobileMenuOpen?.(false)}
        />
      )}

      <aside 
        className={`fixed md:relative top-0 bottom-0 left-0 bg-card border-r border-border flex flex-col justify-between transition-transform duration-300 z-40 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Top Logo Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <KlothOSLogo size={36} />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-foreground flex items-center gap-1.5">
                  KlothOS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                  Store POS Dashboard
                </span>
              </div>
            )}
          </div>
          
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Branch / Store Name Dropdown Selector */}
        {!collapsed && (
          <div className="mx-3 my-3 p-2.5 rounded-xl bg-accent/40 border border-accent text-xs flex items-center gap-2">
            <Store size={14} className="text-accent-foreground shrink-0" />
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full bg-transparent font-semibold text-accent-foreground border-none focus:outline-none cursor-pointer text-xs pr-1"
            >
              <option value="Bandra West Flagship" className="bg-card text-foreground">Bandra West Flagship</option>
              <option value="Juhu Studio" className="bg-card text-foreground">Juhu Studio</option>
              <option value="Kala Ghoda Atelier" className="bg-card text-foreground">Kala Ghoda Atelier</option>
            </select>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm font-semibold' 
                    : 'text-secondary-foreground hover:bg-secondary hover:text-foreground'
                } ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-border">
        {!collapsed ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/60 border border-border">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="https://api.dicebear.com/9.x/notionists/svg?seed=Rohan"
                  alt="Rohan Sharma"
                  className="w-9 h-9 rounded-full bg-primary/10 border border-border object-cover shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="text-xs font-bold text-foreground truncate">Rohan Sharma</span>
                <span className="text-[10px] text-muted-foreground truncate">Store Manager</span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <button 
              onClick={onLogout} 
              className="relative p-1 rounded-xl hover:bg-secondary transition-colors cursor-pointer" 
              title="Sign Out (Rohan Sharma)"
            >
              <img
                src="https://api.dicebear.com/9.x/notionists/svg?seed=Rohan"
                alt="Rohan Sharma"
                className="w-9 h-9 rounded-full bg-primary/10 border border-border object-cover shadow-xs"
              />
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  );
};
