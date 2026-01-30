import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FullScreenModal = ({ isOpen, onClose, title, children, icon }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Heavy Backdrop Blur */}
          <div className="absolute inset-0 backdrop-blur-3xl bg-slate-900/80 dark:bg-slate-900/80" />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-xl shadow-2xl"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                {icon && (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                    {icon}
                  </div>
                )}
                <h2 className="text-2xl font-bold text-white">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-all group"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Content */}
            <div className="relative p-6 overflow-y-auto max-h-[calc(90vh-88px)] custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenModal;
