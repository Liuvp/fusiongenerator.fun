# fusiongenerator.fun 优化执行方案

> 基于 Clarity 30 天用户行为数据（91 会话，86 条录制）+ 代码审查 + GSC/Bing/GA4 实际数据
> 编制时间：2026-05-15
> 最后更新：2026-05-16

---

## 一、现状摘要

### 用户行为数据（Clarity 30 天）

| 指标 | 数值 | 判断 |
|---|---|---|
| 30 天总会话 | 91 | 流量偏低 |
| 平均时长 | 1 分 43 秒 | 中等 |
| 秒退率（≤10s，0 点击） | **55.8%** | 🔴 严重 |
| 死点击率 | **25.27%** | 🔴 严重 |
| 过度滚动率 | 23.08% | ⚠️ 偏高 |
| 快速返回率 | 15.38% | ⚠️ 偏高 |
| 被迫登录（sign-in/sign-up 出口） | 3 个会话 | 转化漏斗断裂 |
| INP | 320ms | ⚠️ 超过 200ms 阈值 |
| AI 引用（Copilot） | 18 次 | 有 AI 流量基础 |

### 搜索引擎数据（GSC 28 天，截至 2026-05-16）

| 指标 | 数值 | 判断 |
|---|---|---|
| 总点击 | 16 | 极低 |
| 总展示 | 229 | 有曝光但无点击 |
| 平均 CTR | 7.0% | 偏低 |
| 平均排名 | 64.1 | 🔴 第 6 页，几乎不可见 |
| Sitemap 页面数 | 144 | — |
| 已索引 | **28** | 19.4% |
| 未索引 | **116** | 🔴 **80.6% 未索引 — SEO 最大瓶颈** |

**查询词 TOP 5（按展示量）：**

| 查询词 | 展示 | 点击 | 排名 |
|---|---|---|---|
| dragon ball fusion generator | 15 | 0 | 63.4 |
| fusion generator | 11 | 0 | 73.5 |
| dbz fusion generator | 5 | 0 | 75.6 |
| naruto fusion generator | 3 | 0 | 46.7 |
| anime fusion generator | 3 | 0 | 72.3 |

**GSC 索引页面数据：** 只有首页有搜索数据（66 展示 / 1 点击 / 排名 70.4），`/dragon-ball`、`/pokemon`、`/ai` 等核心页面**未出现在 GSC 报告中**。

### Bing Webmaster（28 天）

0 次点击，2 次展示。基本无 Bing 流量。

### GA4（30 天）

| 指标 | 数值 |
|---|---|
| 用户 | 709 |
| 新用户 | 685（96.6%） |
| 平均参与时间 | 1 分 39 秒 |
| 事件数 | 6.1K |

### 流量来源

| 来源 | 占比 | 备注 |
|---|---|---|
| 直接访问 | ~50% | 书签/手动输入 |
| Yahoo（巴西为主） | ~25% | 主要搜索来源 |
| ChatGPT | ~7% | 6 个会话，3 个秒退 |
| Copilot | 少量 | 18 次引用 |
| **Google** | **接近 0** | 🔴 最大增长空间 |

### 入口页分布（Clarity）

| 入口页 | 会话数 | 占比 |
|---|---|---|
| `/`（首页） | 42 | 48.8% |
| `/dragon-ball` | 27 | 31.4% |
| `/ai` | 9 | 10.5% |
| `/dragon-ball?utm_source=chatgpt.com` | 6 | 7.0% |

### 注册用户（截至 2026-05-16）

| 指标 | 数值 | 备注 |
|---|---|---|
| 总注册 | 12 | 全部为开发期测试账号（4/13 批量注册，GitHub OAuth） |
| 真实用户注册 | **0** | — |
| 付费订阅 | **0** | — |

---

## 二、已完成优化（P0 + P1 + 反馈系统）

> 代码已推送，线上验证通过（2026-05-16 10:30）

### ✅ P0-1：免费额度 1→2（游客 2 + 注册 2 = 新用户最多 4 次）

**最终方案：** 游客 2 次（IP 维度）+ 注册后 2 积分（用户维度），新用户最多 4 次。

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | `DEFAULT_QUOTA` remaining/limit 1→2 |
| `components/pokemon/fusion-studio.tsx` | 默认 remaining 1→2（2 处） |
| `lib/rate-limit.ts` | `getAnonymousRateLimit` limit 1→2 |
| `app/api/get-quota/route.ts` | FALLBACK_QUOTA remaining/limit 1→2 |
| `app/api/generate-fusion/route.ts` | `usage > 1` → `usage > 2`，`remainingQuota` 同步 |
| `app/api/fusion/generate/route.ts` | `usage > 1` → `usage > 2` |
| `app/api/webhooks/new-user/route.ts` | `credits: 1` → `credits: 2` |
| Supabase 触发器 `handle_new_user()` | `credits: 1` → `credits: 2`（SQL 直接执行） |

