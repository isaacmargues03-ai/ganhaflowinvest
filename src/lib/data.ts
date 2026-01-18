import type { Machine, UserInvestment } from './types';

export const machines: Machine[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    price: 10,
    totalReturn: 20,
    cycleDays: 7,
  },
  {
    id: 'silver',
    name: 'Prata',
    price: 20,
    totalReturn: 40,
    cycleDays: 7,
  },
  {
    id: 'gold',
    name: 'Ouro',
    price: 50,
    totalReturn: 100,
    cycleDays: 7,
  },
  {
    id: 'platinum',
    name: 'Platina',
    price: 100,
    totalReturn: 200,
    cycleDays: 7,
  },
  {
    id: 'diamond',
    name: 'Diamante',
    price: 200,
    totalReturn: 400,
    cycleDays: 7,
  },
];

export const userInvestments: UserInvestment[] = [
    {
        id: 'inv1',
        machine: machines[1], // Silver
        purchaseDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    },
    {
        id: 'inv2',
        machine: machines[3], // Platinum
        purchaseDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
];
