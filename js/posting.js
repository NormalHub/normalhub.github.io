import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
var project_url = "https://lcrqhaflehfcgocpqzvq.supabase.co";
var API_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcnFoYWZsZWhmY2dvY3BxenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM0Mzg5NjMsImV4cCI6MjAwOTAxNDk2M30.PzOWUAj9FdyOMq_sDspx0-rRf1lze78Eu8lCfjK3YIQ";
const supabase = createClient(project_url,API_key);
async function getPosting(){
  var time = window.location.search.slice(1);
  const { data, error } = await supabase
    .from('posting')
    .select()
    .eq('time', time);
  var time = data[0].time;
  var title = data[0].title;
  var content = data[0].content;
  var sender = data[0].sender;
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
  document.getElementById("title").innerHTML = title;
  document.getElementById("time").innerHTML = date;
  document.getElementById("content").innerHTML = content;
  document.getElementById("sender").innerHTML = sender;
}
getPosting();
var cookies = document.cookie;
function followPosting(){
}




