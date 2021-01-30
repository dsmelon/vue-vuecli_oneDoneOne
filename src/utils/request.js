/**
    needLogin: 是否需要登录，也即是否需要token
    loginCode: 未登录返回的状态码
    successCode: 成功的状态码
    isTip: 是否抛错
    data: 参数，get或post都是使用此字段，默认formData,可以修改header成json
    delay: 是否展示loading, loading延迟的秒数，可以为对象，{time: 秒数, desc: 文案}
    transform: 数据转换函数
    stop: 失败后是否阻断代码，也即调用 await request状态码为失败时，是否继续往下执行代码，默认执行,不必书写try catch,通常用于判断是初始数据还是接口真的未返回数据
*/
import store from '@/store'
// import axios from 'axios'
import axios from '@/utils/mockapi'//真实情况使用上面的axios,这个仅仅模拟
import { Toast } from 'vant'

let loadingCount = 0;//正在请求的个数，用于判断是否正在加载中
let timer = -1;//延时器
let _logining = false;//是否正在登录，用来防止多个接口触发登录，导致多次跳转或者多次打开弹窗的问题
let _wait;//正在登录时，所有接口等待的都是这个东西
let _offline;//网络中途中断，接口等待的东西
let _resolve;//网络重新连接执行函数

let _toast; //toast实例

export default async function request(url = "", { header = {}, method = "post", needLogin = true, loginCode = [401, 402, 403], successCode = [200], transform, isTip = true, data = {}, stop = false, ...other} = {}, delay = false) {
    // 如果需要登录，那么等待token
    if(needLogin) await window.getToken();
    let delayTime = 200, delayDesc = "加载中···"
    if(delay){
        if(typeof delay === "number"){
            delayTime = delay
        }else{
            delayTime = delay.time || 200
            delayDesc = delay.desc || "加载中···"
        }
		loadingCount++
		if(timer < 0){
			timer = window.setTimeout(() => {
				loadingCount > 0 && (_toast = Toast.loading({
                    message: delayDesc,
                    duration: 0
                }))
			}, delayTime)
		}
	}
    let res = await axios(url, {
        method,
        [method.toLocaleLowerCase() === "get" ? "params" : "data"]: {
            //为什么这么写，因为这样写不会残留冗余的键，防止后端检测到键就触发登录的行为，更规范
            ...( needLogin ? { token: window.token } : undefined ),
            ...data
        },
        headers: {
            'Content-Type': "application/json",
            ...header
        },
        ...other
    })
    if(transform) res = transform(res)
    if(delay){
        window.clearTimeout(timer)
        loadingCount--
        if(loadingCount <= 0) {
            timer = -1
            _toast && _toast.clear()
        }
    }
    const { statusCode, data:response = {} } = res || {}
    if([200].includes(statusCode)){
        let { code, data, message } = response;
        //消除后端返回null，前端无法使用默认值的糟粕
        if(data === null) data = undefined;
        if(loginCode.includes(code)){
            //第一种情况：跳去登录
            // window._jump("/login")
            // return Promise.reject("未登录")//阻止代码运行，返回会刷新，不必再做其它事
            //第二种情况：弹窗登录（app webview登录）,推荐使用这种，能够更好的炫技
            const _loginAct = () => {
                if(_wait) return _wait
                _wait = new Promise(resolve => {
                    window.loginAct = () => {
                        _logining = false
                        _wait = undefined
                        resolve()
                    }
                })
                return _wait
            }
            !_logining && store.dispatch("global/openLoginPopu", true)//打开登录弹窗,如果是app的webview,就是调用sdk的登录api
            _logining = true;
            //此时需要做事，因为登录后需要重发触发本次的接口，需要等待登录行为的完成,登录行为完成后执行window.loginAct()即可
            await _loginAct();
            //登录行为完成后，重发当前接口
            return await request(url, {header, method, needLogin, loginCode, transform, successCode, isTip, data, stop, ...other}, delay)
        }else if(successCode.includes(code)){
            //真正成功的数据，里面的time是服务器能够取到的时间，如果有，放到里面去，方便页面使用，如果没有，去掉time字段
            return {code, data, message, time: new Date()}
        }else{
            //不符合成功数据的情况
            isTip && Toast.fail(message)
            //如果stop为true,会阻断调用该业务代码的继续执行，通常不阻断
            if(stop) return Promise.reject(message)
            return { code, message }
        }
    }else{
        //网络错误
        isTip && Toast.fail("网络错误，正在重试")
        //以下是更为友好的处理，监听网络变化，有网络时重发请求,用户中途断网或者网络不稳定时
        const refresh = () => {
            if(_offline) return _offline
            _offline = new Promise(resolve => {
                _resolve = resolve
            })
            return _wait
        }
        !_offline && window.addEventListener("online",_resolve,false)
        await refresh()
        _offline && window.removeEventListener("online", _resolve, false)
        _offline = undefined
        return await request(url, {header, method, needLogin, loginCode, transform, successCode, isTip, data, stop, ...other}, delay)
        //以下网络错误不重发请求
        return {
            code: -1,
            message: "网络错误"
        }
    }
} 