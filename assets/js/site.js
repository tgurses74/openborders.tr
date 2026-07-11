/* Openborders site scripts: student data, EN/TR i18n, tile grid, modals. */

/* ---------------- Student / university data ---------------- */
/* First 18 entries are rendered in the hero grid; extras stay available
   for swapping (edit order here to change the grid). */
const STUDENTS = [
  {
    slug: "harvard",
    university: "Harvard University",
    name: "Mona Zaric",
    en: "Our client received an athletic scholarship from Harvard University!\n\nSerbian National Basketball Team player Mona Zaric, who played for the University of Indiana last season, was offered a scholarship at Harvard University.\n\nAccording to Times Higher Education, Harvard is consistently one of the best three universities in the world. Mark Zuckerberg and Bill Gates went to Harvard; 188 billionaires, 75 Nobel Prize winners, 8 presidents and 108 Olympic medalists attended this prestigious university.\n\nWe congratulate our student on her success.",
    tr: "Müşterimiz Harvard Üniversitesi'nden sporcu bursu aldı!\n\nGeçen sezon Indiana Üniversitesi'nde oynayan Sırbistan Milli Basketbol Takımı oyuncusu Mona Zaric, Harvard Üniversitesi'nden burs teklifi aldı.\n\nTimes Higher Education'a göre Harvard, dünyanın en iyi üç üniversitesinden biridir. Mark Zuckerberg ve Bill Gates Harvard'da okudu; 188 milyarder, 75 Nobel Ödülü sahibi, 8 başkan ve 108 Olimpiyat madalyalı sporcu bu prestijli üniversiteden mezun oldu.\n\nÖğrencimizi başarısından dolayı kutluyoruz."
  },
  {
    slug: "umbc",
    university: "University of Maryland, Baltimore County",
    name: "Joseph Papa",
    en: "Joseph is a high-level athlete who competes in discus throwing for his nation.\n\nThanks to his efforts and our guidance, this young discus thrower obtained a full scholarship to the prestigious D1 University of Maryland, Baltimore County.",
    tr: "Joseph, ülkesi adına disk atma dalında yarışan üst düzey bir sporcudur.\n\nKendi çabaları ve danışmanlığımız sayesinde bu genç disk atıcı, prestijli D1 üniversitesi Maryland Baltimore County'den tam burs kazandı."
  },
  {
    slug: "chicago-state",
    university: "Chicago State University",
    name: "Maria Kuzminskaya",
    en: "Maria is a top-notch tennis player with an 8.04 UTR rating.\n\nShe received a full athletic scholarship from the famous Chicago State University.",
    tr: "Maria, 8.04 UTR derecesine sahip üst düzey bir tenis oyuncusudur.\n\nÜnlü Chicago State Üniversitesi'nden tam sporcu bursu aldı."
  },
  {
    slug: "albany",
    university: "University at Albany (SUNY)",
    name: "Daria Shiskina",
    en: "Russian basketball player Daria went to Merrimack College in Massachusetts with our support.\n\nAfter two successful years, she was recruited by the University at Albany (NY) with an athletic scholarship.",
    tr: "Rus basketbolcu Daria, desteğimizle Massachusetts'teki Merrimack College'a gitti.\n\nBaşarılı geçen iki yılın ardından University at Albany (NY) tarafından sporcu bursuyla kadroya katıldı."
  },
  {
    slug: "rome-city",
    university: "Rome City Institute",
    name: "Bruno Tasso",
    en: "Brazilian basketball player Bruno (F), after a successful high-school basketball career in Brazil, received a partial scholarship from this well-known academy in Rome.\n\nHe continues his studies while playing high-level basketball, aiming to become a professional player in Europe or overseas.",
    tr: "Brezilyalı basketbolcu Bruno (F), Brezilya'daki başarılı lise basketbol kariyerinin ardından Roma'daki bu tanınmış akademiden kısmi burs aldı.\n\nAvrupa'da veya denizaşırı liglerde profesyonel olma hedefiyle, yüksek seviyede basketbol oynarken eğitimine devam ediyor."
  },
  {
    slug: "wingate",
    university: "Wingate University",
    name: "Aleksa Janjic",
    en: "Soccer is becoming more and more popular in the USA, and this talented goalkeeper from Croatia obtained a full scholarship to D2 Wingate University with our consultation!",
    tr: "Futbol ABD'de her geçen gün daha popüler hale geliyor. Hırvatistanlı bu yetenekli kaleci, danışmanlığımızla D2 Wingate Üniversitesi'nden tam burs kazandı!"
  },
  {
    slug: "george-washington",
    university: "George Washington University",
    name: "Nemanja Mikic",
    en: "Nemanja completed his undergraduate studies in just three years and graduated with a bachelor's degree in finance from George Washington University.",
    tr: "Nemanja, lisans eğitimini yalnızca üç yılda tamamlayarak George Washington Üniversitesi Finans bölümünden mezun oldu."
  },
  {
    slug: "marshall",
    university: "Marshall University",
    name: "Jovana Vucetic",
    en: "Jovana went to the States with our help for high school, where she led Sunrise Christian Academy to the KCAA championship and was named tournament MVP.\n\nNow she is on an athletic scholarship program at Marshall University.",
    tr: "Jovana, lise için desteğimizle ABD'ye gitti; Sunrise Christian Academy'yi KCAA şampiyonluğuna taşıdı ve turnuvanın MVP'si seçildi.\n\nŞimdi Marshall Üniversitesi'nde sporcu bursu programında okuyor."
  },
  {
    slug: "monroe",
    university: "Monroe University",
    name: "Julia Kuba",
    en: "Julia is a true rising star! Her talent and passion earned her a full scholarship from Oklahoma Panhandle State University.\n\nShe transferred to Monroe University in NY for her sophomore year!",
    tr: "Julia gerçek bir yükselen yıldız! Yeteneği ve tutkusu sayesinde Oklahoma Panhandle State Üniversitesi'nden tam burs kazandı.\n\nİkinci sınıf için New York'taki Monroe Üniversitesi'ne transfer oldu!"
  },
  {
    slug: "northwest-missouri",
    university: "Northwest Missouri State University",
    name: "Vera Alenicheva",
    en: "Vera is a very talented tennis player from Russia with 8.03 UTR points.\n\nShe accepted an offer from Northwest Missouri State University and is now a chemistry major.",
    tr: "Vera, 8.03 UTR puanına sahip, Rusya'dan çok yetenekli bir tenis oyuncusudur.\n\nNorthwest Missouri State Üniversitesi'nin teklifini kabul etti ve şimdi Kimya bölümünde okuyor."
  },
  {
    slug: "rocky-mountain",
    university: "Rocky Mountain College",
    name: "Baran Çelebioğlu",
    en: "Baran, a Turkish Cypriot, continued his studies in a basketball-driven high-school program in Novi Sad, Serbia.\n\nAfter high school he received a partial scholarship from Rocky Mountain College, where he continues his basketball development.",
    tr: "Kıbrıslı Türk Baran, lise eğitimini Sırbistan'ın Novi Sad kentinde basketbol odaklı bir programda sürdürdü.\n\nLisenin ardından Rocky Mountain College'dan kısmi burs aldı ve basketbol gelişimine burada devam ediyor."
  },
  {
    slug: "wagner",
    university: "Wagner College",
    name: "Mehmet Kaan Nalcacı",
    en: "Turkish national swimmer and record holder in national and international competitions, Mehmet Kaan got a full scholarship to D1 Wagner College, NY.",
    tr: "Milli yüzücümüz ve ulusal-uluslararası yarışların rekortmeni Mehmet Kaan, New York'taki D1 Wagner College'dan tam burs kazandı."
  },
  {
    slug: "franklin-marshall",
    university: "Franklin & Marshall College",
    name: "Vakaris Grauslys",
    en: "Vakaris enrolled in West Nottingham Academy, one of the best high schools in the States and the oldest boarding school, founded in 1744.\n\nFrom there, he received a full scholarship from Franklin & Marshall College, Pennsylvania!",
    tr: "Vakaris, ABD'nin en iyi liselerinden biri ve 1744'te kurulmuş en eski yatılı okul olan West Nottingham Academy'ye kaydoldu.\n\nOradan Pennsylvania'daki Franklin & Marshall College'dan tam burs kazandı!"
  },
  {
    slug: "florida-atlantic",
    university: "Florida Atlantic University",
    name: "Scherine Dahoue",
    en: "Scherine is a volleyball player and a member of the French youth national team.\n\nShe got a full scholarship and continues her career in Florida.",
    tr: "Scherine, Fransa genç milli takımında oynayan bir voleybolcudur.\n\nTam burs kazandı ve kariyerine Florida'da devam ediyor."
  },
  {
    slug: "lcc",
    university: "LCC International University",
    name: "Ata Anıl Kanoğlu",
    en: "Ata is a Turkish basketball player (PG) who studied at a well-known high school with a dedicated basketball program in Belgrade, Serbia.\n\nHe received a scholarship from a university with a very high-level basketball program in Lithuania, where he will continue his career and pursue a professional path.",
    tr: "Ata, Belgrad'daki (Sırbistan) basketbol programıyla tanınan bir lisede okuyan Türk oyun kurucudur.\n\nLitvanya'da çok üst düzey basketbol programına sahip bir üniversiteden burs aldı; kariyerine orada devam edip profesyonelliği hedefliyor."
  },
  {
    slug: "putnam",
    university: "Putnam Science Academy",
    name: "Defne Mumcu",
    en: "A young and talented player from Fenerbahçe Basketball.\n\nDefne decided to continue her basketball and academic career in high school at Putnam Science Academy on scholarship.",
    tr: "Fenerbahçe Basketbol altyapısından genç ve yetenekli bir oyuncu.\n\nDefne, lise döneminde basketbol ve akademik kariyerine burslu olarak Putnam Science Academy'de devam etme kararı aldı."
  },
  {
    slug: "la-lumiere",
    university: "La Lumiere School",
    name: "Momir Vickovic",
    en: "Momir is a talented golf player from Serbia.\n\nHe decided to continue his golf career at La Lumiere School, Indiana, where he can play his favorite sport at a much higher level while pursuing a collegiate athletics scholarship.",
    tr: "Momir, Sırbistan'dan yetenekli bir golf oyuncusudur.\n\nGolf kariyerine Indiana'daki La Lumiere School'da devam etme kararı aldı; burada sporunu çok daha üst seviyede yaparken üniversite sporcu bursu hedefine ilerliyor."
  },
  {
    slug: "acg",
    university: "The American College of Greece",
    name: "Aleksandra Spencer",
    en: "Aleksandra is a young basketball player from South Africa.\n\nShe accepted a scholarship offer from the prestigious American College of Greece, located in Athens.",
    tr: "Aleksandra, Güney Afrikalı genç bir basketbolcudur.\n\nAtina'daki prestijli American College of Greece'in burslu teklifini kabul etti."
  },
  {
    slug: "hoosac",
    university: "Hoosac School",
    name: "Alex Pachuki",
    en: "A tall French international who decided to continue his sports journey at the well-known Hoosac School, with an even better-known basketball program.",
    tr: "Uzun boylu Fransız oyuncu, spor yolculuğuna tanınmış Hoosac School'un çok daha tanınmış basketbol programında devam etme kararı aldı."
  }
];

