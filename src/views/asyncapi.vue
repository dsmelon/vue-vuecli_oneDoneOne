<template>
    <div>
        它们都需要在ready执行完毕之后才可以调用，封装之后直接调用即可<br/>
        可以明显的看出，第一次有延迟，是在等待ready,第二次之后没有延迟，因为ready已经执行<br/>
        <van-button @click="a">调用a变量</van-button>&nbsp;
        <van-button @click="b">调用b函数</van-button>
    </div>
</template>

<script>
import wx from '@/utils/sdk'
import { Button } from 'vant'
export default {
    components: {
        [Button.name]: Button
    },
    methods: {
        async a(){
            alert(await wx("a"))
        },
        async b(){
            alert(await wx("b","xxx"))
        }
    }
}
</script>