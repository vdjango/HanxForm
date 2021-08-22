// @vue/component
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
    name: 'AmapJsapiLoadVue',
    props: {
        width: {
            default: '100%'
        },
        height: {
            default: '95vh'
        },
        config_plugins: {
            default: {
                'AMap.ControlBar': {
                    config: {
                        position: {
                            right: '10px',
                            top: '10px'
                        }
                    },
                    run: (controlbar) => {
                    },
                    mode: true
                },
                'AMap.ToolBar': {
                    config: {
                        position: {
                            right: '40px',
                            top: '110px'
                        }
                    },
                    run: (toolbar) => {
                    },
                    mode: true
                },
                'AMap.Scale': {
                    mode: true
                },
                'AMap.AutoComplete': {
                    config: {
                        city: '全国',
                        input: "tipinput"
                    },
                    run: (autocomplete) => {
                    },
                    mode: false
                },
                'AMap.PlaceSearch': {
                    config: {
                        pageSize: 5, // 单页显示结果条数
                        pageIndex: 1, // 页码
                        panel: "panel", // 结果列表将在此容器中进行展示。
                        autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                    },
                    run: (placeSearch) => {
                    },
                    mode: false
                }
            },
        },
        config_loader: {
            default: {
                key: '51ea790c9d5cf9d3ec3b1d254a313678',
                plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar', 'AMap.AutoComplete', 'AMap.PlaceSearch'],
                version: '2.0',
                Loca: {
                    version: '2.0',
                }
            },
        },
        config_map: {
            default: {
                resizeEnable: true, //是否监控地图容器尺寸变化
                rotateEnable: true,
                pitchEnable: true,
                zoom: 17,
                pitch: 50,
                rotation: -15,
                viewMode: '3D', //开启3D视图,默认为关闭
                zooms: [2, 20]
            },
        },
        value: {
            type: String
        }
    },
    // model: {
    //     prop: 'value',
    //     event: 'input'
    // },
    emits: ['update:value'],
    data() {
        return {
            value: '',
            mapData: {
                autocomplete: []
            },
            container: 'container',
            map: null,
            city: '',
            AMapLoaderLoad: null
        }
    },
    created() {
        this.AMapLoaderLoad = AMapLoader.load(this.config_loader)
    },
    methods: {
        valueUpdata(value) {
            console.log("input", value);
            this.$emit("input", value);
        }
    },
    mounted() {
        this.AMapLoaderLoad.then(AMap => {
            this.$emit('map-loader', AMap)

            this.map = new AMap.Map(this.container, this.config_map);

            AMap.plugin('AMap.Geolocation', () => {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：5s
                    position: 'RB',    //定位按钮的停靠位置
                    zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
                });
                this.map.addControl(geolocation);
                geolocation.getCurrentPosition(function (status, result) {
                    if (status === 'complete') {
                        // console.log(result)

                    }
                });
            });

            this.$emit('map-amp-loader', AMap, this.map)

            for (let item in this.config_loader.plugins) {
                let value = this.config_loader.plugins[item]
                let fun = eval(value)
                let cof = this.config_plugins[value]
                if (!cof) cof = {}

                let config = cof['config']
                let mode = cof['mode']
                let run = cof['run']

                if (config === null || config === undefined) config = {}
                if (mode === null || mode === undefined) mode = true
                if (run === null || run === undefined) run = (() => {
                })

                let func_obj = new fun(config)
                run(func_obj)
                if (mode) func_obj.addTo(this.map)
            }

            AMap.plugin('AMap.CitySearch', () => {
                const citysearch = new AMap.CitySearch();
                citysearch.getLocalCity((status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                        if (result && result.city && result.bounds) {
                            this.city = result.city;
                            console.log(result)
                        }
                    }
                });
            })


            this.$emit('map-loader-plugins', AMap, this.map)

            /**
             * 地图点击和鼠标事件
             */
            this.map.on('click', (poi) => {
                /**
                 * 点击事件
                 */
                this.$emit('map-click', AMap, this.map, poi)
            })
            this.map.on('dblclick', (poi) => {
                /**
                 * 鼠标抬起事件
                 */
                this.$emit('map-dblclick', AMap, this.map, poi)
            });
            this.map.on('mousemove', (poi) => {
                /**
                 * 鼠标移动事件
                 */
                this.$emit('map-mousemove', AMap, this.map, poi)
            });

            /**
             * 地图移动相关事件
             */
            this.map.on('movestart', (poi) => {
                /**
                 * 开始拖动-按下
                 */
                this.$emit('map-movestart', AMap, this.map, poi)
            });
            this.map.on('mapmove', (poi) => {
                /**
                 * 开始拖动-拖动
                 */
                this.$emit('map-mapmove', AMap, this.map, poi)
            });
            this.map.on('moveend', (poi) => {
                /**
                 * 开始拖动-松开
                 */
                this.$emit('map-moveend', AMap, this.map, poi)
            });

            /**
             * 地图缩放相关事件
             */
            this.map.on('zoomstart', (poi) => {
                /**
                 * 地图缩放相关事件-开始
                 */
                this.$emit('map-zoomstart', AMap, this.map, poi)
            });
            this.map.on('zoomchange', (poi) => {
                /**
                 * 地图缩放相关事件-缩放
                 */
                this.$emit('map-zoomchange', AMap, this.map, poi)
            });
            this.map.on('zoomend', (poi) => {
                /**
                 * 地图缩放相关事件-结束
                 */
                this.$emit('map-zoomend', AMap, this.map, poi)
            });

            /**
             * 地图拖拽相关事件
             */
            this.map.on('dragstart', (poi) => {
                /**
                 * 地图拖拽相关事件-按下
                 */
                this.$emit('map-dragstart', AMap, this.map, poi)
            });
            this.map.on('dragging', (poi) => {
                /**
                 * 地图拖拽相关事件-拖拽
                 */
                this.$emit('map-dragging', AMap, this.map, poi)
            });
            this.map.on('dragend', (poi) => {
                /**
                 * 地图拖拽相关事件-松开
                 */
                this.$emit('map-dragend', AMap, this.map, poi)
            });

            /**
             *
             */
            this.map.on("complete", () => {
                /**
                 * 地图加载完成
                 */
                this.$emit('map-complete', AMap, this.map)
            });
        })
    },
    computed: {
        AMapInput() {
            return this.value
        }
    },
    watch: {
        AMapInput(vale,) {
            this.AMapLoaderLoad.then(AMap => {
                this.$emit('querySearch', AMap, this.map, vale, this.city)
            })
        }
    },
    destroyed() {
        /**
         * 销毁事件
         */

        /**
         * 地图点击和鼠标事件
         */
        this.map.off('click', () => {
        })
        this.map.off('dblclick', () => {
        });
        this.map.off('mousemove', () => {
        });

        /**
         * 地图移动相关事件
         */
        this.map.off('movestart', () => {
        });
        this.map.off('mapmove', () => {
        });
        this.map.off('moveend', () => {
        });

        /**
         * 地图缩放相关事件
         */
        this.map.off('zoomstart', () => {
        });
        this.map.off('zoomchange', () => {
        });
        this.map.off('zoomend', () => {
        });

        /**
         * 地图拖拽相关事件
         */
        this.map.off('dragstart', () => {
        });
        this.map.off('dragging', () => {
        });
        this.map.off('dragend', () => {
        });

        this.map.off("complete", () => {
        });

        this.$emit('map-destroy', this.map)
        this.map.destroy()
    }
}
