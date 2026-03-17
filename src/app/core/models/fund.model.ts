export type FundCategory = 'FPV' | 'FIC';

export interface Fund {
  id: number;
  name: string;
  minimumAmount: number;
  category: FundCategory;
}
