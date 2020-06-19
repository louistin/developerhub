module.exports = {
    title: '🔞の領域',
    description: '　我们立足于美利坚合众国, 针对年满18周岁非大陆全球华人开发, 受北美法律保护.　 　　　　　　　　　　　　　未經授權禁止复制或建立镜像. 　　　　　　　　　　　　We are based in the United States of America, for over 18 years of age non-mainland Chinese open world, by the North American legal protection. Unauthorized reproduction prohibited or create mirror.',
    head: [
        ['link', { rel: 'icon', href: '/image/favicon.png' }]
    ],
    port: 2560,
    base: '/',
    markdown: {
        lineNumbers: true,  // 代码块显示行号
        toc: true           // markdown 支持 TOC
    },
    themeConfig: {
        nav: [
            { text: '主页', link: '/' },
            { text: '计算机基础', link: '/cs/' },
            { text: '网络编程', link: '/network/' },
            { text: '后端开发', link: '/server/' },
            { text: '前端开发', link: '/web/' },
            { text: '开源软件', link: '/opensource/' },
            { text: '读书笔记', link: '/note/' },
            { text: '开发手册', link: '/manual/' },
            { text: '关于', link: '/about/' }
        ],
        sidebar: {
            '/cs/': [
                {
                    title: '数据结构与算法',
                    collapsable: true,
                    children: [
                        "/cs/dsa/数据结构与算法"
                    ]
                },
                {
                    title: '设计模式',
                    collapsable: true,
                    children: [
                        "/cs/design-pattern/Reactor 反应堆模式"
                    ]
                },
                {
                    title: '数据库',
                    collapsable: true,
                    children: [
                        "/cs/database/MySQL 手册"
                    ]
                },

                // {
                //     title: 'C/C++',
                //     collapsable: true,
                //     children: [
                //         "/cs/c-cpp/"
                //     ]
                // },
                // {
                //     title: 'Go',
                //     collapsable: true,
                //     children: [
                //         "/cs/go/"
                //     ]
                // }
            ],

            '/network': [
                {
                    title: 'TCP/IP',
                    collapsable: true,
                    children: [
                        "/network/tcp-ip/TCP 协议",
                        "/network/tcp-ip/UDP 协议",
                        "/network/tcp-ip/DNS 协议",
                    ]
                },
                {
                    title: 'Socket API',
                    collapsable: true,
                    children: [
                        "/network/socket-api/epoll 详解"
                    ]
                },
                {
                    title: 'IPC',
                    collapsable: true,
                    children: [
                    ]
                }
            ],

            '/web/': [
                // {
                //     title: 'JavaScript',
                //     collapsable: true,
                //     children: [
                //         "/web/javascript/"
                //     ]
                // },
                // {
                //     title: 'HTML',
                //     collapsable: true,
                //     children: [
                //         "/web/html/"
                //     ]
                // },
                // {
                //     title: 'CSS',
                //     collapsable: true,
                //     children: [
                //         "/web/css/"
                //     ]
                // },
                {
                    title: 'FAQ',
                    collapsable: true,
                    children: [
                        "/web/faq/HTTP 跨域处理"
                    ]
                }
            ],

            '/opensource': [
                // {
                //     title: 'Nginx',
                //     collapsable: true,
                //     children: [
                //         "/opensource/nginx/"
                //     ]
                // },
                // {
                //     title: 'Lievent',
                //     collapsable: true,
                //     children: [
                //         "/opensource/libevent/"
                //     ]
                // },
                // {
                //     title: 'Redis',
                //     collapsable: true,
                //     children: [
                //         "/opensource/redis/"
                //     ]
                // },
                {
                    title: 'Others',
                    collapsable: true,
                    children: [
                        "/opensource/others/Easylogger Linux 平台静态库编译"
                    ]
                }
            ],

            '/note/': [
                "",
                "Linux-UNIX 系统编程手册",
                "UNIX-LINUX 编程实践教程",
                "TCP-IP 详解",
                "MySQL 必知必会",
                "第一本 Docker 书",
            ],

            '/manual/': [
                {
                    title: 'Windows 开发环境',
                    collapsable: true,
                    children: [
                        "/manual/windows/Windows 环境配置指南",
                        "/manual/windows/FFMPEG x265 Windows 编译"
                    ]
                },
                {
                    title: 'Linux 开发环境',
                    collapsable: true,
                    children: [
                        "/manual/linux/CentOS 最小化配置安装",
                        "/manual/linux/Fedora Workstation 安装指南",
                        "/manual/linux/RHEL 8 前端开发环境搭建指南",
                        "/manual/linux/CentOS dokuwiki 安装指南",
                        "/manual/linux/网站自动化布署",
                        "/manual/linux/cms 布署文档",
                        "/manual/linux/Nginx 配置手册",
                        "/manual/linux/SpringBoot + Vue FAQ",
                        "/manual/linux/Supervisor FAQ",
                        "/manual/linux/Linux 服务器安全管理指南"
                    ]
                },
                {
                    title: '开发杂谈',
                    collapsable: true,
                    children: [
                        "/manual/discuz/开发技能树",
                        "/manual/discuz/2020 书单"
                    ]
                }
            ],

            '/about/': [
                ""
            ]
        },

        sidebarDepth: 1,
        // 页面滚动
        smoothScroll: true,
        // 文档更新时间：每个文件git最后提交的时间,
        lastUpdated: '最近更新',
        displayAllHeaders: false, // 默认值：false
        // GitHub repo 路径
        repo: 'https://github.com/louistin/blog.liteman.git',
        // 自定义仓库链接文字。默认从 `blog.liteman.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        repoLabel: 'GitHub',
        // 以下为可选的编辑链接选项
        // 假如你的文档仓库和项目本身不在一个仓库：
        docsRepo: 'https://github.com/louistin/blog.liteman',
        // 假如文档不是放在仓库的根目录下：
        docsDir: 'docs',
        // 假如文档放在一个特定的分支下：
        docsBranch: 'master',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: '在 GitHub 上编辑此页'
    },
    plugins: [
        'vuepress-plugin-reading-time',
        'vuepress-plugin-reading-progress',
        '@vuepress/back-to-top',
        'vuepress-plugin-code-copy',
        ['@vuepress/last-updated', {
            transformer: (timestamp, lang) => {
                const date = new Date(timestamp);
                const dateNumFun = (num) => num < 10 ? `0${num}` : num;
                const [Y, M, D, h, m, s] = [
                    date.getFullYear(),
                    dateNumFun(date.getMonth() + 1),
                    dateNumFun(date.getDate()),
                    dateNumFun(date.getHours()),
                    dateNumFun(date.getMinutes()),
                    dateNumFun(date.getSeconds())
                ];

                return `${Y}-${M}-${D} ${h}:${m}:${s} UTC+08:00`;
            }
        }],
        //'vuepress-plugin-seo',
        // 页面滚动时自动激活侧边栏
        ['@vuepress/active-header-links', {
            sidebarLinkSelector: '.sidebar-link',
            headerAnchorSelector: '.header-anchor'
        }],
        // [ '@vuepress/pwa', {
        //       serviceWorker: true,
        //       updatePopup: {
        //         message: '当前网站内容已更新!',
        //         buttonText: '刷新'
        //       }
        //     }
        // ]
    ]
};
