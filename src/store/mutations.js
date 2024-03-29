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

export default {
    // 设置App视图开关状态[用于刷新App视图]
    setIsRouterAlive(state, value) {
        state.isRouterAlive = value
    },
    setLeftMenu(state, value) {
        state.leftMenu = value
    },
    setTopPath(state, value) {
        state.topPath = value
    },
    setTopHeader(state, value) {
        state.topHeader = value
    },
    setTopActive(state, value) {
        state.topActive = value
    },
    setIsDefaultActiveLeftMenu(state, value) {
        /**
         * 当前展示的leftMenu菜单
         */
        state.isDefaultActiveLeftMenu = value
    }
}
