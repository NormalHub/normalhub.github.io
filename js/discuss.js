// 初始化&连接数据库
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2'
var SupabaseUrl = "https://kzicffnuaniysdkenbes.supabase.co";
var SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aWNmZm51YW5peXNka2VuYmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg2OTAwMzIsImV4cCI6MjAyNDI2NjAzMn0.Exr237hk8hYlEjP1ZvNigWSPGAe9ThIrQAiP9-WftFg";
const supabase = createClient(SupabaseUrl, SupabaseKey);

var url = window.location.search.slice(1).split("&&")[0];
var cookies = decodeURI(document.cookie).split("; ");

//多次调用
function getUserName(){
  for(var t=cookies.length;t--;t>0){
    if(cookies[t].indexOf("user_name")!=-1){var name = cookies[t].split("=")[1];}
  }
  var notNull = /[^ ]/g;
  if(name==""||name==null||!notNull.test(name)||name=="null"){
    var name = prompt("请输入用户名","游客"+Math.floor(Math.random()*5000));
    var date = new Date();
    date.setTime(date.getTime()+(365*24*3600000));
    var expires="expires="+date.toGMTString()+";";
    var content="user_name="+name+";";
    document.cookie=content+expires+"path=/";
  }
  return name;
}
function alertTip(text){
  var tip = document.createElement("div");
  tip.classList.add("waiting");
  tip.innerHTML = "<p>"+text+"</p>";
  document.body.appendChild(tip);
  setTimeout(function(){tip.style.opacity=0;},1000)
  setTimeout(function(){tip.remove();},2300)
}

var emoticonDiv = document.getElementById("emoticon");
function fillEmo(){
  for(var t=20;t--;t>0){
    var emoticon = document.createElement("div");
    emoticon.id = "[emo"+(t+1)+"]";
    var positionX = t%5;
    var positionY = parseInt((t-1)/5);
    emoticon.style.backgroundPosition = positionX*-35+"px "+positionY*-35+"px";
    emoticonDiv.insertBefore(emoticon,emoticonDiv.childNodes[0]);
    emoticon.onclick = function(){discussContent.value+=this.id;}
  }
}
fillEmo();
var discussContent = document.getElementById("discussContent");
var discuss = document.getElementsByClassName("discuss")[0];
document.getElementsByClassName("emoticon")[0].onmouseenter = function displayEmoDiv(){
  document.body.addEventListener("click",function none(){
    emoticonDiv.style.display = "none";
    document.body.removeEventListener("click",none)
  })
  emoticonDiv.style.display = "block";
  emoticonDiv.style.bottom = 40+"px";
  if(event.clientY < emoticonDiv.offsetHeight){emoticonDiv.style.bottom = 7-emoticonDiv.offsetHeight+"px";}
}
document.getElementById("send").onclick = async function sendDiscussion(){
  if(url==""){alertTip("视频不存在，不能评论");return;}
  
  var user = getUserName();
  if(user==null){return;}
  
  var content = discussContent.value;
  var notNull = /[^ ]/g;
  if(content==""||!notNull.test(content)){alertTip("评论不能为空");return;}
  
  alertTip("正在发往服务器……");
  var time = new Date().getTime();
  const { error } = await supabase.from('discussion').insert({url:url, user:user, content:content, time:time});
  alertTip("完成！");
  var discussion = [{user:user,content:content,time:time}]
  loadDiscussion(discussion);
}
async function loadDiscussion(data){
  var discussions = document.getElementById("discussions");
  var emoticonImage = ["[emo1\]","[emo2\]","[emo3\]","[emo4\]","[emo5\]","[emo6\]",
    "[emo7\]","[emo8\]","[emo9\]","[emo10\]","[emo11\]","[emo12\]","[emo13\]",
    "[emo14\]","[emo15\]","[emo16\]","[emo17\]","[emo18\]","[emo19\]","[emo20\]",]
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
    discussion.innerHTML='<div class="discussionUser">'+user+'：</div>\
      <div class="discussionContent"><p>'+date+'</p><div style="display:flex"><p>'+content+'</p></div></div>';
    discussions.appendChild(discussion);
  }
}
var {data,error} = await supabase.from('discussion').select().eq('url', url);
loadDiscussion(data);