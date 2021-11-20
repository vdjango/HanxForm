/*

  Copyright (C) 2019 张珏敏.

  This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

/*
 * [*] 必填 否则查询不到
 * [x] 不存在的参数，不能填 */
import 'es6-promise/auto'
import axios from 'axios'
import Cookies from '@/utils/Cookie'
import config from '@/../dev.env'

import {
    authIndex,
    authorization,
    authorizationRefresh,
    authorizationVerify,
    authorizationRegister,
    activity,
    activityAMap,
    activityTicket,
    paymentPayInfo,
    paymentPayRefund
} from './restful'

axios.defaults.baseURL = config.API.BASE_URL
axios.defaults.timeout = config.API.TIMEOUT
axios.defaults.withCredentials = config.API.WITHCREDENTIALS
axios.defaults.xsrfCookieName = config.API.XSRFCOOKIENAME
axios.defaults.xsrfHeaderName = config.API.XSRFHEADERNAME
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-fromurlencodeed'
// axios.defaults.headers.get['Content-Type'] = 'application/json'


/* 接口请求拦截器 */
axios.interceptors.request.use(requset => {
    const Autherization = Cookies.getCookieAutherization()
    if (Autherization.token) {
        requset.headers.Authorization = config.API.TOKENPREFIX + ' ' + Autherization.token
    }
    return requset
}, error => {
    return Promise.reject(error.response)
})
/* 请求数据返回拦截器 */
axios.interceptors.response.use(response => {
    return response
}, error => {
    console.log('error', error.response)
    return Promise.reject(error.response)
})
export default {

    /**
     * 拼接data/pagination数据部分
     * @param data 用户请求数据
     * @param pagination 分页器，实现数据条目分页处理
     * @returns {*}
     *     pagination.index 分页索引
     *     pagination.pageSize 分页大小(一个分页多少条数据)
     *     pagination.count 分页总数(接口数据集合条目)
     *     pagination.next 下一页(没有数据为null)
     *     pagination.previous 上一页(没有数据为null)
     * @constructor
     */
    Data: function (data, pagination = {}) {
        if (pagination) {
            let offset = pagination.index
            const limit = pagination.pageSize

            if (offset && limit) {
                offset = Math.round(limit * (offset - 1) + 0.4)
                data['offset'] = offset
                data['limit'] = limit
            }
        }
        return this.UpFormData(data)
    },
    UpFormData: function (data) {
        /**
         * 针对文件上传操作进行优化
         * 支持上传文件操作
         * @type {boolean}
         */
        var objects = false
        for (const key in data) {
            // [object Date]
            if (Object.prototype.toString.call(data[key]) === '[object File]') {
                objects = true
                console.log(Object.prototype.toString.call(data[key]))
                continue
            }
        }
        if (objects) {
            var formData = new FormData()
            for (const key in data) {
                formData.append(key, data[key])
            }
            return formData
        }
        return data
    },
    /**
     * 获取JwtToken令牌
     * @param username 用户名
     * @param password 密码
     * @returns {Promise<unknown>}
     */
    authorization: function (username, password) {
        return Axios(authorization(), 'POST', this.Data({
            username: username,
            password: password
        }))
    },

    /**
     * 刷新JwtToken令牌过期时间
     * @param token
     * @returns {Promise<unknown>}  JwtToken令牌
     */
    authorizationRefresh: function (token) {
        return Axios(authorizationRefresh(), 'POST', this.Data({
            token: token
        }, {}))
    },

    /**
     * 验证JwtToken令牌是否有效
     * @param token JwtToken
     * @returns {Promise<token>} JwtToken令牌
     */
    authorizationVerify: function (token) {
        return Axios(authorizationVerify(), 'POST', this.Data({
            token: token
        }, {}))
    },

    /**
     * 用户注册
     * @param method [POST|OPTIONS] 等请求方式
     * @param data 请求数据
     * @returns {Promise<token>}
     */
    authorizationRegister: function (method = 'POST', data = {}) {
        return Axios(authorizationRegister(), method, this.Data(data))
    },

    /**
     * 活动信息
     * @param method 请求方式
     * @param data 请求数据
     * @param index 数据索引
     * @param pagination 分页器
     * @returns {Promise<unknown>}
     */
    activity: function (method = 'GET', data = {}, index = null, pagination = {}, headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }) {
        return Axios(activity(index), method, this.Data(data, pagination), headers)
    },

    /**
     * 获取系统信息
     * @param method
     * @param data
     * @param index
     * @param pagination
     * @returns {Promise<unknown>}
     */
    authIndex: function (method = 'GET', data = {}, index = null, pagination = {}) {
        return Axios(authIndex(index), method, this.Data(data, pagination))
    },

    /**
     * 活动地理位置信息
     * @param method
     * @param data
     * @param index
     * @param pagination
     * @returns {Promise<unknown>}
     */
    activityAMap: function (method = 'GET', data = {}, index = null, pagination = {}) {
        return Axios(activityAMap(index), method, this.Data(data, pagination))
    },

    /**
     * 活动门票信息
     * @param method
     * @param data
     * @param index
     * @param pagination
     * @returns {Promise<unknown>}
     */
    activityTicket: function (method = 'GET', data = {}, index = null, pagination = {}) {
        return Axios(activityTicket(index), method, this.Data(data, pagination))
    },

    /**
     * 活动已购门票信息
     * @param method
     * @param data
     * @param index
     * @param pagination
     * @returns {Promise<unknown>}
     */
    paymentPayInfo: function (method = 'GET', data = {}, index = null, pagination = {}) {
        return Axios(paymentPayInfo(index), method, this.Data(data, pagination))
    },

    /**
     * 活动退票信息
     * @param method
     * @param data
     * @param index
     * @param pagination
     * @returns {Promise<unknown>}
     */
    paymentPayRefund: function (method = 'GET', data = {}, index = null, pagination = {}) {
        return Axios(paymentPayRefund(index), method, this.Data(data, pagination))
    },


    Dome: function (method = 'GET', data = {}, index = null, pagination = {}) {
        return Axios('/', method, this.Data(data, pagination))
    }
    /*
     * 请按照以下规范来完成后端接口对接
     * Dome: function (method = 'GET', data = {}, index = null, pagination = {}) {
     *    return Axios(Dome(index), method, this.Data(data, pagination))
     * }
     */
}

/* 封装好的请求方法
 * @param {String} url 请求接口地址，不带http://xxx.xxx.xxx
 * @param {String} method 请求方式[GET|POST|PUT|PATCH|DELETE|...], restful有的method方法都支持，只需传入即可
 * @param {Object} data 用户接口请求的data数据 */
export function Axios(url, method = 'GET', data = {}, headers = {}) {
    return new Promise((resolve, reject) => {
        let params = null
        if (method.toUpperCase() === 'GET') {
            params = data
            data = null
        }
        const validateStatus = status => {
            /* 定义接口有效状态码范围 */
            return status >= 199 && status < 300
        }
        axios({
            url: url,
            data: data,
            params: params,
            method: method,
            // headers: headers,
            validateStatus: validateStatus
        }).then(response => {
            return resolve(response)
        }).catch(error => {
            return reject(error)
        })
    })
}


