import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { UPGRADES } from '../logic/upgrades';
import type { ICalculatorParams } from '../logic/calculator';

interface IUpgrade {
  id: string;
  nameKey: string;
  descriptionKey: string;
  cost: number;
  effect: (params: Omit<ICalculatorParams, 'isCompound' | 'difficulty'>) => Omit<ICalculatorParams, 'isCompound' | 'difficulty'>;
}

interface UpgradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (upgrade: IUpgrade) => void;
  purchasedIds: string[];
  treasury: number;
  currencySymbol: string;
}

const UpgradesModal: React.FC<UpgradesModalProps> = ({ isOpen, onClose, onPurchase, purchasedIds, treasury, currencySymbol }) => {
  const { t } = useTranslation();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-panel-bg rounded-lg shadow-glow border border-rich-gold/50 p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-medieval text-rich-gold">{t('upgrades')}</h2>
          <button onClick={onClose} className="text-2xl text-text-main hover:text-rich-gold">&times;</button>
        </div>
        <ul className="space-y-4">
          {UPGRADES.map(upgrade => {
            const isPurchased = purchasedIds.includes(upgrade.id);
            const canAfford = treasury >= upgrade.cost;
            const isDisabled = isPurchased || !canAfford;

            return (
              <li key={upgrade.id} className="bg-bg-main/50 p-4 rounded-md flex justify-between items-center border border-rich-gold/10">
                <div>
                  <h3 className="font-bold text-text-heading">{t(upgrade.nameKey)}</h3>
                  <p className="text-sm italic">{t(upgrade.descriptionKey)}</p>
                  <p className="text-sm font-semibold text-rich-gold mt-1">
                    {t('cost')}: {upgrade.cost.toLocaleString()} {currencySymbol}
                  </p>
                </div>
                <button
                  onClick={() => onPurchase(upgrade)}
                  disabled={isDisabled}
                  className={`py-2 px-4 rounded-md font-semibold transition-colors ${
                    isPurchased
                      ? 'bg-forest-green text-white cursor-not-allowed'
                      : isDisabled
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-rich-gold text-bg-main hover:bg-yellow-400'
                  }`}
                >
                  {isPurchased ? t('purchased') : t('purchase')}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default UpgradesModal;
