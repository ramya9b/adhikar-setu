import { useState, useRef, useEffect, createContext, useContext } from "react";

// ─── THEME CONTEXT ────────────────────────────────────────────
const ThemeCtx = createContext();
const useTheme = () => useContext(ThemeCtx);

// ─── INDIAN FLAG COLORS ───────────────────────────────────────
const FLAG = { saffron:"#FF9933", white:"#FFFFFF", green:"#138808", navy:"#000080", chakra:"#06038D" };

const DARK = {
  bg:"#0a0f1a", bg2:"#111827", bg3:"#1f2937",
  card:"rgba(255,255,255,0.04)", cardBorder:"rgba(255,255,255,0.08)",
  text:"#f1f5f9", text2:"#94a3b8", text3:"#64748b",
  input:"rgba(255,255,255,0.06)", inputBorder:"#334155",
  headerBg:"rgba(10,15,26,0.97)"
};
const LIGHT = {
  bg:"#f8fafc", bg2:"#f1f5f9", bg3:"#e2e8f0",
  card:"rgba(255,255,255,0.9)", cardBorder:"rgba(0,0,0,0.08)",
  text:"#0f172a", text2:"#475569", text3:"#94a3b8",
  input:"#ffffff", inputBorder:"#cbd5e1",
  headerBg:"rgba(248,250,252,0.97)"
};

// ─── DATA ─────────────────────────────────────────────────────
const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir"];
const OCCUPATIONS = ["Student","Farmer","Daily Wage Worker","Self Employed","Government Employee","Private Employee","Homemaker","Unemployed","Senior Citizen","Differently Abled"];
const INCOME_LEVELS = ["Below ₹1 Lakh","₹1–3 Lakh","₹3–6 Lakh","₹6–10 Lakh","Above ₹10 Lakh"];
const CATEGORIES = ["General","OBC","SC","ST","EWS"];
const SPECIAL = ["Widow","Pregnant / Lactating","Differently Abled","BPL Card Holder","Minority Community","Ex-Serviceman"];
const TAG_COLORS = { Housing:FLAG.saffron, Health:"#ef4444", Education:"#8b5cf6", Agriculture:FLAG.green, Women:"#ec4899", Employment:FLAG.chakra, Finance:"#f59e0b", "Social Welfare":"#14b8a6", Loan:"#06b6d4" };

const SUGGESTIONS = [
  "I am a 35 year old farmer from Karnataka, OBC, income below 1 lakh. What schemes am I eligible for?",
  "Single mother, 28 years from Telangana. Need housing and health schemes.",
  "I want to start a small business. What loans are available without collateral?",
  "Senior citizen aged 68 from Maharashtra. What pension and health schemes exist?",
  "Student from SC category in Tamil Nadu looking for scholarships.",
];

// ─── MAIN APP ─────────────────────────────────────────────────
export default function AdhikarSetu() {
  const [dark, setDark] = useState(true);
  const T = dark ? DARK : LIGHT;

  const [page, setPage] = useState("home"); // home|chat|form|about|detail
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [formResult, setFormResult] = useState(null);

  return (
    <ThemeCtx.Provider value={{ dark, T, FLAG }}>
      <div style={{ minHeight:"100vh", background:T.bg, color:T.text, fontFamily:"'Georgia',serif", transition:"all 0.3s" }}>
        <Header dark={dark} setDark={setDark} page={page} setPage={setPage} />

        {/* FLAG STRIPE */}
        <div style={{ height:3, background:`linear-gradient(90deg, ${FLAG.saffron} 33%, ${FLAG.white} 33%, ${FLAG.white} 66%, ${FLAG.green} 66%)` }} />

        {page === "home"   && <HomePage setPage={setPage} />}
        {page === "chat"   && <ChatPage setPage={setPage} setSelectedScheme={setSelectedScheme} />}
        {page === "form"   && <FormPage setPage={setPage} setSelectedScheme={setSelectedScheme} formResult={formResult} setFormResult={setFormResult} />}
        {page === "about"  && <AboutPage />}
        {page === "detail" && <DetailPage scheme={selectedScheme} setPage={setPage} />}

        <Footer setPage={setPage} />
      </div>
    </ThemeCtx.Provider>
  );
}

