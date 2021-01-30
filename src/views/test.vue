<template>
  <div>
    <van-button type="primary" @click="useOnce">使用第一次数据</van-button>
    <van-button type="info" @click="useEnd">使用最后一次数据</van-button>
    <van-button type="danger" @click="exit">退出登录</van-button>
    <div>{{userInfo.name}}</div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { Button } from 'vant';
export default {
  computed: {
    ...mapState("global", {
      userInfo: store => store.userInfo
    })
  },
  methods: {
    exit(){
      window.exit()
    },
    async useEnd(){
      const { dispatch } = this.$store
      const res = await dispatch("global/test")
      alert(res.test)
    },
    async useOnce(){
      const { dispatch } = this.$store
      const res = await dispatch("global/test2")
      alert(res.test)
    }
  },
  mounted(){
    const { dispatch } = this.$store
    //验证连发接口登录窗口也只会打开一次
    dispatch("global/getInfo")
    dispatch("global/getInfo")
    dispatch("global/getInfo")
  },
  components: {
    [Button.name]: Button
  }
}
</script>