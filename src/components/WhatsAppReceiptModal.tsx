import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCheck, 
  FileText, 
  MessageSquare, 
  X, 
  Award, 
  Sparkles,
  Share2
} from 'lucide-react';
import type { Invoice, Customer } from '../types';

interface WhatsAppReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  customer: Customer | null;
}

export const WhatsAppReceiptModal: React.FC<WhatsAppReceiptModalProps> = ({
  isOpen,
  onClose,
  invoice,
  customer
}) => {
  if (!isOpen || !invoice) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-card w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-border flex flex-col"
        >
          {/* Top Modal Bar */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={18} />
              <span className="font-bold text-sm">Bill Created & Receipt Sent to Customer</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-primary-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Simulated Mobile Phone Interface */}
          <div className="bg-[#E5DDD5] dark:bg-[#111b21] p-4 font-sans text-xs space-y-3 min-h-[440px] flex flex-col justify-between">
            
            {/* Chat Contact Header */}
            <div className="bg-[#075E54] text-white p-3 rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-extrabold text-sm">
                  K
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-sm leading-none">KlothOS Bandra West</p>
                    <span className="w-3.5 h-3.5 bg-emerald-400 text-slate-900 rounded-full flex items-center justify-center text-[8px] font-bold">✓</span>
                  </div>
                  <p className="text-[10px] text-emerald-100">Official Business Account</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded text-emerald-100 font-mono">
                +91 99300 99300
              </span>
            </div>

            {/* Simulated WhatsApp Chat Bubble */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-[#202c33] rounded-2xl p-3.5 shadow-md border border-slate-200/60 dark:border-slate-700 max-w-[92%] space-y-2.5 self-start text-foreground"
            >
              {/* Message Header */}
              <div className="space-y-1 border-b border-slate-100 dark:border-slate-700 pb-2">
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  Thank you for shopping at KlothOS! 🛍️
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Hi {customer ? customer.name : 'Valued Guest'}, here is your paperless invoice <span className="font-mono font-bold text-primary">{invoice.id}</span>.
                </p>
              </div>

              {/* Digital Invoice Box */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-1">
                    <FileText size={13} className="text-primary" /> Bill Summary
                  </span>
                  <span className="font-mono text-muted-foreground">{invoice.date}</span>
                </div>

                {/* Items List */}
                <div className="space-y-1 text-[11px] border-t border-b border-slate-200 dark:border-slate-700/80 py-2">
                  {invoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{item.variant} &times; {item.qty}</p>
                      </div>
                      <p className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total & Coins Breakdown */}
                <div className="space-y-0.5 text-[11px]">
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Loyalty Coins Redeemed:</span>
                      <span className="font-mono">-₹{invoice.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>Grand Total:</span>
                    <span className="font-mono text-primary text-sm">
                      ₹{invoice.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Coins Earned Highlight */}
                <div className="bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-[10px] text-amber-900 dark:text-amber-200 font-medium">
                  <span className="flex items-center gap-1">
                    <Award size={12} className="text-amber-600" /> Coins Earned:
                  </span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                    +{invoice.coinsEarned} pts (Total: {(customer?.coinsBalance || 0) + invoice.coinsEarned} pts)
                  </span>
                </div>
              </div>

              {/* Timestamp & Double Checkmarks */}
              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-mono pt-1">
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <CheckCheck size={14} className="text-sky-500" />
              </div>
            </motion.div>

            {/* Quick Interactive Reply Buttons */}
            <div className="space-y-1.5 pt-2">
              <button 
                onClick={onClose}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={14} /> Open Live WhatsApp App
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={onClose}
                  className="py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 shadow-2xs hover:bg-slate-50"
                >
                  <Award size={12} className="text-primary" /> View Pass
                </button>
                <button 
                  onClick={onClose}
                  className="py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 shadow-2xs hover:bg-slate-50"
                >
                  <Share2 size={12} className="text-sky-600" /> Share Receipt
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
