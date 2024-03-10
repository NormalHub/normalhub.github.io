var video = document.getElementById("video");
var play = document.getElementById("play");
var progressNumber = document.getElementById("progressNumber");
var ProgressBar = document.getElementById("ProgressBar");
var VideoPlayer = document.getElementById("VideoPlayer");
var bottom = document.getElementById("bottom");
var fullscreen = document.getElementById("fullscreen");
var volume = document.getElementById("volume");
var volumeBar = document.getElementById("volumeBar");
var speed = document.getElementById("speed");
var speedMenu = document.getElementById("speedMenu");
var ProgressBarOuter = document.getElementById("ProgressBarOuter");
var volumeNumber = document.getElementById("volumeNumber");
var volumeOuter = document.getElementById("volumeOuter");

var date = new Date();
date.setTime(date.getTime()+(365*24*60*60*1000));
var expires = "expires="+date.toUTCString()+";";
var cookies = decodeURI(document.cookie).split("; ");
//加载视频&初始化
var url = decodeURI(window.location.search.slice(1).split("&&")[0]);
var opusUrl= url.slice(url.indexOf("=")+1);
var iframe = window.location.search.slice(1).split("&&")[1].split("=")[1];
if(url==""){
  var tip = document.createElement("div");
  tip.classList.add("waiting");
  tip.style.opacity = 1;
  tip.innerHTML = "<p>视频不存在呢</p>";
  document.body.appendChild(tip);
  setTimeout(function(){tip.style.opacity=0;},1500)
  setTimeout(function(){tip.remove();},3000)
}else if(iframe=="false"){
  video.src = opusUrl;
}else{
  VideoPlayer.innerHTML='<iframe id="iframe" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>';
  var iframeElement = document.getElementById("iframe");
  iframeElement.src = opusUrl;
}
video.ondurationchange= function(){
  progressNumber.innerHTML="0:00/00:00";
}
volume.style.display="none";
speedMenu.style.display="none";
function getVolume(){
  for(var times=cookies.length;times--;times>0){
    if(cookies[times].indexOf("volume") != -1){
      var volume = Number(cookies[times].split("=")[1]);
      volumeBar.style.height=100*volume+"px";
      video.volume = volume;
    }
  }
}
getVolume();
var timer;
VideoPlayer.onmousemove=function(){
  bottom.style.height="60px";
  clearTimeout(timer);
  if(event.target.id==="video"){
    timer=setTimeout(function(){
      bottom.style.height="0px";
    },1200)
  }
}
//进度条
video.ontimeupdate = function(){
  //数字进度
  if(parseInt(video.duration) % 60 < 10){
    var second = "0" + parseInt(video.duration) % 60;
  }else{var second = parseInt(video.duration) % 60;}
  if(parseInt(video.currentTime) % 60 < 10){
    var currentSecond = "0" + parseInt(video.currentTime) % 60;
  }else{var currentSecond = parseInt(video.currentTime) % 60;}
  var minute = parseInt(video.duration / 60);
  var currentMinute = parseInt(video.currentTime / 60);
  progressNumber.innerHTML = currentMinute+":"+currentSecond+"/"+minute+":"+second;
  //进度条
  ProgressBar.style.width = video.currentTime/video.duration*100 + "%";
}
ProgressBarOuter.onmousedown = function(){
  ProgressBar.style.width=event.clientX-VideoPlayer.offsetLeft+"px";
  video.currentTime= ProgressBar.offsetWidth/ProgressBarOuter.offsetWidth*video.duration;
  VideoPlayer.onmousemove = function(){
    ProgressBar.style.width=event.clientX-VideoPlayer.offsetLeft+"px";
    video.currentTime= ProgressBar.offsetWidth/ProgressBarOuter.offsetWidth*video.duration;
  }
  document.onmouseup = function(){
    window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
    VideoPlayer.onmousemove = function(){
      bottom.style.height="60px";
      clearTimeout(timer);
      if(event.target.id==="video"){
        timer=setTimeout(function(){
          bottom.style.height="0px";
        },1200)
      }
    }
  }
}
//暂停/播放
function PlayOrPause(){
  if(video.paused){ 
    video.play();
    play.style.backgroundPosition = "-25px 0px";
  }else{
    video.pause();
    play.style.backgroundPosition = "0px 0px";
  }
}
//全屏
var TrueOrFalseFullscreen = false;
function RequestFullscreen(){
  if(TrueOrFalseFullscreen){
    document.exitFullscreen();
  }else{
    VideoPlayer.requestFullscreen();
  }
}
VideoPlayer.addEventListener("fullscreenchange", function() {
  if(VideoPlayer.offsetWidth<window.innerWidth){
    fullscreen.style.backgroundPosition = "0px 0px";
    TrueOrFalseFullscreen = false;
  }else{
    fullscreen.style.backgroundPosition = "25px 0px";
    TrueOrFalseFullscreen = true;
  }
});
//音量
function Volume(){
  if(volume.style.display=="none"){
    volume.style.display="flex";
  }else{
    setTimeout(function(){
      volume.style.display="none";
    },600)
  }
}
volume.onmousedown = function(){
  var long = volume.offsetTop+volume.offsetHeight/2+VideoPlayer.offsetTop+50-event.pageY;
  if(long>100){long=100;}
  volumeBar.style.height=long+"px";
  video.volume=long/100;
  volume.onmousemove = function(){
    var long = volume.offsetTop+volume.offsetHeight/2+VideoPlayer.offsetTop+50-event.pageY;
    if(long>100){long=100;}
    volumeBar.style.height=long+"px";
    video.volume=long/100;
  }
  VideoPlayer.onmouseup = function(){
    volume.onmousemove = null;
    window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
  }
}
var volumeTimer;
video.onvolumechange = function(){
  var content = "volume="+video.volume.toFixed(2)+";"
  document.cookie = content+expires;
  volumeOuter.style.display="block";
  volumeNumber.innerHTML=Math.floor(video.volume*100)+"%";
  clearTimeout(volumeTimer);
  volumeTimer=setTimeout(function(){volumeOuter.style.display="none";},1000)
}
//倍速
function Speed(){
  if(speedMenu.style.display=="none"){
    speedMenu.style.display="flex";
  }else{
    speedMenu.style.display="none";
  }
}
function speedChoices(dom){
  video.playbackRate=Number(dom.innerHTML);
  speed.innerHTML=Number(dom.innerHTML)+"X";
  if(dom.innerHTML=="1"){speed.innerHTML="倍速";}
  speedMenu.onmouseleave=null;
  speedMenu.style.display="none";
}

