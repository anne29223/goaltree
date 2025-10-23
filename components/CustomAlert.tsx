import React from 'react';

interface AlertOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const showAlert = ({ title, message, onConfirm, onCancel }: AlertOptions) => {
  // For web environment
  if (typeof window !== 'undefined') {
    if (window.confirm(message)) {
      onConfirm();
    } else if (onCancel) {
      onCancel();
    }
  } else {
    // For non-web environments (e.g., React Native), 
    // the confirmation will be handled directly without a dialog
    onConfirm();
  }
};