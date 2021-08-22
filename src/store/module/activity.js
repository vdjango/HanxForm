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
import dev from '../../../dev.env'
import LocalStorage from '../../utils/LocalStorage'

export default {
    namespaced: true,
    state: {
        activity: {
            active: {
                nextNum: 0
            },
            forms: {
                id: null,
                context: ''
            },
            ticket: {}
        }
    },
    mutations: {
        setActiveNext(state, data) {
            /**
             * 设置 carousel轮询索引
             * 活动信息发布页-信息补充流程
             */
            state.activity.active.nextNum = data
        },
        /**
         * 活动信息发布的ID
         * @param state
         * @param id
         * @param method 添加/修改 add，删除 del
         */
        setActiveFormId(state, id) {
            LocalStorage.set('ActiveFormId', id)
            state.activity.forms.id = id
        },
        /**
         * 活动信息图文HTML内容
         * Ueditor编辑器同步过来的内容，内容为HTML源码
         * @param state
         * @param data
         */
        setActiveContext(state, data) {
            // console.log(JSON.stringify(dev.API.EDITOR_PREFERENCE(data)))
            LocalStorage.set('ueditor_preference', JSON.stringify(dev.API.EDITOR_PREFERENCE(data)))
            state.activity.forms.context = data
        },
        delActiveFormId(state) {
            LocalStorage.del('ActiveFormId')
            state.activity.forms.id = null
        },
        delActiveAll(state) {
            LocalStorage.del('ActiveFormId')
            LocalStorage.del('ueditor_preference')
            state.activity.forms.id = null
            state.activity.active.nextNum = 0
        }
    },
    actions: {},
    getters: {
        getActiveNext: function (state) {
            /**
             * 获取 carousel轮询索引
             */
            return state.activity.active.nextNum
        },
        getActiveFormId(state) {
            /***
             * 获取活动信息发布的ID
             */
            return state.activity.forms.id
        },
        /**
         * 活动信息图文HTML内容
         * Ueditor编辑器同步过来的内容，内容为HTML源码
         * @param state
         * @returns {string}
         */
        getActiveContext(state) {
            return state.activity.forms.context
        },
    }
}