//键盘事件
window.onkeydown = function (){
  var key = event.key;
  var element = document.activeElement.tagName;
  if(element == "TEXTAREA"||element == "INPUT"){
    if(key == "Enter"){search();}
    return;
  }
  if(key == " "){
    if (video.paused){ 
      video.play();
      play.style.backgroundPosition = "-25px 0px";
    }else{
      video.pause();
      play.style.backgroundPosition = "0px 0px";
    }
  }

  if(key == "ArrowRight"){
    video.currentTime += 3;
  }else if(key == "ArrowLeft"){
    video.currentTime -= 3;
  }
  if(key == "f" || key == "F"){
    RequestFullscreen();
  }
  
  if(key == "ArrowUp" && video.volume+0.1<=1){
    video.volume+=0.1;
  }else if(key == "ArrowUp" && video.volume+0.1>1){
    video.volume=1;
    volumeNumber.innerHTML=100+"%";
  }else if(key == "ArrowDown" && video.volume-0.1>=0){
    video.volume-=0.1;
  }else if(key == "ArrowDown" && video.volume-0.1<0){
    video.volume=0;
    volumeNumber.innerHTML=0+"%";
  }
  return false;
}
//视频列表
function videosTable(){
  var videoTable=document.getElementById("videoTable");
  var getOpus=new XMLHttpRequest();
  getOpus.open("GET", "../document/wokes", true);
  getOpus.onreadystatechange = function(){
    if(getOpus.readyState==4 && getOpus.status==200){
      var opus = getOpus.responseText.split("\n");
      for(var times=opus.length;times--;times>0){
        var opusInformation = opus[times].split("&&");
        var type=opusInformation[0].split("=")[1];
        var opusName=opusInformation[1].split("=")[1];
        var opusUrlPart=opusInformation[2];
        var opusUrl=opusUrlPart.slice(opusUrlPart.indexOf("=")+1);
        var opusIntroduction=opusInformation[3].split("=")[1];
        var time=opusInformation[4].split("=")[1];
        if(type=="视"){wokes(opusName,opusUrl,false);}else if(type.indexOf("share")!=-1){wokes(opusName,opusUrl,true);}
      }
      //加载视频详情
      var title = document.getElementById("title");
      var opusTimeElement = document.getElementById("opusTime");
      var introduction = document.getElementById("introduction");
      var url = window.location.search.slice(1).split("&&")[0];
      var url = url.slice(url.indexOf("=")+1)
      if(url==""){return;}
      for(var times1=opus.length;times1--;times1>0){
        if(opus[times1].indexOf(decodeURI(url))!==-1){
          var opusInformation = opus[times1].split("&&");
          var opusName=opusInformation[1].split("=")[1];
          var opusIntroduction=opusInformation[3].split("=")[1];
          var time=opusInformation[4].split("=")[1];
          document.getElementById("pageTitle").innerHTML=opusName;
          document.getElementById("pagekeywords").content=opusName;
          title.innerHTML=opusName;
          opusTimeElement.innerHTML=time;
          introduction.innerHTML=opusIntroduction;
        }
      }
    }
  };
  getOpus.send();
  var i=0;
  function wokes(opusName,opusUrl,isShare){
    i++;
    var a = document.createElement("a");
    if(isShare){
      a.href = "./?url="+opusUrl+"&&isShare=true";
    }else{
      a.href = "./?url="+opusUrl+"&&isShare=false";
    }
    a.classList.add("videoRecommended");
    var videoImage = document.createElement("div");
    videoImage.classList.add("videoImage");
    videoImage.style.backgroundImage = "url('../video/imgs/"+opusName+".png')"
    a.innerHTML="<div class='videoIntroduction'>"+opusName+"</div>";
    a.insertBefore(videoImage,a.children[0]);
    videoTable.appendChild(a);
  }
}
videosTable();
document.getElementById("search").onclick = search;
function search(){
  var key = document.getElementById("searchInput").value;
  if(key==""){return;}
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.target = "_blank";
  a.href = "../search.html?"+key;
  a.click();
}