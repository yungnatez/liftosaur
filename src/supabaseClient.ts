import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yuugtrpcilmfubljeztf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1dWd0cnBjaWxtZnVibGplenRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzE4NzEsImV4cCI6MjA4MDk0Nzg3MX0.NyHLVmNpIi_Lt571Cllgzlwjcm77Qm4hrG7RR5oparg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
