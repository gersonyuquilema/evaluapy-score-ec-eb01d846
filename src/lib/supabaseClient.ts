import { createClient } from "@supabase/supabase-js";

// Usa la clave pública (anon key) para frontend. 
// Si solo tienes la Service Role, crea una anon key en el panel de Supabase (Settings > API > Project API keys).

const supabaseUrl = "https://ywlyxdgcgwdwkyaelvtx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3bHl4ZGdjZ3dkd2t5YWVsdnR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3ODc3MDEsImV4cCI6MjA3MDM2MzcwMX0.TmlponZZRnQadeig_YojNzri81TwdO2AKong2hgc9BY"; // Reemplaza por tu anon key pública

export const supabase = createClient(supabaseUrl, supabaseAnonKey);