import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

import Groups from './views/users/groups.vue'
import Users from './views/users/users.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-television',
        leaf: true,//只有一个节点
        redirect: '/main',
        children: [
            { path: '/main', component: Main, name: '主页' }
        ]
    },
    {
        path: '/member',
        component: Home,
        name: '用户管理',
        // hidden: true, 引藏路由
        iconCls: 'fa fa-id-card-o',//图标样式class
        children: [
            { path: '/member/user', component: Users, name: '用户'},
            { path: '/member/group', component: Groups, name: '用户组' }
        ]
    },
    {
        path: '/daohang1',
        component: Home,
        name: '导航一',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/daohang1/table', component: Table, name: 'Table' },
            { path: '/daohang1/form', component: Form, name: 'Form' },
            { path: '/daohang1/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/daohang2',
        component: Home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/daohang2/page4', component: Page4, name: '页面4' },
            { path: '/daohang2/page5', component: Page5, name: '页面5' }
        ]
    },
    {
        path: '/daohang3',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/daohang3/page6', component: Page6, name: '导航三' }
        ]
    },
    {
        path: '/daohang4',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/daohang4/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;