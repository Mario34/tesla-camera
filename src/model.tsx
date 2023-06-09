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

export interface OriginVideo {
  title: string
  time: number
  type: TypeEnum
  dir: string
  src_f: FileSystemFileHandle
  src_b: FileSystemFileHandle
  src_r: FileSystemFileHandle
  src_l: FileSystemFileHandle
  event?: number
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
