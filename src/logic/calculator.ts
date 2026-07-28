import { processEvents } from './events';
import type { IEventInstance } from './events';

export interface IYearData {
  year: number;
  value: number;
  interest: number;
  totalContributions: number;
  gloryEarned: number;
}

export type Difficulty = 'normal' | 'hard';

export interface ICalculatorParams {
  initialDeposit: number;
  monthlyContribution: number;
  years: number;
  annualRate: number;
  isCompound: boolean;
  difficulty: Difficulty;
  inflationRate: number;
  // Skill Tree Effects
  banditRaidReduction?: number; // Reduces bandit raid probability (0 to 1)
  plagueImpactReduction?: number; // Reduces plague impact (0 to 1)
  warImpactReduction?: number; // Reduces war impact (0 to 1)
  royalFavorBoost?: number; // Increases royal favor probability (0 to 1)
  warProbabilityReduction?: number; // Reduces war probability (0 to 1)
  gloryMultiplier?: number; // Multiplies glory earned (e.g., 1.1 for +10%)
  eventSeed?: number;
}

function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ICalculationResult {
    results: IYearData[];
    eventLog: IEventInstance[];
}

function calculateCompound(params: ICalculatorParams): ICalculationResult {
  const { initialDeposit, monthlyContribution, years, annualRate, difficulty } = params;
  const results: IYearData[] = [];
  const eventLog: IEventInstance[] = [];
  let currentValue = initialDeposit;
  const monthlyRate = annualRate / 100 / 12;
  const random = createSeededRandom(params.eventSeed ?? 1);

  for (let year = 1; year <= years; year++) {
    const valueAtStartOfYear = currentValue;
    for (let month = 1; month <= 12; month++) {
      currentValue += monthlyContribution;
      currentValue *= (1 + monthlyRate);
    }
    const interestGained = currentValue - valueAtStartOfYear - (monthlyContribution * 12);
    const totalContributions = initialDeposit + (monthlyContribution * 12 * year);
    const gloryEarned = Math.floor(interestGained > 0 ? (interestGained / 1000) * (params.gloryMultiplier ?? 1) : 0);
    
    let yearResult: IYearData = {
      year: year,
      value: currentValue,
      interest: interestGained,
      totalContributions: totalContributions,
      gloryEarned: gloryEarned,
    };

    if (difficulty === 'hard') {
        const { modifiedData, eventHappened } = processEvents(yearResult, params, random);
        if(eventHappened) {
            yearResult = modifiedData;
            currentValue = modifiedData.value;
            eventLog.push({ year, event: eventHappened });
        }
    }
    
    yearResult.value = parseFloat(yearResult.value.toFixed(2));
    yearResult.interest = parseFloat(yearResult.interest.toFixed(2));
    results.push(yearResult);
  }
  return { results, eventLog };
}

function calculateSimple(params: ICalculatorParams): ICalculationResult {
    const { initialDeposit, monthlyContribution, years, annualRate, difficulty } = params;
    const results: IYearData[] = [];
    const eventLog: IEventInstance[] = [];
    let totalInterest = 0;
    const random = createSeededRandom(params.eventSeed ?? 1);

    for (let year = 1; year <= years; year++) {
        const principalAtStartOfYear = initialDeposit + (monthlyContribution * 12 * (year - 1));
        const interestGained = principalAtStartOfYear * (annualRate / 100);
        totalInterest += interestGained;

        const totalContributions = initialDeposit + (monthlyContribution * 12 * year);
        const currentValue = totalContributions + totalInterest;
        const gloryEarned = Math.floor(interestGained > 0 ? (interestGained / 1000) * (params.gloryMultiplier ?? 1) : 0);

        let yearResult: IYearData = {
            year: year,
            value: currentValue,
            interest: interestGained,
            totalContributions: totalContributions,
            gloryEarned: gloryEarned,
        };

        if (difficulty === 'hard') {
            const { modifiedData, eventHappened } = processEvents(yearResult, params, random);
            if(eventHappened) {
                yearResult = modifiedData;
                // In simple interest, events might affect the total value, but not future interest calculations
                // which are based on principal. This is a design choice.
                eventLog.push({ year, event: eventHappened });
            }
        }

        yearResult.value = parseFloat(yearResult.value.toFixed(2));
        yearResult.interest = parseFloat(yearResult.interest.toFixed(2));
        results.push(yearResult);
    }
    return { results, eventLog };
}

export function calculateInterest(params: ICalculatorParams): ICalculationResult {
  if (params.isCompound) {
    return calculateCompound(params);
  } else {
    return calculateSimple(params);
  }
}
