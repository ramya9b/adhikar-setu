// Real Government Schemes Data
// Source: myscheme.gov.in — verified scheme information
// Last updated: 2025

export const SCHEMES = [
  // ── HEALTH ──────────────────────────────────────────────────
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    ministry: "Ministry of Health & Family Welfare",
    type: "Central",
    tag: "Health",
    benefit: "Free health coverage up to ₹5 lakh per family per year for secondary and tertiary care hospitalisation",
    eligibility: "Families identified in SECC-2011 data; BPL families; income below ₹2.5 lakh",
    income_max: "2.5lakh",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 0, age_max: 100,
    occupations: ["Daily Wage Worker","Farmer","Self Employed","Homemaker","Unemployed"],
    documents: ["Aadhaar Card","Ration Card","Income Certificate"],
    how_to_apply: "Visit nearest empanelled hospital or Ayushman Mitra. Download Ayushman app or call 14555.",
    link: "https://pmjay.gov.in",
    special: []
  },
  {
    id: "pmjjby",
    name: "PM Jeevan Jyoti Bima Yojana",
    ministry: "Ministry of Finance",
    type: "Central",
    tag: "Health",
    benefit: "Life insurance cover of ₹2 lakh on death for just ₹436 per year premium",
    eligibility: "Age 18–50 years, having a savings bank account",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 50,
    occupations: ["Daily Wage Worker","Farmer","Self Employed","Government Employee","Private Employee","Homemaker"],
    documents: ["Aadhaar Card","Bank Account Passbook"],
    how_to_apply: "Apply through your bank branch or bank's mobile app. Auto-debit of premium from savings account.",
    link: "https://jansuraksha.gov.in",
    special: []
  },
  {
    id: "pmsby",
    name: "PM Suraksha Bima Yojana",
    ministry: "Ministry of Finance",
    type: "Central",
    tag: "Health",
    benefit: "Accident insurance ₹2 lakh (death/permanent disability) for just ₹20 per year",
    eligibility: "Age 18–70 years with savings bank account",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 70,
    occupations: ["Daily Wage Worker","Farmer","Self Employed","Government Employee","Private Employee","Homemaker","Unemployed"],
    documents: ["Aadhaar Card","Bank Account Passbook"],
    how_to_apply: "Apply at bank branch, online banking, or Common Service Centre (CSC).",
    link: "https://jansuraksha.gov.in",
    special: []
  },

  // ── HOUSING ─────────────────────────────────────────────────
  {
    id: "pmay-urban",
    name: "PM Awas Yojana (Urban)",
    ministry: "Ministry of Housing & Urban Affairs",
    type: "Central",
    tag: "Housing",
    benefit: "Interest subsidy up to ₹2.67 lakh on home loan; grant up to ₹1.5 lakh for construction",
    eligibility: "EWS (income up to ₹3L), LIG (₹3–6L), MIG-I (₹6–12L), MIG-II (₹12–18L). First-time home buyers only.",
    income_max: "18lakh",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 100,
    occupations: ["Daily Wage Worker","Farmer","Self Employed","Government Employee","Private Employee","Homemaker","Unemployed"],
    documents: ["Aadhaar Card","Income Certificate","Address Proof","Bank Account"],
    how_to_apply: "Apply at pmaymis.gov.in or nearest Urban Local Body (ULB) office.",
    link: "https://pmaymis.gov.in",
    special: []
  },
  {
    id: "pmay-gramin",
    name: "PM Awas Yojana (Gramin)",
    ministry: "Ministry of Rural Development",
    type: "Central",
    tag: "Housing",
    benefit: "Financial assistance ₹1.2 lakh (plain areas) or ₹1.3 lakh (hilly/NE areas) for house construction",
    eligibility: "Homeless or kutcha house rural families from SECC 2011 list",
    income_max: "1lakh",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 100,
    occupations: ["Farmer","Daily Wage Worker","Homemaker","Unemployed"],
    documents: ["Aadhaar Card","Job Card (MGNREGA)","Bank Account","Income Certificate"],
    how_to_apply: "Apply through Gram Panchayat or Block Development Office. Register on pmayg.nic.in.",
    link: "https://pmayg.nic.in",
    special: []
  },

  // ── FINANCE / LOANS ─────────────────────────────────────────
  {
    id: "mudra-shishu",
    name: "PM Mudra Yojana – Shishu",
    ministry: "Ministry of Finance",
    type: "Central",
    tag: "Loan",
    benefit: "Collateral-free business loan up to ₹50,000 at subsidised interest rate for micro enterprises",
    eligibility: "Non-corporate, non-farm micro & small enterprises including shopkeepers, artisans, vendors",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 65,
    occupations: ["Self Employed","Farmer","Daily Wage Worker","Unemployed"],
    documents: ["Aadhaar Card","PAN Card","Business Plan/Proof","Bank Account","Address Proof"],
    how_to_apply: "Apply at any bank, MFI, NBFC or mudra.org.in. No collateral required.",
    link: "https://mudra.org.in",
    special: []
  },
  {
    id: "mudra-kishor",
    name: "PM Mudra Yojana – Kishor",
    ministry: "Ministry of Finance",
    type: "Central",
    tag: "Loan",
    benefit: "Business loan ₹50,001 to ₹5 lakh without collateral for growing businesses",
    eligibility: "Existing micro businesses looking to expand, age 18–65",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 65,
    occupations: ["Self Employed"],
    documents: ["Aadhaar Card","PAN Card","Business Proof","ITR (if available)","Bank Statement"],
    how_to_apply: "Apply at bank branch or online. Business vintage of 2+ years preferred.",
    link: "https://mudra.org.in",
    special: []
  },
  {
    id: "mudra-tarun",
    name: "PM Mudra Yojana – Tarun",
    ministry: "Ministry of Finance",
    type: "Central",
    tag: "Loan",
    benefit: "Business loan ₹5 lakh to ₹10 lakh for established enterprises",
    eligibility: "Well-established micro businesses, age 18–65",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 65,
    occupations: ["Self Employed"],
    documents: ["Aadhaar Card","PAN Card","ITR 2 years","Audited Balance Sheet","Business Plan"],
    how_to_apply: "Apply at PSU bank or private bank. Requires business history.",
    link: "https://mudra.org.in",
    special: []
  },
  {
    id: "svanidhi",
    name: "PM SVANidhi Scheme",
    ministry: "Ministry of Housing & Urban Affairs",
    type: "Central",
    tag: "Loan",
    benefit: "Working capital loan ₹10,000 (1st), ₹20,000 (2nd), ₹50,000 (3rd) for street vendors",
    eligibility: "Street vendors who were vending on or before 24 March 2020 with Certificate of Vending",
    income_max: "1lakh",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 65,
    occupations: ["Self Employed","Daily Wage Worker"],
    documents: ["Aadhaar Card","Vending Certificate/Letter of Recommendation","Bank Account"],
    how_to_apply: "Apply at pmsvanidhi.mohua.gov.in or through scheduled commercial bank.",
    link: "https://pmsvanidhi.mohua.gov.in",
    special: []
  },
  {
    id: "standup-india",
    name: "Stand Up India Scheme",
    ministry: "Ministry of Finance",
    type: "Central",
    tag: "Loan",
    benefit: "Bank loan between ₹10 lakh to ₹1 crore for greenfield enterprises",
    eligibility: "SC/ST borrowers or women entrepreneurs, age 18+, first-time enterprise",
    income_max: "any",
    categories: ["SC","ST"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 65,
    occupations: ["Self Employed","Unemployed"],
    documents: ["Aadhaar Card","PAN Card","Caste Certificate (SC/ST)","Business Plan","Address Proof"],
    how_to_apply: "Apply at standupmitra.in or any scheduled commercial bank branch.",
    link: "https://standupmitra.in",
    special: []
  },

  // ── AGRICULTURE ─────────────────────────────────────────────
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture",
    type: "Central",
    tag: "Agriculture",
    benefit: "Direct income support ₹6,000 per year (₹2,000 in 3 instalments) to farmer families",
    eligibility: "All landholder farmer families with cultivable land. Excludes government employees, taxpayers.",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 100,
    occupations: ["Farmer"],
    documents: ["Aadhaar Card","Land Records","Bank Account"],
    how_to_apply: "Register at pmkisan.gov.in or through local Patwari/Revenue Officer.",
    link: "https://pmkisan.gov.in",
    special: []
  },
  {
    id: "kisan-credit-card",
    name: "Kisan Credit Card (KCC)",
    ministry: "Ministry of Agriculture",
    type: "Central",
    tag: "Loan",
    benefit: "Flexible credit up to ₹3 lakh at 4% interest rate for crop production and allied activities",
    eligibility: "All farmers, tenant farmers, sharecroppers, SHG members involved in agriculture",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 75,
    occupations: ["Farmer"],
    documents: ["Aadhaar Card","Land Records/Lease Agreement","Passport Photo","Bank Account"],
    how_to_apply: "Apply at nearest bank branch or through Common Service Centre with land documents.",
    link: "https://pmkisan.gov.in/KCC.aspx",
    special: []
  },
  {
    id: "fasal-bima",
    name: "PM Fasal Bima Yojana",
    ministry: "Ministry of Agriculture",
    type: "Central",
    tag: "Agriculture",
    benefit: "Crop insurance covering losses due to drought, flood, pest attacks. Premium as low as 1.5% for Rabi crops.",
    eligibility: "All farmers growing notified crops in notified areas",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 100,
    occupations: ["Farmer"],
    documents: ["Aadhaar Card","Land Records","Bank Account","Sowing Certificate"],
    how_to_apply: "Enrol through nearest bank, insurance company or CSC before the cut-off date.",
    link: "https://pmfby.gov.in",
    special: []
  },

  // ── EDUCATION ───────────────────────────────────────────────
  {
    id: "nsp-prematric",
    name: "Pre-Matric Scholarship (Minorities)",
    ministry: "Ministry of Minority Affairs",
    type: "Central",
    tag: "Education",
    benefit: "Scholarship ₹1,000–₹10,000 per year for students studying in Classes 1–10",
    eligibility: "Minority community students (Muslim/Christian/Sikh/Buddhist/Parsi/Jain) with family income below ₹1 lakh",
    income_max: "1lakh",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 6, age_max: 18,
    occupations: ["Student"],
    documents: ["Aadhaar Card","Income Certificate","Community Certificate","Previous Marksheet","Bank Account"],
    how_to_apply: "Apply at scholarships.gov.in (National Scholarship Portal). Deadline usually September–October.",
    link: "https://scholarships.gov.in",
    special: []
  },
  {
    id: "nsp-postmatric-sc",
    name: "Post-Matric Scholarship for SC Students",
    ministry: "Ministry of Social Justice",
    type: "Central",
    tag: "Education",
    benefit: "Full tuition fee + maintenance allowance ₹380–₹1,200 per month for Class 11 and above",
    eligibility: "SC students with family income below ₹2.5 lakh, studying post-matric courses",
    income_max: "2.5lakh",
    categories: ["SC"],
    genders: ["Male","Female","Transgender"],
    age_min: 15, age_max: 35,
    occupations: ["Student"],
    documents: ["Aadhaar Card","Caste Certificate","Income Certificate","Previous Marksheet","Bank Account"],
    how_to_apply: "Apply at scholarships.gov.in before the state's deadline.",
    link: "https://scholarships.gov.in",
    special: []
  },
  {
    id: "vidya-lakshmi",
    name: "Vidya Lakshmi Education Loan",
    ministry: "Ministry of Finance",
    type: "Central",
    tag: "Loan",
    benefit: "Education loan up to ₹6.5 lakh (no collateral) or ₹15 lakh+ (with collateral) at subsidised rates",
    eligibility: "Indian students admitted to recognised professional/technical courses in India or abroad",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 16, age_max: 35,
    occupations: ["Student"],
    documents: ["Aadhaar Card","Admission Letter","Marksheets","Co-borrower PAN","Bank Account"],
    how_to_apply: "Single window application at vidyalakshmi.co.in for multiple banks simultaneously.",
    link: "https://www.vidyalakshmi.co.in",
    special: []
  },

  // ── WOMEN ────────────────────────────────────────────────────
  {
    id: "sukanya-samridhi",
    name: "Sukanya Samriddhi Yojana",
    ministry: "Ministry of Finance",
    type: "Central",
    tag: "Women",
    benefit: "8.2% interest p.a. tax-free savings scheme for girl child education and marriage expenses",
    eligibility: "Parents/guardians of girl child below 10 years of age",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Female"],
    age_min: 0, age_max: 10,
    occupations: ["Student","Homemaker","Farmer","Self Employed","Government Employee","Private Employee"],
    documents: ["Girl Child Birth Certificate","Parent Aadhaar","Address Proof"],
    how_to_apply: "Open account at Post Office or authorised bank. Minimum deposit ₹250.",
    link: "https://www.nsiindia.gov.in",
    special: []
  },
  {
    id: "pradhan-mantri-matru-vandana",
    name: "PM Matru Vandana Yojana",
    ministry: "Ministry of Women & Child Development",
    type: "Central",
    tag: "Women",
    benefit: "Cash benefit ₹5,000 for 1st child and ₹6,000 for 2nd child (girl) directly to bank account",
    eligibility: "Pregnant women and lactating mothers for first/second child",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Female"],
    age_min: 19, age_max: 45,
    occupations: ["Homemaker","Farmer","Daily Wage Worker","Self Employed","Unemployed"],
    documents: ["Aadhaar Card","Bank Account","MCP Card (Mother Child Protection)","Pregnancy Certificate"],
    how_to_apply: "Register at nearest Anganwadi Centre or health facility within 150 days of pregnancy.",
    link: "https://pmmvy.wcd.gov.in",
    special: ["Pregnant / Lactating"]
  },

  // ── PENSION ─────────────────────────────────────────────────
  {
    id: "atal-pension",
    name: "Atal Pension Yojana",
    ministry: "Ministry of Finance",
    type: "Central",
    tag: "Finance",
    benefit: "Guaranteed monthly pension ₹1,000–₹5,000 after age 60. Government co-contributes 50% or ₹1,000/year.",
    eligibility: "Age 18–40 years, savings bank account, not covered under statutory social security",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 40,
    occupations: ["Daily Wage Worker","Farmer","Self Employed","Homemaker"],
    documents: ["Aadhaar Card","Savings Bank Account","Mobile Number"],
    how_to_apply: "Enrol through bank branch, mobile banking, or online banking portal.",
    link: "https://npscra.nsdl.co.in",
    special: []
  },
  {
    id: "nsap-ignoaps",
    name: "Indira Gandhi National Old Age Pension",
    ministry: "Ministry of Rural Development",
    type: "Central",
    tag: "Social Welfare",
    benefit: "Monthly pension ₹200 (age 60–79) and ₹500 (age 80+) transferred to bank account",
    eligibility: "BPL senior citizens aged 60 and above",
    income_max: "1lakh",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 60, age_max: 100,
    occupations: ["Senior Citizen","Unemployed","Homemaker"],
    documents: ["Aadhaar Card","Age Proof","BPL Certificate","Bank Account"],
    how_to_apply: "Apply at Gram Panchayat (rural) or Municipal Office (urban).",
    link: "https://nsap.nic.in",
    special: []
  },

  // ── EMPLOYMENT ───────────────────────────────────────────────
  {
    id: "mgnregs",
    name: "MGNREGA – Mahatma Gandhi Rural Employment",
    ministry: "Ministry of Rural Development",
    type: "Central",
    tag: "Employment",
    benefit: "Guaranteed 100 days of wage employment per year at minimum wages (₹230–₹333/day by state)",
    eligibility: "Adult members of rural households willing to do unskilled manual work",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 100,
    occupations: ["Daily Wage Worker","Farmer","Homemaker","Unemployed"],
    documents: ["Aadhaar Card","Job Card (apply at Gram Panchayat)","Bank Account"],
    how_to_apply: "Register at Gram Panchayat to get Job Card. Work demand submitted to GP.",
    link: "https://nrega.nic.in",
    special: []
  },
  {
    id: "pmegp",
    name: "PM Employment Generation Programme",
    ministry: "Ministry of MSME",
    type: "Central",
    tag: "Employment",
    benefit: "25–35% subsidy on project cost up to ₹50 lakh (manufacturing) or ₹20 lakh (service sector)",
    eligibility: "Any individual above 18 years for project cost above ₹10 lakh (manufacturing) or ₹5 lakh (service)",
    income_max: "any",
    categories: ["General","OBC","SC","ST","EWS"],
    genders: ["Male","Female","Transgender"],
    age_min: 18, age_max: 65,
    occupations: ["Self Employed","Unemployed"],
    documents: ["Aadhaar Card","PAN Card","Educational Certificate (8th pass min)","Project Report","Bank Account"],
    how_to_apply: "Apply online at kviconline.gov.in or through KVIC/KVIB/DIC offices.",
    link: "https://www.kviconline.gov.in/pmegpeportal",
    special: []
  }
]

