import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
var SupabaseUrl = "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com";
var SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImV4cCI6MzI4ODM0Njc1NywiaWF0IjoxNzExNTQ2NzU3LCJpc3MiOiJzdXBhYmFzZSJ9.iee2MqZMWv-d3mRWC0YPdaganE9y58EEcw3xEh4aNk8";
const supabase = createClient(SupabaseUrl, SupabaseKey);
import {convertToHTML} from "./markdown.js";
//多次调用
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
  date.setTime(date.getTime()+expires_time);
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
//全局变量
var cookies = decodeURI(document.cookie).split("; ");
var posting_id = window.location.search.split("&")[0].split("=")[1];
var poster_id = window.location.search.split("&")[1].split("=")[1];
var userName = cookieGet("userName");
var password = cookieGet("password");
var u_id = cookieGet("id");
var isLoggedIn = !(userName==null||userName==undefined);

cookieDelete("user_name")//删除曾经已游客名称登录的cookie
var userNameDom = document.getElementById("userName");
var part_1 = document.getElementsByClassName("dashboard_part_1")[0];
if(isLoggedIn){
  userNameDom.innerHTML = `<a href="space.html" target="_blank">${userName}</a>`;
  var {data,error} = await supabase.from('user').select('password,post,support,avatar,intro').eq('id',u_id);
  if(password != data[0].password){
    alert("密码错误！请重新登录");
    cookieDelete("userName");
    cookieDelete("password");
    cookieDelete("id");
    setTimeout(function(){location.reload();},2500)
  }
  console.log(`已登录！name：${userName}，id：${u_id}，password：${password}，密码是否正确：${password==data[0].password}`);
}else{
  document.getElementsByClassName("postButton")[0].style.cursor = "not-allowed";
  console.log("求求你注册一个账号吧~ o(TﾍTo)");
}

var emojiArray = ["angry","anguished","anxious","beaming_smiling_eyes","broken_heart","clown","confused","disappointed","expressionless","blowing_a_kiss","exhaling","holding_back_tears","savoring_food","screaming_in_fear","vomiting","hand_over_mouth","head-bandage","open_eyes_hand_over_mouth","peeking_eye","raised_eyebrow","rolling_eyes","spiral_eyes","steam_from_nose","symbols_on_mouth","tears_of_joy","fearful","flushed","frowning","ghost","grimacing","grinning_smiling_eyes_1","grinning_sweat","hear-no-evil_monkey_1","hot","hundred_points","kissing_smiling_eyes","knocked-out","loudly_crying","money-mouth","nerd","neutral","persevering","pile_of_poo","pleading_1","pouting","red_heart_1","relieved","rolling_on_the_floor_laughing","sad_but_relieved","saluting","see-no-evil_monkey","shushing","sleeping","slightly_frowning","smiling_heart-eyes","smiling_smiling_eyes","smiling_sunglasses","smirking","speak-no-evil_monkey","squinting_tongue","sweat_droplets","thinking","unamused","upside-down","winking","worried","yawning","zany"];
var posting_supported = cookieGet("support");
if(posting_supported!=undefined){posting_supported = JSON.parse(posting_supported);}else{posting_supported=[]}
async function getPosting(){
  var posting = document.getElementById("posting");
  var { data, error } = await supabase.from('posting').select().eq("t",posting_id);
  var time_ms = data[0].t,
    content = data[0].c,
    support = data[0].s,
    reply = data[0].r,
    id = data[0].u,
    pv = data[0].pv+1,
    time = timeConverter(time_ms);
  var {error} = await supabase.from('posting').update({pv: pv}).eq('t',posting_id);//浏览数+1
  var {data} = await supabase.from('user').select('u_name,avatar').eq("id",id);//将uid和uname关联
  if(data[0].avatar == null){data[0].avatar="//www.tianya.im/avatar/6/63/18310/100";}
  var user = {name: data[0].u_name,avatar: data[0].avatar};
  for(var each=emojiArray.length;each>0;each--){
    var regex = new RegExp(`:${emojiArray[each-1]}:`, 'g');
    content = content.replace(regex,`<div class="post_emoji" style="background-position-x: ${(each-1)*-20}px;"></div>`);
  }
  posting.innerHTML = `<div class="post_avatar" style="background-image: url(${user.avatar})"></div>
  <div class='post_header'><b>${user.name}</b><small>${time}</small></div>
  <div class="post_message">${content}</div>
  <div class="post_actions"><a href="javascript:void(0);" id="${time_ms}" class="support_n" name="${id}">${support}</a><a href="javascrpit:void(0);" class="reply">${reply}</a><a class="pv">${pv}</a></div>`;
  
  for(var t=0;t<posting_supported.length;t++){
    if(posting_supported[t] == time_ms){document.getElementById(time_ms).className="support_y";}
  }
  document.getElementById(time_ms).onclick = async function(){
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
    cookieSet(content,365*24*60*60000);
  }
  document.getElementsByClassName("reply")[0].onclick = function(){
    discuss_at_id = undefined;
    document.getElementById("post_value").placeholder = `发布一条评论吧`;
  }
}
getPosting();

