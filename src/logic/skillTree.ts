import type { ICalculatorParams } from './calculator';

export interface ISkillNode {
  id: string;
  nameKey: string;
  descriptionKey: string;
  costGlory: number;
  effect: (params: Omit<ICalculatorParams, 'isCompound' | 'difficulty'>) => Omit<ICalculatorParams, 'isCompound' | 'difficulty'>;
  prerequisites: string[]; // IDs of skills that must be unlocked first
  branch: 'economy' | 'defense' | 'diplomacy';
}

export const SKILL_TREE: ISkillNode[] = [
  // Economy Branch
  {
    id: 'economic_efficiency',
    nameKey: 'skill_economic_efficiency_name',
    descriptionKey: 'skill_economic_efficiency_desc',
    costGlory: 100,
    effect: (params) => ({ ...params, monthlyContribution: params.monthlyContribution * 1.05 }), // +5% monthly contribution effectively
    prerequisites: [],
    branch: 'economy',
  },
  {
    id: 'advanced_banking',
    nameKey: 'skill_advanced_banking_name',
    descriptionKey: 'skill_advanced_banking_desc',
    costGlory: 250,
    effect: (params) => ({ ...params, annualRate: params.annualRate + 0.5 }), // +0.5% interest rate
    prerequisites: ['economic_efficiency'],
    branch: 'economy',
  },
  {
    id: 'trade_routes',
    nameKey: 'skill_trade_routes_name',
    descriptionKey: 'skill_trade_routes_desc',
    costGlory: 300,
    effect: (params) => ({ ...params, monthlyContribution: params.monthlyContribution * 1.10 }), // +10% monthly contribution
    prerequisites: ['advanced_banking'],
    branch: 'economy',
  },
  {
    id: 'master_craftsmen',
    nameKey: 'skill_master_craftsmen_name',
    descriptionKey: 'skill_master_craftsmen_desc',
    costGlory: 400,
    effect: (params) => ({ ...params, annualRate: params.annualRate + 0.75 }), // +0.75% interest rate
    prerequisites: ['trade_routes'],
    branch: 'economy',
  },

  // Defense Branch
  {
    id: 'border_patrols',
    nameKey: 'skill_border_patrols_name',
    descriptionKey: 'skill_border_patrols_desc',
    costGlory: 150,
    effect: (params) => ({ ...params, banditRaidReduction: (params.banditRaidReduction || 0) + 0.1 }), // Reduces bandit raid prob by 10%
    prerequisites: [],
    branch: 'defense',
  },
  {
    id: 'fortified_walls',
    nameKey: 'skill_fortified_walls_name',
    descriptionKey: 'skill_fortified_walls_desc',
    costGlory: 350,
    effect: (params) => ({ ...params, plagueImpactReduction: (params.plagueImpactReduction || 0) + 0.1 }), // Reduces plague impact by 10%
    prerequisites: ['border_patrols'],
    branch: 'defense',
  },
  {
    id: 'royal_guard',
    nameKey: 'skill_royal_guard_name',
    descriptionKey: 'skill_royal_guard_desc',
    costGlory: 500,
    effect: (params) => ({ ...params, warImpactReduction: (params.warImpactReduction || 0) + 0.15 }), // Reduces war impact by 15%
    prerequisites: ['fortified_walls'],
    branch: 'defense',
  },

  // Diplomacy Branch
  {
    id: 'diplomatic_embassy',
    nameKey: 'skill_diplomatic_embassy_name',
    descriptionKey: 'skill_diplomatic_embassy_desc',
    costGlory: 200,
    effect: (params) => ({ ...params, royalFavorBoost: (params.royalFavorBoost || 0) + 0.05 }), // +5% to Royal Favor probability
    prerequisites: [],
    branch: 'diplomacy',
  },
  {
    id: 'royal_marriage',
    nameKey: 'skill_royal_marriage_name',
    descriptionKey: 'skill_royal_marriage_desc',
    costGlory: 450,
    effect: (params) => ({ ...params, warProbabilityReduction: (params.warProbabilityReduction || 0) + 0.01 }), // -1% to War probability
    prerequisites: ['diplomatic_embassy'],
    branch: 'diplomacy',
  },
  {
    id: 'cultural_exchange',
    nameKey: 'skill_cultural_exchange_name',
    descriptionKey: 'skill_cultural_exchange_desc',
    costGlory: 600,
    effect: (params) => ({ ...params, gloryMultiplier: (params.gloryMultiplier || 1) + 0.1 }), // +10% Glory earned
    prerequisites: ['royal_marriage'],
    branch: 'diplomacy',
  },
];
