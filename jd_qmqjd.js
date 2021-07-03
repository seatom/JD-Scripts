/*
全民抢京豆@凉人 🤣
更新: 2021-07-03 11:00
抄自 @yangtingxiao 抽奖机脚本
活动时间：2021-07-02---2021-07-15
活动入口： 首页--领京豆--抢京豆  每天执行一次，暂时没解决自动开团生成互助码的问题，需要手动开团，或者等待大佬修复
已支持IOS双京东账号, Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, 小火箭，JSBox, Node.js
============Quantumultx===============
[task_local]
#
1 0-23/1 * 6 * https://raw.githubusercontent.com/Wenmoux/scripts/master/jd/xx.js, tag=新潮品牌狂欢, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

================Loon==============
[Script]
cron "1 0-23/1 * 6 *" script-path=https://raw.githubusercontent.com/Wenmoux/scripts/master/jd/xx.js tag=

===============Surge=================
全民抢京豆 = type=cron,cronexp="1 0-23/1 * 6 *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/Wenmoux/scripts/master/jd/jd_618redpacket.js

============小火箭=========
全民抢京豆 = type=cron,script-path=https://raw.githubusercontent.com/Wenmoux/scripts/master/jd/xx.js, cronexpr="1 0-23/1 * 6 *", timeout=3600, enable=true

 */
const $ = new Env('全民抢京豆');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const randomCount = $.isNode() ? 20 : 5;
const notify = $.isNode() ? require('./sendNotify') : '';
let helpArr = [
  {"shareCode":"A480C21E5FBAFA0841A0452AE35E8472","groupCodeID":"860674109647245312"},
  {"shareCode":"52DA66D1EE7F35A42ECD9478891BF3EDAD1DAAB9A3E3F6CBAFDE81EEB7393333","groupCodeID":"860675620021485568"},
  {"shareCode":"2DC1C26E50DF6E2BEC9C97A8FD0F6D45","groupCodeID":"860675017933733888"},
  {"shareCode":"1332CF66CD8037618DF09458F720A94A","groupCodeID":"860673939245518848"},
  {"shareCode":"26C771723F636023E9E44F6E4C687640","groupCodeID":"860673368488431616"},
  {"shareCode":"5EDCD954F916A65520D0046881D70FB5","groupCodeID":"860674938137497600"},
  {"shareCode":"522E1439A7A31CAF340209442EDDDC55","groupCodeID":"860674715540279296"},
  {"shareCode":"9B229935EE778C64A09B9F1983B7591F","groupCodeID":"860674169836814336"},
  {"shareCode":"57262348C9A39FCB4FC737C0C97710D2","groupCodeID":"860676962845478912"},
  {"shareCode":"EC0E228C582BFBD9A1660CCF99901260AD1DAAB9A3E3F6CBAFDE81EEB7393333","groupCodeID":"860677121833455616"},
  {"shareCode":"418C17A0B1AEE0F38DF1405029A67677","groupCodeID":"860677281116475392"},
  {"shareCode":"46576BE09ABB8DE460CE5D9125C0C644AD1DAAB9A3E3F6CBAFDE81EEB7393333","groupCodeID":"860677447860113408"},
  {"shareCode":"96D5B2D22C249776568A1D9EE896B065","groupCodeID":"860677641667366912"},
  {"shareCode":"6E9067E19BADDB3653E839D4310014E2AD1DAAB9A3E3F6CBAFDE81EEB7393333","groupCodeID":"860677833046118400"},
  {"shareCode":"05DC5EB11E4737AD13BE9C344043EC5CAD1DAAB9A3E3F6CBAFDE81EEB7393333","groupCodeID":"860677991358418944"},
  {"shareCode":"D1156355D3182E08B48194551438A5DDAD1DAAB9A3E3F6CBAFDE81EEB7393333","groupCodeID":"860678184133738496"},
  {"shareCode":"2CE2CDD1D6A3AD5EC16635E83CC6E392","groupCodeID":"860676970216837120"}
  ];
let actId = '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
  cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

const JD_API_HOST = `https://api.m.jd.com/`;
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      "open-url": "https://bean.m.jd.com/"
    });
    return;
  }
  message = ''
  console.log(`\n*********************************************【开始获取互助码】******************************************\n`);
  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.canHelp = true;
      $.message = `【京东账号${$.index}】${$.UserName}\n`
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
          "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }

      //助力前十个
      if (i < 10) {
        await getcode();
        await $.wait(1000);
      } else {
        break;
      }
    }
  }




  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.canHelp = true;
      $.message = `【京东账号${$.index}】${$.UserName}\n`
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
          "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }


      console.log(`\n*********************************************【京东账号${$.index}开始助力】******************************************\n`);

      //开始助力
      if (helpArr && helpArr.length > 0) {
        console.log("内部助力ing...")
        for (let index = 0; index < 17; index++) {
          console.log("开始助力第" + (index + 1) + "个助力码：", JSON.stringify(helpArr[index]));
          await help(helpArr[index].groupCodeID, helpArr[index].shareCode)
          await $.wait(1000);
        }
      } else {
        console.log("没获取到助力码,停止运行")
        return;
      }
    }
  }

})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
//获取活动信息


