import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
var project_url = "https://lcrqhaflehfcgocpqzvq.supabase.co";
var API_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcnFoYWZsZWhmY2dvY3BxenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM0Mzg5NjMsImV4cCI6MjAwOTAxNDk2M30.PzOWUAj9FdyOMq_sDspx0-rRf1lze78Eu8lCfjK3YIQ";
const supabase = createClient(project_url,API_key);
async function getPosting(){
  const { data, error } = await supabase.from('posting').select();
  var time = window.location.search.slice(1);
  for(var t=data.length;t--;t>0){
    if(data[t].time==time){
      var time = data[t].time;
      var content = data[t].content;
      var sender = data[t].sender;
      var d = new Date();
      d.setTime(Number(time));
      var year = d.getFullYear();
      var month = d.getMonth()+1;
      var day = d.getDate();
      var hour = d.getHours();
      var minute = d.getMinutes();
      if(month<10){var month = "0" + month;}
      if(day<10){var day = "0" + day;}
      if(hour<10){var hour = "0" + hour;}
      if(minute<10){var minute = "0" + minute;}
      var date = year+"/"+month+"/"+day+" "+hour+":"+minute;var d = new Date();
      d.setTime(Number(time));
      var year = d.getFullYear();
      var month = d.getMonth()+1;
      var day = d.getDate();
      var hour = d.getHours();
      var minute = d.getMinutes();
      if(month<10){var month = "0" + month;}
      if(day<10){var day = "0" + day;}
      if(hour<10){var hour = "0" + hour;}
      if(minute<10){var minute = "0" + minute;}
      var date = year+"/"+month+"/"+day;
      document.getElementById("content").innerHTML = content;
      document.getElementById("description").innerHTML = sender+" "+date;
    }
    if(data[t].time.indexOf("follow"+time)!=-1){
      var element = document.createElement("div");
      element.innerHTML = data[t].sender+"："+data[t].content;
      document.getElementById("discussions").appendChild(element);
    }
  }
}
getPosting();
var cookies = decodeURI(document.cookie).split("; ");
document.getElementById("send").onclick = async function followPosting(){
  var user = "";
  for(var times=cookies.length;times--;times>0){
    if(cookies[times].indexOf("user_name") !== -1){user = cookies[times].split("=")[1];}
  }
  if(user == ""){
    var id = Math.floor(Math.random()*10000);
    user = prompt("检测到您未登录,请登录或输入用户名","游客"+id);
    var date = new Date();
    date.setTime(date.getTime()+(365*24*60*60000));
    var expires="expires="+date.toGMTString()+";";
    var content="user_name="+user+";";
    document.cookie=content+expires+"path=/";
  }
  var content = document.getElementById("discussContent").value;
  var notNull = /[^ ]/g;
  if(content=="" || !notNull.test(content)){
    var tip = document.createElement("div");
    tip.classList.add("waiting");
    tip.style.opacity = 1;
    tip.innerHTML = "<p>帖子不能为空</p>";
    document.body.appendChild(tip);
    setTimeout(function(){tip.style.opacity=0;},1500)
    setTimeout(function(){tip.remove();},2300)
    return;
  }
  var follow_time = window.location.search.slice(1);
  var time = new Date().getTime()+"follow"+follow_time;
  var tip = document.createElement("div");
  tip.classList.add("waiting");
  tip.style.opacity = 1;
  tip.innerHTML = "<p>服务器响应中……</p>";
  document.body.appendChild(tip);
  setTimeout(function(){tip.innerHTML="<p>完成！</p>";},1000)
  setTimeout(function(){tip.style.opacity=0;},2000)
  setTimeout(function(){tip.remove();},2300)
  const { error } = await supabase
    .from('posting')
    .insert({ content:content, time:time,sender:user });
}




