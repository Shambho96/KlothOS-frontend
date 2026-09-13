import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Boxes, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  Tag, 
  DollarSign, 
  X
} from 'lucide-react';
import type { Product, ProductVariant } from '../types';

interface InventoryViewProps {
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateStock: (productId: string, variantId: string, stockDelta: number) => void;
}

const CATEGORIES = ['All', 'Shirts', 'Trousers', 'Denim', 'Jackets', 'Knits'] as const;

// Preset apparel image URLs for quick selection in modal
const PRESET_IMAGES = [
  { label: 'Shirt', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80' },
  { label: 'Trousers', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80' },
  { label: 'Denim', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80' },
  { label: 'Jacket', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80' },
  { label: 'Knitwear', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80' },
];

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onAddProduct,
  onUpdateStock
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Garment Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Shirts' | 'Trousers' | 'Denim' | 'Jackets' | 'Knits'>('Shirts');
  const [price, setPrice] = useState<number>(2499);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [sizeStock, setSizeStock] = useState<{ [key: string]: number }>({
    S: 10,
    M: 15,
    L: 12,
    XL: 8
  });

  // Calculate High-level Inventory Metrics
  const totalStockUnits = products.reduce((acc, p) => 
    acc + p.variants.reduce((vAcc, v) => vAcc + v.stock, 0), 0
  );

  const totalValuation = products.reduce((acc, p) => 
    acc + p.variants.reduce((vAcc, v) => vAcc + (v.stock * p.price), 0), 0
  );

  const lowStockCount = products.filter(p => 
    p.variants.some(v => v.stock < 5)
  ).length;

  // Filter Products by Category & Search Query
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variants.some(v => v.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProdId = `prod-${Date.now()}`;
    const categoryPrefix = category.slice(0, 4).toUpperCase();

    const variants: ProductVariant[] = Object.entries(sizeStock).map(([size, qty], idx) => ({
      id: `v-${Date.now()}-${idx}`,
      size,
      color: 'Default',
      colorHex: '#000000',
      stock: Number(qty) || 0,
      sku: `${categoryPrefix}-${size}-${Math.floor(100 + Math.random() * 900)}`
    }));

    const newProduct: Product = {
      id: newProdId,
      name,
      category,
      price: Number(price) || 1999,
      description: description || `${category} premium tailored garment.`,
      image: image || PRESET_IMAGES[0].url,
      swatches: [{ name: 'Default', hex: '#000000' }],
      variants
    };

    onAddProduct(newProduct);
    setIsAddModalOpen(false);
    showToast(`Successfully added "${name}" to store inventory!`);

    // Reset Form
    setName('');
    setPrice(2499);
    setDescription('');
  };

  return (
    <div className="space-y-6 text-foreground pb-12">
      
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-emerald-600 text-white font-mono text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 tracking-tight">
            <Boxes className="text-primary" size={24} /> Store Inventory & Garment Catalog
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add new inventory, track size matrix stock levels, and perform instant re-stocks.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-2xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* 4 CORE INVENTORY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Total Stock Units</span>
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Package size={16} />
            </div>
          </div>
          <p className="font-mono text-2xl font-extrabold text-foreground">{totalStockUnits.toLocaleString()} Garments</p>
          <p className="text-[10px] text-muted-foreground">Across {products.length} catalog styles</p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Stock Valuation</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="font-mono text-2xl font-extrabold text-foreground">₹{totalValuation.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-muted-foreground">At retail price listing</p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Low Stock Alerts</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
              <AlertTriangle size={16} />
            </div>
          </div>
          <p className="font-mono text-2xl font-extrabold text-foreground">{lowStockCount} Styles</p>
          <p className="text-[10px] text-amber-600 font-bold">Sizes with &lt; 5 units</p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Active Categories</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600">
              <Tag size={16} />
            </div>
          </div>
          <p className="font-mono text-2xl font-extrabold text-foreground">5 Garment Lines</p>
          <p className="text-[10px] text-muted-foreground">Shirts, Trousers, Denim, Jackets, Knits</p>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search style name, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary font-mono text-foreground"
          />
        </div>

      </div>

      {/* INVENTORY CATALOG CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => {
          const totalUnits = p.variants.reduce((acc, v) => acc + v.stock, 0);

          return (
            <div key={p.id} className="bg-card border border-border rounded-3xl p-5 shadow-lg space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between">
              
              <div className="space-y-3">
                {/* Header Info */}
                <div className="flex gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-border shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
                        {p.category}
                      </span>
                      <span className="font-mono text-xs font-extrabold text-primary">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-foreground truncate">{p.name}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">{p.description}</p>
                  </div>
                </div>

                {/* Size Matrix Stock Breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <div className="flex justify-between text-[11px] font-mono text-muted-foreground font-bold">
                    <span>Size Matrix Stock</span>
                    <span className="text-foreground">{totalUnits} total units</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {p.variants.slice(0, 4).map((v) => {
                      const isLow = v.stock < 5;
                      const isOut = v.stock === 0;

                      return (
                        <div
                          key={v.id}
                          className={`p-2 rounded-xl border text-center font-mono space-y-0.5 transition-all ${
                            isOut
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-600'
                              : isLow
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                              : 'bg-background border-border text-foreground'
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase">{v.size}</div>
                          <div className="text-xs font-extrabold flex items-center justify-center gap-1">
                            <span>{v.stock}</span>
                            <button
                              onClick={() => onUpdateStock(p.id, v.id, 5)}
                              className="text-[9px] hover:text-primary transition-colors font-bold px-1 rounded bg-secondary cursor-pointer"
                              title="Add 5 units"
                            >
                              +5
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Footer Quick Actions */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-muted-foreground">
                  SKU: {p.variants[0]?.sku || 'SKU-NONE'}
                </span>
                <button
                  onClick={() => {
                    const firstV = p.variants[0];
                    if (firstV) onUpdateStock(p.id, firstV.id, 10);
                    showToast(`Restocked +10 units for ${p.name}`);
                  }}
                  className="px-3 py-1 rounded-xl bg-secondary hover:bg-muted text-foreground font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus size={12} /> Restock Style
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ADD NEW GARMENT INVENTORY MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-5 text-foreground max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold flex items-center gap-2">
                  <Boxes className="text-primary" size={20} /> Add New Garment Stock
                </h3>
                <p className="text-xs text-muted-foreground">Enter style details and size matrix quantities for store inventory.</p>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-mono">
                
                {/* Style Name */}
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Garment Style Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cuban Collar Italian Linen Shirt"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none font-sans text-sm"
                  />
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none font-sans text-xs cursor-pointer"
                    >
                      <option value="Shirts">Shirts</option>
                      <option value="Trousers">Trousers</option>
                      <option value="Denim">Denim</option>
                      <option value="Jackets">Jackets</option>
                      <option value="Knits">Knits</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Size Matrix Allocation */}
                <div className="space-y-2 p-3 rounded-2xl bg-secondary/50 border border-border">
                  <label className="font-bold text-foreground flex items-center justify-between">
                    <span>Size Matrix Initial Quantities</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Allocated Units per Size</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['S', 'M', 'L', 'XL'].map((s) => (
                      <div key={s} className="space-y-1 text-center">
                        <span className="font-bold text-muted-foreground uppercase text-[10px]">{s}</span>
                        <input
                          type="number"
                          min={0}
                          value={sizeStock[s] || 0}
                          onChange={(e) => setSizeStock({ ...sizeStock, [s]: Number(e.target.value) })}
                          className="w-full p-2 rounded-xl bg-input border border-border text-center font-bold text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Image Selection Presets */}
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground">Product Image Preset</label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img.label}
                        onClick={() => setImage(img.url)}
                        className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-[11px] shrink-0 cursor-pointer ${
                          image === img.url
                            ? 'border-primary bg-primary/10 text-primary font-bold'
                            : 'border-border bg-input text-muted-foreground'
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="w-5 h-5 rounded-md object-cover" />
                        <span>{img.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Handcrafted tailoring, fabric details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-input border border-border focus:ring-2 focus:ring-primary outline-none font-sans text-xs"
                  />
                </div>

                {/* Form Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm hover:opacity-90 shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Boxes size={18} />
                  <span>Save Garment & Add To Stock</span>
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
