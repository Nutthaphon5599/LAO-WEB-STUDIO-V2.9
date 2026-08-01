
(function(){
'use strict';
const sb=()=>window.lwsSupabase;
const publicPages=['admin-login.html','customer-login.html'];
const page=location.pathname.split('/').pop()||'index.html';
const isAdmin=page.startsWith('admin')&&!publicPages.includes(page);
async function profile(){
 const {data:{user}}=await sb().auth.getUser(); if(!user)return null;
 const {data}=await sb().from('profiles').select('*').eq('id',user.id).maybeSingle();
 return data||{id:user.id,email:user.email,role:'customer'};
}
async function guard(){
 if(!sb())return;
 const {data:{session}}=await sb().auth.getSession();
 if(isAdmin){
   if(!session){ location.replace('admin-login.html'); return; }
   const p=await profile();
   if(!p||!['owner','manager','staff'].includes(p.role)){ await sb().auth.signOut();location.replace('admin-login.html?denied=1'); }
 }
 if(page==='customer-portal.html'&&!session) location.replace('customer-login.html');
}
window.lwsGetProfile=profile;
window.lwsSignOut=async()=>{await sb().auth.signOut();location.replace(page==='customer-portal.html'?'customer-login.html':'admin-login.html');};
guard();
})();
