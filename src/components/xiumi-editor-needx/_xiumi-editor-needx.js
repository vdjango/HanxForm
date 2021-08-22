// @vue/component
import {
    ElContainer,
    ElAside,
    ElMain,
    ElRow,
    ElCol,
    ElMenu,
    ElMenuItem,
    ElMenuItemGroup,
    ElSubmenu,
    ElSkeleton,
    ElCard,
    ElButton,
    ElHeader,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElSpace,
    ElForm,
    ElFormItem,
    ElInput,
    ElRadio,
    ElRadioGroup,
    ElSelect,
    ElOption,
    ElDialog,
    ElDivider,
    ElDatePicker,
    // el-date-picker, el-select el-steps
    ElStep,
    ElSteps,
    ElAutocomplete, ElDrawer, ElNotification, ElMessageBox
} from 'element-plus'
import {VueUeditorWrap} from "vue-ueditor-wrap";
import amapJsapiLoadVue from "../amap-jsapi-load-vue/amap-jsapi-load-vue";
import imageUploadCropper from "../image-upload-cropper/image-upload-cropper";
import LocalStorage from "../../utils/LocalStorage";

export default {
    name: 'XiumiEditorNeedx',
    inject: ['reload'],
    components: {
        'el-container': ElContainer,
        'el-aside': ElAside,
        'el-main': ElMain,
        'el-date-picker': ElDatePicker,
        'vue-ueditor-wrap': VueUeditorWrap,
        'amap-jsapi-load-vue': amapJsapiLoadVue,
        'image-upload-cropper': imageUploadCropper,
        'el-row': ElRow,
        'el-col': ElCol,
        'el-menu': ElMenu,
        'el-menu-item': ElMenuItem,
        'el-menu-item-group': ElMenuItemGroup,
        'el-submenu': ElSubmenu,
        'el-skeleton': ElSkeleton,
        'el-card': ElCard,
        'el-button': ElButton,
        'el-header': ElHeader,
        'el-breadcrumb': ElBreadcrumb,
        'el-breadcrumb-item': ElBreadcrumbItem,
        'el-space': ElSpace,
        'el-form': ElForm,
        'el-form-item': ElFormItem,
        'el-input': ElInput,
        'el-radio': ElRadio,
        'el-radio-group': ElRadioGroup,

        'el-select': ElSelect,
        'ElOption': ElOption,
        'el-dialog': ElDialog,
        'el-autocomplete': ElAutocomplete,
        'el-drawer': ElDrawer,
        'el-divider': ElDivider,
        'el-steps': ElSteps,
        'el-step': ElStep,
    },
    data() {
        return {
            xs: null,
            dialog: false,
            timer: null,
            loading: false,
            AMap: null,
            map: null,
            alert_error: null,
            AMapMarker: [],  // 地图点标记信息

            // addersLocations: '',
            centerDialogVisible: false,
            forms: {
                /**
                 * 提交的数据
                 */
                name: null,
                context: null,
                date: [],
                base64result: null, // Base64 Image
                ticket: 0, // 活动票种
                shape: 0, // 活动形式
                telephone: null,
                amap: {
                    lnglat: [],
                    name: null,
                    address: null,
                    adname: null,
                    cityname: null,
                    citycode: null,
                    city: null,
                }
            },
            menu_lest: {
                isCollapse: true,
                isCollapseTest: '展开',
                isCollapseIcon: 'el-icon-arrow-right',
                width: 65
            },
            editorConfig: {
                /**
                 * UEDITOR_HOME_URL@ 访问 UEditor 静态资源的根路径，可参考 https://hc199421.gitee.io/vue-ueditor-wrap/#/faq
                 * serverUrl@ 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
                 * catchRemoteImageEnable@ 抓取远程图片
                 */
                UEDITOR_HOME_URL: '/UEditor/',
                serverUrl: 'https://api.hanfuc.com:801/controller/server/',
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
            shortcuts: [
                {
                    text: '最近一周',
                    value: (() => {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        return [start, end]
                    })()
                }, {
                    text: '最近一个月',
                    value: (() => {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        return [start, end]
                    })()
                }, {
                    text: '最近三个月',
                    value: (() => {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        return [start, end]
                    })()
                }
            ],
        }
    },
    computed: {
        addersLocations() {
            /**
             * 地址拼接
             * @type {*[]}
             */
            const amap = [
                this.forms.amap.cityname,
                // this.forms.amap.adname,
                // this.forms.amap.address,
                this.forms.amap.name
            ]
            return amap.join(' ')
        },
        dialogCollapse() {
            return this.menu_lest.isCollapse
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
        },
        setClientInitialFrameHeight() {
            /**
             * 适配屏幕尺寸信息
             * @type {string|*}
             */
            let ueinit = LocalStorage.get('initialFrameHeight', null)
            let uehelp = LocalStorage.get('initialFrameHeight_help', null)
            if (uehelp) {
                ElNotification({
                    title: '完成',
                    message: uehelp,
                    type: 'success'
                });
                LocalStorage.del('initialFrameHeight_help')
            }

            if (ueinit == null) {
                LocalStorage.set('initialFrameHeight', document.documentElement.clientHeight - this.$refs.ued_box.getBoundingClientRect().top - this.$refs.ued_box.getBoundingClientRect().height - 10)
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
        },
        selectMenuOpenClase(index) {
            /**
             * 侧边菜单
             */
            if (index === 'open/clase') {
                // 展开收起菜单
                if (this.menu_lest.isCollapse) {
                    this.menu_lest.isCollapseTest = '收起'
                    this.menu_lest.isCollapseIcon = 'el-icon-arrow-left'
                    this.menu_lest.width = 65
                } else {
                    this.menu_lest.width = 200
                    this.menu_lest.isCollapseTest = '展开'
                    this.menu_lest.isCollapseIcon = 'el-icon-arrow-right'
                }

                this.menu_lest.isCollapse = !this.menu_lest.isCollapse
            } else if (index === 'preview') {

            }
            console.log(index)
        },

        /**
         * 地图相关
         */
        mapClick(AMap, map, poi) {
            /**
             * 地图点击事件
             */
            new AMap.Icon({
                /**
                 * 起
                 */
                size: new AMap.Size(25, 34),
                image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
                imageSize: new AMap.Size(135, 40),
                imageOffset: new AMap.Pixel(-9, -3)
            });

            map.clearMap()

            const marker = new AMap.Marker({
                position: poi.lnglat,  // new AMap.LngLat(116.38,39.92)
                icon: new AMap.Icon({
                    /**
                     * 终
                     */
                    size: new AMap.Size(25, 34),
                    image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
                    imageSize: new AMap.Size(135, 40),
                    imageOffset: new AMap.Pixel(-98, -3)
                }),
                draggable: true, // 设置是否可以拖拽
                cursor: 'move',
            })
            marker.setMap(map)

            console.log(marker.getPosition().lnglat)
            console.log(marker.getPosition().getLng())
            console.log(marker.getPosition().getLat())

            this.AMapMarker.push({
                name: '',
                marker: marker
            })
        },
        querySearch(AMap, map, keywords, city) {
            /**
             * 构造地点查询类
             * @type {AMap.AutoComplete}
             */
            let placeSearch = new AMap.PlaceSearch({
                pageSize: 5, // 单页显示结果条数
                map: map, // 展现结果的地图实例
                panel: "panel", // 结果列表将在此容器中进行展示。
                city: city, // 兴趣点城市
                citylimit: true,  //是否强制限制在设置的城市内搜索
                autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                draggable: true, // 设置是否可以拖拽
                cursor: 'move',
            });

            // 搜索成功时，result即是对应的匹配数据
            placeSearch.search(keywords, (status, result) => {
                console.log(status, result)
            });

            placeSearch.on('complete', (c) => {
                /**
                 * 当查询成功时触发此事件
                 */
                console.log('complete', c)
            })

            placeSearch.on('selectChanged', (c) => {
                /**
                 * 使用map、panel属性后，选中的POI改变时触发
                 */
                console.log('selectChanged', c)
            })
            placeSearch.on('listElementClick', (c) => {
                /**
                 * 使用map、panel属性后，结果面板中POI对应的列表项被点击时触发
                 */
                this.forms.amap['lnglat'] = [
                    c.data.location.lng,
                    c.data.location.lat,
                ]
                this.forms.amap['name'] = c.data.name
                this.forms.amap['address'] = c.data.address
                this.forms.amap['adname'] = c.data.adname
                this.forms.amap['cityname'] = c.data.cityname
                this.forms.amap['citycode'] = c.data.citycode
                this.forms.amap['city'] = c.data.city

                console.log('listElementClick', c.data.location)
            })
            placeSearch.on('markerClick', (c) => {
                /**
                 * 使用map、panel属性后，POI在地图中对应的Marker被点击时触发
                 */
                this.forms.amap['lnglat'] = [
                    c.data.location.lng,
                    c.data.location.lat,
                ]
                this.forms.amap['name'] = c.data.name
                this.forms.amap['address'] = c.data.address
                this.forms.amap['adname'] = c.data.adname
                this.forms.amap['cityname'] = c.data.cityname
                this.forms.amap['citycode'] = c.data.citycode
                this.forms.amap['city'] = c.data.city

                console.log('markerClick', c.data.location)
            })

        },
        AMapDialog() {
            /**
             * 地图弹窗
             * @type {boolean}
             */
            this.centerDialogVisible = false
            if (this.AMapMarker) {
                // console.log(this.AMapMarker[0].marker)
            }

        },
        mapAmpLoader(AMap, map) {
            /**
             * 地图初始化
             */
            this.AMap = AMap
            this.map = map
        },
        LocationTuning() {
            /**
             * 地图地理位置微调
             */
            if (this.forms.amap.lnglat.length < 0) return
            const marker = new this.AMap.Marker({
                position: this.forms.amap.lnglat,  // new AMap.LngLat(116.38,39.92)
                // icon: new this.AMap.Icon({
                //     /**
                //      * 终
                //      */
                //     size: new this.AMap.Size(25, 34),
                //     image: '//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
                //     imageSize: new this.AMap.Size(135, 40),
                //     imageOffset: new this.AMap.Pixel(-98, -3)
                // }),
                draggable: true, // 设置是否可以拖拽
                cursor: 'move',
                animation: 'AMAP_ANIMATION_BOUNCE',
                title: this.addersLocations
            })
            this.map.clearMap()
            marker.setMap(this.map)
            marker.on('dragend', (c) => {
                console.log(c.lnglat)
                this.forms.amap['lnglat'] = [
                    c.lnglat.lng,
                    c.lnglat.lat,
                ]
            })

        },

        /**
         * 图片相关
         */
        base64result(base64) {
            this.forms.base64result = base64
        }
    }
}
