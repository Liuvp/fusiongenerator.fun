-- 🔍 检查订阅状态 SQL 脚本
-- 用于诊断 Creem 订阅是否正确记录

-- =====================================
-- 1. 查看您的订阅状态
-- =====================================

-- 🔥 将 'YOUR_EMAIL_HERE' 替换为您的邮箱
SELECT 
    u.email,
    u.id as user_id,
    u.created_at as user_created_at,
    s.id as subscription_id,
    s.status as subscription_status,
    s.plan_type,
    s.created_at as subscription_created_at,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at,
    s.canceled_at,
    c.credits
FROM auth.users u
LEFT JOIN subscriptions s ON s.user_id = u.id
LEFT JOIN customers c ON c.user_id = u.id
WHERE u.email = 'YOUR_EMAIL_HERE'; -- 🔥 替换为您的邮箱


-- =====================================
-- 2. 查看所有订阅记录（最近10条）
-- =====================================

SELECT 
    u.email,
    s.status,
    s.plan_type,
    s.stripe_subscription_id,
    s.created_at
FROM subscriptions s
JOIN auth.users u ON u.id = s.user_id
ORDER BY s.created_at DESC
LIMIT 10;


-- =====================================
-- 3. 检查 Creem 订阅 ID 格式
-- =====================================

-- Creem 的订阅 ID 通常以 'sub_' 开头
SELECT 
    u.email,
    s.stripe_subscription_id,
    s.status,
    CASE 
        WHEN s.stripe_subscription_id LIKE 'sub_%' THEN '✅ 格式正确（Stripe）'
        WHEN s.stripe_subscription_id IS NULL THEN '❌ 缺少订阅ID'
        ELSE '⚠️  可能是测试订阅'
    END as id_check
FROM subscriptions s
JOIN auth.users u ON u.id = s.user_id
ORDER BY s.created_at DESC
LIMIT 10;


-- =====================================
-- 4. 手动创建/更新订阅记录（如果需要）
-- =====================================

/*
-- 🔥 如果数据库中没有订阅记录，可以手动创建一个测试记录

INSERT INTO subscriptions (
    user_id,
    status,
    plan_type,
    stripe_subscription_id,
    current_period_start,
    current_period_end
)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL_HERE'), -- 您的邮箱
    'active', -- 状态：active, trialing, canceled, incomplete
    'vip', -- 套餐类型
    'sub_test_' || floor(random() * 1000000), -- 测试订阅ID
    NOW(), -- 开始时间
    NOW() + INTERVAL '30 days' -- 结束时间（30天后）
)
ON CONFLICT (user_id) 
DO UPDATE SET
    status = 'active',
    plan_type = 'vip',
    current_period_end = NOW() + INTERVAL '30 days';
*/


-- =====================================
-- 5. 检查订阅状态是否符合 VIP 判断条件
-- =====================================

-- VIP 条件：status IN ('active', 'trialing')
SELECT 
    u.email,
    s.status,
    CASE 
        WHEN s.status IN ('active', 'trialing') THEN '✅ 是 VIP'
        WHEN s.status IS NULL THEN '❌ 无订阅'
        ELSE '⚠️  订阅存在但状态不对'
    END as vip_status
FROM auth.users u
LEFT JOIN subscriptions s ON s.user_id = u.id
WHERE u.email = 'YOUR_EMAIL_HERE'; -- 🔥 替换为您的邮箱


-- =====================================
-- 6. 诊断建议
-- =====================================

/*
如果查询结果显示：

✅ 有订阅记录且 status = 'active' 或 'trialing'
   → VIP 状态应该正常
   → 检查前端是否正确获取了配额

❌ 没有订阅记录
   → Creem Webhook 可能没有触发
   → 需要检查 Webhook 日志或手动创建记录

⚠️  有订阅但 status 不是 'active' 或 'trialing'
   → 可能是订阅被取消或过期
   → 需要更新 status 为 'active'
*/
