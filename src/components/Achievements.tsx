import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export interface IAchievement {
  id: string;
  year: number;
  text: string;
}

interface AchievementsProps {
  achievements: IAchievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const { t } = useTranslation();
  if (achievements.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 w-full">
      <h3 className="text-2xl font-medieval text-rich-gold mb-4">{t('achievements')}</h3>
      <ul className="space-y-2 text-left">
        {achievements.map((ach) => (
          <li key={ach.id} className="bg-bg-main/50 p-3 rounded-lg animate-fade-in border border-rich-gold/20">
            <span className="font-bold text-forest-green">{t('year', { year: ach.year })}:</span> {ach.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Achievements;
