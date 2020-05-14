# FFMPEG x265 Windows 编译
> OS: Windows 10 x64<br>
> VS: Visual Studio 2015 Enterprise

## 1. 下载 ffmpeg 源码
* `http://ffmpeg.org/download.html`

## 2. 下载安装 MinGW
* `https://sourceforge.net/projects/mingw/files/`
* 默认安装路径, 勾选选项
    - mingw-developer-toolkit
    - mingw32-base
    - mingw32-gcc-g++
    - msys-base

## 3. 下载 yasm pkg-config.exe libglib-2.0-0.dll
* `http://yasm.tortall.net/Download.html`
* 下载 `for general use on 32-bit Windows` 和 `for general use on 64-bit Windows`
* 将下载文件拷贝到 `C:\MinGW\msys\1.0\bin`
* 改名为 `yasm.exe`
    - 编译32位时, 修改 `yasm-1.3.0-win32.exe`
    - 编译64位时, 修改 `yasm-1.3.0-win64.exe`
* 将 pkg-config.exe libglib-2.0-0.dll 放到 `X:\Louis\Documents\Local\MinGW\bin` 目录中


## 4. 配置编译
* 配置 `配置C:\MinGW\msys\1.0\msys.bat`, 编辑器打开后, 在 `@echo off`之后, 加上一行
    - 32位, `call "C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\bin\vcvars32.bat"`
    - 64位, `call "C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\bin\amd64\vcvars64.bat"`
* 重命名 `C:\MinGW\msys\1.0\bin\link.exe`, 防止与VC冲突, 名字可以自己取
* 双击打开 `C:\MinGW\msys\1.0\msys.bat`
* 将第一步中的ffmpeg 源码解压到 `C:\MinGW\msys\1.0\home\Louis` (Louis换成你的用户名)
* 在CMD中定位到 `C:\MinGW\msys\1.0\home\Louis\ffmpeg`
* 配置
    - 32位, `./configure --enable-shared --disable-static –-enable-gpl –-enable-version3 --prefix=./build/x86 --enable-debug --toolchain=msvc`
    - 64位, `./configure --enable-shared --disable-static –-enable-gpl –-enable-version3 --prefix=./build/x64 --enable-debug --toolchain=msvc`
* 打开`config.h` 将含有中文的字符串修改为字母字符串(字母的就行)
* make all && make install (时间比较久)
* 检查 `C:\MinGW\msys\1.0\home\Louis\ffmpeg\build`中, 生成 include lib 等文件夹

## 5. 265 编译
* 准备工作
    - CMake 下载安装 `https://github.com/Kitware/CMake/releases/download/v3.17.0/cmake-3.17.0-win64-x64.msi`
    - nasm 下载安装 `https://www.nasm.us/pub/nasm/releasebuilds/2.14.02/win64/nasm-2.14.02-installer-x64.exe`
    - x265 源码下载 `http://ftp.videolan.org/pub/videolan/x265/x265_3.2.tar.gz`

* x265 编译
    - CMake 安装后, 打开CMake-gui 工具
    - Source 配置 `X:/Louis/Documents/Local/MinGW/msys/1.0/home/Louis/x265_3.2/source`
    - Build 配置 `X:/Louis/Documents/Local/MinGW/msys/1.0/home/Louis/x265_3.2/build`
    - Configure -> 选择 VS2015 / x64
    - NASM_EXECUTABLE 配置nasm 安装路径
    - Generate
    - Open Project
    - 在打开的VS 中 ALL_BUILD
    - 编译生成的可执行文件和动态库位于 `x265\build\Debug`

## 5. FFMPEG 编译支持 x265
* 配置 (X:\Louis\Documents\Local\MinGW\msys\1.0)
    - 拷贝x265编译结果中的libx265.lib和x265-static.lib至/local/lib文件夹下。并复制libx265.lib为x265.lib
    - 拷贝x265.h和x265_config.h至/local/include文件夹下
    - 拷贝libx265.dll和x265.exe至/local/bin文件夹下
    - /local/lib/pkgconfig 创建 x265.pc
        ```
        prefix=/local/
        exec_prefix=${prefix}
        libdir=${exec_prefix}/lib
        includedir=${prefix}/include

        Name: x265
        Description: H.265/HEVC video encoder
        Version: 2.8
        Libs: -L${libdir} -lx265
        Libs.private: -lstdc++ -lm -lrt -ldl -lpthread
        Cflags: -I${includedir}
        ```
* 编译安装
    - export PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/local/lib/pkgconfig
    - 执行pkg-config --list-all确保已经正确查找到x265
    - `./configure --enable-shared --disable-static –-enable-gpl –-enable-version3 --enable-libx265 --prefix=./build/x64 --enable-debug --toolchain=msvc`
    - make -j4 && make install

* Tips
    - 动态库静态库必须分开编译
    - x265 更高版本没测试成功
    - ./configure 失败可以去 ffbuild/config.log 中查看

## 参考链接
```
https://blog.csdn.net/yinchao163/article/details/82625544
https://blog.csdn.net/smallhujiu/article/details/80747568
https://blog.csdn.net/smallhujiu/article/details/80753765
https://www.nasm.us/pub/nasm/releasebuilds/2.14.02/win64/
https://kelvin.mbioq.com/install-pkgconfig-mingwmsys.html
```


