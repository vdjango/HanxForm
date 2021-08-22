// @vue/component
import {
    ElRow,
    ElCol, ElNotification, ElMessageBox
} from 'element-plus'
import LocalStorage from "../../../utils/LocalStorage";
import {VueUeditorWrap} from "vue-ueditor-wrap";
import store from '../../../store/index'

import dev from '../../../../dev.env'

export default {
    name: 'Writing',
    inject: ['reload'],
    props: {
        activeId: {
            default: store.getters['activity/getActiveFormId']
        }
    },
    components: {
        VueUeditorWrap,
        'el-row': ElRow,
        'el-col': ElCol
    },
    data() {
        return {
            forms: {
                /**
                 * 提交的数据
                 */
                context: store.getters['activity/getActiveContext']
            },
            editorConfig: {
                /**
                 * UEDITOR_HOME_URL@ 访问 UEditor 静态资源的根路径，可参考 https://hc199421.gitee.io/vue-ueditor-wrap/#/faq
                 * serverUrl@ 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                 * catchRemoteImageEnable@ 抓取远程图片
                 */
                UEDITOR_HOME_URL: '/UEditor/',
                serverUrl: dev.API.UEDITOR_CONTROLLER,
                catchRemoteImageEnable: true,
                // autoHeightEnabled: true,
                elementPathEnabled: false,
                wordCount: false,
                initialFrameWidth: '100%',
                initialFrameHeight: LocalStorage.get('initialFrameHeight', 10)
            },
            editorDependencies: [
                'ueditor.config.js',
                'ueditor.all.min.js',
                // 添加秀米相关的资源
                'xiumi/xiumi-ue-dialog-v5.js',
                'xiumi/xiumi-ue-v5.css',
            ],
        }
    },
    created() {
        this.$store.commit('activity/setActiveNext', 2)
        if (!this.activeId) {
            this.$store.commit('activity/setActiveNext', 0)
            this.$router.push({name: 'activity'})
        }
    },
    methods: {
        /**
         * 编辑器相关
         * @param editorInstance
         */
        ready(editorInstance) {
            this.setClientInitialFrameHeight()
            /**
             *  加载未保存的草稿箱内容
             */
            if (this.forms.context == null) {
                editorInstance.execCommand('drafts')
            }

            editorInstance.getActionUrl = (action) => {
                /**
                 * 绑定activeId到上传地址
                 */
                return this.editorConfig.serverUrl + '?activeId=' + this.activeId + '&action=' + action
            }
        },
        /**
         * 适配屏幕尺寸信息
         */
        setClientInitialFrameHeight() {
            /**
             * 适配屏幕尺寸信息
             * @type {string|*}
             */
            let init = LocalStorage.get('initialFrameHeight', null)
            let help = LocalStorage.get('initialFrameHeight_help', null)
            if (help) {
                ElNotification({
                    title: '完成',
                    message: help,
                    type: 'success'
                });
                LocalStorage.del('initialFrameHeight_help')
            }

            if (init == null) {
                LocalStorage.set('initialFrameHeight',
                    document.documentElement.clientHeight -
                    this.$refs.ued_box.getBoundingClientRect().top -
                    this.$refs.ued_box.getBoundingClientRect().height - 10
                )
                LocalStorage.set('initialFrameHeight_help', '已完成加载～ 尽情使用吧！')
                ElMessageBox.confirm('第一次使用编辑器排版工具，需要加载所需资源。请刷新浏览器～, 是否继续?', '提示', {
                    confirmButtonText: '刷新',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.reload()
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '请手动刷新页面～'
                    });
                });
            }
        }
    },
    mounted() {
        this.setClientInitialFrameHeight()
    },
    computed: {
        /**
         * 同步Ueditor编辑器同步内容
         * @returns {null}
         */
        context() {
            return this.forms.context
        }
    },
    watch: {
        context(vale,) {
            this.$emit('context', vale)
            this.$store.commit('activity/setActiveContext', vale)
        }
    }
}
