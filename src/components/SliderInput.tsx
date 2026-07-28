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
        <label className="font-semibold text-lg">{label}</label>
        <span className="text-sm text-gray-400">{metaphor}</span>
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg"
        />
        <div className="flex items-center bg-gray-700 rounded-md">
           <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            className="bg-transparent w-36 text-center font-semibold text-lg p-2 focus:outline-none"
          />
          {unit && <span className="pr-3 text-gray-400">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default SliderInput;
