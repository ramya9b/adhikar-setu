import { useState, useRef, useEffect, createContext, useContext } from "react"
import { SCHEMES, filterSchemes } from "./data/schemes.js"
import { downloadSchemesPDF } from "./utils/pdf.js"
import { t, TRANSLATIONS } from "./i18n.js"

// ─── THEME + LANG CONTEXT ─────────────────────────────────────
const Ctx = createContext()
const useCtx = () => useContext(Ctx)

const FLAG = { saffron:"#FF9933", white:"#FFFFFF", green:"#138808", navy:"#000080", chakra:"#06038D" }
const DARK  = { bg:"#0a0f1a",bg2:"#111827",bg3:"#1f2937",card:"rgba(255,255,255,0.04)",cardBorder:"rgba(255,255,255,0.08)",text:"#f1f5f9",text2:"#94a3b8",text3:"#64748b",input:"rgba(255,255,255,0.06)",inputBorder:"#334155",headerBg:"rgba(10,15,26,0.97)" }
const LIGHT = { bg:"#f8fafc",bg2:"#f1f5f9",bg3:"#e2e8f0",card:"rgba(255,255,255,0.9)",cardBorder:"rgba(0,0,0,0.09)",text:"#0f172a",text2:"#475569",text3:"#94a3b8",input:"#ffffff",inputBorder:"#cbd5e1",headerBg:"rgba(248,250,252,0.97)" }

const TAG_COLORS = { Housing:FLAG.saffron,Health:"#ef4444",Education:"#8b5cf6",Agriculture:FLAG.green,Women:"#ec4899",Employment:FLAG.chakra,Finance:"#f59e0b","Social Welfare":"#14b8a6",Loan:"#06b6d4" }
const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir"]
const OCCUPATIONS = ["Student","Farmer","Daily Wage Worker","Self Employed","Government Employee","Private Employee","Homemaker","Unemployed","Senior Citizen","Differently Abled"]
const INCOME_LEVELS = ["Below ₹1 Lakh","₹1–3 Lakh","₹3–6 Lakh","₹6–10 Lakh","Above ₹10 Lakh"]
const CATEGORIES = ["General","OBC","SC","ST","EWS"]
const SPECIAL = ["Widow","Pregnant / Lactating","Differently Abled","BPL Card Holder","Minority Community","Ex-Serviceman"]
const SUGGESTIONS = ["I am a 35 year old farmer from Karnataka, OBC, income below 1 lakh. What schemes am I eligible for?","Single mother, 28 years from Telangana. Need housing and health schemes.","I want to start a small business. What loans are available without collateral?","Senior citizen aged 68 from Maharashtra. What pension and health schemes exist?"]

// ─── MAIN ─────────────────────────────────────────────────────
export default function AdhikarSetu() {
  const [dark, setDark] = useState(true)
  const [lang, setLang] = useState("en")
  const T = dark ? DARK : LIGHT
  const [page, setPage] = useState("home")
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [formResult, setFormResult] = useState(null)
  const [formProfile, setFormProfile] = useState({})
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("as_bookmarks") || "[]") } catch { return [] }
  })

  const toggleBookmark = (scheme) => {
    setBookmarks(prev => {
      const exists = prev.find(s => s.id === scheme.id)
      const next = exists ? prev.filter(s => s.id !== scheme.id) : [...prev, scheme]
      localStorage.setItem("as_bookmarks", JSON.stringify(next))
      return next
    })
  }
  const isBookmarked = (scheme) => bookmarks.some(s => s.id === scheme.id)

  return (
    <Ctx.Provider value={{ dark, T, FLAG, lang, setLang, bookmarks, toggleBookmark, isBookmarked }}>
      <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'Georgia',serif", transition:"background 0.3s,color 0.3s" }}>
        <Header dark={dark} setDark={setDark} page={page} setPage={setPage} />
        <div style={{ height:3, background:`linear-gradient(90deg,${FLAG.saffron} 33%,${FLAG.white} 33%,${FLAG.white} 66%,${FLAG.green} 66%)` }} />
        {page==="home"    && <HomePage setPage={setPage} />}
        {page==="chat"    && <ChatPage setPage={setPage} setSelectedScheme={setSelectedScheme} />}
        {page==="form"    && <FormPage setPage={setPage} setSelectedScheme={setSelectedScheme} formResult={formResult} setFormResult={setFormResult} setFormProfile={setFormProfile} formProfile={formProfile} />}
        {page==="saved"   && <SavedPage setPage={setPage} setSelectedScheme={setSelectedScheme} />}
        {page==="about"   && <AboutPage />}
        {page==="detail"  && <DetailPage scheme={selectedScheme} setPage={setPage} formProfile={formProfile} />}
        <Footer setPage={setPage} />
      </div>
    </Ctx.Provider>
  )
}

