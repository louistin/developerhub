module.exports = {
    title: '开发手册',
    description: '源于积累 服务开发',
    head: [
        ['link', { rel: 'icon', href: '/image/chrome.png' }]
    ],
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
                    },

                ]
            },
            {
                text: '操作系统',
                items: [
                    { text: 'Linux', link: '/os/linux/' },
                    { text: 'Windows', link: '/os/windows/' }
                ]
            },
            {
                text: '网络编程',
                items: [
                    { text: 'Socket', link: '/network/socket/' },
                    { text: 'TCP/IP', link: '/network/tcp-ip/' },
                    { text: 'HTTP', link: '/network/http/' }
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
                ]
            },
            {
                text: '开源软件',
                items: [
                    { text: 'Nginx', link: '/opensource/nginx/' },
                    { text: 'Libevent', link: '/opensource/libevent/' },
                    { text: 'Redis', link: '/opensource/redis/' }
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
                "Supervisor FAQ"
            ],
            '/os/': [
                {
                    title: 'Linux', 
                    collapsable: true,
                    children: [
                        '/os/linux/' // 你的md文件地址
                    ]
                },
                {
                    title: 'Windows', 
                    collapsable: true,
                    children: [
                        "/os/windows/Windows FAQ" // 你的md文件地址
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