// ─── HEADER ───────────────────────────────────────────────────
function Header({ dark, setDark, page, setPage }) {
  const { T, FLAG } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [["home","🏠 Home"],["chat","💬 Chat"],["form","📋 Form"],["about","ℹ️ About"]];

  return (
    <header style={{ background:T.headerBg, borderBottom:`1px solid ${T.cardBorder}`, padding:"0 20px", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(12px)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", height:58, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* Logo */}
        <div onClick={() => setPage("home")} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:`0 0 12px ${FLAG.saffron}44` }}>🌉</div>
          <div>
            <div style={{ fontSize:17, fontWeight:"bold", color:T.text, letterSpacing:0.3 }}>Adhikar Setu</div>
            <div style={{ fontSize:9, color:T.text3, fontFamily:"sans-serif", letterSpacing:1 }}>YOUR RIGHT · YOUR BRIDGE</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display:"flex", gap:4, alignItems:"center" }}>
          {navItems.map(([id,label]) => (
            <button key={id} onClick={() => setPage(id)} style={{
              padding:"6px 14px", borderRadius:20, border:"1px solid",
              borderColor: page===id ? FLAG.saffron : "transparent",
              background: page===id ? `${FLAG.saffron}18` : "transparent",
              color: page===id ? FLAG.saffron : T.text2,
              cursor:"pointer", fontSize:12, fontFamily:"sans-serif", fontWeight: page===id?"600":"400",
              transition:"all 0.2s"
            }}>{label}</button>
          ))}

          {/* Theme toggle */}
          <button onClick={() => setDark(d => !d)} style={{
            width:36, height:36, borderRadius:"50%", border:`1px solid ${T.cardBorder}`,
            background:T.card, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", marginLeft:6
          }}>{dark ? "☀️" : "🌙"}</button>
        </nav>
      </div>
    </header>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ setPage }) {
  const { T, FLAG } = useTheme();

  const stats = [["4000+","Schemes"],["28+","States"],["Free","Always"],["Live","AI Data"]];
  const categories = [["🏠","Housing & PMAY"],["💊","Ayushman Health"],["💰","Mudra Loans"],["🌾","PM Kisan"],["🎓","Scholarships"],["👩","Women Schemes"],["🏦","Insurance & Pension"],["🛠️","MSME & Startup"]];
  const steps = [["1","Tell Us About Yourself","Share your age, state, income, occupation"],["2","We Search Live","AI scans 4000+ Central & State schemes"],["3","Get Your Results","See schemes you qualify for with apply links"]];

  return (
    <main>
      {/* HERO */}
      <section style={{ maxWidth:900, margin:"0 auto", padding:"60px 24px 40px", textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${FLAG.saffron}15`, border:`1px solid ${FLAG.saffron}44`, borderRadius:30, padding:"6px 16px", marginBottom:24 }}>
          <span style={{ fontSize:11, color:FLAG.saffron, fontFamily:"sans-serif", fontWeight:"bold", letterSpacing:1 }}>🇮🇳 GOVERNMENT SCHEMES FINDER</span>
        </div>

        <h1 style={{ fontSize:"clamp(28px,5vw,46px)", fontWeight:"bold", color:T.text, lineHeight:1.25, marginBottom:16 }}>
          Your Rights.<br />
          <span style={{ background:`linear-gradient(90deg,${FLAG.saffron},${FLAG.green})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Your Benefits. Delivered.
          </span>
        </h1>
        <p style={{ color:T.text2, fontSize:16, maxWidth:500, margin:"0 auto 36px", lineHeight:1.8, fontFamily:"sans-serif" }}>
          Loans · Housing · Health Insurance · Scholarships · Pensions<br />
          Bridging every Indian citizen to what is rightfully theirs.
        </p>

        {/* CTA Buttons */}
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:48 }}>
          <button onClick={() => setPage("chat")} style={{ padding:"14px 32px", borderRadius:50, border:"none", background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`, color:"#fff", fontSize:16, fontWeight:"bold", cursor:"pointer", boxShadow:`0 8px 28px ${FLAG.saffron}44`, fontFamily:"sans-serif" }}>
            💬 Chat with AI
          </button>
          <button onClick={() => setPage("form")} style={{ padding:"14px 32px", borderRadius:50, border:`1px solid ${T.cardBorder}`, background:T.card, color:T.text, fontSize:16, cursor:"pointer", fontFamily:"sans-serif" }}>
            📋 Fill Profile Form
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", marginBottom:60 }}>
          {stats.map(([v,l]) => (
            <div key={l} style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:14, padding:"16px 22px", minWidth:90, textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:"bold", background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{v}</div>
              <div style={{ fontSize:11, color:T.text3, fontFamily:"sans-serif", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ background:T.bg2, padding:"40px 24px", borderTop:`1px solid ${T.cardBorder}`, borderBottom:`1px solid ${T.cardBorder}` }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <h2 style={{ textAlign:"center", fontSize:22, color:T.text, marginBottom:8 }}>Scheme Categories</h2>
          <p style={{ textAlign:"center", color:T.text3, fontSize:13, marginBottom:28, fontFamily:"sans-serif" }}>Central + State schemes across all sectors</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:12 }}>
            {categories.map(([icon,label]) => (
              <div key={label} onClick={() => setPage("chat")} style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:14, padding:"16px 14px", display:"flex", alignItems:"center", gap:10, cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor=FLAG.saffron}
                onMouseLeave={e => e.currentTarget.style.borderColor=T.cardBorder}>
                <span style={{ fontSize:22 }}>{icon}</span>
                <span style={{ fontSize:13, color:T.text, fontFamily:"sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth:900, margin:"0 auto", padding:"50px 24px" }}>
        <h2 style={{ textAlign:"center", fontSize:22, color:T.text, marginBottom:8 }}>How It Works</h2>
        <p style={{ textAlign:"center", color:T.text3, fontSize:13, marginBottom:36, fontFamily:"sans-serif" }}>3 simple steps to find your benefits</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20 }}>
          {steps.map(([num,title,desc]) => (
            <div key={num} style={{ background:T.card, border:`1px solid ${T.cardBorder}`, borderRadius:16, padding:"24px 20px", textAlign:"center", position:"relative" }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:"bold", color:"#fff", margin:"0 auto 14px", fontFamily:"sans-serif" }}>{num}</div>
              <div style={{ fontSize:15, fontWeight:"bold", color:T.text, marginBottom:6 }}>{title}</div>
              <div style={{ fontSize:13, color:T.text2, fontFamily:"sans-serif", lineHeight:1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DISCLAIMER BANNER */}
      <div style={{ background:`${FLAG.saffron}12`, borderTop:`1px solid ${FLAG.saffron}33`, padding:"14px 24px", textAlign:"center" }}>
        <p style={{ fontSize:12, color:T.text3, fontFamily:"sans-serif", margin:0 }}>
          🔗 Data sourced from official government portals · Always verify on <strong>myscheme.gov.in</strong> before applying
        </p>
      </div>
    </main>
  );
}

// ─── CHAT PAGE ────────────────────────────────────────────────
function ChatPage({ setPage, setSelectedScheme }) {
  const { T, FLAG } = useTheme();
  const [messages, setMessages] = useState([{
    role:"bot",
    text:`Namaste! 🙏 I'm **Adhikar Setu** — your bridge to government benefits.\n\nTell me about yourself — age, state, occupation, income, and situation. I'll find all schemes, loans, insurance, and subsidies you're entitled to.\n\nSupports: English · हिंदी · తెలుగు · ಕನ್ನಡ`,
    schemes:null
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role:"user", text:text.trim() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    const systemPrompt = `You are Adhikar Setu, an Indian Government Schemes Advisor. Help citizens find ALL government schemes — welfare, loans (Mudra, CGTMSE, KCC), subsidies, insurance (PMJJBY, PMSBY), housing (PMAY), health (Ayushman Bharat), scholarships, pensions. Use web search for live data.

When user describes their profile, return:
SCHEMES_JSON_START
[{"name":"","ministry":"","type":"Central/State","tag":"Housing/Health/Education/Agriculture/Loan/Finance/Women/Employment/Social Welfare","benefit":"specific benefit with amounts","eligibility":"simple 1-2 lines","documents":["doc1","doc2"],"how_to_apply":"simple steps","link":"official url","state":"applicable state or All India"}]
SCHEMES_JSON_END
Then add a short 2-line warm summary. Reply in the user's language if not English.`;

    const apiMessages = history.map(m => ({ role:m.role==="user"?"user":"assistant", content:m.role==="bot"?(m.rawText||m.text):m.text }));

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:systemPrompt, tools:[{type:"web_search_20250305",name:"web_search"}], messages:apiMessages })
      });
      const data = await res.json();
      let fullText = data.content.filter(b=>b.type==="text").map(b=>b.text).join("");
      let schemes = null;
      const jm = fullText.match(/SCHEMES_JSON_START\s*([\s\S]*?)\s*SCHEMES_JSON_END/);
      if (jm) { try { schemes = JSON.parse(jm[1].trim()); } catch(e){} fullText = fullText.replace(/SCHEMES_JSON_START[\s\S]*?SCHEMES_JSON_END/,"").trim(); }
      setMessages(prev => [...prev, { role:"bot", text:fullText, rawText:fullText, schemes }]);
    } catch(e) {
      setMessages(prev => [...prev, { role:"bot", text:"Something went wrong. Please try again.", schemes:null }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth:820, margin:"0 auto", padding:"0 16px", display:"flex", flexDirection:"column", height:"calc(100vh - 65px)" }}>
      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 0", display:"flex", flexDirection:"column", gap:16 }}>
        {messages.map((msg,i) => (
          <div key={i} style={{ display:"flex", gap:10, justifyContent:msg.role==="user"?"flex-end":"flex-start" }}>
            {msg.role==="bot" && (
              <div style={{ width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,marginTop:2 }}>🌉</div>
            )}
            <div style={{ maxWidth:"82%" }}>
              <div style={{ padding:"12px 16px", borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
                background:msg.role==="user" ? `linear-gradient(135deg,${FLAG.navy}cc,${FLAG.chakra}cc)` : T.card,
                border:`1px solid ${msg.role==="user"?FLAG.chakra:T.cardBorder}`,
                fontSize:14, lineHeight:1.7, color:T.text, fontFamily:"sans-serif", whiteSpace:"pre-wrap"
              }}>
                {msg.text.replace(/\*\*(.*?)\*\*/g,"$1")}
              </div>
              {msg.schemes?.length > 0 && (
                <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:10 }}>
                  {msg.schemes.map((s,j) => <SchemeCard key={j} s={s} onDetail={() => { setSelectedScheme(s); setPage("detail"); }} />)}
                  <WhatsAppShare schemes={msg.schemes} />
                </div>
              )}
            </div>
            {msg.role==="user" && (
              <div style={{ width:34,height:34,borderRadius:"50%",background:T.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,marginTop:2,border:`1px solid ${T.cardBorder}` }}>👤</div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>🌉</div>
            <div style={{ padding:"12px 18px", borderRadius:"18px 18px 18px 4px", background:T.card, border:`1px solid ${T.cardBorder}` }}>
              <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{ width:8,height:8,borderRadius:"50%",background:FLAG.saffron,animation:"pulse 1.2s ease-in-out infinite",animationDelay:`${d*0.2}s` }} />
                ))}
                <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
                <span style={{ fontSize:12,color:T.text3,fontFamily:"sans-serif",marginLeft:6 }}>Searching live government schemes...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ paddingBottom:8 }}>
          <div style={{ fontSize:11,color:T.text3,fontFamily:"sans-serif",marginBottom:7 }}>Quick start — try asking:</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
            {SUGGESTIONS.slice(0,3).map((s,i) => (
              <button key={i} onClick={() => sendMessage(s)} style={{ padding:"7px 12px",borderRadius:20,border:`1px solid ${T.cardBorder}`,background:T.card,color:T.text2,fontSize:12,cursor:"pointer",fontFamily:"sans-serif",textAlign:"left",lineHeight:1.4,maxWidth:260 }}>
                {s.length>68?s.slice(0,66)+"…":s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding:"10px 0 16px", borderTop:`1px solid ${T.cardBorder}` }}>
        <div style={{ display:"flex",gap:10,alignItems:"flex-end" }}>
          <textarea value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(input);} }}
            placeholder="Tell me your age, state, income, occupation... (English / हिंदी / తెలుగు / ಕನ್ನಡ)"
            rows={2} style={{ flex:1,padding:"11px 15px",borderRadius:16,border:`1px solid ${T.inputBorder}`,background:T.input,color:T.text,fontSize:14,fontFamily:"sans-serif",resize:"none",outline:"none",lineHeight:1.5 }}
          />
          <button onClick={() => sendMessage(input)} disabled={!input.trim()||loading} style={{ width:46,height:46,borderRadius:"50%",border:"none",background:input.trim()?`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`:"#374151",color:"#fff",fontSize:18,cursor:input.trim()?"pointer":"not-allowed",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:input.trim()?`0 4px 14px ${FLAG.saffron}44`:"none" }}>➤</button>
        </div>
        <div style={{ fontSize:11,color:T.text3,marginTop:5,fontFamily:"sans-serif",textAlign:"center" }}>AI-powered live search · Verify on myscheme.gov.in before applying</div>
      </div>
    </div>
  );
}