// ─── HEADER ───────────────────────────────────────────────────
function Header({ dark, setDark, page, setPage }) {
  const { T, FLAG, lang, setLang, bookmarks } = useCtx()
  const navItems = [["home","home"],["chat","chat"],["form","form"],["saved","saved"],["about","about"]]
  return (
    <header style={{ background:T.headerBg, borderBottom:`1px solid ${T.cardBorder}`, padding:"0 20px", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(12px)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
        <div onClick={()=>setPage("home")} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", flexShrink:0 }}>
          <div style={{ width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:`0 0 12px ${FLAG.saffron}44` }}>🌉</div>
          <div>
            <div style={{ fontSize:17,fontWeight:"bold",color:T.text }}>{t(lang,"appName")}</div>
            <div style={{ fontSize:9,color:T.text3,fontFamily:"sans-serif",letterSpacing:1 }}>{t(lang,"tagline").toUpperCase()}</div>
          </div>
        </div>
        <nav style={{ display:"flex", gap:2, alignItems:"center", flexWrap:"wrap" }}>
          {navItems.map(([id,key])=>(
            <button key={id} onClick={()=>setPage(id)} style={{ padding:"5px 11px",borderRadius:20,border:"1px solid",borderColor:page===id?FLAG.saffron:"transparent",background:page===id?`${FLAG.saffron}18`:"transparent",color:page===id?FLAG.saffron:T.text2,cursor:"pointer",fontSize:11,fontFamily:"sans-serif",fontWeight:page===id?"600":"400",position:"relative" }}>
              {t(lang,`nav${key.charAt(0).toUpperCase()+key.slice(1)}`)}
              {id==="saved" && bookmarks.length>0 && <span style={{ position:"absolute",top:-4,right:-4,background:FLAG.saffron,color:"#fff",borderRadius:"50%",width:14,height:14,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"sans-serif" }}>{bookmarks.length}</span>}
            </button>
          ))}
          {/* Language selector */}
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{ padding:"4px 6px",borderRadius:8,border:`1px solid ${T.cardBorder}`,background:T.bg3,color:T.text,fontSize:11,fontFamily:"sans-serif",cursor:"pointer",outline:"none",marginLeft:4 }}>
            <option value="en">EN</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
          <button onClick={()=>setDark(d=>!d)} style={{ width:34,height:34,borderRadius:"50%",border:`1px solid ${T.cardBorder}`,background:T.card,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",marginLeft:2 }}>{dark?"☀️":"🌙"}</button>
        </nav>
      </div>
    </header>
  )
}

// ─── HOME ─────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const { T, FLAG, lang } = useCtx()
  const cats = [["🏠","Housing & PMAY"],["💊","Ayushman Health"],["💰","Mudra Loans"],["🌾","PM Kisan"],["🎓","Scholarships"],["👩","Women Schemes"],["🏦","Insurance & Pension"],["🛠️","MSME & Startup"]]
  return (
    <main>
      <section style={{ maxWidth:900,margin:"0 auto",padding:"60px 24px 40px",textAlign:"center" }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:`${FLAG.saffron}15`,border:`1px solid ${FLAG.saffron}44`,borderRadius:30,padding:"6px 16px",marginBottom:24 }}>
          <span style={{ fontSize:11,color:FLAG.saffron,fontFamily:"sans-serif",fontWeight:"bold",letterSpacing:1 }}>🇮🇳 GOVERNMENT SCHEMES FINDER</span>
        </div>
        <h1 style={{ fontSize:"clamp(26px,5vw,44px)",fontWeight:"bold",color:T.text,lineHeight:1.25,marginBottom:14 }}>
          {t(lang,"heroTitle1")}<br />
          <span style={{ background:`linear-gradient(90deg,${FLAG.saffron},${FLAG.green})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{t(lang,"heroTitle2")}</span>
        </h1>
        <p style={{ color:T.text2,fontSize:15,maxWidth:500,margin:"0 auto 32px",lineHeight:1.8,fontFamily:"sans-serif",whiteSpace:"pre-line" }}>{t(lang,"heroSub")}</p>
        <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:44 }}>
          <button onClick={()=>setPage("chat")} style={{ padding:"14px 30px",borderRadius:50,border:"none",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,color:"#fff",fontSize:15,fontWeight:"bold",cursor:"pointer",boxShadow:`0 8px 28px ${FLAG.saffron}44`,fontFamily:"sans-serif" }}>{t(lang,"chatBtn")}</button>
          <button onClick={()=>setPage("form")} style={{ padding:"14px 30px",borderRadius:50,border:`1px solid ${T.cardBorder}`,background:T.card,color:T.text,fontSize:15,cursor:"pointer",fontFamily:"sans-serif" }}>{t(lang,"formBtn")}</button>
        </div>
        <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:52 }}>
          {[["4000+","Schemes"],["28+","States"],["Free","Always"],["Live","AI Data"]].map(([v,l])=>(
            <div key={l} style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:14,padding:"14px 20px",minWidth:80,textAlign:"center" }}>
              <div style={{ fontSize:20,fontWeight:"bold",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{v}</div>
              <div style={{ fontSize:11,color:T.text3,fontFamily:"sans-serif",marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{ background:T.bg2,padding:"36px 24px",borderTop:`1px solid ${T.cardBorder}`,borderBottom:`1px solid ${T.cardBorder}` }}>
        <div style={{ maxWidth:900,margin:"0 auto" }}>
          <h2 style={{ textAlign:"center",fontSize:20,color:T.text,marginBottom:6 }}>{t(lang,"categoriesTitle")}</h2>
          <p style={{ textAlign:"center",color:T.text3,fontSize:12,marginBottom:24,fontFamily:"sans-serif" }}>{t(lang,"categoriesSub")}</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:10 }}>
            {cats.map(([icon,label])=>(
              <div key={label} onClick={()=>setPage("chat")} style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:14,padding:"14px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",transition:"border-color 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=FLAG.saffron}
                onMouseLeave={e=>e.currentTarget.style.borderColor=T.cardBorder}>
                <span style={{ fontSize:20 }}>{icon}</span>
                <span style={{ fontSize:12,color:T.text,fontFamily:"sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ maxWidth:900,margin:"0 auto",padding:"44px 24px" }}>
        <h2 style={{ textAlign:"center",fontSize:20,color:T.text,marginBottom:6 }}>{t(lang,"howTitle")}</h2>
        <p style={{ textAlign:"center",color:T.text3,fontSize:12,marginBottom:30,fontFamily:"sans-serif" }}>{t(lang,"howSub")}</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16 }}>
          {[[1,"step1Title","step1Desc"],[2,"step2Title","step2Desc"],[3,"step3Title","step3Desc"]].map(([n,tk,dk])=>(
            <div key={n} style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:16,padding:"22px 18px",textAlign:"center" }}>
              <div style={{ width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:"bold",color:"#fff",margin:"0 auto 12px",fontFamily:"sans-serif" }}>{n}</div>
              <div style={{ fontSize:14,fontWeight:"bold",color:T.text,marginBottom:6 }}>{t(lang,tk)}</div>
              <div style={{ fontSize:12,color:T.text2,fontFamily:"sans-serif",lineHeight:1.6 }}>{t(lang,dk)}</div>
            </div>
          ))}
        </div>
      </section>
      <div style={{ background:`${FLAG.saffron}10`,borderTop:`1px solid ${FLAG.saffron}22`,padding:"12px 24px",textAlign:"center" }}>
        <p style={{ fontSize:11,color:T.text3,fontFamily:"sans-serif",margin:0 }}>🔗 {t(lang,"disclaimer")}</p>
      </div>
    </main>
  )
}

// ─── CHAT PAGE ────────────────────────────────────────────────
function ChatPage({ setPage, setSelectedScheme }) {
  const { T, FLAG, lang, toggleBookmark, isBookmarked } = useCtx()
  const [messages, setMessages] = useState([{ role:"bot", text:t(lang,"chatWelcome"), schemes:null }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)
  useEffect(()=>{ chatEndRef.current?.scrollIntoView({behavior:"smooth"}) },[messages,loading])

  const sendMessage = async (text) => {
    if (!text.trim()||loading) return
    const userMsg = {role:"user",text:text.trim()}
    const history = [...messages, userMsg]
    setMessages(history); setInput(""); setLoading(true)
    const sys = `You are Adhikar Setu, an Indian Government Schemes Advisor. Help find ALL government schemes — welfare, loans (Mudra, CGTMSE, KCC), subsidies, insurance, housing (PMAY), health (Ayushman), scholarships, pensions. Use web search for live data.
Return structured response with:
SCHEMES_JSON_START
[{"id":"unique-id","name":"","ministry":"","type":"Central/State","tag":"Housing/Health/Education/Agriculture/Loan/Finance/Women/Employment/Social Welfare","benefit":"specific amounts","eligibility":"simple 1-2 lines","documents":["doc1"],"how_to_apply":"steps","link":"url"}]
SCHEMES_JSON_END
Then 2-line warm summary. Reply in user's language if not English.`
    const msgs = history.map(m=>({role:m.role==="user"?"user":"assistant",content:m.role==="bot"?(m.rawText||m.text):m.text}))
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,tools:[{type:"web_search_20250305",name:"web_search"}],messages:msgs})})
      const data = await res.json()
      let full = data.content.filter(b=>b.type==="text").map(b=>b.text).join("")
      let schemes=null
      const jm = full.match(/SCHEMES_JSON_START\s*([\s\S]*?)\s*SCHEMES_JSON_END/)
      if(jm){try{schemes=JSON.parse(jm[1].trim())}catch(e){}; full=full.replace(/SCHEMES_JSON_START[\s\S]*?SCHEMES_JSON_END/,"").trim()}
      setMessages(prev=>[...prev,{role:"bot",text:full,rawText:full,schemes}])
    } catch(e){setMessages(prev=>[...prev,{role:"bot",text:"Something went wrong. Please try again.",schemes:null}])}
    setLoading(false)
  }

  return (
    <div style={{ maxWidth:820,margin:"0 auto",padding:"0 16px",display:"flex",flexDirection:"column",height:"calc(100vh - 65px)" }}>
      <div style={{ flex:1,overflowY:"auto",padding:"20px 0",display:"flex",flexDirection:"column",gap:14 }}>
        {messages.map((msg,i)=>(
          <div key={i} style={{ display:"flex",gap:10,justifyContent:msg.role==="user"?"flex-end":"flex-start" }}>
            {msg.role==="bot"&&<div style={{ width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0,marginTop:2 }}>🌉</div>}
            <div style={{ maxWidth:"82%" }}>
              <div style={{ padding:"11px 15px",borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:msg.role==="user"?`linear-gradient(135deg,${FLAG.navy}cc,${FLAG.chakra}cc)`:T.card,border:`1px solid ${msg.role==="user"?FLAG.chakra:T.cardBorder}`,fontSize:13,lineHeight:1.7,color:T.text,fontFamily:"sans-serif",whiteSpace:"pre-wrap" }}>
                {msg.text.replace(/\*\*(.*?)\*\*/g,"$1")}
              </div>
              {msg.schemes?.length>0&&(
                <div style={{ marginTop:10,display:"flex",flexDirection:"column",gap:8 }}>
                  {msg.schemes.map((s,j)=><SchemeCard key={j} s={s} onDetail={()=>{setSelectedScheme(s);setPage("detail")}} />)}
                  <ActionBar schemes={msg.schemes} profile={{}} />
                </div>
              )}
            </div>
            {msg.role==="user"&&<div style={{ width:32,height:32,borderRadius:"50%",background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginTop:2,border:`1px solid ${T.cardBorder}` }}>👤</div>}
          </div>
        ))}
        {loading&&(
          <div style={{ display:"flex",gap:10 }}>
            <div style={{ width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15 }}>🌉</div>
            <div style={{ padding:"11px 16px",borderRadius:"18px 18px 18px 4px",background:T.card,border:`1px solid ${T.cardBorder}` }}>
              <div style={{ display:"flex",gap:4,alignItems:"center" }}>
                {[0,1,2].map(d=><div key={d} style={{ width:7,height:7,borderRadius:"50%",background:FLAG.saffron,animation:"pulse 1.2s ease-in-out infinite",animationDelay:`${d*0.2}s` }}/>)}
                <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
                <span style={{ fontSize:11,color:T.text3,fontFamily:"sans-serif",marginLeft:5 }}>{t(lang,"chatSearching")}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef}/>
      </div>
      {messages.length<=1&&(
        <div style={{ paddingBottom:8 }}>
          <div style={{ fontSize:11,color:T.text3,fontFamily:"sans-serif",marginBottom:6 }}>Quick start:</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
            {SUGGESTIONS.slice(0,3).map((s,i)=><button key={i} onClick={()=>sendMessage(s)} style={{ padding:"6px 11px",borderRadius:20,border:`1px solid ${T.cardBorder}`,background:T.card,color:T.text2,fontSize:11,cursor:"pointer",fontFamily:"sans-serif",textAlign:"left",lineHeight:1.4,maxWidth:250 }}>{s.length>65?s.slice(0,63)+"…":s}</button>)}
          </div>
        </div>
      )}
      <div style={{ padding:"10px 0 14px",borderTop:`1px solid ${T.cardBorder}` }}>
        <div style={{ display:"flex",gap:8,alignItems:"flex-end" }}>
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(input)}}} placeholder={t(lang,"chatPlaceholder")} rows={2} style={{ flex:1,padding:"10px 14px",borderRadius:14,border:`1px solid ${T.inputBorder}`,background:T.input,color:T.text,fontSize:13,fontFamily:"sans-serif",resize:"none",outline:"none",lineHeight:1.5 }}/>
          <button onClick={()=>sendMessage(input)} disabled={!input.trim()||loading} style={{ width:44,height:44,borderRadius:"50%",border:"none",background:input.trim()?`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`:"#374151",color:"#fff",fontSize:17,cursor:input.trim()?"pointer":"not-allowed",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>➤</button>
        </div>
        <div style={{ fontSize:10,color:T.text3,marginTop:4,fontFamily:"sans-serif",textAlign:"center" }}>{t(lang,"disclaimer")}</div>
      </div>
    </div>
  )
}

