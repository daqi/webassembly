# 使用OpenCV在前端进行人脸检测的实践

## 运行

```bash
yarn global add http-server
http-server
```

## 构建过程

### 安装Emscripten SDK
```bash
git clone https://github.com/juj/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

### 获取OpenCV
```bash
wget https://github.com/opencv/opencv/archive/3.4.1.zip
unzip 3.4.1.zip
cd opencv-3.4.1
# 将OpenCV编译为WASM版本
python ./platform/js/build_js.py build_wasm --build_wasm

# 编译后的文件将生成在build_wasm/bin目录内,得到需要的opencv_js.wasm和opencv.js文件
```