// ─── FORM PAGE ────────────────────────────────────────────────
function FormPage({ setPage, setSelectedScheme, formResult, setFormResult }) {
  const { T, FLAG } = useTheme();
  const [form, setForm] = useState({ name:"",age:"",gender:"",state:"",category:"",occupation:"",income:"",special:[] });
  const [loading, setLoading] = useState(false);

  const isValid = () => form.age && form.gender && form.state && form.category && form.occupation && form.income;
  const toggleSpecial = v => setForm(f => ({ ...f, special:f.special.includes(v)?f.special.filter(x=>x!==v):[...f.special,v] }));

  const findSchemes = async () => {
    setLoading(true); setFormResult(null);
    const prompt = `Find government schemes for: Age ${form.age}, ${form.gender}, ${form.state}, ${form.category}, ${form.occupation}, income ${form.income}${form.special.length?", Special: "+form.special.join(", "):""}.
Return ONLY raw JSON array of 6-8 schemes:
[{"name":"","ministry":"","type":"Central/State","tag":"Housing/Health/Education/Agriculture/Loan/Finance/Women/Employment/Social Welfare","benefit":"","eligibility":"","documents":[],"how_to_apply":"","link":""}]`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]})
      });
      const data = await res.json();
      const text = data.content.filter(b=>b.type==="text").map(b=>b.text).join("");
      const clean = text.replace(/```json|```/g,"").trim();
      const s=clean.indexOf("["),e=clean.lastIndexOf("]")+1;
      setFormResult(JSON.parse(clean.slice(s,e)));
    } catch(err) { setFormResult([]); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth:740, margin:"0 auto", padding:"28px 20px" }}>
      {!formResult ? (
        <>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <h2 style={{ fontSize:22, color:T.text, marginBottom:6 }}>Your Profile</h2>
            <p style={{ color:T.text3, fontSize:13, fontFamily:"sans-serif" }}>Fill details to find all matching schemes</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <FL>Name (optional)</FL>
              <FI placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            </div>
            <div><FL>Age *</FL><FI type="number" placeholder="e.g. 32" value={form.age} onChange={e=>setForm(f=>({...f,age:e.target.value}))} /></div>
            <div><FL>Gender *</FL><FS value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))}><option value="">Select</option><option>Male</option><option>Female</option><option>Transgender</option></FS></div>
            <div><FL>State *</FL><FS value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))}><option value="">Select</option>{STATES.map(s=><option key={s}>{s}</option>)}</FS></div>
            <div><FL>Category *</FL><FS value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}><option value="">Select</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</FS></div>
            <div><FL>Occupation *</FL><FS value={form.occupation} onChange={e=>setForm(f=>({...f,occupation:e.target.value}))}><option value="">Select</option>{OCCUPATIONS.map(o=><option key={o}>{o}</option>)}</FS></div>
            <div><FL>Annual Income *</FL><FS value={form.income} onChange={e=>setForm(f=>({...f,income:e.target.value}))}><option value="">Select</option>{INCOME_LEVELS.map(i=><option key={i}>{i}</option>)}</FS></div>
            <div style={{ gridColumn:"1/-1" }}>
              <FL>Special Status (optional)</FL>
              <div style={{ display:"flex",flexWrap:"wrap",gap:7,marginTop:7 }}>
                {SPECIAL.map(opt=>(
                  <button key={opt} onClick={()=>toggleSpecial(opt)} style={{ padding:"5px 13px",borderRadius:20,border:"1px solid",borderColor:form.special.includes(opt)?FLAG.saffron:"#334155",background:form.special.includes(opt)?`${FLAG.saffron}15`:"transparent",color:form.special.includes(opt)?FLAG.saffron:T.text2,cursor:"pointer",fontSize:12,fontFamily:"sans-serif" }}>
                    {form.special.includes(opt)?"✓ ":""}{opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading && (
            <div style={{ textAlign:"center",margin:"24px 0",color:T.text2,fontFamily:"sans-serif",fontSize:14 }}>
              <div style={{ fontSize:28,marginBottom:8 }}>⚡</div>
              Searching Central + {form.state||"State"} schemes live...<br/>
              <span style={{ fontSize:12,color:T.text3 }}>Usually takes 10–20 seconds</span>
            </div>
          )}

          <div style={{ display:"flex",gap:12,marginTop:22 }}>
            <button onClick={findSchemes} disabled={!isValid()||loading} style={{ flex:1,padding:13,borderRadius:12,border:"none",background:isValid()?`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`:"#374151",color:"#fff",cursor:isValid()?"pointer":"not-allowed",fontSize:15,fontWeight:"bold",fontFamily:"sans-serif" }}>
              {loading?"🔍 Searching Live...":"🔍 Find My Schemes →"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10 }}>
            <div>
              <h2 style={{ fontSize:20,color:T.text,margin:0 }}>🎉 {formResult.length} Schemes Found</h2>
              <p style={{ color:T.text3,fontSize:12,margin:"4px 0 0",fontFamily:"sans-serif" }}>{form.state} · {form.occupation} · {form.income}</p>
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <WhatsAppShare schemes={formResult} />
              <button onClick={()=>setFormResult(null)} style={{ padding:"7px 16px",borderRadius:20,border:`1px solid ${T.cardBorder}`,background:T.card,color:T.text2,cursor:"pointer",fontSize:12,fontFamily:"sans-serif" }}>✏️ Edit</button>
            </div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {formResult.map((s,i) => <SchemeCard key={i} s={s} onDetail={() => { setSelectedScheme(s); setPage("detail"); }} />)}
          </div>
          <div style={{ marginTop:18,textAlign:"center",fontSize:12,color:T.text3,fontFamily:"sans-serif",lineHeight:1.7,padding:"12px",background:`${FLAG.saffron}0a`,borderRadius:10,border:`1px solid ${FLAG.saffron}22` }}>
            ⚠️ Always verify eligibility on <strong>myscheme.gov.in</strong> · india.gov.in before applying
          </div>
        </>
      )}
    </div>
  );
}

