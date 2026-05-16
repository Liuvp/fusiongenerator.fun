# Changelog — 2026-05-16 (P2 执行)

基于 GSC/Bing/GA4 实际数据 + P0/P1 验证结果，执行 P2 优化。

---

## P2-1：索引问题排查

**结论：** 技术 SEO 全部正确，索引问题是站点权威度低 + Google 爬取频率低导致。

**操作：**
- Sitemap 已在 GSC 重新提交（2026-05-16）
- 诊断报告写入 `docs/P2-1-index-diagnosis.md`

**待手动执行：**
- 在 GSC 网址检查工具中请求索引 4 个核心页面

---

## P2-2：页面内容增厚

**结论：** 三个核心页面已有完整的 SEO 内容块，无需额外修改。

| 页面 | 内容 |
|---|---|
| `/dragon-ball` | Hero + HowTo(3步) + Popular Fusions(4组) + Features + FAQ(6题) |
| `/pokemon` | SEO Intro + HowTo + Popular Fusions + Features + FAQ |
| `/ai` | Hero + About + Features(3项) + Examples(4组) + FAQ(7题) |

---

## P2-3：结构化数据

**结论：** 三个核心页面已有完整的 Schema.org 结构化数据。

| 页面 | Schema |
|---|---|
| `/dragon-ball` | SoftwareApplication + Breadcrumb + WebPage + FAQPage(6题) + HowTo(3步) |
| `/pokemon` | SoftwareApplication + Breadcrumb + FAQPage |
| `/ai` | SoftwareApplication + Breadcrumb + WebPage + FAQPage(7题) + HowTo(3步) |

---

## P2-4：GA4 事件追踪补全

**已有：** 三个生成器页面 + Auth 页面均有完整事件追踪。

**新增：**

| 文件 | 事件 |
|---|---|
| `app/pricing/client-page.tsx` | `checkout_click`, `checkout_redirect`, `checkout_error`, `checkout_redirect_login` |
| `app/dashboard/page.tsx` | `payment_success` |
| `components/dashboard/payment-success-tracker.tsx` | 新建：客户端组件，支付成功时触发事件 |

---

## FAQ 文案修正

| 文件 | 改动 |
|---|---|
| `components/dragon-ball/faq.tsx` | "Visitors get one free trial fusion" → "Visitors get 2 free fusions" |

---

## 文件变更清单

| 文件 | 操作 | 说明 |
|---|---|---|
| `app/pricing/client-page.tsx` | 修改 | 添加 checkout 事件追踪 |
| `app/dashboard/page.tsx` | 修改 | 添加 PaymentSuccessTracker |
| `components/dashboard/payment-success-tracker.tsx` | 新建 | 支付成功事件追踪组件 |
| `components/dragon-ball/faq.tsx` | 修改 | 免费次数文案 1→2 |
| `docs/P2-1-index-diagnosis.md` | 新建 | 索引诊断报告 |
| `OPTIMIZATION_PLAN.md` | 修改 | P2 全部标记完成 |
