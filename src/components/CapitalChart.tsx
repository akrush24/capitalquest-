import { useMemo, useState } from 'react';
import type { IYearData } from '../logic/calculator';
import { useTranslation } from '../contexts/LanguageContext';

interface CapitalChartProps {
  results: IYearData[];
  simpleResults: IYearData[];
  inflationRate: number;
  currency: string;
}

const WIDTH = 640;
const HEIGHT = 280;
const PADDING = { top: 24, right: 20, bottom: 42, left: 54 };

const CapitalChart = ({ results, simpleResults, inflationRate, currency }: CapitalChartProps) => {
  const { t, language } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const numberFormat = useMemo(
    () => new Intl.NumberFormat(language, { style: 'currency', currency, maximumFractionDigits: 0, notation: 'compact' }),
    [currency, language],
  );

  const series = useMemo(() => {
    const nominal = results.map(item => item.value);
    const real = results.map(item => item.value / Math.pow(1 + inflationRate / 100, item.year));
    const simple = simpleResults.map(item => item.value);
    return { nominal, real, simple };
  }, [inflationRate, results, simpleResults]);

  if (results.length === 0) return null;

  const maxValue = Math.max(1, ...series.nominal, ...series.real, ...series.simple);
  const chartWidth = WIDTH - PADDING.left - PADDING.right;
  const chartHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const point = (value: number, index: number) => ({
    x: PADDING.left + (index / Math.max(results.length - 1, 1)) * chartWidth,
    y: PADDING.top + chartHeight - (value / maxValue) * chartHeight,
  });
  const path = (values: number[]) => values.map((value, index) => {
    const { x, y } = point(value, index);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  const selected = activeIndex === null ? results.length - 1 : activeIndex;
  const selectedYear = results[selected];

  const onMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (WIDTH / rect.width);
    const index = Math.round(((x - PADDING.left) / chartWidth) * (results.length - 1));
    setActiveIndex(Math.max(0, Math.min(results.length - 1, index)));
  };

  return (
    <section className="parchment-chart mt-8 rounded-lg border-2 border-rich-gold/60 p-4 sm:p-6 shadow-glow" aria-label={t('chartTitle')}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-rich-gold/80">✦ {t('timeline')} ✦</p>
          <h2 className="font-medieval text-3xl text-[#52351e]">{t('chartTitle')}</h2>
        </div>
        <p className="max-w-sm text-sm italic text-[#65452a]">{t('chartHint')}</p>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3 text-sm font-semibold text-[#52351e]">
        <span><i className="legend-swatch bg-[#9b2c2c]" />{t('chartNominal')}</span>
        <span><i className="legend-swatch bg-[#386641]" />{t('chartReal')}</span>
        <span><i className="legend-swatch bg-[#5a4a8c]" />{t('chartSimple')}</span>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full select-none" role="img" onMouseMove={onMove} onMouseLeave={() => setActiveIndex(null)}>
        <defs>
          <filter id="ink-roughen"><feTurbulence baseFrequency="0.018" numOctaves="2" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="0.7" /></filter>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
          const y = PADDING.top + chartHeight * ratio;
          return <g key={ratio}><line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={y} y2={y} className="chart-grid" /><text x={PADDING.left - 8} y={y + 4} textAnchor="end" className="chart-axis">{numberFormat.format(maxValue * (1 - ratio))}</text></g>;
        })}
        <line x1={PADDING.left} x2={PADDING.left} y1={PADDING.top} y2={HEIGHT - PADDING.bottom} className="chart-axis-line" />
        <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={HEIGHT - PADDING.bottom} y2={HEIGHT - PADDING.bottom} className="chart-axis-line" />
        <path d={path(series.simple)} className="chart-line chart-simple" filter="url(#ink-roughen)" />
        <path d={path(series.real)} className="chart-line chart-real" filter="url(#ink-roughen)" />
        <path d={path(series.nominal)} className="chart-line chart-nominal" filter="url(#ink-roughen)" />
        {results.map((result, index) => {
          const { x } = point(0, index);
          return <text key={result.year} x={x} y={HEIGHT - 16} textAnchor="middle" className="chart-axis">{result.year}</text>;
        })}
        {activeIndex !== null && (() => {
          const guide = point(0, selected).x;
          return <g><line x1={guide} x2={guide} y1={PADDING.top} y2={HEIGHT - PADDING.bottom} className="chart-guide" />{Object.entries(series).map(([name, values]) => {
            const position = point(values[selected], selected);
            return <circle key={name} cx={position.x} cy={position.y} r="5" className={`chart-dot chart-${name}`} />;
          })}</g>;
        })()}
      </svg>

      <div className="chart-scroll mt-2 grid grid-cols-1 sm:grid-cols-4 gap-2 rounded border border-[#7a5631]/40 bg-[#f0dcaa]/60 p-3 text-sm text-[#52351e]">
        <span className="font-bold">{t('year', { year: selectedYear.year })}</span>
        <span>{t('chartNominal')}: <b>{numberFormat.format(series.nominal[selected])}</b></span>
        <span>{t('chartReal')}: <b>{numberFormat.format(series.real[selected])}</b></span>
        <span>{t('chartSimple')}: <b>{numberFormat.format(series.simple[selected])}</b></span>
      </div>
    </section>
  );
};

export default CapitalChart;
