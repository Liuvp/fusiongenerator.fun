-- ============================================
-- 更宽松的免费额度修正 SQL（修复版）
-- ============================================

-- 1. 先查看当前有多少用户符合条件
SELECT 
    COUNT(*) as total_users_with_3_credits,
    MIN(created_at) as earliest_user,
    MAX(created_at) as latest_user
FROM public.customers
WHERE credits = 3;

-- 2. 查看这些用户的详细信息
SELECT 
    user_id,
    email,
    credits,
    created_at,
    metadata
FROM public.customers
WHERE credits = 3
ORDER BY created_at DESC
LIMIT 5;

-- 3. 更新所有 credits = 3 的免费用户（移除时间限制）
UPDATE public.customers
SET
  credits = 1,
  updated_at = NOW(),
  metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
    'credits_corrected_to_1', NOW(), 
    'reason', 'match_free_tier_policy',
    'previous_credits', 3
  )
WHERE credits = 3
AND NOT EXISTS (
    -- 排除 VIP 用户
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = customers.user_id
    AND s.status IN ('active', 'trialing')
);

-- 4. 记录变更历史
INSERT INTO public.credits_history (
  customer_id,
  amount,
  type,
  description,
  created_at,
  metadata
)
SELECT 
  c.id,
  -2,
  'subtract',
  'Corrected credits from 3 to 1 to match free tier policy',
  NOW(),
  jsonb_build_object(
    'source', 'free_tier_policy_correction',
    'from_credits', 3,
    'to_credits', 1,
    'correction_date', NOW()
  )
FROM public.customers c
WHERE c.metadata->>'reason' = 'match_free_tier_policy'
AND c.updated_at > NOW() - INTERVAL '1 minute';

-- 5. 验证结果
SELECT 
    credits,
    COUNT(*) as user_count
FROM public.customers
GROUP BY credits
ORDER BY credits;
