# 🗄️ 数据库 Migration 执行指南

## ⚠️ 重要提示
代码已经部署到 Vercel，但**数据库还需要手动更新**才能生效。

---

## 📋 执行步骤

### 方式 1：Supabase Dashboard（推荐）✅

1. **打开 Supabase Dashboard**
   - 访问：https://supabase.com/dashboard
   - 登录您的账号

2. **选择项目**
   - 选择 FusionGenerator 项目

3. **打开 SQL Editor**
   - 左侧菜单点击 **SQL Editor**
   - 点击 **New Query**

4. **执行 SQL 脚本**
   - 打开项目根目录的 `EXECUTE_MIGRATION.sql` 文件
   - 复制全部内容
   - 粘贴到 SQL Editor
   - 点击 **Run** 按钮

5. **查看结果**
   - 在 **Messages** 面板查看执行结果
   - 应该看到类似这样的输出：
     ```
     ============================================
       免费额度修正完成
     ============================================
     受影响用户数量: X
     数据库总用户数: Y
     拥有 1 credit 的用户: Z (免费用户)
     ...
     ============================================
     ```

---

### 方式 2：使用提供的 SQL 文件

**SQL 文件位置：**
```
e:\github\fusiongenerator.fun\EXECUTE_MIGRATION.sql
```

**该脚本会：**
1. ✅ 将现有免费用户的 credits 从 3 更新为 1
2. ✅ 记录变更历史到 credits_history 表
3. ✅ 显示执行结果摘要
4. ✅ 只影响免费用户，不影响 VIP 和充值用户

---

## ✅ 验证修复是否生效

### 前端验证（等待 2-3 分钟让 Vercel 部署完成）

1. **清除浏览器缓存** (Ctrl + Shift + Delete)

2. **测试未登录用户：**
   - 无痕模式访问：https://fusiongenerator.fun/pokemon
   - 应该显示：**"1 Left"** ✅
   - 同样检查：https://fusiongenerator.fun/dragon-ball

3. **测试新注册用户：**
   - 注册新账号
   - 登录后访问 Pokemon/Dragon Ball 页面
   - 应该显示：**"1 Left"** ✅

4. **测试 VIP 用户：**
   - VIP 账号登录
   - 应该显示：**"∞"** ✅

---

### 后端验证（在 Supabase Dashboard）

在 SQL Editor 执行：

```sql
-- 检查 credits 分布
SELECT 
    credits,
    COUNT(*) as user_count
FROM public.customers
GROUP BY credits
ORDER BY credits;

-- 应该看到：
-- credits | user_count
-- --------+-----------
--    0    |    X     (已用完的用户)
--    1    |    Y     (免费用户)
--   >1    |    Z     (充值/VIP用户)
```

---

## 🎯 预期结果

| 用户类型 | Credits | 显示 |
|---------|---------|------|
| 未登录用户 | - | "1 Left" |
| 新注册用户 | 1 | "1 Left" |
| 已用完的用户 | 0 | "0 Left" → 提示登录/升级 |
| VIP 用户 | - | "∞" |

---

## ⏰ 执行时机

**建议：** 
- 在 Vercel 部署完成后（约 2-3 分钟）立即执行
- 这样前端和后端的修改同时生效

**查看 Vercel 部署状态：**
https://vercel.com/dashboard

---

## 🆘 如果遇到问题

### 问题 1: SQL 执行报错
- 检查是否有语法错误
- 确认表名和字段名正确
- 查看错误信息的具体提示

### 问题 2: 执行后前端仍显示 3
- 清除浏览器缓存
- 等待 Vercel 部署完成
- 检查 `/api/get-quota` 返回的数据

### 问题 3: 影响了不应该影响的用户
- SQL 脚本有条件过滤，只影响 `credits = 3` 的免费用户
- VIP 用户和充值用户（credits > 3）不受影响
- 可以在 credits_history 表中查看所有变更记录

---

**准备好了吗？现在就去 Supabase Dashboard 执行 SQL 脚本吧！** 🚀
