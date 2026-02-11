-- ============================================
-- 免费额度修正 SQL 脚本
-- 执行说明：复制此脚本到 Supabase Dashboard > SQL Editor 执行
-- ============================================

-- 1. 更新现有用户的 credits 从 3 改为 1
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
AND created_at > '2024-12-30'  -- 只影响最近创建的用户
AND (
  metadata->>'source' = 'chinese_name_generator' 
  OR metadata->>'initial_credits' = '3'
  OR metadata IS NULL
);

-- 2. 记录 credits 变更历史
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
  -2, -- 减少 2 个 credits (3 -> 1)
  'subtract',
  'Corrected credits from 3 to 1 to match free tier policy (1 free generation)',
  NOW(),
  jsonb_build_object(
    'source', 'free_tier_policy_correction',
    'from_credits', 3,
    'to_credits', 1,
    'correction_date', NOW(),
    'reason', 'Unified free tier: 1 generation for both anonymous and registered users'
  )
FROM public.customers c
WHERE c.credits = 1
AND c.metadata->>'reason' = 'match_free_tier_policy'
AND c.updated_at > NOW() - INTERVAL '5 minutes';  -- 只记录刚刚更新的

-- 3. 显示执行结果摘要
DO $$
DECLARE
    total_affected integer;
    total_customers integer;
    customers_with_1_credit integer;
    customers_with_more integer;
    vip_customers integer;
BEGIN
    SELECT COUNT(*) INTO total_affected 
    FROM public.customers 
    WHERE metadata->>'reason' = 'match_free_tier_policy';
    
    SELECT COUNT(*) INTO total_customers 
    FROM public.customers;
    
    SELECT COUNT(*) INTO customers_with_1_credit 
    FROM public.customers 
    WHERE credits = 1;
    
    SELECT COUNT(*) INTO customers_with_more 
    FROM public.customers 
    WHERE credits > 1;
    
    SELECT COUNT(*) INTO vip_customers
    FROM public.subscriptions
    WHERE status IN ('active', 'trialing');
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE '  免费额度修正完成';
    RAISE NOTICE '============================================';
    RAISE NOTICE '受影响用户数量: %', total_affected;
    RAISE NOTICE '数据库总用户数: %', total_customers;
    RAISE NOTICE '拥有 1 credit 的用户: % (免费用户)', customers_with_1_credit;
    RAISE NOTICE '拥有更多 credits 的用户: % (充值/VIP)', customers_with_more;
    RAISE NOTICE 'VIP 订阅用户: %', vip_customers;
    RAISE NOTICE '============================================';
    RAISE NOTICE '新策略: 匿名用户和新注册用户均为 1 次免费额度';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
END $$;

-- 4. 查询验证（可选）
-- 取消下面的注释来查看更新后的用户数据
/*
SELECT 
    user_id,
    email,
    credits,
    created_at,
    metadata->>'reason' as correction_reason,
    metadata->>'previous_credits' as previous_credits
FROM public.customers
WHERE metadata->>'reason' = 'match_free_tier_policy'
ORDER BY updated_at DESC
LIMIT 10;
*/
