import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import BearLogin from '../../pages/Login'; // Ajusta la ruta si es necesario

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onLoginSuccess }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            component: motion.div,
            initial: { scale: 0.5, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.5, opacity: 0 },
            transition: { duration: 0.3 },
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <BearLogin onSuccess={onLoginSuccess} />
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};