# 通过 `/dragon-ball` 获得首个付费用户：数据诊断与 30 天行动计划

**分析对象：** fusiongenerator.fun 的 `/dragon-ball` 页面  
**数据来源：** 用户提供的 GSC、GA4、Bing Webmaster 导出，以及当前线上 `/dragon-ball` 和 `/pricing` 页面  
**分析时间：** 2026-08-17

> **重要声明：** 我不是持牌财务顾问，也不是律师。以下是基于你当前数据的商业分析和产品建议，不保证收入结果；涉及 Dragon Ball 角色、粉丝作品、AI 生成内容和商业使用的权利问题，应在正式收费或扩大营销前让合格律师审阅。

## 一、先给结论

你现在最需要解决的不是“再做更多 SEO”，而是把已经存在的需求变成一次可完成、可测量的付费行为。当前数据表明，**Bing 已经证明 `/dragon-ball` 有搜索需求，但 Google 仍处于低曝光阶段；GA4 说明网站有访问，却没有配置出能够回答“用户为什么不付费”的转化漏斗。**

我的明确建议是：先不要把核心目标设成订阅收入，而是推出一个低摩擦的 **一次性 Dragon Ball Fusion Starter Pack**，价格建议为 **US$2.99–4.99**，在用户第一次成功生成并想下载时触发购买。权益应是快速队列、高清、无水印和历史保存；不要把 Dragon Ball 角色生成结果承诺为可商业使用，也不要把站点包装成官方产品。

你的第一个收入目标应当是：在接下来的 30 天内，让 **100 个有明确意图的 `/dragon-ball` 访问者进入生成—下载漏斗，并争取 1–3 个真实付费用户**。这比当前直接推动 US$9.99 月订阅更合理，因为你现在还没有验证用户是否愿意为结果付费。

## 二、数据告诉我们的事实

### 1. Google：需求已经出现，但 `/dragon-ball` 还没有获得足够排名

GSC 页面/查询导出中，首页累计记录为 **433 次展示、7 次点击**，`/ai` 为 **29 次展示、4 次点击**，`/pokemon` 为 **62 次展示、0 次点击**，而 `/dragon-ball` 只有 **7 次展示、0 次点击**。Dragon Ball 相关词主要仍在很低的位置：

| 查询词 | 目标页面 | 展示 | 点击 | 平均排名 |
|---|---|---:|---:|---:|
| `dragon ball fusion generator` | 首页 | 78 | 1 | 约 68.8 |
| `dbz fusion generator` | `/dragon-ball` | 2 | 0 | 约 93.5 |
| `dbz fusion goku vegeta` | `/dragon-ball` | 5 | 0 | 约 65.8 |
| `dragon ball fusion simulator` | 首页 | 3 | 0 | 约 66.3 |
| `dragon ball z fusion generator` | 首页 | 14 | 0 | 约 68.9 |

这意味着 Google 端目前尚未形成可用于判断付费转化率的流量规模。**7 次展示、0 次点击不能说明产品不能收费，只能说明 Google 还没有把目标页面送到足够多的高意图用户面前。**

### 2. Bing：这是目前最值得立即利用的渠道

Bing 导出中的 TopPages 记录显示，`https://fusiongenerator.fun/dragon-ball` 累计记录约 **6,349 次展示、158 次点击**，明显高于 Google 当前对该页面的曝光。TopKeywords 聚合中，`dragon ball fusion generator` 约有 **2,213 次展示、89 次点击**，`dbz fusion generator` 约有 **294 次展示、16 次点击**，`dragon ball fusion` 约有 **558 次展示、9 次点击**。

这些数字来自 Bing 的日期级记录聚合，不应直接当作去重用户数或精确收入漏斗，但它们足以支持一个商业判断：**Bing 上已经有一批对 Dragon Ball fusion 产生明确兴趣的用户，优先修复产品转化和支付路径，比继续等待 Google 收录更有机会得到首单。**

### 3. GA4：有访问，但目前无法回答页面级转化问题

GA4 导出包含 606 条日期、渠道、国家和设备维度记录。按导出记录中的指标求和，约有 **1,081 次 sessions、903 个 total users、770 个 new users 和 3,075 个 screen page views**。渠道维度约为：

