import { useState, useRef, useEffect, useCallback } from "react";
import { SCHEMES, filterSchemes, SCHEME_STATES, SCHEME_CATEGORIES } from "./data/schemes.js";
import { downloadSchemesPDF } from "./utils/pdf.js";
import { t } from "./i18n.js";

// ─── Constants ────────────────────────────────────────────────
const FLAG = { saffron:"#FF9933", white:"#FFFFFF", green:"#138808", navy:"#000080" };
const LANGS = [{ code:"en",label:"English" },{ code:"hi",label:"हिंदी" },{ code:"te",label:"తెలుగు" },{ code:"kn",label:"ಕನ್ನಡ" }];
const ALL_STATES = ["All India",...SCHEME_STATES];
const OCCUPATIONS = ["all","farmer","student","daily_wage","self_employed","business","employed","unemployed"];
const INCOMES = [
  { value:50000,label:"Below ₹50,000" },{ value:120000,label:"₹50K – ₹1.2L" },
  { value:200000,label:"₹1.2L – ₹2L" },{ value:300000,label:"₹2L – ₹3L" },
  { value:500000,label:"₹3L – ₹5L" },{ value:1000000,label:"₹5L – ₹10L" },
  { value:1800000,label:"Above ₹10L" },
];
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// ─── Theme ───────────────────────────────────────────────────
function useTheme() {
  const [dark,setDark] = useState(()=>localStorage.getItem("as_dark")==="1");
  const toggle = ()=>setDark(d=>{ localStorage.setItem("as_dark",d?"0":"1"); return !d; });
  const T = dark
    ?{ bg:"#0f1117",card:"#1a1d27",border:"#2d3148",text:"#e8eaf6",text2:"#9fa8da",input:"#1e2235",nav:"#12151f" }
    :{ bg:"#f5f7ff",card:"#ffffff",border:"#e0e4f5",text:"#1a237e",text2:"#555",input:"#f0f3ff",nav:"#ffffff" };
  return { dark,toggle,T };
}

// ─── PWA ─────────────────────────────────────────────────────
function usePWA() {
  const [isOffline,setIsOffline] = useState(!navigator.onLine);
  const [installPrompt,setInstallPrompt] = useState(null);
  const [installed,setInstalled] = useState(false);
  useEffect(()=>{
    if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(()=>{});
    const on=()=>setIsOffline(false), off=()=>setIsOffline(true);
    const onPrompt=(e)=>{ e.preventDefault(); setInstallPrompt(e); };
    const onInstalled=()=>{ setInstalled(true); setInstallPrompt(null); };
    window.addEventListener("online",on); window.addEventListener("offline",off);
    window.addEventListener("beforeinstallprompt",onPrompt);
    window.addEventListener("appinstalled",onInstalled);
    return ()=>{
      window.removeEventListener("online",on); window.removeEventListener("offline",off);
      window.removeEventListener("beforeinstallprompt",onPrompt);
      window.removeEventListener("appinstalled",onInstalled);
    };
  },[]);
  const promptInstall = async()=>{ if(!installPrompt)return; installPrompt.prompt(); const{outcome}=await installPrompt.userChoice; if(outcome==="accepted"){setInstalled(true);setInstallPrompt(null);} };
  return { isOffline,installPrompt,installed,promptInstall };
}

// ─── Saved & Applied ─────────────────────────────────────────
function useSaved() {
  const [saved,setSaved] = useState(()=>{ try{return JSON.parse(localStorage.getItem("as_saved")||"[]");}catch{return[];} });
  const toggle=(id)=>setSaved(prev=>{ const next=prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]; localStorage.setItem("as_saved",JSON.stringify(next)); return next; });
  const clear=()=>{ setSaved([]); localStorage.removeItem("as_saved"); };
  return { saved,toggle,clear };
}

function useApplied() {
  const [applied,setApplied] = useState(()=>{ try{return JSON.parse(localStorage.getItem("as_applied")||"[]");}catch{return[];} });
  const toggle=(id)=>setApplied(prev=>{ const next=prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]; localStorage.setItem("as_applied",JSON.stringify(next)); return next; });
  return { applied,toggle };
}

// ─── Analytics ───────────────────────────────────────────────
function trackEvent(name, data={}) {
  try {
    // Plausible (if loaded)
    if(window.plausible) window.plausible(name, { props: data });
    // Local fallback
    const key="as_analytics";
    const existing=JSON.parse(localStorage.getItem(key)||"[]");
    existing.push({ event:name,...data,ts:Date.now() });
    if(existing.length>100) existing.splice(0,existing.length-100);
    localStorage.setItem(key,JSON.stringify(existing));
  } catch {}
}

