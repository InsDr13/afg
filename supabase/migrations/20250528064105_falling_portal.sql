/*
  # Update schema for portfolio content

  1. Changes
    - Add new fields to personal_info table
    - Update existing data structure
    - Add more detailed content fields

  2. Security
    - Maintain existing RLS policies
*/

-- Update personal_info table with new fields
ALTER TABLE personal_info
ADD COLUMN IF NOT EXISTS subtitle text,
ADD COLUMN IF NOT EXISTS roles text[],
ADD COLUMN IF NOT EXISTS about_me text,
ADD COLUMN IF NOT EXISTS who_am_i text;

-- Update content_sections table for dynamic content
CREATE TABLE IF NOT EXISTS content_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  title text,
  subtitle text,
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on content_sections
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for content_sections
CREATE POLICY "Public read access" ON content_sections
  FOR SELECT TO public USING (true);

CREATE POLICY "Admin write access" ON content_sections
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert initial content
INSERT INTO content_sections (section_key, title, subtitle, content) VALUES
  ('hero_section', 'Full Stack Developer', 'Creating beautiful and functional web experiences', 'I specialize in building modern web applications with cutting-edge technologies'),
  ('about_section', 'About Me', 'My Journey', 'Passionate developer with a keen eye for detail and a commitment to creating exceptional user experiences'),
  ('skills_section', 'My Skills', 'What I can do', 'A comprehensive set of technical and soft skills developed over years of experience'),
  ('projects_section', 'My Projects', 'Recent Work', 'A showcase of my latest projects and achievements'),
  ('contact_section', 'Get in Touch', 'Let''s Connect', 'Interested in working together? Let''s talk about your project')
ON CONFLICT (section_key) DO NOTHING;

-- Update personal info with new content
UPDATE personal_info SET
  subtitle = 'Passionate Full Stack Developer',
  roles = ARRAY['Web Developer', 'UI/UX Designer', 'Tech Enthusiast'],
  about_me = 'With over 5 years of experience in web development, I specialize in creating modern, responsive, and user-friendly applications. My expertise spans both frontend and backend technologies, allowing me to deliver complete solutions.',
  who_am_i = 'I am a dedicated developer who believes in writing clean, maintainable code and creating intuitive user experiences. When I''m not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.'
WHERE id = (SELECT id FROM personal_info LIMIT 1);

-- Add short_description to projects
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS short_description text;