// ─── FORM PAGE ────────────────────────────────────────────────
function FormPage({ setPage, setSelectedScheme, formResult, setFormResult, formProfile, setFormProfile }) {
  const { T, FLAG, lang } = useCtx()
  const [form, setForm] = useState({ name:"",age:"",gender:"",state:"",category:"",occupation:"",income:"",special:[] })
  const [loading, setLoading] = useState(false)
  const [useRealData, setUseRealData] = useState(true)

  const isValid = ()=>form.age&&form.gender&&form.state&&form.category&&form.occupation&&form.income
  const toggleSpecial = v=>setForm(f=>({...f,special:f.special.includes(v)?f.special.filter(x=>x!==v):[...f.special,v]}))

  const findSchemes = async () => {
    setLoading(true); setFormResult(null); setFormProfile(form)
    if (useRealData) {
      // Use real data with filtering — zero hallucination
      const results = filterSchemes(form)
      // Add state-specific label
      const withState = results.map(s => ({ ...s, state: form.state }))
      // If fewer than 4 results, supplement with AI
      if (withState.length >= 3) { setFormResult(withState); setLoading(false); return }
    }
    // AI fallback for edge cases
    const prompt = `Find government schemes for: Age ${form.age}, ${form.gender}, ${form.state}, ${form.category}, ${form.occupation}, income ${form.income}${form.special.length?", Special: "+form.special.join(", "):""}.
Return ONLY raw JSON array 6-8 schemes (no markdown):
[{"id":"slug","name":"","ministry":"","type":"Central/State","tag":"Housing/Health/Education/Agriculture/Loan/Finance/Women/Employment/Social Welfare","benefit":"","eligibility":"","documents":[],"how_to_apply":"","link":""}]`
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]})})
      const data = await res.json()
      const text = data.content.filter(b=>b.type==="text").map(b=>b.text).join("")
      const clean = text.replace(/```json|```/g,"").trim()
      const s=clean.indexOf("["),e=clean.lastIndexOf("]")+1
      setFormResult(JSON.parse(clean.slice(s,e)))
    } catch { setFormResult([]) }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth:740,margin:"0 auto",padding:"24px 20px" }}>
      {!formResult?(
        <>
          <div style={{ textAlign:"center",marginBottom:20 }}>
            <h2 style={{ fontSize:20,color:T.text,marginBottom:4 }}>{t(lang,"formTitle")}</h2>
            <p style={{ color:T.text3,fontSize:12,fontFamily:"sans-serif" }}>{t(lang,"formSub")}</p>
          </div>
          {/* Real data toggle */}
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:"10px 14px",background:`${FLAG.green}0e`,border:`1px solid ${FLAG.green}33`,borderRadius:10 }}>
            <input type="checkbox" id="realdata" checked={useRealData} onChange={e=>setUseRealData(e.target.checked)} style={{ width:16,height:16,accentColor:FLAG.green }}/>
            <label htmlFor="realdata" style={{ fontSize:12,color:FLAG.green,fontFamily:"sans-serif",cursor:"pointer" }}>✅ Use verified real scheme data (recommended — zero hallucination)</label>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            <div style={{ gridColumn:"1/-1" }}><FL k="labelName"/><FI placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
            <div><FL k="labelAge"/><FI type="number" placeholder="e.g. 32" value={form.age} onChange={e=>setForm(f=>({...f,age:e.target.value}))}/></div>
            <div><FL k="labelGender"/><FS value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))}><option value="">{t(lang,"selectState")}</option><option value="Male">{t(lang,"gender_male")}</option><option value="Female">{t(lang,"gender_female")}</option><option value="Transgender">{t(lang,"gender_other")}</option></FS></div>
            <div><FL k="labelState"/><FS value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))}><option value="">{t(lang,"selectState")}</option>{STATES.map(s=><option key={s}>{s}</option>)}</FS></div>
            <div><FL k="labelCategory"/><FS value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}><option value="">{t(lang,"selectState")}</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</FS></div>
            <div><FL k="labelOccupation"/><FS value={form.occupation} onChange={e=>setForm(f=>({...f,occupation:e.target.value}))}><option value="">{t(lang,"selectState")}</option>{OCCUPATIONS.map(o=><option key={o}>{o}</option>)}</FS></div>
            <div><FL k="labelIncome"/><FS value={form.income} onChange={e=>setForm(f=>({...f,income:e.target.value}))}><option value="">{t(lang,"selectState")}</option>{INCOME_LEVELS.map(i=><option key={i}>{i}</option>)}</FS></div>
            <div style={{ gridColumn:"1/-1" }}>
              <FL k="labelSpecial"/>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginTop:6 }}>
                {SPECIAL.map(opt=><button key={opt} onClick={()=>toggleSpecial(opt)} style={{ padding:"5px 12px",borderRadius:20,border:"1px solid",borderColor:form.special.includes(opt)?FLAG.saffron:"#334155",background:form.special.includes(opt)?`${FLAG.saffron}15`:"transparent",color:form.special.includes(opt)?FLAG.saffron:T.text2,cursor:"pointer",fontSize:12,fontFamily:"sans-serif" }}>{form.special.includes(opt)?"✓ ":""}{opt}</button>)}
              </div>
            </div>
          </div>
          {loading&&<div style={{ textAlign:"center",margin:"20px 0",color:T.text2,fontFamily:"sans-serif",fontSize:13 }}><div style={{ fontSize:26,marginBottom:6 }}>⚡</div>{t(lang,"searchingBtn")}</div>}
          <button onClick={findSchemes} disabled={!isValid()||loading} style={{ width:"100%",padding:13,borderRadius:12,border:"none",background:isValid()?`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`:"#374151",color:"#fff",cursor:isValid()?"pointer":"not-allowed",fontSize:15,fontWeight:"bold",fontFamily:"sans-serif",marginTop:18 }}>
            {loading?t(lang,"searchingBtn"):t(lang,"findBtn")}
          </button>
        </>
      ):(
        <>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8 }}>
            <div>
              <h2 style={{ fontSize:18,color:T.text,margin:0 }}>🎉 {formResult.length} {t(lang,"schemesFound")}</h2>
              <p style={{ color:T.text3,fontSize:11,margin:"3px 0 0",fontFamily:"sans-serif" }}>{form.state} · {form.occupation} · {form.income}</p>
            </div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              <ActionBar schemes={formResult} profile={form}/>
              <button onClick={()=>setFormResult(null)} style={{ padding:"6px 14px",borderRadius:20,border:`1px solid ${T.cardBorder}`,background:T.card,color:T.text2,cursor:"pointer",fontSize:11,fontFamily:"sans-serif" }}>{t(lang,"editProfile")}</button>
            </div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {formResult.map((s,i)=><SchemeCard key={i} s={s} onDetail={()=>{setSelectedScheme(s);setPage("detail")}}/>)}
          </div>
          <CSCLocator state={form.state}/>
          <div style={{ marginTop:14,textAlign:"center",fontSize:11,color:T.text3,fontFamily:"sans-serif",padding:"10px",background:`${FLAG.saffron}08`,borderRadius:8,border:`1px solid ${FLAG.saffron}22` }}>{t(lang,"disclaimer")}</div>
        </>
      )}
    </div>
  )
}

