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
    ElStep,
    ElSteps, // el-carousel
    ElCarousel,
    ElCarouselItem,
    ElLoading,
    ElMessage,
    ElAutocomplete, ElDrawer, ElNotification, ElMessageBox,
    ElImage
} from 'element-plus'
import {VueUeditorWrap} from "vue-ueditor-wrap";
import amapJsapiLoadVue from "../../components/amap-jsapi-load-vue/amap-jsapi-load-vue";
import imageUploadCropper from "../../components/image-upload-cropper/image-upload-cropper";
import ticketCard from '../../components/ticket-card/ticket-card'
import LocalStorage from "../../utils/LocalStorage";
import FileImage from '../../utils/ImageFile'
import axios from '../../axios/index'

import {DateMat} from '../../utils/date'
import store from "../../store";

export default {
    name: 'CreateActivity',
    props: {
        activeId: {
            default: null
        }
    },
    inject: ['reload', 'routerLogin'],
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
        'el-carousel': ElCarousel,
        'el-carousel-item': ElCarouselItem,
        'ticket-card': ticketCard,
        ElImage
    },
    data() {
        const validateAmap = function (rule, value, callback) {
            if (value.name) {
                callback()
            }
            callback(new Error('请选择地点'));
        };

        return {
            loginVerify: false,  // 是否登陆
            dialog: false,
            loading: false,
            AMap: null,
            map: null,
            // ueditor_preference: 'https_uedits_hanfuc_com_activity_writingeditor-demo-01-drafts-data',
            ueditor_preference: 'http_localhost_8080_activity_writingeditor-demo-01-drafts-data',
            AMapMarker: [],  // 地图点标记信息
            active: {
                nextNum: 0,
                router: [
                    {
                        name: 'activity',
                        text: '活动信息初步完成',
                        run: () => {
                        }
                    },
                    {
                        name: 'ticket',
                        text: '活动票种已设置',
                        run: () => {
                        }
                    },
                    {
                        name: 'writing',
                        text: '活动图文已同步',
                        run: () => {
                        }
                    },
                    {  // 需要设置添加完成跳转地址【图文添加完成】
                        name: 'activity',
                        text: '活动已发布',
                        run: () => {
                            this.active.nextNum = 0
                            this.$store.commit('activity/delActiveAll')
                        }
                    },
                ],
                forms: ['forms', null, 'forms'],
                buttonLast: ['上一步', '上一步', '上一步'],
                buttonNext: ['添加信息', '下一步', '发布活动']
            },
            // addersLocations: '',
            centerDialogVisible: false,
            forms: {
                /**
                 * 提交的信息数据
                 */
                id: null,
                name: '',
                context: null,
                date: [],
                start_date: '',
                end_date: '',
                base64result: null, // Base64 Image
                images: null,
                // ticket: 0, // 活动票种
                shape: 0, // 活动形式
                telephone: null,
                user: null,
                amap: {
                    id: null,
                    lnglat: {
                        lng: null,
                        lat: null,
                    },
                    location_lnglat: [],
                    name: null,
                    address: null,
                    adname: null,
                    cityname: null,
                    citycode: null,
                    city: null,
                    lng: null,
                    lat: null,
                    activity_key: null
                }
            },
            rules: {
                name: [
                    {required: true, message: '活动主题不能为空', trigger: 'blur'}
                ],
                base64result: [
                    {required: true, message: '图片没有上传', trigger: 'blur'}
                ],
                date: [
                    {required: true, message: '活动时间不能为空', trigger: 'blur'}
                ],
                shape: [
                    {required: true, message: '活动形式未选择', trigger: 'blur'}
                ],
                amap: [
                    {required: true, validator: validateAmap, trigger: 'blur'}
                ],
                telephone: [
                    {required: true, message: '服务电话不能为空', trigger: 'blur'}
                ]
            },
            menu_lest: {
                isCollapse: true,
                isCollapseTest: '展开',
                isCollapseIcon: 'el-icon-arrow-right',
                width: 65
            },
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
            ]
        }
    },
    created() {
        this.loginVerify = this.$store.getters['auth/getVerify']
        this.forms.user = this.$store.getters['auth/getUserPk']

        if (this.activeId) {
            this.$store.commit('activity/setActiveFormId', this.activeId)
            this.forms.id = this.activeId
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
        },
        gettersgetActiveNext() {
            return this.$store.getters['activity/getActiveNext']
        },
        /**
         * 同步Ueditor编辑器同步内容
         * @returns {null}
         */
        context() {
            return this.$store.getters['activity/getActiveContext']
        }
    },
    watch: {
        gettersgetActiveNext(vale,) {
            this.active.nextNum = vale
        },
        /**
         * 同步Ueditor编辑器同步内容
         */
        context(vale,) {
            this.forms.context = vale
        }
    },
    methods: {
        mise(fun) {
            /**
             * 同步执行方法
             */
            return new Promise((resolve) => {
                resolve(fun())
            })
        },
        /**
         * 编辑器相关
         * @param editorInstance
         */
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
                this.$refs.forms.validateField('amap');
            })

            placeSearch.on('selectChanged', (c) => {
                /**
                 * 使用map、panel属性后，选中的POI改变时触发
                 */
                console.log('selectChanged', c)
                this.$refs.forms.validateField('amap');
            })
            placeSearch.on('listElementClick', (c) => {
                /**
                 * 使用map、panel属性后，结果面板中POI对应的列表项被点击时触发
                 */
                this.forms.amap['location_lnglat'] = [
                    c.data.location.lng,
                    c.data.location.lat,
                ]
                this.forms.amap['lnglat']['lng'] = c.data.location.lng
                this.forms.amap['lnglat']['lat'] = c.data.location.lat

                this.forms.amap['lng'] = c.data.location.lng
                this.forms.amap['lat'] = c.data.location.lat

                this.forms.amap['name'] = c.data.name
                this.forms.amap['address'] = c.data.address
                this.forms.amap['adname'] = c.data.adname
                this.forms.amap['cityname'] = c.data.cityname
                this.forms.amap['citycode'] = c.data.citycode
                this.forms.amap['city'] = c.data.city
                this.$refs.forms.validateField('amap');
                console.log(this.forms.amap)
            })
            placeSearch.on('markerClick', (c) => {
                /**
                 * 使用map、panel属性后，POI在地图中对应的Marker被点击时触发
                 */
                this.forms.amap['location_lnglat'] = [
                    c.data.location.lng,
                    c.data.location.lat,
                ]

                this.forms.amap['lnglat']['lng'] = c.data.location.lng
                this.forms.amap['lnglat']['lat'] = c.data.location.lat

                this.forms.amap['lng'] = c.data.location.lng
                this.forms.amap['lat'] = c.data.location.lat

                this.forms.amap['name'] = c.data.name
                this.forms.amap['address'] = c.data.address
                this.forms.amap['adname'] = c.data.adname
                this.forms.amap['cityname'] = c.data.cityname
                this.forms.amap['citycode'] = c.data.citycode
                this.forms.amap['city'] = c.data.city
                this.$refs.forms.validateField('amap');
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
            if (this.forms.amap.location_lnglat.length < 0) return
            const marker = new this.AMap.Marker({
                position: this.forms.amap.location_lnglat,  // new AMap.LngLat(116.38,39.92)
                draggable: true, // 设置是否可以拖拽
                cursor: 'move',
                animation: 'AMAP_ANIMATION_BOUNCE',
                title: this.addersLocations
            })
            this.map.clearMap()
            marker.setMap(this.map)
            marker.on('dragend', (c) => {
                this.forms.amap['location_lnglat'] = [
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
            // this.forms.images = FileImage.FileImage(base64)
            this.forms.images = FileImage.base64ToFile(base64)
            console.log(this.forms.images)
            this.$nextTick(() => {
                this.$refs.forms.validateField('base64result');
            })
        },

        /**
         * 步骤
         */
        next() {
            console.log('nextNum', this.active.nextNum, this.active.router[this.active.nextNum])
            if (this.active.forms[this.active.nextNum]) {
                this.$refs[this.active.forms[this.active.nextNum]].validate((valid) => {
                    if (valid) {
                        const loading = ElLoading.service({
                            lock: true,
                            text: 'Loading',
                            target: 'document.loaders'
                        });
                        this.axiosActiveInfo().then((res) => {
                            setTimeout(() => {
                                loading.close();
                                this.active.router[this.active.nextNum].run()
                                this.$router.push(this.active.router[this.active.nextNum])
                            }, 500);
                            console.log('nextNum', this.active.nextNum, this.active.router[this.active.nextNum])
                            ElMessage.success({
                                message: this.active.router[this.active.nextNum].text,
                                type: 'success'
                            });
                            this.active.nextNum++
                        })
                    } else {
                        ElMessage.warning({
                            message: '有未填写的信息',
                            type: 'warning'
                        });
                    }
                });
            } else {
                const loading = ElLoading.service({
                    lock: true,
                    text: 'Loading',
                    target: 'document.loaders'
                });

                setTimeout(() => {
                    this.active.router[this.active.nextNum].run()
                    this.$router.push(this.active.router[this.active.nextNum])
                    loading.close();
                }, 500);
                ElMessage.success({
                    message: this.active.router[this.active.nextNum].text,
                    type: 'success'
                });
                this.active.nextNum++
            }
            return false
        },
        LastNext() {
            if (this.active.nextNum-- === 0) this.active.nextNum = 0;
            this.$router.push(this.active.router[this.active.nextNum])
        },
        blur() {
            /**
             * 添加form表单date数据
             */
            this.forms.start_date = DateMat(this.forms.date[0]).format("yyyy-MM-dd hh:mm:ss")
            this.forms.end_date = DateMat(this.forms.date[1]).format("yyyy-MM-dd hh:mm:ss")

            console.log(this.forms)
        },

        /**
         * Axios请求
         */
        axiosActiveInfo() {
            /**
             * 活动提交信息
             */
            const AMapAxios = () => {
                let map_method = 'POST'
                if (this.forms.amap.id) map_method = 'PATCH'
                axios.activityAMap(map_method, this.forms.amap, this.forms.amap.id).then((res) => {
                    this.forms.amap.id = res.data.id
                })
            }

            let formData = new FormData();
            formData.append('name', this.forms.name);
            formData.append('images', this.forms.images);
            formData.append('start_date', this.forms.start_date);
            formData.append('end_date', this.forms.end_date);
            formData.append('telephone', this.forms.telephone);
            formData.append('context', this.forms.context);
            formData.append('user', this.forms.user);


            let method = 'POST'
            if ((this.activeId && this.activeId !== 'null')) {
                method = 'PATCH'
            }

            let ac = axios.activity(method, formData, this.activeId).then((res) => {
                this.forms.id = res.data.id
                this.forms.amap.activity_key = res.data.id
                this.$store.commit('activity/setActiveFormId', res.data.id)
                AMapAxios()
            })

            return ac
        },
        axiosTicketInfo() {
            /**
             * 活动票种信息
             */
        },
        axiosWritingInfo() {
            /**
             * 活动票种信息
             */
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs['forms'].resetFields();
            if ((this.activeId && this.activeId !== 'null')) {
                console.log('this.forms.id', this.forms.id)
                axios.activity('GET', {}, this.activeId).then((res) => {
                        this.forms.id = res.data.id
                        this.forms.name = res.data.name
                        this.forms.context = res.data.context
                        this.forms.start_date = res.data.start_date
                        this.forms.end_date = res.data.end_date
                        this.forms.ticket = res.data.ticket
                        this.forms.shape = res.data.shape
                        this.forms.telephone = res.data.telephone
                        this.forms.user = res.data.user

                        let amap = res.data.amap[0]

                        this.forms.amap.id = amap.id
                        this.forms.amap.location_lnglat = [amap.lnglat.lng, amap.lnglat.lat]
                        this.forms.amap.name = amap.name

                        this.forms.amap.address = amap.address
                        this.forms.amap.adname = amap.adname
                        this.forms.amap.cityname = amap.cityname
                        this.forms.amap.citycode = amap.citycode
                        this.forms.amap.city = amap.city
                        this.forms.amap.lng = amap.lng
                        this.forms.amap.lat = amap.lat
                        this.forms.amap.activity_key = amap.activity_key
                        this.forms.amap.lnglat.id = amap.lnglat.id
                        this.forms.amap.lnglat.lng = amap.lnglat.lng
                        this.forms.amap.lnglat.lat = amap.lnglat.lat

                        this.$nextTick(() => {
                            FileImage.FileTuBase64(res.data.images).then((resImage) => {
                                this.forms.base64result = resImage.data
                                this.forms.images = FileImage.base64ToFile(resImage.data)
                            })
                            this.$store.commit('activity/setActiveContext', res.data.context)
                        })

                        this.forms.date = [this.forms.start_date, this.forms.end_date]
                    }
                ).catch((res) => {
                    console.log('存在未知信息索引。是否进行创建而不是修改', res)
                    ElMessageBox.confirm("存在未知信息索引。点击确认跳过未完成的信息，或者可以重新载入页面", '监测到未完成的内容', {
                        confirmButtonText: '确定',
                        distinguishCancelAndClose: true,
                        cancelButtonText: '重载',
                    }).then(() => {
                        this.$store.commit('activity/delActiveFormId')
                        setTimeout(() => {
                            ElMessage({
                                type: 'info',
                                message: '页面重载完成，如果提示信息未消失～ 请手动删除 [Local Storage.ActiveFormId] 数值，或联系技术人员'
                            });
                        }, 500)
                    }).catch(() => {
                        this.reload()
                        setTimeout(() => {
                            ElMessage({
                                type: 'info',
                                message: '页面重载完成，如果提示信息未消失～ 请确认网络正常，之后可以跳过未完成的信息'
                            });
                        }, 500)
                    });
                })
            }
        })
    }
}
