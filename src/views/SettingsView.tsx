import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Store, 
  Activity, 
  Sliders, 
  Save, 
  Search, 
  ShieldAlert, 
  Sparkles,
  KeyRound,
  Building2,
  BadgeCheck,
  ShoppingBag,
  BarChart3,
  Megaphone,
  Settings as SettingsIcon
} from 'lucide-react';
import type { 
  StaffMember, 
  StaffRole, 
  DashboardPermissions, 
  AuditLogEntry, 
  StoreSettings 
} from '../types';

interface SettingsViewProps {
  staffMembers: StaffMember[];
  onAddStaffMember: (newStaff: StaffMember) => void;
  onUpdateStaffMember: (updatedStaff: StaffMember) => void;
  onDeleteStaffMember: (staffId: string) => void;
  auditLogs: AuditLogEntry[];
  storeSettings: StoreSettings;
  onUpdateStoreSettings: (newSettings: StoreSettings) => void;
}

const FALLBACK_PERMISSIONS: DashboardPermissions = {
  pos: true,
  analytics: false,
  customers: false,
  campaign: false,
  campaigns: false,
  settings: false
};

const DEFAULT_ROLE_TEMPLATES: Record<StaffRole, DashboardPermissions> = {
  'Super Admin': { pos: true, analytics: true, customers: true, campaign: true, settings: true },
  'Store Manager': { pos: true, analytics: true, customers: true, campaign: true, settings: false },
  'Inventory Lead': { pos: false, analytics: true, customers: false, campaign: false, settings: false },
  'Cashier': { pos: true, analytics: false, customers: false, campaign: false, settings: false },
  'Marketing Lead': { pos: false, analytics: true, customers: true, campaign: true, settings: false },
  'super_admin': { pos: true, analytics: true, customers: true, campaign: true, settings: true },
  'store_manager': { pos: true, analytics: true, customers: true, campaign: true, settings: false },
  'inventory_clerk': { pos: false, analytics: true, customers: false, campaign: false, settings: false },
  'pos_cashier': { pos: true, analytics: false, customers: false, campaign: false, settings: false },
  'marketing_lead': { pos: false, analytics: true, customers: true, campaign: true, settings: false }
};

