-- Fusion feedback: emoji reactions on generated images
-- Rating: 1=😍 2=😐 3=😢

CREATE TABLE IF NOT EXISTS fusion_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fusion_type TEXT NOT NULL,
  char1_id TEXT NOT NULL,
  char2_id TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating IN (1, 2, 3)),
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_fusion_feedback_type_rating ON fusion_feedback(fusion_type, rating);
CREATE INDEX IF NOT EXISTS idx_fusion_feedback_created ON fusion_feedback(created_at DESC);

-- Unique dedup: logged-in user per character pair
CREATE UNIQUE INDEX IF NOT EXISTS idx_fusion_feedback_user_dedup
  ON fusion_feedback(user_id, fusion_type, char1_id, char2_id)
  WHERE user_id IS NOT NULL;

-- Unique dedup: anonymous IP per character pair
CREATE UNIQUE INDEX IF NOT EXISTS idx_fusion_feedback_ip_dedup
  ON fusion_feedback(ip_hash, fusion_type, char1_id, char2_id)
  WHERE ip_hash IS NOT NULL AND user_id IS NULL;

-- RLS: allow insert from service role only
ALTER TABLE fusion_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role insert" ON fusion_feedback
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Allow service role select" ON fusion_feedback
  FOR SELECT TO service_role USING (true);
