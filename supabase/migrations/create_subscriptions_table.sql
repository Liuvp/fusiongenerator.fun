-- ======================================================================
-- Fusion Generator - Subscriptions Table
-- 用于存储Creem订阅信息，支持VIP功能
-- ======================================================================

-- 1. 创建subscriptions表
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'inactive',
  creem_subscription_id TEXT UNIQUE,
  creem_product_id TEXT,
  creem_customer_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)  -- 每个用户只能有一个订阅
);

-- 2. 创建索引（提升查询性能）
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id 
  ON public.subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status 
  ON public.subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_subscriptions_creem_subscription_id 
  ON public.subscriptions(creem_subscription_id);

-- 3. 启用行级安全（RLS）
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. 创建RLS策略
-- 用户可以查看自己的订阅
CREATE POLICY "Users can view own subscription" 
  ON public.subscriptions
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Service Role可以管理所有订阅（用于webhook）
CREATE POLICY "Service role can manage subscriptions" 
  ON public.subscriptions
  FOR ALL 
  USING (auth.jwt()->>'role' = 'service_role');

-- 5. 添加注释
COMMENT ON TABLE public.subscriptions IS 'Creem订阅信息表';
COMMENT ON COLUMN public.subscriptions.user_id IS '用户ID（关联auth.users）';
COMMENT ON COLUMN public.subscriptions.status IS '订阅状态：active/inactive/cancelled';
COMMENT ON COLUMN public.subscriptions.creem_subscription_id IS 'Creem订阅ID';
COMMENT ON COLUMN public.subscriptions.current_period_end IS '当前订阅周期结束时间';
