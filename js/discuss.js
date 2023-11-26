// 初始化&连接数据库
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
var project_url = "https://lcrqhaflehfcgocpqzvq.supabase.co";
var API_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcnFoYWZsZWhmY2dvY3BxenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM0Mzg5NjMsImV4cCI6MjAwOTAxNDk2M30.PzOWUAj9FdyOMq_sDspx0-rRf1lze78Eu8lCfjK3YIQ";
const supabase = createClient(project_url,API_key);

var url = window.location.search.slice(1);
var cookies = decodeURI(document.cookie).split("; ");
var user_name = document.getElementById("name");
function getName(){
  for(var times=cookies.length;times--;times>0){
    if(cookies[times].indexOf("user_name") !== -1){
      user_name.innerHTML = cookies[times].split("=")[1];
    }
  }
}
getName();
var emoticonDiv = document.getElementById("emoticon");
function fillEmo(){
  for(var t=20;t--;t>0){
    var emoticon = document.createElement("div");
    emoticon.id = "[emoticon_"+(t+1)+"]";
    emoticon.classList.add("emoticonImg");
    var positionX = t%5;
    var positionY = parseInt((t-1)/5);
    emoticon.style.backgroundPosition = positionX*-35+"px "+positionY*-35+"px";
    emoticonDiv.insertBefore(emoticon,emoticonDiv.childNodes[0]);
    emoticon.onclick = function(){
      discussContent.value = discussContent.value+this.id;
    }
  }
}
fillEmo();
var discussContent = document.getElementById("discussContent");
var discuss = document.getElementsByClassName("discuss")[0];
document.getElementById("displayEmo").onclick = function displayEmoDiv(){
  var t = 0;
  document.body.addEventListener("click",function none(){
    if(t>0){
      emoticonDiv.style.display = "none";
      document.body.removeEventListener("click",none)
    }
    t++;
  })
  emoticonDiv.style.display = "block";
  if(discuss.offsetTop+discuss.offsetHeight > window.innerHeight){
    emoticonDiv.style.bottom = 7-emoticonDiv.offsetHeight+"px";
  }else{
    emoticonDiv.style.bottom = 40+"px";
  }
}
document.getElementById("send").onclick = async function sendDiscussion(){
  if(url==""){
    var tip = document.createElement("div");
    tip.classList.add("waiting");
    tip.style.opacity = 1;
    tip.innerHTML = "<p>视频不存在，不能评论</p>";
    document.body.appendChild(tip);
    setTimeout(function(){tip.style.opacity=0;},1500)
    setTimeout(function(){tip.remove();},2300)
    return;
  }
  var user = user_name.innerHTML;
  if(user==""){
    var id = Math.floor(Math.random()*10000);
    var user = prompt("请输入用户名","游客"+id);
  }
  var content = discussContent.value;
  
  var notNull = /[^ ]/g;
  if(content=="" || !notNull.test(content)){
    var tip = document.createElement("div");
    tip.classList.add("waiting");
    tip.style.opacity = 1;
    tip.innerHTML = "<p>评论不能为空</p>";
    document.body.appendChild(tip);
    setTimeout(function(){tip.style.opacity=0;},1500)
    setTimeout(function(){tip.remove();},2300)
    return;
  }
  var time = new Date().getTime();
  var tip = document.createElement("div");
  tip.classList.add("waiting");
  tip.style.opacity = 1;
  tip.innerHTML = "<p>服务器响应中……</p>";
  document.body.appendChild(tip);
  setTimeout(function(){tip.innerHTML="<p>完成！</p>";},1000)
  setTimeout(function(){tip.style.opacity=0;},2000)
  setTimeout(function(){tip.remove();},2300)
  const { error } = await supabase
    .from('discussion')
    .insert({ url:url, user:user, content:content, time:time });
}
async function loadDiscussion(){
  var discussions = document.getElementById("discussions");
  const { data, error } = await supabase
    .from('discussion')
    .select()
    .eq('url', url);
  var emoticonImage = ["[emoticon_1\]","[emoticon_2\]","[emoticon_3\]","[emoticon_4\]","[emoticon_5\]","[emoticon_6\]",
    "[emoticon_7\]","[emoticon_8\]","[emoticon_9\]","[emoticon_10\]","[emoticon_11\]","[emoticon_12\]","[emoticon_13\]",
    "[emoticon_14\]","[emoticon_15\]","[emoticon_16\]","[emoticon_17\]","[emoticon_18\]","[emoticon_19\]","[emoticon_20\]",]
  for(var t=data.length;t--;t>0){
    var user = data[t].user;
    var content = data[t].content;
    for(var timesOfEmo = emoticonImage.length;timesOfEmo--;timesOfEmo>0){
      var positionX = (timesOfEmo%5)*-30+"px ";
      var positionY = parseInt((timesOfEmo-1)/5)*-30+"px";
      var content = content.replace(emoticonImage[timesOfEmo],"<div class='emoticonImgInDiscussion' style='background-position:"+positionX+positionY+"'></div>");
    }
    var time = new Date();
    time.setTime(data[t].time);
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var day = time.getDate();
    var hour = time.getHours();
    var minute = time.getMinutes();
    if(month<10){var month = "0" + month;}
    if(day<10){var day = "0" + day;}
    if(hour<10){var hour = "0" + hour;}
    if(minute<10){var minute = "0" + minute;}
    var date = year+"/"+month+"/"+day+" "+hour+":"+minute;
    
    var discussion = document.createElement("div");
    discussion.classList.add("discussion");
    discussion.innerHTML='<div class="discussionUser"><div class="avatar"></div><p>'+user+'</p></div>\
      <div class="discussionContent"><p>'+date+'</p><div style="display:flex"><p>'+content+'</p></div></div>';
    discussions.appendChild(discussion);
  }
}
loadDiscussion();