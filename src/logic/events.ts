import type { IYearData, ICalculatorParams } from './calculator';

export interface IEvent {
  id: string;
  nameKey: string;
  descriptionKey: string;
  type: 'good' | 'bad';
  probability: number;
  apply: (data: IYearData, params: ICalculatorParams) => IYearData;
}

export interface IEventInstance {
  year: number;
  event: IEvent;
}

export type RandomNumberGenerator = () => number;

const EVENTS: IEvent[] = [
  {
    id: 'excellent_harvest',
    nameKey: 'event_excellent_harvest_name',
    descriptionKey: 'event_excellent_harvest_desc',
    type: 'good',
    probability: 0.1, // 10% chance per year
    apply: (data) => ({
      ...data,
      interest: data.interest * (1.15),
      value: data.value + (data.interest * 0.15),
    }),
  },
  {
    id: 'plague',
    nameKey: 'event_plague_name',
    descriptionKey: 'event_plague_desc',
    type: 'bad',
    probability: 0.07, // 7% chance per year
    apply: (data, params) => ({
      ...data,
      value: data.value * (1 - 0.1 * (1 - (params.plagueImpactReduction || 0))), // 10% reduction, mitigated by skill
      gloryEarned: data.gloryEarned * (1 - 0.5 * (1 - (params.plagueImpactReduction || 0))), // Halve glory, mitigated
    }),
  },
  {
    id: 'bandit_raid',
    nameKey: 'event_bandit_raid_name',
    descriptionKey: 'event_bandit_raid_desc',
    type: 'bad',
    probability: 0.05, // 5% chance per year
    apply: (data, params) => ({
      ...data,
      value: data.value * (1 - 0.15 * (1 - (params.banditRaidReduction || 0))), // 15% reduction, mitigated
    }),
  },
  {
    id: 'royal_favor',
    nameKey: 'event_royal_favor_name',
    descriptionKey: 'event_royal_favor_desc',
    type: 'good',
    probability: 0.08, // 8% chance per year
    apply: (data, params) => ({
      ...data,
      value: data.value * (1.05 + (params.royalFavorBoost || 0)), // 5% bonus, boosted by skill
    }),
  },
  {
    id: 'war',
    nameKey: 'event_war_name',
    descriptionKey: 'event_war_desc',
    type: 'bad',
    probability: 0.02, // 2% chance per year, very impactful
    apply: (data, params) => ({
      ...data,
      value: data.value * (1 - 0.3 * (1 - (params.warImpactReduction || 0))), // 30% reduction, mitigated
      gloryEarned: 0, // No glory this year, not mitigated yet
    }),
  },
];

export function processEvents(
  yearData: IYearData,
  params: ICalculatorParams,
  random: RandomNumberGenerator = Math.random,
): { modifiedData: IYearData; eventHappened: IEvent | null } {
  for (const event of EVENTS) {
    let adjustedProbability = event.probability;

    // Adjust probabilities based on params
    if (event.id === 'bandit_raid' && params.banditRaidReduction) {
        adjustedProbability *= (1 - params.banditRaidReduction);
    }
    if (event.id === 'war' && params.warProbabilityReduction) {
        adjustedProbability *= (1 - params.warProbabilityReduction);
    }
    if (event.id === 'royal_favor' && params.royalFavorBoost) {
        adjustedProbability *= (1 + params.royalFavorBoost); // Boost probability for good events
    }
    // Note: plagueImpactReduction does not affect probability, only impact

    if (random() < adjustedProbability) {
      const modifiedData = event.apply(yearData, params);
      return { modifiedData, eventHappened: event };
    }
  }
  return { modifiedData: yearData, eventHappened: null };
}