| 渠道 | Sessions | Users | Page views |
|---|---:|---:|---:|
| Direct | 625 | 515 | 1,513 |
| Organic Search | 320 | 304 | 681 |
| Referral | 89 | 41 | 751 |
| Unassigned | 35 | 31 | 108 |
| AI Assistant | 11 | 11 | 18 |
| Organic Social | 1 | 1 | 4 |

这里存在一个关键缺口：你提供的 GA4 数据没有 page path、事件、checkout 或 purchase 维度，因此无法知道 1,081 次 sessions 中有多少真正到达 `/dragon-ball`，也无法知道用户是在生成前、生成失败后、下载时还是支付页退出。**在没有事件追踪前，任何“转化率很低”的结论都只是猜测。**

美国约有 652 sessions，新加坡约 100， 中国约 78；设备以桌面端为主，约 923 sessions，移动端约 128。这个结构支持先做桌面端支付和生成流程，但页面仍必须在手机上完成一次顺畅生成，因为 Dragon Ball 粉丝的分享和内容消费很可能发生在移动设备上。

## 三、当前产品最重要的转化矛盾

当前 `/dragon-ball` 页面给用户的承诺是：免费试用、无需登录、3 次免费融合、注册赠送 2 credits、生成后可下载高清结果。当前 `/pricing` 则提供 US$9.99/月的 Pro 方案和 US$4.99/100 次的一次性 Extra Credits。

这套设计存在三个转化问题。

第一，**免费额度和付费权益没有在用户最想下载结果的瞬间形成强联系**。用户可以免费体验，却未必知道为什么要立刻购买。第二，**Pro 月订阅对尚未形成信任的首次访客太重**。一个只来一次、想生成一个 Gogeta 或 Goku/Vegeta 融合图的用户，不一定愿意马上承担订阅关系。第三，页面对 Dragon Ball 结果写有“personal and fan use only”，而价格页又写有“Commercial Use for Original AI Artwork”。即使两段文字可以解释为不同范围，对普通用户仍然会产生权益不清晰的问题。

Google 的内容指导强调，页面应当为真实用户提供完整、独立、有帮助的内容，而不是只为搜索排名生产文本。[1] 对 `/dragon-ball` 来说，这不意味着单纯增加字数，而是要让用户清楚看到：生成质量、免费体验边界、付费后具体得到什么、生成失败如何处理、结果能否保存和分享，以及这个粉丝工具与官方版权方的关系。

## 四、建议采用的首个付费产品

### 推荐产品：Dragon Ball Fusion Starter Pack

| 项目 | 建议方案 |
|---|---|
| 产品名 | Dragon Ball Fusion Starter Pack |
| 首发价格 | US$2.99–4.99，一次性购买 |
| 主要权益 | 20–50 次快速生成、高清、无水印、结果历史保存 |
| 触发时机 | 用户成功生成一次并点击下载之后 |
| 退款/失败处理 | 生成失败不扣 credit；支付后可在账户内查看余额 |
| 定位 | 粉丝娱乐和创作支持，不承诺官方授权或角色商业权利 |
| 后续升级 | 用户实际消耗后，再测试 US$9.99/月 Pro |

你当前有 US$4.99/100 次 Extra Credits，可以保留作为高额度选项，但建议增加一个更容易首次购买的低价入口。**首单的目标不是最大化客单价，而是验证“用户愿不愿意为高清、无水印和更快结果支付”。**

推荐的页面文案可以是：

> **Your first fusion is free. Unlock HD, no watermark, and faster generations for your next fusions.**  
> One-time pack. No subscription required.

在用户生成结果后显示：

> **Your fusion is ready.** Free preview includes standard quality. Unlock HD download and remove the watermark with a one-time Fusion Pack.

不要在首次付费入口使用“商业授权”作为主卖点。对于包含 Dragon Ball 角色的结果，这会把版权风险和用户理解成本同时放大。应该卖 **生成体验、速度、高清下载、无水印、历史保存和娱乐价值**，而不是卖用户对第三方角色的商业权利。

## 五、必须先补齐的 GA4 转化漏斗

Google Analytics 的关键事件用于记录对业务成功特别重要的行为，并可按渠道、着陆页和用户路径分析。[2] 你应当至少增加以下事件，并把 `purchase`、`checkout_start`、`fusion_success` 和 `download_click` 设置为关键事件：

