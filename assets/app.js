(function(){
  const $=id=>document.getElementById(id);
  const SEV=["Critical","High","Medium","Low"];
  const STAGES=["Received","Assessed","Contained","Shared"];
  const OPEN=new Set(["Received","Assessed","Contained"]);
  const PRIN=["Fairness","Reliability, Safety & Control","Privacy & Security","Inclusiveness","Transparency","Accountability","Human Benefit & Happiness"];
  const CLS={en:[["Critical","Confirmed harm or loss of control: safety controls disabled, data exfiltration, unauthorised real-world action, attack on live critical or city infrastructure","Assessed within 3 h; contained and regulators notified"],
    ["High","Serious enforcement, litigation, binding law affecting Malaysia, major misuse campaign, or any threat or incident in Malaysia / ASEAN","Assessed within 24 h; owner assigned"],
    ["Medium","Notable policy, research or near-miss signal with no confirmed harm","Assessed within 1 week; monitored"],
    ["Low","Background trend","Logged; reviewed monthly"]],
    ms:[["Critical","Kemudaratan disahkan atau kehilangan kawalan: kawalan keselamatan dilumpuhkan, data dicuri, tindakan dunia nyata tanpa kebenaran, serangan ke atas infrastruktur kritikal atau bandar","Dinilai dalam 3 jam; dibendung dan pengawal selia dimaklumkan"],
    ["High","Penguatkuasaan serius, litigasi, undang-undang mengikat yang menjejaskan Malaysia, kempen penyalahgunaan besar, atau sebarang ancaman/insiden di Malaysia / ASEAN","Dinilai dalam 24 jam; pemilik ditetapkan"],
    ["Medium","Isyarat dasar, penyelidikan atau hampir-insiden tanpa kemudaratan disahkan","Dinilai dalam 1 minggu; dipantau"],
    ["Low","Trend latar belakang","Direkod; disemak bulanan"]]};
  const LEGACY={New:"Received",Acknowledged:"Assessed",Monitoring:"Assessed",Closed:"Shared"};
  let items=[],scans=[],config=null,inits=[],lang="en";
  try{lang=localStorage.getItem("aiw-lang")||"en"}catch(e){}
  let filters={init:"",sev:"",status:"open",q:""};
  try{filters=Object.assign(filters,JSON.parse(localStorage.getItem("aiw-pub-filters")||"{}"))}catch(e){}

  const T=(k,fb)=>{const d=window.AIW_I18N||{};return (lang==="ms"&&d.ms&&d.ms[k])||fb||k};
  const fmt=iso=>{if(!iso)return "–";const d=new Date(iso);if(isNaN(d))return iso;
    return d.toLocaleString(lang==="ms"?"ms-MY":"en-MY",{timeZone:"Asia/Kuala_Lumpur",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",hour12:false})};
  const fmtDate=iso=>{if(!iso)return "–";const d=new Date(iso);if(isNaN(d))return iso;
    return d.toLocaleDateString(lang==="ms"?"ms-MY":"en-MY",{timeZone:"Asia/Kuala_Lumpur",day:"2-digit",month:"short",year:"numeric"})};
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const safeUrl=u=>/^https?:\/\//i.test(u||"")?u:"";
  const isMY=r=>/malaysia|asean|singapore|indonesia|thailand|philippines|vietnam|brunei/i.test(r||"");
  const stage=i=>LEGACY[i.status]||i.status||"Received";
  const kind=i=>i.kind||"incident";
  const alertLevel=i=>(i.severity==="Critical"||i.severity==="High")&&stage(i)==="Received";
  const stL=s=>T("stage_"+s,s), sevL=s=>T("sev_"+s,s);

  function applyLang(){
    document.documentElement.lang=lang==="ms"?"ms":"en";
    const d=window.AIW_I18N||{};
    document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(!el.dataset.en)el.dataset.en=el.innerHTML;el.innerHTML=lang==="ms"&&d.ms&&d.ms[k]?d.ms[k]:el.dataset.en});
    document.querySelectorAll("[data-i18n-ph]").forEach(el=>{const k=el.dataset.i18nPh;if(!el.dataset.en)el.dataset.en=el.placeholder;el.placeholder=lang==="ms"&&d.ms&&d.ms[k]?d.ms[k]:el.dataset.en});
    document.querySelectorAll(".lang button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lang===lang?"true":"false"));
    if(items.length)$("live-text").textContent=T("static","Updated every 3 hours");
    $("cls").querySelector("tbody").innerHTML=CLS[lang].map(r=>`<tr><td><span class="tag sev ${r[0]}">${sevL(r[0])}</span></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");
  }
  document.querySelectorAll(".lang button").forEach(b=>b.addEventListener("click",()=>{lang=b.dataset.lang;try{localStorage.setItem("aiw-lang",lang)}catch(e){}applyLang();renderAll()}));
  $("f-init").value=filters.init;$("f-sev").value=filters.sev;$("f-status").value=filters.status;$("f-q").value=filters.q;

  function renderStatus(){
    const last=scans[0],ls=$("pill-scan"),ns=$("pill-next");
    if(last){
      $("last-scan").textContent=fmt(last.ran_at);
      const ageH=(Date.now()-new Date(last.ran_at))/36e5;ls.className="pill"+(ageH>4?" stale":"");
      const next=new Date(new Date(last.ran_at).getTime()+3*36e5);
      $("next-scan").textContent=fmt(next.toISOString());ns.className="pill"+(next<Date.now()?" stale":"");
      $("foot-updated").textContent=fmt(last.ran_at);
    }else{$("last-scan").textContent="–";$("next-scan").textContent="–"}
  }
  function renderAlert(){
    const hits=items.filter(alertLevel);const a=$("alert");
    if(!hits.length){a.classList.remove("on");return}
    a.classList.add("on");
    const top=hits.slice().sort((x,y)=>SEV.indexOf(x.severity)-SEV.indexOf(y.severity))[0];
    $("alert-title").textContent=lang==="ms"?T("warn_title").replace("{n}",hits.length).replace("{s}",sevL(top.severity)):`Early warning: ${hits.length} unassessed ${hits.length===1?"item":"items"} · highest ${top.severity}`;
    $("alert-sub").textContent=top.title;
  }
  function renderKpis(){
    const inc=items.filter(i=>kind(i)!=="threat"),open=inc.filter(i=>OPEN.has(stage(i)));
    $("k-open").textContent=open.filter(i=>kind(i)==="incident").length;
    $("k-near").textContent=open.filter(i=>kind(i)==="near-miss").length;
    $("k-threat").textContent=items.filter(i=>kind(i)==="threat"&&OPEN.has(stage(i))).length;
    $("k-sev").textContent=items.filter(i=>OPEN.has(stage(i))&&(i.severity==="Critical"||i.severity==="High")).length;
    $("k-my").textContent=items.filter(i=>OPEN.has(stage(i))&&isMY(i.region)).length;
    $("k-shared").textContent=items.filter(i=>stage(i)==="Shared").length;
    $("pipe").innerHTML=STAGES.map(s=>`<div class="st"><div class="n">${inc.filter(i=>stage(i)===s).length}</div><div class="l">${stL(s)}</div></div>`).join("");
    const open2=items.filter(i=>OPEN.has(stage(i)));
    const counts=PRIN.map(p=>open2.filter(i=>(i.principles||[]).includes(p)).length);
    const max=Math.max(1,...counts),untag=open2.filter(i=>!(i.principles||[]).length).length;
    $("prin-bars").innerHTML=PRIN.map((p,k)=>`<div class="bar"><span>${p}</span><div class="tr" aria-hidden="true"><div class="fl" style="width:${counts[k]/max*100}%"></div></div><span class="v mono">${counts[k]}</span></div>`).join("")+
      `<div class="bar"><span style="color:var(--muted)">${T("notyet","Not yet assessed")}</span><div class="tr" aria-hidden="true"><div class="fl" style="width:${untag/max*100}%;background:var(--muted)"></div></div><span class="v mono">${untag}</span></div>`;
  }
  function card(i){
    const st=stage(i),k=kind(i),idx=STAGES.indexOf(st),src=safeUrl(i.source_url);
    const steps=STAGES.map((s,n)=>`<i class="${n<=idx?"on":""}" title="${stL(s)}"></i>`).join("");
    const kl=k==="near-miss"?T("kind_near","Near-miss"):k==="threat"?T("kind_threat","Threat pattern"):T("kind_incident","Incident");
    return `<article class="inc ${esc(i.severity)}">
      <div class="stripe" aria-hidden="true"></div>
      <div class="in">
        <div class="row1">
          <span class="tag sev ${esc(i.severity)}">${esc(sevL(i.severity))}</span>
          <span class="tag kind ${k}">${kl}</span>
          <span class="tag init">${esc(i.initiative)}</span>
          ${st==="Received"?`<span class="tag new">${esc(stL("Received")).toUpperCase()}</span>`:""}
          ${isMY(i.region)?'<span class="tag my">MY / ASEAN</span>':""}
          ${i.category?`<span class="tag dim">${esc(i.category)}</span>`:""}
          ${(i.principles||[]).map(p=>`<span class="tag dim">${esc(p)}</span>`).join("")}
        </div>
        <h3>${esc(i.title)}</h3>
        ${i.summary?`<p>${esc(i.summary)}</p>`:""}
        <div class="meta">
          <span class="steps" role="img" aria-label="${stL(st)}">${steps}</span>
          <span><strong>${stL(st)}</strong></span>
          <span>${T("event","Event")} <span class="mono">${fmtDate(i.event_date)}</span></span>
          <span>${T("received","Received")} <span class="mono">${fmt(i.detected_at)}</span></span>
          ${i.region?`<span>${esc(i.region)}</span>`:""}
          ${src?`<a href="${esc(src)}" target="_blank" rel="noopener">${esc(i.source_name||T("source","Source"))} ↗</a>`:`<span>${T("nosrc","No source link")}</span>`}
        </div>
        ${st==="Shared"&&i.lessons?`<div class="learn"><b>${T("lessons","Lessons learned")}:</b> ${esc(i.lessons)}</div>`:""}
      </div></article>`;
  }
  const sortList=list=>list.sort((a,b)=>{const ra=stage(a)==="Received",rb=stage(b)==="Received";if(ra!==rb)return ra?-1:1;
    const s=SEV.indexOf(a.severity)-SEV.indexOf(b.severity);if(s)return s;return new Date(b.detected_at)-new Date(a.detected_at)});
  function renderFeed(){
    const q=filters.q.toLowerCase();
    const pass=i=>(!filters.init||i.initiative===filters.init||i.initiative==="Both")&&(!filters.sev||i.severity===filters.sev)&&
      (filters.status==="open"?OPEN.has(stage(i)):(!filters.status||stage(i)===filters.status))&&
      (!q||[i.title,i.summary,i.source_name,i.region,i.category,i.lessons].join(" ").toLowerCase().includes(q));
    const inc=sortList(items.filter(i=>kind(i)!=="threat"&&pass(i)));
    const th=sortList(items.filter(i=>kind(i)==="threat"&&pass(i)));
    $("feed").innerHTML=inc.length?inc.map(card).join(""):`<div class="empty"><b>${T("none_inc","No incidents match these filters")}</b>${T("try","Try All stages or clear the search.")}</div>`;
    $("threats").innerHTML=th.length?th.map(card).join(""):`<div class="empty"><b>${T("none_thr","No threat patterns match")}</b>${T("try","Try All stages or clear the search.")}</div>`;
  }
  function renderScans(){
    const ul=$("scans");
    if(!scans.length){ul.innerHTML=`<li><span class="t">${T("noscan","No runs recorded yet")}</span><span></span></li>`;return}
    ul.innerHTML=scans.slice(0,10).map(s=>`<li><span><span class="mono">${fmt(s.ran_at)}</span> <span class="t">· ${esc(s.status||"ok")}</span></span>
      <span class="mono">${s.new_count||0} ${T("new","new")}${s.alerts_fired?` · <span style="color:var(--crit)">${s.alerts_fired} ${T("warn","warn")}</span>`:""}</span></li>`).join("");
  }
  function renderInits(){
    const open=items.filter(i=>OPEN.has(stage(i)));
    $("inits").innerHTML=inits.slice().sort((a,b)=>(a.order||9)-(b.order||9)).map(n=>{
      const count=open.filter(i=>i.initiative===n.name||i.initiative==="Both").length;
      return `<details class="init"><summary><strong>${esc(n.name)}</strong><span class="tag init">${count} ${T("open","open")}</span><span class="st">${esc(n.status||"")}</span></summary>
        <div class="ib"><div class="own">${T("owner","Owner")}: ${esc(n.owner||"–")}</div>
          ${n.goal?`<div><div class="lbl">${T("goal","Goal of this channel")}</div><div>${esc(n.goal)}</div></div>`:""}
          <div><div class="lbl">${T("facts","Key facts")}</div><ul>${(n.facts||[]).map(f=>`<li>${esc(f)}</li>`).join("")}</ul></div>
          <div><div class="lbl">${T("watch","Watch list")}</div><ul>${(n.watch||[]).map(f=>`<li>${esc(f)}</li>`).join("")}</ul></div>
          <div><div class="lbl">${T("sources","Sources")}</div><div class="src">${(n.sources||[]).filter(s=>safeUrl(s.url)).map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a>`).join("")}</div></div>
        </div></details>`}).join("");
  }
  function renderAll(){renderStatus();renderAlert();renderKpis();renderFeed();renderScans();renderInits()}
  for(const [id,key] of [["f-init","init"],["f-sev","sev"],["f-status","status"],["f-q","q"]]){
    $(id).addEventListener("input",e=>{filters[key]=e.target.value;try{localStorage.setItem("aiw-pub-filters",JSON.stringify(filters))}catch(x){}renderFeed()});
  }
  applyLang();
  (async()=>{
    const live=$("pill-live");
    try{
      const v="?v="+Math.floor(Date.now()/6e5);
      const [inc,sc,ini,cfg]=await Promise.all(["data/incidents.json","data/scans.json","data/initiatives.json","data/config.json"].map(u=>fetch(u+v).then(r=>r.ok?r.json():null)));
      items=(inc||[]).filter(i=>i.public!==false);
      scans=(sc||[]).sort((a,b)=>new Date(b.ran_at)-new Date(a.ran_at));
      inits=ini||[];config=cfg||null;
      live.className="pill";$("live-text").textContent=T("static","Updated every 3 hours");
      renderAll();
    }catch(e){live.className="pill off";$("live-text").textContent="Data unavailable";renderAll()}
  })();
})();
