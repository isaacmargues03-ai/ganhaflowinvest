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
