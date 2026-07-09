# Project Memory — fusiongenerator.fun

## 产品战略方向
- **当前聚焦单一工作室 `/dragon-ball`**。漏斗数据显示 76% 使用量集中于此，pokemon/ai 流量≈0。
- `/pokemon`、`/ai` 为**软隐藏**状态（2026-07-08 起）：路由与页面内容完整保留、可直接访问，但前台（导航/页脚/首页/仪表盘/pricing/auth/画廊/blog/站点地图）**不显示任何入口链接**。无重定向、不删除代码。
- 后续功能/付费/配额改动默认以 `/dragon-ball` 为准；pokemon/ai 暂不投入。

## 转化漏斗优化（P0+P1 已完成，2026-07-07~08）
- 邮箱注册断点已修（注册后跳 /sign-in 而非 /dashboard）；主推 Google 注册。
- 免费额度统一口径：匿名 2 次/IP = 注册 2 credits = 文案 "2 free fusions to start"（全站赠分已统一为 2）。
- VIP 命名全站统一为 "Pro"；用户可见文案无 "VIP" 残留（变量名 isVIP 保留）。
- Pro 后端额度 = **300/月**（lib/rate-limit.ts `checkProUserMonthlyQuota`，key `quota:pro:${userId}:${YYYY-MM}`）。注意：**/ai 工作室 Pro 仍是无限制**（fusion/generate/route.ts 跳过 credits 门禁），三工作室 Pro 额度不对称，待定。
- 配额耗尽弹窗三工作室统一：匿名 Skip→Pro；已登录 "Upgrade to Pro - 300 Fusions/month 🚀" + 价值点。

## ⚠️ 已知产品决策 / 易回归风险（改代码勿误伤）
- **【刻意设计】Pro 角色锁全开（2026-07-09 决策）**：免费与付费用户都可选**任意两个角色**生成（含 `pro:true` 的 broly/jiren/whis/vegetto/gogeta/gotenks）。变现点是**生成次数**（免费 2 次 / Pro 300 月），**不是角色锁**。
  - ❌ 不要把"免费用户能生成 Pro 角色"当 bug / 回归去修。
  - `CharacterButton` 的 `isProLocked` 入参当前在 `fusion-studio.tsx` 网格写死 `false`，属预期；勿自行加回 pro 过滤或 403 校验。
- **【刻意保留】metadata 含 "Pokemon"（2026-07-09 决策）**：根 `layout.tsx` 与首页 `page.tsx` 的 title/description 仍写 "Dragon Ball & Pokemon"，**为保 SEO 排名故意不删**。请勿当作问题修改或提出。
- **真实易回归（仍需守住）**：
  - Creem webhook 幂等（subscription 按账期 + refill 5 分钟冷却，见 `webhooks/creem/route.ts`），勿破。
  - PII 日志已清理（generate-fusion/new-user/creem/checkout），勿再加回 email/IP/prompt 打印。
  - 生成失败回退配额（generate-fusion catch 块：登录 CAS 退款 + 匿名 Redis 回退），勿删。

## 关键文件速查
- 配额后端：`lib/rate-limit.ts`、`app/api/generate-fusion/route.ts`、`app/api/fusion/generate/route.ts`、`app/api/get-quota/route.ts`
- 定价/文案：`app/pricing/client-page.tsx`
- 赠分：`app/api/webhooks/new-user/route.ts`、`app/api/credits/route.ts`
- 注册：`app/actions.ts`、导航 `components/header.tsx` (mainNavItems 单一来源，移动端复用)
