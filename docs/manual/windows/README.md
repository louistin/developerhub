# Windows 环境配置指南

> <p align="left" style="font-family:Arial;font-size:80%;color:#C0C0C0">全文字数 {{ $page.readingTime.words}} words &nbsp;|&nbsp; 阅读时间 {{Math.ceil($page.readingTime.minutes)}} mins</p>

[[TOC]]

---

## 操作系统

## 软件配置

###  Chrome
* Chrome 字体美化
    1. 安装 [Stylus](https://link.zhihu.com/?target=https%3A//chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne%3Fhl%3Dzh)
    2. 安装 [全局思源黑体](https://userstyles.org/styles/123597/theme)

###  Firefox

### Visual Studio Code
* Settings

    ```json
    {
        "C_Cpp.updateChannel": "Insiders",
        "workbench.colorTheme": "Solarized Dark",
        "editor.fontFamily": "'Fira Code Retina', 'Sarasa Term SC Regular'",
        "editor.fontSize": 16,
        "editor.rulers": [
            80,
            120
        ],
        "editor.minimap.enabled": false,
        "editor.renderControlCharacters": true,
        "editor.renderWhitespace": "all",
        "files.trimTrailingWhitespace": true,   // 清除行尾空格
        "files.eol": "\n"   // 默认换行符LF
    }
    ```

* 快捷键
    ```bash
    Alt + -> : 跳转
    Alt + <- : 后退
    Ctrl + Q + Explorer : 左下角显示函数列表
    ```

* 其他修改
    - 注释取消斜体
        `Microsoft VS Code\resources\app\extensions\theme-solarized-dark\themes`
        打开 `solarized-dark-color-theme`, 将 `comment` 的 `italic` 删除为空

### Git

```bash
# 解决 github 上传代码换行符自动转换问题, 使用 UNIX 标准 LF 为换行符
# 设置不自动转换
git config --global core.autocrlf false
# 添加换行符检查, 提交时发现混用禁止提交
git config --global core.safecrlf true
```
