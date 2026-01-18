export interface Machine {
  id: string;
  name: string;
  price: number;
  totalReturn: number;
  cycleDays: number;
}

export interface UserInvestment {
  id: string;
  machine: Machine;
  purchaseDate: Date;
}

export interface Token {
  id: string;
  value: number;
  isRedeemed: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  balance: number;
}
