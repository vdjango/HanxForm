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
        isRouterAlive: false // isRouterAlive控制显示，提供reload方法刷新App视图
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
