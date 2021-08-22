// @vue/component
import {
    ElButton,
    ElCard,
    ElCheckbox,
    ElCol,
    ElForm,
    ElFormItem,
    ElInput,
    ElLink,
    ElRow,
    ElMessage,
    ElNotification,
    ElLoading
} from "element-plus";
import axios from '../../../axios/index'

export default {
    name: 'Login',
    inject: ['routerIndex'],
    components: {
        'el-form': ElForm,
        'el-form-item': ElFormItem,
        'el-input': ElInput,
        'el-row': ElRow,
        'el-col': ElCol,
        'el-button': ElButton,
        'el-link': ElLink,
        'el-card': ElCard,
        'el-checkbox': ElCheckbox
    },
    props: {},
    data() {
        return {
            loginVerify: false,
            logining: false,
            loginForm: {
                username: '',
                password: ''
            },
            checked: false,
            loginRules: {
                username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}]
            },
        }
    },
    created() {
        this.loginVerify = this.$store.getters['auth/getVerify']
    },
    methods: {
        resetForm() {
        },
        onLogin: function () {
            this.$refs['loginForm'].validate((valid) => {
                if (valid) {
                    this.loginVerify = true
                    const loading = ElLoading.service({
                        lock: true
                    });
                    axios.authorization(this.loginForm.username, this.loginForm.password).then((response) => {
                        console.log('then', response)
                        if (response.statusText === 'OK') {
                            this.loginVerify = false
                            this.loginLock = true
                            this.$store.commit('auth/setAutherization', {
                                pk: response.data.user.id,
                                token: response.data.token,
                                user: response.data.user.username,
                                verify: true
                            })
                            setTimeout(() => {
                                this.routerIndex()
                            }, 500);

                        }
                    }).catch(error => {
                        console.log(error)
                        try {
                            if (error.data.non_field_errors[0] === '无法使用提供的认证信息登录。') {
                                ElMessage.warning('用户或密码错误')
                            } else {
                                ElMessage.error('错了哦，这是一条未知错误～ ' + error.data);
                            }
                        } catch (e) {
                            // 错误处理代码片段
                            ElNotification({
                                title: '错误',
                                message: e + '; 接口信息：' + error,
                                type: 'error',
                                duration: 0,
                            });
                            ElMessage.error('错了哦，这是一条未知错误～ 请查看右侧弹窗信息');
                        }
                        this.loginVerify = false
                    }).finally(() => {
                        setTimeout(() => {
                            loading.close();
                        }, 500);
                    })
                }
            })
        }
    },
    mounted() {
        console.log('this.verify', this.loginVerify)
        this.$nextTick(() => {
            if (this.loginVerify) this.routerIndex() // 是否登录
        })
    }
}
