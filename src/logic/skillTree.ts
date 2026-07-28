import type { ICalculatorParams } from './calculator';

export interface ISkillNode {
  id: string;
  nameKey: string;
  descriptionKey: string;

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

    effect: (params) => ({ ...params, monthlyContribution: params.monthlyContribution * 1.05 }), // +5% monthly contribution effectively
    prerequisites: [],
    branch: 'economy',
  },
  {
    id: 'advanced_banking',
    nameKey: 'skill_advanced_banking_name',
    descriptionKey: 'skill_advanced_banking_desc',

    effect: (params) => ({ ...params, annualRate: params.annualRate + 0.5 }), // +0.5% interest rate
    prerequisites: ['economic_efficiency'],
    branch: 'economy',
  },
  {
    id: 'trade_routes',
    nameKey: 'skill_trade_routes_name',
    descriptionKey: 'skill_trade_routes_desc',

    effect: (params) => ({ ...params, monthlyContribution: params.monthlyContribution * 1.10 }), // +10% monthly contribution
    prerequisites: ['advanced_banking'],
    branch: 'economy',
  },
  {
    id: 'master_craftsmen',
    nameKey: 'skill_master_craftsmen_name',
    descriptionKey: 'skill_master_craftsmen_desc',

    effect: (params) => ({ ...params, annualRate: params.annualRate + 0.75 }), // +0.75% interest rate
    prerequisites: ['trade_routes'],
    branch: 'economy',
  },
  {
    id: 'market_expansion',
    nameKey: 'skill_market_expansion_name',
    descriptionKey: 'skill_market_expansion_desc',

    effect: (params) => ({ ...params, monthlyContribution: params.monthlyContribution * 1.15 }), // +15% monthly contribution
    prerequisites: ['master_craftsmen'],
    branch: 'economy',
  },
  {
    id: 'golden_age',
    nameKey: 'skill_golden_age_name',
    descriptionKey: 'skill_golden_age_desc',

    effect: (params) => ({ ...params, annualRate: params.annualRate + 1.0 }), // +1.0% interest rate
    prerequisites: ['market_expansion'],
    branch: 'economy',
  },

  // Defense Branch
  {
    id: 'border_patrols',
    nameKey: 'skill_border_patrols_name',
    descriptionKey: 'skill_border_patrols_desc',

    effect: (params) => ({ ...params, banditRaidReduction: (params.banditRaidReduction || 0) + 0.1 }), // Reduces bandit raid prob by 10%
    prerequisites: [],
    branch: 'defense',
  },
  {
    id: 'fortified_walls',
    nameKey: 'skill_fortified_walls_name',
    descriptionKey: 'skill_fortified_walls_desc',

    effect: (params) => ({ ...params, plagueImpactReduction: (params.plagueImpactReduction || 0) + 0.1 }), // Reduces plague impact by 10%
    prerequisites: ['border_patrols'],
    branch: 'defense',
  },
  {
    id: 'royal_guard',
    nameKey: 'skill_royal_guard_name',
    descriptionKey: 'skill_royal_guard_desc',

    effect: (params) => ({ ...params, warImpactReduction: (params.warImpactReduction || 0) + 0.15 }), // Reduces war impact by 15%
    prerequisites: ['fortified_walls'],
    branch: 'defense',
  },
  {
    id: 'scout_towers',
    nameKey: 'skill_scout_towers_name',
    descriptionKey: 'skill_scout_towers_desc',

    effect: (params) => ({ ...params, banditRaidReduction: (params.banditRaidReduction || 0) + 0.15 }), // Reduces bandit raid prob by 15%
    prerequisites: ['royal_guard'],
    branch: 'defense',
  },
  {
    id: 'legendary_fortress',
    nameKey: 'skill_legendary_fortress_name',
    descriptionKey: 'skill_legendary_fortress_desc',

    effect: (params) => ({ ...params, warImpactReduction: (params.warImpactReduction || 0) + 0.20 }), // Reduces war impact by 20%
    prerequisites: ['scout_towers'],
    branch: 'defense',
  },

  // Diplomacy Branch
  {
    id: 'diplomatic_embassy',
    nameKey: 'skill_diplomatic_embassy_name',
    descriptionKey: 'skill_diplomatic_embassy_desc',

    effect: (params) => ({ ...params, royalFavorBoost: (params.royalFavorBoost || 0) + 0.05 }), // +5% to Royal Favor probability
    prerequisites: [],
    branch: 'diplomacy',
  },
  {
    id: 'royal_marriage',
    nameKey: 'skill_royal_marriage_name',
    descriptionKey: 'skill_royal_marriage_desc',

    effect: (params) => ({ ...params, warProbabilityReduction: (params.warProbabilityReduction || 0) + 0.01 }), // -1% to War probability
    prerequisites: ['diplomatic_embassy'],
    branch: 'diplomacy',
  },
  {
    id: 'cultural_exchange',
    nameKey: 'skill_cultural_exchange_name',
    descriptionKey: 'skill_cultural_exchange_desc',

    effect: (params) => ({ ...params }), // No glory multiplier effect anymore
    prerequisites: ['royal_marriage'],
    branch: 'diplomacy',
  },
  {
    id: 'trade_agreements',
    nameKey: 'skill_trade_agreements_name',
    descriptionKey: 'skill_trade_agreements_desc',

    effect: (params) => ({ ...params, royalFavorBoost: (params.royalFavorBoost || 0) + 0.07 }), // +7% to Royal Favor probability
    prerequisites: ['cultural_exchange'],
    branch: 'diplomacy',
  },
  {
    id: 'global_alliance',
    nameKey: 'skill_global_alliance_name',
    descriptionKey: 'skill_global_alliance_desc',

    effect: (params) => ({ ...params, warProbabilityReduction: (params.warProbabilityReduction || 0) + 0.02 }), // -2% to War probability
    prerequisites: ['trade_agreements'],
    branch: 'diplomacy',
  },
];
