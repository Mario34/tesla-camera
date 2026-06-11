# Tesla Camera Refactor Architecture

## 1. 项目概述 (Project Overview)

本项目旨在重构 Tesla Camera 查看器，从原有的 Fluent UI + React 18 架构迁移至现代化、高性能的技术栈。目标是提升应用性能（特别是文件扫描和视频播放）、优化开发体验，并引入更灵活的 UI 系统。

## 2. 技术栈 (Tech Stack)

| 模块 | 旧技术栈 | 新技术栈 | 选型理由 |
| :--- | :--- | :--- | :--- |
| **App Shell** | Tauri v1 | **Tauri v2** | 更好的插件系统、安全性及移动端支持潜力。 |
| **Frontend** | React 18 | **React 19** | 利用 React Compiler 自动优化，Use API 简化数据流。 |
| **Build Tool** | Rsbuild 0.5 | **Rsbuild 1.x** | 基于 Rspack 的极速构建，原生支持 React 19。 |
| **Styling** | Fluent UI / SASS | **TailwindCSS v4** | 原子化 CSS，构建产物更小，开发效率更高，不再依赖特定组件库。 |
| **State** | (Custom/Context) | **Zustand** | 轻量级状态管理，避免 Context 渲染地狱，适合跨组件状态共享。 |
| **Video/IO** | JS File System API | **Rust Native** | 将文件扫描、FFmpeg 调用下沉至 Rust 层，大幅提升 I/O 性能。 |

## 3. 核心架构设计 (Core Architecture)

采用 **"Rust Backend + Web Frontend"** 的分离架构，遵循 **Feature-based** 的目录结构。

### 3.1 目录结构 (Directory Structure)

```text
tesla-camera/
├── src-tauri/               # Rust 后端
│   ├── src/
│   │   ├── main.rs          # 入口
│   │   ├── commands/        # Tauri Commands (前端调用的接口)
│   │   │   ├── scan.rs      # 扫描 USB/文件夹
│   │   │   ├── export.rs    # 视频导出/合并逻辑
│   │   │   └── metadata.rs  # 解析 Tesla JSON 事件数据
│   │   ├── utils/           # 工具函数 (FFmpeg wrapper 等)
│   │   └── lib.rs
│   ├── tauri.conf.json
│   └── Cargo.toml
├── src/                     # React 前端
│   ├── app/                 # 全局布局、路由配置
│   ├── components/          # 通用基础组件 (Button, Modal 等 - 基于 Tailwind)
│   ├── features/            # 业务功能模块 (核心)
│   │   ├── dashboard/       # 概览页
│   │   ├── player/          # 播放器核心 (四路视频同步)
│   │   │   ├── components/  # 播放器专用组件
│   │   │   ├── hooks/       # useVideoSync 等逻辑
│   │   │   └── store.ts     # 播放状态管理
│   │   ├── library/         # 视频列表/文件管理
│   │   └── export/          # 导出任务管理
│   ├── hooks/               # 通用 Hooks (useTauriCommand 等)
│   ├── lib/                 # 工具库 (格式化时间、路径处理)
│   ├── stores/              # 全局状态 (设置、主题)
│   ├── main.tsx             # 入口
│   └── index.css            # Tailwind Directives
├── rsbuild.config.ts        # 构建配置
└── tailwind.config.ts       # 样式配置
```

### 3.2 数据流架构 (Data Flow)

#### 3.2.1 文件扫描 (File Scanning)

* **Old:** 前端通过 Web File System API 递归扫描，性能受限于浏览器线程。
* **New:**
    1. 前端调用 Tauri Command `scan_drive(path)`.
    2. Rust 在独立线程中使用 `WalkDir` 高效遍历目录。
    3. Rust 解析 `event.json` 和 `mp4` 文件关联。
    4. Rust 返回结构化的 `DriveContent` 对象给前端。
    5. **优势:** 避免前端界面卡顿，扫描速度提升 10x+。

#### 3.2.2 视频播放 (Video Playback)

* **核心挑战:** Tesla 包含 前/后/左/右 四路视频，需要同步播放。
* **方案:**
  * 使用 HTML5 `<video>` 标签，通过 `src="asset://..."` 协议直接加载本地文件。
  * React 19 自定义 Hook `useMultiVideoSync` 统一控制 `currentTime`。
  * 状态存储在 Zustand `usePlayerStore` 中 (playing, progress, speed)。

#### 3.2.3 导出处理 (Export/FFmpeg)

* **方案:**
  * Rust 侧集成 `ffmpeg-sidecar` 或直接调用系统 FFmpeg。
  * 前端发送导出指令 -> Rust 启动子进程 -> Rust 通过 Event 实时向前端推送进度 (Progress Payload)。

## 4. UI/UX 设计系统

抛弃 Fluent UI，使用 TailwindCSS 构建轻量级组件系统：

* **Dark Mode:** 默认深色模式 (适合车载/视频观看场景)。
* **Grid Layout:** 使用 CSS Grid 实现 2x2 视频布局 (Front, Back, Left, Right)。
* **Responsive:** 适配不同窗口大小，侧边栏可折叠。

## 5. 迁移计划 (Migration Plan)

### Phase 1: 环境搭建与基础重构

1. 初始化 Tauri v2 + Rsbuild + React 19 项目。
2. 配置 TailwindCSS。
3. 迁移核心 TypeScript 类型定义 (`model.ts`).

### Phase 2: Rust 核心能力建设

1. 实现 Rust 文件扫描逻辑 (替代 `fs-system.tsx`)。
2. 实现视频文件元数据解析。

### Phase 3: 前端组件重写

1. 实现 2x2 网格播放器组件。
2. 实现文件列表侧边栏。
3. 接入 Zustand 状态管理。

### Phase 4: 高级功能与优化

1. FFmpeg 导出功能迁移。
2. 性能优化与测试。
