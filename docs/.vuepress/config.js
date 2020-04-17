module.exports = {
    title: '开发手册',
    description: '源于积累 服务开发',
    head: [
        ['link', { rel: 'icon', href: '/image/chrome.png' }]
    ],
    port: 2560,
    base: '/blog/',
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        nav: [
            { text: '主页', link: '/' },
            { text: '工作手册', link: '/manual/' },
            {
                text: '计算机基础',
                items: [
                    {
                        text: '数据结构',
                        link: '/cs/data-structure/'
                    },
                    {
                        text: '算法',
                        link: '/cs/algorithm/'
                    },
                    {
                        text: '设计模式',
                        link: '/cs/design-pattern/'
                    },
                    {
                        text: '编程语言',
                        items: [
                            { text: 'C', link: '/cs/language/c/' },
                            { text: 'C++', link: '/cs/language/cpp/' },
                            { text: 'Java', link: '/cs/language/java/' },
                            { text: 'Shell', link: '/cs/language/shell/' },
                            { text: 'Lua', link: '/cs/language/lua/' }
                        ]
                    }
                ]
            },
            {
                text: '操作系统',
                items: [
                    { text: 'Linux', link: '/os/linux/' },
                    { text: 'Windows', link: '/os/windows/' },
                    {
                        text: '读书笔记',
                        items: [
                            { text: 'UNIX 环境高级编程', link: '/os/note/apue/' },
                            { text: 'UNIX-LINUX 编程实践教程', link: '/os/note/uulp/' }
                        ]
                    }
                ]
            },
            {
                text: '网络编程',
                items: [
                    { text: 'Socket', link: '/network/socket/' },
                    { text: 'TCP/IP', link: '/network/tcpip/' },
                    { text: 'HTTP', link: '/network/http/' },
                    {
                        text: '读书笔记',
                        items: [
                            { text: 'TCP/IP 详解', link: '/network/note/tcpip-illustrated/' }
                        ]
                    }
                ]
            },
            { text: '后端开发', link: '/server/' },
            {
                text: '前端开发',
                items: [
                    { text: 'JavaScript', link: '/web/javascript/' },
                    { text: 'HTML', link: '/web/html/' },
                    { text: 'CSS', link: '/web/css/' },
                    { text: 'Vue', link: '/web/vue/' },
                    { text: 'FAQ', link: '/web/faq/' },
                ]
            },
            {
                text: '开源软件',
                items: [
                    { text: 'Nginx', link: '/opensource/nginx/' },
                    { text: 'Libevent', link: '/opensource/libevent/' },
                    { text: 'Redis', link: '/opensource/redis/' },
                    { text: 'Others', link: '/opensource/others/' }
                ]
            },
            {
                text: '开发杂谈',  link: '/discuz/'
            },
            {
                text: '关于', link: '/about/'
            }
        ],
        sidebar: {
            '/manual/': [
                "",
                "RHEL 8 前端开发环境搭建指南",
                "网站自动化布署",
                "MySQL手册",
                "CentOS dokuwiki 安装指南",
                "CentOS 最小化安装配置",
                "cms 布署文档",
                "FFMPEG x265 Windows 编译",
                "SpringBoot + Vue FAQ",
                "Supervisor FAQ",
                "Nginx 配置手册"
            ],
            '/os': [
                {
                    title: 'Linux',
                    collapsable: true,
                    children: [
                        "/os/linux/"
                    ]
                },
                {
                    title: 'Windows',
                    collapsable: true,
                    children: [
                        "/os/windows/",
                        "/os/windows/Windows FAQ" // 你的md文件地址
                    ]
                },
                {
                    title: 'UNIX 环境高级编程',
                    collapsable: true,
                    children: [
                        "/os/note/apue/",
                        "/os/note/apue/01 UNIX 基础知识",
                        "/os/note/apue/02 UNIX 标准与实现",
                        "/os/note/apue/03 文件IO",
                        "/os/note/apue/04 文件与目录",
                        "/os/note/apue/05 标准IO库",
                        "/os/note/apue/06 系统数据文件和信息",
                        "/os/note/apue/07 进程环境",
                        "/os/note/apue/08 进程控制",
                        "/os/note/apue/09 进程关系",
                        "/os/note/apue/10 信号",
                        "/os/note/apue/11 线程",
                        "/os/note/apue/12 线程控制",
                        "/os/note/apue/13 守护进程",
                        "/os/note/apue/14 高级IO",
                        "/os/note/apue/15 进程间通信",
                        "/os/note/apue/16 网络IPC套接字",
                        "/os/note/apue/17 高级进程间通信",
                        "/os/note/apue/18 终端IO",
                        "/os/note/apue/19 伪终端",
                        "/os/note/apue/20 数据库函数",
                        "/os/note/apue/21 与网络打印机通信"
                    ]
                },
                {
                    title: 'UNIX-LINUX 编程实践教程',
                    collapsable: true,
                    children: [
                        "/os/note/uulp/",
                        "/os/note/uulp/01 Unix 系统编程概述",
                        "/os/note/uulp/02 用户 文件操作与联机帮助 - 编写 who 命令"
                    ]
                }
            ],
            '/web/': [
                {
                    title: 'JavaScript',
                    collapsable: true,
                    children: [
                        "/web/javascript/"
                    ]
                },
                {
                    title: 'HTML',
                    collapsable: true,
                    children: [
                        "/web/html/"
                    ]
                },
                {
                    title: 'CSS',
                    collapsable: true,
                    children: [
                        "/web/css/"
                    ]
                },
                {
                    title: 'FAQ',
                    collapsable: true,
                    children: [
                        "/web/faq/",
                        "/web/faq/HTTP 跨域处理"
                    ]
                }
            ],
            '/opensource': [
                {
                    title: 'Nginx',
                    collapsable: true,
                    children: [
                        "/opensource/nginx/"
                    ]
                },
                {
                    title: 'Lievent',
                    collapsable: true,
                    children: [
                        "/opensource/libevent/"
                    ]
                },
                {
                    title: 'Redis',
                    collapsable: true,
                    children: [
                        "/opensource/redis/"
                    ]
                },
                {
                    title: 'Others',
                    collapsable: true,
                    children: [
                        "/opensource/others/",
                        "/opensource/others/Easylogger Linux 平台静态库编译"
                    ]
                }
            ],
            '/discuz/': [
                "",
                "开发技能树",
                "2020 书单"
            ],
            '/network': [
                {
                    title: 'TCP/IP',
                    collapsable: true,
                    children: [
                        "/network/tcpip/",
                        "/network/tcpip/TCP 协议",
                        "/network/tcpip/UDP 协议",
                        "/network/tcpip/DNS 协议"
                    ]
                },
                {
                    title: 'Socket',
                    collapsable: true,
                    children: [
                        "/network/socket/"
                    ]
                },
                {
                    title: 'HTTP',
                    collapsable: true,
                    children: [
                        "/network/http/"
                    ]
                },
                {
                    title: 'TCP/IP 详解',
                    collapsable: true,
                    children: [
                        "/network/note/tcpip-illustrated/",
                        "/network/note/tcpip-illustrated/01 概述",
                        "/network/note/tcpip-illustrated/02 链路层",
                        "/network/note/tcpip-illustrated/03 IP 网际协议",
                        "/network/note/tcpip-illustrated/04 ARP 地址解析协议",
                        "/network/note/tcpip-illustrated/05 RARP 逆地址解析协议",
                        "/network/note/tcpip-illustrated/06 ICMP Internet 控制报文协议",
                        "/network/note/tcpip-illustrated/07 Ping 程序",
                        "/network/note/tcpip-illustrated/08 Traceroute 程序",
                        "/network/note/tcpip-illustrated/09 IP 选路",
                        "/network/note/tcpip-illustrated/10 动态选路协议"
                    ]
                }
            ],
            '/about/': [
                ""
            ]

        },
        sidebarDepth: 3,
        lastUpdated: 'Last Updated',
    },
    plugins: [
        ['vuepress-plugin-reading-time'],
        ['vuepress-plugin-reading-progress'],
        ['@vuepress/back-to-top']
    ]
};