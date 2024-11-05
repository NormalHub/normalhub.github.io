import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
var SupabaseUrl = "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com";
var SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImV4cCI6MzI4ODM0Njc1NywiaWF0IjoxNzExNTQ2NzU3LCJpc3MiOiJzdXBhYmFzZSJ9.iee2MqZMWv-d3mRWC0YPdaganE9y58EEcw3xEh4aNk8";
const supabase = createClient(SupabaseUrl, SupabaseKey);
//多次调用
function timeConverter(time_number){var d = new Date(Number(time_number));var year = d.getFullYear();var month = d.getMonth()+1;var day = d.getDate();var hour = d.getHours();var minute = d.getMinutes();if(month<10){month = "0" + month;}if(day<10){day = "0" + day;}if(hour<10){hour = "0" + hour;}if(minute<10){minute = "0" + minute;}var time_string = year+"/"+month+"/"+day+" "+hour+":"+minute;return time_string;}
function alert(c){var alertDiv = document.createElement("div");alertDiv.className = "alert";alertDiv.innerHTML = c;document.body.appendChild(alertDiv);setTimeout(function(){alertDiv.remove();},3000);}
function cookieSet(content,expires_time){var date = new Date();date.setTime(date.getTime()+expires_time);var expires="expires="+date.toGMTString()+";";document.cookie=content+expires;}
function cookieGet(keyword){var cookies = decodeURI(document.cookie).split("; ");for(var t=cookies.length;t--;t>0){if(cookies[t].indexOf(keyword)!=-1){return cookies[t].split("=")[1];}};}
function cookieDelete(keyword){document.cookie = `${keyword}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;}
function sortArray(array, bol){return array.sort((a, b)=>{const {key,order} = bol,valueA = a[key], valueB = b[key];return valueA < valueB ? (order ? -1 : 1) : valueA > valueB ? (order ? 1 : -1) : 0;})}
function md(str){str = str.replace(/\\n/g, '<br/>');str = str.replace(/</g, '&lt');str = str.replace(/>/g, '&gt');str = str.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$1">$2</a>');str = str.replace(/i\[(.*?)\]/g, '<img src="$1">');str = str.replace(/f\[(.*?)\]/g, '<iframe src="$1"></iframe>');return str;}
//全局变量
if(!window.location.search){location.href="www.kingdinner.top";}
var cookies = decodeURI(document.cookie).split("; ");
var posting_id = window.location.search.split("&")[0].split("=")[1];
var poster_id = window.location.search.split("&")[1].split("=")[1];
var userName = cookieGet("userName");
var password = cookieGet("password");
var u_id = cookieGet("id");
var isLoggedIn = !!(userName&&password&&u_id);
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
  if(isLoginToday){dom.innerHTML = "☑ 今日已签";return;}
  const date = new Date(new Date().setHours(0,0,0,0)+86400000).toGMTString();
  document.cookie= `isLoginToday=y;expires=${date};`;
  dom.innerHTML = "加载中...";
  const login = await supabase.rpc('login',{uid:u_id})
  dom.innerHTML = login.data;
  if(login.data == "签到成功"){alert("经验 +15")}
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
    time = timeConverter(time_ms);
  var {data} = await supabase.from('user').select('u_name,post,support,avatar,intro,exp').eq("id",id);//将uid和uname关联
  for(var t=6;t>-1;t--){if(lvlist[t]<data[0].exp){var lv = t+1;break;}}
  var avatar = (data[0].avatar) ? `https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/${id}.png` : "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/默认.png";
  var user = data[0].u_name;
  for(var each=emojiArray.length;each>0;each--){
    var regex = new RegExp(`:${emojiArray[each-1]}:`, 'g');
    content = content.replace(regex,`<div class="post_emoji" style="background-position-x: ${(each-1)*-20}px;"></div>`);
  }
  posting.innerHTML = `<div class="post_avatar" style="background-image:url(${avatar})"></div>
  <div class='post_header'><b class="lv${lv}">${user}</b><small>${time}</small></div>
  <div class="post_message">${md(content)}</div>
  <div class="post_actions"><span id="${time_ms}" class="support_n" name="${id}">${support}</span><span class="reply">${reply}</span><span id="more">≡</span></div>`;
  
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
  document.getElementById("more").onclick = function(){
    if(document.getElementById("moremenu")){return;}
    let div = document.createElement("div");
    div.id = "moremenu";
    document.getElementsByClassName("post_actions")[0].appendChild(div);
    var b=false;
    document.body.addEventListener('click', function handleClick(){if(b){div.remove();document.body.removeEventListener('click',handleClick);}else{b = true}});
    div.innerHTML = "<div id='share'>转发</div><div id='report'>举报</div><div id='delete'>删除</div>";
    document.getElementById('share').onclick = function(){if(navigator.clipboard){navigator.clipboard.writeText(location.href);alert("网址复制成功")}else{alert("浏览器不支持！可以手动复制地址栏的网址")}}
    document.getElementById('report').onclick = report;
    document.getElementById('delete').onclick = async function(){if(isLoggedIn){const {data} = await supabase.rpc('delete_post',{uid:Number(u_id),upassword:password,pid:posting_id});if(data.indexOf("success")!=-1){alert("删除成功");setTimeout("location.href='www.kingdinner.top'",1500)};}else{alert("error：未登录");}}
  }
  /*诈骗/钓鱼链接
  不实信息
  人身攻击
  侵犯隐私
  引战
  刷屏
  无关话题/水贴
  广告
  其它*/
}
getPosting();
function report(){
  var bg = document.createElement('div');
  bg.className = 'bg';
  document.body.appendChild(bg);
  bg.innerHTML = `<div class="report"><p>帖子：<input style="width:16em" value="${posting_id}" disabled></p>
    <p>类型：<br><input type="radio" name="report" value="1">诈骗/钓鱼链接<br><input type="radio" name="report" value="2">不实信息<br><input type="radio" name="report" value="3">人身攻击<br><input type="radio" name="report" value="4">侵犯隐私<br><input type="radio" name="report" value="5">引战<br><input type="radio" name="report" value="6">刷屏<br><input type="radio" name="report" value="7">无关话题/水贴<br><input type="radio" name="report" value="8">广告<br><input type="radio" name="report" value="9">其它</p>
    <p>详情：<input id="description" text="text"></p><button id="report_submit">提交</button><button style="margin:0 5px" id="cancel">取消</button></div>`;
  document.getElementById("report_submit").onclick = async function(){
    const radio = document.getElementsByName("report");
    let type = null;
    for(var t=radio.length;t>0;t--){if(radio[t-1].checked){type=radio[t-1].value;break;}}
    if(!type){alert("请选择类型");return;}
    const description = document.getElementById("description").value;
    if(type==9&&!description){alert("必须填写详情");return;}
    const {error} = await supabase.from('report').insert({url:posting_id,type:type,description:description,reporter:u_id});
    bg.remove();
  }
  var cancel = document.getElementById("cancel");
  cancel.onclick = function(){bg.remove();}
}
var order = {key:"t",order:true};//排序标准默认是时间
var discuss_at_id;//回复的对象
async function getReply(){
  var reply = document.getElementById("reply");
  var {data, error} = await supabase.from('reply').select().eq('at',posting_id);
  if(data.length == 0){return;}
  var dArray = data;
  sortArray(dArray,order);
  var {data} = await supabase.from('discuss').select('*');
  var discuss_array = data;
  var {data} = await supabase.from('user').select('u_name,id,avatar,exp');
  sortArray(data,{key:"id",order:true});
  reply.innerHTML = `<div class="text_reply">回复：</div>`;
  for(var i=dArray.length;i--;i>0){
    if(dArray[i].at != posting_id){continue;}
    var time_ms = dArray[i].t,
      content = dArray[i].c,
      support = dArray[i].s,
      id = dArray[i].u,
      time = timeConverter(time_ms);
    var avatar = (data[id].avatar) ? `https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/${id}.png` : "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/默认.png";
    var name = data[id].u_name;
    for(var t=6;t>-1;t--){if(lvlist[t]<data[id].exp){var lv = t+1;break;}}
    for(var each=emojiArray.length;each>0;each--){
      var regex = new RegExp(`:${emojiArray[each-1]}:`, 'g');
      content = content.replace(regex,`<div class="post_emoji" style="background-position-x: ${(each-1)*-20}px;"></div>`);
    }
    var postingDiv = document.createElement("div");
    postingDiv.classList.add("reply_div");
    postingDiv.innerHTML = `<div class="post_avatar" style="background-image: url(${avatar})"></div>
    <div class='post_header'><b class="lv${lv}">${name}</b><small>${time}</small></div>
    <div class="post_message">${content}</div>
    <div class="post_actions"><a href="javascript:void(0);" id="${time_ms}" class="support_n" name="${id}">${support}</a><a href="javascript:void(0)" class="discuss" name="${name}">@</a><a></a></div>`;
    reply.appendChild(postingDiv);
    
    for(var t=0;t<discuss_array.length;t++){
      if(discuss_array[t].at == time_ms){
        var div = document.createElement("div");
        div.classList.add("discuss_div");
        var time = new Date(discuss_array[t].t).toLocaleString().slice(0,-3);
        const avatar = (data[discuss_array[t].u].avatar) ? `https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/${id}.png` : "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/默认.png";
        div.innerHTML = `<div class="post_avatar" style="background-image: url(${avatar})"></div>
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
  if(!isLoggedIn){alert("登录后才能回复");return;}
  var content = textarea.value;
  var notNull = /[^ ]/g;
  if(content==""||!notNull.test(content)){alert("内容不能为空");return;}
  var time = new Date().getTime();
  if(!isPosted){isPosted = true;setTimeout(function(){isPosted = false},3000);}else{return;}//防止用户不小心重复发帖
  if(discuss_at_id != undefined){
    var {error} = await supabase.from('discuss').insert({u:u_id,c:content,at:discuss_at_id});
  }else{
    var {error} = await supabase.from('reply').insert({u:u_id,c:content,t:time,at:posting_id});
    var {data,error} = await supabase.from('user').select('post').eq('id',u_id);//只有在post下回复，user的post数才+1
    var {error} = await supabase.from('user').update({post: (data[0].post+1)}).eq('id',u_id);
  }
  var {error} = await supabase.from('posting').update({r: Number(document.getElementsByClassName("reply")[0].innerHTML)+1}).eq('t',posting_id);
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
document.getElementById("style").onclick = function(){alert("还在开发中");}

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