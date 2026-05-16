# Changelog — fusiongenerator.fun

---

## 2026-05-16：P2 + IndexNow + Sitemap 日期

基于 GSC/Bing/GA4 实际数据 + P0/P1 验证结果，执行 P2 优化。

### P2-1：索引问题排查

技术 SEO 全部正确（robots.txt、canonical、meta robots、Schema）。索引问题是站点权威度低 + Google 爬取频率低导致。

- Sitemap 在 GSC 重新提交（2026-05-16）
- 4 个核心页面手动请求索引（`/`、`/dragon-ball`、`/pokemon`、`/ai`）
- 诊断报告：`docs/P2-1-index-diagnosis.md`

### P2-2 / P2-3：内容 & Schema（已有）

三个核心页面已有完整 SEO 内容块 + Schema.org 结构化数据，无需修改。

### P2-4：GA4 事件追踪补全

| 文件 | 新增事件 |
|---|---|
| `app/pricing/client-page.tsx` | `checkout_click`, `checkout_redirect`, `checkout_error`, `checkout_redirect_login` |
| `app/dashboard/page.tsx` | `payment_success` |
| `components/dashboard/payment-success-tracker.tsx` | 新建：支付成功事件追踪组件 |

### FAQ 文案修正

`components/dragon-ball/faq.tsx` — "one free trial fusion" → "2 free fusions"

### Sitemap 日期更新

Touch 5 个 page 文件，git 日期从 2026-03 更新为 2026-05-16。

### Bing IndexNow 配置

- IndexNow key：`0c32f305-17b0-4d16-8f50-0fa6d90a0528`
- 验证文件：`public/0c32f305-17b0-4d16-8f50-0fa6d90a0528.txt`
- 提交脚本：`scripts/submit-indexnow.js`（动态读 sitemap.xml）
- `package.json` postbuild 钩子：每次 Vercel 部署自动提交
- 首次提交 12 个 URL → 202 Accepted

### Bing 实际数据

| 指标 | Bing | Google |
|---|---|---|
| 点击 | 173 | 16 |
| 展示 | 3.9K | 229 |
| 查询词 | 70 | 33 |

---

## 2026-05-15 ~ 2026-05-16：P0 + P1 + 反馈系统

基于 Clarity 30 天用户行为数据（91 会话，86 条录制）+ 代码审查。

### P0-1：免费额度 1→2（游客 2 + 注册 2 = 新用户最多 4 次）

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | `DEFAULT_QUOTA` remaining/limit 1→2 |
| `components/pokemon/fusion-studio.tsx` | 默认 remaining 1→2（2 处） |
| `lib/rate-limit.ts` | `getAnonymousRateLimit` limit 1→2 |
| `app/api/get-quota/route.ts` | FALLBACK_QUOTA remaining/limit 1→2 |
| `app/api/generate-fusion/route.ts` | `usage > 1` → `usage > 2` |
| `app/api/fusion/generate/route.ts` | `usage > 1` → `usage > 2` |
| `app/api/webhooks/new-user/route.ts` | `credits: 1` → `credits: 2` |
| Supabase 触发器 `handle_new_user()` | `credits: 1` → `credits: 2`（SQL 直接执行） |

### P0-2：首页 CTA 指向修正

`components/home/hero-section.tsx` — 主 CTA `/ai` → `/dragon-ball`，文案同步

### P0-3：角色选择区域移动端折叠

`components/dragon-ball/fusion-studio.tsx` — 新增 `isGridExpanded`，移动端默认 180px + "Show all" 按钮

### P0 文案同步

全站 "1 free" / "3 free" 统一为 "2 free"（6 个文件 12+ 处）

### P1-1：React.memo CharacterButton

### P1-2：图片懒加载（前 4 张 eager，其余 lazy）

### P1-3：触屏点击区域 44px

### P1-4：ChatGPT 导流引导条（检测 `utm_source=chatgpt.com`）

### 反馈系统：生图满意度 Emoji 反馈

| 文件 | 改动 |
|---|---|
| `supabase/migrations/20260516000000_fusion_feedback.sql` | 建表 + 索引 + RLS + 去重 |
| `app/api/feedback/route.ts` | POST API，游客 IP hash 去重 |
| `components/dragon-ball/fusion-studio.tsx` | 😍😐😢 按钮 UI |

### 触发器修复

Supabase `handle_new_user()` 通过 SQL Editor 直接更新 credits 1→2。Migration 文件：`supabase/migrations/20260516000001_update_trigger_credits_to_2.sql`
