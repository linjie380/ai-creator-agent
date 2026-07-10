# AI Creator Agent

面向个人内容创作者的一站式 AI 创作助手。

本项目是一个 AI Agent Web SaaS MVP，帮助 B 站、抖音、小红书等平台创作者完成从创意到发布文案的完整内容创作流程。

## 在线演示

[https://ai-creator-agent-cf9g.vercel.app](https://ai-creator-agent-cf9g.vercel.app)

> 注意：`http://localhost:3000` 只用于本地开发。查看线上效果请打开上面的 Vercel 演示地址。

## 核心流程

```text
创建项目
-> 生成 5 个选题
-> 选择一个选题
-> 生成研究摘要
-> 生成视频脚本
-> 生成平台发布文案
```

## MVP 功能

- 项目概览 Dashboard
- 创建和编辑创作项目
- Topic Agent：生成选题建议
- Research Agent：生成资料研究摘要
- Script Agent：生成视频脚本
- Publish Agent：生成标题、简介、标签和发布文案
- 项目状态机与步骤解锁
- 修改上游内容后提示重新生成下游内容
- 支持 Mock、OpenAI、DeepSeek 多模型 Provider
- 支持 Vercel + Neon PostgreSQL 部署

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL / Neon
- Vercel
- OpenAI SDK
- DeepSeek API

## 本地运行

```bash
npm install
npm run dev
```

然后在浏览器打开：

[http://localhost:3000](http://localhost:3000)

## 环境变量

复制 `.env.example` 为 `.env`，并填写：

```env
DATABASE_URL="your_neon_database_url"
LLM_PROVIDER="mock"

OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4.1-mini"

DEEPSEEK_API_KEY=""
DEEPSEEK_MODEL="deepseek-chat"
```

本地开发可以先使用：

```env
LLM_PROVIDER="mock"
```

需要真实模型联调时，可切换为：

```env
LLM_PROVIDER="deepseek"
```

## 数据库

生成 Prisma Client：

```bash
npm run prisma:generate
```

执行数据库迁移：

```bash
npm run prisma:migrate
```

## 项目定位

AI Creator Agent 不是单纯的 AI 写作工具，而是一个围绕创作者工作流设计的 AI Agent 产品原型。

它强调完整流程、项目管理、状态流转和多模型扩展能力，目标是验证个人创作者是否愿意使用 AI 完成一次完整内容创作。
