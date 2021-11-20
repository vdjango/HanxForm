import {createRouter, createWebHistory} from 'vue-router'

const Index = () => import('../views/index')
const IndexInfo = () => import('../views/index/index')
const Auth = () => import('../views/auth/auth')
const AuthLogin = () => import('../views/auth/login/login')

const BallotIndex = () => import('../views/ballot/index')
const UsersIndex = () => import('../views/users/index')
const SettingsIndex = () => import('../views/settings/index')


const CreateActivity = () => import('../views/activity/create-activity.vue')
const CreateActivityTicket = () => import('../views/activity/ticket/ticket.vue')
const CreateActivityWriting = () => import('../views/activity/writing/writing.vue')

import store from '../store/index'


const routes = [
    {
        path: '/',
        redirect: {
            name: 'index'
        }
    },
    {
        path: '/auth',
        redirect: {
            name: 'login'
        }
    },
    {
        path: '/',
        component: Index,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: '',
                name: 'index',
                components: {
                    index: IndexInfo
                }
            },
            {
                path: 'ballot',
                name: 'ballot',
                components: {
                    index: BallotIndex
                }
            },
            {
                path: 'activity',
                name: 'activity',
                components: {
                    index: CreateActivity
                },
                // component: CreateActivity,
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
                path: 'users',
                name: 'users',
                components: {
                    index: UsersIndex
                }
            },
            {
                path: 'settings',
                name: 'settings',
                components: {
                    index: SettingsIndex
                }
            }
        ]
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
