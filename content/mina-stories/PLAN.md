# MiNa Family Dentistry — Campaign #3 Content Plan
### Published as "Stories" on Joy of Dentistry (jodmagazine.com/en/stories)

**Client:** MiNa Family Dentistry — 7191 Yonge St, Unit 205, Thornhill, ON L3T 0C4 · (289) 597-7191 · https://www.minafamilydentistry.com/
**Providers:** Dr. Mehdi Adibrad (RCDSO-registered periodontics/implant specialist, MSc) · Dr. Neda Kadivar (General & Family Dentist)
**Publisher/network:** Joy of Dentistry (JoD) — independent bilingual dental lifestyle magazine. Third network, separate from CanaDent `/articles` (Campaign #1) and ConfiDentist `/blog` (Campaign #2).

---

## 0. HOW THIS CAMPAIGN STAYS DIFFERENT (anti-duplication guardrail)

Campaigns #1 (CanaDent, 50) and #2 (ConfiDentist, 50) already own:
- Every standard service explainer (implants, Invisalign, veneers, crowns, root canals, dentures, cleanings, emergencies, pediatric, whitening).
- Many "deep" angles this brief suggested as examples — **already taken, so NOT used here:** how tartar forms / why brushing can't remove it, why gums bleed when brushing, returning to the dentist after years away, why exams matter when nothing hurts, bone grafting for implants, implant candidacy-as-procedure, CDCP explained, CDCP vs. private insurance, dental costs in Canada, choosing a family dentist in Thornhill, dentist near Yonge Street, first visit to a new office, dental anxiety basics, oral health during pregnancy, dry mouth, bruxism/night guards, TMJ, seniors' dental care overview, sealants, baby teeth matter, are X-rays safe.

**Campaign #3 therefore uses only angles absent from both prior sets:** appointment logistics & records, misconception-correction on everyday behaviours, dental *technology*, oral-health-and-lifestyle crossovers, under-served life stages (university students, busy professionals, menopause, caregivers, root decay in older adults), *decision* framing (save vs. replace, second opinions, specialist referral), GTA community logistics, and Canadian coverage *literacy* (reading estimates, workplace benefits, price variation, CDCP appointment-prep). Every title below was checked against the 100 prior titles.

---

## 1. PUBLISHING MECHANICS (proposed — confirm)

1. Each article = one row in JoD `public.articles` (`slug`, `title_en`, `excerpt_en`, `body_en`, `author`, `category`, `reading_minutes`, `cover_*`, `status='published'`, `published_at`). Live at `/en/stories/<slug>`.
2. **Renderer upgrade:** `app/[locale]/(site)/stories/[slug]/page.tsx` currently prints the body as plain text (`whitespace-pre-line`). I will switch the body to render sanitized HTML (so contextual `<a>` links, `<h2>`, `<ul>`, FAQ markup work) — the same approach used on CanaDent. Small, isolated change.
3. **Author/persona** is a single text field; I vary it per persona (e.g. "Joy of Dentistry Health Desk", "JoD Family & Parenting", "JoD Community Desk", "JoD Money & Benefits", "JoD Later Life") plus a reviewer line in-body where a clinical claim warrants it. No invented individual bylines or credentials.
4. **Language:** English bodies now (`body_en`); `body_fa` left null (falls back to EN) — Farsi translation is an optional later phase.
5. **Seeding:** HTML sources saved under `content/mina-stories/articles/<slug>.html` + a `seed-stories.mjs` script inserting via the service-role key (secrets in `~/.jod_sb_token`). Build/lint verified before anything goes live.

---

## 2. SEARCH-INTENT DISTRIBUTION (actual)

| Intent | Target | This plan |
|---|---|---|
| Informational | ~55% | 28 (56%) |
| Commercial investigation | ~15% | 7 (14%) |
| Local intent | ~10% | 5 (10%) |
| Comparison / decision | ~10% | 5 (10%) |
| Question / problem-solving | ~10% | 5 (10%) |

---

# SECTION A — 50-ARTICLE STRATEGY

> Pillars: **P1** Questions-before-booking · **P2** Myths · **P3** Technology · **P4** Lifestyle · **P5** Life-stage · **P6** Decision guides · **P7** Thornhill/GTA · **P8** Canadian coverage.
> MiNa pages are real paths confirmed from the live sitemap.

| # | Article Title | Primary Keyword | Intent | Pillar | Target Audience | MiNa Page | Suggested Anchor | Partner Persona |
|---|---|---|---|---|---|---|---|---|
| 1 | What to Bring to Your First Appointment at a New Dental Office | what to bring to a dentist appointment | Problem-solving | P1 | New/relocating patients | /about-us/ | a new patient visit | Canadian consumer |
| 2 | Why Your Dentist Asks About Your Medications and Health Conditions | why dentists ask about medications | Informational | P1 | Adults on medication | /services/ | a thorough dental assessment | Health |
| 3 | Questions Worth Asking During a Dental Consultation | questions to ask at a dental consultation | Comm-investigation | P1 | Pre-treatment patients | /appointment-request/ | book a consultation | Canadian consumer |
| 4 | What to Tell a New Dentist About Dental Work Done Abroad | dental work done in another country | Informational | P1 | Newcomers, travellers | /about-us/ | a Thornhill dental team | Local/community |
| 5 | How to Transfer Your Dental Records When You Switch Clinics | transfer dental records | Informational | P1 | Patients changing clinics | /contact/ | contact a dental office | Canadian consumer |
| 6 | Day-of Questions: Eating, Driving, and What to Expect Before an Appointment | before a dental appointment | Problem-solving | P1 | Nervous/first-time patients | /faq/ | common patient questions | Lifestyle |
| 7 | How Dental Recalls and Reminders Actually Work | dental recall appointment | Informational | P1 | Busy adults, lapsed patients | /services/cleanings-and-prevention/ | regular preventive visits | Health |
| 8 | Bringing the Whole Family to One Dental Office: What to Ask First | family dental office | Informational | P1 | Parents, caregivers | /services/family-dentistry/ | general and family dentistry | Parenting |
| 9 | Does Brushing Harder Actually Clean Your Teeth Better? | does brushing harder clean teeth | Informational | P2 | General adults | /services/periodontics/gum-disease-treatment/ | gum and enamel damage | Health |
| 10 | Can a Cavity Reverse Itself? Early Decay vs. a Real Hole | can a cavity heal itself | Problem-solving | P2 | Health-curious adults | /services/restorations/fillings/ | treating tooth decay | Health |
| 11 | Why the Timing of Snacks Matters More Than the Amount of Sugar | sugar and cavities timing | Informational | P2 | Parents, snackers | /services/cleanings-and-prevention/ | preventive dental care | Parenting |
| 12 | Is Charcoal Toothpaste a Safe Way to Whiten Teeth? | charcoal toothpaste safe | Informational | P2 | Trend-aware consumers | /services/cosmetic-dentistry/teeth-whitening/ | professional whitening | Lifestyle |
| 13 | Does Mouthwash Do the Same Job as Flossing? | mouthwash vs flossing | Comparison/decision | P2 | General adults | /services/cleanings-and-prevention/ | a hygiene visit | Health |
| 14 | Do Fillings and Crowns Need Replacing on a Schedule? | how long do fillings last | Informational | P2 | Patients with restorations | /services/restorations/ | restorative dentistry | Health |
| 15 | Intraoral Scanners: Why Digital Impressions Replaced the Goopy Mould | intraoral scanner digital impressions | Comm-investigation | P3 | Tech-curious patients | /services/invisalign/ | clear aligner treatment | Health |
| 16 | Cone-Beam 3D Imaging: What a Regular X-Ray Can't Show | cone beam CT dental | Comm-investigation | P3 | Implant/complex-case patients | /implant/dental-implants/ | dental implant planning | Health |
| 17 | What "Fully Guided" Dental Implant Placement Actually Means | fully guided implant placement | Comm-investigation | P3 | Implant researchers | /implant/dental-implants/ | guided implant placement | Health |
| 18 | Digital Smile Design: Previewing a Smile Before Treatment Begins | digital smile design | Comm-investigation | P3 | Cosmetic prospects | /services/cosmetic-dentistry/smile-makeover/ | planning a smile makeover | Lifestyle |
| 19 | How Modern Dental Tools Make Appointments More Comfortable | comfortable modern dentistry | Informational | P3 | Anxious/comfort-seeking patients | /services/ | modern dental care | Lifestyle |
| 20 | Digital vs. Film Dental X-Rays: What the Switch Means for Patients | digital dental x-rays | Comparison/decision | P3 | Cautious patients | /services/family-dentistry/dental-exams-xrays/ | dental exams and X-rays | Health |
| 21 | Coffee, Tea, and Wine: How Everyday Drinks Stain and Wear Teeth | drinks that stain teeth | Informational | P4 | Coffee/wine drinkers | /services/cosmetic-dentistry/teeth-whitening/ | teeth whitening options | Lifestyle |
| 22 | How Stress Shows Up in Your Mouth — From Clenching to Canker Sores | stress and oral health | Informational | P4 | Stressed professionals | /services/ | talk to your dentist | Business |
| 23 | Hydration, Saliva, and Why Water Protects Your Teeth | saliva and oral health | Informational | P4 | General wellness readers | /services/cleanings-and-prevention/ | preventive care | Health |
| 24 | Mouth Breathing and Snoring: What They Can Signal for Oral Health | mouth breathing oral health | Problem-solving | P4 | Snorers, parents | /services/ | a dental evaluation | Health |
| 25 | Smoking, Vaping, and Cannabis: Effects on Gums and Healing | vaping and gum health | Informational | P4 | Smokers/vapers | /services/periodontics/ | gum health care | Health |
| 26 | Habits That Quietly Wear Down Teeth: Ice, Nails, Pens, and More | habits that damage teeth | Informational | P4 | General adults | /services/restorations/ | repair worn or chipped teeth | Lifestyle |
| 27 | Shift Work and Late Nights: Protecting Teeth on an Odd Schedule | shift work oral health | Informational | P4 | Shift workers, nurses | /services/cleanings-and-prevention/ | routine dental care | Business |
| 28 | When Children Start Losing Baby Teeth: A Parent's Timeline | when do kids lose baby teeth | Informational | P5 | Parents of young kids | /services/family-dentistry/pediatric-dentistry/ | children's dentistry | Parenting |
| 29 | Why Teenagers Get Cavities Even When They Brush | teenagers and cavities | Informational | P5 | Parents of teens | /services/family-dentistry/ | family dental care | Parenting |
| 30 | Dental Care During the University and College Years | dental care for students | Informational | P5 | Students, parents | /services/cleanings-and-prevention/ | a dental checkup | Canadian consumer |
| 31 | Fitting Dental Care Into a Busy Professional's Schedule | dental care busy schedule | Informational | P5 | Working professionals | /appointment-request/ | request an appointment | Business |
| 32 | Why Older Adults Face More Root Cavities — and How to Prevent Them | root cavities in older adults | Problem-solving | P5 | Seniors, caregivers | /services/periodontics/ | periodontal and gum care | Senior-focused |
| 33 | Helping an Aging Parent Keep Up With Daily Oral Care | oral care for elderly parent | Informational | P5 | Caregivers | /services/family-dentistry/ | family dentistry | Senior-focused |
| 34 | Menopause and Oral Health: Changes Worth Knowing About | menopause and oral health | Informational | P5 | Women 45+ | /services/periodontics/ | gum health | Women's lifestyle |
| 35 | Can This Tooth Be Saved? What Dentists Weigh Before Removal | can a tooth be saved | Comparison/decision | P6 | Patients facing extraction | /services/restorations/ | restorative options | Health |
| 36 | What Makes Someone a Good Candidate for Dental Implants? | dental implant candidate | Comm-investigation | P6 | Tooth-loss patients | /implant/dental-implants/ | dental implants | Health |
| 37 | Root Canal or Implant? Saving vs. Replacing a Tooth | root canal vs implant | Comparison/decision | P6 | Patients with a failing tooth | /services/endodontics/root-canal-therapy/ | root canal therapy | Health |
| 38 | When Is Getting a Second Dental Opinion Worthwhile? | second opinion dentist | Informational | P6 | Patients facing big treatment | /about-us/dr-mehdi-adibrad/ | a periodontics specialist | Canadian consumer |
| 39 | When Might You Be Referred to a Dental Specialist? | dental specialist referral | Informational | P6 | General patients | /about-us/ | the clinical team at MiNa | Health |
| 40 | Closing a Gap in Your Smile: The Options a Dentist Will Consider | fix a gap in teeth | Comparison/decision | P6 | Adults with spacing | /services/cosmetic-dentistry/ | cosmetic dentistry options | Lifestyle |
| 41 | Newcomers to the GTA: Understanding How Dental Care Works in Ontario | dental care for newcomers Ontario | Local | P7 | New immigrants | /contact/ | a local dental office | Local/community |
| 42 | Scheduling Dental Visits Around School and Work in York Region | family dentist York Region | Local | P7 | York Region families | /appointment-request/ | book a family visit | Local/community |
| 43 | What to Check When Choosing a Clinic Near Yonge and Steeles | dental clinic Yonge and Steeles | Local | P7 | Thornhill/RH residents | /affordable-dentist-thornhill/ | a dental clinic in Thornhill | Local/community |
| 44 | Dental Care for Multilingual Families in Thornhill | multilingual dental care Thornhill | Local | P7 | Immigrant families | /about-us/ | a Thornhill family practice | Local/community |
| 45 | Seasonal Oral Health in the GTA: Winter Sensitivity to Summer Sports | seasonal oral health | Local | P7 | GTA families | /services/ | general dental services | Local/community |
| 46 | How to Read a Dental Treatment Estimate in Ontario | dental treatment estimate | Informational | P8 | Cost-conscious patients | /contact/ | ask the dental office | Canadian consumer |
| 47 | The Canadian Dental Care Plan in 2026: What to Confirm Before You Book | CDCP 2026 | Comm-investigation | P8 | CDCP-eligible patients | /contact/ | contact the clinic | Canadian consumer |
| 48 | Questions to Ask About Coverage Before Starting Treatment | dental coverage questions | Informational | P8 | Insured & uninsured | /faq/ | billing and coverage questions | Canadian consumer |
| 49 | Understanding Workplace Dental Benefits: Maximums, Limits, Pre-Approvals | workplace dental benefits | Informational | P8 | Employed adults | /services/ | planning your treatment | Business |
| 50 | Why Two Clinics Can Quote Different Prices for the Same Treatment | why dental prices vary | Informational | P8 | Price-comparing patients | /about-us/ | the team at MiNa Family Dentistry | Canadian consumer |

**Pillar counts:** P1=8, P2=6, P3=6, P4=7, P5=7, P6=6, P7=5, P8=5 → **50**.

---

# SECTION B — KEYWORD MAP

> Per article: **Primary** · **Secondary (3–8)** · **Entities** · **Intent** · **Local modifiers** · **Related questions**. Local modifiers are applied only where credible (Pillars 7/8 and a few P1 pieces); clinical pieces stay largely location-neutral by design.

**1 — What to Bring to Your First Appointment**
Primary: what to bring to a dentist appointment · Secondary: new patient dental forms, dental insurance card, list of medications, previous dental records, photo ID, health card · Entities: dental office, medical history · Intent: Problem-solving · Local: Thornhill (light) · Q: Do I need my health card at the dentist? What documents does a new dentist need?

**2 — Why Dentists Ask About Medications/Health**
Primary: why dentists ask about medications · Secondary: blood thinners and dental work, medical history form, diabetes and dental care, medication dry mouth, drug interactions dentistry · Entities: medical history, anticoagulants · Intent: Informational · Q: Why does the dentist need my medication list? Do medications affect dental treatment?

**3 — Questions to Ask at a Consultation**
Primary: questions to ask at a dental consultation · Secondary: dental treatment plan questions, second opinion, treatment alternatives, dental cost estimate, consent · Entities: treatment plan, informed consent · Intent: Commercial investigation · Q: What should I ask before agreeing to dental treatment?

**4 — Dental Work Done Abroad**
Primary: dental work done in another country · Secondary: dental tourism follow-up, transferring dental care to Canada, foreign dental records, replacing overseas crowns · Entities: dental tourism, RCDSO · Intent: Informational · Local: GTA, Thornhill · Q: What should I tell a Canadian dentist about work done overseas?

**5 — Transfer Dental Records**
Primary: transfer dental records · Secondary: request dental X-rays from old dentist, dental record release form, switching dentists records, PHIPA dental records · Entities: PHIPA (Ontario), dental records · Intent: Informational · Q: How do I get my X-rays from a previous dentist?

**6 — Day-of Questions**
Primary: before a dental appointment · Secondary: can you eat before a dentist appointment, drive after dental freezing, how long does a checkup take, dental appointment nervous · Entities: local anesthetic/freezing · Intent: Problem-solving · Q: Should I eat before the dentist? Can I drive after freezing?

**7 — Dental Recalls & Reminders**
Primary: dental recall appointment · Secondary: how often dental checkup, recall interval, hygiene recall, overdue dental visit, preventive schedule · Entities: recall system, preventive dentistry · Intent: Informational · Q: Why does my dentist keep sending reminders? What is a dental recall?

**8 — Whole Family, One Office**
Primary: family dental office · Secondary: family dentist all ages, treating kids and adults, one dentist for the family, pediatric and adult dentistry · Entities: family dentistry · Intent: Informational · Local: Thornhill · Q: Can the whole family see the same dentist?

**9 — Does Brushing Harder Clean Better?**
Primary: does brushing harder clean teeth · Secondary: toothbrush abrasion, gum recession from brushing, soft bristle toothbrush, enamel wear, correct brushing pressure · Entities: enamel, gingival recession · Intent: Informational · Q: Is hard brushing bad for teeth? Does pressure matter when brushing?

**10 — Can a Cavity Reverse Itself?**
Primary: can a cavity heal itself · Secondary: remineralization, early tooth decay, white spot lesion, fluoride remineralize, when a cavity needs a filling · Entities: remineralization, fluoride, enamel · Intent: Problem-solving · Q: Can early cavities heal? When is a filling unavoidable?

**11 — Snack Timing vs. Sugar Amount**
Primary: sugar and cavities timing · Secondary: frequency of snacking teeth, acid attack teeth, grazing and tooth decay, kids snacking cavities · Entities: oral bacteria, pH/acid attack · Intent: Informational · Q: Is snacking all day worse than one dessert? Why does snack frequency matter?

**12 — Charcoal Toothpaste**
Primary: charcoal toothpaste safe · Secondary: charcoal whitening abrasive, activated charcoal teeth, enamel abrasion whitening, ADA charcoal, natural whitening myths · Entities: enamel, RDA abrasivity · Intent: Informational · Q: Does charcoal toothpaste whiten teeth? Is charcoal bad for enamel?

**13 — Mouthwash vs. Flossing**
Primary: mouthwash vs flossing · Secondary: does mouthwash replace floss, interdental cleaning, plaque between teeth, antiseptic rinse limits · Entities: interdental plaque, biofilm · Intent: Comparison/decision · Q: Can mouthwash replace flossing? Does rinsing clean between teeth?

**14 — Do Fillings/Crowns Need Replacing?**
Primary: how long do fillings last · Secondary: when to replace a filling, crown lifespan, failing filling signs, recurrent decay, restoration maintenance · Entities: dental restorations · Intent: Informational · Q: Do fillings expire? How long do crowns last?

**15 — Intraoral Scanners**
Primary: intraoral scanner digital impressions · Secondary: digital dental impressions, no more impression goop, Invisalign scan, same-day digital workflow, iTero-type scanner · Entities: digital impressions, clear aligners · Intent: Commercial investigation · Q: What is a digital dental impression? Do dentists still use moulds?

**16 — Cone-Beam 3D Imaging**
Primary: cone beam CT dental · Secondary: CBCT implant planning, 3D dental scan, dental imaging for implants, panoramic vs CBCT · Entities: CBCT, dental implants · Intent: Commercial investigation · Q: What is a cone-beam scan? Why do implants need 3D imaging?

**17 — Fully Guided Implant Placement**
Primary: fully guided implant placement · Secondary: guided implant surgery, surgical guide implant, computer-planned implant, implant accuracy · Entities: dental implants, surgical guide, Dr. Mehdi Adibrad (periodontist) · Intent: Commercial investigation · Q: What does guided implant surgery mean?

**18 — Digital Smile Design**
Primary: digital smile design · Secondary: smile preview before treatment, mock-up veneers, cosmetic treatment planning, digital smile simulation · Entities: smile makeover, cosmetic dentistry · Intent: Commercial investigation · Q: Can I see my smile before treatment? What is a digital smile preview?

**19 — Comfortable Modern Dentistry**
Primary: comfortable modern dentistry · Secondary: painless dental technology (careful framing), quieter dental tools, dental lasers comfort, anxiety-friendly dentistry, numbing technology · Entities: dental technology · Intent: Informational · Q: How has dental technology improved comfort?

**20 — Digital vs. Film X-Rays**
Primary: digital dental x-rays · Secondary: digital radiography radiation, film vs digital dental, X-ray safety, how often dental X-rays · Entities: digital radiography, ALARA · Intent: Comparison/decision · Q: Are digital X-rays lower radiation? Why did dentists switch from film?

**21 — Drinks That Stain**
Primary: drinks that stain teeth · Secondary: coffee stains teeth, red wine teeth, tea staining, acidic drinks enamel, prevent drink stains · Entities: enamel erosion, extrinsic stain · Intent: Informational · Q: Does coffee stain teeth? How do I drink coffee without staining?

**22 — Stress and the Mouth**
Primary: stress and oral health · Secondary: clenching jaw stress, canker sores stress, grinding teeth anxiety, gum health stress, burning mouth · Entities: bruxism, aphthous ulcers · Intent: Informational · Q: Can stress cause mouth problems? Does anxiety affect teeth?

**23 — Hydration & Saliva**
Primary: saliva and oral health · Secondary: dry mouth dehydration, water for teeth, saliva protects enamel, xerostomia hydration, best drink for teeth · Entities: saliva, enamel · Intent: Informational · Q: Why is saliva important? Does drinking water help teeth?

**24 — Mouth Breathing & Snoring**
Primary: mouth breathing oral health · Secondary: dry mouth snoring, mouth breathing cavities, sleep and teeth, children mouth breathing, airway dentistry · Entities: airway, saliva · Intent: Problem-solving · Q: Is mouth breathing bad for teeth? Can snoring dry out your mouth?

**25 — Smoking/Vaping/Cannabis**
Primary: vaping and gum health · Secondary: smoking gum disease, cannabis oral health, nicotine healing dental, vaping dry mouth, smoking implant healing · Entities: periodontitis, wound healing · Intent: Informational · Q: Does vaping harm gums? How does smoking affect dental healing?

**26 — Habits That Wear Teeth**
Primary: habits that damage teeth · Secondary: chewing ice teeth, nail biting teeth, using teeth as tools, pen chewing, chipped tooth habit · Entities: enamel, tooth fracture · Intent: Informational · Q: Is chewing ice bad for teeth? What everyday habits damage teeth?

**27 — Shift Work & Oral Health**
Primary: shift work oral health · Secondary: night shift snacking teeth, energy drinks teeth, irregular brushing schedule, dry mouth shift work · Entities: circadian routine, saliva · Intent: Informational · Q: How does shift work affect oral health?

**28 — Losing Baby Teeth Timeline**
Primary: when do kids lose baby teeth · Secondary: order baby teeth fall out, loose tooth child, permanent teeth eruption, shark teeth double row, when to worry loose tooth · Entities: primary dentition, pediatric dentistry · Intent: Informational · Q: What age do kids lose teeth? What order do baby teeth fall out?

**29 — Teens and Cavities**
Primary: teenagers and cavities · Secondary: teen diet cavities, braces and decay, sports drinks teens, teenager brushing, hidden teen cavities · Entities: adolescent dentition · Intent: Informational · Q: Why do teens get cavities despite brushing?

**30 — Students' Dental Care**
Primary: dental care for students · Secondary: student dental insurance Canada, university health plan dental, dentist away from home, budget dental care student · Entities: student health plan, CDCP (eligibility note) · Intent: Informational · Local: GTA campuses · Q: Does student insurance cover the dentist? How do students find a dentist?

**31 — Busy Professionals**
Primary: dental care busy schedule · Secondary: early morning dentist, lunchtime dental appointment, skipping dental checkups busy, efficient oral care routine · Entities: preventive dentistry · Intent: Informational · Q: How do busy people keep up with dental care?

**32 — Root Cavities in Older Adults**
Primary: root cavities in older adults · Secondary: root caries, gum recession decay, dry mouth medication cavities, senior tooth decay, exposed root sensitivity · Entities: root caries, gingival recession, xerostomia · Intent: Problem-solving · Q: Why do older adults get cavities on roots?

**33 — Caregiving Oral Care**
Primary: oral care for elderly parent · Secondary: brushing help dementia, denture care senior, caregiver oral hygiene, mobility dental care, dry mouth elderly · Entities: caregiving, dentures · Intent: Informational · Q: How do I help a parent brush? Oral care for someone with dementia?

**34 — Menopause & Oral Health**
Primary: menopause and oral health · Secondary: hormones and gums, dry mouth menopause, burning mouth syndrome, bone density and teeth, estrogen gum health · Entities: estrogen, periodontal health, bone density · Intent: Informational · Q: Does menopause affect gums? Why is my mouth dry during menopause?

**35 — Can This Tooth Be Saved?**
Primary: can a tooth be saved · Secondary: save vs extract tooth, cracked tooth prognosis, deep cavity options, tooth restorability, when extraction is necessary · Entities: tooth prognosis, restorations · Intent: Comparison/decision · Q: When can't a tooth be saved?

**36 — Implant Candidacy**
Primary: dental implant candidate · Secondary: bone density implants, smoking and implants, diabetes dental implants, gum health implants, age and implants · Entities: dental implants, osseointegration, bone density · Intent: Commercial investigation · Q: Who is a good candidate for implants? What disqualifies you from implants?

**37 — Root Canal vs. Implant**
Primary: root canal vs implant · Secondary: save tooth or extract, root canal success, implant vs natural tooth, cost root canal vs implant (no invented figures), failing tooth options · Entities: endodontics, dental implants · Intent: Comparison/decision · Q: Is it better to save a tooth or get an implant?

**38 — Second Opinion**
Primary: second opinion dentist · Secondary: dental second opinion Ontario, disagree with treatment plan, big dental treatment decision, getting another dental assessment · Entities: informed consent, specialist · Intent: Informational · Q: When should I get a second dental opinion? Is it rude to ask?

**39 — Specialist Referral**
Primary: dental specialist referral · Secondary: periodontist referral, endodontist, oral surgeon referral, when GP refers dentist, dental specialties explained · Entities: periodontist, endodontist, oral surgeon, RCDSO · Intent: Informational · Q: Why would a dentist refer me to a specialist?

**40 — Closing a Gap**
Primary: fix a gap in teeth · Secondary: diastema treatment, bonding for gap, veneers gap, Invisalign gap, close space between teeth options · Entities: diastema, cosmetic dentistry, orthodontics · Intent: Comparison/decision · Q: What are the options to close a gap in teeth?

**41 — Newcomers to Ontario**
Primary: dental care for newcomers Ontario · Secondary: immigrants dental Canada, no dental insurance newcomer, how dentists work Canada, finding a dentist new to Canada, CDCP newcomers (eligibility) · Entities: Ontario, CDCP, GTA · Intent: Local · Local: Ontario, GTA, Thornhill · Q: How does dental care work for newcomers to Canada?

**42 — York Region Scheduling**
Primary: family dentist York Region · Secondary: after school dental appointment, Saturday dentist Thornhill, dentist near me York Region, booking family dental visits · Entities: York Region, Thornhill, Vaughan, Richmond Hill · Intent: Local · Local: York Region · Q: How do busy families schedule dental visits?

**43 — Yonge & Steeles Clinic Checklist**
Primary: dental clinic Yonge and Steeles · Secondary: dentist Thornhill parking, accessible dental office, dentist near Yonge Steeles, dental clinic transit TTC YRT · Entities: Yonge Street, Steeles Avenue, Thornhill, North York · Intent: Local · Local: Yonge & Steeles, Thornhill · Q: What should I look for in a nearby dental clinic?

**44 — Multilingual Families**
Primary: multilingual dental care Thornhill · Secondary: Persian speaking dentist Thornhill, dentist who speaks my language, kids translating medical, culturally aware dental care · Entities: Thornhill, multicultural GTA · Intent: Local · Local: Thornhill, GTA · Q: Can I find a dentist who speaks my language?

**45 — Seasonal Oral Health GTA**
Primary: seasonal oral health · Secondary: cold weather tooth sensitivity, summer sports mouthguard, holiday sweets teeth, winter dry mouth heating, back to school dental · Entities: GTA seasons · Intent: Local · Local: GTA · Q: Does cold weather affect teeth? Seasonal dental tips?

**46 — Reading a Treatment Estimate**
Primary: dental treatment estimate · Secondary: Ontario dental fee guide, dental procedure codes, dental quote explained, pre-treatment estimate, dental billing codes · Entities: Ontario Dental Association fee guide, dental procedure codes · Intent: Informational · Local: Ontario · Q: How do I read a dental estimate? What are dental codes?

**47 — CDCP in 2026**
Primary: CDCP 2026 · Secondary: Canadian Dental Care Plan eligibility 2026, CDCP what to confirm, does my dentist accept CDCP, CDCP co-payment, Sun Life CDCP · Entities: Canadian Dental Care Plan, Government of Canada, Sun Life · Intent: Commercial investigation · Local: Canada/Ontario · Q: Who qualifies for CDCP in 2026? What to confirm before booking?

**48 — Coverage Questions**
Primary: dental coverage questions · Secondary: what to ask about dental insurance, dental pre-authorization, assignment of benefits, annual maximum, out-of-pocket dental · Entities: dental benefits, pre-authorization · Intent: Informational · Q: What should I ask about dental coverage before treatment?

**49 — Workplace Dental Benefits**
Primary: workplace dental benefits · Secondary: dental annual maximum, recall frequency insurance, dental pre-approval, coordination of benefits, employer dental plan · Entities: group benefits, annual maximum · Intent: Informational · Q: What does my work dental plan actually cover?

**50 — Why Prices Vary**
Primary: why dental prices vary · Secondary: dental fee differences, suggested fee guide, materials and dental cost, specialist vs general fees, dental quote comparison · Entities: Ontario fee guide, dental materials · Intent: Informational · Local: Ontario · Q: Why is one dentist more expensive than another?

---

# SECTION C — LINK STRATEGY

**Principles.** One primary contextual MiNa link per article; a second only where genuinely useful (≤12 articles). Anchor text is varied — no exact-match commercial phrase ("best dentist in Thornhill", "dentist in Thornhill") is ever used as an anchor. Every article delivers full value even if the MiNa link is removed. Brand-mention mix follows the four types below.

**Brand-mention mix across 50:** Type A (no brand name, contextual link only) ≈ 18 · Type B (one natural MiNa mention) ≈ 18 · Type C (brief "where to learn more") ≈ 9 · Type D (local example featuring MiNa) ≈ 5.

**Anchor-type mix (target):** topical/descriptive ≈ 60% · partial-match ≈ 15% · branded/entity ≈ 12% · generic ("learn more", "a dental office") ≈ 8% · bare-URL/navigational ≈ 5%.

| # | Destination MiNa URL | Recommended Anchor | Anchor Type | Why the link fits | Brand mention |
|---|---|---|---|---|---|
| 1 | /about-us/ | a new patient visit | partial-match | Article is about preparing for a first visit | B |
| 2 | /services/ | a thorough dental assessment | topical | Medical history is part of the exam | A |
| 3 | /appointment-request/ | book a consultation | generic/navigational | Readers ready to ask questions in person | B |
| 4 | /about-us/ | a Thornhill dental team | branded/entity | Newcomers need a local practice to transfer care to | D |
| 5 | /contact/ | contact a dental office | generic | Records request routed through the office | A |
| 6 | /faq/ | common patient questions | topical | Mirrors the day-of FAQ theme | A |
| 7 | /services/cleanings-and-prevention/ | regular preventive visits | topical | Recalls = preventive schedule | B |
| 8 | /services/family-dentistry/ | general and family dentistry | partial-match | One office for all ages | B |
| 9 | /services/periodontics/gum-disease-treatment/ | gum and enamel damage | topical | Over-brushing → recession | A |
| 10 | /services/restorations/fillings/ | treating tooth decay | topical | When remineralization isn't enough | A |
| 11 | /services/cleanings-and-prevention/ | preventive dental care | topical | Decay prevention | A |
| 12 | /services/cosmetic-dentistry/teeth-whitening/ | professional whitening | partial-match | Safe alternative to charcoal | B |
| 13 | /services/cleanings-and-prevention/ | a hygiene visit | topical | Interdental cleaning + hygiene | A |
| 14 | /services/restorations/ | restorative dentistry | topical | Restoration longevity | A |
| 15 | /services/invisalign/ | clear aligner treatment | partial-match | Scanners used for aligners | B |
| 16 | /implant/dental-implants/ | dental implant planning | topical | CBCT used for implant planning | B |
| 17 | /implant/dental-implants/ | guided implant placement | branded/entity | MiNa offers fully-guided placement (confirmed) | B |
| 18 | /services/cosmetic-dentistry/smile-makeover/ | planning a smile makeover | partial-match | DSD → makeover planning | B |
| 19 | /services/ | modern dental care | generic | Comfort-focused services overview | A |
| 20 | /services/family-dentistry/dental-exams-xrays/ | dental exams and X-rays | topical | Digital X-rays in routine exams | B |
| 21 | /services/cosmetic-dentistry/teeth-whitening/ | teeth whitening options | partial-match | Stain removal | B |
| 22 | /services/ | talk to your dentist | generic | Stress symptoms warrant a visit | A |
| 23 | /services/cleanings-and-prevention/ | preventive care | topical | Saliva & prevention | A |
| 24 | /services/ | a dental evaluation | generic | Mouth breathing → evaluation | A |
| 25 | /services/periodontics/ | gum health care | topical | Smoking/vaping → perio | B |
| 26 | /services/restorations/ | repair worn or chipped teeth | topical | Habit damage → restorations | A |
| 27 | /services/cleanings-and-prevention/ | routine dental care | topical | Keeping up on odd schedules | A |
| 28 | /services/family-dentistry/pediatric-dentistry/ | children's dentistry | partial-match | Baby-tooth timeline | B |
| 29 | /services/family-dentistry/ | family dental care | partial-match | Teen cavity prevention | B |
| 30 | /services/cleanings-and-prevention/ | a dental checkup | topical | Students keeping up on checkups | A |
| 31 | /appointment-request/ | request an appointment | navigational | Busy professionals booking | B |
| 32 | /services/periodontics/ | periodontal and gum care | topical | Recession → root decay | B |
| 33 | /services/family-dentistry/ | family dentistry | branded/entity | Multi-generational care | B |
| 34 | /services/periodontics/ | gum health | topical | Hormonal gum changes | A |
| 35 | /services/restorations/ | restorative options | topical | Save-the-tooth options | B |
| 36 | /implant/dental-implants/ | dental implants | partial-match | Candidacy factors | B |
| 37 | /services/endodontics/root-canal-therapy/ | root canal therapy | partial-match | Save vs. replace | B |
| 38 | /about-us/dr-mehdi-adibrad/ | a periodontics specialist | branded/entity | Second opinion from a specialist | D |
| 39 | /about-us/ | the clinical team at MiNa | branded/entity | Referral pathways | D |
| 40 | /services/cosmetic-dentistry/ | cosmetic dentistry options | partial-match | Gap-closing options | B |
| 41 | /contact/ | a local dental office | generic | Newcomers finding care | A |
| 42 | /appointment-request/ | book a family visit | navigational | Family scheduling | B |
| 43 | /affordable-dentist-thornhill/ | a dental clinic in Thornhill | branded/entity | Local clinic checklist | D |
| 44 | /about-us/ | a Thornhill family practice | branded/entity | Multilingual local care | D |
| 45 | /services/ | general dental services | generic | Seasonal care | A |
| 46 | /contact/ | ask the dental office | generic | Estimate questions | A |
| 47 | /contact/ | contact the clinic | generic | Confirm CDCP participation | B |
| 48 | /faq/ | billing and coverage questions | topical | Coverage Q&A | A |
| 49 | /services/ | planning your treatment | topical | Benefits & treatment planning | B |
| 50 | /about-us/ | the team at MiNa Family Dentistry | branded | Transparent-pricing trust | B |

**Second (optional) links** — only where genuinely useful: #16→/services/dental-implants/cost/ ("implant cost factors"); #17→/500-off-dental-implants-fully-guided/ (promo, only if editorially natural); #37→/implant/dental-implants/; #40→/services/cosmetic-dentistry/dental-bonding/; #47→Government of Canada CDCP page (external authority, not MiNa).

---

## SECTION D — status
To be written on approval: all 50 full articles (1,000–1,600 words), varied personas, FAQ + Sources where appropriate, saved to `content/mina-stories/articles/<slug>.html`, then seeded as published JoD Stories after the renderer upgrade and a build/lint pass.

## Key sources to be cited in-body (verified, real)
- Government of Canada — Canadian Dental Care Plan: https://www.canada.ca/en/services/benefits/dental/dental-care-plan.html (+ /qualify.html)
- Canadian Dental Association (cda-adc.ca), Ontario Dental Association (oda.ca), Royal College of Dental Surgeons of Ontario (rcdso.org)
- Each clinical article cites only sources that support its specific claims; no fabricated studies or statistics; no invented prices, co-pays, or success rates.
