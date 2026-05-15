# fusiongenerator.fun 优化执行方案

> 基于 Clarity 30 天用户行为数据（91 个会话，86 条录制）+ 代码审查
> 编制时间：2026-05-15

---

## 一、现状摘要

### 核心数据

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

### 流量来源

| 来源 | 占比 | 备注 |
|---|---|---|
| 直接访问 | ~50% | 书签/手动输入 |
| Yahoo（巴西为主） | ~25% | 主要搜索来源 |
| ChatGPT | ~7% | 6 个会话，3 个秒退 |
| Copilot | 少量 | 18 次引用 |
| **Google** | **接近 0** | 🔴 最大增长空间 |

### 入口页分布

| 入口页 | 会话数 | 占比 |
|---|---|---|
| `/`（首页） | 42 | 48.8% |
| `/dragon-ball` | 27 | 31.4% |
| `/ai` | 9 | 10.5% |
| `/dragon-ball?utm_source=chatgpt.com` | 6 | 7.0% |

---

## 二、问题诊断与执行方案

### 🔴 P0：免费额度只有 1 次 → 改为 3 次

**问题：** 用户完成第 1 次融合后，立即弹出登录墙。55.8% 秒退率 + 3 个被迫登录会话 = 转化漏斗在第 1 次体验后断裂。

**代码位置：** `components/dragon-ball/fusion-studio.tsx:21`

```typescript
// 当前
const DEFAULT_QUOTA = { used: 0, remaining: 1, limit: 1, isVIP: false };

// 改为
const DEFAULT_QUOTA = { used: 0, remaining: 3, limit: 3, isVIP: false };
```

**改法：** 一行代码。`remaining` 和 `limit` 从 1 改成 3。

**预期效果：**
- 用户能体验 3 次融合再决定是否注册
- 秒退率下降（用户有更多时间理解产品价值）
- 注册转化率可能反而提升（体验更深 → 更愿意注册）

**风险：** 无。纯前端逻辑，不影响后端计费。

---

### 🔴 P0：首页 Hero CTA 指向错误

**问题：** 首页主 CTA "Fuse Your Characters!" 指向 `/ai`，但 48.8% 的用户从首页进入后，实际兴趣是 Dragon Ball 融合（31.4% 的用户直接搜 dragon ball 进入）。入口不匹配导致首页秒退。

**代码位置：** `components/home/hero-section.tsx:24`

```tsx
// 当前
<Link href="/ai" ...>

// 改为
<Link href="/dragon-ball" ...>
```

**同文件需改的：**
- 第 24 行主 CTA 链接：`/ai` → `/dragon-ball`
- 第 41 行右侧图片链接：`/ai` → `/dragon-ball`
- 按钮文案可考虑改为 "Try Dragon Ball Fusion Free!"

**补充优化：** 首页首屏应增加 `/dragon-ball` 和 `/pokemon` 的独立入口卡片，让用户直接选择感兴趣的生成器。

---

### 🔴 P0：角色选择死点击 25%

**问题：** Clarity AI 明确指出"角色选择过程中的频繁死点击"。40+ 个角色同时渲染，`nextDynamic` + `ssr: false` 导致首次渲染有延迟，用户点击时组件可能尚未 hydrate 完成。

**代码位置：** `components/dragon-ball/fusion-studio.tsx` 第 821 行附近

**执行方案：**

#### 3a. 移动端默认只显示 12 个热门角色

```tsx
// 在 CharacterButton 列表渲染前加判断
const VISIBLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 12 : 40;
const [showAll, setShowAll] = useState(false);
const visibleCharacters = showAll ? DB_CHARACTERS : DB_CHARACTERS.slice(0, VISIBLE_COUNT);
```

- 移动端默认 12 个，加 "Show all characters ↓" 按钮
- PC 端保持全部显示

#### 3b. 增大点击区域（触屏友好）

```tsx
// CharacterButton 组件，确保最小点击区域
className="... min-h-[44px] min-w-[44px]"  // Apple HIG 最小触屏目标
```

