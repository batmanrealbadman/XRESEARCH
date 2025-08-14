import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://wrmzehgbqjpiiaazmmgh.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndybXplaGdicWpwaWlhYXptbWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4Mjg4MjEsImV4cCI6MjA3MDQwNDgyMX0.9p5NdmJoUvRjPmApqZo1C7QZdfO1X9QCD72gD6fpr98
';

export const supabase = createClient(supabaseUrl, supabaseKey);