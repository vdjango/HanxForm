import {createApp} from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from './axios/index'

import 'element-plus/lib/theme-chalk/index.css'
import LocalStorage from "./utils/LocalStorage";
import Cookies from './utils/Cookie'

/***
 * 本地保存需要加载的信息
 * @type {string[][]}
 */
const Storage = [
    ['activity/setActiveFormId', 'ActiveFormId'],
]

let auth = false


router.beforeEach(async (to, from, next) => {

    // store.commit('auth/setAutherization', {
    //     pk: 1,
    //     token: "ey3dcXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6IjE3NDgwMTE3NTUiLCJleHAiOjE2Mjc1NzEwNjEsImVtYWlsIjoiMTc0ODAxMTc1NUBxcS5jb20iLCJvcmlnX2lhdCI6MTYyNzQ4NDM3MCwicGsiOjEsImlzX3N0YWZmIjpmYWxzZSwiaXNfYWN0aXZlIjp0cnVlLCJsYXN0X2xvZ2luIjpudWxsfQ.s7oH6Oroo__Q6o1qLjSMfKGDdPezbC3YvQDyJb__V2U",
    //     user: '1748011755',
    //     verify: true
    // })




    const autherization = Cookies.getCookieAutherization()
    const authorizationRefresh = async () => {
        return await axios.authorizationRefresh(autherization.token)
    }

    if (autherization.token && autherization.username) {
        await authorizationRefresh().then((response) => {
            auth = true
            store.commit('auth/setAutherization', {
                pk: response.data.user.id,
                token: response.data.token,
                user: response.data.user.username,
                verify: true
            })
            console.log('response', response)
        }).catch((re) => {
            console.log('re', re)
            if (re.status === 401) {
                auth = false
                console.log('下次需要登陆', re)
                store.commit('auth/clearAutherization')
            }
        })
    }

    /**
     * 根据路由权限进行跳转登录页面
     */
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        console.log('au', to.name, auth, to.name !== 'login' && (autherization.token === null || autherization.token === undefined))
        if (to.name !== 'login' && auth === false) {
            console.log('au.login')
            next({name: 'login'})
        } else {
            next()
        }
    } else {
        next() // make sure to always call next()!
    }
})


const th = createApp(App)
    .use(router)
    .use(store)
    .mount('#app')


for (let item in Storage) {
    /**
     * 加载LocalStorage中的数据
     */
    th.$store.commit(Storage[item][0], LocalStorage.get(Storage[item][1]))
}
