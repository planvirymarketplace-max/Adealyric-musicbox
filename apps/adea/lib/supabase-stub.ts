// Stub for supabase client - returns empty data for all operations
export const supabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({ order: () => ({ limit: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }), gte: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], count: 0 }) }) }) }),
      order: () => ({ limit: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      single: () => Promise.resolve({ data: null, error: null }),
    }),
    select: (cols: string, opts?: any) => {
      const base = {
        eq: () => base,
        neq: () => base,
        gt: () => base,
        gte: () => base,
        lt: () => base,
        lte: () => base,
        ilike: () => base,
        in: () => base,
        order: () => base,
        limit: () => ({ single: () => Promise.resolve({ data: null, error: null }), then: (cb: any) => cb({ data: null, error: null }) }),
        single: () => Promise.resolve({ data: null, error: null }),
        range: () => base,
        then: (cb: any) => cb({ data: [], count: 0 }),
      };
      if (opts?.head) {
        return Promise.resolve({ data: null, count: 0, error: null });
      }
      return base;
    },
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }), then: (cb: any) => cb({ data: null, error: null }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }), then: (cb: any) => cb({ data: null, error: null }) }) }),
    delete: () => ({ eq: () => ({ then: (cb: any) => cb({ data: null, error: null }) }) }),
  }),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Invalid credentials' } }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      remove: () => Promise.resolve({ data: null, error: null }),
    }),
  },
};