// ─── Helpers ─────────────────────────────────────────────────
function btnStyle(bg,color,small){ return { background:bg,color,border:"none",borderRadius:8,padding:small?"6px 10px":"12px 24px",fontSize:small?11:14,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap" }; }
function inputStyle(T){ return { background:T.input,color:T.text,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",fontSize:14 }; }
function labelStyle(T){ return { display:"block",fontSize:12,fontWeight:600,color:T.text2,marginBottom:4 }; }

function Select({ value,onChange,children,T,style={} }){
  return <select value={value} onChange={e=>onChange(e.target.value)} style={{...inputStyle(T),width:"100%",...style}}>{children}</select>;
}

function FlagStripe(){
  return <div style={{display:"flex",height:5}}>{[FLAG.saffron,FLAG.white,FLAG.green].map((c,i)=><div key={i} style={{flex:1,background:c,borderTop:c===FLAG.white?"1px solid #eee":"none"}}/>)}</div>;
}

function Badge({ text,color }){
  return <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,background:color+"22",color,border:`1px solid ${color}44`,whiteSpace:"nowrap"}}>{text}</span>;
}

// ─── Back To Top Button ───────────────────────────────────────
function BackToTop({ T }) {
  const [visible,setVisible] = useState(false);
  useEffect(()=>{
    const onScroll=()=>setVisible(window.scrollY > 400);
    window.addEventListener("scroll",onScroll,{ passive:true });
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);
  if(!visible) return null;
  return (
    <button
      onClick={()=>window.scrollTo({ top:0, behavior:"smooth" })}
      style={{ position:"fixed",bottom:72,right:16,width:40,height:40,borderRadius:"50%",background:FLAG.saffron,color:"#fff",border:"none",fontSize:18,cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,0.2)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center" }}
      title="Back to top"
    >↑</button>
  );
}

// ─── Spinner ─────────────────────────────────────────────────
function Spinner({ T }) {
  return (
    <div style={{textAlign:"center",padding:"32px 0"}}>
      <div style={{display:"inline-block",width:36,height:36,border:`3px solid ${T.border}`,borderTop:`3px solid ${FLAG.saffron}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function shareOnWhatsApp(scheme){
  const msg=`🌉 *Adhikar Setu*\n\n*${scheme.name}*\n💰 ${scheme.benefit}\n🔗 ${scheme.applyUrl}\n\n_Find your schemes: adhikarasetu.vercel.app_`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,"_blank");
}

function shareAllResults(schemes){
  const lines=schemes.slice(0,8).map((s,i)=>`${i+1}. *${s.name}*\n   💰 ${s.benefit}`).join("\n\n");
  const msg=`🌉 *Adhikar Setu — My Eligible Schemes*\n\n${lines}\n\n_Find your schemes: adhikarasetu.vercel.app_`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,"_blank");
  trackEvent("share_all",{ count:schemes.length });
}

// ─── Scheme Card ─────────────────────────────────────────────
function SchemeCard({ scheme,lang,T,saved,onToggleSave,applied,onToggleApplied,onDetail }){
  const isSaved=saved.includes(scheme.id), isApplied=applied.includes(scheme.id);
  const isState=scheme.scope==="state", accent=isState?FLAG.green:FLAG.saffron;
  return (
    <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
      <div style={{borderLeft:`4px solid ${accent}`,padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:6}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}>
              <Badge text={isState?`${t(lang,"scopeState")} · ${scheme.states[0]}`:t(lang,"scopeCentral")} color={accent}/>
              <Badge text={scheme.category.toUpperCase()} color={FLAG.navy}/>
              {isApplied&&<Badge text="✅ Applied" color="#2e7d32"/>}
            </div>
            <div style={{fontWeight:700,fontSize:14,color:T.text,lineHeight:1.3}}>{scheme.name}</div>
            <div style={{fontSize:11,color:T.text2,marginTop:2}}>{scheme.ministry}</div>
          </div>
          <button onClick={()=>onToggleSave(scheme.id)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",padding:4,flexShrink:0}}>{isSaved?"✅":"🔖"}</button>
        </div>
        <div style={{background:FLAG.green+"11",borderRadius:8,padding:"6px 10px",marginBottom:10}}>
          <span style={{fontSize:10,fontWeight:700,color:FLAG.green,textTransform:"uppercase"}}>{t(lang,"benefit")}: </span>
          <span style={{fontSize:13,fontWeight:600,color:T.text}}>{scheme.benefit}</span>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <button onClick={()=>{ onDetail(scheme); trackEvent("detail_view",{id:scheme.id}); }} style={btnStyle(FLAG.navy,"#fff",true)}>{t(lang,"detailBtn")}</button>
          <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer" onClick={()=>trackEvent("apply_click",{id:scheme.id})} style={{...btnStyle(FLAG.green,"#fff",true),textDecoration:"none"}}>{t(lang,"applyBtn")}</a>
          <button onClick={()=>onToggleApplied(scheme.id)} style={btnStyle(isApplied?"#2e7d32":FLAG.saffron,"#fff",true)}>{isApplied?t(lang,"appliedBtn"):t(lang,"applyTrackBtn")}</button>
          <button onClick={()=>shareOnWhatsApp(scheme)} style={btnStyle("#25D366","#fff",true)}>{t(lang,"whatsappBtn")}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────
function HomePage({ T,lang,onNav }){
  const stats=[{n:"58+",l:"Schemes"},{n:"15",l:"States"},{n:"4",l:"Languages"},{n:"Free",l:"Always"}];
  const cats=[["🏥","Health"],["🏠","Housing"],["🌾","Agriculture"],["📚","Education"],["👩","Women"],["👴","Pension"],["💼","Employment"],["🏪","Business"],["♿","Disability"],["🌙","Minority"],["🍚","Food"],["🤝","Social"]];
  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"0 16px 80px"}}>
      <div style={{textAlign:"center",padding:"32px 0 24px"}}>
        <div style={{fontSize:52,marginBottom:12}}>🌉</div>
        <h1 style={{fontSize:26,fontWeight:800,color:T.text,margin:"0 0 6px"}}>{t(lang,"heroTitle1")}</h1>
        <h2 style={{fontSize:22,fontWeight:700,color:FLAG.saffron,margin:"0 0 12px"}}>{t(lang,"heroTitle2")}</h2>
        <p style={{color:T.text2,fontSize:14,lineHeight:1.6,whiteSpace:"pre-line",marginBottom:24}}>{t(lang,"heroSub")}</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>onNav("form")} style={{...btnStyle(FLAG.saffron,"#fff"),padding:"13px 28px",fontSize:15}}>{t(lang,"formBtn")}</button>
          <button onClick={()=>onNav("chat")} style={{...btnStyle(FLAG.navy,"#fff"),padding:"13px 28px",fontSize:15}}>{t(lang,"chatBtn")}</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:28}}>
        {stats.map((s,i)=>(
          <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 8px",textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:800,color:FLAG.saffron}}>{s.n}</div>
            <div style={{fontSize:10,color:T.text2,marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:24}}>
        <h3 style={{color:T.text,fontSize:16,fontWeight:700,marginBottom:12}}>{t(lang,"categoriesTitle")}</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {cats.map(([icon,label],i)=>(
            <div key={i} onClick={()=>onNav("form")} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 8px",textAlign:"center",cursor:"pointer"}}>
              <div style={{fontSize:22,marginBottom:4}}>{icon}</div>
              <div style={{fontSize:11,color:T.text2,fontWeight:600}}>{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 style={{color:T.text,fontSize:16,fontWeight:700,marginBottom:12}}>{t(lang,"howTitle")}</h3>
        {[["1",t(lang,"step1Title"),t(lang,"step1Desc"),FLAG.saffron],["2",t(lang,"step2Title"),t(lang,"step2Desc"),FLAG.green],["3",t(lang,"step3Title"),t(lang,"step3Desc"),FLAG.navy]].map(([n,title,desc,color])=>(
          <div key={n} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 16px",display:"flex",gap:14,alignItems:"flex-start",marginBottom:10}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,flexShrink:0}}>{n}</div>
            <div><div style={{fontWeight:700,color:T.text,fontSize:14}}>{title}</div><div style={{color:T.text2,fontSize:12,marginTop:2}}>{desc}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Form + Results Page ──────────────────────────────────────
function FormPage({ T,lang,saved,onToggleSave,applied,onToggleApplied }){
  const [profile,setProfile] = useState(()=>{ try{return JSON.parse(localStorage.getItem("as_profile")||"{}");}catch{return{};} });
  const [results,setResults] = useState(null);
  const [searching,setSearching] = useState(false);
  const [formError,setFormError] = useState("");
  const [detail,setDetail] = useState(null);
  const [categoryFilter,setCategoryFilter] = useState("all");
  const [scopeFilter,setScopeFilter] = useState("all");
  const [search,setSearch] = useState("");
  const [downloading,setDownloading] = useState(false);
  const resultsRef = useRef(null);
  const set=(k,v)=>{ setProfile(p=>({...p,[k]:v})); setFormError(""); };

  const validate=()=>{
    const age=parseInt(profile.age);
    if(!profile.age && !profile.state) return "Please enter your Age and select a State to find relevant schemes.";
    if(!profile.age) return "Please enter your Age to find matching schemes.";
    if(isNaN(age)||age<1||age>120) return "Please enter a valid age between 1 and 120.";
    if(age<5) return "Minimum age for most schemes is 5 years. Please check your age.";
    return "";
  };

  const handleFind=()=>{
    const err=validate();
    if(err){ setFormError(err); return; }
    setFormError("");
    setSearching(true);
    setTimeout(()=>{
      const found=filterSchemes({ age:parseInt(profile.age)||30, gender:profile.gender||"all", state:profile.state==="All India"?"":(profile.state||""), category:profile.category||"general", occupation:profile.occupation||"all", income:parseInt(profile.income)||300000, specialStatus:profile.specialStatus?[profile.specialStatus]:[] });
      setResults(found); setCategoryFilter("all"); setScopeFilter("all"); setSearch("");
      localStorage.setItem("as_profile",JSON.stringify(profile));
      trackEvent("search",{ state:profile.state,category:profile.category,results:found.length });
      setSearching(false);
      setTimeout(()=>resultsRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }),100);
    },300);
  };

  const handlePDF=async()=>{
    if(!filteredResults?.length)return;
    setDownloading(true);
    try{ await downloadSchemesPDF(filteredResults,profile,lang); trackEvent("pdf_download"); }
    finally{ setDownloading(false); }
  };

  const filteredResults=(results||[]).filter(s=>{
    if(categoryFilter!=="all"&&s.category!==categoryFilter)return false;
    if(scopeFilter==="central"&&s.scope!=="central")return false;
    if(scopeFilter==="state"&&s.scope!=="state")return false;
    if(search.trim()){ const q=search.toLowerCase(); return s.name.toLowerCase().includes(q)||s.benefit.toLowerCase().includes(q)||(s.tags||[]).some(tag=>tag.includes(q))||s.category.includes(q); }
    return true;
  });

  if(detail) return <DetailPage scheme={detail} T={T} lang={lang} saved={saved} onToggleSave={onToggleSave} applied={applied} onToggleApplied={onToggleApplied} onBack={()=>setDetail(null)}/>;

  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"16px 16px 80px"}}>
      {/* Profile Form */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"20px 18px",marginBottom:20}}>
        <h2 style={{color:T.text,fontSize:18,fontWeight:700,marginBottom:4}}>{t(lang,"formTitle")}</h2>
        <p style={{color:T.text2,fontSize:13,marginBottom:16}}>{t(lang,"formSub")}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <label style={labelStyle(T)}>{t(lang,"labelAge")}</label>
            <input type="number" min={1} max={120} value={profile.age||""} onChange={e=>set("age",e.target.value)} placeholder="e.g. 35" style={{...inputStyle(T),width:"100%",boxSizing:"border-box",borderColor:formError&&!profile.age?"#e65100":undefined}}/>
          </div>
          <div>
            <label style={labelStyle(T)}>{t(lang,"labelGender")}</label>
            <Select value={profile.gender||""} onChange={v=>set("gender",v)} T={T}>
              <option value="">All</option>
              <option value="male">{t(lang,"gender_male")}</option>
              <option value="female">{t(lang,"gender_female")}</option>
              <option value="transgender">{t(lang,"gender_other")}</option>
            </Select>
          </div>
          <div>
            <label style={labelStyle(T)}>{t(lang,"labelState")}</label>
            <Select value={profile.state||""} onChange={v=>set("state",v)} T={T}>
              <option value="">-- Select State --</option>
              {ALL_STATES.map(s=><option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div>
            <label style={labelStyle(T)}>{t(lang,"labelCategory")}</label>
            <Select value={profile.category||""} onChange={v=>set("category",v)} T={T}>
              <option value="">Select</option>
              {["general","obc","sc","st"].map(c=><option key={c} value={c}>{c.toUpperCase()}</option>)}
            </Select>
          </div>
          <div>
            <label style={labelStyle(T)}>{t(lang,"labelOccupation")}</label>
            <Select value={profile.occupation||""} onChange={v=>set("occupation",v)} T={T}>
              <option value="">All</option>
              {OCCUPATIONS.filter(o=>o!=="all").map(o=><option key={o} value={o}>{t(lang,`occ_${o}`)||o}</option>)}
            </Select>
          </div>
          <div>
            <label style={labelStyle(T)}>{t(lang,"labelIncome")}</label>
            <Select value={profile.income||""} onChange={v=>set("income",v)} T={T}>
              <option value="">Select</option>
              {INCOMES.map(i=><option key={i.value} value={i.value}>{i.label}</option>)}
            </Select>
          </div>
          <div style={{gridColumn:"1/-1"}}>
            <label style={labelStyle(T)}>{t(lang,"labelSpecial")}</label>
            <Select value={profile.specialStatus||""} onChange={v=>set("specialStatus",v)} T={T}>
              <option value="">None</option>
              {["widow","disability","minority","bpl","ews"].map(s=><option key={s} value={s}>{t(lang,`special_${s}`)||s}</option>)}
            </Select>
          </div>
        </div>
        <button onClick={handleFind} disabled={searching} style={{...btnStyle(searching?"#aaa":FLAG.saffron,"#fff"),width:"100%",padding:"13px",fontSize:15,marginTop:16,opacity:searching?0.8:1}}>
          {searching?"🔍 Searching...":t(lang,"findBtn")}
        </button>
        {/* FIX 3: Validation error message */}
        {formError&&(
          <div style={{marginTop:10,padding:"10px 14px",background:"#fff3e0",border:"1px solid #ffb74d",borderRadius:8,fontSize:13,color:"#e65100",display:"flex",alignItems:"flex-start",gap:8}}>
            <span style={{flexShrink:0}}>⚠️</span>
            <span>{formError}</span>
          </div>
        )}
      </div>

      {/* Spinner while searching */}
      {searching && <Spinner T={T}/>}

      {/* Results */}
      {!searching && results && (
        <div ref={resultsRef}>
          {/* Summary + actions */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:8}}>
            <div>
              <span style={{fontWeight:700,color:T.text,fontSize:16}}>{filteredResults.length} {t(lang,"schemesFound")}</span>
              <span style={{color:T.text2,fontSize:11,marginLeft:8}}>({results.filter(s=>s.scope==="central").length} Central · {results.filter(s=>s.scope==="state").length} State)</span>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>shareAllResults(filteredResults)} style={btnStyle("#25D366","#fff",true)}>{t(lang,"whatsappAllBtn")}</button>
              <button onClick={handlePDF} disabled={downloading} style={{...btnStyle(FLAG.navy,"#fff",true),opacity:downloading?0.7:1}}>{downloading?"⏳...":t(lang,"pdfBtn")}</button>
            </div>
          </div>

          {/* Search within results */}
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t(lang,"searchPlaceholder")} style={{...inputStyle(T),width:"100%",boxSizing:"border-box",marginBottom:10}}/>

          {/* Scope + Category filters */}
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            <select value={scopeFilter} onChange={e=>setScopeFilter(e.target.value)} style={{...inputStyle(T),flex:1,minWidth:120}}>
              <option value="all">All Schemes</option>
              <option value="central">🇮🇳 Central Only</option>
              <option value="state">🏛️ State Only</option>
            </select>
            <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} style={{...inputStyle(T),flex:2,minWidth:140}}>
              {SCHEME_CATEGORIES.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          {filteredResults.length===0
            ?<div style={{textAlign:"center",color:T.text2,padding:32,fontSize:14}}>{t(lang,"noSchemes")}</div>
            :filteredResults.map(s=><SchemeCard key={s.id} scheme={s} lang={lang} T={T} saved={saved} onToggleSave={onToggleSave} applied={applied} onToggleApplied={onToggleApplied} onDetail={setDetail}/>)
          }
          <div style={{background:"#fff8e1",border:"1px solid #ffe082",borderRadius:10,padding:"12px 14px",marginTop:16,fontSize:12,color:"#7c5a00"}}>
            ⚠️ {t(lang,"disclaimer")} <a href="https://myscheme.gov.in" target="_blank" rel="noopener noreferrer" style={{color:FLAG.navy}}>myscheme.gov.in</a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Detail Page ──────────────────────────────────────────────
function DetailPage({ scheme,T,lang,saved,onToggleSave,applied,onToggleApplied,onBack }){
  const isSaved=saved.includes(scheme.id), isApplied=applied.includes(scheme.id);
  const isState=scheme.scope==="state", accent=isState?FLAG.green:FLAG.saffron;
  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"16px 16px 80px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:FLAG.navy,fontWeight:700,fontSize:14,cursor:"pointer",padding:"8px 0",marginBottom:12}}>{t(lang,"backBtn")}</button>
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
        <div style={{background:`linear-gradient(135deg,${accent}22,${FLAG.navy}11)`,padding:"20px 18px",borderBottom:`3px solid ${accent}`}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
            <Badge text={isState?`${t(lang,"scopeState")} · ${scheme.states[0]}`:t(lang,"scopeCentral")} color={accent}/>
            <Badge text={scheme.category.toUpperCase()} color={FLAG.navy}/>
            {isApplied&&<Badge text="✅ Applied" color="#2e7d32"/>}
          </div>
          <h2 style={{color:T.text,fontSize:18,fontWeight:800,margin:"0 0 6px"}}>{scheme.name}</h2>
          <p style={{color:T.text2,fontSize:13,margin:0}}>{scheme.ministry}</p>
        </div>
        <div style={{padding:"18px"}}>
          {[[t(lang,"whatYouGet"),FLAG.green,<p style={{fontSize:16,fontWeight:700,color:FLAG.green,margin:0}}>{scheme.benefit}</p>],
            ["About This Scheme",FLAG.navy,<p style={{fontSize:14,color:T.text,lineHeight:1.6,margin:0}}>{scheme.description}</p>],
            [t(lang,"docsRequired"),FLAG.saffron,<ul style={{margin:0,paddingLeft:18}}>{(scheme.documents||[]).map((d,i)=><li key={i} style={{fontSize:13,color:T.text,marginBottom:4}}>{d}</li>)}</ul>],
          ].map(([title,color,content],i)=>(
            <div key={i} style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:800,color,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{title}</div>
              {content}
            </div>
          ))}
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:16}}>
            <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer" onClick={()=>trackEvent("apply_click",{id:scheme.id})} style={{...btnStyle(FLAG.green,"#fff",true),textDecoration:"none",padding:"10px 16px",fontSize:13}}>{t(lang,"applyOfficial")}</a>
            <button onClick={()=>onToggleApplied(scheme.id)} style={btnStyle(isApplied?"#2e7d32":FLAG.saffron,"#fff",true)}>{isApplied?t(lang,"appliedBtn"):t(lang,"applyTrackBtn")}</button>
            <button onClick={()=>onToggleSave(scheme.id)} style={btnStyle(isSaved?FLAG.green:FLAG.navy,"#fff",true)}>{isSaved?t(lang,"savedBtn"):t(lang,"saveBtn")}</button>
            <button onClick={()=>shareOnWhatsApp(scheme)} style={btnStyle("#25D366","#fff",true)}>{t(lang,"whatsappBtn")}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chat Page (Gemini) ───────────────────────────────────────
function ChatPage({ T,lang }){
  const [messages,setMessages] = useState([{role:"model",content:t(lang,"chatWelcome")}]);
  const [input,setInput] = useState("");
  const [loading,setLoading] = useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const send=async()=>{
    const text=input.trim();
    if(!text||loading)return;
    const userMsg={role:"user",content:text};
    setMessages(m=>[...m,userMsg]);
    setInput(""); setLoading(true);
    trackEvent("chat_message");
    try{
      const apiKey=import.meta.env.VITE_GEMINI_API_KEY||"";
      if(!apiKey){
        setMessages(m=>[...m,{role:"model",content:"Chat is not configured yet. Please use the Form tab to find schemes by filling your profile — it works without any API key."}]);
        setLoading(false); return;
      }
      const history=[...messages,userMsg].map(m=>({role:m.role==="assistant"?"model":m.role,parts:[{text:m.content}]}));
      const res=await fetch(`${GEMINI_URL}?key=${apiKey}`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          system_instruction:{parts:[{text:"You are Adhikar Setu, an expert on Indian government schemes. Help users find Central and State schemes they qualify for. Be concise, accurate and empathetic. Always mention official URLs. Respond in the user language (English, Hindi, Telugu or Kannada). Cover PM-JAY, PM Kisan, PMEGP, Mudra and 58+ verified schemes across 15 Indian states."}]},
          contents:history
        })
      });
      const data=await res.json();
      if(data.error){
        console.error("Gemini API error:",data.error);
        setMessages(m=>[...m,{role:"model",content:`API Error: ${data.error.message||"Unknown error"}. Please use the Form tab to find schemes instead.`}]);
        setLoading(false); return;
      }
      const reply=data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if(!reply){
        setMessages(m=>[...m,{role:"model",content:"No response received. Please try again or use the Form tab to find schemes."}]);
      } else {
        setMessages(m=>[...m,{role:"model",content:reply}]);
      }
    }catch(err){
      console.error("Chat error:",err);
      setMessages(m=>[...m,{role:"model",content:"Network error — please check your connection. Meanwhile, use the Form tab to find schemes without internet."}]);
    }finally{ setLoading(false); }
  };

  return (
    <div style={{maxWidth:700,margin:"0 auto",display:"flex",flexDirection:"column",height:"calc(100vh - 120px)"}}>
      <div style={{flex:1,overflowY:"auto",padding:"16px 16px 8px"}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10}}>
            {m.role!=="user"&&<div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,marginRight:8,flexShrink:0,marginTop:2}}>🌉</div>}
            <div style={{maxWidth:"80%",background:m.role==="user"?FLAG.saffron+"dd":T.card,color:m.role==="user"?"#fff":T.text,borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"10px 14px",fontSize:14,lineHeight:1.5,border:m.role!=="user"?`1px solid ${T.border}`:"none",whiteSpace:"pre-wrap"}}>{m.content}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🌉</div><div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"14px 14px 14px 4px",padding:"10px 16px"}}><span style={{color:T.text2,fontSize:13}}>{t(lang,"chatSearching")}</span></div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"10px 16px 16px",borderTop:`1px solid ${T.border}`,background:T.bg}}>
        <div style={{display:"flex",gap:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={t(lang,"chatPlaceholder")} style={{...inputStyle(T),flex:1}}/>
          <button onClick={send} disabled={loading||!input.trim()} style={{...btnStyle(FLAG.saffron,"#fff",true),padding:"10px 16px",opacity:(!input.trim()||loading)?0.5:1}}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ─── Saved Page ───────────────────────────────────────────────
function SavedPage({ T,lang,saved,onToggleSave,applied,onToggleApplied,onClear }){
  const savedSchemes=SCHEMES.filter(s=>saved.includes(s.id));
  const appliedSchemes=SCHEMES.filter(s=>applied.includes(s.id));  // FIX 4
  const [detail,setDetail]=useState(null);
  if(detail) return <DetailPage scheme={detail} T={T} lang={lang} saved={saved} onToggleSave={onToggleSave} applied={applied} onToggleApplied={onToggleApplied} onBack={()=>setDetail(null)}/>;
  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"16px 16px 80px"}}>
      {/* Saved schemes section */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h2 style={{color:T.text,fontSize:18,fontWeight:700,margin:0}}>{t(lang,"savedTitle")} ({savedSchemes.length})</h2>
        <div style={{display:"flex",gap:8}}>
          {savedSchemes.length>0&&<button onClick={()=>shareAllResults(savedSchemes)} style={btnStyle("#25D366","#fff",true)}>{t(lang,"whatsappAllBtn")}</button>}
          {savedSchemes.length>0&&<button onClick={onClear} style={btnStyle("#e53935","#fff",true)}>{t(lang,"clearAll")}</button>}
        </div>
      </div>
      {/* FIX 4: localStorage persistence note */}
      {(savedSchemes.length>0||applied.length>0)&&(
        <div style={{fontSize:11,color:T.text2,background:T.input,borderRadius:8,padding:"8px 10px",marginBottom:12,lineHeight:1.5}}>
          💡 Saved and applied schemes are stored on this device. To keep a permanent record, download a PDF or take a screenshot.
        </div>
      )}
      {savedSchemes.length===0
        ?<div style={{textAlign:"center",color:T.text2,padding:"32px 0",fontSize:15}}>{t(lang,"savedEmpty")}</div>
        :savedSchemes.map(s=><SchemeCard key={s.id} scheme={s} lang={lang} T={T} saved={saved} onToggleSave={onToggleSave} applied={applied} onToggleApplied={onToggleApplied} onDetail={setDetail}/>)
      }

      {/* FIX 4: Applied schemes section — always visible if any applied */}
      {appliedSchemes.length>0&&(
        <div style={{marginTop:24}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <h3 style={{color:T.text,fontSize:16,fontWeight:700,margin:0}}>✅ Applied Schemes ({appliedSchemes.length})</h3>
          </div>
          <div style={{background:T.card,border:`1px solid ${FLAG.green}44`,borderRadius:12,padding:"12px 14px",marginBottom:8}}>
            <p style={{color:T.text2,fontSize:12,margin:"0 0 6px"}}>Schemes you've marked as applied. Tap ✅ on any scheme to unmark.</p>
            <p style={{color:"#e65100",fontSize:11,margin:"0 0 10px",background:"#fff3e0",borderRadius:6,padding:"6px 8px"}}>
              ⚠️ This data is stored on your device only. Clearing browser data or app cache will reset your applied tracking. Take a screenshot or note important applications separately.
            </p>
            {appliedSchemes.map(s=>(
              <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.name}</div>
                  <div style={{fontSize:11,color:FLAG.green,marginTop:2}}>💰 {s.benefit}</div>
                </div>
                <button onClick={()=>onToggleApplied(s.id)} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:6,padding:"4px 8px",fontSize:11,cursor:"pointer",color:T.text2,flexShrink:0,marginLeft:8}}>Unmark</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── About Page ───────────────────────────────────────────────
function AboutPage({ T,lang }){
  const features=[["✅","Verified Data","58+ schemes from myscheme.gov.in"],["🏛️","15 States","State + all central schemes"],["🌍","Multilingual","English, Hindi, Telugu, Kannada"],["📱","Works Offline","Install as app, no internet needed"],["🔒","Private","No data sent to servers"],["🆓","Free Forever","No ads, no registration"]];
  const analytics=()=>{
    try{
      const d=JSON.parse(localStorage.getItem("as_analytics")||"[]");
      const searches=d.filter(e=>e.event==="search").length;
      const applies=d.filter(e=>e.event==="apply_click").length;
      const saved=JSON.parse(localStorage.getItem("as_saved")||"[]").length;
      const app=JSON.parse(localStorage.getItem("as_applied")||"[]").length;
      alert(`Your Usage Stats:\n🔍 Searches done: ${searches}\n📋 Apply clicks: ${applies}\n🔖 Schemes saved: ${saved}\n✅ Schemes applied: ${app}`);
    }catch{}
  };
  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"24px 16px 80px"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:52,marginBottom:12}}>🌉</div>
        <h1 style={{color:T.text,fontSize:22,fontWeight:800,margin:"0 0 8px"}}>{t(lang,"aboutTitle")}</h1>
        <p style={{color:T.text2,fontSize:14,lineHeight:1.6,whiteSpace:"pre-line"}}>{t(lang,"aboutSub")}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {features.map(([icon,title,desc],i)=>(
          <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px"}}>
            <div style={{fontSize:24,marginBottom:6}}>{icon}</div>
            <div style={{fontWeight:700,color:T.text,fontSize:13,marginBottom:4}}>{title}</div>
            <div style={{color:T.text2,fontSize:12,lineHeight:1.4}}>{desc}</div>
          </div>
        ))}
      </div>
      <button onClick={analytics} style={{...btnStyle(FLAG.navy,"#fff",true),width:"100%",padding:"12px",fontSize:13,marginBottom:16}}>📊 View My Usage Stats</button>
      <div style={{background:"#fff8e1",border:"1px solid #ffe082",borderRadius:12,padding:"14px 16px",fontSize:12,color:"#7c5a00",lineHeight:1.6,marginBottom:16}}>
        <b>⚠️ Disclaimer:</b> Data sourced from myscheme.gov.in and official portals. Always verify before applying. Not affiliated with Government of India.
      </div>
      <div style={{textAlign:"center"}}>
        <a href="https://locatecsc.gov.in" target="_blank" rel="noopener noreferrer" style={{...btnStyle(FLAG.navy,"#fff",true),display:"inline-block",textDecoration:"none",padding:"12px 24px"}}>🏛️ {t(lang,"cscBtn")}</a>
      </div>
    </div>
  );
}

// ─── 404 Page ─────────────────────────────────────────────────
function NotFoundPage({ T,lang,onNav }){
  return (
    <div style={{maxWidth:700,margin:"0 auto",padding:"60px 16px",textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:16}}>🌉</div>
      <h1 style={{color:T.text,fontSize:24,fontWeight:800,margin:"0 0 12px"}}>Page Not Found</h1>
      <p style={{color:T.text2,fontSize:15,marginBottom:28,lineHeight:1.6}}>
        This page doesn't exist. But your government benefits do —<br/>let's help you find them.
      </p>
      <button onClick={()=>onNav("home")} style={{...btnStyle(FLAG.saffron,"#fff"),padding:"13px 28px",fontSize:15}}>🏠 Go Home</button>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────
const VALID_PAGES=["home","form","chat","saved","about"];

export default function App(){
  const { dark,toggle,T } = useTheme();
  const [lang,setLang] = useState(()=>localStorage.getItem("as_lang")||"en");
  const [page,setPage] = useState(()=>{
    const hash=window.location.hash.replace("#","");
    return VALID_PAGES.includes(hash)?hash:"home";
  });
  const { saved,toggle:toggleSave,clear:clearSaved } = useSaved();
  const { applied,toggle:toggleApplied } = useApplied();
  const { isOffline,installPrompt,installed,promptInstall } = usePWA();

  const changeLang=(l)=>{ setLang(l); localStorage.setItem("as_lang",l); };
  const navigate=(p)=>{ if(VALID_PAGES.includes(p)){ setPage(p); window.location.hash=p; window.scrollTo(0,0); } };

  // Sync hash changes (browser back/forward)
  useEffect(()=>{
    const onHash=()=>{ const h=window.location.hash.replace("#",""); if(VALID_PAGES.includes(h)) setPage(h); else setPage("home"); };
    window.addEventListener("hashchange",onHash);
    return ()=>window.removeEventListener("hashchange",onHash);
  },[]);

  const isValid=VALID_PAGES.includes(page);

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      {/* FIX 9: Plausible analytics script */}
      {typeof document!=="undefined"&&!document.getElementById("plausible-script")&&(()=>{
        const s=document.createElement("script");
        s.id="plausible-script"; s.defer=true;
        s.setAttribute("data-domain","adhikarasetu.vercel.app");
        s.src="https://plausible.io/js/script.js";
        document.head.appendChild(s);
        return null;
      })()}

      {isOffline&&<div style={{background:"#e53935",color:"#fff",textAlign:"center",padding:"8px 16px",fontSize:13,fontWeight:600}}>📴 {t(lang,"offlineMsg")}</div>}
      {installPrompt&&!installed&&(
        <div style={{background:FLAG.green,color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 16px",fontSize:13}}>
          <span>📲 Install Adhikar Setu for offline use</span>
          <button onClick={promptInstall} style={{background:"#fff",color:FLAG.green,border:"none",borderRadius:6,padding:"4px 12px",fontWeight:700,cursor:"pointer",fontSize:12}}>{t(lang,"installBtn")}</button>
        </div>
      )}
      <header style={{background:T.nav,borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,zIndex:100}}>
        <FlagStripe/>
        <div style={{maxWidth:700,margin:"0 auto",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div onClick={()=>navigate("home")} style={{cursor:"pointer"}}>
            <div style={{fontWeight:800,fontSize:16,color:FLAG.saffron}}>🌉 {t(lang,"appName")}</div>
            <div style={{fontSize:10,color:T.text2}}>{t(lang,"tagline")}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <select value={lang} onChange={e=>changeLang(e.target.value)} style={{background:T.input,color:T.text,border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 8px",fontSize:12}}>
              {LANGS.map(l=><option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <button onClick={toggle} style={{background:T.input,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 10px",fontSize:14,cursor:"pointer"}}>{dark?"☀️":"🌙"}</button>
          </div>
        </div>
      </header>

      <main>
        {/* FIX 10: 404 for invalid pages */}
        {!isValid&&<NotFoundPage T={T} lang={lang} onNav={navigate}/>}
        {isValid&&page==="home"  &&<HomePage  T={T} lang={lang} onNav={navigate}/>}
        {isValid&&page==="form"  &&<FormPage  T={T} lang={lang} saved={saved} onToggleSave={toggleSave} applied={applied} onToggleApplied={toggleApplied}/>}
        {isValid&&page==="chat"  &&<ChatPage  T={T} lang={lang}/>}
        {isValid&&page==="saved" &&<SavedPage T={T} lang={lang} saved={saved} onToggleSave={toggleSave} applied={applied} onToggleApplied={toggleApplied} onClear={clearSaved}/>}
        {isValid&&page==="about" &&<AboutPage T={T} lang={lang}/>}
      </main>

      {/* FIX 7: Back to top */}
      <BackToTop T={T}/>

      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:T.nav,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:100}}>
        {[["home","🏠",t(lang,"navHome")],["form","📋",t(lang,"navForm")],["chat","💬",t(lang,"navChat")],["saved","🔖",t(lang,"navSaved")],["about","ℹ️",t(lang,"navAbout")]].map(([p,icon,label])=>(
          <button key={p} onClick={()=>navigate(p)} style={{flex:1,background:"none",border:"none",padding:"10px 4px",cursor:"pointer",color:page===p?FLAG.saffron:T.text2,display:"flex",flexDirection:"column",alignItems:"center",gap:2,fontWeight:page===p?700:400}}>
            <span style={{fontSize:18}}>{icon}</span>
            <span style={{fontSize:9}}>{label.replace(/^[^ ]+ /,"")}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
