import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
var SupabaseUrl = "https://kzicffnuaniysdkenbes.supabase.co";
var SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aWNmZm51YW5peXNka2VuYmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg2OTAwMzIsImV4cCI6MjAyNDI2NjAzMn0.Exr237hk8hYlEjP1ZvNigWSPGAe9ThIrQAiP9-WftFg";
const supabase = createClient(SupabaseUrl, SupabaseKey);
import {convertToHTML} from "./markdown.js";
//全局变量
var path = window.location.pathname;
var name = path.slice(path.lastIndexOf("/")+1);
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
  tip.classList.add("tip");
  tip.innerHTML = "<p>"+text+"</p>";
  document.body.appendChild(tip);
  setTimeout(function(){tip.style.opacity=0;},1000)
  setTimeout(function(){tip.remove();},2300)
}

//填充页面
(function(){
  document.body.innerHTML=`  <div class="toubulan">
    <div class="tbl"><a href="../index.html">首页</a></div>
    <input class="sousuokuang" id="searchInput"/>
    <div class="tbl" id="search">搜索</div>
  </div>
  <div class="centre">
    <div class="main"><div id="title"></div><div id="time"></div><div id="writer"></div><div id="content"></div></div>
    <div class="side">
      <div class="discuss"><textarea placeholder="评论"></textarea><div>发送</div></div>
      <div class="discussion">评论加载中 <i class="fa fa-spinner fa-pulse"></i></div>
      <div class="recommendation"></div>
    </div>
  </div>`;
}())
var titledom = document.getElementById("title");
var timedom = document.getElementById("time");
var writerdom = document.getElementById("writer");
var contentdom = document.getElementById("content");
function getBlog(){
  var xmlhttp;
  if(window.XMLHttpRequest){xmlhttp = new XMLHttpRequest();}else{xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");}
  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
      var list = JSON.parse(this.responseText);
      creatBlog(list[name].title,list[name].writer,list[name].url,list[name].time,list[name].content);
    }
  }
  xmlhttp.open("GET","../document/blog.json",true);
  xmlhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
  xmlhttp.send();
  function creatBlog(title,writer,url,time,content){
    var pageTitle = document.createElement("title");
    pageTitle.innerHTML = title;
    document.head.appendChild(pageTitle);
    
    titledom.innerHTML = title;
    timedom.innerHTML = time;
    writerdom.innerHTML = writer;
    contentdom.innerHTML = convertToHTML(content);
  }
}
getBlog();
//评论
var discussiondom = document.getElementsByClassName("discussion")[0];
document.getElementsByClassName("discuss")[0].children[1].onclick = async function discuss(){
  var user = getUserName();
  if(user==null){return;}
  var content = document.getElementsByClassName("discuss")[0].children[0].value;
  var notNull = /[^ ]/g;
  if(content==""||!notNull.test(content)){alertTip("评论不能为空");return;}
  alertTip("正在发送……");
  var time = new Date().getTime()+"";
  const { error } = await supabase.from('blogDiscussion').insert({page:name, sender:user, content:content, time:time});
  alertTip("完成！");
  loadDiscussion([{sender:user, content:content, time:time, order:true}])
}
//加载评论
async function loadDiscussion(data){
  if(discussiondom.innerHTML=="暂无评论"){discussiondom.innerHTML="";}
  for(var t=data.length;t--;t>0){
    var sender = data[t].sender;
    var content = data[t].content;
    var date = new Date();
    var time = date.getTime()-Number(data[t].time);
    var past;
    if(time>=24*3600000){
      past = Math.floor(time/24/3600000)+" 天前";
    }else if(time>=3600000 && time<24*3600000){
      past = Math.floor(time/3600000)+" 小时前";
    }else if(time>=60000 && time<3600000){
      past = Math.floor(time/60000)+" 分前";
    }else if(time<60000){
      past = Math.floor(time/1000)+" 秒前";
    }
    var discussion = document.createElement("div");
    discussion.innerHTML=sender+"："+content+"<p>—— "+past+"</p>";
    if(data[t].order){discussiondom.insertBefore(discussion,discussiondom.children[0]);return}
    discussiondom.appendChild(discussion);
  }
}
(async function(){
  var {data,error} = await supabase.from('blogDiscussion').select().eq('page',name);
  if(data.length!=0){discussiondom.innerHTML="";loadDiscussion(data);}else{discussiondom.innerHTML="暂无评论";}
}());
//加载其他博客
(function(){
  var xmlhttp;
  if(window.XMLHttpRequest){xmlhttp = new XMLHttpRequest();}else{xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");}
  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
      var list = JSON.parse(this.responseText);
      for(var x in list){creatBlog(list[x].title,list[x].writer,list[x].url,list[x].time);}
    }
  }
  xmlhttp.open("GET","../document/blog.json",true);
  xmlhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
  xmlhttp.send();
  function creatBlog(title,writer,url,time){
    var box = document.createElement("a");
    box.innerHTML="标题："+title+"<br>时间："+time+"<br>作者："+writer;
    box.href = url;
    document.getElementsByClassName("recommendation")[0].appendChild(box);
  }
}());