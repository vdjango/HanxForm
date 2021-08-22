import {
    ElCard,
    ElImage
} from 'element-plus'

export default {
    name: 'TicketCard',
    props: {
        title: {
            type: String,
            default: 'VIP嘉宾快速通道'
        },
        num: {
            type: [Number, String],
            default: 190
        },
        money: {
            type: [Number, String],
            default: 190
        },
        date: {
            type: [String, Date],
            default: '2021-07-21 10:20'
        },
        rwm_image: {
            type: [String],
            default: 'https://img1.baidu.com/it/u=2877499757,3239316825&fm=224&fmt=auto&gp=0.jpg'
        }
    },
    components: {
        'el-card': ElCard,
        'el-image': ElImage
    }
};
