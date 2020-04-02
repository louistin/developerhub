# Windows FAQ

## 1. Windows 系统

## 2. 浏览器
###  Chrome
* Chrome 字体美化
    1. 安装 [Stylus](https://link.zhihu.com/?target=https%3A//chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne%3Fhl%3Dzh)
    2. 安装 [全局思源黑体](https://userstyles.org/styles/123597/theme)

###  Firefox

## 3. IDE
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

## 4. 其他