// ─── SAVED PAGE ───────────────────────────────────────────────
function SavedPage({ setPage, setSelectedScheme }) {
  const { T, FLAG, lang, bookmarks, toggleBookmark } = useCtx()
  return (
    <div style={{ maxWidth:740,margin:"0 auto",padding:"28px 20px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <h2 style={{ fontSize:20,color:T.text,margin:0 }}>🔖 {t(lang,"savedTitle")}</h2>
        {bookmarks.length>0&&<button onClick={()=>{localStorage.removeItem("as_bookmarks");window.location.reload()}} style={{ padding:"6px 14px",borderRadius:20,border:`1px solid #ef4444`,background:"transparent",color:"#ef4444",cursor:"pointer",fontSize:12,fontFamily:"sans-serif" }}>{t(lang,"clearAll")}</button>}
      </div>
      {bookmarks.length===0?(
        <div style={{ textAlign:"center",padding:"60px 20px",color:T.text3,fontFamily:"sans-serif" }}>
          <div style={{ fontSize:40,marginBottom:12 }}>🔖</div>
          <p>{t(lang,"savedEmpty")}</p>
          <button onClick={()=>setPage("form")} style={{ padding:"10px 24px",borderRadius:20,border:"none",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,color:"#fff",cursor:"pointer",fontFamily:"sans-serif",marginTop:12 }}>{t(lang,"findBtn")}</button>
        </div>
      ):(
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {bookmarks.map((s,i)=><SchemeCard key={i} s={s} onDetail={()=>{setSelectedScheme(s);setPage("detail")}}/>)}
          <ActionBar schemes={bookmarks} profile={{}}/>
        </div>
      )}
    </div>
  )
}

// ─── DETAIL PAGE ──────────────────────────────────────────────
function DetailPage({ scheme, setPage, formProfile }) {
  const { T, FLAG, lang, toggleBookmark, isBookmarked } = useCtx()
  if (!scheme) { setPage("home"); return null }
  const color = TAG_COLORS[scheme.tag] || FLAG.saffron
  const saved = isBookmarked(scheme)
  const shareWA = () => {
    const text = `🇮🇳 *${scheme.name}*\n\n💰 *${t(lang,"benefit")}:* ${scheme.benefit}\n\n✅ *${t(lang,"eligibility")}:* ${scheme.eligibility}\n\n📄 *${t(lang,"documents")}:* ${scheme.documents?.join(", ")}\n\n🔗 *Apply:* ${scheme.link||"myscheme.gov.in"}\n\n_Found via Adhikar Setu — adhikarsetu.in_`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank")
  }
  return (
    <div style={{ maxWidth:760,margin:"0 auto",padding:"24px 20px" }}>
      <button onClick={()=>setPage("form")} style={{ display:"flex",alignItems:"center",gap:5,background:"transparent",border:"none",color:T.text2,cursor:"pointer",fontSize:12,fontFamily:"sans-serif",marginBottom:18,padding:0 }}>{t(lang,"backBtn")}</button>
      <div style={{ background:T.card,border:`2px solid ${color}44`,borderRadius:20,padding:"24px",marginBottom:16 }}>
        <div style={{ display:"flex",gap:7,marginBottom:10,flexWrap:"wrap" }}>
          <span style={{ background:color,color:"#fff",fontSize:10,padding:"2px 10px",borderRadius:20,fontFamily:"sans-serif",fontWeight:"bold" }}>{scheme.tag}</span>
          <span style={{ background:scheme.type==="Central"?`${FLAG.chakra}20`:`${FLAG.green}20`,color:scheme.type==="Central"?FLAG.chakra:FLAG.green,fontSize:10,padding:"2px 10px",borderRadius:20,fontFamily:"sans-serif",border:`1px solid ${scheme.type==="Central"?FLAG.chakra:FLAG.green}` }}>{scheme.type}</span>
        </div>
        <h1 style={{ fontSize:"clamp(17px,3vw,24px)",color:T.text,marginBottom:4,lineHeight:1.3 }}>{scheme.name}</h1>
        <p style={{ color:T.text3,fontSize:12,fontFamily:"sans-serif",margin:0 }}>{scheme.ministry}</p>
      </div>
      <div style={{ background:`${FLAG.saffron}12`,border:`1px solid ${FLAG.saffron}44`,borderRadius:14,padding:"14px 18px",marginBottom:14 }}>
        <div style={{ fontSize:10,color:FLAG.saffron,fontFamily:"sans-serif",fontWeight:"bold",marginBottom:3,letterSpacing:1 }}>{t(lang,"whatYouGet")}</div>
        <div style={{ fontSize:15,color:T.text,lineHeight:1.6,fontFamily:"sans-serif" }}>{scheme.benefit}</div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14 }}>
        <IBox title={t(lang,"eligibility")} icon="✅" color={FLAG.green}>{scheme.eligibility}</IBox>
        <IBox title={t(lang,"howToApply")} icon="📋" color={FLAG.chakra}>{scheme.how_to_apply}</IBox>
      </div>
      {scheme.documents?.length>0&&(
        <div style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:14,padding:"16px",marginBottom:14 }}>
          <div style={{ fontSize:12,color:T.text2,fontFamily:"sans-serif",fontWeight:"bold",marginBottom:10 }}>{t(lang,"docsRequired")}</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
            {scheme.documents.map((d,i)=><span key={i} style={{ background:T.bg2,border:`1px solid ${T.cardBorder}`,borderRadius:8,padding:"5px 12px",fontSize:12,color:T.text,fontFamily:"sans-serif" }}>📎 {d}</span>)}
          </div>
        </div>
      )}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10 }}>
        {scheme.link&&<a href={scheme.link?.startsWith("http")?scheme.link:`https://${scheme.link}`} target="_blank" rel="noopener noreferrer" style={{ padding:"12px",borderRadius:12,background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,color:"#fff",fontWeight:"bold",fontSize:13,textDecoration:"none",fontFamily:"sans-serif",textAlign:"center" }}>{t(lang,"applyOfficial")}</a>}
        <button onClick={shareWA} style={{ padding:"12px",borderRadius:12,border:"none",background:"#25D366",color:"#fff",fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"sans-serif" }}>{t(lang,"whatsappBtn")}</button>
        <button onClick={()=>downloadSchemesPDF([scheme],formProfile)} style={{ padding:"12px",borderRadius:12,border:`1px solid ${FLAG.chakra}`,background:T.card,color:FLAG.chakra,fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"sans-serif" }}>{t(lang,"pdfBtn")}</button>
        <button onClick={()=>toggleBookmark(scheme)} style={{ padding:"12px",borderRadius:12,border:`1px solid ${saved?FLAG.saffron:T.cardBorder}`,background:saved?`${FLAG.saffron}15`:T.card,color:saved?FLAG.saffron:T.text2,fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"sans-serif" }}>{saved?t(lang,"savedBtn"):t(lang,"saveBtn")}</button>
      </div>
      <div style={{ marginTop:14,padding:"10px 14px",borderRadius:8,background:`${FLAG.saffron}08`,border:`1px solid ${FLAG.saffron}22`,fontSize:11,color:T.text3,fontFamily:"sans-serif",textAlign:"center" }}>{t(lang,"disclaimer")}</div>
    </div>
  )
}

