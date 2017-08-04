import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/userManage/Table.vue'
import user from './views/userManage/user.vue'
import launchVote from './views/vote/launchVote.vue'
import voteList from './views/vote/voteList.vue'
import analyze from './views/vote/analyze.vue'
import manage from './views/vote/manage.vue'
import launchVote_mine from './views/vote/launchVote_mine.vue'
import buildingManege from './views/Building/buildingManage.vue'
import buildingList from './views/Building/buildingList.vue'
import committeeManage from './views/committee/committeeManage.vue'
import committeeList from './views/committee/committeeList.vue'
import myVote from './views/vote/myVote'

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
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'fa fa-id-card-o',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: '管理' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '投票',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/launchVote', component: launchVote, name: '发起投票' },
            {path:'/manage',component:manage,name:'投票管理',
                children:[
                    {path:'/manage/launchVote_mine',component:launchVote_mine,iconCls: 'el-icon-menu',name:'我的投票'}
                ]
            },
            {path:'/myVote',component:myVote,name:'等待投票'},
            { path: '/voteList', component: voteList, name: '投票列表' },
            {path:'/analyze',component:analyze,name:'结果分析'},
        ]
    },
    {
        path:'/',
        component:Home,
        name:'建筑',
        iconCls:'el-icon-menu',
        children:[
            { path:'/buildingManage',component:buildingManege,name:'管理建筑'},
            { path:'/buildingList',component:buildingList,name:'建筑列表'}
        ]
    },
    {
        path:'/',
        component:Home,
        name:'委员会组织',
        iconCls:'el-icon-menu',
        children:[
            { path:'/committeeManage',component:committeeManage,name:'管理委员会组织'},
            { path:'/committeeList',component:committeeList,name:'委员会组织列表'}
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;