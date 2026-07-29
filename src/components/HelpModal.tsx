import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiers: { limit: number; path: string; nameKey: string }[];
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, tiers }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-panel-bg p-6 rounded-lg shadow-glow border border-rich-gold/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-rich-gold font-medieval">{t('helpTitle')}</h2>
          <button onClick={onClose} className="text-text-main text-xl font-bold px-3 py-1 rounded-full hover:bg-rich-gold/20 transition-colors">
            &times;
          </button>
        </div>

        <h3 className="text-xl font-semibold text-text-heading mb-2">{t('gameDescriptionTitle')}</h3>
        <p className="mb-4">{t('gameDescriptionContent')}</p>

        <h3 className="text-xl font-semibold text-text-heading mb-2">{t('levelsDescriptionTitle')}</h3>
        <div className="mb-4">
          {tiers.map((tier, index) => (
            <div key={index} className="flex items-center mb-2">
              {tier.path.startsWith('/images/') ? (
                <img src={tier.path} alt={t(tier.nameKey)} className="mr-2 w-6 h-6 inline-block" />
              ) : (
                <span className="mr-2 text-xl">{tier.path}</span>
              )}
              <span>{t(tier.nameKey)} - {tier.limit === Infinity ? t('unlimited') : tier.limit.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold text-text-heading mb-2">{t('mechanicsDescriptionTitle')}</h3>
        <p>{t('mechanicsDescriptionContent')}</p>

      </div>
    </div>
  );
};

export default HelpModal;
