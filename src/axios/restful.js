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
const auth = {
    authorization: 'account/authorization/',
    authorizationRefresh: 'account/authorization-refresh/',
    authorizationVerify: 'account/authorization-verify/',
    authorizationRegister: 'account/authorization-register/'
}

const app = {
    activity: 'app/activity/',
    activity_amap: 'app/activity-amap/',
    activity_ticket: 'app/activity-ticket/'
}

const payment = {
    pay_info: 'payment/pay-info/',
    pay_refund: 'payment/pay-refund/',
}

/*
 * 获取Jwt Token令牌
 * @url /account/authorization/
 * @param {Number} index 接口索引 */
export function authorization(index = null) {
    if (index) return auth.authorization + index + '/'
    return auth.authorization
}

/*
 * 刷新Jwt Token令牌
 * @url /account/authorization-refresh/
 * @param {Number} index 接口索引 */
export function authorizationRefresh(index = null) {
    if (index) return auth.authorizationRefresh + index + '/'
    return auth.authorizationRefresh
}

/*
 * 验证Jwt Token令牌
 * @url /account/authorization-verify/
 * @param {Number} index 接口索引 */
export function authorizationVerify(index = null) {
    if (index) return auth.authorizationVerify + index + '/'
    return auth.authorizationVerify
}

/*
 * 用户注册
 * @url /account/authorization-register/
 * @param {Number} index 接口索引 */
export function authorizationRegister(index = null) {
    if (index) return auth.authorizationRegister + index + '/'
    return auth.authorizationRegister
}

/*
 * 活动信息
 * @url /app/article/
 * @param {Number} index 接口索引 */
export function activity(index = null) {
    if (index && index !== 'null') return app.activity + index + '/'
    return app.activity
}

/**
 * 活动地理位置信息
 * @param index
 * @returns {string}
 */
export function activityAMap(index = null) {
    if ((index && index !== 'null')) return app.activity_amap + index + '/'
    return app.activity_amap
}

/**
 * 活动门票信息
 * @param index
 * @returns {string}
 */
export function activityTicket(index = null) {
    if ((index && index !== 'null')) return app.activity_ticket + index + '/'
    return app.activity_ticket
}


/**
 * 活动已购门票信息
 * @param index
 * @returns {string}
 */
export function paymentPayInfo(index = null) {
    if ((index && index !== 'null')) return payment.pay_info + index + '/'
    return payment.pay_info
}

/**
 * 活动退票信息
 * @param index
 * @returns {string}
 */
export function paymentPayRefund(index = null) {
    if ((index && index !== 'null')) return payment.pay_refund + index + '/'
    return payment.pay_refund
}


