import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DonutChartProps {
  data: Array<{ name: string; value: number; color: string }>;
  onStatusClick: (status: string) => void;
  selectedStatus?: string | null;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, onStatusClick, selectedStatus: externalSelectedStatus }) => {
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);
  const [internalSelectedStatus, setInternalSelectedStatus] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Use external selected status if provided, otherwise use internal state
  const selectedStatus = externalSelectedStatus !== undefined ? externalSelectedStatus : internalSelectedStatus;

  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  // Responsive sizing based on device
  const radius = isMobile ? 56 : 78;
  const svgSize = isMobile ? 280 : 420;
  const containerMaxWidth = isMobile ? '270px' : '420px';
  const minHeight = isMobile ? '320px' : '420px';

  const C = 2 * Math.PI * radius;
  const GAP = isMobile ? 6 : 8;

  const segments = useMemo(() => {
    let offset = 0;
    return data.map((item, index) => {
      const frac = item.value / total;
      const segLen = Math.max(0, frac * C - GAP);
      const dash1 = segLen;
      const dash2 = C - segLen;

      const segment = {
        key: item.name,
        stroke: item.color,
        strokeDasharray: `${dash1} ${dash2}`,
        strokeDashoffset: -offset,
        index,
      };

      offset += frac * C;
      return segment;
    });
  }, [data, total, C, GAP]);

  const centerDisplay = useMemo(() => {
    const status = selectedStatus || hoveredStatus;
    if (status) {
      const item = data.find(d => d.name === status);
      if (item) {
        const pct = Math.round((item.value / total) * 100);
        return { value: item.value, label: `${status} • ${pct}%` };
      }
    }
    return { value: total, label: 'Total Drivers' };
  }, [selectedStatus, hoveredStatus, data, total]);

  const handleSegmentClick = (status: string) => {
    if (externalSelectedStatus === undefined) {
      setInternalSelectedStatus(status);
    }
    onStatusClick(status);
  };

  const handleMouseEnter = (status: string, event: React.MouseEvent) => {
    setHoveredStatus(status);
    setTooltipPos({ x: event.clientX, y: event.clientY });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setHoveredStatus(null);
    setShowTooltip(false);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPos({ x: event.clientX, y: event.clientY });
  };

  return (
    <div style={{
      display: 'grid',
      placeItems: 'center',
      padding: '10px 0 4px'
    }}>
      <div
        style={{
          position: 'relative',
          width: `min(${containerMaxWidth}, 78vw)`,
          aspectRatio: '1 / 1',
          display: 'grid',
          placeItems: 'center',
          filter: 'drop-shadow(0 18px 60px rgba(0,0,0,.45))',
          transition: 'transform .35s cubic-bezier(.2,.9,.2,1), filter .35s cubic-bezier(.2,.9,.2,1)',
          transform: 'translateZ(0)',
        }}
        ref={shellRef}
        onMouseEnter={(e) => {
           e.currentTarget.style.transform = 'scale(1.08)';
           e.currentTarget.style.filter = 'drop-shadow(0 22px 75px rgba(0,0,0,.55)) drop-shadow(0 0 60px rgba(22,199,132,.18))';
         }}
        onMouseMove={(e) => {
          if (shellRef.current) {
            const rect = shellRef.current.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            const rotY = Math.max(-10, Math.min(10, (px - 0.5) * 14));
            const rotX = Math.max(-10, Math.min(10, -(py - 0.5) * 14));
            shellRef.current.style.transform = `scale(1.08) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
          }
        }}
         onMouseLeave={(e) => {
           e.currentTarget.style.transform = '';
           e.currentTarget.style.filter = 'drop-shadow(0 18px 60px rgba(0,0,0,.45))';
           setShowTooltip(false);
         }}
      >
        <div style={{
          position: 'absolute',
          inset: '8%',
          borderRadius: '50%',
          background: `conic-gradient(from 210deg,
            rgba(22,199,132,.00) 0deg,
            rgba(22,199,132,.22) 65deg,
            rgba(20,184,255,.20) 140deg,
            rgba(255,77,79,.14) 220deg,
            rgba(255,255,255,.08) 280deg,
            rgba(22,199,132,.00) 360deg)`,
          filter: 'blur(18px)',
          opacity: '.55',
          animation: 'spin 10s linear infinite',
          pointerEvents: 'none'
        }}></div>

        <svg width={svgSize} height={svgSize} viewBox="0 0 240 240" role="img" aria-label="Donut chart">
          <circle
            cx="120"
            cy="120"
            r={radius}
            stroke="rgba(255,255,255,.08)"
            strokeWidth={isMobile ? 14 : 18}
            fill="none"
            filter="drop-shadow(0 0 10px rgba(255,255,255,.05))"
          />
          <g>
            {segments.map((seg, index) => (
              <circle
                key={seg.key}
                cx="120"
                cy="120"
                r={radius}
                stroke={seg.stroke}
            strokeWidth={isMobile ? 14 : 18}
                fill="none"
                strokeLinecap="round"
                style={{
                  strokeDasharray: seg.strokeDasharray,
                  strokeDashoffset: seg.strokeDashoffset,
                  transformOrigin: '120px 120px',
                  transform: selectedStatus === seg.key ? 'rotate(-90deg) scale(1.08)' : 'rotate(-90deg)',
                  filter: selectedStatus === seg.key ? 'drop-shadow(0 16px 45px rgba(0,0,0,.55)) drop-shadow(0 0 32px rgba(255,255,255,.08))' : 'drop-shadow(0 10px 25px rgba(0,0,0,.45))',
                  transition: 'transform .35s cubic-bezier(.2,.9,.2,1), filter .35s cubic-bezier(.2,.9,.2,1), stroke-width .35s cubic-bezier(.2,.9,.2,1), opacity .35s cubic-bezier(.2,.9,.2,1)',
                  cursor: 'pointer',
                  opacity: selectedStatus === seg.key ? '1' : '.98'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(-90deg) scale(1.05)';
                     e.currentTarget.style.strokeWidth = isMobile ? '17px' : '21px';
                    e.currentTarget.style.filter = 'drop-shadow(0 16px 45px rgba(0,0,0,.55)) drop-shadow(0 0 32px rgba(255,255,255,.08))';
                    e.currentTarget.style.opacity = '1';
                    handleMouseEnter(seg.key, e);
                  }}
                  onMouseMove={handleMouseMove}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.transform = selectedStatus === seg.key ? 'rotate(-90deg) scale(1.08)' : 'rotate(-90deg)';
                     e.currentTarget.style.strokeWidth = isMobile ? '14px' : '18px';
                     e.currentTarget.style.filter = selectedStatus === seg.key ? 'drop-shadow(0 16px 45px rgba(0,0,0,.55)) drop-shadow(0 0 32px rgba(255,255,255,.08))' : 'drop-shadow(0 10px 25px rgba(0,0,0,.45))';
                     e.currentTarget.style.opacity = selectedStatus === seg.key ? '1' : '.98';
                     handleMouseLeave();
                   }}

              />
            ))}
          </g>
        </svg>

          <div className="center" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: isMobile ? 'translate(-45%, -50%)' : 'translate(-50%, -50%)',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            width: isMobile ? '37%' : '55%',
            aspectRatio: '1/1',
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 50% 35%, rgba(255,255,255,.08), rgba(255,255,255,0) 60%), linear-gradient(180deg, rgba(7,10,16,.45), rgba(7,10,16,.72))',
            border: '1px solid rgba(255,255,255,.10)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.04), 0 18px 55px rgba(0,0,0,.45)',
            backdropFilter: 'blur(10px)',
            cursor: 'pointer',
            transition: 'transform .25s cubic-bezier(.2,.9,.2,1), background .25s cubic-bezier(.2,.9,.2,1)'
          }}
          onClick={() => onStatusClick('All')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = isMobile ? 'translate(-45%, -50%) scale(1.05)' : 'translate(-50%, -50%) scale(1.05)';
            e.currentTarget.style.background = 'radial-gradient(circle at 50% 35%, rgba(255,255,255,.12), rgba(255,255,255,0) 60%), linear-gradient(180deg, rgba(7,10,16,.55), rgba(7,10,16,.82))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = isMobile ? 'translate(-45%, -50%)' : 'translate(-50%, -50%)';
            e.currentTarget.style.background = 'radial-gradient(circle at 50% 35%, rgba(255,255,255,.08), rgba(255,255,255,0) 60%), linear-gradient(180deg, rgba(7,10,16,.45), rgba(7,10,16,.72))';
          }}
          >
          <div>
            <div style={{
              fontSize: 'clamp(26px, 3.1vw, 44px)',
              fontWeight: 900,
              letterSpacing: '.4px'
            }}>
              {centerDisplay.value}
            </div>
            <div style={{
              marginTop: '-2px',
              color: '#9aa7c7',
              fontSize: '12px'
            }}>
              {centerDisplay.label}
            </div>
          </div>
        </div>


      </div>

      {/* Tooltip */}
      {showTooltip && hoveredStatus && (
        <div style={{
          position: 'fixed',
          zIndex: 50,
          pointerEvents: 'none',
          transform: `translate(-50%, calc(-100% - 12px))`,
          background: 'rgba(7,10,16,.78)',
          border: '1px solid rgba(255,255,255,.10)',
          backdropFilter: 'blur(10px)',
          borderRadius: '14px',
          padding: '10px 12px',
          boxShadow: '0 18px 55px rgba(0,0,0,.55)',
          opacity: 1,
          transition: 'opacity .16s cubic-bezier(.2,.9,.2,1), transform .16s cubic-bezier(.2,.9,.2,1)',
          minWidth: '150px',
          left: tooltipPos.x,
          top: tooltipPos.y
        }}>
          <div style={{ fontWeight: 800, fontSize: '13px', letterSpacing: '.2px' }}>{hoveredStatus}</div>
          <div style={{ color: '#9aa7c7', fontSize: '12px', marginTop: '2px' }}>
            {(() => {
              const item = data.find(d => d.name === hoveredStatus);
              if (item) {
                const pct = ((item.value / total) * 100).toFixed(1);
                return `${item.value} drivers • ${pct}%`;
              }
              return '';
            })()}
          </div>
        </div>
      )}
    </div>
  );
};