// ── FILTER ENGINE ──────────────────────────────────────────────
export function filterSchemes(profile) {
  const { age, gender, income, category, occupation, state, special = [] } = profile
  const ageNum = parseInt(age) || 30
  const incomeNum = parseIncome(income)

  return SCHEMES.filter(s => {
    // Age check
    if (ageNum < s.age_min || ageNum > s.age_max) return false
    // Gender check
    if (s.genders.length && !s.genders.includes(gender) && !s.genders.includes("Male")) {
      if (!s.genders.includes(gender)) return false
    }
    // Category check
    if (s.categories.length && !s.categories.includes(category) && !s.categories.includes("General")) return false
    // Occupation check
    if (s.occupations.length && !s.occupations.includes(occupation) && !s.occupations.includes("any")) {
      if (!s.occupations.includes(occupation)) return false
    }
    // Income check
    if (s.income_max !== "any") {
      const maxIncome = parseIncome(s.income_max)
      if (incomeNum > maxIncome) return false
    }
    return true
  })
}

function parseIncome(income) {
  if (!income || income === "any") return Infinity
  const map = {
    "Below ₹1 Lakh": 100000,
    "₹1–3 Lakh": 300000,
    "₹3–6 Lakh": 600000,
    "₹6–10 Lakh": 1000000,
    "Above ₹10 Lakh": 9999999,
    "1lakh": 100000,
    "2.5lakh": 250000,
    "3lakh": 300000,
    "6lakh": 600000,
    "18lakh": 1800000
  }
  return map[income] || Infinity
}
