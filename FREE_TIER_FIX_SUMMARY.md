# 免费额度统一修复 - 快速参考

## 🎯 问题
Dragon Ball 页面显示的免费额度是 **3 次**，但应该是 **1 次**。

## 🔍 根本原因

### 数据不一致：

| 位置 | 原始值 | 应该是 |
|------|-------|-------|
| **匿名用户（未登录）** | 1 次 ✅ | 1 次 |
| **新注册用户** | 3 次 ❌ | 1 次 |

**问题源头：**
1. 数据库 migration `20241230000003_fix_credits_to_3.sql` 设置为 3
2. `/api/credits` API 给新用户 3 个 credits
3. `/api/generate-fusion` API 写的是 1，但被上面两个覆盖了

---

## ✅ 修复内容

### 1️⃣ 修改 API - 统一为 1 credit

#### `/api/credits/route.ts`
```typescript
// 第 49 行 - 修改前
credits: 3, // 新用户赠送3积分

// 修改后
credits: 1, // 新用户赠送1积分（与免费额度策略一致）
```

```typescript
// 第 82 行 - 修改前
amount: 3,

// 修改后
amount: 1,
```

#### `/api/generate-fusion/route.ts`
```typescript
// 第 128 行 - 添加注释确认
.insert([{ user_id: user.id, credits: 1 }])  // ✅ 统一为 1 次免费额度
```

---

### 2️⃣ 创建数据库 Migration

**文件：** `supabase/migrations/20260211000000_fix_credits_to_1.sql`

**作用：**
- 将现有用户的 credits 从 3 修正为 1
- 添加 credits_history 记录变更
- 只影响免费用户（不影响 VIP 或充值用户）

---

## 📊 修复后的统一策略

| 用户类型 | 免费额度 | 说明 |
|---------|---------|------|
| **未登录用户** | 1 次 | IP 限流，用完后要求登录 |
| **新注册用户** | 1 次 | 登录后获得 1 个 credit |
| **VIP 用户** | 无限 | 每日 10 次限制 |

---

## 🚀 部署步骤

### 1. 代码部署
```bash
git add .
git commit -m "fix: 统一免费额度为 1 次

- 修改 /api/credits 新用户默认 credits 从 3 改为 1
- 修改 /api/generate-fusion 注释确认为 1
- 创建 migration 修正现有用户数据
- 统一匿名和注册用户的免费额度策略"

git push origin main
```

### 2. 数据库 Migration
需要在 Supabase Dashboard 中运行：
```sql
-- 运行 supabase/migrations/20260211000000_fix_credits_to_1.sql
```

或使用 Supabase CLI：
```bash
supabase db push
```

---

## ✅ 验证清单

### 前端验证
- [ ] 未登录访问 `/pokemon` → 显示 "1 Left"
- [ ] 未登录访问 `/dragon-ball` → 显示 "1 Left"  
- [ ] 新注册用户登录后 → 显示 "1 Left"
- [ ] VIP 用户 → 显示 "∞"

### 后端验证
```bash
# 检查新创建的用户 credits
SELECT user_id, credits, created_at, metadata 
FROM customers 
WHERE created_at > NOW() - INTERVAL '1 day'
ORDER BY created_at DESC
LIMIT 10;

# 应该全部显示 credits = 1
```

### API 测试
1. **匿名用户测试：**
   - 访问 `/pokemon`，融合 1 次 → 成功
   - 再次尝试 → Toast 提示 "Free Quota Used"，跳转登录

2. **新用户测试：**
   - 注册新账号
   - 访问 `/pokemon` → 显示 "1 Left"
   - 融合 1 次 → 成功，显示 "0 Left"
   - 再次尝试 → Toast 提示 "Quota Exceeded"，跳转 Pricing

---

## 📝 修改的文件

| 文件 | 修改内容 |
|------|----------|
| `app/api/credits/route.ts` | credits: 3 → 1 |
| `app/api/generate-fusion/route.ts` | 添加注释确认 |
| `supabase/migrations/20260211000000_fix_credits_to_1.sql` | 新建：修正现有数据 |

---

## ⚠️ 注意事项

### 不影响的用户
- ✅ VIP 用户（仍然是无限/每日限制）
- ✅ 已充值用户（credits > 3 的用户不受影响）

### 受影响的用户
- ⚠️ 免费用户的 credits 会从 3 减少到 1
- 💡 建议：在公告中说明「统一免费额度政策」

---

## 🎯 预期效果

### 修复前
- 未登录：1 次 ✅
- 新注册：3 次 ❌ **不一致！**

### 修复后
- 未登录：1 次 ✅
- 新注册：1 次 ✅ **统一！**

**用户体验：**
- 更清晰：免费 = 1 次，无论是否登录
- 更公平：所有免费用户待遇一致
- 更简单：减少用户困惑

---

**修复完成时间：** 2026-02-11  
**状态：** ✅ 代码已修复，等待部署和 migration 执行
