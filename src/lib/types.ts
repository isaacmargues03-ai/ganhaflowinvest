import { Timestamp } from 'firebase/firestore';

export interface Machine {
  id: string;
  name: string;
  price: number;
  totalReturn: number;
  cycleDays: number;
}

export interface UserInvestment {
  id: string;
  machineId: string;
  purchaseDate: Date | Timestamp;
  machineName: string;
  machinePrice: number;
  machineTotalReturn: number;
  machineCycleDays: number;
}

export interface Token {
  id: string;
  code: string;
  value: number;
  isRedeemed: boolean;
  redeemedBy: string | null;
  redeemedAt: Timestamp | null;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  balance: number;
  createdAt: Timestamp;
}
