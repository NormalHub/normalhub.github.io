console.log("你想干什么？＼(º □ º l|l)/")
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
function sortArray(array, bol){return array.sort((a, b)=>{const { key, order } = bol, valueA = a[key], valueB = b[key];return valueA < valueB ? (order ? -1 : 1) : valueA > valueB ? (order ? 1 : -1) : 0;});}
function md(str){str = str.replace(/\\n/g, '<br/>');str = str.replace(/</g, '&lt');str = str.replace(/>/g, '&gt');str = str.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$1">$2</a>');str = str.replace(/i\[(.*?)\]/g, '[图片]');str = str.replace(/f\[(.*?)\]/g, '[框架]');str = str.replace(/\\n/g, '<br/>');return str;}

var userName = cookieGet("userName");
const password = cookieGet("password");
const u_id = cookieGet("id");
const isLoggedIn = !!(userName&&password&&u_id);
const isLoginToday = cookieGet("isLoginToday");

var useravatarDom = document.getElementsByClassName("userAvatar")[0];
const lvlist = [0,100,555,1450,5834,10000,24096];
if(isLoggedIn){
  const {data} = await supabase.rpc('check_password',{uid:Number(u_id),password:password});
  const avatar = (data.avatar) ? `https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/${u_id}.png` : "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/默认.png";
  if(!data){
    alert("密码错误！请重新登录");
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
}else{
  document.getElementsByClassName("postButton")[0].style.cursor = "not-allowed";
}
//获取帖子
var order = {key:"t",order:true};//排序标准默认是时间
var emojiArray = ["angry","anguished","anxious","beaming_smiling_eyes","broken_heart","clown","confused","disappointed","expressionless","blowing_a_kiss","exhaling","holding_back_tears","savoring_food","screaming_in_fear","vomiting","hand_over_mouth","head-bandage","open_eyes_hand_over_mouth","peeking_eye","raised_eyebrow","rolling_eyes","spiral_eyes","steam_from_nose","symbols_on_mouth","tears_of_joy","fearful","flushed","frowning","ghost","grimacing","grinning_smiling_eyes_1","grinning_sweat","hear-no-evil_monkey_1","hot","hundred_points","kissing_smiling_eyes","knocked-out","loudly_crying","money-mouth","nerd","neutral","persevering","pile_of_poo","pleading_1","pouting","red_heart_1","relieved","rolling_on_the_floor_laughing","sad_but_relieved","saluting","see-no-evil_monkey","shushing","sleeping","slightly_frowning","smiling_heart-eyes","smiling_smiling_eyes","smiling_sunglasses","smirking","speak-no-evil_monkey","squinting_tongue","sweat_droplets","thinking","unamused","upside-down","winking","worried","yawning","zany"];
var postings = document.getElementById("postings");
async function getPostings(){
  var {data} = await supabase.rpc('get_post');
  var posting_supported = cookieGet("support");
  if(posting_supported!=undefined){posting_supported = JSON.parse(posting_supported);}else{posting_supported=[]}
  sortArray(data,order);
  postings.innerHTML = "";
  for(var i=data.length;i--;i>0){
    var time_ms = data[i].t,
      content = data[i].c,
      support = data[i].s,
      reply = data[i].r,
      id = data[i].u,
      pv = data[i].PV,
      time = timeConverter(time_ms),
      user = data[i].u_name,
      exp = data[i].exp;
    var avatar = (data[i].avatar) ? `https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/${id}.png` : "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/默认.png";
    for(var each=emojiArray.length;each>0;each--){
      var regex = new RegExp(`:${emojiArray[each-1]}:`, 'g');
      content = content.replace(regex,`<div class="post_emoji" style="background-position-x: ${(each-1)*-20}px;"></div>`);
    }
    for(var t=6;t>-1;t--){if(lvlist[t]<exp){var lv = t+1;break;}}
    var postingDiv = document.createElement("div");
    postingDiv.classList.add("postingdiv");
    postingDiv.innerHTML = `<div class="post_avatar" style="background-image: url(${avatar})"></div>
    <div class='post-header'><a target="_bank" href="./space.html?u=${user}" style="font-weight: bold;" class="lv${lv}">${user}</a><small>${time}</small></div>
    <div class="post_message">${md(content)}</div>
    <div class="post-actions"><a href="javascript:void(0);" id="${time_ms}" class="support_n" name="${id}">${support}</a><a href="./t.html?id=${time_ms}&poster=${id}" target="_blank" class="reply">${reply}</a><a href="./t.html?id=${time_ms}&poster=${id}" target="_blank" class="more">查看详情</a></div>`;
    postings.appendChild(postingDiv);
    
    for(var t=0;t<posting_supported.length;t++){
      if(posting_supported[t] == time_ms){document.getElementById(time_ms).className="support_y";}
    }
    document.getElementById(time_ms).addEventListener("click",async function(){
      var postingId = this.id;
      var sender_id = this.name;
      if(this.className=="support_y"){
        this.innerHTML--;
        this.className = "support_n";
        posting_supported = posting_supported.filter(item => item != postingId);
        var {data,error} = await supabase.from('user').select('support').eq('id',sender_id);
        var {error} = await supabase.from('user').update({support:(data[0].support-1)}).eq('id',sender_id);
      }else{
        this.innerHTML++;
        this.className = "support_y";
        posting_supported.push(postingId);
        var {data,error} = await supabase.from('user').select('support').eq('id',sender_id);
        var {error} = await supabase.from('user').update({support:(data[0].support+1)}).eq('id',sender_id);
      }
      var {error} = await supabase.from('posting').update({s:this.innerHTML}).eq('t',postingId);
      var content = "support="+JSON.stringify(posting_supported)+";";
      cookieSet(content,365);
    })
  }
}
getPostings();
//发帖
document.getElementsByClassName("postButton")[0].onclick = function(){
  if(!isLoggedIn){alert("点右上角登录后才能发帖");return}
  var bg = document.createElement("div");
  bg.className = "bg";
  bg.innerHTML = `<div class="post">
    <div class="post_header"><p style="line-height: 10px;">请注意文明用语，谢谢！</p><p id="post_off">X</p></div>
    <textarea id="post_value" cols="30" rows="3"></textarea>
    <div class="ending">
      <div id="emoji">表情</div>
      <div class="emoji">
        <div class="emoji_header">
          <div style="font-size:20px" id="emoji_default">🙂</div>
          <div style="font-size:20px;color:red;" id="emoji_custom">❤</div>
          <div class="center"></div>
          <div id="emoji_off">X</div>
        </div>
        <div class="emoji_body"></div>
      </div>
      <div class="center"></div>
      <div id="post">发送</div>
    </div>
  </div>`;
  document.body.appendChild(bg);
  document.getElementById("post_off").onclick = function(){bg.remove();}
  var textarea = document.getElementById("post_value");
  var isPosted = false;
  document.getElementById("post").onclick = async function send(){
    var content = textarea.value;
    var notNull = /[^ ]/g;
    if(content==""||!notNull.test(content)){alert("内容不能为空");return;}
    var time = new Date().getTime();
    if(!isPosted){isPosted = true;setTimeout(function(){isPosted = false},3000);}else{return;}//防止用户不小心重复发帖
    const post = await supabase.rpc('create_post',{create_time:time,uid:Number(u_id),content:content});
    alert("已发送，经验 +25");
    bg.remove();//在页面上显示帖子
    var postingDiv = document.createElement("div");
    postingDiv.classList.add("postingdiv");
    postingDiv.innerHTML = `<div class="post_avatar"></div>
    <div class='post-header'><a target="_bank" href="./space.html?u=${userName}" style="font-weight: bold;">${userName}</a><small>${timeConverter(time)}</small></div>
    <div class="post_message">${content}</div>
    <div class="post-actions"><a href="javascript:void(0);" id="${time}" class="support_n" name="${u_id}">0</a><a href="./t.html?id=${time}&poster=${u_id}" target="_blank" class="reply">0</a><a href="./t.html?id=${time}&poster=${u_id}" target="_blank" class="more">查看详情</a></div>`;
    postings.insertBefore(postingDiv,postings.children[0]);
    postingDiv.firstChild.style.backgroundImage = document.getElementsByClassName("avatar")[0].style.backgroundImage;
    postingDiv.style.background = "aliceblue";
    location = "#postings";
    this.onclick = null;
    document.getElementById("emoji").onclick = null;
  }
  document.getElementById("emoji").onclick = function(){
    document.getElementsByClassName("emoji")[0].style.display = "block";
    var div = document.getElementsByClassName("emoji_body")[0];
    for(var each in emojiArray){
      var childDiv = document.createElement("div");
      childDiv.style.backgroundPositionX = each*-40+"px";
      childDiv.id = emojiArray[each];
      div.appendChild(childDiv);
    }
    div.onclick = function(){
      var char = ":"+event.target.id+":";
      var index = textarea.selectionStart;
      var str = textarea.value;
      textarea.value = str.slice(0, index) + char + str.slice(index);
      textarea.focus();
    }
    document.getElementById("emoji_default").onclick = function(){}
    document.getElementById("emoji_custom").onclick = function(){alert("开发中...")}
    document.getElementById("emoji_off").onclick = function(){document.getElementsByClassName("emoji")[0].style.display = "none";}
  }
}
/*
var postContent = document.getElementById('postContent');
var add_link = document.getElementsByClassName("");
add_link.onclick = function(){
  var selectedText = postContent.value.substring(postContent.selectionStart, postContent.selectionEnd);
  var link = prompt('Please enter jump link: ');
  postContent.value = postContent.value.substring(0, postContent.selectionStart) + `[${selectedText}](${link})` + postContent.value.substring(postContent.selectionEnd);
}
*/
//签到
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

document.getElementById("order").onclick = function(){
  this.innerHTML = (this.innerHTML=="新 /热") ? "热 /新" : "新 /热";
  order = (order.key=="t" && order.order==true) ? {key:"s",order:true} : {key:"t",order:true};
  getPostings();
}
document.getElementById("style").onclick = function(){alert("还在开发中")}

//搜素
document.getElementById("search").onclick = search;
function search(){
  var key = document.getElementById("searchInput").value;
  if(key==""){return;}
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.target = "_blank";
  a.href = "./search.html?"+key;
  a.click();
}
window.addEventListener("keydown",function(){
  var key = event.key;
  var element = document.activeElement;
  if(element.tagName == "INPUT"&&key == "Enter"){search();return;}
  if(element.parentElement.className == "discuss"&&key == "Enter"){document.getElementsByClassName("discuss")[0].children[1].click();return;}
});
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

function usePhone(){
  var dashboard = document.getElementsByClassName("dashboard")[0].style;
  document.body.ontouchstart = null;
  if(document.body.offsetWidth <= 600){
    var bool = false;//默认没有左滑打开侧边栏
    document.body.ontouchstart = function(){
      var startX = event.targetTouches[0].pageX,startY = event.targetTouches[0].pageY;
      var endX,endY;
      document.body.ontouchmove = function(){endX = event.targetTouches[0].pageX;endY = event.targetTouches[0].pageY;}
      document.body.ontouchend = function(){
        var posX = endX-startX,posY = endY-startY;
        if(posY > 100 && Math.abs(posX) < Math.abs(posY)){}//下拉刷新页面
        if(posX > 100 && Math.abs(posX) > Math.abs(posY)){
          //右滑
        }else if(posX <-100 && Math.abs(posX) > Math.abs(posY)){
          //左滑出现用户栏
          if(bool == true){return;}
          bool = true;
          dashboard.transform = "translateX(-100%)";
          var div = document.createElement("div");
          div.className = "bg";
          div.style.zIndex = 8;
          dashboard.zIndex = 9;
          div.onclick = function(){
            bool = false;
            dashboard.transform = "translateX(100%)";
            div.remove();
            dashboard.zIndex = 0;
            div.onclick = null;
          }
          document.body.appendChild(div);
        }
        //解绑事件
        document.body.ontouchmove = null;
        document.body.ontouchend = null;
      }
    }
  }else if(dashboard.transform == "translateX(100%)"){
    dashboard.transform = "translateX(0%)";
    dashboard.zIndex = 0;
  }
}
usePhone();
async function returnError(){
  var userAgent = navigator.userAgent+","+document.body.offsetWidth+""+document.body.offsetHeight;
  var c = document.getElementById("error").value;
  var {error} = await supabase.from('error').insert({equipment: userAgent,error: c});
}