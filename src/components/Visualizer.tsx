import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export const TIERS = [
    { limit: 25000,    path: '/images/tent.svg',     nameKey: 'tier_tent' },
    { limit: 100000,   path: '🏕️', nameKey: 'tier_camp' },
    { limit: 250000,   path: '🛖', nameKey: 'tier_hut' },
    { limit: 750000,   path: '🏡', nameKey: 'tier_house' },
    { limit: 2000000,  path: '🏘️', nameKey: 'tier_village' },
    { limit: 5000000,  path: '⛪', nameKey: 'tier_town' },
    { limit: 15000000, path: '🏰', nameKey: 'tier_castle' },
    { limit: 50000000, path: '🏛️', nameKey: 'tier_citadel' },
    { limit: 150000000, path: '🏙️', nameKey: 'tier_city' },
    { limit: 500000000, path: '✨🏙️✨', nameKey: 'tier_metropolis' },
    { limit: 2000000000, path: '👑', nameKey: 'tier_kingdom' },
    { limit: Infinity,   path: '🌌', nameKey: 'tier_utopia' },
];

interface VisualizerProps {
  value: number;
  isCompound: boolean;
  tiers: typeof TIERS;
}

const Visualizer: React.FC<VisualizerProps> = ({ value, isCompound, tiers }) => {
  const { t } = useTranslation();
  const currentTier = tiers.find(tier => value < tier.limit) || tiers[tiers.length - 1];
  
  const isEmoji = (path: string) => /\p{Emoji}/u.test(path);

  return (
    <div className="text-center h-32 flex flex-col items-center justify-center">
        <div className="relative h-24 w-24">
            {!isCompound && (
                <span className="absolute -top-2 -right-2 text-5xl animate-fade-in z-10" role="img" aria-label="rain cloud">⛈️</span>
            )}
            {tiers.map(tier => {
                const isCurrent = currentTier.path === tier.path;
                const commonClass = `absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${isCurrent ? 'opacity-100' : 'opacity-0'}`;
                
                if (isEmoji(tier.path)) {
                    return <span key={tier.path} className={`${commonClass} text-7xl flex items-center justify-center`}>{tier.path}</span>;
                }
                return (
                    <img
                        key={tier.path}
                        src={tier.path}
                        alt={t(tier.nameKey)}
                        className={`${commonClass} text-text-main`}
                    />
                );
            })}
        </div>
        <div className="text-2xl text-text-heading mt-4 font-medieval">
            {t(currentTier.nameKey)}
        </div>
    </div>
  );
};

export default Visualizer;
