export const SELLER_API = 'https://functions.poehali.dev/cc24321a-77b4-44ce-9ae2-7fb7efee6660';

export interface Profile {
  id: number;
  email: string;
  name: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  photo_url: string | null;
  subscription_tier: string;
  subscription_expires_at: string | null;
  company_name: string | null;
  description: string | null;
  website: string | null;
  vk_link: string | null;
  telegram_link: string | null;
  products: any[];
  ads: any[];
}

export interface ProfileForm {
  company_name: string;
  description: string;
  website: string;
  vk_link: string;
  telegram_link: string;
  first_name: string;
  last_name: string;
  phone: string;
  region: string;
  city: string;
}

export interface ProductForm {
  type: string;
  name: string;
  price: number;
  description: string;
  photo_url: string;
  photo_url_2: string;
  photo_url_3: string;
  target_audience: string[];
}

export interface AdForm {
  name: string;
  image_url: string;
  text: string;
  link: string;
  target_audience: string;
}

export interface Analytics {
  product_views: number;
  farm_requests: number;
  commission_revenue: number;
}