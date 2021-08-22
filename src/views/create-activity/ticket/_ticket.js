// @vue/component
import {
    ElRow,
    ElCol,
    ElTabs,
    ElTabPane,
    ElCard,
    ElButton,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElDatePicker,
    ElMessage,
    ElLoading
} from 'element-plus'
import ticketCard from '../../../components/ticket-card/ticket-card'
import axios from '../../../axios/index'
import store from '../../../store/index'

export default {
    name: 'Ticket',
    props: {
        activeId: {
            default: store.getters['activity/getActiveFormId']
        }
    },
    components: {
        'el-row': ElRow,
        'el-col': ElCol,
        'el-tabs': ElTabs,
        'el-tab-pane': ElTabPane,
        'el-card': ElCard,
        'el-button': ElButton,
        'ticket-card': ticketCard,
        'el-dialog': ElDialog,
        'el-form': ElForm,
        'el-form-item': ElFormItem,
        'el-input': ElInput,
        'el-date-picker': ElDatePicker
    },
    data() {
        return {
            // activeId: null,
            ticketName: '添 加',
            centerDialogVisible: false,
            ticketForms: {
                /**
                 * 提交的票种数据
                 */
                id: null,
                name: null,
                money: null,
                date: null,
                rwm_image: null,
                num: null,
                activity_key: null
            },
            ticketRules: {
                name: [
                    {required: true, message: '票种名称不能为空', trigger: 'blur'}
                ],
                money: [
                    {required: true, message: '票种金额不能为空', trigger: 'blur'}
                ],
                date: [
                    {required: true, message: '票种时间不能为空', trigger: 'blur'}
                ],
                num: [
                    {required: true, message: '票种数量不能为空', trigger: 'blur'}
                ],
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
            ],
            requestTicket: {
                count: 1,
                next: null,
                previous: null,
                results: []
            }
        }
    },
    computed: {},
    watch: {},
    created() {
        this.$store.commit('activity/setActiveNext', 1)

        if (this.activeId) {
            this.ticketForms.activity_key = this.activeId
        } else {
            this.$store.commit('activity/setActiveNext', 0)
            this.$router.push({name: 'activity'})
        }

        if (this.ticketForms.activity_key) {
            axios.activityTicket('GET', {'activity_key': this.activeId}).then((res) => {
                console.log(res)
                this.requestTicket.count = res.data.count
                this.requestTicket.next = res.data.next
                this.requestTicket.previous = res.data.previous
                this.requestTicket.results = res.data.results
            })
        }
    },
    methods: {
        DialogTicket() {
            this.$refs['ticketDialogForms'].validate((valid) => {
                if (valid) {
                    const loading = ElLoading.service({
                        lock: true,
                        text: 'Loading',
                        target: 'document.loaders'
                    });
                    let method = 'POST'
                    if (this.ticketForms.id) method = 'PATCH'
                    axios.activityTicket(method, this.ticketForms, this.ticketForms.id).then((res) => {
                        this.centerDialogVisible = false
                        setTimeout(() => {
                            this.requestTicket.results.push(res.data)
                        }, 500);
                        ElMessage.success({
                            message: '数据已提交',
                            type: 'success'
                        });
                    }).catch((res) => {
                        ElMessage.error({
                            message: '提交失败 ' + res,
                            type: 'error'
                        });
                    }).finally(() => {
                        setTimeout(() => {
                            loading.close();
                        }, 100);
                    })
                } else {
                    ElMessage.warning({
                        message: '有未填写的信息',
                        type: 'warning'
                    });
                }

            })

        },
        handleTabsEdit(targetName, action) {
            if (action === 'add') {
                let newTabName = ++this.tabIndex + '';
                this.editableTabs.push({
                    title: 'New Tab',
                    name: newTabName,
                    content: 'New Tab content'
                });
                this.editableTabsValue = newTabName;
            }
            if (action === 'remove') {
                let tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue = activeName;
                this.editableTabs = tabs.filter(tab => tab.name !== targetName);
            }
        }
    }
}
