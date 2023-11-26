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
var url = window.location.search.slice(1);
if(url==""){
  var tip = document.createElement("div");
  tip.classList.add("waiting");
  tip.style.opacity = 1;
  tip.innerHTML = "<p>视频不存在呢</p>";
  document.body.appendChild(tip);
  setTimeout(function(){tip.style.opacity=0;},1500)
  setTimeout(function(){tip.remove();},3000)
}else{
  video.src = decodeURI(url);
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
  var allOfLength = volume.offsetTop+volume.offsetHeight+VideoPlayer.offsetTop;
  var subtractLength = (volume.offsetHeight-100)/2+event.clientY;
  volumeBar.style.height=(allOfLength-subtractLength)+"px";
  video.volume=volumeBar.offsetHeight/100;
  if(allOfLength-subtractLength>100){
    volume.onmousemove = null;
    volumeBar.style.height=100+"px";
    return;
  }
  volume.onmousemove = function(){
    var allOfLength = volume.offsetTop+volume.offsetHeight+VideoPlayer.offsetTop;
    var subtractLength = (volume.offsetHeight-100)/2+event.clientY;
    if(allOfLength-subtractLength>100){
      volume.onmousemove = null;
      volumeBar.style.height=100+"px";
      return;
    }
    volumeBar.style.height=(allOfLength-subtractLength)+"px";
    video.volume=volumeBar.offsetHeight/100;
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
function speedChoicesClick(s){
  video.playbackRate=s;
  if(s==1){s="倍速"}
  speed.innerHTML=s;
  speedMenu.onmouseleave=null;
  speedMenu.style.display="none";
}

//键盘事件
window.onkeydown = function (){
  var element = document.activeElement.tagName;
  if(element == "TEXTAREA"||element == "INPUT"){return;}
  var key = event.key;
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
        var opusUrl=opusInformation[2].split("=")[1];
        var opusIntroduction=opusInformation[3].split("=")[1];
        var time=opusInformation[4].split("=")[1];
        if(type=="视"){wokes(opusName,opusUrl,opusIntroduction,time);}
      }
      //加载视频详情
      var title = document.getElementById("title");
      var opusTimeElement = document.getElementById("opusTime");
      var introduction = document.getElementById("introduction");
      var url = window.location.search.slice(1);
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
  function wokes(opusName,opusUrl,opusIntroduction,time){
    i++;
    var a = document.createElement("a");
    a.href = "./?"+opusUrl;
    var box = document.createElement("div");
    box.classList.add("videoRecommended");
    var videoImage = document.createElement("div");
    videoImage.classList.add("videoImage");
    videoImage.style.backgroundImage = "url('../video/imgs/"+opusName+".png')"
    var videoIntroduction = document.createElement("div");
    videoIntroduction.classList.add("videoIntroduction");
    var title = document.createElement("p");
    title.innerHTML=opusName;
    videoIntroduction.appendChild(title);
    box.appendChild(videoImage);
    box.appendChild(videoIntroduction);
    a.appendChild(box);
    videoTable.appendChild(a);
  }
}
videosTable();