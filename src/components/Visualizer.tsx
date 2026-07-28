import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface VisualizerProps {
  value: number;
  isCompound: boolean;
}

const TIERS = [
  { limit: 50000, emoji: '🌱', nameKey: 'tier_seedling' },
  { limit: 250000, emoji: '🌿', nameKey: 'tier_sapling' },
  { limit: 1000000, emoji: '🌳', nameKey: 'tier_tree' },
  { limit: 5000000, emoji: '🌲🌲', nameKey: 'tier_grove' },
  { limit: 15000000, emoji: '🛖', nameKey: 'tier_village' },
  { limit: 50000000, emoji: '🏘️', nameKey: 'tier_town' },
  { limit: 100000000, emoji: '🏰', nameKey: 'tier_castle' },
  { limit: 250000000, emoji: '🏙️', nameKey: 'tier_city' },
  { limit: 750000000, emoji: '✨🏙️✨', nameKey: 'tier_metropolis' },
  { limit: Infinity, emoji: '🌌', nameKey: 'tier_utopia' },
];

const Visualizer: React.FC<VisualizerProps> = ({ value, isCompound }) => {
  const { t } = useTranslation();
  const currentTier = TIERS.find(tier => value < tier.limit) || TIERS[TIERS.length - 1];

  return (
    <div className="text-center">
      <div className="relative text-8xl mb-4 transition-transform duration-500 transform hover:scale-110">
        {!isCompound && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl animate-fade-in" role="img" aria-label="rain cloud">⛈️</span>
        )}
        <span>{currentTier.emoji}</span>
      </div>
      <div className="text-2xl text-gray-300">
        {t(currentTier.nameKey)}
      </div>
    </div>
  );
};

export default Visualizer;
