# Agents 设计与初始化

本文件定义基于 Tauri + Rsbuild + React 19 + TailwindCSS 的多代理协作架构，用于指导后续模块化开发与联调。

## 总体原则

- 边界清晰：前端负责交互与状态编排，后端负责高性能 I/O 与系统能力。
- 契约优先：所有跨层通信通过 Tauri Command/Event，采用稳定的 JSON Payload 契约。
- 可观测性：统一日志标签与错误码，关键流程必须可追踪、可重试。
- 渐进迁移：优先复用现有能力，逐步替换低效实现。

## 通信模型与数据契约

- 通信通道：
  - Commands：前端调用后端（请求-响应）。
  - Events：后端向前端推送（进度、状态变更）。
- 命名规范：
  - Command：`scan_drive`, `get_metadata`, `start_export`, `cancel_export`
  - Event：`export:progress`, `export:done`, `export:error`
- 基本数据结构（简化版）：

```json
// ScanDriveRequest
{ "path": "string" }

// ScanDriveResponse
{
  "videos": [
    {
      "title": "string",
      "time": 1710000000,
      "type": 0,
      "dir": "string",
      "src_f": "file:///path/front.mp4",
      "src_b": "file:///path/back.mp4",
      "src_l": "file:///path/left.mp4",
      "src_r": "file:///path/right.mp4"
    }
  ],
  "events": [
    { "timestamp": "2024-01-01T00:00:00Z", "reason": "string", "camera": "F" }
  ]
}

// StartExportRequest
{
  "name": "string",
  "exportDir": "string",
  "files": [
    { "path": "string", "camera": "F|B|L|R" }
  ]
}

// ExportProgressEvent
{ "taskId": "string", "progress": 0.42, "duration": 123.4, "message": "string" }
```

## 前端 Agents

- UI Agent（App/Layout/Route）
  - 职责：路由与布局、主题与国际化、全局错误边界。
  - 输入：扫描结果、导出状态、用户交互事件。
  - 输出：Command 调用、状态更新、通知。
- Player Agent（多路视频同步）
  - 职责：四路视频同步播放（F/B/L/R）、倍速与进度控制、时间轴对齐。
  - 形态：`features/player` 内的组件 + `useMultiVideoSync` Hook + `usePlayerStore` 状态。
  - 交互：消费扫描数据；订阅导出进度以提示占用。
- Library Agent（媒体库）
  - 职责：文件列表、筛选与搜索、事件关联展示。
  - 交互：触发扫描；选择视频进入播放器。
- Export Agent（导出编排）
  - 职责：构建导出任务、启动/取消导出、接收进度事件、错误处理与重试。
  - 交互：调用后端 FFmpeg 能力；产出用户可见的任务日志。
- Settings Agent（设置中心）
  - 职责：持久化偏好（导出目录、主题、倍速默认值）、检查更新。

## 后端 Agents（Rust/Tauri）

- Scan Agent
  - Command：`scan_drive(path: String) -> ScanDriveResponse`
  - 技术：`walkdir` 并行遍历，按 Tesla 目录规范聚合 F/B/L/R。
- Metadata Agent
  - Command：`get_metadata(dir: String) -> Event[]`
  - 技术：解析 `event.json`，校验与视频时间戳对齐。
- FFmpeg Agent
  - Command：`start_export(req: StartExportRequest) -> { taskId }`
  - Event：`export:progress`, `export:done`, `export:error`
  - 技术：`ffmpeg`/`ffmpeg-sidecar` 子进程；统一日志与错误码。
- Updater Agent
  - Command：`check_update() -> { version, notes }`
  - 备注：可复用 Tauri 内置 updater。

## 命令与事件目录（初始版）

- Commands
  - `scan_drive`：输入目录路径；返回视频聚合与事件。
  - `get_metadata`：输入视频根目录；返回事件数组。
  - `start_export`：输入任务定义；返回任务 ID。
  - `cancel_export`：输入任务 ID；终止导出。
- Events
  - `export:progress`：携带进度、耗时、阶段消息。
  - `export:done`：输出产物路径、统计信息。
  - `export:error`：错误码、可读信息、建议操作。

## 目录映射（建议）

- 前端
  - `src/app`：应用外层（布局/路由/错误边界）
  - `src/features/player`：播放器相关
  - `src/features/library`：媒体库
  - `src/features/export`：导出任务
  - `src/stores`：Zustand 全局与功能状态
  - `src/hooks/useTauriCommand.ts`：统一命令封装
- 后端
  - `src-tauri/src/commands/scan.rs`
  - `src-tauri/src/commands/metadata.rs`
  - `src-tauri/src/commands/export.rs`
  - `src-tauri/src/utils/ffmpeg.rs`

## 开发工作流（约定）

- 本地运行：`pnpm app:dev`（同时启动 Rsbuild 与 Tauri）
- 前端调用约定：统一封装 `invoke<T>(command, payload)`；错误走集中处理。
- 事件订阅：导出流程使用单例事件总线；按 `taskId` 路由到组件。
- 测试策略：前端组件测试 + 后端命令集成测试；导出流程使用小样本视频。

## 安全与错误处理

- 路径与协议：仅允许在用户选择的根目录下扫描；本地文件走 `asset://`/`file://`。
- 资源释放：子进程与文件句柄必须释放；取消导出需要清理临时文件。
- 错误码规范：`SCAN_xxx`、`META_xxx`、`EXPT_xxx`；前端根据错误码给出可操作建议。

## 命名与风格约定

- TypeScript：类型以 `*Type`/`*Props` 结尾；状态 Store 以 `use*Store` 命名。
- Rust：模块化 commands；返回统一 `Result<T, AppError>`；日志前缀使用 Agent 名称。
- 事件：`namespace:action` 格式；payload 必含 `taskId`（如适用）。

## 里程碑与验证

- M1：`scan_drive`/`get_metadata` 可用；Library 页面展示。
- M2：播放器四路同步；基本控制条。
- M3：`start_export` 进度联通；导出产物可验证。
