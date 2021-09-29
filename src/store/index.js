import {createStore} from 'vuex'
import auth from "./module/auth";
import activity from "./module/activity";
import forumHeader from "./module/forumHeader";

import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
    state: {
        isRouterAlive: false, // isRouterAlive控制显示，提供reload方法刷新App视图
        leftMenu: [
            {
                toRouter: {
                    name: 'order-user'
                },
                name: '活动',
                icon: 'el-icon-s-flag',
                run: null
            },
            {
                toRouter: {
                    name: 'ballot'
                },
                name: '售票',
                icon: 'el-icon-s-ticket',
                run: null
            },
             {
                toRouter: {
                    name: 'admin_school_learning'
                },
                name: '用户',
                icon: 'el-icon-s-custom',
                run: null
            },
            {
                toRouter: {
                    name: 'admin_setting_system'
                },
                name: '设置',
                icon: 'el-icon-setting',
                run: null
            }
        ],
        topPath: [],
        topHeader: [
            /**
             * name: 菜单名称
             * icon: 菜单ico图标
             * run: 菜单运行的方法，可预定义
             * toRouter: 路由信息
             */
            {
                toRouter: {
                    name: 'admin_ques'
                },
                name: '系统用户',
                icon: null,
                run: null
            },
            // {
            //     toRouter: {
            //         name: 'order-user'
            //     },
            //     name: '首页',
            //     icon: null,
            //     run: null
            // },

        ],
    },
    modules: {
        auth,
        activity,
        forumHeader
    },
    actions: actions,
    mutations: mutations,
    strict: debug,
    getters: getters
})
