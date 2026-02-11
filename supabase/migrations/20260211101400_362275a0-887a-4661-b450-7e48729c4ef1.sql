
-- Create exam status enum
CREATE TYPE public.exam_status AS ENUM ('Passed', 'Sitting', 'Future');

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  image_url TEXT,
  case_study TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Exams table
CREATE TABLE public.exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  status exam_status NOT NULL DEFAULT 'Future',
  date TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site assets table
CREATE TABLE public.site_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_assets ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Anyone can read exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Anyone can read site_assets" ON public.site_assets FOR SELECT USING (true);

-- Admin write policies (authenticated users only for now)
CREATE POLICY "Auth users can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update projects" ON public.projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete projects" ON public.projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can insert exams" ON public.exams FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update exams" ON public.exams FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete exams" ON public.exams FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can insert site_assets" ON public.site_assets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update site_assets" ON public.site_assets FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete site_assets" ON public.site_assets FOR DELETE TO authenticated USING (true);

-- Seed exam data
INSERT INTO public.exams (name, full_name, status, date, display_order) VALUES
  ('Exam FM', 'Financial Mathematics', 'Passed', 'Oct. 2024', 1),
  ('Exam P', 'Probability', 'Passed', 'Mar. 2025', 2),
  ('Exam SRM', 'Statistics for Risk Modeling', 'Sitting', 'May. 2026', 3);

-- Seed projects
INSERT INTO public.projects (title, slug, description, tech_stack, github_url, display_order) VALUES
  ('Claims Triage & Reserving Engine', 'claims-engine', 'Event-driven FNOL pipeline eliminating manual data entry latency. Integrates LLMs for actuarial severity scoring and automated case reserve calculations.', ARRAY['n8n', 'OpenAI API', 'PostgreSQL', 'Docker', 'R Shiny'], 'https://github.com/ewetseklc', 1),
  ('Actuarial Experience Study — Lapse MVP', 'lapse-mvp', 'Conducted actuarial experience study with credibility-blended lapse rates. Published reproducible codebase supporting future audits.', ARRAY['Python', 'pandas', 'Excel'], 'https://github.com/ewetseklc', 2),
  ('Forest Cover Prediction Model', 'forest-cover', 'ML classifiers on 580K+ environmental records achieving 92% accuracy with 5-fold cross-validation.', ARRAY['PySpark', 'MLlib', 'Python'], 'https://github.com/ewetseklc', 3);

-- Seed site assets
INSERT INTO public.site_assets (key, value) VALUES
  ('resume_pdf_url', '/Ewetse_Resume_2026.pdf'),
  ('hero_text', 'The Modern Actuary'),
  ('hero_subtitle', 'Bridging Actuarial Science & AI Automation');