/* ---------------- i18n dictionary ---------------- */
const I18N = {
  tr: {
    ask: "Müşteri Temsilcinize Her Şeyi Sorun",
    register: "Kayıt Ol",
    menu: "Menü",
    explore: "Openborders'ı Keşfedin",
    close: "Kapat",
    storyKicker: "Openborders • Uluslararası Eğitim Danışmanlığı",
    storyTitle: "Her Öğrencinin Bir Hikayesi Var",
    storyText: "Dünyanın en iyi okullarına yerleştirdiğimiz her öğrencinin arkasında bir hedef, bir emek ve doğru bir yol haritası var. Sıradaki hikaye sizinki olsun.",
    storyCta: "Randevu Alın",
    placements: "Son Yerleştirmelerimiz",
    viewAll: "Tümünü görün",
    programs: "Programlarımız",
    prog1: "Üniversite Yerleştirme",
    prog2: "Spor Bursları",
    prog3: "Lise & Akademiler",
    prog4: "Dil Okulları",
    prog5: "Yaz Kampları",
    prog6: "Vize Danışmanlığı",
    signupTitle: "Bültenimize Katılın",
    signupText: "Burs fırsatları, başvuru dönemleri ve öğrenci başarı hikayelerimizden ilk siz haberdar olun.",
    signupBtn: "Katıl",
    signupPh: "E-posta adresiniz",
    signupNote: "Bülten kaydı yakında aktif olacaktır.",
    footerMenu: "Menü",
    footerContact: "İletişim",
    footerLegal: "Yasal",
    footerTag: "Uluslararası eğitim ve sporcu bursu danışmanlığı.",
    rights: "Tüm hakları saklıdır.",
    langBtn: "EN",
    mHome: "Anasayfa", mCamps: "Kamplarımız", mStudents: "Öğrencilerimiz",
    mRefs: "Referans Listemiz", mVideos: "Yardımcı Videolar",
    mAthlete: "Sporcu Tanıma Formu", mAppointment: "Randevu Alın",
    mAbout: "Hakkımızda", mContact: "İletişim",
    mCookies: "Çerez Politikamız", mKvkk: "KVKK Politikamız",
    regTitle: "Kayıt Olun",
    regLead: "Hesabınızı oluşturun; yapay zeka müşteri temsilcimiz MaiA çok yakında sizinle. Bu sayfa geliştirme aşamasındadır ve ileride tam olarak tasarlanacaktır.",
    regName: "Ad", regSurname: "Soyad", regEmail: "E-posta", regPhone: "Telefon",
    regInterest: "İlgilendiğiniz Program",
    regConsent: "Kişisel verilerimin KVKK kapsamında işlenmesini kabul ediyorum.",
    regSubmit: "Kayıt Ol",
    regMaia: "MaiA — yapay zeka destekli interaktif müşteri temsilcimiz — ikinci geliştirme aşamasında burada olacak. Kayıt olan kullanıcılar MaiA ile üniversite arama ve seçim sürecini sohbet ederek yürütebilecek.",
    regSoon: "Kayıt sistemi yakında aktif olacaktır. İlginiz için teşekkür ederiz!",
    aboutTitle: "Hakkımızda",
    aboutLead: "Openborders, öğrencileri dünyanın dört bir yanındaki üniversite, lise ve spor programlarıyla buluşturan uluslararası eğitim danışmanlığıdır.",
    aboutBody1: "Bu sayfanın içeriği yakında eklenecektir.",
    aboutBody2: "Deneyimimiz, yaklaşımımız ve ekibimiz hakkında ayrıntılı bilgiyi çok yakında burada bulabileceksiniz."
  },
  en: {
    ask: "Ask Anything to Your Client Representative",
    register: "Register",
    menu: "Menu",
    explore: "Explore Openborders",
    close: "Close",
    storyKicker: "Openborders • International Education Consultancy",
    storyTitle: "Every Student Has a Story",
    storyText: "Behind every student we place at the world's best schools there is a goal, hard work and the right roadmap. Let the next story be yours.",
    storyCta: "Book an Appointment",
    placements: "Recent Placements",
    viewAll: "View all",
    programs: "Our Programs",
    prog1: "University Placement",
    prog2: "Athletic Scholarships",
    prog3: "High Schools & Academies",
    prog4: "Language Schools",
    prog5: "Summer Camps",
    prog6: "Visa Consultancy",
    signupTitle: "Join Our Newsletter",
    signupText: "Be the first to hear about scholarship opportunities, application periods and our students' success stories.",
    signupBtn: "Join",
    signupPh: "Your email address",
    signupNote: "Newsletter signup will be activated soon.",
    footerMenu: "Menu",
    footerContact: "Contact",
    footerLegal: "Legal",
    footerTag: "International education and athletic scholarship consultancy.",
    rights: "All rights reserved.",
    langBtn: "TR",
    mHome: "Home", mCamps: "Our Camps", mStudents: "Our Students",
    mRefs: "Our References", mVideos: "Helpful Videos",
    mAthlete: "Athlete Recognition Form", mAppointment: "Book an Appointment",
    mAbout: "About Us", mContact: "Contact",
    mCookies: "Cookie Policy", mKvkk: "KVKK / Privacy Policy",
    regTitle: "Register",
    regLead: "Create your account — our AI client representative MaiA is coming very soon. This page is a work in progress and will be fully designed at a later stage.",
    regName: "First Name", regSurname: "Last Name", regEmail: "Email", regPhone: "Phone",
    regInterest: "Program of Interest",
    regConsent: "I consent to the processing of my personal data under KVKK.",
    regSubmit: "Register",
    regMaia: "MaiA — our AI-powered interactive client representative — will arrive in the second development phase. Registered users will be able to search and select universities by simply chatting with MaiA.",
    regSoon: "The registration system will be activated soon. Thank you for your interest!",
    aboutTitle: "About Us",
    aboutLead: "Openborders is an international education consultancy connecting students with universities, high schools and athletic programs around the world.",
    aboutBody1: "The content of this page will be added soon.",
    aboutBody2: "Detailed information about our experience, our approach and our team will be available here very soon."
  }
};

