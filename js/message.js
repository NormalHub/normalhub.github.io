import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
var SupabaseUrl = "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com";
var SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImV4cCI6MzI4ODM0Njc1NywiaWF0IjoxNzExNTQ2NzU3LCJpc3MiOiJzdXBhYmFzZSJ9.iee2MqZMWv-d3mRWC0YPdaganE9y58EEcw3xEh4aNk8";
const supabase = createClient(SupabaseUrl, SupabaseKey);
//重复调用的函数
function timeConverter(time_number){var d = new Date(Number(time_number));var year = d.getFullYear();var month = d.getMonth()+1;var day = d.getDate();var hour = d.getHours();var minute = d.getMinutes();if(month<10){month = "0" + month;}if(day<10){day = "0" + day;}if(hour<10){hour = "0" + hour;}if(minute<10){minute = "0" + minute;}var time_string = year+"/"+month+"/"+day+" "+hour+":"+minute;return time_string;}
function alert(c){var alertDiv = document.createElement("div");alertDiv.className = "alert";alertDiv.innerHTML = c;document.body.appendChild(alertDiv);setTimeout(function(){alertDiv.remove();},3000)}
function cookieSet(content,expires_time){var date = new Date();date.setTime(date.getTime()+expires_time*86400000);var expires="expires="+date.toGMTString()+";";document.cookie=content+expires;}
function cookieGet(keyword){var cookies = decodeURI(document.cookie).split("; ");for(var t=cookies.length;t--;t>0){if(cookies[t].indexOf(keyword)!=-1){return cookies[t].split("=")[1];}}}
function cookieDelete(keyword){document.cookie = `${keyword}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;}
function sortArray(array, bol){return array.sort((a,b)=>{const { key, order } = bol, valueA = a[key], valueB = b[key];return valueA < valueB ? (order ? -1 : 1) : valueA > valueB ? (order ? 1 : -1) : 0;});}

var userName = cookieGet("userName");
const password = cookieGet("password");
const u_id = cookieGet("id");
const chatreciver = location.search.slice(1);
const isLoggedIn = !!(userName&&password&&u_id);
const isLoginToday = cookieGet("isLoginToday");

var useravatarDom = document.getElementsByClassName("userAvatar")[0];
const lvlist = [0,100,555,1450,5834,10000,24096];
if(isLoggedIn){
  const {data} = await supabase.rpc('check_password',{uid:Number(u_id),password:password});
  const avatar = (data.avatar) ? `https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/${u_id}.png` : "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/默认.png";
  if(!data){
    alert("密码错误！请重新登录");
    isLoggedIn=false;
    cookieDelete("userName");
    cookieDelete("password");
    cookieDelete("id");
    setTimeout(function(){location.reload();},2500)
  }
  useravatarDom.innerHTML = '';
  useravatarDom.style.backgroundImage = 'url('+avatar+')';
  useravatarDom.style.backgroundColor = '#fff';
  for(var t=6;t>-1;t--){if(lvlist[t]<data.exp){var lv = t+1;break;}}
  let div = document.createElement("div");
  div.className = "userBoard";
  div.innerHTML = `<div class="lv${lv}"><b>${userName}</b></div><progress value="${data.exp}" max="${lvlist[lv]}"></progress>
  <p id="loginButton">☐ 每日签到</p>
  <a href="space.html" target="_blank">⌂ 个人中心</a>
  <a href="message.html" target="_blank">✉ 消息通知</a>
  <a href="space.html" target="_blank">☰ 帖子管理</a>
  <a href="javascript:void(0);" onclick="document.cookie='userName=;expires=Thu, 01 Jan 1970 00:00:00 GMT;';location.reload();">⮐ 退出登录</a>`;
  document.body.appendChild(div);
  document.getElementById("loginButton").onclick = login;
  let timer;
  useravatarDom.onmouseover = function(){
    clearTimeout(timer);
    if(div.style.display == "block"){return;}
    div.style.display = "block";
    useravatarDom.onmouseout = function(){
      timer=setTimeout(function(){div.style.display="none";this.onmouseout=null;div.onmouseover=null;},1000);div.onmouseover = function(){clearTimeout(timer);div.onmouseout= function(){timer=setTimeout(function(){div.style.display="none";this.onmouseout=null;this.onmouseover = null;},500)}}
    }
  }
}

async function login(){
  if(!isLoggedIn){alert("点击右上角登录后才可以签到");return;}
  var dom = document.getElementById("loginButton");
  if(isLoginToday){dom.innerHTML = `☑ 今日已签`;return;}
  const date = new Date(new Date().setHours(0,0,0,0)+86400000).toGMTString();
  document.cookie= `isLoginToday=y;expires=${date};`;
  dom.innerHTML = "加载中...";
  const login = await supabase.rpc('login',{uid:u_id})
  dom.innerHTML = login.data;
  if(login.data == "签到成功"){alert("经验 +15")}
}

const taglist = document.getElementsByClassName("side-bar")[0].getElementsByTagName("li");
const main = document.getElementsByClassName("main")[0];
const list = ["获赞","回复","@"];
let message = null;
for(let t=taglist.length;t--;t>0){
  taglist[t].onclick = async function(){
    for(let each of taglist){each.style.color = "unset";}
    this.style.color = "#4daeff";
    if(!message){await getmessage();}
    let content;
    main.innerHTML = "";
    if(t==3){chat();return;}
    for(let t2=message[t].length;t2--;t2>0){
      let div = document.createElement("div");
      content = message[t][t2].content ? message[t][t2].content : "";
      div.className = "messagediv";
      div.innerHTML = `<p style="margin-bottom:0 0 1em"><b>#${message[t][t2].poster}</b>${list[t]}了你</p><p class="content">${content}</p><small>${message[t][t2].time}</small>`;
      main.appendChild(div);
    }
  }
}