function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
function help(groupCode, shareCode) {

  return new Promise(resolve => {
    $.get(taskUrl('signGroupHelp', `{\"activeType\":2,\"groupCode\":\"${groupCode}\",\"shareCode\":\"${shareCode}\",\"activeId\":\"${actId}\",\"source\":\"guest\"}`, groupCode, shareCode), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // data = data.replace("jsonp_1625224497986_65507(", "").replace(");", '');
            //    console.log(data)
            if (data && safeGet(data)) {
              data = JSON.parse(data);
              if (data.data && data.data.helpToast) {
                if (data.code == 0) {
                  message += `助力数据：${JSON.stringify(data.data.helpToast)}\n}`
                  console.log(`助力数据：${JSON.stringify(data.data.helpToast)}\n\n`)
                } else {//助力过该好友
                  // message += `助力错误：${JSON.stringify(data.data.helpResult.errMsg)}\n}`
                  console.log(`助力数据：${JSON.stringify(data.data.helpToast)}\n\n`)
                }
              } else {
                console.log(`失败,${JSON.stringify(data)}`)
              }
            } else {
              console.log(`失败,${JSON.stringify(data)}`)
            }


          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function getcode() {
  return new Promise(async (resolve) => {
    let options = taskGetUrl("signBeanGroupStageIndex", `{"rnVersion":"3.9","fp":"-1","shshshfp":"-1","shshshfpa":"-1","referUrl":"-1","userAgent":"-1","jda":"-1","monitor_source":"bean_m_bean_index","monitor_refer":""}`)
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // data = data.replace("jsonp_1625224497986_65507(", "").replace(");", '');
            //  console.log(JSON.parse(data))
            if (data && safeGet(data)) {
              data = JSON.parse(data);
              if (data.code == 0) {
                if (data.data.jklInfo) {
                  actId = data.data.jklInfo.keyId;
                }
                if (data.data.shareCode && data.data.groupCode) {
                  helpArr.push({ shareCode: data.data.shareCode, groupCodeID: data.data.groupCode })
                  message += `shareCode：${JSON.stringify(data.data.shareCode)}\n}`
                  message += `groupCode：${JSON.stringify(data.data.groupCode)}\n}`
                  console.log(`您的互助码为：shareCode=${JSON.stringify(data.data.shareCode)}，groupCode=${JSON.stringify(data.data.groupCode)}\n\n`);
                } else {
                  console.log(`未获取到互助码，进行自动开团\n\n`);
                  hitGroup();
                }
              } else {//助力过该好友
                // message += `助力错误：${JSON.stringify(data.data.helpResult.errMsg)}\n}`
                console.log(`获取互助码结果：${JSON.stringify(data)}\n\n`)
              }
            } else {
              console.log(`失败,${JSON.stringify(data)}`)
            }
          } else {
            console.log("互助码结果：", data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    });
  });
}


function hitGroup() {
  return new Promise(resolve => {
    const body = { "activeType": 2, };
    $.get(taskGetUrl('signGroupHit', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`${JSON.stringify(data)}`)
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.respCode === "SG150") {
              let { shareCode, groupCode } = data.data.signGroupMain
              if (shareCode) {
                helpArr.push({ shareCode: shareCode, groupCodeID: groupCode })
                console.log('开团成功')
                console.log(`\n京东账号${$.index} ${$.nickName || $.UserName} 抢京豆邀请码：${shareCode}\n`);
              } else {
                console.log(`为获取到助力码，错误信息${JSON.stringify(data.data)}`)
              }
            } else {
              console.log(`开团失败，错误信息${JSON.stringify(data.data)}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}


function taskUrl(function_id, body) {
  return {
    url: `${JD_API_HOST}client.action?functionId=${function_id}&body=${encodeURIComponent(body)}&appid=ld&client=android&clientVersion=10.0.4`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    }
  }
}


function taskGetUrl(function_id, body) {
  return {
    url: `${JD_API_HOST}client.action?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&clientVersion=9.2.0`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
      'Accept-Language': 'zh-Hans-CN;q=1,en-CN;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': "application/x-www-form-urlencoded"
    }
  }
}



function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}

// prettier-ignore
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
