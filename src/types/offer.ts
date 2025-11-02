export interface Offer {
  id: number;
  farmer_id: number;
  farmer_name?: string;
  farm_name: string;
  title: string;
  description: string;
  asset: string;
  total_amount: number;
  share_price: number;
  total_shares: number;
  available_shares: number;
  min_shares: number;
  expected_monthly_income?: number;
  region: string;
  city: string;
  socials?: string;
  is_published: boolean;
  status: 'published' | 'draft' | 'closed';
  created_at: string;
  updated_at?: string;
}

export interface OfferRequest {
  id?: number;
  offer_id: number;
  investor_id: number;
  investor_name?: string;
  shares_requested: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}
