
-- Fix exams table policies
DROP POLICY "Auth users can insert exams" ON public.exams;
DROP POLICY "Auth users can update exams" ON public.exams;
DROP POLICY "Auth users can delete exams" ON public.exams;

CREATE POLICY "Auth users can insert exams" ON public.exams
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can update exams" ON public.exams
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can delete exams" ON public.exams
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Fix projects table policies
DROP POLICY "Auth users can insert projects" ON public.projects;
DROP POLICY "Auth users can update projects" ON public.projects;
DROP POLICY "Auth users can delete projects" ON public.projects;

CREATE POLICY "Auth users can insert projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can update projects" ON public.projects
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can delete projects" ON public.projects
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Fix site_assets table policies
DROP POLICY "Auth users can insert site_assets" ON public.site_assets;
DROP POLICY "Auth users can update site_assets" ON public.site_assets;
DROP POLICY "Auth users can delete site_assets" ON public.site_assets;

CREATE POLICY "Auth users can insert site_assets" ON public.site_assets
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can update site_assets" ON public.site_assets
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Auth users can delete site_assets" ON public.site_assets
  FOR DELETE USING (auth.uid() IS NOT NULL);
