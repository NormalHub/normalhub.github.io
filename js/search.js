document.getElementById("key").innerHTML = "key word: "+decodeURI(window.location.search.slice(1));
var key = new RegExp(decodeURI(window.location.search.slice(1)));
var getOpus=new XMLHttpRequest();
getOpus.open("GET", "./document/wokes", true);
getOpus.onreadystatechange = function(){
  if(getOpus.readyState==4 && getOpus.status==200){
    var opus = getOpus.responseText.split("\n");
    for(var times=opus.length;times--;times>0){
      if(!key.test(opus[times])){continue;}
      var opusInformation = opus[times].split("&&");
      var type=opusInformation[0].split("=")[1];
      var opusUrl=opusInformation[2].split("=")[1];
      var opusName=opusInformation[1].split("=")[1];
      var time=opusInformation[4].split("=")[1];
      if(type=="视"){
        opusUrl="./video/?url="+opusUrl+"&&isShare=false";
      }else if(type.indexOf("share")!=-1){
        opusUrl="./video/?url="+opusUrl+"&&isShare=true";
      }
      wokes(opusName,opusUrl,time);
    }
  }
};
getOpus.send();
function wokes(opusName,opusUrl,time){
  var get = document.createElement("a");
  get.classList.add("get");
  get.href = opusUrl;
  get.innerHTML = opusName+"<br>"+time;
  document.getElementById("outcome").appendChild(get);
}