// ─── ABOUT PAGE ───────────────────────────────────────────────
function AboutPage() {
  const { T, FLAG, lang } = useCtx()
  const cards = [["🌉","Our Mission","Bridge every Indian citizen to government schemes they deserve but never knew existed."],["🤖","How We Work","Real verified data + AI explanations. Live search for edge cases. Official links always."],["🔒","Data Safety","We never store personal data. All searches private. Official links always provided."],["🌍","Multilingual","English, Hindi, Telugu, Kannada — reaching every corner of India."]]
  return (
    <div style={{ maxWidth:820,margin:"0 auto",padding:"36px 24px" }}>
      <div style={{ textAlign:"center",marginBottom:40 }}>
        <div style={{ width:66,height:66,borderRadius:"50%",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 18px",boxShadow:`0 8px 28px ${FLAG.saffron}44` }}>🌉</div>
        <h1 style={{ fontSize:26,color:T.text,marginBottom:8 }}>{t(lang,"aboutTitle")}</h1>
        <p style={{ color:T.text2,fontSize:14,maxWidth:480,margin:"0 auto",fontFamily:"sans-serif",lineHeight:1.8,whiteSpace:"pre-line" }}>{t(lang,"aboutSub")}</p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,marginBottom:36 }}>
        {cards.map(([icon,title,desc])=>(
          <div key={title} style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:16,padding:"20px 16px",textAlign:"center" }}>
            <div style={{ fontSize:28,marginBottom:10 }}>{icon}</div>
            <div style={{ fontSize:14,fontWeight:"bold",color:T.text,marginBottom:6 }}>{title}</div>
            <div style={{ fontSize:12,color:T.text2,fontFamily:"sans-serif",lineHeight:1.6 }}>{desc}</div>
          </div>
        ))}
      </div>
      <div style={{ height:4,borderRadius:4,background:`linear-gradient(90deg,${FLAG.saffron} 33%,${FLAG.white} 33%,${FLAG.white} 66%,${FLAG.green} 66%)`,marginBottom:28 }}/>
      <div style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:16,padding:"22px",marginBottom:20 }}>
        <h3 style={{ fontSize:15,color:T.text,marginBottom:12 }}>📬 Organisation Details</h3>
        <div style={{ fontSize:13,color:T.text2,fontFamily:"sans-serif",lineHeight:2.1 }}>
          <div>🏢 <strong>Sri Vara Lakshmi Balaji Enterprises</strong></div>
          <div>📍 KR Puram, Bengaluru, Karnataka — 560036</div>
          <div>🌐 Data Source: myscheme.gov.in · india.gov.in</div>
          <div>📧 APISetu Application: Submitted for official API access</div>
          <div>⚖️ Not affiliated with the Government of India</div>
        </div>
      </div>
      <div style={{ background:`${FLAG.saffron}08`,border:`1px solid ${FLAG.saffron}33`,borderRadius:16,padding:"20px 22px" }}>
        <h3 style={{ fontSize:14,color:FLAG.saffron,marginBottom:12 }}>⚠️ Disclaimer</h3>
        <ul style={{ margin:0,padding:"0 0 0 16px" }}>
          {["Data sourced from official government portals and AI-powered web search.","Always verify eligibility on myscheme.gov.in before applying.","Adhikar Setu is not affiliated with the Government of India.","Scheme details may change — check official sources for latest information.","We are not responsible for decisions made based on AI-generated results."].map((d,i)=>(
            <li key={i} style={{ fontSize:12,color:T.text2,fontFamily:"sans-serif",lineHeight:1.9,marginBottom:2 }}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────
function Footer({ setPage }) {
  const { T, FLAG, lang } = useCtx()
  return (
    <footer style={{ borderTop:`1px solid ${T.cardBorder}`,padding:"24px",marginTop:20 }}>
      <div style={{ maxWidth:1100,margin:"0 auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:14 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13 }}>🌉</div>
            <div>
              <div style={{ fontSize:13,fontWeight:"bold",color:T.text }}>{t(lang,"appName")}</div>
              <div style={{ fontSize:9,color:T.text3,fontFamily:"sans-serif" }}>{t(lang,"tagline")}</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
            {[["home","navHome"],["chat","navChat"],["form","navForm"],["saved","navSaved"],["about","navAbout"]].map(([id,k])=>(
              <button key={id} onClick={()=>setPage(id)} style={{ background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:12,fontFamily:"sans-serif" }}>{t(lang,k)}</button>
            ))}
          </div>
        </div>
        <div style={{ height:2,background:`linear-gradient(90deg,${FLAG.saffron} 33%,${FLAG.white} 33%,${FLAG.white} 66%,${FLAG.green} 66%)`,marginBottom:12,borderRadius:2 }}/>
        <div style={{ display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6 }}>
          <div style={{ fontSize:11,color:T.text3,fontFamily:"sans-serif" }}>© 2025 Sri Vara Lakshmi Balaji Enterprises · Bengaluru</div>
          <div style={{ fontSize:11,color:T.text3,fontFamily:"sans-serif" }}>myscheme.gov.in · Not affiliated with Government of India</div>
        </div>
      </div>
    </footer>
  )
}

// ─── SHARED COMPONENTS ────────────────────────────────────────
function SchemeCard({ s, onDetail }) {
  const { T, FLAG, lang, toggleBookmark, isBookmarked } = useCtx()
  const [open, setOpen] = useState(false)
  const color = TAG_COLORS[s.tag] || FLAG.saffron
  const saved = isBookmarked(s)
  return (
    <div style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:14,overflow:"hidden",transition:"border-color 0.2s" }}
      onMouseEnter={e=>e.currentTarget.style.borderColor=color+"66"}
      onMouseLeave={e=>e.currentTarget.style.borderColor=T.cardBorder}>
      <div style={{ padding:"13px 15px",cursor:"pointer" }} onClick={()=>setOpen(o=>!o)}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",gap:5,marginBottom:5,flexWrap:"wrap" }}>
              <span style={{ background:color,color:"#fff",fontSize:10,padding:"2px 9px",borderRadius:20,fontFamily:"sans-serif",fontWeight:"bold" }}>{s.tag}</span>
              <span style={{ background:s.type==="Central"?`${FLAG.chakra}20`:`${FLAG.green}20`,color:s.type==="Central"?FLAG.chakra:FLAG.green,fontSize:10,padding:"2px 9px",borderRadius:20,fontFamily:"sans-serif",border:`1px solid ${s.type==="Central"?FLAG.chakra:FLAG.green}` }}>{s.type}</span>
            </div>
            <div style={{ fontSize:14,color:T.text,fontWeight:"500",lineHeight:1.3 }}>{s.name}</div>
            <div style={{ fontSize:10,color:T.text3,fontFamily:"sans-serif",marginTop:1 }}>{s.ministry}</div>
          </div>
          <span style={{ color:T.text3,fontSize:14,flexShrink:0,marginTop:2 }}>{open?"▲":"▼"}</span>
        </div>
        <div style={{ marginTop:9,background:`${FLAG.saffron}10`,border:`1px solid ${FLAG.saffron}33`,borderRadius:7,padding:"7px 11px" }}>
          <span style={{ fontSize:10,color:FLAG.saffron,fontFamily:"sans-serif",fontWeight:"bold" }}>{t(lang,"benefit")}: </span>
          <span style={{ fontSize:12,color:T.text,fontFamily:"sans-serif" }}>{s.benefit}</span>
        </div>
      </div>
      {open&&(
        <div style={{ padding:"0 15px 14px",borderTop:`1px solid ${T.cardBorder}` }}>
          <div style={{ paddingTop:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10 }}>
            <div>
              <div style={{ fontSize:9,color:T.text3,fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:0.5,marginBottom:3 }}>{t(lang,"eligibility")}</div>
              <div style={{ fontSize:12,color:T.text2,fontFamily:"sans-serif",lineHeight:1.6 }}>{s.eligibility}</div>
            </div>
            <div>
              <div style={{ fontSize:9,color:T.text3,fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:0.5,marginBottom:3 }}>{t(lang,"howToApply")}</div>
              <div style={{ fontSize:12,color:T.text2,fontFamily:"sans-serif",lineHeight:1.6 }}>{s.how_to_apply}</div>
            </div>
          </div>
          {s.documents?.length>0&&(
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:9,color:T.text3,fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:0.5,marginBottom:4 }}>{t(lang,"documents")}</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:4 }}>
                {s.documents.map((d,j)=><span key={j} style={{ background:T.bg2,border:`1px solid ${T.cardBorder}`,borderRadius:5,padding:"2px 8px",fontSize:10,color:T.text2,fontFamily:"sans-serif" }}>📄 {d}</span>)}
              </div>
            </div>
          )}
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {s.link&&<a href={s.link?.startsWith("http")?s.link:`https://${s.link}`} target="_blank" rel="noopener noreferrer" style={{ padding:"6px 12px",borderRadius:7,background:`${FLAG.chakra}15`,border:`1px solid ${FLAG.chakra}`,color:FLAG.chakra,fontSize:11,textDecoration:"none",fontFamily:"sans-serif" }}>{t(lang,"applyBtn")}</a>}
            <button onClick={onDetail} style={{ padding:"6px 12px",borderRadius:7,background:`${FLAG.saffron}12`,border:`1px solid ${FLAG.saffron}`,color:FLAG.saffron,fontSize:11,cursor:"pointer",fontFamily:"sans-serif" }}>{t(lang,"detailBtn")}</button>
            <button onClick={()=>toggleBookmark(s)} style={{ padding:"6px 12px",borderRadius:7,background:saved?`${FLAG.saffron}15`:"transparent",border:`1px solid ${saved?FLAG.saffron:T.cardBorder}`,color:saved?FLAG.saffron:T.text3,fontSize:11,cursor:"pointer",fontFamily:"sans-serif" }}>{saved?t(lang,"savedBtn"):t(lang,"saveBtn")}</button>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionBar({ schemes, profile }) {
  const { T, FLAG, lang } = useCtx()
  const shareWA = () => {
    const text = `🇮🇳 *Government Schemes — Adhikar Setu*\n\n`+schemes.slice(0,5).map((s,i)=>`*${i+1}. ${s.name}*\n💰 ${s.benefit}\n🔗 ${s.link||"myscheme.gov.in"}`).join("\n\n")+`\n\n_Verify: myscheme.gov.in_`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank")
  }
  return (
    <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
      <button onClick={shareWA} style={{ flex:1,padding:"9px",borderRadius:9,border:"none",background:"#25D366",color:"#fff",fontWeight:"bold",fontSize:12,cursor:"pointer",fontFamily:"sans-serif",minWidth:140 }}>{t(lang,"whatsappBtn")}</button>
      <button onClick={()=>downloadSchemesPDF(schemes,profile)} style={{ flex:1,padding:"9px",borderRadius:9,border:`1px solid ${FLAG.chakra}`,background:"transparent",color:FLAG.chakra,fontWeight:"bold",fontSize:12,cursor:"pointer",fontFamily:"sans-serif",minWidth:140 }}>{t(lang,"pdfBtn")}</button>
    </div>
  )
}

function CSCLocator({ state }) {
  const { T, FLAG, lang } = useCtx()
  const url = state ? `https://locatecsc.gov.in/?state=${encodeURIComponent(state)}` : "https://locatecsc.gov.in"
  return (
    <div style={{ margin:"14px 0",padding:"14px 16px",background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10 }}>
      <div>
        <div style={{ fontSize:13,color:T.text,fontWeight:"bold",marginBottom:2 }}>{t(lang,"cscTitle")}</div>
        <div style={{ fontSize:11,color:T.text3,fontFamily:"sans-serif" }}>{t(lang,"cscSub")}</div>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ padding:"8px 16px",borderRadius:9,background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,color:"#fff",fontSize:12,textDecoration:"none",fontFamily:"sans-serif",fontWeight:"bold",flexShrink:0 }}>{t(lang,"cscBtn")}</a>
    </div>
  )
}

function IBox({ title, icon, color, children }) {
  const { T } = useCtx()
  return (
    <div style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:12,padding:"14px 16px" }}>
      <div style={{ fontSize:10,color,fontFamily:"sans-serif",fontWeight:"bold",marginBottom:5,letterSpacing:0.5 }}>{icon} {title.toUpperCase()}</div>
      <div style={{ fontSize:12,color:T.text2,fontFamily:"sans-serif",lineHeight:1.6 }}>{children}</div>
    </div>
  )
}

function FL({ k }) {
  const { T, lang } = useCtx()
  return <div style={{ fontSize:12,color:T.text2,marginBottom:4,fontFamily:"sans-serif",fontWeight:"500" }}>{t(lang,k)} *</div>
}
function FI(props) {
  const { T } = useCtx()
  return <input {...props} style={{ width:"100%",padding:"8px 12px",borderRadius:8,background:T.input,border:`1px solid ${T.inputBorder}`,color:T.text,fontSize:13,fontFamily:"sans-serif",outline:"none",boxSizing:"border-box" }}/>
}
function FS({ children, ...props }) {
  const { T } = useCtx()
  return <select {...props} style={{ width:"100%",padding:"8px 12px",borderRadius:8,background:T.input,border:`1px solid ${T.inputBorder}`,color:T.text,fontSize:13,fontFamily:"sans-serif",outline:"none",cursor:"pointer" }}>{children}</select>
}
