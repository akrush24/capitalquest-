import React from 'react';

export interface IAchievement {
  id: string;
  year: number;
  text: string;
}

interface AchievementsProps {
  achievements: IAchievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  if (achievements.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 w-full">
      <h3 className="text-xl font-semibold text-gold-400 mb-4">Достижения</h3>
      <ul className="space-y-2 text-left">
        {achievements.map((ach) => (
          <li key={ach.id} className="bg-gray-700 p-3 rounded-lg animate-fade-in">
            <span className="font-bold text-green-400">Год {ach.year}:</span> {ach.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Achievements;
