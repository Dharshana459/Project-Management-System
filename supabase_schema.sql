-- Supabase Database Schema Setup

-- 1. Create a table for Projects if it doesn't already exist
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Planning',
  progress INTEGER DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) so users only see their own projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy for projects (Allows select/insert/update/delete for the logged-in user)
DROP POLICY IF EXISTS "Users can manage their own projects" ON projects;
CREATE POLICY "Users can manage their own projects" 
ON projects FOR ALL 
USING (auth.uid() = user_id);


-- 2. Create a table for the Kanban drag-and-drop board state mapped to those projects
CREATE TABLE IF NOT EXISTS board_states (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  state_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for board states
ALTER TABLE board_states ENABLE ROW LEVEL SECURITY;

-- Create policy for board states
DROP POLICY IF EXISTS "Users can manage their own board states" ON board_states;
CREATE POLICY "Users can manage their own board states" 
ON board_states FOR ALL 
USING (auth.uid() = user_id);

-- Note: 
-- 1. Copy all this code.
-- 2. Go to your Supabase Dashboard -> SQL Editor -> + New Query.
-- 3. Paste and click the green RUN button. 
-- It will automatically create the `projects` and `board_states` tables in your Supabase database.
