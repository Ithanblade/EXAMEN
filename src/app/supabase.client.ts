import {createClient} from '@supabase/supabase-js'

const supabaseUrl='https://flirdfwwgaaohzbxnpju.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaXJkZnd3Z2Fhb2h6YnhucGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDcyOTYsImV4cCI6MjA2NDIyMzI5Nn0.kZj7S6-l7No1gTE5Hb5ETGSj-cdNDZC1N8JJubYsuDg';

export const supabase = createClient(supabaseUrl, supabaseKey);