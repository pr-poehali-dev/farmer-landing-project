export interface Asset {
  id: string;
  type: 'animal' | 'crop' | 'beehive';
  name: string;
  count: number;
  direction?: string;
  hectares?: number;
  details: string;
  investment_types?: string[];
}

export interface IncomeDetails {
  revenue_period: 'daily' | 'monthly' | 'yearly';
  revenue_amount: number;
  revenue_description: string;
  maintenance_cost: number;
  payout_amount: number;
  payout_period: 'monthly' | 'yearly';
  payout_duration: number;
  last_year_yield?: string;
}

export interface Proposal {
  id: number;
  type: 'income' | 'products' | 'patronage';
  asset: Asset;
  price: number;
  shares: number;
  description: string;
  expected_product?: string;
  update_frequency?: string;
  income_details?: IncomeDetails;
  status: string;
  created_at: string;
}

export const FARMER_API = 'https://functions.poehali.dev/1cab85a8-6eaf-4ad6-8bd1-acb7105af88e';

export const PROPOSAL_TYPES = [
  { 
    value: 'income', 
    label: 'Доход', 
    icon: 'DollarSign',
    description: 'Инвестор получает пассивный доход от производства',
    hint: 'Дай инвесторам долю в росте — пусть они почувствуют энергию твоих полей'
  },
  { 
    value: 'products', 
    label: 'Продукт', 
    icon: 'Package',
    description: 'Инвестор получает долю физического продукта',
    hint: 'Поделись урожаем — пусть инвесторы получат настоящее, что питает здоровье'
  },
  { 
    value: 'patronage', 
    label: 'Патронаж', 
    icon: 'Eye',
    description: 'Инвестор становится хранителем и наблюдает за ростом',
    hint: 'Сделай инвестора хранителем — пусть он следит за таинством роста через экран'
  }
];

export const UPDATE_FREQUENCIES = [
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'biweekly', label: 'Раз в 2 недели' },
  { value: 'monthly', label: 'Ежемесячно' }
];