| 事件 | 触发位置 | 目的 |
|---|---|---|
| `dragon_ball_view` | `/dragon-ball` 加载 | 统计真实着陆人数 |
| `fusion_start` | 用户点击生成 | 衡量产品兴趣 |
| `fusion_success` | 图片成功生成 | 区分产品价值和技术失败 |
| `download_click` | 用户点击下载 | 衡量结果价值 |
| `pricing_view` | 打开价格弹窗/价格页 | 衡量商业意图 |
| `checkout_start` | 进入支付 | 衡量支付意愿 |
| `purchase` | 支付成功页 | 真实收入事件 |
| `purchase_failed` | 支付失败/取消 | 定位支付问题 |
| `credit_spend` | 消耗 credit | 衡量复购潜力 |

所有事件至少带上 `page=/dragon-ball`、`plan`、`price`、`device` 和 `source` 参数。UTM 链接应统一使用，例如 `utm_source=bing&utm_medium=organic&utm_campaign=dragon_ball_launch`；社交和创作者推广也必须各自使用不同 UTM。

## 六、30 天执行计划

### 第 1–3 天：先确保能够收钱和测量

在任何 SEO 或广告投入前，完成一次真实的小额支付测试。确认用户可以从 `/dragon-ball` 完成：选择角色、生成成功、看到结果、点击下载、注册或登录、购买 credit、支付成功、余额到账、再次生成。检查移动端支付、失败重试、退款说明和邮件通知。

同时部署上述 GA4 事件，并在 GA4 中建立 `/dragon-ball` 的漏斗探索。你要能回答五个数字：页面访问数、开始生成数、成功生成数、下载数、支付数。没有这五个数字，不要再根据总 sessions 猜测产品问题。

### 第 4–7 天：改造 `/dragon-ball` 的首屏和结果页

首屏主标题应更直接地表达结果价值，例如 **“Create Your Own Dragon Ball Fusion in Seconds”**。首屏 CTA 不要只写 “Start Free Fusion”，可以改为 **“Create a Free Fusion”**，并在按钮附近说明“Free preview · No subscription required”。

在生成器下方加入 3 个真实示例，并展示“免费预览”和“HD 无水印下载”的差异。把价格页的低价一次性 Starter Pack 放在结果页，而不是只把用户送到一个泛化的 Pricing 页面。

在页面下方增加具有独立价值的内容：Gogeta vs Vegito 的生成差异、Goku + Vegeta、Goku + Piccolo、Vegeta + Frieza 等组合示例、生成失败处理、移动端说明、隐私说明和非官方粉丝工具声明。内容应基于你自己实际生成和测试的结果，而不是批量生成 SEO 文章。Google 的官方建议是优先提供原创、完整、能让访问者满意的 people-first 内容。[1]

### 第 2 周：利用 Bing 已存在的需求

围绕已经产生曝光的词优化页面标题、H1、FAQ 和示例，而不是盲目扩展几十个相似页面。优先覆盖：`dragon ball fusion generator`、`dbz fusion generator`、`dragon ball fusion`、`dragon ball fusion maker`、`dragon ball fusion generator game`、`make a dragon ball fusion`。

不要去追逐 `hacked`、`unlocked`、`moded` 等高风险词。Bing 数据中出现这些词不代表它们适合商业化，追逐这类词会吸引寻找盗版或绕过付费限制的用户，反而降低付费意愿和品牌质量。

同时制作 10 个短视频或 GIF，每个只展示一个组合：角色选择、生成过程、结果揭晓、下载前后差异。每条内容都链接到 `/dragon-ball`，并使用单独 UTM。先使用自己的结果和明确的粉丝工具声明，不要假装官方或批量灌入社区。

### 第 3 周：做小规模人工获客

找 20 个真正发布 anime、fan art、AI art 或 Dragon Ball 创作内容的微型创作者，逐一发送可验证的免费体验邀请。不要群发垃圾信息。邀请内容应是：“我们做了一个非官方的 Dragon Ball fusion fan tool，想邀请你用两个角色测试并分享你最喜欢的一组。” 对愿意分享的人，可以提供一次性 credits 或创作者专属链接，但不要承诺第三方角色商业权利。

