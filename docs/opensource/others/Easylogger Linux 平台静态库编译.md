# Easylogger Linux 平台静态库编译

## 0. 前言
* 封装 Easylogger Linux 平台静态库, 方便后面使用.

## 1. 准备工作
* 下载源码

## 2. 封装方法
* 将 demo 中 linux 部分的代码移动到主目录 easylogger 中
* 创建编译 Makefile
    ```makefile
    CC = cc
    AR = ar

    ROOTPATH=./
    INCLUDE = -I./easylogger/inc  -I./easylogger/plugins/
    LIB=-lpthread

    OBJ += $(patsubst %.c, %.o, $(wildcard *.c))
    OBJ += $(patsubst %.c, %.o, $(wildcard easylogger/src/*.c))
    OBJ += $(patsubst %.c, %.o, $(wildcard easylogger/plugins/file/elog_file.c))
    OBJ += $(patsubst %.c, %.o, $(wildcard easylogger/port/*.c))
    OBJ += $(patsubst %.c, %.o, $(wildcard easylogger/plugins/file/*.c))

    CFLAGS = -O0 -g3 -Wall
    target = libeasylogger.a

    all:$(OBJ)
        $(AR) -crv $(target) out/*.o
        mv $(target) out
    %.o:%.c
        $(CC) $(CFLAGS) -c $< -o $@ $(INCLUDE)
        mv $@ out
    clean:
        rm -rf out/*
    ```
* 修改 elog.c 源码, 主要改动点为两个:
    * 调整输出模式
    * 重新添加一个 init 函数, 以后使用直接初始化

## FAQ