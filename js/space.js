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
var visit = decodeURI(location.search).split("=")[1];
document.cookie = "user_name=;expires=Thu, 01 Jan 1970 00:00:00 GMT";//删除曾经已游客名称登录的cookie
var userName = cookieGet("userName");
var password = cookieGet("password");
var u_id = cookieGet("id");
var isLoggedIn = !(userName==null||userName==undefined);
var userNameDom = document.getElementById("userName");
var part_1 = document.getElementsByClassName("part_1")[0];
if(isLoggedIn && visit == undefined){
  userNameDom.innerHTML = `<a href="space.html" target="_blank">${userName}</a>`;
  var {data,error} = await supabase.from('user').select('password,exp,post,support,avatar,intro,follow,fans').eq('id',u_id);
  var avatar = (data[0].avatar) ? `https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/${u_id}.png` : "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/默认.png";
  if(data[0].intro == null){data[0].intro = "还没有简介呢";}
  var fans = [];
  if(data[0].fans != null){fans = data[0].fans.split(",");}
  var follow = [];
  if(data[0].follow != null){follow = data[0].follow.split(",");}
  part_1.innerHTML = `
  <div id="edit">编辑</div>
  <div class="userColumn"><div class="avatar" style="background-image:url(${avatar})"></div><div><b>${userName}</b><p>${data[0].intro}</p></div></div>
  <div class="profile">
    <div><b>${data[0].post}</b><p>帖子</p></div>
    <div><b>${data[0].support}</b><p>获赞</p></div>
    <div><b>${follow.length}</b><p>关注</p></div>
    <div><b>${fans.length}</b><p>粉丝</p></div>
  </div>`;
  document.getElementsByClassName("avatar")[0].onclick = function(){
    const bg = document.createElement("div");
    bg.className = "bg";
    bg.style.cursor = "zoom-out";
    document.body.appendChild(bg);
    bg.innerHTML = `<img style="cursor: zoom-out;width:200px;" src="${avatar}">`;
    bg.onclick=function(){
      bg.remove();
      bg.onclick = null;
    }
  }
  
  var edit = document.getElementById("edit");
  var croppedImage;
  edit.onclick = async function(){
    if(this.innerHTML == "编辑"){
      this.innerHTML = "保存";
      document.getElementsByClassName("userColumn")[0].innerHTML = `<div class="avatar_edit" style="background-image:url(${avatar})"></div>
      <div><b>昵称：<input id="name_value" style="width:98px" value="${userName}" type="text"/></b><p>简介：<input id="intro_value" value="${data[0].intro}" type="text"/></p></div>`;
      document.getElementById("intro_value").onchange = function(){if(this.value.length>40){this.value = this.value.slice(0,40);alert("简介不能超过40字");}}
      document.getElementsByClassName("avatar_edit")[0].onclick = function(){
        var div = document.createElement("div");
        document.body.appendChild(div);
        div.innerHTML = '<input style="display:none" id="input" type="file" accept="image/*"/>';
        document.getElementById("input").click();
        document.getElementById("input").onchange = function(){
          if(this.files.length == 0){alert("请选择一个图片");return;}
          var file = this.files[0];
          if(file.size >= 102400){alert("图片必须小于 100 KB");return;}
          var src = URL.createObjectURL(file);
          const bg = document.createElement("div");
          bg.className = "bg";
          bg.style.background = "none";
          bg.innerHTML =  `<img id="img" src="${src}" draggable="false"/><canvas id="canvas"></canvas><canvas id="canvas_img" width="100" height="100"></canvas>
          <div id="clip"></div><div id="clip_buttom">剪裁</div>`;
          document.body.appendChild(bg);
          const canvas = document.getElementById("canvas");
          const canvas2 = document.getElementById("canvas_img");
          const ctx = canvas.getContext('2d');
          const ctx2 = canvas2.getContext('2d');
          var i = document.getElementById("img");
          i.onload = function(){
            if(i.offsetWidth<100){i.style.width = "100px";}
            if(i.offsetHeight<100){i.style.height = "100px";i.style.width = "auto";}
            canvas.width = i.offsetWidth;
            canvas.height = i.offsetHeight;
            clip.style.top = i.offsetTop+"px";
            clip.style.left = i.offsetLeft+"px";
          }
          var clip = document.getElementById("clip");
          clip.onmousedown = function(){
            var startX = event.clientX,startY = event.clientY;
            var x = this.offsetLeft,y = this.offsetTop;
            document.body.onmousemove = function(){
              var endX = event.clientX,endY = event.clientY;
              clip.style.left = x+endX-startX+"px";
              clip.style.top = y+endY-startY+"px";
              if(clip.offsetTop < i.offsetTop){clip.style.top = i.offsetTop+"px";}
              if(clip.offsetLeft < i.offsetLeft){clip.style.left = i.offsetLeft+"px";}
              if(clip.offsetLeft+100 > i.offsetWidth+i.offsetLeft){clip.style.left = i.offsetLeft+i.offsetWidth-100+"px";}
              if(clip.offsetTop+100 > i.offsetHeight+i.offsetTop){clip.style.top = i.offsetTop+i.offsetHeight-100+"px";}
            }
            document.body.onmouseup = function(){
              document.body.onmouseup = null;
              document.body.onmousemove = null;
            }
          }
          document.getElementById("clip_buttom").onclick = function(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            var a = clip.offsetLeft-i.offsetLeft,b = clip.offsetTop-i.offsetTop;
            ctx.drawImage(i,0,0,i.offsetWidth,i.offsetHeight);
            const data = ctx.getImageData(a,b,100,100);
            ctx2.putImageData(data,0,0);
            croppedImage = canvas2.toDataURL('image/png');
            document.getElementsByClassName("avatar_edit")[0].style.backgroundImage = `url(${croppedImage})`;
            clip.onmousedown = null;
            URL.revokeObjectURL(src);
            bg.remove();
            document.getElementById("input").onchange = null;
            div.remove();
          }
          alert("点击保存才能更新头像");
        }
      }
    }else{
      var name = document.getElementById("name_value").value,intro = document.getElementById("intro_value").value,isAvatar = (croppedImage==undefined) ? false : true;
      if(name=="" || name.indexOf(" ")!=-1){alert("错误：昵称为空/含有空格");return;}
      if(name.length>7){alert("昵称长度不能超过7个字符");return;}
      if(isAvatar){
        function base64ToBlob(base64){
          let arr = base64.split(','),type = arr[0].match(/:(.*?);/)[1],bstr = atob(arr[1]),n = bstr.length,u8arr = new Uint8Array(n);
          while(n--){u8arr[n] = bstr.charCodeAt(n);}
          return new Blob([u8arr],{type}); 
        }
        const {data,error} = await supabase.storage.from('avatar').upload(`${u_id}.png`,base64ToBlob(croppedImage),{upsert:true})
        const {e} = await supabase.from('user').update({u_name:name,intro:intro,avatar:true}).eq('id',u_id);
        document.getElementsByClassName("userColumn")[0].innerHTML = `<div class="avatar" style="background-image:url(${croppedImage})"></div><div><b>${name}</b><p>${intro}</p></div>`;
      }else{
        const {error} = await supabase.from('user').update({u_name:name,intro:intro}).eq('id',u_id);
        document.getElementsByClassName("userColumn")[0].innerHTML = `<div class="avatar" style="background-image:url(${avatar})"></div><div><b>${name}</b><p>${intro}</p></div>`;
      }
      cookieSet(`userName=${name};`,365*24*60*60000);
      this.innerHTML = "编辑";
    }
  }
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
    if(u.length>7){alert("昵称长度不能超过7个字符");return;}
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
}else if(visit != undefined){
  userNameDom.innerHTML = `<a href="space.html" target="_blank">${userName}</a>`;
  var {data,error} = await supabase.from('user').select('exp,post,support,avatar,intro,follow,fans,id').eq('u_name',visit);
  const v_id = data[0].id;
  var avatar = (data[0].avatar) ? `https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/${v_id}.png` : "https://co2231a5g6hfi0gtjmd0.baseapi.memfiredb.com/storage/v1/object/public/avatar/默认.png";
  if(data[0].intro == null){data[0].intro = "还没有简介呢";}
  var fans = [];
  if(data[0].fans != null){fans = data[0].fans.split(",");}
  var follow = [];
  if(data[0].follow != null){follow = data[0].follow.split(",");}
  part_1.innerHTML = `
  <div class="follow_buttom">关注</div>
  <div class="userColumn"><div class="avatar" style="background-image:url(${avatar});"></div><div><b>${visit}</b><p>${data[0].intro}</p></div></div>
  <div class="profile">
    <div><b>${data[0].post}</b><p>帖子</p></div>
    <div><b>${data[0].support}</b><p>获赞</p></div>
    <div><b>${follow.length}</b><p>关注</p></div>
    <div><b id="fansLength">${fans.length}</b><p>粉丝</p></div>
  </div>`;
  document.getElementsByClassName("avatar")[0].onclick = function(){
    const bg = document.createElement("div");
    bg.className = "bg";
    bg.style.cursor = "zoom-out";
    document.body.appendChild(bg);
    bg.innerHTML = `<img style="cursor: zoom-out;width:200px;" src="${avatar}">`;
    bg.onclick=function(){
      bg.remove();
      bg.onclick = null;
    }
  }
  
  if(fans.indexOf(u_id) != -1){
    document.getElementsByClassName("follow_buttom")[0].innerHTML = "已关注";
  }
  document.getElementsByClassName("follow_buttom")[0].onclick = async function(){
    var fansLengthDom = document.getElementById("fansLength");
    if(this.innerHTML == "关注"){
      fans.push(u_id);
      const {error} = await supabase.from('user').update({fans:fans.toString()}).eq('u_name',visit);
      this.innerHTML = "已关注";
    }else{
      var index = fans.indexOf(u_id);
      fans.splice(index,1);
      fans = (fans.toString()==="") ? null : fans.toString();
      const {error} = await supabase.from('user').update({fans:fans}).eq('u_name',visit);
      this.innerHTML = "关注";
    }
    if(fans == null){fans = [];}
    fansLengthDom.innerHTML = fans.length;
  }
}