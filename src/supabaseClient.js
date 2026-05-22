import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

function createEmptyQuery(result = { data: [], error: null }) {
  const query = {
    select: () => query,
    order: () => query,
    limit: () => query,
    eq: () => query,
    neq: () => query,
    insert: () => query,
    update: () => query,
    delete: () => query,
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
  };

  return query;
}

function createMissingConfigClient() {
  const configError = {
    message: 'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_KEY.',
  };

  return {
    from: () => createEmptyQuery(),
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
      signInWithPassword: async () => ({ data: null, error: configError }),
      signOut: async () => ({ error: null }),
    },
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: configError }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : createMissingConfigClient();
