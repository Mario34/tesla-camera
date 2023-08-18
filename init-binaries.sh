curl -L https://github.com/Mario34/tesla-camera/releases/download/v1.0.0-pre/ffmpeg.zip >> ./src-tauri/binaries/ffmpeg.zip

unzip -o ./src-tauri/binaries/ffmpeg.zip -d ./src-tauri/binaries/

cp -f ./src-tauri/binaries/ffmpeg ./src-tauri/binaries/ffmpeg-aarch64-apple-darwin
cp -f ./src-tauri/binaries/ffmpeg ./src-tauri/binaries/ffmpeg-x86_64-apple-darwin
cp -f ./src-tauri/binaries/ffmpeg.exe ./src-tauri/binaries/ffmpeg-x86_64-pc-windows-msvc.exe