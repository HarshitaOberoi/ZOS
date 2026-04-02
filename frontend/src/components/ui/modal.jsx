import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Modal({ open, onClose, title, description, children, footer }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            onClick={(event) => event.stopPropagation()}
            className="glass-panel max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[32px] p-6"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">{title}</h3>
                {description ? <p className="mt-2 text-sm text-[var(--muted)]">{description}</p> : null}
              </div>
              <Button variant="secondary" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div>{children}</div>
            {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
