三项已确认的修复，立即执行：

**#1 文案修正**（fusion-studio.tsx）
- L1582: `"SAVE MY FUSIONS (FREE)"` → `"SIGN UP FOR 2 MORE FREE FUSIONS"`
- L1968: `"Save My Fusions (Free)"` → `"Get 2 More Free Fusions"`

**#2 防重复点击**（fusion-studio.tsx L1544-1589）
- 主按钮加 `disabled:cursor-wait`
- FUSING... 文字下加剩余时间提示，复用 L1750 计算逻辑

**#3 Gallery sticky 返回引导**（app/gallery/page.tsx）
- 标题下已有按钮改为 sticky 吸顶横幅（top-16 配合 header h-16, z-40 不冲突 header z-50）

完成后 `npm run build` 验证。