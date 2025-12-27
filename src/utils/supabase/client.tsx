import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Use full URL from env if provided, otherwise construct from project ID
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);
