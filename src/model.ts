export enum TypeEnum {
  '所有',
  '事件',
  '哨兵',
  '行车记录仪'
}

export enum CameraEnum {
  '前',
  '后',
  '左',
  '右'
}

export enum ExportStatusEnum {
  进行中,
  导出成功,
  导出失败
}

export interface ExportTaskType {
  path: string
  name: string
  exportDir: string
  status: number
  log: string[]
}

export interface FileData {
  get(): Promise<{ url: string; name: string }>
  name?: string
  path?: string
}

export interface OriginVideo {
  title: string
  time: number
  type: TypeEnum
  dir: string
  src_f: FileData
  src_b: FileData
  src_r: FileData
  src_l: FileData
  event?: number
}

export interface OriginFSVideo {
  title: string
  time: number
  type: TypeEnum
  src_f: string
  src_b: string
  src_r: string
  src_l: string
}

export interface Video {
  title: string
  time: number
  type: TypeEnum
  dir: string
  src_f: string
  src_f_name: string
  src_b: string
  src_b_name: string
  src_r: string
  src_r_name: string
  src_l: string
  src_l_name: string
}

export interface TauriVideo extends Video {
  src_f_path: string
  src_b_path: string
  src_r_path: string
  src_l_path: string
}

export interface ModelState {
  type: TypeEnum
  current?: Video
  list: OriginVideo[]
  events: VideoFile[]
}

export interface VideoFile {
  fs: FileSystemFileHandle
  path: string
  dir: string
}

export interface EventJson {
  timestamp: string
  city: string
  est_lat: string
  est_lon: string
  reason: string
  camera: string
}

export interface TauriFile {
  name: string
  path: string
  children?: TauriFile[]
}
