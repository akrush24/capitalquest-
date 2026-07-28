import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import type { IYearData } from '../logic/calculator';
import type { IEventInstance } from '../logic/events';

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: IYearData[];
  eventLog: IEventInstance[];
  currency: string;
}

const TimelineModal: React.FC<TimelineModalProps> = ({ isOpen, onClose, results, eventLog, currency }) => {
  const { t, language } = useTranslation();

  if (!isOpen) {
    return null;
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-panel-bg rounded-lg shadow-glow border border-rich-gold/50 p-6 w-full max-w-4xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-medieval text-rich-gold">{t('timeline')}</h2>
          <button onClick={onClose} className="text-2xl text-text-main hover:text-rich-gold">&times;</button>
        </div>
        <div className="overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-rich-gold/20">
                <th className="p-2">{t('timeline_year')}</th>
                <th className="p-2">{t('timeline_endValue')}</th>
                <th className="p-2">{t('timeline_interest')}</th>
                <th className="p-2">{t('timeline_contributions')}</th>
                <th className="p-2">{t('timeline_event')}</th>
              </tr>
            </thead>
            <tbody>
              {results.map(res => {
                const eventForYear = eventLog.find(e => e.year === res.year);
                return (
                  <tr key={res.year} className="border-b border-rich-gold/10">
                    <td className="p-2 font-bold">{res.year}</td>
                    <td className="p-2 font-bold text-forest-green">{formatCurrency(res.value)}</td>
                    <td className="p-2 text-forest-green">+{formatCurrency(res.interest)}</td>
                    <td className="p-2">{formatCurrency(res.totalContributions)}</td>
                    <td className="p-2 text-sm italic">
                      {eventForYear ? t(eventForYear.event.nameKey) : '---'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimelineModal;
