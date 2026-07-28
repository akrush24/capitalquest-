import React from 'react';

interface SliderInputProps {
  label: string;
  metaphor: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

const SliderInput: React.FC<SliderInputProps> = ({ label, metaphor, value, onChange, min, max, step, unit = '' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="font-semibold text-text-heading">{label}</label>
        <span className="text-sm text-text-main italic">{metaphor}</span>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-bg-main rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex items-center bg-bg-main rounded-md border border-rich-gold/20">
           <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className="bg-transparent w-36 text-center font-semibold text-text-heading p-2 focus:outline-none"
          />
          {unit && <span className="pr-3 text-text-main">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default SliderInput;
