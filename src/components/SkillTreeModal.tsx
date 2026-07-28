import React, { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { SKILL_TREE } from '../logic/skillTree';
import type { ICalculatorParams } from '../logic/calculator';

// Workaround for broken type exporting in this environment
interface ISkillNode {
  id: string;
  nameKey: string;
  descriptionKey: string;
  costGlory: number;
  effect: (params: Omit<ICalculatorParams, 'isCompound' | 'difficulty'>) => Omit<ICalculatorParams, 'isCompound' | 'difficulty'>;
  prerequisites: string[];
  branch: 'economy' | 'defense' | 'diplomacy';
}


type Branch = 'economy' | 'defense' | 'diplomacy';

interface BranchButtonProps {
  branch: Branch;
  label: string;
  activeBranch: Branch;
  onSelect: (branch: Branch) => void;
}

const BranchButton: React.FC<BranchButtonProps> = ({ branch, label, activeBranch, onSelect }) => (
  <button
    onClick={() => onSelect(branch)}
    className={`px-4 py-2 font-medieval text-lg rounded-t-md ${activeBranch === branch ? 'bg-bg-main text-rich-gold' : 'bg-panel-bg text-text-heading'}`}
  >
    {label}
  </button>
);

interface SkillTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: (skill: ISkillNode) => void;
  unlockedSkills: string[];
  currentGlory: number;
}

const SkillNode: React.FC<{
    skill: ISkillNode;
    onUnlock: (skill: ISkillNode) => void;
    isUnlocked: boolean;
    canAfford: boolean;
    prerequisitesMet: boolean;
}> = ({ skill, onUnlock, isUnlocked, canAfford, prerequisitesMet }) => {
    const { t } = useTranslation();
    const isUnlockable = !isUnlocked && canAfford && prerequisitesMet;
    
    return (
        <div className={`p-4 rounded-md border-2 ${isUnlocked ? 'border-rich-gold' : prerequisitesMet ? 'border-rich-gold/50' : 'border-gray-600'}`}>
            <h4 className="font-bold text-text-heading">{t(skill.nameKey)}</h4>
            <p className="text-sm italic my-1">{t(skill.descriptionKey)}</p>
            <p className="text-sm font-semibold text-rich-gold">
                {t('skill_costGlory', { cost: skill.costGlory })}
            </p>
            <button 
                onClick={() => onUnlock(skill)}
                disabled={!isUnlockable}
                className={`w-full mt-3 py-1 px-3 rounded-md font-semibold transition-colors text-sm ${
                    isUnlocked ? 'bg-forest-green text-white cursor-not-allowed' 
                    : !prerequisitesMet ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : !canAfford ? 'bg-red-900/50 text-red-300 cursor-not-allowed'
                    : 'bg-rich-gold text-bg-main hover:bg-yellow-400'
                }`}
            >
                {isUnlocked ? t('unlocked') : t('unlock')}
            </button>
        </div>
    );
}


const SkillTreeModal: React.FC<SkillTreeModalProps> = ({ isOpen, onClose, onUnlock, unlockedSkills, currentGlory }) => {
  const { t } = useTranslation();
  const [activeBranch, setActiveBranch] = useState<Branch>('economy');

  if (!isOpen) {
    return null;
  }

  const renderBranch = (branch: Branch) => {
    const branchSkills = SKILL_TREE.filter(skill => skill.branch === branch);
    return (
        <div className="space-y-4">
            {branchSkills.map(skill => {
                const prerequisitesMet = skill.prerequisites.every(prereqId => unlockedSkills.includes(prereqId));
                return (
                    <SkillNode 
                        key={skill.id}
                        skill={skill}
                        onUnlock={onUnlock}
                        isUnlocked={unlockedSkills.includes(skill.id)}
                        canAfford={currentGlory >= skill.costGlory}
                        prerequisitesMet={prerequisitesMet}
                    />
                )
            })}
        </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-panel-bg rounded-lg shadow-glow border border-rich-gold/50 p-6 w-full max-w-4xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-medieval text-rich-gold">{t('skillTree')}</h2>
          <button onClick={onClose} className="text-2xl text-text-main hover:text-rich-gold">&times;</button>
        </div>
        
        <div className="flex border-b-2 border-rich-gold/20">
            <BranchButton branch="economy" label={t('branch_economy')} activeBranch={activeBranch} onSelect={setActiveBranch} />
            <BranchButton branch="defense" label={t('branch_defense')} activeBranch={activeBranch} onSelect={setActiveBranch} />
            <BranchButton branch="diplomacy" label={t('branch_diplomacy')} activeBranch={activeBranch} onSelect={setActiveBranch} />
        </div>

        <div className="overflow-y-auto mt-4 p-2 bg-bg-main rounded-b-md">
          {renderBranch(activeBranch)}
        </div>
      </div>
    </div>
  );
};

export default SkillTreeModal;
