-- Create custom_vulnerabilities table
CREATE TABLE IF NOT EXISTS public.custom_vulnerabilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  cve_code VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  is_active BOOLEAN DEFAULT true
);

-- Add index for faster lookups by project_id
CREATE INDEX IF NOT EXISTS idx_custom_vulnerabilities_project_id ON public.custom_vulnerabilities(project_id);

-- Add comment to table
COMMENT ON TABLE public.custom_vulnerabilities IS 'Stores user-defined custom vulnerabilities for security scanning';