async function getPoster(){
  var {data,error} = await supabase.from('user').select('u_name,post,support,avatar,intro').eq('id',poster_id);
  if(data[0].intro == null){data[0].intro = "还没有简介呢";}
  part_1.innerHTML = `<div class="userColumn"><div><b>${data[0].u_name}</b><p>${data[0].intro}</p></div></div>
    <div class="profile"><div><b>${data[0].post}</b><p>帖子</p></div><div><b>${data[0].support}</b><p>获赞</p></div></div>`;
}
getPoster();

var order = {key:"t",order:true};//排序标准默认是时间
var discuss_at_id;//回复的对象
async function getReply(){
  var reply = document.getElementById("reply");
  var {data, error} = await supabase.from('reply').select().eq('at',posting_id);
  var dArray = data;
  sortArray(dArray,order);
  var {data} = await supabase.from('discuss').select('*');
  var discuss_array = data;
  var {data} = await supabase.from('user').select('u_name,id,avatar');
  sortArray(data,{key:"id",order:true});
  reply.innerHTML = `<div class="text_reply">回复：</div>`;
  for(var i=dArray.length;i--;i>0){
    if(dArray[i].at != posting_id){continue;}
    var time_ms = dArray[i].t,
      content = dArray[i].c,
      support = dArray[i].s,
      id = dArray[i].u,
      time = timeConverter(time_ms);
    if(data[id].avatar == null){data[id].avatar="//www.tianya.im/avatar/6/63/18310/100";}
    var user = {name: data[id].u_name,avatar: data[id].avatar};
    for(var each=emojiArray.length;each>0;each--){
      var regex = new RegExp(`:${emojiArray[each-1]}:`, 'g');
      content = content.replace(regex,`<div class="post_emoji" style="background-position-x: ${(each-1)*-20}px;"></div>`);
    }
    var postingDiv = document.createElement("div");
    postingDiv.classList.add("reply_div");
    postingDiv.innerHTML = `<div class="post_avatar" style="background-image: url(${user.avatar})"></div>
    <div class='post_header'><b>${user.name}</b><small>${time}</small></div>
    <div class="post_message">${content}</div>
    <div class="post_actions"><a href="javascript:void(0);" id="${time_ms}" class="support_n" name="${id}">${support}</a><a href="javascript:void(0)" class="discuss" name="${user.name}">@</a><a></a></div>`;
    reply.appendChild(postingDiv);
    
    for(var t=0;t<discuss_array.length;t++){
      if(discuss_array[t].at == time_ms){
        var div = document.createElement("div");
        div.classList.add("discuss_div");
        var time = new Date(discuss_array[t].t).toLocaleString().slice(0,-3);
        div.innerHTML = `<div class="post_avatar" style="background-image: url(${user.avatar})"></div>
          <div class='post_header'><b>${data[discuss_array[t].u].u_name}</b><small>${time}</small></div>
          <div class="post_message">${discuss_array[t].c}</div>`
        postingDiv.appendChild(div);
      }
    }
    for(var t=0;t<posting_supported.length;t++){
      if(posting_supported[t] == time_ms){document.getElementById(time_ms).className="support_y";}
    }
    document.getElementById(time_ms).addEventListener("click",async function(){
      var replyId = this.id;
      var sender_id = this.name;
      if(this.className=="support_y"){
        this.innerHTML--;
        this.className = "support_n";
        posting_supported = posting_supported.filter(item => item != replyId);
        var {data,error} = await supabase.from('user').select('support').eq('id',sender_id);
        var {error} = await supabase.from('user').update({support:(data[0].support-1)}).eq('id',sender_id);
      }else{
        this.innerHTML++;
        this.className = "support_y";
        posting_supported.push(replyId);
        var {data,error} = await supabase.from('user').select('support').eq('id',sender_id);
        var {error} = await supabase.from('user').update({support:(data[0].support+1)}).eq('id',sender_id);
      }
      var {error} = await supabase.from('reply').update({s:this.innerHTML}).eq('t',replyId);
      var content = "support="+JSON.stringify(posting_supported)+";";
      cookieSet(content,365*24*60*60000);
    })
    var discuss = document.getElementsByClassName("discuss");
    discuss[discuss.length-1].onclick = function(){
      var discuss_at_user = this.name;
      discuss_at_id = this.previousElementSibling.id;
      document.getElementById("post_value").placeholder = `回复 @${discuss_at_user}：`;
    }
  }
}
getReply();
var textarea = document.getElementById("post_value");
var isPosted = false;
document.getElementById("post").onclick = async function send(){
  var content = textarea.value;
  var notNull = /[^ ]/g;
  if(content==""||!notNull.test(content)){alert("内容不能为空");return;}
  var time = new Date().getTime();
  if(!isPosted){isPosted = true;setTimeout(function(){isPosted = false},3000);}else{return;}//防止用户不小心重复发帖
  if(discuss_at_id != undefined){
    var {error} = await supabase.from('discuss').insert({u:u_id,c:content,at:discuss_at_id});
  }else{
    var {error} = await supabase.from('reply').insert({u:u_id,c:content,t:time,at:posting_id});
  }
  var {error} = await supabase.from('posting').update({r: (document.getElementsByClassName("reply")[0].innerHTML+1)}).eq('t',posting_id);
  var {data,error} = await supabase.from('user').select('post').eq('id',u_id);//user的post数+1
  var {error} = await supabase.from('user').update({post: (data[0].post+1)}).eq('id',u_id);
  alert("已发送");
  
  order = {key: "t",order: true}
  document.getElementById("order").innerHTML = "新 /热";
  getReply();
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

document.getElementById("order").onclick = function(){
  this.innerHTML = (this.innerHTML=="新 /热") ? "热 /新" : "新 /热";
  order = (order.key=="t" && order.order==true) ? {key:"s",order:true} : {key:"t",order:true};
  getReply();
}
document.getElementById("style").onclick = function(){alert("还在开发中")}

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
//移动端滑出侧边栏
if(document.body.offsetWidth < 600){
  document.body.ontouchstart = function(){
    var startX = event.targetTouches[0].pageX;
    var startY = event.targetTouches[0].pageY;
    var endX;
    var endY;
    document.body.ontouchmove = function(){
      endX = event.targetTouches[0].pageX;
      endY = event.targetTouches[0].pageY;
    }
    document.body.ontouchend = function(){
      var posX = endX-startX;
      var posY = endY-startY;
      if(posY > 100 && Math.abs(posX) < Math.abs(posY)){}//下拉刷新页面
      if(posX > 100 && Math.abs(posX) > Math.abs(posY)){
        //右滑
      }else if(posX <-100 && Math.abs(posX) > Math.abs(posY)){
        //左滑出现用户栏
        document.getElementsByClassName("dashboard")[0].style.transform = "translateX(-100%)";
        var div = document.createElement("div");
        div.className = "bg";
        div.onclick = function(){
          document.getElementsByClassName("dashboard")[0].style.transform = "translateX(0%)";
          div.remove();
          div.onclick = null;
          document.getElementsByClassName("dashboard")[0].style.zIndex = "auto";
        }
        document.body.appendChild(div);
        //防止遮挡postdiv
        div.style.zIndex = 8;
        document.getElementsByClassName("dashboard")[0].style.zIndex = 9;
      }
      //解绑事件
      document.body.ontouchmove = null;
      document.body.ontouchend = null;
    }
  }
}