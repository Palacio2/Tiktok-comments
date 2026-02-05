import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance;

try {
  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    throw new Error('Invalid supabaseUrl');
  }
  supabaseInstance = createClient(supabaseUrl, supabaseKey)
} catch (error) {
  console.warn('Supabase client failed to initialize:', error.message);
  // Mock supabase object to prevent crashes
  supabaseInstance = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          maybeSingle: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        }),
      }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    rpc: (name, params) => {
      console.warn(`Supabase RPC called: ${name}`, params);
      return Promise.resolve({ data: null, error: new Error('Supabase not configured') });
    },
    functions: {
      invoke: (name, options) => {
        console.warn(`Supabase function invoked: ${name}`, options);
        return Promise.resolve({
          data: { result: "AI Magic is disabled (Supabase connection missing)" },
          error: null
        });
      }
    }
  };
}

export const supabase = supabaseInstance
