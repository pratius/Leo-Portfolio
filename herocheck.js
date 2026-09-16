const { chromium } = require('playwright');
const SP='/tmp/claude-0/-home-claude/7f21a407-0f76-5a5c-ba5b-072169a089b1/scratchpad/package/files';
const FACE=[400,500,600,700,800].map(w=>`@font-face{font-family:'Inter';font-style:normal;font-weight:${w};font-display:block;src:url('file://${SP}/inter-latin-${w}-normal.woff2') format('woff2');}`).join('\n');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  async function shot(sel,tag,scrollFirst){
    const p=await (await b.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1.3})).newPage();
    await p.goto('file:///home/claude/portfolio/portfolio/index.html',{waitUntil:'load'});
    await p.addStyleTag({content:FACE});
    await p.addStyleTag({content:'.reveal-up{opacity:1!important;transform:none!important}.loader{display:none!important}'});
    await p.evaluate(()=>document.fonts.ready);
    await p.waitForTimeout(1200);
    if(scrollFirst){ for(let y=0;y<7000;y+=400){await p.evaluate(v=>scrollTo(0,v),y);await p.waitForTimeout(70);} await p.waitForTimeout(1500); }
    const el=await p.$(sel);
    if(!el){console.log('MISSING',sel);await p.context().close();return;}
    await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
    await el.screenshot({path:'/home/claude/shots/hp-'+tag+'.png'});
    console.log('shot hp-'+tag);
    await p.context().close();
  }
  await shot('.hero__inner','hero',false);
  await shot('.about__grid','about',true);
  await shot('.exp-timeline > li:first-child','exp',true);
  await b.close();
})();
