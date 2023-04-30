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
  src_f: FileSystemHandle
  src_b: FileSystemHandle
  src_r: FileSystemHandle
  src_l: FileSystemHandle
}

export interface Video {
  title: string
  time: number
  type: TypeEnum
  src_f: string
  src_b: string
  src_r: string
  src_l: string
}

export interface ModelState {
  type: TypeEnum
  current?: Video
  list: OriginVideo[]
}
