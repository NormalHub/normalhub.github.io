import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
var SupabaseUrl = "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com";
var SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImV4cCI6MzI4ODM0Njc1NywiaWF0IjoxNzExNTQ2NzU3LCJpc3MiOiJzdXBhYmFzZSJ9.iee2MqZMWv-d3mRWC0YPdaganE9y58EEcw3xEh4aNk8";
const supabase = createClient(SupabaseUrl, SupabaseKey);
import {convertToHTML} from "./markdown.js";

//重复调用的函数
function getUserName(){
  for(var t=cookies.length;t--;t>0){if(cookies[t].indexOf("user_name")!=-1){var name = cookies[t].split("=")[1];}}
  var notNull = /[^ ]/g;
  if(name==""||name==null||!notNull.test(name)||name=="null"){
    var name = prompt("Please enter your user name","guest"+Math.floor(Math.random()*5000));
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
//获取视频
function getvideo(){
  var videodiv=document.getElementsByClassName("video")[0];
  var getvideo=new XMLHttpRequest();
  getvideo.open("GET", "./document/wokes", true);
  getvideo.onreadystatechange = function(){
  if(getvideo.readyState==4 && getvideo.status==200){
    var video = getvideo.responseText.split("\n");
    for(var times=video.length;times--;times>0){
      var videoInformation = video[times].split("&&");
      var type=videoInformation[0].split("=")[1];
      var videoName=videoInformation[1].split("=")[1];
      var videoUrl=videoInformation[2].slice(videoInformation[2].indexOf("=")+1);
      var videoIntroduction=videoInformation[3].split("=")[1];
      var time=videoInformation[4].split("=")[1];
      wokes(type,videoName,videoUrl,videoIntroduction,time);
    }
  }
  };
  getvideo.send();
  function wokes(type,videoName,videoUrl,videoIntroduction,time){
    var box = document.createElement("a");
    box.classList.add("box");
    var title = document.createElement("div");
    title.classList.add("title");
    var timeElement = document.createElement("div");
    timeElement.innerHTML="time: "+time;
    title.innerHTML=videoName;
    if(type=="视"){
      box.href = "./video/?url="+videoUrl+"&&isShare=false";
    }else if(type=="文"){
      box.href = videoUrl;
    }else if(type.indexOf("share")!=-1){
      box.href = "./video/?url="+videoUrl+"&&isShare=true";
    }
    box.appendChild(title);
    box.appendChild(timeElement);
    videodiv.appendChild(box);
  }
}
getvideo();
//获取博客
function getBlog(){
  var xmlhttp;
  if(window.XMLHttpRequest){xmlhttp = new XMLHttpRequest();}else{xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");}
  xmlhttp.onreadystatechange = function(){if(xmlhttp.readyState==4 && xmlhttp.status==200){var list = JSON.parse(this.responseText);for(var x in list){creatBlog(list[x].title,list[x].writer,list[x].url,list[x].time);}}}
  xmlhttp.open("GET","./document/blog.json",true);
  xmlhttp.setRequestHeader("Content-Type","application/json;charset=UTF-8");
  xmlhttp.send();
  function creatBlog(title,writer,url,time){
    var box = document.createElement("a");
    box.classList.add("box");
    var titleElement = document.createElement("div");
    titleElement.classList.add("title");
    var timeElement = document.createElement("div");
    timeElement.innerHTML="time: "+time;
    titleElement.innerHTML="title: "+title;
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
  function dateData(property,bol){//property是排序传入的key,bol为true升序false为降序
    return function(a,b){var value1 = a[property];var value2 = b[property];if(bol){return Date.parse(value1)-Date.parse(value2);}else{return Date.parse(value2)-Date.parse(value1)}} 
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
getPostings();
// 详情
var postMessageDom = document.getElementById("postingsMessage");
async function postingsMessage(time,content,date,sender){
  if(window.innerWidth<=600){//小窗口/移动端
    document.getElementById("postBg").style.height = "80%";
    var bg = document.createElement("div");
    setTimeout(function(){bg.className = "bg";},200);
    document.body.insertBefore(bg,document.body.children[0]);
    bg.onclick = function(){
      this.remove();
      document.getElementById("postBg").style.height = 0;
      bg.onclick = null;
    }
  }
  
  document.getElementsByClassName("discuss").id = time;
  postMessageDom.innerHTML = '<p><i class="fa fa-spinner fa-pulse"></i>loading...</p>';
  const { data, error } = await supabase.from('posting').select();
  postMessageDom.innerHTML = "";
  
  var element = document.createElement("div");
  element.innerHTML = '<p id="description">'+sender+'：</p><p>'+content+'</p>'+date+"<p>reply:</p>";
  postMessageDom.insertBefore(element,postMessageDom.children[0]);
  
  for(var t=data.length;t--;t>0){
    if(data[t].time.indexOf("follow"+time)!=-1){
      var element = document.createElement("div");
      element.innerHTML = "<p>"+data[t].sender+"："+convertToHTML(data[t].content)+"</p>";
      postMessageDom.appendChild(element);
    }
  }
}
//发帖
document.getElementsByClassName("postButton")[0].onclick = function(){
  document.getElementsByClassName("publishingPost")[0].style.height = "80%";
  var bg = document.createElement("div");
  setTimeout(function(){bg.className = "bg";},200);
  document.body.insertBefore(bg,document.body.children[0]);
  bg.onclick = function(){
    this.remove();
    document.getElementsByClassName("publishingPost")[0].style.height = 0;
    bg.onclick = null;
  }
}
document.getElementById("send").onclick = async function send(){
  var user = getUserName();
  var content = document.getElementById("postContent").value;
  var notNull = /[^ ]/g;
  if(content==""||!notNull.test(content)){alertTip("cannot be null");return;}
  var time = new Date().getTime();
  const { error } = await supabase.from('posting').insert({sender:user, content:content, time:time});
  alertTip("the posting get sent");
  location.reload();
}
var postContent = document.getElementById('postContent');
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
  var link = prompt('Please enter jump link: ');
  postContent.value = postContent.value.substring(0, postContent.selectionStart) + `[${selectedText}](${link})` + postContent.value.substring(postContent.selectionEnd);
}
//评论
document.getElementsByClassName("discuss")[0].children[1].onclick = async function(){
  var user = getUserName();
  var content = document.getElementsByClassName("discuss")[0].children[0].value;
  var notNull = /[^ ]/g;
  if(content==""||!notNull.test(content)){
    alertTip("cannot be null");
    return;
  }
  var follow_time = document.getElementsByClassName("discuss").id;
  var time = new Date().getTime()+"follow"+follow_time;
  document.getElementsByClassName("discuss")[0].children[0].value="";
  const {error} = await supabase.from('posting').insert({content:content, time:time,sender:user});
  var element = document.createElement("div");
  element.innerHTML = "<p>"+user+"："+content+"</p>";
  postMessageDom.appendChild(element);
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
window.addEventListener("keydown",function(){
  var key = event.key;
  var element = document.activeElement;
  if(element.tagName == "INPUT"&&key == "Enter"){search();return;}
  if(element.parentElement.className == "discuss"&&key == "Enter"){document.getElementsByClassName("discuss")[0].children[1].click();return;}
});
//切换页面
(function(){
  function saveCookie(page){var d=new Date();d.setTime(d.getTime()+(2592000000));var expires="expires="+d.toGMTString()+";";var content="page="+page+";";document.cookie=content+expires+"path=/";}
  var tbl= document.getElementsByClassName("tbl");
  var juzhong = document.getElementsByClassName("juzhong")[0];
  var p = [document.getElementsByClassName("postings")[0],document.getElementsByClassName("blog")[0],document.getElementsByClassName("video")[0]];
  for(var t=tbl.length;t--;t>0){tbl[t].addEventListener("click",function(){
    for(var x in p){p[x].style.display="none";}
    if(this.innerHTML=="posting"){
      p[0].style.display="flex";
      saveCookie("posting");
    }else if(this.innerHTML=="blog"){
      p[1].style.display="block";
      saveCookie("blog");
    }else if(this.innerHTML=="video"){
      p[2].style.display="block";
      saveCookie("video");
    }
  })}
  for(var t in cookies){if(cookies[t]=="page=posting"){p[0].style.display="flex";}else if(cookies[t]=="page=blog"){p[1].style.display="block";}else if(cookies[t]=="page=video"){p[2].style.display="block";}else{p[0].style.display="flex";}}
  document.getElementsByClassName("frontDiv")[0].remove();
}())
//fetch('https://ipapi.co/json/').then(response=>response.json()).then(data=>{region = data.region;})