这一步的目的不是立即买广告，而是观察真实用户最想生成什么、为什么下载、为什么愿意或不愿意付款。把反馈写回页面和产品，而不是只追求曝光数量。

### 第 4 周：根据漏斗数据决定是否扩大

建议使用以下内部判断门槛，不把它们当作行业保证，只把它们作为你的实验停止/继续规则：

| 漏斗指标 | 首轮目标 | 若低于目标，优先检查 |
|---|---:|---|
| 页面到开始生成 | 15% | 首屏、加载速度、角色选择是否清晰 |
| 开始生成到成功生成 | 70% | AI 失败、队列、错误提示 |
| 成功生成到下载 | 30% | 结果质量、下载按钮、移动端体验 |
| 下载到价格页/付费入口 | 10% | 付费权益与 CTA 是否清楚 |
| 付费入口到 checkout | 25% | 价格、信任、支付方式 |
| checkout 到成功支付 | 50% | 支付失败、登录摩擦、退款说明 |

如果 100 个真实 `/dragon-ball` 访问者带来 0 次 checkout，先不要买流量，说明产品价值或付费入口没有成立。如果有 checkout 但 0 次支付，优先处理支付方式、价格和信任。如果有支付但没有二次 credit 消耗，说明一次性体验成立但长期价值尚未成立，不要急着推订阅。

## 七、收入目标与单位经济

第一个月不建议用“月收入”作为唯一目标，建议分成三层：

| 阶段 | 目标 | 通过标准 |
|---|---|---|
| 验证需求 | 100 个目标访问者 | 至少 10 个开始生成，至少 3 个下载 |
| 验证付费 | 1–3 个 Starter Pack 订单 | 支付成功、credit 正常到账 |
| 验证复购 | 至少 1 个用户再次消耗 credit | 证明不是一次性偶然购买 |

你需要自己核算每次生成的真实成本。一次性产品的贡献毛利公式是：

> **贡献毛利 = 支付金额 − 支付手续费 − 实际生成次数 × 单次 AI 成本 − 存储/邮件等可变成本。**

如果 US$4.99 的 100 credits 在你的成本结构下无法盈利，就不要直接承诺 100 次；可以改为 20–30 次，或设置公平使用限制。订阅价格只有在用户已经重复消耗、你知道平均每位付费用户的生成量后才适合优化。

## 八、版权与信任风险

当前页面已经声明是非官方粉丝工具，这是正确方向，但产品页和价格页的使用权描述应统一。建议把 Pro 页中的“Commercial Use”改成更谨慎的表述，例如：

> **Commercial-use note:** the plan covers access to the generation service and original output where applicable. Users are responsible for rights relating to third-party characters, trademarks, and source material.

这不是法律结论，但可以避免用户误解为你能授予 Dragon Ball 角色的商业授权。长期来看，最稳妥的商业化路线是同时开发 **original anime-inspired fusion mode**：使用原创角色、原创名字和原创视觉设定，单独提供可商业使用的生成结果。Dragon Ball 页面可以作为获客入口，但原创模式才更适合作为长期付费产品。

## 最终执行顺序

**先测量，再修复支付，再做低价一次性 offer，然后利用 Bing 现有流量，最后才扩大 SEO 和社交获客。** 你目前不是缺少一个更复杂的定价表，而是缺少一个能够在用户看到满意结果后自然发生的付费瞬间。

如果只允许本周完成三件事，我建议按以下顺序执行：

1. 完成一次真实支付和退款/失败流程测试，并部署 GA4 漏斗事件。
2. 在 `/dragon-ball` 结果页上线 US$2.99–4.99 的一次性 HD/无水印 Starter Pack。
3. 使用 Bing 已有的 `/dragon-ball` 需求制作 10 个独立短视频或创作者邀请链接，并用 UTM 追踪支付。

## References

[1]: https://developers.google.com/search/docs/fundamentals/creating-helpful-content "Google Search Central: Creating helpful, reliable, people-first content"

[2]: https://support.google.com/analytics/answer/9267568?hl=en "Google Analytics Help: About key events"

[3]: https://fusiongenerator.fun/dragon-ball "fusiongenerator.fun Dragon Ball Fusion Generator"

[4]: https://fusiongenerator.fun/pricing "fusiongenerator.fun Pricing Plans"
