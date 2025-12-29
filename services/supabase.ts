
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.48.1';

const supabaseUrl = 'https://gezpcrnaaeadlcdlmzsx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlenBjcm5hYWVhZGxjZGxtenN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMTU1MTMsImV4cCI6MjA4MjU5MTUxM30.7Jcixs4qMX_PgBBufE0M3ie6IiDH5KDvMvW36nAHNjI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
