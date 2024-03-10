import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
var SupabaseUrl = "https://kzicffnuaniysdkenbes.supabase.co";
var SupabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aWNmZm51YW5peXNka2VuYmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg2OTAwMzIsImV4cCI6MjAyNDI2NjAzMn0.Exr237hk8hYlEjP1ZvNigWSPGAe9ThIrQAiP9-WftFg";
const supabase = createClient(SupabaseUrl, SupabaseKey);

import {markdownToHTML} from "./markdown.js";
var contentdom = document.getElementById("content");
contentdom.innerHTML = markdownToHTML(contentdom.innerHTML);

//评论
var discussiondom = document.getElementsByClassName("discussion")[0];
discussiondom.innerHTML = "暂不支持评论";