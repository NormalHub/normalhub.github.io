//初始化
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
var project_url = "https://lcrqhaflehfcgocpqzvq.supabase.co";
var API_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcnFoYWZsZWhmY2dvY3BxenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM0Mzg5NjMsImV4cCI6MjAwOTAxNDk2M30.PzOWUAj9FdyOMq_sDspx0-rRf1lze78Eu8lCfjK3YIQ";
const supabase = createClient(project_url,API_key);
//获取内容
function getOpus(){
  var opudiv=document.getElementsByClassName("opu")[0];
  var getOpus=new XMLHttpRequest();
  getOpus.open("GET", "./document/wokes", true);
  getOpus.onreadystatechange = function(){
    if(getOpus.readyState==4 && getOpus.status==200){
      var opus = getOpus.responseText.split("\n");
      for(var times=opus.length;times--;times>0){
        var opusInformation = opus[times].split("&&");
        var type=opusInformation[0].split("=")[1];
        var opusName=opusInformation[1].split("=")[1];
        var opusUrl=opusInformation[2].split("=")[1];
        var opusIntroduction=opusInformation[3].split("=")[1];
        var time=opusInformation[4].split("=")[1];
        wokes(type,opusName,opusUrl,opusIntroduction,time);
      }
    }
  };
  getOpus.send();
  var i=0;
  function wokes(type,opusName,opusUrl,opusIntroduction,time){
    i++;
    var box = document.createElement("a");
    box.classList.add("box");
    var typeElement = document.createElement("div");
    typeElement.classList.add("type");
    var title = document.createElement("div");
    title.classList.add("title");
    var timeElement = document.createElement("div");
    timeElement.innerHTML="上传时间："+time;
    typeElement.innerHTML=type;
    title.innerHTML=opusName;
    if(type=="视"){
      typeElement.style.background="#f9c534";
      box.href = "./video/?"+opusUrl;
    }else if(type=="文"){
      typeElement.style.background="#29b6f6";
      box.href = opusUrl;
    }
    box.appendChild(typeElement);
    box.appendChild(title);
    box.appendChild(timeElement);
    opudiv.appendChild(box);
  }
}
getOpus();
//获取帖子
async function getPostings(){
  var postings = document.getElementById("postings");
  const { data, error } = await supabase.from('posting').select();
  if(data.length != 0){
    postings.innerHTML= "";
  }  
  for(var i=data.length;i--;i>0){
    var time = data[i].time;
    var title = data[i].title;
    var sender = data[i].sender;
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
    var postingDiv = document.createElement("a");
    postingDiv.classList.add("postingdiv");
    postingDiv.href = "./posting.html?"+time;
    postingDiv.innerHTML = "<div>标题："+title+"</div><div>时间："+date+"</div><div>发帖人："+sender+"</div>";
    postings.appendChild(postingDiv);
  }
}
getPostings();
//发帖
var publishingPostElement = document.getElementsByClassName("publishingPost")[0];
publishingPostElement.style.height = "0px";
document.getElementsByClassName("postingsButton")[0].onclick = function(){
  publishingPostElement.style.height = (publishingPostElement.style.height=="0px") ? "400px" : "0px";
}
var cookies = decodeURI(document.cookie).split("; ")
document.getElementById("send").onclick = async function send(){
  var user = "";
  for(var t=cookies.length;t--;t>0){
    if(cookies[t].indexOf("user_name")!==-1){
      user = cookies[t].split("=")[1];
    }
  }
  if(user==""){
    var id = Math.floor(Math.random()*10000);
    var user = prompt("检测到未登录,请登录或直接输入名称","游客"+id);
  }
  var title = document.getElementById("title").value;
  var content = document.getElementById("content").value;
  function alertTip(tipContent){
    var tip = document.createElement("div");
    tip.classList.add("waiting");
    tip.style.opacity = 1;
    tip.innerHTML = "<p>"+tipContent+"</p>";
    document.body.appendChild(tip);
    setTimeout(function(){tip.style.opacity=0;},1500)
    setTimeout(function(){tip.remove();},2300)
  }
  var notNull = /[^ ]/g;
  if(content=="" || !notNull.test(content)){
    alertTip("帖子不能为空");
    return;
  }else if(title=="" || !notNull.test(title)){
    alertTip("标题不能为空");
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
    .from('posting')
    .insert({ sender:user, title:title, content:content, time:time });
}
//获取人数
async function getGuestNumber(){
  var {data,error} = await supabase.from('guestNumber').select("number");
  var number=data[0].number;
  var d=new Date();
  var date=d.getFullYear()+"/"+d.getMonth()+"/"+d.getDate();
  var {data,error}=await supabase.from('guestNumber').upsert({id:1, number:number+1, date:date}).select();
  document.getElementById("guestNumber").innerHTML=number+1;
  //16,23/11/25
}
getGuestNumber();