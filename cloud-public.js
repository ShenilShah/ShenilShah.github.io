/* Load the latest published portfolio into the public page. */
(async()=>{
  const KEY='shenilDataPortfolioV12';
  try{
    const r=await fetch('https://gtjnktmnnmibvwvdxogm.supabase.co/rest/v1/portfolio_state?slug=eq.main&select=content,updated_at',{headers:{apikey:'sb_publishable_5TXKiN4Xz2yXsV96jLqcnw_7XjMvdXG'},cache:'no-store'});
    if(!r.ok)return;
    const rows=await r.json();
    const content=rows&&rows[0]&&rows[0].content;
    if(!(content&&typeof content==='object'&&Array.isArray(content.projects)))return;
    const next=JSON.stringify(content);
    const current=localStorage.getItem(KEY)||'';
    if(current!==next){localStorage.setItem(KEY,next);location.reload();}
  }catch(e){console.warn('Portfolio cloud load skipped',e)}
})();