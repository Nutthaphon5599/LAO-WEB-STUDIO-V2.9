
(function(){
 const sb=()=>window.lwsSupabase,$=s=>document.querySelector(s);
 const form=$('#auth-form'),msg=$('#auth-message');
 if(!form)return;
 form.addEventListener('submit',async e=>{
  e.preventDefault();msg.textContent='กำลังเข้าสู่ระบบ...';
  const {data,error}=await sb().auth.signInWithPassword({email:$('#auth-email').value.trim(),password:$('#auth-password').value});
  if(error){msg.textContent=error.message;return}
  const {data:p}=await sb().from('profiles').select('role').eq('id',data.user.id).maybeSingle();
  const customer=document.body.dataset.portal==='customer';
  if(customer) location.href='customer-portal.html';
  else if(p&&['owner','manager','staff'].includes(p.role)) location.href='admin.html';
  else {await sb().auth.signOut();msg.textContent='บัญชีนี้ไม่มีสิทธิ์เข้า Admin';}
 });
 const signup=$('#signup-form');
 if(signup)signup.addEventListener('submit',async e=>{
  e.preventDefault();msg.textContent='กำลังสร้างบัญชี...';
  const {error}=await sb().auth.signUp({email:$('#signup-email').value.trim(),password:$('#signup-password').value,options:{data:{full_name:$('#signup-name').value.trim(),role:'customer'}}});
  msg.textContent=error?error.message:'สร้างบัญชีแล้ว กรุณาตรวจอีเมลเพื่อยืนยัน';
 });
})();
