<template>
  <div id="app">
    <van-dialog
      v-model="openLoginPopu"
      title="登录"
      show-cancel-button
      confirm-button-text="登录"
      cancel-button-text="关闭"
      :close-on-popstate="false"
      :before-close="beforeClose"
    >
      <hr/>
        你还没有登录，请点击确定进行登录，点击取消关闭（也就是appwebview左上角的返回）
      <hr/>
    </van-dialog>
    <router-view/>
  </div>
</template>
<script>
import { Button, Dialog } from 'vant'
export default {
  computed: {
    openLoginPopu: {
      get() {
        return this.$store.state.global.openLoginPopu
      },
      set(val) {
        this.$store.state.global.openLoginPopu = val
      }
    }
  },
  //仅仅此处存在一个监听，用于改变页面标题，导航栏等，尽量使用配置文件来匹配
  watch: {
    $route(to, from){
      
    }
  },
  methods: {
    beforeClose(action, done) {
      done()
      if(action === "confirm"){
        this.$store.dispatch("global/login")
      }else{
        window.loginAct()
      }
      
    }
  },
  data() {
    return {
      
    }
  },
  components: {
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
  }
}
</script>
