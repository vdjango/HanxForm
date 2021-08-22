import {createRouter, createWebHistory} from 'vue-router'

const Auth = () => import('../views/auth/auth')
const AuthLogin = () => import('../views/auth/login/login')

const CreateActivity = () => import('../views/create-activity/create-activity.vue')
const CreateActivityTicket = () => import('../views/create-activity/ticket/ticket.vue')
const CreateActivityWriting = () => import('../views/create-activity/writing/writing.vue')

import store from '../store/index'


const routes = [
    {
        path: '/',
        redirect: {
            name: 'activity'
        }
    },
    {
        path: '/activity',
        name: 'activity',
        component: CreateActivity,
        meta: {
            requiresAuth: true
        },
        props: () => {
            return {activeId: store.getters['activity/getActiveFormId']}
        },
        children: [
            {
                path: 'ticket',
                name: 'ticket',
                props: true,
                meta: {
                    requiresAuth: true
                },
                components: {
                    activity: CreateActivityTicket
                }
            },
            {
                path: 'writing',
                name: 'writing',
                props: true,
                meta: {
                    requiresAuth: true
                },
                components: {
                    activity: CreateActivityWriting
                }
            },
        ]
    },
    {
        path: '/auth',
        redirect: {
            name: 'login'
        }
    },
    {
        path: '/auth',
        name: 'auth',
        component: Auth,
        children: [
            {
                path: 'login',
                name: 'login',
                components: {
                    auth: AuthLogin
                }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})


export default router
