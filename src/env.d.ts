declare interface Window {
  __TAURI_IPC__?: unknown
  showDirectoryPicker(): Promise<FileSystemDirectoryHandle>
}

declare module '*.css'
