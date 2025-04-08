
import { createClient } from '@supabase/supabase-js';

// Use the Supabase URL and key from the integration
const supabaseUrl = "https://tcikxgcyrvildjvxffhh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjaWt4Z2N5cnZpbGRqdnhmZmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzg4NTUsImV4cCI6MjA1OTcxNDg1NX0.YuSbXEx-ePtXD3kZvVRI3uhySerHWcjrBIL2e6uJRF8";

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
