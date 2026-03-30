# MaxCode

Obsidian 插件项目（功能对齐 Claudian，模型切换为 OpenAI/Codex）。

## 当前目标
- 功能体验与 Claudian 尽可能一致
- 模型提供方改为 OpenAI
- 支持 API Key 与账号登录（通过自建网关）
- 支持导入 Claudian 配置

## 当前已实现
- 侧栏聊天视图（流式回复 / 停止生成 / 新会话）
- 当前笔记上下文自动注入
- Claudian 风格 UI（复用同类样式体系）
- `/slash` 命令解析（支持 `{{selection}}`、`{{args}}` 占位符）
- Inline Edit（选中文本 + 指令改写）
- Claudian 配置 JSON 导入命令
- API Key / Gateway 两种鉴权入口
- 模型调用优先本地 `codex` CLI，失败时回退 OpenAI API
- 工具命令：`/read`、`/write`、`/search`、`/bash`、`/mcp-list`、`/mcp-tools`、`/mcp-call`
- 安全审批模式：`safe / plan / yolo`
- 自动工具编排：`/agent <task>`

## 目录结构
- `docs/PRD-v1.md`：产品需求（可直接开工）
- `docs/Architecture.md`：技术架构与模块划分
- `docs/MVP-2weeks-plan.md`：两周 MVP 里程碑
- `docs/Security-baseline.md`：安全基线与防护要求
- `specs/import-config-spec.md`：Claudian 配置导入规范
- `src/`：后续插件源码目录

## 首版非目标
- 不做 Chrome 扩展联动
- 不追求移动端

## 开发启动
1. `cd <project-root>`
2. `npm install`
3. `npm run dev`

## 模型优先级
1. 默认优先调用本地 `codex exec`（可在设置中关闭）
2. 本地 CLI 不可用/失败时自动回退到 OpenAI API

## Obsidian 加载
1. 将项目目录软链接或复制到你的 vault 插件目录：`.obsidian/plugins/maxcode`
2. 确保 `manifest.json`、`main.js`、`styles.css` 在插件目录中
3. 在 Obsidian 的社区插件里启用 `MaxCode`

## 可用命令
- `MaxCode: Open chat view`
- `MaxCode: Ask MaxCode with selected text`
- `MaxCode: Inline edit selection`
- `MaxCode: Import Claudian config (JSON)`
- `MaxCode: Run agent with selected text`

## 聊天工具命令
- `/agent <task>`
- `/read <relative-path>`
- `/search <query>`
- `/write <relative-path> ::: <content>`
- `/bash <allowed-command>`
- `/mcp-list`
- `/mcp-tools <server-name>`
- `/mcp-call <server-name> <tool-name> ::: <json-args>`
- `/audit-last [count]`

## Agent 行为
- `/agent` 使用 OpenAI 原生 function tool-calling 自动调度工具
- 默认最多 8 步工具循环
- 启动 `/agent` 时可选审批策略：逐次审批 / 本轮全部批准 / 取消
- 每步工具调用仍受 `safe/plan/yolo` 审批策略约束
- 聊天消息中会显示工具调用时间线（tool_call/tool_result/status）

## 审计日志
- 工具调用会记录本地审计日志（ok/denied/error）
- 用 `/audit-last 50` 查看最近 50 条

## MCP 配置示例
```json
{
  "servers": [
    {
      "name": "local-mcp",
      "type": "stdio",
      "command": "/absolute/path/to/mcp-server",
      "args": ["--mode", "stdio"]
    },
    {
      "name": "remote-http-mcp",
      "type": "http",
      "url": "https://mcp.example.com/rpc"
    },
    {
      "name": "remote-sse-mcp",
      "type": "sse",
      "url": "https://mcp.example.com/sse"
    }
  ]
}
```

- `http`：按 JSON-RPC POST 调用
- `sse`：先订阅 SSE 拿 endpoint，再 POST JSON-RPC

## 安全行为
- `safe`：高风险操作（`/write`、`/bash`）弹审批
- `plan`：所有工具调用都弹审批
- `yolo`：不弹审批（不建议默认使用）
- `safe/plan` 下写文件会先显示行级 diff 预览，确认后才会落盘
- 如果 `/agent` 选择“本轮全部批准”，该轮写入将跳过逐次 diff 弹窗
