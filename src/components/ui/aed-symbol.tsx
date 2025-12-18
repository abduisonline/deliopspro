import React, { useEffect, useState } from 'react';

interface AEDSymbolProps {
  className?: string;
  size?: number;
}

export const AEDSymbol: React.FC<AEDSymbolProps> = ({ className = '', size = 16 }) => {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    // Load the UAE dirham symbol SVG
    fetch('/UAE_Dirham_Symbol.svg')
      .then(response => response.text())
      .then(svg => {
        // Extract the path data and create a simplified version
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
        const pathElement = svgDoc.querySelector('path');

        if (pathElement) {
          const pathData = pathElement.getAttribute('d');
          setSvgContent(pathData || '');
        }
      })
      .catch(error => {
        console.warn('Failed to load UAE dirham symbol:', error);
        // Fallback to simple D symbol
        setSvgContent('M4 3h6a8 8 0 0 1 0 16H4V3z');
      });
  }, []);

  return (
    <span
      className={`inline-flex items-center justify-center text-current ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size,
        lineHeight: 1,
      }}
      aria-label="UAE Dirham"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 1000 870"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: size,
          height: size,
          display: 'block',
        }}
      >
        <path
          d={svgContent}
          fill="currentColor"
        />
      </svg>
    </span>
  );
};