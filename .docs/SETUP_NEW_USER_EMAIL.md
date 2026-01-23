# 设置新用户注册邮件通知

本指南将帮助你配置 Supabase 和 Resend，以便在有新用户注册时收到邮件通知。

## 1. 准备工作

1.  **注册 Resend**: 访问 [https://resend.com/](https://resend.com/) 并注册（免费）。
2.  **获取 API Key**: 在 Resend 后台生成一个新的 API Key。
3.  **生成 Webhook Secret**: 想一个复杂的字符串（例如 `fusion-gen-webhook-2024`），作为你的通信密码。

## 2. 配置环境变量

在你的 `.env.local` 文件（本地）和 Vercel 项目设置（生产环境）中添加以下变量：

```env
RESEND_API_KEY=re_123456... (你的 Resend Key)
WEBHOOK_SECRET=your_custom_secret (你设置的密码)
ADMIN_EMAIL=your_email@gmail.com (你想接收通知的邮箱)
```

## 3. 配置 Supabase Webhook (关键步骤)

我们需要告诉 Supabase：“每当 auth.users 表有新记录时，调用我们的 API”。

1.  登录 [Supabase Dashboard](https://supabase.com/dashboard)。
2.  进入你的项目 -> **Database** -> **Webhooks**。
3.  点击 **Create a new webhook**。
4.  **填写表单**：
    *   **Name**: `Notify New User`
    *   **Table**: 选择 `auth` schema 下的 `users` 表。
    *   **Events**: 勾选 `Insert`。
    *   **Type**: 选择 `HTTP Request`。
    *   **HTTP Request Information**:
        *   **Method**: `POST`
        *   **URL**: `https://fusiongenerator.fun/api/webhooks/new-user` (生产地址)
        *   **Headers**: 点击 Add Header
            *   Name: `x-api-key`
            *   Value: `your_custom_secret` (必须与环境变量 WEBHOOK_SECRET 一致)
            *   Name: `Content-Type`
            *   Value: `application/json`

5.  点击 **Confirm** 保存。

## 4. 测试

1.  在本地或生产环境注册一个新用户。
2.  检查你的 `ADMIN_EMAIL` 邮箱是否收到来自 `FusionGenerator` 的邮件。
3.  如果是本地测试，你需要使用 `ngrok` 将本地 API 暴露给公网，或者直接在生产环境测试。

---

**注意**：Resend 免费版只能发送到**你自己注册的邮箱**，或者你需要验证一个域名才能发送给任意人。既然是通知你自己，直接用注册 Resend 的邮箱作为 `ADMIN_EMAIL` 最简单。
