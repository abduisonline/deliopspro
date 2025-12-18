import React from 'react';
import { AEDSymbol } from './aed-symbol';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  size?: number;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  className = '',
  size = 16
}) => {
  return (
    <span className={`inline-flex items-center ${className}`} style={{ fontSize: `${size}px`, lineHeight: 1 }}>
      <AEDSymbol size={size} className="mr-1 flex-shrink-0" />
      <span className="leading-none">{amount.toLocaleString()}</span>
    </span>
  );
};