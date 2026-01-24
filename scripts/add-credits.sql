-- 🪙 用户积分充值脚本
-- 用于测试和开发环境为用户添加积分

-- =====================================
-- 使用说明：
-- 1. 在 Supabase SQL Editor 中运行此脚本
-- 2. 将 'YOUR_EMAIL_HERE' 替换为测试用户的邮箱
-- 3. 调整 credits_to_add 为需要添加的积分数量
-- =====================================

DO $$
DECLARE
    target_email TEXT := 'YOUR_EMAIL_HERE'; -- 🔥 替换为您的邮箱
    credits_to_add INTEGER := 10; -- 🔥 要添加的积分数量
    target_user_id UUID;
    current_credits INTEGER;
    new_credits INTEGER;
BEGIN
    -- 1. 查找用户 ID
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = target_email;

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION '❌ 用户不存在: %', target_email;
    END IF;

    RAISE NOTICE '✅ 找到用户: % (ID: %)', target_email, target_user_id;

    -- 2. 检查是否已有 customer 记录
    SELECT credits INTO current_credits
    FROM customers
    WHERE user_id = target_user_id;

    IF current_credits IS NULL THEN
        -- 2a. 如果没有记录，创建新记录
        INSERT INTO customers (user_id, credits)
        VALUES (target_user_id, credits_to_add);
        
        new_credits := credits_to_add;
        RAISE NOTICE '✅ 创建新客户记录，初始积分: %', credits_to_add;
    ELSE
        -- 2b. 如果有记录，增加积分
        UPDATE customers
        SET credits = credits + credits_to_add
        WHERE user_id = target_user_id;
        
        new_credits := current_credits + credits_to_add;
        RAISE NOTICE '✅ 积分充值: % → % (+%)', current_credits, new_credits, credits_to_add;
    END IF;

    -- 3. 显示最终结果
    RAISE NOTICE '================================================';
    RAISE NOTICE '💰 充值成功！';
    RAISE NOTICE '用户邮箱: %', target_email;
    RAISE NOTICE '当前积分: %', new_credits;
    RAISE NOTICE '================================================';
END $$;


-- =====================================
-- 快速查询：验证积分
-- =====================================

-- 查看指定用户的积分
SELECT 
    u.email,
    c.credits,
    c.created_at,
    c.updated_at
FROM auth.users u
LEFT JOIN customers c ON c.user_id = u.id
WHERE u.email = 'YOUR_EMAIL_HERE'; -- 🔥 替换为您的邮箱


-- =====================================
-- 快速重置：将积分设为指定值
-- =====================================

-- 示例：将积分重置为 100
/*
UPDATE customers
SET credits = 100
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE'
);
*/


-- =====================================
-- 查看所有用户的积分情况
-- =====================================

SELECT 
    u.email,
    COALESCE(c.credits, 0) as credits,
    CASE 
        WHEN s.status IN ('active', 'trialing') THEN '💎 VIP'
        ELSE '👤 Free'
    END as user_type
FROM auth.users u
LEFT JOIN customers c ON c.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id
ORDER BY c.credits DESC NULLS LAST;