#### 3c. 加 loading 状态反馈

```tsx
// CharacterButton 点击后加视觉反馈
const [isSelecting, setIsSelecting] = useState(false);
// onClick 时先 setIsSelecting(true)，渲染 loading spinner
```

---

### 🟡 P1：INP 320ms → 优化到 200ms 以内

**问题：** 40+ 个角色图片同时渲染，每次交互触发大量 re-render。

**执行方案：**

#### 4a. 虚拟化角色列表

只渲染可见区域的角色，滚动时动态加载。使用 `react-window` 或手写 IntersectionObserver：

```tsx
// 只渲染 viewport 内的角色 + 预加载 2 行
const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
// 用 IntersectionObserver 监测滚动，动态更新 range
```

#### 4b. 图片懒加载优化

```tsx
// 当前只有前 8 个 priority
{index < 8 ? 'eager' : 'lazy'}

// 改为：只有前 4 个 eager，其余全部 lazy + loading="lazy"
<Image loading={index < 4 ? "eager" : "lazy"} ... />
```

#### 4c. 减少 re-render

```tsx
// CharacterButton 用 React.memo 包裹
const CharacterButton = React.memo(({ character, ... }: CharacterButtonProps) => {
  // ...
});
```

---

### 🟡 P1：过度滚动 23%（找不到角色）

**问题：** 40+ 个角色铺满页面，用户需要滚动很久。

**执行方案：**

#### 5a. 加角色搜索框

在角色选择区顶部加搜索输入框：

```tsx
<input
  type="text"
  placeholder="Search characters..."
  onChange={(e) => filterCharacters(e.target.value)}
/>
```

#### 5b. 按分组展示

```tsx
// 角色分组
const CHARACTER_GROUPS = [
  { name: "Z Fighters", characters: [...] },
  { name: "Villains", characters: [...] },
  { name: "Support", characters: [...] },
];
```

每组可折叠，默认只展开 Z Fighters。

---

### 🟡 P1：ChatGPT 导流落地页优化

**问题：** 6 个来自 ChatGPT 的会话中，2 个秒退，3 个短暂交互无转化。用户期望看到 AI 工具，但落地到角色选择界面。

**执行方案：**

检测 `utm_source=chatgpt.com` 或 `document.referrer` 包含 `chatgpt`，在 `/dragon-ball` 页面首屏显示简短引导：

```tsx
const isFromAI = searchParams.get('utm_source') === 'chatgpt.com';
{isFromAI && (
  <div className="bg-purple-50 p-3 rounded-lg text-sm">
    Welcome! Pick two Dragon Ball characters below and hit "FUU-SION-HA!" to create your fusion. No account needed for your first try.
  </div>
)}
```

---

### 🟢 P2：SEO 基础建设

**当前状态：** Google 搜索流量接近为零。

**执行方案：**

#### 7a. 确认 sitemap 和 robots.txt

```bash
# 检查
curl https://fusiongenerator.fun/sitemap.xml
curl https://fusiongenerator.fun/robots.txt
```

#### 7b. 结构化数据

检查 `/dragon-ball` 页面是否已有 FAQ Schema、HowTo Schema。如有，确认格式正确。

#### 7c. 页面标题优化

当前 `/dragon-ball` 的 title 和 description 需确认是否包含核心关键词：
- "Dragon Ball Fusion Generator"
- "AI character fusion"
- "Dragon Ball Z fusion maker"

#### 7d. 内容深度

每个生成器页面（dragon-ball、pokemon、ai）需要 800+ 字的 SEO 内容，包括：
- 什么是角色融合
- 怎么玩
- 常见问题
- 示例展示

---

### 🟢 P2：Monetization 检查

**当前模式：** 免费 1 次 → 注册 → 付费（Creem 支付）

**待确认：**
- 定价页面是否清晰？
- VIP 权益是否足够吸引人？
- 免费 3 次后，付费转化路径是否顺畅？

---

## 三、执行优先级排序

