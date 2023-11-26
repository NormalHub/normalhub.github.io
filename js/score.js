//成绩在这儿
var allofscores=[94,103,111,71,95,85,92,85,
  89,100,106,75,78,82,100,93
];
var i = 0;
document.body.onkeydown = function(){
  if(i*8>allofscores.length){return;}
  var key = event.key;
  if(key == "ArrowRight"){i++;}else if(key == "ArrowLeft"){i--;}
  if(i==allofscores.length/8){i=0;}else if(i==-1){i=(allofscores.length/8)-1;}
  choose(document.getElementsByClassName("choice")[i],i);
}
var scoresdiv=document.getElementsByClassName("scoresdiv");
function choose(element,id){
  i=id;
  var start = id*8;
  if(start+8>allofscores.length){return;}
  for(var x=4;x--;x>0){document.getElementsByClassName("choice")[x].style.background="white";}
  var bg = element.style;
  if(bg.background=="white"){
    bg.background="black";
    fillscores(start);
    for(var n=8;n--;n>0){
      scoresdiv[n].innerHTML=allofscores[start+n];
      if(id!=0){
        if(allofscores[start+n]<allofscores[n]){
          scoresdiv[n].innerHTML=allofscores[start+n]+" ↓";
          scoresdiv[n].style.color="#329200";
        }else{
          scoresdiv[n].innerHTML=allofscores[start+n]+" ↑";
          scoresdiv[n].style.color="#ca0d0d";
        }
      }else{
        scoresdiv[n].style.color="#000";
      }
    }
  }
}
choose(document.getElementsByClassName("choice")[0],0);
function fillscores(start){
  var canvas = document.getElementById("canvas");
  var width = canvas.width/2;
  var height = canvas.height/2;
  var ctx=canvas.getContext("2d");
  ctx.translate(width,height);
  ctx.clearRect(-width,-height,width,height);
  ctx.beginPath();
  ctx.moveTo(width,0);
  ctx.lineTo(-width,0);
  ctx.moveTo(0,height);
  ctx.lineTo(0,-height);
  var hypotenuseX = Math.sqrt(Math.pow(width,2)/2);
  var hypotenuseY = Math.sqrt(Math.pow(height,2)/2);
  ctx.moveTo(hypotenuseX,hypotenuseY);
  ctx.lineTo(-hypotenuseX,-hypotenuseY);
  ctx.moveTo(-hypotenuseX,hypotenuseY);
  ctx.lineTo(hypotenuseX,-hypotenuseY);
  ctx.moveTo(0,-width);
  ctx.lineTo(-hypotenuseX,-hypotenuseY);
  ctx.lineTo(-width,0);
  ctx.lineTo(-hypotenuseX,hypotenuseY);
  ctx.lineTo(0,width);
  ctx.lineTo(hypotenuseX,hypotenuseY);
  ctx.lineTo(width,0);
  ctx.lineTo(hypotenuseX,-hypotenuseY);
  ctx.lineTo(0,-width);
  ctx.fillStyle="#f5feff";
  ctx.fill();
  ctx.strokeStyle="#000";
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.moveTo(allofscores[start+0]/-120*hypotenuseX,allofscores[start+0]/-120*hypotenuseY);
  ctx.lineTo(allofscores[start+1]/-120*width,0);
  ctx.lineTo(allofscores[start+2]/-120*hypotenuseX,allofscores[start+2]/120*hypotenuseY);
  ctx.lineTo(0,allofscores[start+3]/100*height);
  ctx.lineTo(allofscores[start+4]/100*hypotenuseX,allofscores[start+4]/100*hypotenuseY);
  ctx.lineTo(allofscores[start+5]/100*width,0);
  ctx.lineTo(allofscores[start+6]/100*hypotenuseX,allofscores[start+6]/-100*hypotenuseY);
  ctx.lineTo(0,allofscores[start+7]/100*-height);
  ctx.fillStyle="#a7e3ff";
  ctx.fill();
  ctx.moveTo(allofscores[start+0]/-120*hypotenuseX,allofscores[start+0]/-120*hypotenuseY);
  ctx.lineTo(allofscores[start+4]/100*hypotenuseX,allofscores[start+4]/100*hypotenuseY);
  ctx.moveTo(allofscores[start+1]/-120*width,0);
  ctx.lineTo(allofscores[start+5]/100*width,0);
  ctx.moveTo(allofscores[start+2]/-120*hypotenuseX,allofscores[start+2]/120*hypotenuseY);
  ctx.lineTo(allofscores[start+6]/100*hypotenuseX,allofscores[start+6]/-100*hypotenuseY);
  ctx.moveTo(0,allofscores[start+3]/100*height);
  ctx.lineTo(0,allofscores[start+7]/100*-height);
  ctx.lineTo(allofscores[start+0]/-120*hypotenuseX,allofscores[start+0]/-120*hypotenuseY);
  ctx.strokeStyle="#533383";
  ctx.stroke();
  ctx.fillStyle="#000";
  ctx.font="40px 楷体";
  ctx.fillText("语文",-hypotenuseX-60,-hypotenuseY);
  ctx.fillText("数学",-width,0);
  ctx.fillText("英语",-hypotenuseX-60,hypotenuseY);
  ctx.fillText("历史",-45,height-10);
  ctx.fillText("地理",hypotenuseX-10,hypotenuseY);
  ctx.fillText("政治",width-80,0);
  ctx.fillText("生物",hypotenuseX-80,-hypotenuseY);
  ctx.fillText("物理",-45,-height+30);
  ctx.closePath();
  ctx.translate(-width,-height);
}
function filltable(){
  var monthExam_1=736;
  var midExam=723;
  var monthExam_2=undefined;
  var finalExam=undefined;
  var monthExam_1_height=monthExam_1*-47/100;
  var midExam_height=midExam*-47/100;
  var monthExam_2_height=monthExam_2*-47/100;
  var finalExam_height=finalExam*-47/100;
  var canvas = document.getElementById("canvas2");
  var width = canvas.width;
  var height = canvas.height;
  var ctx=canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(0,height-20);
  ctx.lineTo(width,height-20);
  ctx.lineTo(width-20,height-27);
  ctx.lineTo(width-20,height-13);
  ctx.lineTo(width,height-20);
  ctx.moveTo(20,height);
  ctx.lineTo(20,0);
  ctx.lineTo(13,20);
  ctx.lineTo(27,20);
  ctx.lineTo(20,0);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle="#000";
  ctx.font="40px 楷体";
  ctx.fillText("月考",0,height-5);
  ctx.fillText("期中",120,height-5);
  ctx.fillText("月考",240,height-5);
  ctx.fillText("期末",360,height-5);
  ctx.closePath();
  ctx.beginPath();
  ctx.translate(20,height-20);
  ctx.font="27px a";
  ctx.fillText("100%",-20,-406);
  ctx.fillRect(0,-402,10,4);
  ctx.arc(20,monthExam_1_height,4,0,2*Math.PI);
  ctx.arc(150,midExam_height,4,0,2*Math.PI);
  ctx.moveTo(150,midExam_height);
  ctx.arc(280,monthExam_2_height,4,0,2*Math.PI);
  ctx.moveTo(280,monthExam_2_height,4,0,2*Math.PI);
  ctx.arc(410,finalExam_height,4,0,2*Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.font="27px a";
  ctx.fillText(monthExam_1,20,monthExam_1_height-10);
  ctx.fillText(midExam,150,midExam_height-10);
  ctx.fillText(monthExam_2,280,monthExam_2_height-10);
  ctx.fillText(finalExam,410,finalExam_height-10);
  ctx.closePath();
}
filltable();
function goal(){
  var goal = document.getElementById("goal");
  goal.style.width = "80%";
  goal.style.height = "80%";
  var background = document.createElement("background");
  document.body.appendChild(background);
  background.onclick = function(){
    goal.style.width = "0px";
    goal.style.height = "0px";
    background.remove();
    background.onclick = null;
  }
}
function count(){
  var today = new Date().getTime();
  var count_ms = Date.UTC(2025,6,20,16)-today;//2025年6月21日
  var count_day = count_ms/86400000;
  var count_element = document.getElementById("conut");
  count_element.innerHTML="距离中考还有 "+ count_day.toFixed() +" 天"
}
count();