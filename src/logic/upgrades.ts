import type { ICalculatorParams } from './calculator';

export const UPGRADES: {
  id: string;
  nameKey: string;
  descriptionKey: string;
  cost: number;
  effect: (params: Omit<ICalculatorParams, 'isCompound' | 'difficulty'>) => Omit<ICalculatorParams, 'isCompound' | 'difficulty'>;
}[] = [
    {
        id: 'stone_roads',
        nameKey: 'upgrade_stone_roads_name',
        descriptionKey: 'upgrade_stone_roads_desc',
        cost: 100000,
        effect: (params) => ({ ...params, annualRate: params.annualRate + 0.1 }),
    },
    {
        id: 'trade_guild',
        nameKey: 'upgrade_trade_guild_name',
        descriptionKey: 'upgrade_trade_guild_desc',
        cost: 500000,
        effect: (params) => ({ ...params, annualRate: params.annualRate + 0.25 }),
    },
    {
        id: 'alchemy_lab',
        nameKey: 'upgrade_alchemy_lab_name',
        descriptionKey: 'upgrade_alchemy_lab_desc',
        cost: 2000000,
        effect: (params) => ({ ...params, annualRate: params.annualRate + 0.5 }),
    },
];