| 序号 | 任务 | 预期影响 | 难度 | 耗时 |
|---|---|---|---|---|
| 1 | 免费额度 1→3 | 🔴 直接提升留存 | ⭐ 极低 | 5 分钟 |
| 2 | 首页 CTA `/ai`→`/dragon-ball` | 🔴 减少首页秒退 | ⭐ 极低 | 5 分钟 |
| 3 | 移动端角色折叠（默认 12 个） | 🔴 减少死点击 | ⭐⭐ 低 | 30 分钟 |
| 4 | 触屏点击区域 44px | 🔴 减少死点击 | ⭐ 极低 | 15 分钟 |
| 5 | React.memo CharacterButton | 🟡 降低 INP | ⭐⭐ 低 | 20 分钟 |
| 6 | 图片 lazy loading 优化 | 🟡 降低 INP | ⭐ 极低 | 10 分钟 |
| 7 | 角色搜索框 | 🟡 减少过度滚动 | ⭐⭐ 中 | 1 小时 |
| 8 | ChatGPT 导流引导条 | 🟡 提升 AI 流量转化 | ⭐⭐ 低 | 30 分钟 |
| 9 | SEO 基础检查 | 🟢 Google 流量增长 | ⭐⭐ 中 | 1-2 小时 |
| 10 | 定价页优化 | 🟢 付费转化 | ⭐⭐⭐ 高 | 待定 |

---

## 四、今日可执行（30 分钟内完成）

只需改 3 个文件，30 分钟内可以全部完成并推送：

### 文件 1：`components/dragon-ball/fusion-studio.tsx`

```
第 21 行：remaining: 1 → remaining: 3
          limit: 1 → limit: 3
```

### 文件 2：`components/home/hero-section.tsx`

```
第 24 行：href="/ai" → href="/dragon-ball"
第 41 行：href="/ai" → href="/dragon-ball"
```

### 文件 3：`components/dragon-ball/fusion-studio.tsx`（CharacterButton 区域）

```
- 加 min-h-[44px] min-w-[44px] 到按钮 className
- 移动端默认折叠角色列表
```

---

## 五、验证方法

| 改动 | 验证方式 |
|---|---|
| 免费额度 3 次 | 无痕模式打开 → 融合 3 次 → 第 4 次才弹登录 |
| 首页 CTA | 点击 "Fuse Your Characters!" → 跳转到 /dragon-ball |
| 角色折叠 | 手机浏览器打开 → 只看到 12 个角色 + "Show all" 按钮 |
| 点击区域 | 手机上点击角色 → 不会误触相邻角色 |
| INP | PageSpeed Insights 检查 INP < 200ms |

---

## 六、数据追踪

### 当前缺失

- 无 GSC 接入（Google 搜索流量接近 0）
- 无 GA4 事件追踪（只有 Clarity 录制）

### 建议接入

1. **GSC** — 监控 Google 索引状态和搜索表现
2. **GA4 事件** — 追踪关键转化：
   - `fusion_started`（选择角色）
   - `fusion_completed`（生成成功）
   - `auth_gate_shown`（弹出登录墙）
   - `sign_up_completed`（注册成功）
   - `payment_completed`（付费成功）

---

## 七、附录：关键代码位置速查

| 功能 | 文件 | 行号 |
|---|---|---|
| 免费额度定义 | `components/dragon-ball/fusion-studio.tsx` | 21 |
| 登录墙触发 | `components/dragon-ball/fusion-studio.tsx` | ~428 (`openAuthGate`) |
| CharacterButton | `components/dragon-ball/fusion-studio.tsx` | 90-135 |
| 角色列表渲染 | `components/dragon-ball/fusion-studio.tsx` | ~821 |
| 首页 Hero CTA | `components/home/hero-section.tsx` | 24, 41 |
| 首页结构 | `app/page.tsx` | — |
| Dragon Ball 页面 | `app/dragon-ball/page.tsx` | — |
| 支付集成 | Creem（已接入） | — |
