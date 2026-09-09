/* Shenil Portfolio cloud sync */
(() => {
  const SUPABASE_URL='https://gtjnktmnnmibvwvdxogm.supabase.co';
  const SUPABASE_KEY='sb_publishable_5TXKiN4Xz2yXsV96jLqcnw_7XjMvdXG';
  const KEY='shenilDataPortfolioV12';
  let sb=null;

  function loadSupabase(){
    return new Promise((resolve,reject)=>{
      if(window.supabase) return resolve();
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
    });
  }
  function message(text,good=false){
    let el=document.getElementById('cloudSyncStatus');
    if(!el){el=document.createElement('div');el.id='cloudSyncStatus';el.style='position:fixed;right:18px;bottom:18px;z-index:999999;padding:12px 16px;border-radius:10px;background:#10252f;color:#fff;border:1px solid rgba(68,228,255,.35);font:12px Arial;max-width:360px';document.body.appendChild(el)}
    el.textContent=text; if(good)setTimeout(()=>el.remove(),3500);
  }
  async function init(){
    try{await loadSupabase();sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);}catch(e){message('Cloud connection could not load.');return;}
    const {data:{session}}=await sb.auth.getSession();
    if(!session) showLogin(); else enablePublish();
  }
  function showLogin(){
    if(document.getElementById('cloudLogin'))return;
    const box=document.createElement('div');box.id='cloudLogin';box.style='position:fixed;right:18px;bottom:18px;z-index:999999;background:#0a1923;color:#fff;border:1px solid rgba(68,228,255,.35);border-radius:14px;padding:14px;width:290px;font:12px Arial;box-shadow:0 20px 60px rgba(0,0,0,.45)';
    box.innerHTML='<b style="color:#b8ff6a">CLOUD PUBLISHING</b><p style="color:#91aebb">Sign in once to publish this portfolio to the live website.</p><input id="cloudEmail" value="shenil1910@gmail.com" style="width:100%;margin:4px 0;padding:9px;background:#07131c;color:#fff;border:1px solid #24404f;border-radius:8px"><input id="cloudPassword" type="password" placeholder="Password" style="width:100%;margin:4px 0;padding:9px;background:#07131c;color:#fff;border:1px solid #24404f;border-radius:8px"><button id="cloudSignIn" style="width:100%;margin-top:7px;padding:9px;border:0;border-radius:8px;background:#44e4ff;color:#06111a;font-weight:800">Sign in</button><div id="cloudLoginMsg" style="margin-top:7px;color:#91aebb"></div>';
    document.body.appendChild(box);
    document.getElementById('cloudSignIn').onclick=async()=>{const email=document.getElementById('cloudEmail').value.trim(),password=document.getElementById('cloudPassword').value;const {error}=await sb.auth.signInWithPassword({email,password});if(error){document.getElementById('cloudLoginMsg').textContent=error.message;return}box.remove();enablePublish();message('Cloud publishing connected.',true)};
  }
  function enablePublish(){
    const oldSave=window.save;
    window.save=function(show=true){
      let ok=true;try{localStorage.setItem(KEY,JSON.stringify(window.data));}catch(e){ok=false}
      if(show) publishNow();
      return ok;
    };
    async function addPublishButton(){
      if(document.getElementById('cloudPublishBtn'))return;
      const host=document.querySelector('.edit-actions')||document.querySelector('.editbar');if(!host)return;
      const b=document.createElement('button');b.id='cloudPublishBtn';b.className='pillbtn primary';b.textContent='Publish Changes';b.onclick=publishNow;host.appendChild(b);
    }
    addPublishButton();setTimeout(addPublishButton,500);
  }
  async function publishNow(){
    if(!sb)return;
    const {data:{session}}=await sb.auth.getSession();if(!session){showLogin();return}
    let payload=window.data;
    if(!payload){try{payload=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}}
    if(!payload||!Array.isArray(payload.projects)){message('Publish stopped: portfolio data was not found.');return}
    message('Publishing current portfolio…');
    const {error}=await sb.from('portfolio_state').upsert({slug:'main',content:payload,updated_at:new Date().toISOString()},{onConflict:'slug'});
    if(error){message('Publish failed: '+error.message);return}
    message('Published — live portfolio updated.',true);
  }
  window.publishPortfolioToCloud=publishNow;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();