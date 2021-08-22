// @vue/component
import VuePictureCropper, {cropper} from 'vue-picture-cropper'

import {
    ElUpload,
    ElDialog,
    ElButton
} from 'element-plus'

export default {
    name: 'ImageUploadCropper',
    props: {
        src: {
            default: 'http://127.0.0.1:8000/media/activity-image/1627276667/2021-07-26_131747.jpeg'
        },
        elemid: {
            default: 'image'
        }
    },
    computed: {
        getReturnResult() {
            return this.result
        }
    },
    watch: {
        getReturnResult(vale,) {
            this.$emit('result', vale)
        }
    },
    created() {
    },
    data() {
        return {
            pic: null,
            file: {},
            fileList: [],
            result: null,
            uploadInput: false,
            isShowDialog: false,
            boxStyle: {
                width: '100%',
                height: '100%',
                backgroundColor: '#f8f8f8',
                margin: 'auto'
            },
            options: {
                viewMode: 1,
                dragMode: 'crop',
                aspectRatio: 16 / 8,
                preview: '.preview',
            }
        }
    },
    components: {
        'vue-picture-cropper': VuePictureCropper,
        'el-upload': ElUpload,
        'el-dialog': ElDialog,
        'el-button': ElButton
    },
    methods: {
        /**
         * 选择图片
         */
        selectFile(file) {
            // 获取选取的文件
            // 转换为base64传给裁切组件

            console.log(file)
            this.result = null
            const reader = new FileReader();
            reader.readAsDataURL(file.raw);
            reader.onload = () => {
                // 更新裁切弹窗的图片源
                this.pic = String(reader.result);
                // 显示裁切弹窗
                this.isShowDialog = true;
                // 清空已选择的文件
                if (!this.uploadInput) return;
                this.uploadInput = true;
            };
        },
        /**
         * 获取裁切结果
         */
        getResult() {
            // 获取生成的base64图片地址
            const base64 = cropper.getDataURL();
            // 获取生成的blob文件信息
            const blob = cropper.getBlob();

            console.log({base64, blob});
            // 把base64赋给结果展示区
            this.result = base64;
            // 隐藏裁切弹窗
            this.isShowDialog = false;
        },
        /**
         * 清除裁切框
         */
        clear() {
            cropper.clear();
        },
        /**
         * 重置默认的裁切区域
         */
        reset() {
            cropper.reset();
        },

        submitUpload() {
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        beforeUpload(file) {
            console.log(file)
        }
    }
}
