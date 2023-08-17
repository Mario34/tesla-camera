const fs = require('fs')
const path = require('path')
var got = require('got')
const decompress = require('decompress')

const ExternalBinariesSrc = 'https://github.com/Mario34/tauri-release-test/releases/download/v1.0.0/TeslaCamera_1.0.0_x64-setup.exe'
// const ExternalBinariesSrc = 'https://github.com/Mario34/tesla-camera/releases/download/untagged-644816aa3e0f45606ae1/ffmpeg.zip'
const BinariesPath = path.join(__dirname, '../src-tauri/binaries/')
const ZipPath = path.join(BinariesPath, 'ffmpeg.zip')
const ffmpegMac = path.join(BinariesPath, 'ffmpeg')
const ffmpegWin = path.join(BinariesPath, 'ffmpeg.exe')

async function main() {
  const res = await got.get(ExternalBinariesSrc, {
    headers: {
      Accept: 'application/octet-stream',
    },
  })

  console.log(res)
  // const download = wget.download(ExternalBinariesSrc, ZipPath)
  // download.on('error', (err) => {
  //   console.log(err)
  // })
  // download.on('end', async (output)=> {
  //   console.log(output)
  //   await decompress(ZipPath, BinariesPath)

  //   fs.copyFile(ffmpegMac, path.join(BinariesPath, 'ffmpeg-x86_64-apple-darwin'))
  //   fs.copyFile(ffmpegMac, path.join(BinariesPath, 'ffmpeg-aarch64-apple-darwin'))
  //   fs.copyFile(ffmpegMac, path.join(BinariesPath, 'ffmpeg-universal-apple-darwin'))

  //   fs.copyFile(ffmpegWin, path.join(BinariesPath, 'ffmpeg-x86_64-pc-windows-msvc.exe'))
  //   fs.copyFile(ffmpegWin, path.join(BinariesPath, 'ffmpeg-aarch64-pc-windows-msvc.exe'))
  //   fs.copyFile(ffmpegWin, path.join(BinariesPath, 'ffmpeg-i686-pc-windows-msvc.exe'))
  // })
  // download.on('progress', (progress)=> {
  //   console.log(progress)
  // })
}

main()
// curl https://evermeet.cx/ffmpeg/ffmpeg-6.0.zip >> src-tauri/binaries/ffmpeg-6.0.zip
// curl https://www.gyan.dev/ffmpeg/builds/packages/ffmpeg-5.1.2-essentials_build.zip >> src-tauri/binaries/ffmpeg-5.1.2-essentials_build.zip

// unzip src-tauri/binaries/ffmpeg-6.0.zip -d src-tauri/binaries/

// unzip src-tauri/binaries/ffmpeg-5.1.2-essentials_build.zip -d src-tauri/binaries/

// cp src-tauri/binaries/ffmpeg src-tauri/binaries/ffmpeg-aarch64-apple-darwin
// cp src-tauri/binaries/ffmpeg src-tauri/binaries/x86_64-apple-darwin
// cp src-tauri/binaries/ffmpeg src-tauri/binaries/universal-apple-darwin

// cp src-tauri/binaries/ffmpeg-5.1.2-essentials_build/bin/ffmpeg.exe src-tauri/binaries/ffmpeg-x86_64-pc-windows-msvc.exe
// cp src-tauri/binaries/ffmpeg-5.1.2-essentials_build/bin/ffmpeg.exe src-tauri/binaries/ffmpeg-aarch64-pc-windows-msvc.exe
// cp src-tauri/binaries/ffmpeg-5.1.2-essentials_build/bin/ffmpeg.exe src-tauri/binaries/ffmpeg-i686-pc-windows-msvc.exe
