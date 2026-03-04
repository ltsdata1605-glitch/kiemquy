import { DenominationCount } from './types';

export const DENOMINATIONS: number[] = [
  500000, 200000, 100000, 50000, 20000, 10000, 5000, 2000, 1000, 500,
];

export const INITIAL_DENOMINATIONS: DenominationCount[] = DENOMINATIONS.map((value) => ({
  value,
  count: 0,
}));
