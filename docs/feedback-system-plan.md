# 生图满意度反馈方案

> 目标：用最小成本测出用户对生成图片是否满意
> 编制时间：2026-05-16

---

## 一、问题

用户生成图片后，我们不知道他们满不满意。0 订阅 + 55.8% 秒退 = 可能是图不好，也可能是转化路径有问题。需要数据区分。

## 二、方案：结果卡片加反应按钮

### 用户视角

生成完图片后，结果卡片底部出现一行：

```
How do you like this fusion?   😍    😐    😢
```

点一下就行，不需要文字。点完显示 "Thanks for your feedback!"，按钮变灰不可重复点。

### 数据流

```
用户点反应 → POST /api/feedback → Supabase feedback 表
```

### 表结构

```sql
CREATE TABLE fusion_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fusion_type TEXT NOT NULL,          -- 'dragon_ball' | 'pokemon' | 'ai'
  char1_id TEXT NOT NULL,
  char2_id TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating IN (1, 2, 3)),  -- 1=😍 2=😐 3=😢
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id),  -- 可为空（游客）
  ip_hash TEXT,                              -- 游客去重
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引：按 fusion_type + rating 快速统计
CREATE INDEX idx_fusion_feedback_type_rating ON fusion_feedback(fusion_type, rating);
-- 索引：按时间排序
CREATE INDEX idx_fusion_feedback_created ON fusion_feedback(created_at DESC);
```

### API 路由

**`app/api/feedback/route.ts`**

```ts
POST /api/feedback
Body: { fusionType, char1Id, char2Id, rating, imageUrl }
```

- 游客：用 IP hash 去重（同一个 IP 对同一组角色只能评一次）
- 登录用户：用 user_id + char1_id + char2_id 去重
- 返回 200 或 409（重复提交）

### 前端改动

**`components/dragon-ball/fusion-studio.tsx`** — 结果卡片区域

在 `Download HD` 按钮上方加一行：

```tsx
{/* 反馈按钮 */}
{!feedbackSubmitted && (
  <div className="flex items-center justify-center gap-4 py-3">
    <span className="text-sm text-gray-500">How do you like it?</span>
    <button onClick={() => submitFeedback(1)} className="text-2xl hover:scale-125 transition-transform">😍</button>
    <button onClick={() => submitFeedback(2)} className="text-2xl hover:scale-125 transition-transform">😐</button>
    <button onClick={() => submitFeedback(3)} className="text-2xl hover:scale-125 transition-transform">😢</button>
  </div>
)}
{feedbackSubmitted && (
  <p className="text-center text-sm text-green-600 py-2">Thanks for your feedback!</p>
)}
```

状态管理：
- 新增 `feedbackSubmitted` state（boolean）
- 新增 `submitFeedback(rating)` 函数
- 每次生成新结果时重置为 false

### 同步加埋点

在 `submitFeedback` 里调用已有的 `trackStudioEvent`：

```ts
trackStudioEvent("db_fusion_feedback", {
  rating,           // 1=😍 2=😐 3=😢
  char1_id: result.char1.id,
  char2_id: result.char2.id,
  is_logged_in: Boolean(user),
});
```

这样 GA4 也能看到反馈数据，不只在 Supabase。

---

## 三、Pokemon / AI 页面同步

三个生成器页面都需要加。实现方式：

1. 反馈 API 是通用的（`/api/feedback`），通过 `fusionType` 区分
2. `components/pokemon/fusion-studio.tsx` 和 `app/ai/client-page.tsx` 同样位置加按钮
3. 按钮样式统一，可以提取成共享组件

建议先在 Dragon Ball 验证，确认数据跑通后再铺到其他两个。

---

## 四、数据看板（可选，第二步）

数据积累 3-5 天后，可以用 Supabase Dashboard 或写一个简单脚本统计：

| 指标 | 计算方式 | 健康值 |
|---|---|---|
| 满意率 | 😍 / (😍+😐+😢) | >60% |
| 不满意率 | 😢 / (😍+😐+😢) | <20% |
| 反馈率 | 有反馈的会话 / 总生成会话 | >30%（太低说明按钮不明显） |

---

## 五、执行清单

- [ ] Supabase 建 `fusion_feedback` 表（SQL migration）
- [ ] 写 `app/api/feedback/route.ts`
- [ ] `components/dragon-ball/fusion-studio.tsx` 加反馈按钮 + 状态 + 提交逻辑
- [ ] 验证：游客提交、登录用户提交、重复提交被拒
- [ ] 部署后观察 3 天数据
- [ ] 确认数据通了后铺到 Pokemon 和 AI 页面

---

## 六、成本

- 代码量：~80 行（API 30 + 前端 50）
- 数据库：一张表，无额外费用
- 用户体验：零摩擦（点一下 emoji 就完事）
- 开发时间：约 30 分钟
