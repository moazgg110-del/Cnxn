// إعدادات الربط مع Supabase (جاهزة لتضع المفاتيح الخاصة بك)
const SUPABASE_URL = "YOUR_SUPABASE_URL"; // استبدل بـ URL المشروع الخاص بك
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY"; // استبدل بـ Anon Key

let supabase = null;

if (window.supabase && SUPABASE_URL !== "YOUR_SUPABASE_URL") {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("تمت تهيئة Supabase بنجاح!");
} else {
    console.warn("Supabase لم يتم ربطه بعد، يتم التشغيل في الوضع المحلي (Local Mode).");
}

/* 
 💡 تعليمات إنشاء الجداول في Supabase SQL Editor:
 
 CREATE TABLE profiles (
   id UUID PRIMARY KEY DEFAULT auth.uid(),
   username TEXT,
   points INT DEFAULT 0,
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
 );

 CREATE TABLE quiz_results (
   id BIGSERIAL PRIMARY KEY,
   user_id UUID REFERENCES profiles(id),
   lesson_id TEXT,
   score INT,
   created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
 );
*/
