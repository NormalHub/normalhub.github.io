import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
var SupabaseUrl = "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com";
var SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImV4cCI6MzI4ODM0Njc1NywiaWF0IjoxNzExNTQ2NzU3LCJpc3MiOiJzdXBhYmFzZSJ9.iee2MqZMWv-d3mRWC0YPdaganE9y58EEcw3xEh4aNk8";
const supabase = createClient(SupabaseUrl, SupabaseKey);
import {convertToHTML} from "./markdown.js";

//重复调用的函数
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

var cookies = decodeURI(document.cookie).split("; ");
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
        var opusUrl=opusInformation[2].slice(opusInformation[2].indexOf("=")+1);
        var opusIntroduction=opusInformation[3].split("=")[1];
        var time=opusInformation[4].split("=")[1];
        wokes(type,opusName,opusUrl,opusIntroduction,time);
      }
    }
  };
  getOpus.send();
  function wokes(type,opusName,opusUrl,opusIntroduction,time){
    var box = document.createElement("a");
    box.classList.add("box");
    var title = document.createElement("div");
    title.classList.add("title");
    var timeElement = document.createElement("div");
    timeElement.innerHTML="上传时间："+time;
    title.innerHTML=opusName;
    if(type=="视"){
      box.href = "./video/?url="+opusUrl+"&&isShare=false";
    }else if(type=="文"){
      box.href = opusUrl;
    }else if(type.indexOf("share")!=-1){
      box.href = "./video/?url="+opusUrl+"&&isShare=true";
    }
    box.appendChild(title);
    box.appendChild(timeElement);
    opudiv.appendChild(box);
  }
}
getOpus();
//获取博客
function getBlog(){
  var xmlhttp;
  if(window.XMLHttpRequest){xmlhttp = new XMLHttpRequest();}else{xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");}
  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
      var list = JSON.parse(this.responseText);
      for(var x in list){creatBlog(list[x].title,list[x].writer,list[x].url,list[x].time);}
    }
  }
  xmlhttp.open("GET","./document/blog.json",true);
  xmlhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
  xmlhttp.send();
  function creatBlog(title,writer,url,time){
    var box = document.createElement("a");
    box.classList.add("box");
    var titleElement = document.createElement("div");
    titleElement.classList.add("title");
    var timeElement = document.createElement("div");
    timeElement.innerHTML="时间："+time;
    titleElement.innerHTML="标题："+title;
    box.href = url;
    box.appendChild(titleElement);
    box.appendChild(timeElement);
    document.getElementsByClassName("blog")[0].appendChild(box);
  }
}
getBlog();
//获取帖子
async function getPostings(){
  var postings = document.getElementById("postings");
  const { data, error } = await supabase.from('posting').select();
  postings.innerHTML="";
  function dateData(property,bol) { //property是排序传入的key,bol为true升序false为降序
    return function(a,b){
      var value1 = a[property];
      var value2 = b[property];
      if(bol){return Date.parse(value1)-Date.parse(value2);}else{return Date.parse(value2)-Date.parse(value1)}
    } 
  } 
  data.sort(dateData("like", true));
  var postingLiked="";
  for(var t=cookies.length;t--;t>0){if(cookies[t].indexOf("like")!=-1){postingLiked=cookies[t];}}
  for(var i=data.length;i--;i>0){
    var time = data[i].time;
    if(time.indexOf("follow")!=-1){continue;}
    var content = data[i].content;
    var sender = data[i].sender;
    var d = new Date();
    d.setTime(Number(time));
    var year = d.getFullYear();
    var month = d.getMonth()+1;
    var day = d.getDate();
    if(month<10){var month = "0" + month;}
    if(day<10){var day = "0" + day;}
    var date = year+"/"+month+"/"+day;
    var postingDiv = document.createElement("div");
    postingDiv.classList.add("postingdiv");
    postingDiv.id = time;
    postingDiv.innerHTML = "<div class='postingDivContent'><div>"+convertToHTML(content)+"</div><div>"+date+"</div><div>"+sender+"</div></div><div class='fa fa-thumbs-o-up'>"+data[i].like+"</div>";
    postings.appendChild(postingDiv);
    document.getElementsByClassName("fa-thumbs-o-up")[document.getElementsByClassName("fa-thumbs-o-up").length-1].id = data[i].like;
    postingDiv.onclick = function(){
      if(event.target.className.indexOf("fa")!=-1){return;}
      postingsMessage(this.id,this.children[0].children[0].innerHTML,this.children[0].children[1].innerHTML,this.children[0].children[2].innerHTML);
    }
    document.getElementsByClassName("fa-thumbs-o-up")[document.getElementsByClassName("fa-thumbs-o-up").length-1].addEventListener("click",async function(){
      var postingId = this.parentNode.id;
      var date = new Date();
      date.setTime(date.getTime()+(365*24*60*60000));
      var expires="expires="+date.toGMTString()+";";
      if(this.className=="fa fa-thumbs-up"){
        this.id = Number(this.id)-1;
        this.className = "fa fa-thumbs-o-up";
      }else{
        this.id = Number(this.id)+1;
        this.className = "fa fa-thumbs-up";
      }
      this.innerHTML = this.id;
      var {error} = await supabase.from('posting').update({like:this.id}).eq('time',postingId);
      var faThumbsUp = document.getElementsByClassName("fa-thumbs-up");
      var faThumbsUpId = [];
      for(var t=faThumbsUp.length;t--;t>0){faThumbsUpId.push(faThumbsUp[t].parentNode.id);}
      var content = "like="+faThumbsUpId.toString()+";";
      document.cookie=content+expires;
    })
    if(postingLiked.indexOf(data[i].time.toString())!=-1){document.getElementsByClassName("fa-thumbs-o-up")[document.getElementsByClassName("fa-thumbs-o-up").length-1].className="fa fa-thumbs-up";}
  }
}
var postMessageDom = document.getElementById("postingsMessage");
var postBg = document.getElementById("postBg");
postBg.style.display = "none";
postBg.onmousedown = function(){
  if(event.target != postBg){return;}
  postBg.onmouseup = function(){
    postBg.onmouseup = null;
    if(event.target != postBg){return;}
    postBg.style.display = postBg.style.display=="none" ? "flex" : "none";
  }
}
async function postingsMessage(time,content,date,sender){
  postBg.style.display = "flex";
  document.getElementsByClassName("discuss").id = time;
  postMessageDom.innerHTML = '<p><i class="fa fa-spinner fa-pulse"></i>加载中</p>';
  const { data, error } = await supabase.from('posting').select();
  postMessageDom.innerHTML = "";
  
  var element = document.createElement("div");
  element.innerHTML = '<p id="description">'+sender+'：</p><p id="content">'+content+'</p>'+date+"<p>回复</p>";
  postMessageDom.insertBefore(element,postMessageDom.children[0]);
  
  for(var t=data.length;t--;t>0){
    if(data[t].time.indexOf("follow"+time)!=-1){
      var element = document.createElement("div");
      element.innerHTML = "<p>"+data[t].sender+"："+convertToHTML(data[t].content)+"</p>";
      postMessageDom.appendChild(element);
    }
  }
}
getPostings();
//发帖
var publishingPostBg = document.getElementsByClassName("publishingPostBg")[0];
var publishingPostElement = document.getElementsByClassName("publishingPost")[0];
document.getElementsByClassName("postingsButton")[0].onclick = function(){publishingPostBg.style.display = "flex";}
publishingPostBg.onmousedown = function(){
  if(event.target != publishingPostBg){return;}
  publishingPostBg.onmouseup = function(){
    publishingPostBg.onmouseup = null;
    if(event.target != publishingPostBg){return;}
    publishingPostBg.style.display = "none";
  }
}
document.getElementById("send").onclick = async function send(){
  var user = getUserName();
  var content = document.getElementById("content").value;
  var notNull = /[^ ]/g;
  if(content==""||!notNull.test(content)){alertTip("帖子不能为空");return;}
  var time = new Date().getTime();
  alertTip("正在发往服务器");
  const { error } = await supabase.from('posting').insert({sender:user, content:content, time:time});
  alertTip("完成！");
  location.reload();
}
var postContent = document.getElementById('content');
var addDoms = document.getElementsByClassName("add");
addDoms[0].onclick = function(){
  var selectedText = postContent.value.substring(postContent.selectionStart, postContent.selectionEnd);
  postContent.value = postContent.value.substring(0, postContent.selectionStart) + `**${selectedText}**` + postContent.value.substring(postContent.selectionEnd);
}
addDoms[1].onclick = function(){
  var selectedText = postContent.value.substring(postContent.selectionStart, postContent.selectionEnd);
  postContent.value = postContent.value.substring(0, postContent.selectionStart) + `*${selectedText}*` + postContent.value.substring(postContent.selectionEnd);
}
addDoms[2].onclick = function(){
  var selectedText = postContent.value.substring(postContent.selectionStart, postContent.selectionEnd);
  var link = prompt('请输入链接地址：');
  postContent.value = postContent.value.substring(0, postContent.selectionStart) + `[${selectedText}](${link})` + postContent.value.substring(postContent.selectionEnd);
}
const text = `
# 标题<br>
## 副标题<br>
**粗体**<br>
*斜体*<br>
- 列表项<br>
[一条链接](//kingdinner.top)<br>
\`\`\`console.log('这是一个代码块')\`\`\`<br>
这是一个普通段落。`;
document.getElementsByClassName("example")[0].innerHTML = text;
document.getElementsByClassName("example")[1].innerHTML = convertToHTML(text);
//评论
document.getElementsByClassName("discuss")[0].children[1].onclick = async function(){
  var user = getUserName();
  var content = document.getElementsByClassName("discuss")[0].children[0].value;
  var notNull = /[^ ]/g;
  if(content==""||!notNull.test(content)){
    alertTip("帖子不能为空");
    return;
  }
  var follow_time = document.getElementsByClassName("discuss").id;
  var time = new Date().getTime()+"follow"+follow_time;
  document.getElementsByClassName("discuss")[0].children[0].value="";
  setTimeout(function(){
    alertTip("完成！")
    var element = document.createElement("div");
    element.innerHTML = "<p>"+user+"："+content+"</p>";
    postMessageDom.appendChild(element);
  },1000)
  const {error} = await supabase.from('posting').insert({content:content, time:time,sender:user});
}
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
window.onkeydown = function (){
  var key = event.key;
  var element = document.activeElement;
  if(element.tagName == "INPUT"&&key == "Enter"){
    search();
    return;
  }
  if(element.parentElement.className == "discuss"&&key == "Enter"){
    document.getElementsByClassName("discuss")[0].children[1].click();
    return;
  }
}
//切换页面
function turnPage(){
  function saveCookie(page){
    var date = new Date();
    date.setTime(date.getTime()+(365*24*60*60000));
    var expires="expires="+date.toGMTString()+";";
    var content="page="+page+";";
    document.cookie=content+expires+"path=/";
  }
  var tblElement = document.getElementsByClassName("tbl");
  var postings = document.getElementsByClassName("postings")[0];
  var opu = document.getElementsByClassName("opu")[0];
  for(var t=tblElement.length;t--;t>0){
    tblElement[t].addEventListener("click",function(){
      if(this.id == "shipin"){
        postings.style.width = 0;
        postings.style.height = 0;
        opu.style.width = "100%";
        opu.style.height = "100%";
        saveCookie("视频");
      }else if(this.id == "tiezi"){
        postings.style.width = "100%";
        postings.style.height ="100%";
        saveCookie("帖子");
      }else if(this.id == "boke"){
        postings.style.width = 0;
        postings.style.height = 0;
        opu.style.width = 0;
        opu.style.height = 0;
        saveCookie("博客");
      }
    })
  }
  for(var l=cookies.length;l--;l>0){
    if(cookies[l].indexOf("page=视频")!=-1){
      postings.style.width = 0;
      postings.style.height = 0;
    }else if(cookies[l].indexOf("page=博客")!=-1){
      postings.style.width = 0;
      postings.style.height = 0;
      opu.style.width = 0;
      opu.style.height = 0;
    }
  }
}
turnPage();

//fetch('https://ipapi.co/json/').then(response=>response.json()).then(data=>{region = data.region;})