export interface Animal {
  id?: number;
  category: string;
  direction: string;
  breed: string;
  dairy_head_count?: number;
  avg_milk_yield_per_head?: number;
  meat_head_count?: number;
  avg_meat_yield_per_head?: number;
}

export interface Crop {
  id?: number;
  crop_name: string;
  sowing_area: number;
  gross_harvest: number;
  yield_per_hectare?: number;
  agro_tech?: AgroTech[];
}

export interface AgroTech {
  id?: number;
  type: string;
  name: string;
  application_rate: number;
}

export interface Equipment {
  id?: number;
  brand: string;
  model: string;
  year: number;
}

export const FUNC_URL = 'https://functions.poehali.dev/8d27026d-2391-42d4-ac54-57f1cbe0c8d4';
export const RATING_URL = 'https://functions.poehali.dev/6651f712-61f5-44b8-827f-dd095dffa4f6';
