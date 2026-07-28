import { processEvents } from './events';
import type { IEventInstance } from './events';

export interface IMonthData {
  month: number;
  value: number; // Value at the end of the month
  contribution: number; // Monthly contribution (if any)
  interest: number; // Interest gained in this month
}

export interface IYearData {
  year: number;
  value: number;
  interest: number;
  totalContributions: number;
  months: IMonthData[]; // Array to store monthly breakdown
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

    const monthsData: IMonthData[] = [];
    let yearInterestGained = 0;

    for (let month = 1; month <= 12; month++) {
      const valueAtStartOfMonth = currentValue;
      currentValue += monthlyContribution;
      currentValue *= (1 + monthlyRate);
      const interestThisMonth = currentValue - valueAtStartOfMonth - monthlyContribution;
      yearInterestGained += interestThisMonth;

      monthsData.push({
        month: month,
        value: parseFloat(currentValue.toFixed(2)),
        contribution: monthlyContribution,
        interest: parseFloat(interestThisMonth.toFixed(2)),
      });
    }
    const totalContributions = initialDeposit + (monthlyContribution * 12 * year);
    
    let yearResult: IYearData = {
      year: year,
      value: currentValue,
      interest: yearInterestGained,
      totalContributions: totalContributions,
      months: monthsData,
    };

    if (difficulty === 'hard') {
        const { modifiedData, eventHappened } = processEvents(yearResult, params, random);
        if(eventHappened) {
            yearResult = modifiedData;
            currentValue = modifiedData.value; // Update currentValue for next year's calculation
            // Also update the last month's value to reflect event impact
            if (yearResult.months.length > 0) {
                yearResult.months[yearResult.months.length - 1].value = parseFloat(modifiedData.value.toFixed(2));
            }
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
    let totalInterestAccumulated = 0; // Accumulated interest from previous years
    let currentValue = initialDeposit;
    const random = createSeededRandom(params.eventSeed ?? 1);

    for (let year = 1; year <= years; year++) {
        const principalAtStartOfYear = initialDeposit + (monthlyContribution * 12 * (year - 1));
        const yearInterestGained = principalAtStartOfYear * (annualRate / 100);
        totalInterestAccumulated += yearInterestGained; // Accumulate yearly interest

        const monthsData: IMonthData[] = [];
        let monthStartValue = currentValue; // Value at the start of the year for simple interest
        if (year > 1) { // For subsequent years, start with the value from the end of previous year
             monthStartValue = results[results.length - 1].value;
        } else {
             monthStartValue = initialDeposit;
        }

        let currentMonthlyValue = monthStartValue;

        for (let month = 1; month <= 12; month++) {
            currentMonthlyValue += monthlyContribution;


            const interestThisMonth = yearInterestGained / 12; // Evenly distributed annual interest

            currentMonthlyValue += interestThisMonth; // Add the monthly portion of annual interest


            monthsData.push({
                month: month,
                value: parseFloat(currentMonthlyValue.toFixed(2)),
                contribution: monthlyContribution,
                interest: parseFloat(interestThisMonth.toFixed(2)),
            });
        }
        
        const totalContributions = initialDeposit + (monthlyContribution * 12 * year);
        
        let yearResult: IYearData = {
            year: year,
            value: currentMonthlyValue, // Final value after all months
            interest: yearInterestGained,
            totalContributions: totalContributions,
            months: monthsData,
        };

        if (difficulty === 'hard') {
            const { modifiedData, eventHappened } = processEvents(yearResult, params, random);
            if(eventHappened) {
                yearResult = modifiedData;
                // Also update the last month's value to reflect event impact
                if (yearResult.months.length > 0) {
                    yearResult.months[yearResult.months.length - 1].value = parseFloat(modifiedData.value.toFixed(2));
                }
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
