-- 修复自动创建 customer 的 trigger，将初始 credits 从 3 改为 1
-- Date: 2026-02-11

-- 1. 删除旧的触发器和函数
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. 创建新的函数：给新用户 1 个 credit
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 为新注册用户自动创建customer记录（1 credit）
  INSERT INTO public.customers (
    user_id,
    email,
    credits,
    creem_customer_id,
    created_at,
    updated_at,
    metadata
  ) VALUES (
    NEW.id,
    NEW.email,
    1, -- 新用户赠送1积分（统一免费额度策略）
    'auto_' || NEW.id::text,
    NOW(),
    NOW(),
    jsonb_build_object(
      'source', 'auto_registration',
      'initial_credits', 1,
      'registration_date', NOW(),
      'policy', 'unified_free_tier_1_credit'
    )
  );

  -- 记录初始积分赠送历史
  INSERT INTO public.credits_history (
    customer_id,
    amount,
    type,
    description,
    created_at,
    metadata
  ) VALUES (
    (SELECT id FROM public.customers WHERE user_id = NEW.id),
    1,
    'add',
    'Welcome bonus (1 free generation)',
    NOW(),
    jsonb_build_object(
      'source', 'welcome_bonus',
      'user_registration', true,
      'policy', 'unified_free_tier'
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. 重新创建触发器
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. 验证
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE '  Trigger 更新完成';
    RAISE NOTICE '============================================';
    RAISE NOTICE '新用户注册时将自动获得 1 个 credit';
    RAISE NOTICE '老用户的 credits 保持不变';
    RAISE NOTICE '============================================';
END $$;
