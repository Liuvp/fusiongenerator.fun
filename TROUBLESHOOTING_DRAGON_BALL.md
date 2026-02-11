# Dragon Ball 页面显示问题排查指南

## 🔴 发现的错误

```
NavigationError: Unexpected token 'export'
/js/gemini-generator.js:1
```

## ✅ 已确认

1. ✅ 项目中**不存在** `/js/gemini-generator.js` 文件
2. ✅ 项目代码**没有引用**这个文件
3. ✅ Dragon Ball 页面代码本身是正常的

## 🔍 问题根源分析

### 最可能原因：浏览器扩展冲突 ⭐⭐⭐⭐⭐

从文件名 `gemini-generator.js` 判断，这可能是：
- 🔌 某个浏览器扩展注入的脚本
- 可能是 AI 助手类扩展
- 扩展使用了不兼容的 ES6 模块语法

### 其他可能原因

1. **浏览器缓存** - 缓存了旧版本的页面
2. **CDN 缓存** - Vercel/Cloudflare 缓存未更新
3. **Service Worker** - PWA service worker 缓存

---

## 🛠️ 解决步骤

### Step 1: 测试无扩展环境

#### Windows Chrome/Edge:
```
1. 按 Ctrl + Shift + N 打开无痕模式
2. 访问 https://fusiongenerator.fun/dragon-ball
3. 按 F12 打开开发者工具
4. 查看 Console 是否还有 gemini-generator.js 错误
```

**如果无痕模式下没有错误** → 证实是浏览器扩展问题

#### 识别问题扩展:
```
1. 正常模式，打开 chrome://extensions
2. 逐个禁用扩展
3. 每次刷新页面测试
4. 找到导致错误的扩展后卸载或报告给开发者
```

---

### Step 2: 清除缓存

#### Chrome/Edge:
```
1. 按 Ctrl + Shift + Delete
2. 选择"全部时间"
3. 勾选:
   ✅ 浏览历史记录
   ✅ Cookie 和其他网站数据
   ✅ 缓存的图片和文件
4. 点击"清除数据"
5. 关闭浏览器重新打开
```

#### 硬刷新:
```
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

---

### Step 3: 清除 Service Worker

```
1. F12 → Application 标签
2. 左侧 "Service Workers"
3. 点击 "Unregister" 注销所有 worker
4. 刷新页面
```

---

### Step 4: 清除 CDN 缓存（如果使用）

#### Vercel:
```bash
# 在项目根目录
vercel --prod
```

#### Cloudflare:
```
1. 登录 Cloudflare
2. 选择域名
3. Caching → Configuration
4. Purge Everything
```

---

## 📊 验证测试

### 测试清单

- [ ] 无痕模式访问，检查 Console
- [ ] 清除浏览器缓存后测试
- [ ] 禁用所有扩展后测试
- [ ] 使用不同浏览器测试（Firefox/Safari）
- [ ] 使用不同设备测试（手机）
- [ ] 检查 Network 面板，确认所有资源加载

### 预期结果（正常情况）

✅ Console 无错误（除了正常的 Clarity/GA 消息）
✅ Dragon Ball Fusion Studio 组件正常显示
✅ 角色选择网格完全加载
✅ Random 按钮可点击（虽然当前没绑定事件，但不应报错）

---

## 🐛 其他已发现的小问题

### Random 按钮无事件绑定

**位置:** `components/dragon-ball/fusion-studio.tsx` 第 598-608 行

**当前代码:**
```tsx
<Button
    type="button"
    variant="ghost"
    size="sm"
    // ❌ 缺少 onClick={randomize}
>
    <RefreshCw className="w-3 h-3 mr-1" />
    Random
</Button>
```

**影响:** 用户点击 Random 按钮无反应（Dead Click）

**修复:** 添加 `onClick={randomize}`

---

## 📈 Clarity 分析建议

1. **查看该用户的浏览器信息**
   - 使用的浏览器和版本
   - 操作系统
   - 是否为移动设备

2. **检查 Dead Clicks**
   - 查看是否点击了 Random 按钮
   
3. **检查 JavaScript Errors**
   - 查看是否有其他 JS 错误

4. **分析用户行为**
   - Page Hidden 频率
   - 停留时间
   - 滚动深度

---

## 🎯 结论

**主要问题：** 浏览器扩展注入了不兼容的 JavaScript

**次要问题：** Random 按钮缺少事件处理

**网站代码本身：** ✅ 正常，没有问题

**下一步：**
1. 按 Step 1-4 排查问题
2. 如确认是扩展问题，可忽略
3. 在 Clarity 中查看该用户的详细信息
4. 监控其他用户是否有类似问题

如果**多个用户**都遇到同样的错误，那可能需要进一步调查。
如果只是**个别用户**，很可能是他们的浏览器环境问题。
