module.exports = {
    title: 'LiteMan',
    description: '技术博客平台',
    head: [
        ['link', { rel: 'icon', href: '/image/liteman.gif' }]
    ],
    base: '/blog/',
    markdown: {
        lineNumbers: true // 代码块显示行号
    },
    themeConfig: {
        nav: [
            { text: 'Main', link: '/' },
            { text: 'C/CPP', link: '/cpp/' },
            { text: 'Linux', link: '/linux/' },
            { text: 'Web', link: '/web/' },
            { text: 'Network', link: '/network/' },
            { text: 'About', link: '/about/' }
        ],
        sidebar: {
            '/cpp/': [
                "",
                "user",
                "device"
            ],
            '/linux/': [
                "",
                "user",
                "device"
            ],
            '/web/': [
                "",
                "user",
                "device"
            ],
            '/network/': [
                "",
                "user",
                "device"
            ],
        },
        sidebarDepth: 3,
        lastUpdated: 'Last Updated',
    },
};