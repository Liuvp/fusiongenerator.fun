-- User generations: fusion history + favorites
-- Stores every generated fusion for logged-in users, with optional favorite flag

CREATE TABLE IF NOT EXISTS user_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fusion_type TEXT NOT NULL DEFAULT 'dragon_ball',
  char1_id TEXT NOT NULL,
  char1_name TEXT NOT NULL,
  char2_id TEXT NOT NULL,
  char2_name TEXT NOT NULL,
  style_id TEXT,
  style_name TEXT,
  image_url TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_generations_user_id ON user_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_generations_created ON user_generations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_generations_favorite ON user_generations(user_id, is_favorite) WHERE is_favorite = TRUE;

-- RLS
ALTER TABLE user_generations ENABLE ROW LEVEL SECURITY;

-- Users can read their own generations
CREATE POLICY "Users can view own generations"
  ON user_generations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert (API writes)
CREATE POLICY "Service role can insert generations"
  ON user_generations
  FOR INSERT TO service_role WITH CHECK (true);

-- Service role can update (for favorite toggle)
CREATE POLICY "Service role can update generations"
  ON user_generations
  FOR UPDATE TO service_role USING (true);

-- Service role can delete
CREATE POLICY "Service role can delete generations"
  ON user_generations
  FOR DELETE TO service_role USING (true);

-- Comment
COMMENT ON TABLE user_generations IS 'Fusion generation history for logged-in users';
COMMENT ON COLUMN user_generations.is_favorite IS 'User-bookmarked fusion';
