
import { createClient } from '@supabase/supabase-js';

// Ensure we have default values for development if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Definições de tipos para nossas tabelas
export type Account = {
  id: string;
  user_id: string;
  name: string;
  balance: number;
  type: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  type: 'income' | 'expense';
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category_id: string;
  account_id: string;
  status: 'completed' | 'pending';
  created_at: string;
};

export type Bill = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid';
  recurrent: boolean;
  frequency?: 'monthly' | 'weekly' | 'yearly';
  created_at: string;
};
