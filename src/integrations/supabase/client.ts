// Este arquivo configura o cliente Supabase
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Usar variáveis de ambiente para as credenciais do Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Importar o cliente Supabase assim:
// import { supabase } from "@/integrations/supabase/client";

// Verificar se as variáveis de ambiente estão definidas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Erro: Variáveis de ambiente do Supabase não estão definidas.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);