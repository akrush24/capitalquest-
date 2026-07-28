import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

import CrestDisplay from './crests/CrestDisplay';

export const CRESTS = ['crest1.svg', 'crest2.svg', 'crest3.svg'];

interface CrestSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (crest: string) => void;
  selectedCrest: string;
}

const CrestSelector: React.FC<CrestSelectorProps> = ({ isOpen, onClose, onSelect, selectedCrest }) => {
  const { t } = useTranslation();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-panel-bg rounded-lg shadow-glow border border-rich-gold/50 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-medieval text-rich-gold">{t('selectCrest')}</h2>
          <button onClick={onClose} className="text-2xl text-text-main hover:text-rich-gold">&times;</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CRESTS.map(crest => (
            <button
              key={crest}
              onClick={() => onSelect(crest)}
              className={`p-2 rounded-md transition-colors border-2 ${selectedCrest === crest ? 'border-rich-gold bg-rich-gold/20' : 'border-transparent hover:border-rich-gold/50'}`}
            >
              <CrestDisplay crestId={crest} className="w-24 h-24" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CrestSelector;
