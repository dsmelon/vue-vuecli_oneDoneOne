
import api, { useEndData, useOnceData } from '@/server/api';

export default {
	namespaced: true,
	state: {
        openLoginPopu: false,
        userInfo: {
            name: "你的名字会显示在这里"
        },
	},
	actions: {
		async openLoginPopu({ commit }, payload){
            console.log("无论是多少个需要登录的接口同时发，本登录窗口也仅仅只会触发一次")
            commit("save", { openLoginPopu: payload })
        },
        async login({ commit }, payload){
            const  { data } = await api.login(payload)
            window.token = data.token
            if(data.token){
                window.loginAct();
                commit("save", { openLoginPopu: false })
            }
        },
        async exit({ commit }){
            window.token = ""
            commit("save", { userInfo: {} })
        },
        async getInfo({ commit }, payload){
            const { data = {} } = await api.getInfo(payload)
            commit("save", { userInfo: data })
        },
        async test(){
            const { data = {} } = await useEndData(api.test);
            return data;
        },
        async test2(){
            const { data = {} } = await useOnceData(api.test)
            return data;
        }
	},
	mutations: {
		save(store, payload){
			for(let i in payload) store[i] = payload[i]
		}
	}
}