// ─── SCHEME DETAIL PAGE ───────────────────────────────────────
function DetailPage({ scheme, setPage }) {
  const { T, FLAG } = useTheme();
  if (!scheme) { setPage("home"); return null; }
  const color = TAG_COLORS[scheme.tag] || FLAG.saffron;

  const shareOnWhatsApp = () => {
    const text = `🇮🇳 *${scheme.name}*\n\n💰 *Benefit:* ${scheme.benefit}\n\n✅ *Eligibility:* ${scheme.eligibility}\n\n📄 *Documents:* ${scheme.documents?.join(", ")}\n\n🔗 *Apply:* ${scheme.link || "myscheme.gov.in"}\n\n_Found via Adhikar Setu_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div style={{ maxWidth:760, margin:"0 auto", padding:"28px 20px" }}>
      {/* Back */}
      <button onClick={() => setPage("form")} style={{ display:"flex",alignItems:"center",gap:6,background:"transparent",border:"none",color:T.text2,cursor:"pointer",fontSize:13,fontFamily:"sans-serif",marginBottom:20,padding:0 }}>
        ← Back to Results
      </button>

      {/* Hero Card */}
      <div style={{ background:T.card,border:`2px solid ${color}44`,borderRadius:20,padding:"28px 24px",marginBottom:20 }}>
        <div style={{ display:"flex",gap:8,marginBottom:12,flexWrap:"wrap" }}>
          <span style={{ background:color,color:"#fff",fontSize:11,padding:"3px 12px",borderRadius:20,fontFamily:"sans-serif",fontWeight:"bold" }}>{scheme.tag}</span>
          <span style={{ background:scheme.type==="Central"?`${FLAG.chakra}20`:`${FLAG.green}20`,color:scheme.type==="Central"?FLAG.chakra:FLAG.green,fontSize:11,padding:"3px 12px",borderRadius:20,fontFamily:"sans-serif",border:`1px solid ${scheme.type==="Central"?FLAG.chakra:FLAG.green}` }}>{scheme.type} Scheme</span>
        </div>
        <h1 style={{ fontSize:"clamp(18px,3vw,26px)",color:T.text,marginBottom:6,lineHeight:1.3 }}>{scheme.name}</h1>
        <p style={{ color:T.text3,fontSize:13,fontFamily:"sans-serif",margin:0 }}>{scheme.ministry}</p>
      </div>

      {/* Benefit Banner */}
      <div style={{ background:`${FLAG.saffron}12`,border:`1px solid ${FLAG.saffron}44`,borderRadius:14,padding:"16px 20px",marginBottom:16 }}>
        <div style={{ fontSize:11,color:FLAG.saffron,fontFamily:"sans-serif",fontWeight:"bold",marginBottom:4,letterSpacing:1 }}>WHAT YOU GET</div>
        <div style={{ fontSize:16,color:T.text,lineHeight:1.6,fontFamily:"sans-serif" }}>{scheme.benefit}</div>
      </div>

      {/* Info Grid */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16 }}>
        <InfoBox title="Eligibility" icon="✅" color={FLAG.green}>{scheme.eligibility}</InfoBox>
        <InfoBox title="How to Apply" icon="📋" color={FLAG.chakra}>{scheme.how_to_apply}</InfoBox>
      </div>

      {/* Documents */}
      {scheme.documents?.length > 0 && (
        <div style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:14,padding:"18px 20px",marginBottom:16 }}>
          <div style={{ fontSize:13,color:T.text2,fontFamily:"sans-serif",fontWeight:"bold",marginBottom:12 }}>📄 Documents Required</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
            {scheme.documents.map((d,i) => (
              <span key={i} style={{ background:T.bg2,border:`1px solid ${T.cardBorder}`,borderRadius:8,padding:"6px 14px",fontSize:13,color:T.text,fontFamily:"sans-serif" }}>📎 {d}</span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
        {scheme.link && (
          <a href={scheme.link?.startsWith("http")?scheme.link:`https://${scheme.link}`} target="_blank" rel="noopener noreferrer"
            style={{ flex:1,padding:"13px 20px",borderRadius:12,background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,color:"#fff",fontWeight:"bold",fontSize:14,textDecoration:"none",fontFamily:"sans-serif",textAlign:"center",display:"block" }}>
            🔗 Apply on Official Site
          </a>
        )}
        <button onClick={shareOnWhatsApp} style={{ flex:1,padding:"13px 20px",borderRadius:12,border:"none",background:"#25D366",color:"#fff",fontWeight:"bold",fontSize:14,cursor:"pointer",fontFamily:"sans-serif" }}>
          📲 Share on WhatsApp
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop:16,padding:"12px 16px",borderRadius:10,background:`${FLAG.saffron}08`,border:`1px solid ${FLAG.saffron}22`,fontSize:12,color:T.text3,fontFamily:"sans-serif",textAlign:"center",lineHeight:1.7 }}>
        ⚠️ Verify eligibility on <strong>myscheme.gov.in</strong> before applying. Data sourced via AI search.
      </div>
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────────
function AboutPage() {
  const { T, FLAG } = useTheme();

  const team = [{ icon:"🌉", title:"Our Mission", desc:"Bridge every Indian citizen to government schemes they deserve but never knew existed." },{ icon:"🤖", title:"How We Work", desc:"AI-powered live search across 4000+ Central and State schemes, explained in simple language." },{ icon:"🔒", title:"Data Safety", desc:"We never store personal data. All searches are private. Official links always provided." },{ icon:"🌍", title:"Multilingual", desc:"Available in English, Hindi, Telugu, and Kannada — reaching every corner of India." }];
  const disclaimer = ["Data is sourced via AI-powered web search and official government portals.","Always verify eligibility and scheme details on myscheme.gov.in before applying.","Adhikar Setu is not affiliated with the Government of India.","Scheme details may change — check official sources for latest information.","We are not responsible for decisions made based on AI-generated results."];

  return (
    <div style={{ maxWidth:820, margin:"0 auto", padding:"40px 24px" }}>
      {/* Hero */}
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ width:70,height:70,borderRadius:"50%",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 20px",boxShadow:`0 8px 28px ${FLAG.saffron}44` }}>🌉</div>
        <h1 style={{ fontSize:28,color:T.text,marginBottom:10 }}>About Adhikar Setu</h1>
        <p style={{ color:T.text2,fontSize:15,maxWidth:500,margin:"0 auto",fontFamily:"sans-serif",lineHeight:1.8 }}>
          <em>"Adhikar"</em> means Right. <em>"Setu"</em> means Bridge.<br />
          We bridge every Indian citizen to what is rightfully theirs.
        </p>
      </div>

      {/* Mission Cards */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:40 }}>
        {team.map(({icon,title,desc}) => (
          <div key={title} style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:16,padding:"22px 18px",textAlign:"center" }}>
            <div style={{ fontSize:30,marginBottom:12 }}>{icon}</div>
            <div style={{ fontSize:15,fontWeight:"bold",color:T.text,marginBottom:8 }}>{title}</div>
            <div style={{ fontSize:13,color:T.text2,fontFamily:"sans-serif",lineHeight:1.6 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Flag stripe accent */}
      <div style={{ height:4,borderRadius:4,background:`linear-gradient(90deg,${FLAG.saffron} 33%,${FLAG.white} 33%,${FLAG.white} 66%,${FLAG.green} 66%)`,marginBottom:32 }} />

      {/* Contact & APISetu */}
      <div style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:16,padding:"24px",marginBottom:24 }}>
        <h3 style={{ fontSize:16,color:T.text,marginBottom:14 }}>📬 Contact & Registration</h3>
        <div style={{ fontSize:13,color:T.text2,fontFamily:"sans-serif",lineHeight:2 }}>
          <div>🏢 <strong>Organisation:</strong> Sri Vara Lakshmi Balaji Enterprises</div>
          <div>📍 <strong>Location:</strong> KR Puram, Bengaluru, Karnataka</div>
          <div>🌐 <strong>Data Source:</strong> myscheme.gov.in · india.gov.in · APISetu</div>
          <div>📧 <strong>APISetu Application:</strong> Submitted for official API access</div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background:`${FLAG.saffron}08`,border:`1px solid ${FLAG.saffron}33`,borderRadius:16,padding:"22px 24px" }}>
        <h3 style={{ fontSize:15,color:FLAG.saffron,marginBottom:14 }}>⚠️ Disclaimer</h3>
        <ul style={{ margin:0,padding:"0 0 0 16px" }}>
          {disclaimer.map((d,i) => (
            <li key={i} style={{ fontSize:13,color:T.text2,fontFamily:"sans-serif",lineHeight:1.8,marginBottom:4 }}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────
function Footer({ setPage }) {
  const { T, FLAG } = useTheme();
  return (
    <footer style={{ borderTop:`1px solid ${T.cardBorder}`,padding:"28px 24px",marginTop:20 }}>
      <div style={{ maxWidth:1100,margin:"0 auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16,marginBottom:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${FLAG.saffron},${FLAG.green})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>🌉</div>
            <div>
              <div style={{ fontSize:14,fontWeight:"bold",color:T.text }}>Adhikar Setu</div>
              <div style={{ fontSize:10,color:T.text3,fontFamily:"sans-serif" }}>Your Right · Your Bridge</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:16,flexWrap:"wrap" }}>
            {[["home","Home"],["chat","Chat"],["form","Find Schemes"],["about","About"]].map(([id,l]) => (
              <button key={id} onClick={()=>setPage(id)} style={{ background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:13,fontFamily:"sans-serif" }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ height:2,background:`linear-gradient(90deg,${FLAG.saffron} 33%,${FLAG.white} 33%,${FLAG.white} 66%,${FLAG.green} 66%)`,marginBottom:14,borderRadius:2 }} />
        <div style={{ display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8 }}>
          <div style={{ fontSize:12,color:T.text3,fontFamily:"sans-serif" }}>© 2025 Sri Vara Lakshmi Balaji Enterprises · Bengaluru</div>
          <div style={{ fontSize:12,color:T.text3,fontFamily:"sans-serif" }}>Data: myscheme.gov.in · Not affiliated with Government of India</div>
        </div>
      </div>
    </footer>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────
function SchemeCard({ s, onDetail }) {
  const { T, FLAG } = useTheme();
  const [open, setOpen] = useState(false);
  const color = TAG_COLORS[s.tag] || FLAG.saffron;

  return (
    <div style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:14,overflow:"hidden",transition:"border-color 0.2s" }}
      onMouseEnter={e=>e.currentTarget.style.borderColor=color+"66"}
      onMouseLeave={e=>e.currentTarget.style.borderColor=T.cardBorder}>
      <div style={{ padding:"14px 16px",cursor:"pointer" }} onClick={()=>setOpen(o=>!o)}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",gap:6,marginBottom:6,flexWrap:"wrap" }}>
              <span style={{ background:color,color:"#fff",fontSize:10,padding:"2px 10px",borderRadius:20,fontFamily:"sans-serif",fontWeight:"bold" }}>{s.tag}</span>
              <span style={{ background:s.type==="Central"?`${FLAG.chakra}20`:`${FLAG.green}20`,color:s.type==="Central"?FLAG.chakra:FLAG.green,fontSize:10,padding:"2px 10px",borderRadius:20,fontFamily:"sans-serif",border:`1px solid ${s.type==="Central"?FLAG.chakra:FLAG.green}` }}>{s.type}</span>
            </div>
            <div style={{ fontSize:15,color:T.text,fontWeight:"500",lineHeight:1.3 }}>{s.name}</div>
            <div style={{ fontSize:11,color:T.text3,fontFamily:"sans-serif",marginTop:2 }}>{s.ministry}</div>
          </div>
          <span style={{ color:T.text3,fontSize:16,flexShrink:0 }}>{open?"▲":"▼"}</span>
        </div>
        <div style={{ marginTop:10,background:`${FLAG.saffron}10`,border:`1px solid ${FLAG.saffron}33`,borderRadius:8,padding:"8px 12px" }}>
          <span style={{ fontSize:10,color:FLAG.saffron,fontFamily:"sans-serif",fontWeight:"bold" }}>BENEFIT: </span>
          <span style={{ fontSize:13,color:T.text,fontFamily:"sans-serif" }}>{s.benefit}</span>
        </div>
      </div>

      {open && (
        <div style={{ padding:"0 16px 16px",borderTop:`1px solid ${T.cardBorder}` }}>
          <div style={{ paddingTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
            <div>
              <div style={{ fontSize:10,color:T.text3,fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:0.5,marginBottom:4 }}>Eligibility</div>
              <div style={{ fontSize:13,color:T.text2,fontFamily:"sans-serif",lineHeight:1.6 }}>{s.eligibility}</div>
            </div>
            <div>
              <div style={{ fontSize:10,color:T.text3,fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:0.5,marginBottom:4 }}>How to Apply</div>
              <div style={{ fontSize:13,color:T.text2,fontFamily:"sans-serif",lineHeight:1.6 }}>{s.how_to_apply}</div>
            </div>
          </div>
          {s.documents?.length > 0 && (
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:10,color:T.text3,fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:0.5,marginBottom:6 }}>Documents</div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:5 }}>
                {s.documents.map((d,j) => <span key={j} style={{ background:T.bg2,border:`1px solid ${T.cardBorder}`,borderRadius:6,padding:"2px 9px",fontSize:11,color:T.text2,fontFamily:"sans-serif" }}>📄 {d}</span>)}
              </div>
            </div>
          )}
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {s.link && (
              <a href={s.link?.startsWith("http")?s.link:`https://${s.link}`} target="_blank" rel="noopener noreferrer"
                style={{ padding:"7px 14px",borderRadius:8,background:`${FLAG.chakra}20`,border:`1px solid ${FLAG.chakra}`,color:FLAG.chakra,fontSize:12,textDecoration:"none",fontFamily:"sans-serif" }}>
                🔗 Official Site
              </a>
            )}
            <button onClick={onDetail} style={{ padding:"7px 14px",borderRadius:8,background:`${FLAG.saffron}15`,border:`1px solid ${FLAG.saffron}`,color:FLAG.saffron,fontSize:12,cursor:"pointer",fontFamily:"sans-serif" }}>
              📋 Full Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function WhatsAppShare({ schemes }) {
  const { FLAG } = useTheme();
  const share = () => {
    const text = `🇮🇳 *Government Schemes Found via Adhikar Setu*\n\n` +
      schemes.slice(0,5).map((s,i) => `*${i+1}. ${s.name}*\n💰 ${s.benefit}\n🔗 ${s.link||"myscheme.gov.in"}`).join("\n\n") +
      `\n\n_Verify on myscheme.gov.in_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,"_blank");
  };
  return (
    <button onClick={share} style={{ width:"100%",padding:"10px",borderRadius:10,border:"none",background:"#25D366",color:"#fff",fontWeight:"bold",fontSize:13,cursor:"pointer",fontFamily:"sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
      📲 Share All Schemes on WhatsApp
    </button>
  );
}

function InfoBox({ title, icon, color, children }) {
  const { T } = useTheme();
  return (
    <div style={{ background:T.card,border:`1px solid ${T.cardBorder}`,borderRadius:14,padding:"16px 18px" }}>
      <div style={{ fontSize:11,color:color,fontFamily:"sans-serif",fontWeight:"bold",marginBottom:6,letterSpacing:0.5 }}>{icon} {title.toUpperCase()}</div>
      <div style={{ fontSize:13,color:T.text2,fontFamily:"sans-serif",lineHeight:1.6 }}>{children}</div>
    </div>
  );
}

function FL({ children }) {
  const { T } = useTheme();
  return <div style={{ fontSize:12,color:T.text2,marginBottom:5,fontFamily:"sans-serif",fontWeight:"500" }}>{children}</div>;
}
function FI(props) {
  const { T } = useTheme();
  return <input {...props} style={{ width:"100%",padding:"9px 13px",borderRadius:9,background:T.input,border:`1px solid ${T.inputBorder}`,color:T.text,fontSize:13,fontFamily:"sans-serif",outline:"none",boxSizing:"border-box" }} />;
}
function FS({ children, ...props }) {
  const { T } = useTheme();
  return <select {...props} style={{ width:"100%",padding:"9px 13px",borderRadius:9,background:T.input,border:`1px solid ${T.inputBorder}`,color:T.text,fontSize:13,fontFamily:"sans-serif",outline:"none",cursor:"pointer" }}>{children}</select>;
}