**线上验证：** ✅ 游客初始 2 次 → 第 3 次弹登录墙

### ✅ P0-2：首页 CTA 指向修正

| 文件 | 改动 |
|---|---|
| `components/home/hero-section.tsx` | 主 CTA `/ai` → `/dragon-ball`，文案同步 |

**线上验证：** ✅ 点击 CTA → 跳转 `/dragon-ball`

### ✅ P0-3：角色选择区域移动端折叠

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | `isGridExpanded` 状态，移动端默认 180px，"Show all X characters ↓" 按钮 |

### ✅ P1-1：React.memo CharacterButton

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | `memo()` 包裹 CharacterButton |

### ✅ P1-2：图片懒加载优化

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | `priority={index < 4}`，其余 lazy |

### ✅ P1-3：触屏点击区域 44px

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | `min-h-[44px] min-w-[44px]` |

### ✅ P1-4：ChatGPT 导流引导条

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/fusion-studio.tsx` | 检测 `utm_source=chatgpt.com`，紫色欢迎引导条 |

**线上验证：** ✅ `?utm_source=chatgpt.com` → 显示 "Welcome from ChatGPT! 👋"

### ✅ 反馈系统：生图满意度 Emoji 反馈

| 文件 | 改动 |
|---|---|
| `supabase/migrations/20260516000000_fusion_feedback.sql` | 建表 + 索引 + RLS + 去重 |
| `app/api/feedback/route.ts` | POST API，IP hash / user_id 去重 |
| `components/dragon-ball/fusion-studio.tsx` | 😍😐◢ 按钮 UI + "Thanks for your feedback!" |

**线上验证：** ✅ 点击 😍 → 显示 "Thanks for your feedback!"

### ✅ 全站文案同步

所有 "1 free" / "3 free" 文案已统一为 "2 free"（涉及 6 个文件 12+ 处）。

---

## 三、P2：SEO 与增长（待执行）

### ✅ P2-1：索引问题排查（已完成）

**诊断报告：** `docs/P2-1-index-diagnosis.md`

**GSC 数据（28 天）：** 144 已提交 → 28 已索引（19.4%）→ 116 未索引（80.6%）

**技术检查结果：**

| 检查项 | 结果 |
|---|---|
| robots.txt | ✅ `Allow: /`，无屏蔽 |
| Sitemap | ✅ 15 个 URL，已重新提交（2026-05-16） |
| canonical 标签 | ✅ 3 个核心页面全部自引用正确 |
| meta robots | ✅ 全部 `index, follow` |
| 页面 title/description | ✅ 包含核心关键词 |
| 页面内容结构 | ✅ h1 + HowTo + FAQ + 热门融合 |

**根因判断：** 不是技术问题。1) Google 从 2025/12/22 后就没再爬过大部分页面；2) 114 个页面状态「已发现 - 尚未编入索引」——Google 主动选择不收录；3) 站点权威度低（新站、少外链），Google 认为没有爬取价值。

**已完成的修复：**
- ✅ Sitemap 重新提交（GSC 上次读取更新为 2026-05-16）
- ✅ 诊断报告已写入 `docs/P2-1-index-diagnosis.md`

**待手动执行：**
- [ ] 在 GSC 网址检查工具中，逐页请求索引：`/`、`/dragon-ball`、`/pokemon`、`/ai`
- [ ] 等待 1-7 天观察索引状态变化

---

### ✅ P2-2：页面内容增厚（已完成）

**结论：** 三个核心页面已有完整的 SEO 内容块，无需额外修改。

| 页面 | SEO 内容 |
|---|---|
| `/dragon-ball` | Hero + HowTo(3步) + Popular Fusions(4组) + Features + FAQ(6题) |
| `/pokemon` | SEO Intro + HowTo + Popular Fusions + Features + FAQ |
| `/ai` | Hero + About + Features(3项) + Examples(4组) + FAQ(7题) |

---

### ✅ P2-3：结构化数据（已完成）

**结论：** 三个核心页面已有完整的 Schema.org 结构化数据，无需额外修改。

| 页面 | Schema 类型 |
|---|---|
| `/dragon-ball` | SoftwareApplication + Breadcrumb + WebPage + FAQPage(6题) + HowTo(3步) |
| `/pokemon` | SoftwareApplication + Breadcrumb + FAQPage |
| `/ai` | SoftwareApplication + Breadcrumb + WebPage + FAQPage(7题) + HowTo(3步) |

---

### ✅ P2-4：GA4 事件追踪（已完成）

**结论：** GA4 已通过 `gtag.js` 集成（`NEXT_PUBLIC_GA_ID`），三个生成器页面 + Auth + Pricing + Dashboard 均有完整事件追踪。

**本次新增：**
- `app/pricing/client-page.tsx` — `checkout_click`, `checkout_redirect`, `checkout_error`, `checkout_redirect_login`
- `app/dashboard/page.tsx` — `payment_success`（新建 `components/dashboard/payment-success-tracker.tsx`）

**已有事件汇总：**

| 页面 | 事件 |
|---|---|
| Dragon Ball | `db_select_char`, `db_generate_success/fail`, `db_auth_modal_show`, `db_auth_gate_click`, `db_fusion_feedback` |
| Pokemon | `pokemon_select`, `pokemon_generate_success/fail`, `pokemon_auth_gate_open/click` |
| AI | `ai_upload_success`, `ai_generate_success/fail`, `ai_auth_gate_open/click`, `ai_result_download/share` |
| Auth | `auth_page_view`, `auth_submit_click`, `auth_form_error` |
| Pricing | `checkout_click`, `checkout_redirect`, `checkout_error` ← 新增 |
| Dashboard | `payment_success` ← 新增 |

---

### 🟢 P2-5：反馈数据监控

**当前状态：** 反馈系统已上线，等待数据积累

**判定标准（部署 3-5 天后分析）：**

| 指标 | 阈值 | 含义 |
|---|---|---|
| 😍 占比 | > 60% | 生图质量 OK，转化瓶颈在别处 |
| 😢 占比 | > 20% | ⚠️ 生图质量是核心问题 |
| 反馈率 | < 10% | 反馈入口不够明显，需要调整 UI |

**数据来源：** Supabase `fusion_feedback` 表

---

### 🟢 P2-6：定价页与付费路径检查

**当前模式：** 游客 2 次 → 注册 2 积分 → 付费（Creem 支付）

**待确认项：**
- [ ] 定价页面是否清晰展示 VIP 权益？
- [ ] 免费用完后的付费引导是否明确？
- [ ] 从 auth gate 到支付的路径是否顺畅？
- [ ] 价格是否有竞争力？（对比同类工具）

---

## 三-B、P3：增长与体验优化（待执行）

### 🔴 P3-1：图片质量提升（转化头号瓶颈）

**问题：** 用户反馈生图效果不满意，至今 0 个付费订阅。图片质量直接决定用户是否愿意付费。

**当前状态：** 使用 fal.ai 生成融合图片

**待调研：**
- [ ] 对比竞品（PicLumen、AIFusionMaker 等）的生成效果
- [ ] 评估是否需要切换模型或调整 prompt
- [ ] 测试不同模型的出图质量 vs 成本
- [ ] 考虑是否增加风格选择（写实/卡通/动漫）

**前置条件：** 等 P2-5 反馈数据出来，确认 😢 占比是否 > 20%

---

### 🟡 P3-2：外链建设（索引问题根因）

**问题：** 116 个页面未索引，根因是站点权威度低（新站、少外链）

**目标渠道：**
- [ ] Reddit：r/dragonball、r/pokemon、r/fusion 等相关 subreddit
- [ ] Twitter/X：分享有趣的融合结果，带截图
- [ ] Dragon Ball / Pokemon 粉丝论坛、Discord 社区
- [ ] Product Hunt 发布
- [ ] 相关博客/工具聚合站提交

**注意事项：** 自然分享，不要 spam。内容优先——先展示有趣的融合结果，再带链接。

---

### 🟢 P3-3：INP 性能优化

**问题：** INP 320ms，超过 Google 200ms 阈值

**已做：** React.memo(CharacterButton)、图片 eager 4 张

**待做：**
- [ ] PageSpeed Insights 重新测量 INP
- [ ] 分析长任务（Long Tasks）
- [ ] 考虑角色列表虚拟化（react-window）如果角色数量多

---

### 🟢 P3-4：Bing Webmaster 提交

**当前状态：** 0 点击、2 展示

**待做：**
- [ ] 在 Bing Webmaster 提交 sitemap.xml
- [ ] 确认 Bing 是否已收录核心页面
- [ ] Bing 站长工具地址：https://www.bing.com/webmasters

---

## 四、执行优先级排序

| 序号 | 任务 | 预期影响 | 难度 | 耗时 | 前置条件 |
|---|---|---|---|---|---|
| 1 | P2-1 索引排查 | ✅ 已完成 | ⭐ 低 | 1 小时 | 无 |
| 2 | P2-4 GA4 事件追踪 | ✅ 已完成 | ⭐⭐ 低 | 30 分钟 | 无 |
| 3 | P2-2 内容增厚 | ✅ 已完成（页面已有完整内容） | ⭐⭐ 中 | 0 | P2-1 完成后 |
| 4 | P2-3 结构化数据 | ✅ 已完成（页面已有完整 Schema） | ⭐⭐ 低 | 0 | P2-2 联动 |
| 5 | P2-5 反馈分析 | 🟡 指导生图优化方向 | ⭐ 低 | 30 分钟 | 等待 3-5 天数据 |
| 6 | P2-6 定价检查 | 🟢 付费转化 | ⭐⭐ 中 | 1-2 小时 | 无 |
| 7 | P3-1 图片质量 | 🔴 转化头号瓶颈 | ⭐⭐⭐ 高 | 待定 | P2-5 数据 |
| 8 | P3-2 外链建设 | 🟡 索引 + 权威度 | ⭐⭐ 中 | 持续 | 无 |
| 9 | P3-3 INP 优化 | 🟢 用户体验 | ⭐⭐ 中 | 1-2 小时 | 无 |
| 10 | P3-4 Bing 提交 | 🟢 新流量渠道 | ⭐ 低 | 30 分钟 | 无 |

---

## 五、验证清单

### P0/P1 已验证 ✅

| 改动 | 验证方式 | 状态 |
|---|---|---|
| 游客 2 次额度 | 无痕模式 → 融合 2 次 → 第 3 次弹登录 | ✅ 2026-05-16 |
| 首页 CTA | 点击 → `/dragon-ball` | ✅ 2026-05-16 |
| 注册积分 2 | 新账号注册 → 积分 = 2 | ✅ 触发器已更新 |
| ChatGPT 引导条 | `?utm_source=chatgpt.com` → 显示引导 | ✅ 2026-05-16 |
| 反馈按钮 | 融合后点 emoji → "Thanks!" | ✅ 2026-05-16 |
| 移动端角色折叠 | 手机浏览器 → 180px + "Show all" | ✅ 代码已部署 |
| 触屏 44px | 手机点击 → 不误触 | ✅ 代码已部署 |
| React.memo | INP 降低（需 PageSpeed 验证） | ⏳ 待测量 |
| 图片懒加载 | 首屏资源减少 | ⏳ 待测量 |

### P2 待验证

| 改动 | 验证方式 |
|---|---|
| 索引诊断 | 技术检查全部通过，sitemap 已重新提交 | ✅ 2026-05-16 |
| 索引请求 | 手动请求索引 4 个核心页面 | ✅ 2026-05-16 |
| 索引增长 | GSC "已索引" 数量增长 | ⏳ 等待 1-7 天 |
| 内容增厚 | 三个页面已有完整 SEO 内容块 | ✅ 2026-05-16 |
| 结构化数据 | FAQ + HowTo + SoftwareApp Schema | ✅ 2026-05-16 |
| GA4 事件 | 全站事件追踪完整（含新增 checkout + payment） | ✅ 2026-05-16 |


| 反馈分析 | `fusion_feedback` 表数据 > 100 条 |

---

## 六、关键代码位置速查

| 功能 | 文件 | 行号 |
|---|---|---|
| 免费额度定义 | `components/dragon-ball/fusion-studio.tsx` | 21 |
| 登录墙触发 | `components/dragon-ball/fusion-studio.tsx` | ~428 (`openAuthGate`) |
| CharacterButton | `components/dragon-ball/fusion-studio.tsx` | 90-135 |
| 角色列表渲染 | `components/dragon-ball/fusion-studio.tsx` | ~821 |
| 首页 Hero CTA | `components/home/hero-section.tsx` | 24, 41 |
| 反馈 API | `app/api/feedback/route.ts` | — |
| 反馈 UI | `components/dragon-ball/fusion-studio.tsx` | `feedbackSubmitted` 状态 |
| 匿名配额 | `lib/rate-limit.ts` | 188 |
| 注册积分 | `app/api/webhooks/new-user/route.ts` | 33 |
| 数据库触发器 | Supabase SQL Editor | `handle_new_user()` |