/* ---------------- helpers ---------------- */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function assetRoot() {
  return document.body.dataset.root || ".";
}

/* ---------------- Language handling ---------------- */
function getLang() {
  return localStorage.getItem("ob-lang") || "tr";
}
function setLang(lang) {
  localStorage.setItem("ob-lang", lang);
  applyLang();
}
function t(key) {
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || I18N.tr[key] || key;
}
function applyLang() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(node => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(node => {
    node.placeholder = t(node.dataset.i18nPh);
  });
  const langBtn = document.querySelector(".pill.lang b");
  if (langBtn) langBtn.textContent = t("langBtn");
}

/* ---------------- Hero grid ---------------- */
function renderGrid() {
  const grid = document.getElementById("tileGrid");
  if (!grid) return;
  grid.textContent = "";
  STUDENTS.slice(0, 18).forEach((s, i) => {
    const btn = el("button", "tile");
    btn.setAttribute("aria-label", s.name + " — " + s.university);

    const photoWrap = el("span", "tile-photo");
    const photo = el("img");
    photo.loading = "lazy";
    photo.src = assetRoot() + "/assets/img/students/" + s.slug + "-student.jpg";
    photo.alt = "";
    photoWrap.appendChild(photo);

    const faceWrap = el("span", "tile-face");
    const face = el("img");
    if (i >= 6) face.loading = "lazy";
    face.src = assetRoot() + "/assets/img/universities/" + s.slug + "-logo.jpg";
    face.alt = s.university;
    faceWrap.appendChild(face);

    btn.appendChild(photoWrap);
    btn.appendChild(faceWrap);
    btn.appendChild(el("span", "tile-chip", s.name));
    btn.addEventListener("click", () => openStory(s));
    grid.appendChild(btn);
  });
}

