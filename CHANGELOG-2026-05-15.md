# Changelog — 2026-05-15 ~ 2026-05-16

基于 Clarity 30 天用户行为数据（91 会话，86 条录制）+ 代码审查，执行 P0 + P1 + 反馈系统优化。

---

## P0-1：免费额度 1→2（游客 2 + 注册 2 = 新用户最多 4 次）

**问题：** 55.8% 秒退率。用户完成第 1 次融合后立即弹登录墙，直接离开。

**最终方案：** 游客 2 次（IP 维度）+ 注册后 2 积分（用户维度），新用户最多 4 次。老用户登录不重复给。

**改动：**

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | `DEFAULT_QUOTA` remaining/limit 1→2 |
| `components/pokemon/fusion-studio.tsx` | 默认 remaining 1→2（2 处） |
| `lib/rate-limit.ts` | `getAnonymousRateLimit` limit 1→2 |
| `app/api/get-quota/route.ts` | FALLBACK_QUOTA remaining/limit 1→2 |
| `app/api/generate-fusion/route.ts` | `usage > 1` → `usage > 2`，`remainingQuota` 计算同步 |
| `app/api/fusion/generate/route.ts` | `usage > 1` → `usage > 2` |
| `app/api/webhooks/new-user/route.ts` | 注册积分 `credits: 1` → `credits: 2` |

**未改动（确认不需要改）：**
- `lib/rate-limit.ts` — IP 频率限制（每分钟 3 次）和用户每日配额保持不变，与免费额度无关
- `supabase/migrations/` — 历史 migration 文件中的 "1 free generation" 是数据库注释，不影响运行

---

## P0-2：首页 CTA 指向修正

**问题：** 首页主 CTA 指向 `/ai`（泛化页面），但 80% 用户实际去 `/dragon-ball`。绕了路。

**改动：**

| 文件 | 改动 |
|---|---|
| `components/home/hero-section.tsx` | 主 CTA 和图片链接 `/ai` → `/dragon-ball` |
| `components/home/hero-section.tsx` | 占位文字 → "Try: Goku + Vegeta" |
| `components/home/hero-section.tsx` | 按钮文案 → "Try Dragon Ball Fusion Free!" |
| `components/home/hero-section.tsx` | 副文案 → "first 2 fusions" |
| `components/home/hero-section.tsx` | aria-label 更新 |

---

## P0-3：角色选择区域移动端折叠

**问题：** 死点击率 25.27%。40+ 角色在移动端 4 列网格中过密，触控目标小。

**改动：**

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | 新增 `isGridExpanded` 状态 |
| `components/dragon-ball/fusion-studio.tsx` | 角色网格默认高度移动端 180px，桌面端 320px |
| `components/dragon-ball/fusion-studio.tsx` | 新增 "Show all X characters ↓" 按钮，仅移动端显示 |

---

## P0 文案同步：全站数字统一

前后端额度变更后，所有面向用户的文案同步更新。

| 文件 | 改了什么 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | 游客 banner、auth gate、ChatGPT 引导条全部同步 |
| `components/pokemon/fusion-studio.tsx` | 默认 remaining + 文案（4 处） |
| `app/ai/client-page.tsx` | "free generation" 文案（3 处） |
| `app/pricing/client-page.tsx` | "free fusions daily" |
| `app/(auth-pages)/sign-up/client-page.tsx` | "starter credits after signup" |

---

## P1-1：React.memo 包裹 CharacterButton

**问题：** 34 个角色按钮，每次选择/取消触发全部 re-render，INP 320ms。

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | import 加 `memo`，CharacterButton 用 `memo()` 包裹 |

---

## P1-2：图片懒加载优化

**问题：** 34 张角色图全部 eager loading，首屏资源过多。

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | `priority={index < 4}` + `loading="lazy"` |

---

## P1-3：触屏点击区域 44px

**问题：** 移动端角色按钮太小，误触多。

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | `min-h-[44px] min-w-[44px]` |

---

## P1-4：ChatGPT 导流引导条

**问题：** 6 个来自 ChatGPT 的会话中 2 个秒退，用户不知道怎么用。

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | 检测 `utm_source=chatgpt.com`，紫色欢迎引导条 |

---

## 反馈系统：生图满意度 Emoji 反馈

**目的：** 测量用户对生成图片的满意度，判断生图质量是否是转化瓶颈。

| 文件 | 改动 |
|---|---|
| `supabase/migrations/20260516000000_fusion_feedback.sql` | 建表 + 索引 + RLS + 去重约束 |
| `app/api/feedback/route.ts` | POST API，游客 IP hash 去重，登录用户 user_id 去重 |
| `components/dragon-ball/fusion-studio.tsx` | `feedbackSubmitted` 状态 + `submitFeedback` 函数 + 😍😐😢 按钮 UI |

**数据流：** 用户点 emoji → POST /api/feedback → Supabase `fusion_feedback` 表 + GA4 `db_fusion_feedback` 事件

---

## 验证

- [x] TypeScript 编译通过（exit 0）
- [x] 全站 grep 无遗留的 "1 free" 或 "3 free" 文案
- [x] Supabase `fusion_feedback` 表已建好
- [ ] 部署后测试：匿名用户能融合 2 次才弹登录墙
- [ ] 部署后测试：注册后获得 2 积分
- [ ] 部署后测试：反馈按钮功能正常
- [ ] Clarity 监控：1 周后对比秒退率（目标 <40%）、INP（目标 <200ms）、死点击率
