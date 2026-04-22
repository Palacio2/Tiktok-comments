import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { LanguageProvider } from '@/hooks/useLanguage';
import { LoaderProvider } from '@/hooks/useLoader';
import { ProProvider } from '@/hooks/usePro';
import './styles/index.css';

// Підключення i18next
import './locales/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ProProvider>
          <LoaderProvider>
            <App />
          </LoaderProvider>
        </ProProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </StrictMode>
);