function chat(){
  main.innerHTML = `<div class="chatside"></div>
  <div class="chatmain"><div class="chattitle"></div><div class="chatbar"></div><div class="chatinput"><textarea id="chattextarea"></textarea><div id="send"></div></div></div>`;
  const chatside=document.getElementsByClassName("chatside")[0],chattitle=document.getElementsByClassName("chattitle")[0],chatbar= document.getElementsByClassName("chatbar")[0];
  const grouped = message[3].reduce((acc, cur) => {
    const key = [cur.poster, cur.receive].sort().join('-');
    (acc[key] = acc[key] || []).unshift(cur);
    return acc;
  }, {});
  message[3] = Object.values(grouped);
  let r=-1;
  for(let t=message[3].length;t--;t>0){
    let div = document.createElement("div");
    if(message[3][t][0].poster == u_id){div.innerHTML = message[3][t][0].receive;}else{div.innerHTML = message[3][t][0].poster;}
    chatside.appendChild(div);
    div.onclick = function(){
      r = (message[3][t][0].poster == u_id) ? message[3][t][0].receive : message[3][t][0].poster;
      chattitle.innerHTML = (message[3][t][0].poster == u_id) ? message[3][t][0].receive : message[3][t][0].poster;
      chatbar.innerHTML="";
      for(let t2=message[3][t].length;t2--;t2>0){
        var div = document.createElement("div");
        if(message[3][t][t2].poster==u_id){div.className="me";}else{div.className="notme";}
        div.innerHTML = "<div class='mdiv'>"+message[3][t][t2].content+"</div>";
        chatbar.appendChild(div); 
      }
    }
  }
  document.getElementById("send").onclick = async function(){
    let content = document.getElementById("chattextarea").value,notNull = /[^ ]/g;
    if(content==""||!notNull.test(content)){alert("内容不能为空");return;}
    const post = await supabase.from('message').insert({type:3,poster:Number(u_id),content:content,receiver:r});
    document.getElementById("chattextarea").value = "";
    let div = document.createElement("div");
    div.className = "me";
    div.innerHTML = "<div class='mdiv'>"+content+"</div>";
    chatbar.appendChild(div);
    content = null;
    notNull = null;
    div = null;
  }
}
async function getmessage(){
  const {data,error} = await supabase.rpc("message",{uid:Number(u_id),upassword:password});
  message = [[],[],[],[]];
  if(chatreciver){message[3].unshift({mid: -1,type: "3",receive: chatreciver,poster: u_id,content: null,time: "2024-09-16",isread: false});}
  for(var each of data){message[each.type].push(each);}
  getmessage = null;
}


//百度统计
if(location.href.indexOf("www.kingdinner.top")!=-1){
  var _hmt = _hmt || [];
  (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?174786ee7cb4743d7dfd121a237e550e";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
  })();
  console.log("网站统计已开启");
}