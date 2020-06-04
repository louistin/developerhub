# Fedora Workstation 安装指南
---
> <p align="left" style="font-family:Arial;font-size:80%;color:#C0C0C0">全文字数 {{ $page.readingTime.words}} words &nbsp;|&nbsp; 阅读时间 {{Math.ceil($page.readingTime.minutes)}} mins</p><br>
> 鉴于笔记本上安装的 CentOS 视觉上实在是感觉不舒服, 决定将笔记本系统更换为同源的 Fedora

[[TOC]]

---

## 系统配置
### SSD TRIM
* Fedora 32 已经默认启动 TRIM

  ```bash
  # 手动启用命令
  sudo systemctl enable fstrim.timer
  # 查看计时器任务
  sudo systemctl status fstrim.timer
  # 查看所有计时器任务
  sudo systemctl list-timers --all
  ```

## 应用配置

### Gnome Shell 配色

```bash
git clone git://github.com/seebi/dircolors-solarized.git
cp ~/dircolors-solarized/dircolors.256dark ~/.dircolors
eval 'dircolors .dircolors'
# 在 .bashrc 中添加
  export TERM=xterm-256color

git clone git://github.com/sigurdga/gnome-terminal-colors-solarized.git
./set_dark.sh

source .bashrc
```

## 参考文档
[在 Linux 下使用 fstrim 延长 SSD 驱动器的寿命](https://www.jqhtml.com/62931.html)<br>
[如何在 Linux 服务器的 SSD 存储配置周期性 TRIM](https://www.howtoing.com/how-to-configure-periodic-trim-for-ssd-storage-on-linux-servers/)<br>
