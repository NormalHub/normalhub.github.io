import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
var SupabaseUrl = "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com";
var SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImV4cCI6MzI4ODM0Njc1NywiaWF0IjoxNzExNTQ2NzU3LCJpc3MiOiJzdXBhYmFzZSJ9.iee2MqZMWv-d3mRWC0YPdaganE9y58EEcw3xEh4aNk8";
const supabase = createClient(SupabaseUrl, SupabaseKey);
function alert(c){
  var alertDiv = document.createElement("div");
  alertDiv.className = "alert";
  alertDiv.innerHTML = c;
  document.body.appendChild(alertDiv);
  setTimeout(function(){alertDiv.remove();},3000)
}
function cookieSet(content,expires_time){
  var date = new Date();
  date.setTime(date.getTime()+expires_time);
  var expires="expires="+date.toGMTString()+";";
  document.cookie=content+expires;
  console.log(`已成功设置cookie：${content}`)
}
function cookieGet(keyword){
  var cookies = decodeURI(document.cookie).split("; ");
  for(var t=cookies.length;t--;t>0){if(cookies[t].indexOf(keyword)!=-1){return cookies[t].split("=")[1];}}
}
function cookieDelete(keyword){
  document.cookie = `${keyword}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
document.cookie = "user_name=;expires=Thu, 01 Jan 1970 00:00:00 GMT";//删除曾经已游客名称登录的cookie
var userName = cookieGet("userName");
var password = cookieGet("password");
var u_id = cookieGet("id");
var isLoggedIn = !(userName==null||userName==undefined);
var userNameDom = document.getElementById("userName");
var part_1 = document.getElementsByClassName("part_1")[0];
if(isLoggedIn){
  userNameDom.innerHTML = `<a href="space.html" target="_blank">${userName}</a>`;
  var {data,error} = await supabase.from('user').select('password,exp,post,support,avatar,intro,follow,fans').eq('u_name',userName)
  if(data[0].intro == null){data[0].intro = "还没有简介呢";}
  var fans = [];
  if(data[0].fans != null){fans = data[0].fans.split(",");}
  var follow = [];
  if(data[0].follow != null){follow = data[0].follow.split(",");}
  part_1.innerHTML = `
  <div class="follow_buttom">关注</div>
  <div class="userColumn"><div><b>${userName}</b><p>${data[0].intro}</p></div></div>
  <div class="profile">
    <div><b>${data[0].post}</b><p>帖子</p></div>
    <div><b>${data[0].support}</b><p>获赞</p></div>
    <div><b>${follow.length}</b><p>关注</p></div>
    <div><b>${fans.length}</b><p>粉丝</p></div>
  </div>`;
  
  var logOut = document.getElementById("logOut");
  var deleteAccount = document.getElementById("deleteAccount");
  logOut.onclick = function(){
    if(this.innerHTML == "确认"){
      cookieDelete("userName");
      cookieDelete("password");
      cookieDelete("id");
      location.reload();
    }
    deleteAccount.style.background = "none";
    deleteAccount.innerHTML = "注销";
    this.style.background = "#ddd";
    this.innerHTML = "确认";
  }
  deleteAccount.onclick = async function(){
    if(this.innerHTML == "确认"){
      cookieDelete("userName");
      cookieDelete("password");
      cookieDelete("id");
      const {error} = await supabase.from('user').delete().eq('u_name', userName);
      location.reload();
    }
    alert("确定要注销吗？这会删除你的账号");
    logOut.style.background = "none";
    logOut.innerHTML = "登出";
    this.style.background = "#ddd";
    this.innerHTML = "确认";
  }
}else if(!isLoggedIn){
  var bg = document.createElement("div");
  bg.className = "bg";
  bg.innerHTML = `<div class="sign">
    <img src="./imgs/signBg.png"/>
    <div>
      <h1>在 疯人院 注册 / 登录</h1>
      <p>昵称：<input type="text" id="name_input"/></p>
      <p>密码：<input type="password" id="password_input"/></p>
      <div id="signUp_buttom">登录</div>
    </div>
  </div>`;
  document.body.appendChild(bg);

  document.getElementById("signUp_buttom").onclick = async function(){
    var u = document.getElementById("name_input").value;
    if(u=="" || u.indexOf(" ")!=-1){alert("错误：昵称为空/含有空格");return;}
    if(u.length>8){alert("昵称长度不能超过8个字符");return;}
    var p = document.getElementById("password_input").value;
    if(p=="" || p.indexOf(" ")!=-1){alert("错误：密码为空/含有空格");return;}
    if(p.length!=6){alert("密码长度必须为6个字符");return;}
    var {data,error} = await supabase.from('user').select('id');
    var id = data.length;
    var { error } = await supabase.from('user').insert({u_name: u,password: p,id: id})
    if(error){
      var { data, error } = await supabase.from('user').select('password,id').eq('u_name',u)
      if(p==data[0].password){
        var id = data[0].id;
        cookieSet(`userName=${u};`,365*24*60*60000);
        cookieSet(`password=${p};`,365*24*60*60000);
        cookieSet(`id=${id};`,365*24*60*60000);
        alert("登录成功！");
        setTimeout(function(){location.reload();},1500)
        return;
      }
      alert(`注册/登录失败：密码错误 / 用户名“${u}”已存在`);
      return;
    }
    cookieSet(`userName=${u};`,365*24*60*60000);
    cookieSet(`password=${p};`,365*24*60*60000);
    cookieSet(`id=${id};`,365*24*60*60000);
    alert("注册成功！");
    setTimeout(function(){location.reload();},1500)
  }
}