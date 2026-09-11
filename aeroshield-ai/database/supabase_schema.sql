-- AeroShield AI Supabase SQL Schema
-- Copy and paste this into Supabase SQL Editor (https://supabase.com/dashboard/project/mpbeozinrofbpgyhjpub/sql)

-- 1. Create passengers table
CREATE TABLE IF NOT EXISTS public.passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  passport_number TEXT NOT NULL,
  nationality TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  risk_profile TEXT DEFAULT 'LOW',
  watchlist_status BOOLEAN DEFAULT FALSE,
  photo_url TEXT,
  flight TEXT DEFAULT 'AX 204',
  terminal TEXT DEFAULT 'T2',
  gate TEXT DEFAULT 'G18',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create red_flags table
CREATE TABLE IF NOT EXISTS public.red_flags (
  id TEXT PRIMARY KEY,
  verification_id TEXT NOT NULL,
  passenger_id TEXT NOT NULL,
  passenger_name TEXT NOT NULL,
  passport_number TEXT NOT NULL,
  flag_type TEXT NOT NULL,
  severity TEXT DEFAULT 'HIGH',
  description TEXT,
  terminal TEXT DEFAULT 'T2',
  checkpoint TEXT DEFAULT 'IMMIGRATION GATE 04',
  officer_id TEXT DEFAULT 'IMM001',
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create verifications table
CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id TEXT UNIQUE NOT NULL,
  passenger_id TEXT NOT NULL,
  officer_id TEXT DEFAULT 'IMM001',
  overall_score INT DEFAULT 95,
  status TEXT DEFAULT 'VERIFIED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) and allow public read/insert for hackathon demo
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.red_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select passengers" ON public.passengers FOR SELECT USING (true);
CREATE POLICY "Allow public insert passengers" ON public.passengers FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select red_flags" ON public.red_flags FOR SELECT USING (true);
CREATE POLICY "Allow public insert red_flags" ON public.red_flags FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select verifications" ON public.verifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert verifications" ON public.verifications FOR INSERT WITH CHECK (true);

-- Insert Sample Passengers
INSERT INTO public.passengers (passenger_id, full_name, passport_number, nationality, date_of_birth, gender, risk_profile, watchlist_status, flight, terminal, gate)
VALUES
  ('AV-IND-000123', 'RAJESH KUMAR SHARMA', 'N4820194', 'IND', '1990-03-15', 'M', 'LOW', false, 'AX 204', 'T2', 'G18'),
  ('AV-GBR-000458', 'JAMES ALEXANDER MORRISON', 'GB982311', 'GBR', '1985-07-22', 'M', 'MEDIUM', false, 'BA 112', 'T2', 'G04'),
  ('AV-USA-000891', 'MICHAEL DAVID CHEN', 'P9021844', 'USA', '1992-11-08', 'M', 'HIGH', true, 'UA 505', 'T2', 'G22'),
  ('AV-CHN-001204', 'LI XIAO MING', 'C4409121', 'CHN', '1988-05-30', 'M', 'MEDIUM', false, 'CA 836', 'T2', 'G31'),
  ('AV-DEU-554102', 'MARCUS WEBER', 'D1029411', 'DEU', '1990-02-15', 'M', 'LOW', false, 'LH 400', 'T2', 'G12')
ON CONFLICT (passenger_id) DO NOTHING;

-- Insert Initial Sample Red Flag
INSERT INTO public.red_flags (id, verification_id, passenger_id, passenger_name, passport_number, flag_type, severity, description, status)
VALUES
  ('RF-DEMO-001', 'VER-2026-T2-0089', 'AV-USA-000891', 'MICHAEL DAVID CHEN', 'P9021844', 'BIOMETRIC_MISMATCH', 'CRITICAL', 'Face similarity score (51.2%) significantly below security threshold.', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;
