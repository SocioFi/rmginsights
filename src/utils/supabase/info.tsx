// Supabase Configuration
// Reads from environment variables for local development
// Falls back to hardcoded values if env vars are not set

export const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID || "yxhvknioxipeqgleuhjc";
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4aHZrbmlveGlwZXFnbGV1aGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzg4MDIsImV4cCI6MjA3NzY1NDgwMn0.29uI6RDM0-pL0mfV7RwdQb7p1--3qqyMWoSoI0plFKk";