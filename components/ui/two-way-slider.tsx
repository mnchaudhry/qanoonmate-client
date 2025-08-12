import React from 'react';
import { Range, getTrackBackground } from 'react-range';

interface TwoWaySliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
  step?: number;
  className?: string;
  label?: string;
}

const TwoWaySlider: React.FC<TwoWaySliderProps> = ({ min, max, value, onChange, step = 1, className = '', label }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block mb-2 text-sm font-medium text-foreground">{label}</label>}
      <Range
        values={value}
        step={step}
        min={min}
        max={max}
        onChange={vals => onChange([vals[0], vals[1]])}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{ ...props.style, height: '36px', display: 'flex', width: '100%' }}
            className="relative"
          >
            <div
              ref={props.ref}
              className="w-full h-2 rounded-full bg-muted"
              style={{
                background: getTrackBackground({ values: value, colors: ['#e5e7eb', 'hsl(var(--primary))', '#e5e7eb'], min, max })
              }}
            >
              <div className="absolute left-0 right-0 top-0 bottom-0" />
            </div>
            {children}
          </div>
        )}
        renderThumb={({ props, index, isDragged }) => (
          <div
            {...props}
            className={`h-5 w-5 rounded-full bg-primary border-2 border-white shadow-md flex items-center justify-center focus:outline-none transition ${isDragged ? 'scale-110' : ''}`}
            style={{ ...props.style }}
            aria-label={index === 0 ? 'Minimum year' : 'Maximum year'}
          >
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>
        )}
      />
      <div className="flex justify-between mt-0 text-xs text-muted-foreground select-none">
        <span>{value[0]}</span>
        <span>{value[1]}</span>
      </div>
    </div>
  );
};

export default TwoWaySlider; 