const OUTLET_OPTIONS = [
  'All Outlets',
  'Bandra West Flagship',
  'Juhu Apparel Studio',
  'Indiranagar Outlet'
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  staffMembers,
  onAddStaffMember,
  onUpdateStaffMember,
  onDeleteStaffMember,
  auditLogs,
  storeSettings,
  onUpdateStoreSettings
}) => {
  const [activeTab, setActiveTab] = useState<'rbac' | 'templates' | 'outlet' | 'audit'>('rbac');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [showPinMap, setShowPinMap] = useState<Record<string, boolean>>({});

  // Add Staff Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newStaffName, setNewStaffName] = useState<string>('');
  const [newStaffEmail, setNewStaffEmail] = useState<string>('');
  const [newStaffPhone, setNewStaffPhone] = useState<string>('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('Cashier');
  const [newStaffOutlet, setNewStaffOutlet] = useState<string>('Bandra West Flagship');
  const [newStaffPin, setNewStaffPin] = useState<string>('1234');
  const [newStaffPermissions, setNewStaffPermissions] = useState<DashboardPermissions>(
    DEFAULT_ROLE_TEMPLATES['Cashier'] || FALLBACK_PERMISSIONS
  );

  // Edit Staff Modal State
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Store Settings Form State
  const [localSettings, setLocalSettings] = useState<StoreSettings>(storeSettings);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState<boolean>(false);

  // Filter staff members
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'All' || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Toggle PIN visibility for specific staff member
  const togglePinVisibility = (id: string) => {
    setShowPinMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // When selecting role in Add Modal, load default permissions
  const handleRoleSelectChange = (role: StaffRole) => {
    setNewStaffRole(role);
    setNewStaffPermissions(DEFAULT_ROLE_TEMPLATES[role] || FALLBACK_PERMISSIONS);
  };

  // Submit Add Staff Form
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;

    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaffName.trim(),
      email: newStaffEmail.trim() || `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@klothos.store`,
      phone: newStaffPhone.trim() || '+91 98200 12345',
      role: newStaffRole,
      outletAssigned: newStaffOutlet,
      pinCode: newStaffPin.trim() || '1234',
      status: 'Active',
      lastActive: 'Just now',
      permissions: { ...newStaffPermissions }
    };

    onAddStaffMember(newStaff);
    setShowAddModal(false);
    
    // Reset form
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setNewStaffRole('Cashier');
    setNewStaffOutlet('Bandra West Flagship');
    setNewStaffPin('1234');
  };

  // Submit Edit Staff Form
  const handleEditStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    onUpdateStaffMember(editingStaff);
    setEditingStaff(null);
  };

  // Quick toggle inline permission for staff member
  const handleToggleInlinePermission = (staff: StaffMember, moduleKey: keyof DashboardPermissions) => {
    const updatedPermissions = {
      ...staff.permissions,
      [moduleKey]: !staff.permissions[moduleKey]
    };
    onUpdateStaffMember({
      ...staff,
      permissions: updatedPermissions
    });
  };

  // Save Store Outlet Settings
  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreSettings(localSettings);
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 3000);
  };

  // Helper badge color per role
  const getRoleBadgeStyle = (role: StaffRole) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Store Manager':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'Inventory Lead':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Cashier':
      default:
        return 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 pb-16 text-foreground">
      
      {/* ─ HEADER & TABS BAR ─ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} className="text-primary" />
            <h2 className="text-xl font-extrabold tracking-tight">Super Admin Settings & RBAC</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage store staff members, role permissions, access control, and security audit logs.
          </p>
        </div>

        {/* SUB TAB SELECTOR */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-muted/60 p-1 rounded-2xl border border-border/60">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'rbac'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            <Users size={14} />
            <span>Staff Members & Roles</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            <Sliders size={14} />
            <span>Permission Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('outlet')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'outlet'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            <Building2 size={14} />
            <span>Store Profile & GST</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            <Activity size={14} />
            <span>Security Audit Log</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: STAFF MEMBERS & ROLE-BASED ACCESS CONTROL (RBAC) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          
          {/* METRICS & QUICK STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-2xl border border-border shadow-2xs space-y-1">
              <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                <span>Total Active Staff</span>
                <Users size={16} className="text-primary" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-foreground">{staffMembers.length}</div>
              <div className="text-[10px] text-emerald-600 font-bold">100% Verified Users</div>
            </div>

            <div className="bg-card p-4 rounded-2xl border border-border shadow-2xs space-y-1">
              <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                <span>Super Admins</span>
                <ShieldCheck size={16} className="text-amber-500" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-foreground">
                {staffMembers.filter(s => s.role === 'Super Admin').length}
              </div>
              <div className="text-[10px] text-amber-600 font-bold">Full Control Access</div>
            </div>

            <div className="bg-card p-4 rounded-2xl border border-border shadow-2xs space-y-1">
              <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                <span>Store Managers</span>
                <Store size={16} className="text-blue-500" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-foreground">
                {staffMembers.filter(s => s.role === 'Store Manager').length}
              </div>
              <div className="text-[10px] text-blue-600 font-bold">Outlet Level Admins</div>
            </div>

            <div className="bg-card p-4 rounded-2xl border border-border shadow-2xs space-y-1">
              <div className="text-xs text-muted-foreground font-medium flex items-center justify-between">
                <span>Cashiers & Leads</span>
                <KeyRound size={16} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-foreground">
                {staffMembers.filter(s => s.role === 'Cashier' || s.role === 'Inventory Lead').length}
              </div>
              <div className="text-[10px] text-muted-foreground font-bold">Terminal Restricted</div>
            </div>
          </div>

          {/* ACTION BAR: SEARCH, ROLE FILTER & ADD STAFF BUTTON */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-2xs">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search staff name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
              </div>

              {/* Role Filter Pills */}
              <div className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-none">
                {['All', 'Super Admin', 'Store Manager', 'Inventory Lead', 'Cashier'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      roleFilter === r
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <UserPlus size={16} />
              <span>Add Staff Member</span>
            </button>
          </div>

          {/* STAFF MEMBERS DIRECTORY TABLE */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-border/80 flex items-center justify-between bg-muted/30">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" /> Active Staff Roster & Section Access Permissions
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                {filteredStaff.length} members configured
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/60 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 pl-5">Staff Name & Contact</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Outlet Scope</th>
                    <th className="p-3.5">PIN Code</th>
                    <th className="p-3.5">Live Module Access (1-Click Toggle)</th>
                    <th className="p-3.5 text-right pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredStaff.map((staff) => {
                    const isPinRevealed = !!showPinMap[staff.id];
                    return (
                      <tr key={staff.id} className="hover:bg-muted/40 transition-colors">
                        
                        {/* Name & Contact */}
                        <td className="p-3.5 pl-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center font-extrabold text-primary text-xs shrink-0">
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-extrabold text-foreground text-sm flex items-center gap-2">
                                {staff.name}
                                {staff.role === 'Super Admin' && (
                                  <Sparkles size={12} className="text-amber-500" />
                                )}
                              </div>
                              <div className="text-[11px] text-muted-foreground font-mono">{staff.email} • {staff.phone}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold border ${getRoleBadgeStyle(staff.role)}`}>
                            {staff.role}
                          </span>
                        </td>

                        {/* Outlet */}
                        <td className="p-3.5 font-medium text-foreground">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Store size={13} className="text-primary shrink-0" />
                            <span>{staff.outletAssigned}</span>
                          </div>
                        </td>

                        {/* PIN Code with reveal toggle */}
                        <td className="p-3.5 font-mono">
                          <div className="flex items-center gap-2 bg-input px-2.5 py-1 rounded-xl border border-border w-fit">
                            <KeyRound size={12} className="text-muted-foreground" />
                            <span className="font-bold text-foreground">
                              {isPinRevealed ? staff.pinCode : '••••'}
                            </span>
                            <button
                              onClick={() => togglePinVisibility(staff.id)}
                              className="text-muted-foreground hover:text-foreground cursor-pointer"
                              title={isPinRevealed ? "Hide PIN" : "Show PIN"}
                            >
                              {isPinRevealed ? <EyeOff size={12} /> : <Eye size={12} />}
                            </button>
                          </div>
                        </td>

                        {/* Interactive Module Permissions Toggles */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            
                            {/* POS ACCESS */}
                            <button
                              onClick={() => handleToggleInlinePermission(staff, 'pos')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                                staff.permissions.pos
                                  ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                                  : 'bg-muted text-muted-foreground border-border/60 opacity-50'
                              }`}
                              title="Toggle POS Terminal Access"
                            >
                              <ShoppingBag size={11} />
                              <span>POS</span>
                              {staff.permissions.pos ? <Check size={10} /> : <X size={10} />}
                            </button>

                            {/* ANALYTICS ACCESS */}
                            <button
                              onClick={() => handleToggleInlinePermission(staff, 'analytics')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                                staff.permissions.analytics
                                  ? 'bg-blue-500/15 text-blue-600 border-blue-500/30'
                                  : 'bg-muted text-muted-foreground border-border/60 opacity-50'
                              }`}
                              title="Toggle Store Intelligence Access"
                            >
                              <BarChart3 size={11} />
                              <span>Analytics</span>
                              {staff.permissions.analytics ? <Check size={10} /> : <X size={10} />}
                            </button>

                            {/* CUSTOMERS CRM ACCESS */}
                            <button
                              onClick={() => handleToggleInlinePermission(staff, 'customers')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                                staff.permissions.customers
                                  ? 'bg-purple-500/15 text-purple-600 border-purple-500/30'
                                  : 'bg-muted text-muted-foreground border-border/60 opacity-50'
                              }`}
                              title="Toggle Customer CRM Access"
                            >
                              <Users size={11} />
                              <span>Customers</span>
                              {staff.permissions.customers ? <Check size={10} /> : <X size={10} />}
                            </button>

                            {/* CAMPAIGN ACCESS */}
                            <button
                              onClick={() => handleToggleInlinePermission(staff, 'campaign')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                                staff.permissions.campaign
                                  ? 'bg-amber-500/15 text-amber-600 border-amber-500/30'
                                  : 'bg-muted text-muted-foreground border-border/60 opacity-50'
                              }`}
                              title="Toggle WhatsApp Campaign Access"
                            >
                              <Megaphone size={11} />
                              <span>Campaign</span>
                              {staff.permissions.campaign ? <Check size={10} /> : <X size={10} />}
                            </button>

                            {/* SETTINGS ACCESS */}
                            <button
                              onClick={() => handleToggleInlinePermission(staff, 'settings')}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                                staff.permissions.settings
                                  ? 'bg-rose-500/15 text-rose-600 border-rose-500/30'
                                  : 'bg-muted text-muted-foreground border-border/60 opacity-50'
                              }`}
                              title="Toggle Super Admin Settings Access"
                            >
                              <SettingsIcon size={11} />
                              <span>Admin Settings</span>
                              {staff.permissions.settings ? <Check size={10} /> : <X size={10} />}
                            </button>

                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingStaff({ ...staff })}
                              className="p-1.5 rounded-xl border border-border bg-secondary hover:bg-muted text-foreground transition-colors cursor-pointer"
                              title="Edit Staff Member"
                            >
                              <Edit3 size={14} />
                            </button>
                            
                            {staff.role !== 'Super Admin' && (
                              <button
                                onClick={() => onDeleteStaffMember(staff.id)}
                                className="p-1.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                                title="Revoke Staff Access"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: GLOBAL ROLE PERMISSION MATRIX */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <Sliders size={18} className="text-primary" /> Role Permission Matrix Rules
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Define default module access levels automatically granted when new staff accounts are created.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {(['Super Admin', 'Store Manager', 'Inventory Lead', 'Cashier'] as StaffRole[]).map((role) => {
                const defaults = DEFAULT_ROLE_TEMPLATES[role] || FALLBACK_PERMISSIONS;
                return (
                  <div key={role} className="bg-background border border-border rounded-2xl p-4 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border ${getRoleBadgeStyle(role)}`}>
                        {role}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border">
                        <span className="font-semibold flex items-center gap-1.5">
                          <ShoppingBag size={13} className="text-primary" /> POS Billing
                        </span>
                        {defaults.pos ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold text-[10px]">Allowed</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold text-[10px]">Restricted</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border">
                        <span className="font-semibold flex items-center gap-1.5">
                          <BarChart3 size={13} className="text-blue-500" /> Analytics Radar
                        </span>
                        {defaults.analytics ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold text-[10px]">Allowed</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold text-[10px]">Restricted</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border">
                        <span className="font-semibold flex items-center gap-1.5">
                          <Users size={13} className="text-purple-500" /> Customers CRM
                        </span>
                        {defaults.customers ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold text-[10px]">Allowed</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold text-[10px]">Restricted</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border">
                        <span className="font-semibold flex items-center gap-1.5">
                          <Megaphone size={13} className="text-amber-500" /> Campaign Broadcasts
                        </span>
                        {defaults.campaign ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold text-[10px]">Allowed</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold text-[10px]">Restricted</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border">
                        <span className="font-semibold flex items-center gap-1.5">
                          <SettingsIcon size={13} className="text-rose-500" /> Admin Settings
                        </span>
                        {defaults.settings ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold text-[10px]">Allowed</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-bold text-[10px]">Restricted</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: STORE PROFILE & GSTIN SETTINGS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'outlet' && (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-xs max-w-3xl space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <Building2 size={18} className="text-primary" /> Store Entity & WhatsApp Receipt Settings
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update store GST registration, Meta WhatsApp API verification status, and paperless bill notes.
            </p>
          </div>

          {settingsSavedSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center gap-2">
              <BadgeCheck size={16} />
              <span>Store & GST Settings updated successfully across all outlets!</span>
            </div>
          )}

          <form onSubmit={handleSaveStoreSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold">Store Registered Legal Name *</label>
                <input
                  type="text"
                  required
                  value={localSettings.storeLegalName}
                  onChange={(e) => setLocalSettings({ ...localSettings, storeLegalName: e.target.value })}
                  className="w-full p-2.5 bg-input border border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold">Brand Name (Printed on Bills)</label>
                <input
                  type="text"
                  required
                  value={localSettings.brandName}
                  onChange={(e) => setLocalSettings({ ...localSettings, brandName: e.target.value })}
                  className="w-full p-2.5 bg-input border border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold">GSTIN Registration Number *</label>
                <input
                  type="text"
                  required
                  value={localSettings.gstin}
                  onChange={(e) => setLocalSettings({ ...localSettings, gstin: e.target.value })}
                  className="w-full p-2.5 bg-input border border-border rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold">Support Outlet Contact Number</label>
                <input
                  type="text"
                  required
                  value={localSettings.phone}
                  onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                  className="w-full p-2.5 bg-input border border-border rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold">Flagship Store Address</label>
              <input
                type="text"
                required
                value={localSettings.address}
                onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                className="w-full p-2.5 bg-input border border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="p-4 rounded-2xl bg-background border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-foreground">Auto-Send WhatsApp Paperless Bills</div>
                  <div className="text-[11px] text-muted-foreground">Instantly dispatch digital tax invoice via Meta WhatsApp Business API upon checkout confirmation.</div>
                </div>

                <button
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, autoSendWhatsapp: !localSettings.autoSendWhatsapp })}
                  className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center cursor-pointer ${
                    localSettings.autoSendWhatsapp ? 'bg-primary justify-end' : 'bg-muted justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:opacity-90 flex items-center gap-2 cursor-pointer"
              >
                <Save size={16} />
                <span>Save Store Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: SECURITY AUDIT LOG */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'audit' && (
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs space-y-0">
          <div className="p-4 border-b border-border/80 flex items-center justify-between bg-muted/30">
            <div>
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Activity size={16} className="text-primary" /> Live Security Audit Log & Action History
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time tracking of staff logins, permission modifications, bill dispatches, and discount overrides.
              </p>
            </div>
          </div>

          <div className="divide-y divide-border/60">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                    <ShieldAlert size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-foreground flex items-center gap-2">
                      <span>{log.action}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                        {log.module}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      Performed by <span className="font-bold text-foreground">{log.staffName}</span> ({log.staffRole}) • IP: {log.ipAddress}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-muted-foreground shrink-0 bg-input px-2.5 py-1 rounded-lg border border-border/60">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ADD NEW STAFF MEMBER MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-5 text-foreground"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <UserPlus size={20} className="text-primary" /> Add Store Staff Member
                </h3>
                <p className="text-xs text-muted-foreground">Assign role, outlet location, PIN code, and section permissions.</p>
              </div>

              <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold">Staff Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="w-full p-2.5 bg-input border border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold">Email Address</label>
                    <input
                      type="email"
                      placeholder="vikram@klothos.store"
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold">Phone Number (+91)</label>
                    <input
                      type="text"
                      placeholder="+91 98201 98201"
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold">Staff Role *</label>
                    <select
                      value={newStaffRole}
                      onChange={(e) => handleRoleSelectChange(e.target.value as StaffRole)}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Cashier">Cashier</option>
                      <option value="Store Manager">Store Manager</option>
                      <option value="Inventory Lead">Inventory Lead</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold">Assigned Outlet</label>
                    <select
                      value={newStaffOutlet}
                      onChange={(e) => setNewStaffOutlet(e.target.value)}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {OUTLET_OPTIONS.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold">PIN Code (4-Digit)</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={newStaffPin}
                      onChange={(e) => setNewStaffPin(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-mono font-bold text-center"
                    />
                  </div>
                </div>

                {/* Section Permissions Toggles */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <label className="font-bold text-xs">Granted Dashboard Section Access:</label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { key: 'pos', label: 'Fast Billing POS' },
                      { key: 'analytics', label: 'Store Intelligence' },
                      { key: 'customers', label: 'Customer CRM' },
                      { key: 'campaign', label: 'Campaign Broadcasts' },
                      { key: 'settings', label: 'Super Admin Settings' }
                    ] as const).map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 p-2 rounded-xl bg-background border border-border/80 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newStaffPermissions[key]}
                          onChange={(e) => setNewStaffPermissions({
                            ...newStaffPermissions,
                            [key]: e.target.checked
                          })}
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                        <span className="font-bold text-xs">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-border font-semibold hover:bg-secondary cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:opacity-90 cursor-pointer"
                  >
                    Save Staff Account
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* EDIT STAFF MEMBER MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {editingStaff && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-5 text-foreground"
            >
              <button
                onClick={() => setEditingStaff(null)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-extrabold flex items-center gap-2">
                  <Edit3 size={20} className="text-primary" /> Edit Staff Details & Permissions
                </h3>
                <p className="text-xs text-muted-foreground">Updating access rules for {editingStaff.name}</p>
              </div>

              <form onSubmit={handleEditStaffSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold">Staff Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="w-full p-2.5 bg-input border border-border rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold">Role *</label>
                    <select
                      value={editingStaff.role}
                      onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as StaffRole })}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-bold"
                    >
                      <option value="Cashier">Cashier</option>
                      <option value="Store Manager">Store Manager</option>
                      <option value="Inventory Lead">Inventory Lead</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold">Assigned Outlet</label>
                    <select
                      value={editingStaff.outletAssigned}
                      onChange={(e) => setEditingStaff({ ...editingStaff, outletAssigned: e.target.value })}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-medium"
                    >
                      {OUTLET_OPTIONS.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold">4-Digit PIN Code</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={editingStaff.pinCode}
                      onChange={(e) => setEditingStaff({ ...editingStaff, pinCode: e.target.value.replace(/[^0-9]/g, '') })}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-mono font-bold text-center"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold">Account Status</label>
                    <select
                      value={editingStaff.status}
                      onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as any })}
                      className="w-full p-2.5 bg-input border border-border rounded-xl font-bold"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Section Permissions Toggles */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <label className="font-bold text-xs">Granted Dashboard Section Access:</label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { key: 'pos', label: 'Fast Billing POS' },
                      { key: 'analytics', label: 'Store Intelligence' },
                      { key: 'customers', label: 'Customer CRM' },
                      { key: 'campaign', label: 'Campaign Broadcasts' },
                      { key: 'settings', label: 'Super Admin Settings' }
                    ] as const).map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 p-2 rounded-xl bg-background border border-border/80 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingStaff.permissions[key]}
                          onChange={(e) => setEditingStaff({
                            ...editingStaff,
                            permissions: {
                              ...editingStaff.permissions,
                              [key]: e.target.checked
                            }
                          })}
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                        <span className="font-bold text-xs">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingStaff(null)}
                    className="px-4 py-2 rounded-xl border border-border font-semibold hover:bg-secondary cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-md hover:opacity-90 cursor-pointer"
                  >
                    Update Staff Member
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
