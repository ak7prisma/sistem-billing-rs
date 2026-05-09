import React from "react";
import { FiX } from "react-icons/fi";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  id?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = "max-w-4xl",
  showCloseButton = true,
  className = "",
  overlayClassName = "",
  id
}) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300 ${overlayClassName}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm no-print" onClick={onClose} />
      
      <div 
        id={id}
        className={`relative bg-white w-full ${maxWidth} max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 ${className}`}
      >
        {showCloseButton && (
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 no-print">
            <button 
              onClick={onClose} 
              className="p-2.5 bg-white shadow-lg border border-slate-200 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-100"
            >
              <FiX size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default BaseModal;