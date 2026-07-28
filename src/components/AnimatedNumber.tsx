import React, { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  className?: string;
  currency: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, className, currency }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const frameRef = useRef<number>();

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    const duration = 500; // ms
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const animatedValue = startValue + (endValue - startValue) * percentage;
      setDisplayValue(animatedValue);

      if (percentage < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = endValue;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      prevValueRef.current = value;
    };
  }, [value]);

  return (
    <p className={className}>
      {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(displayValue)}
    </p>
  );
};

export default AnimatedNumber;
