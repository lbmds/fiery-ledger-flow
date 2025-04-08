
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Verificação de variáveis de ambiente no início da aplicação
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  console.error(`Erro: Variáveis de ambiente ausentes: ${missingVars.join(', ')}`);
  document.body.innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
      <h1 style="color: #e11d48;">Erro de Configuração</h1>
      <p>Variáveis de ambiente necessárias não foram configuradas:</p>
      <pre style="background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; text-align: left; margin: 1rem auto; max-width: 500px;">
        ${missingVars.join('\n')}
      </pre>
      <p>Por favor, verifique a configuração do projeto.</p>
    </div>
  `;
} else {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