/* ---------------- Placement cards ---------------- */
function renderPlacements() {
  const row = document.getElementById("placementRow");
  if (!row) return;
  row.textContent = "";
  STUDENTS.slice(0, 4).forEach(s => {
    const card = el("button", "placement-card");
    const img = el("img");
    img.loading = "lazy";
    img.src = assetRoot() + "/assets/img/students/" + s.slug + "-student.jpg";
    img.alt = s.name;
    card.appendChild(img);
    card.appendChild(el("h4", "", s.name));
    card.appendChild(el("span", "", s.university));
    card.addEventListener("click", () => openStory(s));
    row.appendChild(card);
  });
}

/* ---------------- Story modal ---------------- */
function openStory(s) {
  const overlay = document.getElementById("storyOverlay");
  if (!overlay) return;
  overlay.querySelector("h3").textContent = s.name;
  overlay.querySelector(".uni").textContent = s.university;
  const textBox = overlay.querySelector(".paragraphs");
  textBox.textContent = "";
  (s[getLang()] || s.en).split("\n\n").forEach(par => {
    textBox.appendChild(el("p", "", par));
  });
  const img = overlay.querySelector(".photo img");
  img.src = assetRoot() + "/assets/img/students/" + s.slug + "-student.jpg";
  img.alt = s.name;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeStory() {
  const overlay = document.getElementById("storyOverlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------------- Menu modal ---------------- */
function toggleMenu(open) {
  const menu = document.getElementById("menuOverlay");
  if (!menu) return;
  menu.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
}

/* ---------------- Init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  renderPlacements();
  applyLang();

  const langPill = document.querySelector(".pill.lang");
  if (langPill) langPill.addEventListener("click", () => {
    setLang(getLang() === "tr" ? "en" : "tr");
  });

  const menuPill = document.getElementById("menuPill");
  if (menuPill) menuPill.addEventListener("click", () => toggleMenu(true));
  const menuClose = document.getElementById("menuClose");
  if (menuClose) menuClose.addEventListener("click", () => toggleMenu(false));

  const storyOverlay = document.getElementById("storyOverlay");
  if (storyOverlay) {
    storyOverlay.addEventListener("click", e => {
      if (e.target === storyOverlay || e.target.closest(".modal-close")) closeStory();
    });
  }
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeStory(); toggleMenu(false); }
  });

  const regForm = document.getElementById("registerForm");
  if (regForm) regForm.addEventListener("submit", e => {
    e.preventDefault();
    alert(t("regSoon"));
  });
  const signupForm = document.getElementById("signupForm");
  if (signupForm) signupForm.addEventListener("submit", e => {
    e.preventDefault();
    alert(t("signupNote"));
  });
});
