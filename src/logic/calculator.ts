export interface IYearData {
  year: number;
  value: number;
  interest: number;
  totalContributions: number;
}

export interface ICalculatorParams {
  initialDeposit: number;
  monthlyContribution: number;
  years: number;
  annualRate: number;
  isCompound: boolean;
  inflationRate?: number;
}

function calculateCompound(params: ICalculatorParams): IYearData[] {
  const { initialDeposit, monthlyContribution, years, annualRate } = params;
  const results: IYearData[] = [];
  let currentValue = initialDeposit;
  const monthlyRate = annualRate / 100 / 12;

  for (let year = 1; year <= years; year++) {
    const valueAtStartOfYear = currentValue;
    for (let month = 1; month <= 12; month++) {
      currentValue += monthlyContribution;
      currentValue *= (1 + monthlyRate);
    }
    const interestGained = currentValue - valueAtStartOfYear - (monthlyContribution * 12);
    const totalContributions = initialDeposit + (monthlyContribution * 12 * year);
    
    results.push({
      year: year,
      value: parseFloat(currentValue.toFixed(2)),
      interest: parseFloat(interestGained.toFixed(2)),
      totalContributions: totalContributions,
    });
  }
  return results;
}

function calculateSimple(params: ICalculatorParams): IYearData[] {
    const { initialDeposit, monthlyContribution, years, annualRate } = params;
    const results: IYearData[] = [];
    let totalInterest = 0;

    for (let year = 1; year <= years; year++) {
        const principalAtStartOfYear = initialDeposit + (monthlyContribution * 12 * (year - 1));
        const interestGained = principalAtStartOfYear * (annualRate / 100);
        totalInterest += interestGained;

        const totalContributions = initialDeposit + (monthlyContribution * 12 * year);
        const currentValue = totalContributions + totalInterest;

        results.push({
            year: year,
            value: parseFloat(currentValue.toFixed(2)),
            interest: parseFloat(interestGained.toFixed(2)),
            totalContributions: totalContributions,
        });
    }
    return results;
}

export function calculateInterest(params: ICalculatorParams): IYearData[] {
  if (params.isCompound) {
    return calculateCompound(params);
  } else {
    return calculateSimple(params);
  }
}

