console.log("你想干什么？＼(º □ º l|l)/")
import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
var SupabaseUrl = "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com";
var SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImV4cCI6MzI4ODM0Njc1NywiaWF0IjoxNzExNTQ2NzU3LCJpc3MiOiJzdXBhYmFzZSJ9.iee2MqZMWv-d3mRWC0YPdaganE9y58EEcw3xEh4aNk8";
const supabase = createClient(SupabaseUrl, SupabaseKey);
//重复调用的函数
function timeConverter(time_number){
  var d = new Date();
  d.setTime(Number(time_number));
  var year = d.getFullYear();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var hour = d.getHours();
  var minute = d.getMinutes();
  if(month<10){month = "0" + month;}
  if(day<10){day = "0" + day;}
  if(hour<10){hour = "0" + hour;}
  if(minute<10){minute = "0" + minute;}
  var time_string = year+"/"+month+"/"+day+" "+hour+":"+minute;
  return time_string;
}
function alert(c){
  var alertDiv = document.createElement("div");
  alertDiv.className = "alert";
  alertDiv.innerHTML = c;
  document.body.appendChild(alertDiv);
  setTimeout(function(){alertDiv.remove();},3000)
}
function cookieSet(content,expires_time){
  var date = new Date();
  date.setTime(date.getTime()+expires_time*86400000);
  var expires="expires="+date.toGMTString()+";";
  document.cookie=content+expires;
  console.log(`已成功设置cookie：${content}`)
}
function cookieGet(keyword){
  var cookies = decodeURI(document.cookie).split("; ");
  for(var t=cookies.length;t--;t>0){if(cookies[t].indexOf(keyword)!=-1){return cookies[t].split("=")[1];}}
}
function cookieDelete(keyword){
  document.cookie = `${keyword}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
function sortArray(array, bol) {
  return array.sort((a, b) => {
  const { key, order } = bol, valueA = a[key], valueB = b[key];
  return valueA < valueB ? (order ? -1 : 1) : valueA > valueB ? (order ? 1 : -1) : 0;
  })
}
var userName = cookieGet("userName");
const password = cookieGet("password");
const u_id = cookieGet("id");
const isLoggedIn = !(userName==null||userName==undefined);
const isLogin = cookieGet("isLogin")

var userNameDom = document.getElementById("userName");
var part_1 = document.getElementsByClassName("dashboard_part_1")[0];
if(isLoggedIn){
  userNameDom.innerHTML = `<a href="space.html" target="_blank">${userName}</a>`;
  const {data,error} = await supabase.from('user').select('post,support,avatar,intro').eq('id',u_id);
  const avatar = (data[0].avatar) ? `https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/${u_id}.png` : "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/默认.png";
  const check_password = await supabase.rpc('check_password',{input_u_name:userName,input_password:password})
  if(!check_password.data){
    alert("密码错误！请重新登录");
    isLoggedIn=false;
    cookieDelete("userName");
    cookieDelete("password");
    cookieDelete("id");
    setTimeout(function(){location.reload();},2500)
  }
  if(data[0].intro == null){data[0].intro = "还没有简介呢";}
  part_1.innerHTML = `<div class="userColumn"><div class="avatar" style="background-image:url(${avatar})"></div><div><b>${userName}</b><p>${data[0].intro}</p></div></div>
    <div class="profile"><div><b>${data[0].post}</b><p>帖子</p></div><div><b>${data[0].support}</b><p>获赞</p></div></div>
    <div class="postButton">发帖</div><div id="loginButton">签到</div>
  `;
}else{
  document.getElementsByClassName("postButton")[0].style.cursor = "not-allowed";
  document.getElementById("loginButton").style.cursor = "not-allowed";
  console.log("求求你注册一个账号吧~ o(TﾍTo)");
}

//获取帖子
var order = {key:"t",order:true};//排序标准默认是时间
var emojiArray = ["angry","anguished","anxious","beaming_smiling_eyes","broken_heart","clown","confused","disappointed","expressionless","blowing_a_kiss","exhaling","holding_back_tears","savoring_food","screaming_in_fear","vomiting","hand_over_mouth","head-bandage","open_eyes_hand_over_mouth","peeking_eye","raised_eyebrow","rolling_eyes","spiral_eyes","steam_from_nose","symbols_on_mouth","tears_of_joy","fearful","flushed","frowning","ghost","grimacing","grinning_smiling_eyes_1","grinning_sweat","hear-no-evil_monkey_1","hot","hundred_points","kissing_smiling_eyes","knocked-out","loudly_crying","money-mouth","nerd","neutral","persevering","pile_of_poo","pleading_1","pouting","red_heart_1","relieved","rolling_on_the_floor_laughing","sad_but_relieved","saluting","see-no-evil_monkey","shushing","sleeping","slightly_frowning","smiling_heart-eyes","smiling_smiling_eyes","smiling_sunglasses","smirking","speak-no-evil_monkey","squinting_tongue","sweat_droplets","thinking","unamused","upside-down","winking","worried","yawning","zany"];
async function getPostings(){
  var postings = document.getElementById("postings");
  var posting_supported = cookieGet("support");
  if(posting_supported!=undefined){posting_supported = JSON.parse(posting_supported);}else{posting_supported=[]}
  var {data,error} = await supabase.from('posting').select();
  var dArray = data;
  var {data} = await supabase.from('user').select('u_name,id,avatar');//将uid和uname关联
  sortArray(dArray,order);
  sortArray(data,{key:"id",order:true});
  postings.innerHTML = "";
  for(var i=dArray.length;i--;i>0){
    var time_ms = dArray[i].t,
      content = dArray[i].c,
      support = dArray[i].s,
      reply = dArray[i].r,
      id = dArray[i].u,
      pv = dArray[i].PV,
      time = timeConverter(time_ms);
    var avatar = (data[id].avatar) ? `https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/${id}.png` : "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/默认.png";
    var user = data[id].u_name;
    for(var each=emojiArray.length;each>0;each--){
      var regex = new RegExp(`:${emojiArray[each-1]}:`, 'g');
      content = content.replace(regex,`<div class="post_emoji" style="background-position-x: ${(each-1)*-20}px;"></div>`);
    }
    var postingDiv = document.createElement("div");
    postingDiv.classList.add("postingdiv");
    postingDiv.innerHTML = `<div class="post_avatar" style="background-image: url(${avatar})"></div>
    <div class='post-header'><a target="_bank" href="./space.html?u=${user}" style="font-weight: bold;">${user}</a><small>${time}</small></div>
    <div class="post_message">${content}</div>
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
    var {error} = await supabase.from('posting').insert({u:u_id,c:content,t:time});
    alert("已发送");
    var {data,error} = await supabase.from('user').select('post').eq('id',u_id);//user的post数+1
    var {error} = await supabase.from('user').update({post: (data[0].post+1)}).eq('id',u_id);
    
    bg.remove();//在页面上显示帖子
    order = {key: "t",order: true}
    document.getElementById("order").innerHTML = "新 /热";
    getPostings();
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
document.getElementById("loginButton").onclick = debounce(async function login(){
  if(isLogin){this.innerHTML = "今日已签";return;}
  const login = await supabase.rpc('login',{uid:u_id})
  const date = new Date(new Date().setHours(0,0,0,0)+115200000).toGMTString();
  document.cookie= `isLogin=y;expires=${date};`;
  this.innerHTML = login.data;
  if(login.data == "签到成功"){alert("经验 +20")}
},500)

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

//防抖
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {func.apply(this, args);}, delay);
  };
}
window.onresize = debounce(usePhone,500);
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
