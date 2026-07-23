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
  },
  {
    slug: "cisel-akgul",
    university: "University of Miami",
    name: "Cisel Akgül",
    en: "A Turkish student from Kamen, Germany, Cisel plays as a forward and has transferred to the University of Miami.\n\nShe was named PBC Freshman of the Year and earned 2024 All-PBC First Team honours. She appeared in all 18 matches with 17 starts, scoring 10 goals and adding six assists for 26 points — including a four-goal performance against Albany State and a two-goal outing against Lander.",
    tr: "Almanya'nın Kamen şehrinden Türk öğrencimiz Cisel, forvet mevkiinde oynuyor ve University of Miami'ye transfer oldu.\n\nPBC'de Yılın İlk Sınıf Oyuncusu seçildi ve 2024 All-PBC İlk Takım ödülüne layık görüldü. 18 maçın tamamında forma giydi, 17'sine ilk 11'de başladı; 10 gol ve altı asistle 26 puana ulaştı. Albany State karşısında dört gollük, Lander karşısında ise iki gollük performans sergiledi."
  },
  {
    slug: "dayana-mendes",
    university: "University of Miami",
    name: "Dayana Mendes",
    en: "Dayana played for Charnay and at INSEP High School, winning a France LF2 league championship and taking the 2018 title with Île-de-France.\n\nAfter transferring to Washington she made the WCC All-Freshman Team and was twice named WCC Freshman of the Week. She appeared in 30 games with nine starts, averaging 8.3 points, 5.3 rebounds and 1.3 assists in 18.5 minutes per game, with four double-doubles and 11 double-figure scoring games — including a career-high 16 points against Saint Mary's and 13 rebounds against Portland. She has since transferred to the University of Miami.",
    tr: "Dayana, Charnay ve INSEP Lisesi'nde oynadı; Fransa LF2 lig şampiyonluğu ve Île-de-France ile 2018 şampiyonluğunu kazandı.\n\nWashington'a transfer olduktan sonra WCC All-Freshman Takımı'na seçildi ve iki kez WCC'nin Haftanın İlk Sınıf Oyuncusu oldu. 30 maçta forma giydi, dokuzuna ilk beşte başladı; maç başına 18.5 dakikada 8.3 sayı, 5.3 ribaund ve 1.3 asist ortalaması yakaladı. Dört double-double yaptı, 11 maçta çift haneli sayılara ulaştı; Saint Mary's karşısında kariyer rekoru 16 sayı, Portland karşısında 13 ribaund kaydetti. Ardından University of Miami'ye transfer oldu."
  },
  {
    slug: "djurdja-stanojevic",
    university: "Texas A&M University",
    name: "Djurdja Stanojevic",
    en: "A middle blocker who has been part of the Serbian national team since 2021, Djurdja has competed in three European Championships at U17, U18 and U20 level, as well as the 2023 U19 World Championships.\n\nIn her club league she recorded 130 kills and 45 service aces while blocking 89 attacks across 53 appearances for OK Tent. She now continues her volleyball career at Texas A&M.",
    tr: "2021'den bu yana Sırbistan milli takımının bir parçası olan Djurdja, orta oyuncusu olarak U17, U18 ve U20 seviyelerinde üç Avrupa Şampiyonası'nda ve 2023 U19 Dünya Şampiyonası'nda mücadele etti.\n\nKulüp liginde OK Tent formasıyla çıktığı 53 maçta 130 sayı ve 45 servis asi kaydederken 89 blok yaptı. Voleybol kariyerine şimdi Texas A&M'de devam ediyor."
  },
  {
    slug: "kayhan-sayman",
    university: "Florida International University",
    name: "Kayhan Sayman",
    en: "Kayhan came through the Schalke 04 youth system, earning a place in the U17 Bundesliga from 2022–24 with 38 appearances, 34 starts, 2,846 minutes and 12 goals — including 11 goals in 24 matches during the 2023–24 season.\n\nHe went on to play in the U19 DFB Youth League and represented Germany at U16 and U17 level, competing at the UEFA European U17 Championship, before transferring to Florida International University.",
    tr: "Kayhan, Schalke 04 altyapısından yetişti. 2022–24 arasında U17 Bundesliga kadrosunda yer aldı; 38 maçta forma giydi, 34'üne ilk 11'de başladı, 2.846 dakika sahada kalarak 12 gol attı. 2023–24 sezonunda 24 maçta 11 gole ulaştı.\n\nArdından U19 DFB Gençlik Ligi'nde oynadı; Almanya'yı U16 ve U17 seviyelerinde temsil ederek UEFA Avrupa U17 Şampiyonası'nda mücadele etti. Şimdi Florida International University'de eğitimine ve kariyerine devam ediyor."
  },
  {
    slug: "elif-dila",
    university: "Stonehill College",
    name: "Elif Dila",
    en: "A 6'1\" setter from Ankara, Elif received a partial scholarship to play for the prestigious Stonehill College.\n\nWe wish her all the best for her academic and sporting career.",
    tr: "Ankara'dan 1.85 boyundaki pasör Elif, prestijli Stonehill College'da oynamak üzere kısmi burs kazandı.\n\nAkademik ve sportif kariyerinde kendisine başarılar diliyoruz."
  },
  {
    slug: "zahira-arizmendi",
    university: "Florida Atlantic University",
    name: "Zahira Arizmendi",
    en: "A guard from Madrid, Spain, standing 5-8 and now in her senior year.\n\nBefore Florida Atlantic she played at Middle Tennessee, where she made her breakthrough. She made her collegiate debut against Florida A&M, tallying three points and an assist in a season-high 14 minutes, and added two points in the win over NKU — then transferred to Florida Atlantic.",
    tr: "Madrid, İspanya'dan gelen 1.73 boyundaki guard oyuncumuz, artık son sınıf öğrencisi.\n\nFlorida Atlantic öncesinde Middle Tennessee'de oynadı ve çıkışını orada yaptı. Üniversite kariyerindeki ilk maçına Florida A&M karşısında çıktı; sezonun en uzun süresi olan 14 dakikada üç sayı ve bir asist kaydetti. NKU galibiyetinde iki sayı ekledikten sonra Florida Atlantic'e transfer oldu."
  }
];

/* ---------------- i18n dictionary ---------------- */
const I18N = {
  tr: {
    ask: "Müşteri Temsilcinize Her Şeyi Sorun",
    register: "Kayıt Ol",
    signin: "Giriş",
    regHaveAccount: "Zaten hesabınız var mı?",
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
    apptTitle: "Ücretsiz Ön Görüşme Alın",
    apptText: "Hedeflerinizi konuşalım: hangi ülke, hangi program, hangi burs seçenekleri size uygun? Danışmanlarımızla ücretsiz ön görüşmenizi planlayın.",
    apptBtn: "Randevu Alın",
    apptContact: "Bize Ulaşın",
    apptNote: "Sorularınız için:",
    readStory: "Hikayeyi Okuyun",
    studentsTitle: "Öğrencilerimiz",
    studentsLead: "Dünyanın dört bir yanındaki okullara yerleştirdiğimiz öğrencilerimiz ve başarı hikayeleri.",
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
    regCheckEmail: "Onay e-postası gönderdik! Kaydınızı tamamlamak için lütfen gelen kutunuzu (ve spam klasörünüzü) kontrol edin.",
    regAlready: "Bu e-posta adresi zaten kayıtlı ve onaylı. Hoş geldiniz!",
    regFailed: "Kayıt sırasında bir sorun oluştu. Lütfen daha sonra tekrar deneyin.",
    confirmOkTitle: "Kaydınız Onaylandı! 🎉",
    confirmOkText: "Openborders ailesine hoş geldiniz. Yapay zeka müşteri temsilcimiz MaiA yayına girdiğinde ilk haber alanlardan olacaksınız.",
    confirmErrTitle: "Bağlantı Geçersiz veya Süresi Dolmuş",
    confirmErrText: "Onay bağlantınız geçersiz ya da 48 saatlik süresi dolmuş görünüyor. Lütfen kayıt formunu yeniden doldurun; size yeni bir onay e-postası gönderelim.",
    aboutTitle: "Biz Kimiz?",
    aboutLead: "Akademik yerleştirmeler ve sporcu bursları için doğru adrestesiniz.",
    aboutIntro1: "2013 yılından beri akademik öğrenci yerleştirmeleri, atletik burs danışmanlığı, spor organizasyonları, gençlik kampları ve tematik kamplarımızla sizlere çözümler sunuyoruz.",
    aboutIntro2: "Dünya çapındaki çeşitli iş ortaklarımız aracılığıyla Sırbistan, Fransa, İtalya, İspanya ve ABD'de çeşitli etkinlikler düzenliyor; uluslararası iş ortaklarımızla birlikte öğrencilerimize ve sporcularımıza eğitim bursu bulma konusunda danışmanlık hizmeti veriyoruz.",
    aboutIntro3: "İş ortaklarımızın 17 yılın üzerindeki deneyimiyle akademik danışmanlık, sporcu bursu danışmanlığı, yurtdışı üniversite ve relokasyon danışmanlığı konularında; Türkiye, Sırbistan, İngiltere, İsveç ve Lüksemburg'dan size en geniş fırsat yelpazesini sunuyoruz.",

    aboutServicesTitle: "Hizmetlerimiz",
    svcUniTitle: "Üniversite Yerleştirme",
    svcUniText: "Lisans ve yüksek lisans başvurularında program seçiminden kabule kadar tüm süreç.",
    svcHighTitle: "Lise & Akademiler",
    svcHighText: "Yurtdışı yatılı okullar, kolejler ve spor akademilerinde lise eğitimi.",
    svcSportTitle: "Sporcu Bursları",
    svcSportText: "ABD, Kanada, Avrupa ve Asya'da atletik burs fırsatları ve kulüp bağlantıları.",
    svcCampTitle: "Kamplar & Organizasyonlar",
    svcCampText: "Gençlik kampları, tematik kamplar ve uluslararası spor organizasyonları.",

    aboutAcademicTitle: "Akademik Yerleştirme",
    aboutAcademicText1: "Sporcu bursları kadar akademik yerleştirmeler de uzmanlık alanımızdır. ABD, Kanada, İngiltere ve Avrupa'daki üniversitelerde lisans ve yüksek lisans programlarına başvuran öğrencilerimize; doğru üniversite ve program seçiminden başvuru dosyasının hazırlanmasına, niyet mektubu (SOP) ve referans mektuplarından TOEFL, IELTS, SAT gibi sınavların planlanmasına kadar tüm aşamalarda rehberlik ediyoruz.",
    aboutAcademicText2: "Kabul sonrasında da yalnız bırakmıyoruz: burs ve finansman başvuruları, vize süreci, konaklama ve şehre yerleşim adımlarında öğrencilerimizin ve ailelerinin yanında oluyoruz.",

    aboutHighTitle: "Lise ve Hazırlık Programları",
    aboutHighText: "Üniversite öncesinde uluslararası deneyim kazanmak isteyen öğrenciler için yurtdışındaki yatılı liseler, özel kolejler ve spor akademileriyle çalışıyoruz. Akademik seviyeye, bütçeye ve sportif hedeflere uygun okul seçimini birlikte belirliyor; başvuru, kayıt ve veli iletişimi süreçlerini baştan sona yönetiyoruz.",

    aboutSportTitle: "Sporcu Bursları",
    aboutSportText1: "ABD, Kanada, Avrupa ve Asya'daki spor bursları ve eğitim fırsatları konusunda sizinle iş birliği yaparak, lisanslı sporlarınızın eğitiminize katkıda bulunmasını sağlıyoruz.",
    aboutSportText2: "Amerikan ve Kanada üniversiteleri her yıl yaklaşık 4,7 milyar dolar spor bursu dağıtıyor. Bu burslardan en yüksek şekilde yararlanabilmeniz için çalışıyor, farklı üniversitelerden teklifler getiriyoruz. Bizimle birlikte en iyi spor bursu seçeneklerini bulacaksınız.",

    statSince: "Yılından beri",
    statExp: "Yıllık ortak deneyimi",
    statFund: "Yıllık spor bursu havuzu",
    statCountries: "Ülkede ofis ve ortak ağı",

    partnersTitle: "İş Ortaklarımız",
    partnersIntro: "Dünya genelindeki iş ortaklarımızla birlikte öğrencilerimize en geniş fırsat ağını sunuyoruz.",
    partnerPlaceholder: "Yakında",
    parentsTitle: "Velilerimizden",
    parentQuote1: "Oğlumuzun süreci boyunca her adımda yanımızdaydılar. Üniversite seçiminden vizeye kadar tüm aşamaları büyük bir sabırla anlattılar.",
    parentQuote2: "Kızımızın hem akademik hem sportif hedeflerini birlikte değerlendirdiler. Doğru okulu bulmamızda büyük emekleri var.",
    parentQuote3: "Yurtdışı eğitim süreci bize çok karmaşık geliyordu. Openborders ekibi her şeyi anlaşılır hale getirdi ve sürekli iletişimde kaldı.",
    parentName1: "Veli görüşü",
    parentName2: "Veli görüşü",
    parentName3: "Veli görüşü",
    parentsNote: "Referans listemiz ve veli görüşlerimiz yakında bu bölümde yer alacaktır.",

    signinTitle: "MaiA'ya Giriş",
    signinLead: "Kayıtlı e-posta adresinizi girin, size tek kullanımlık bir giriş bağlantısı gönderelim.",
    signinBtn: "Giriş Bağlantısı Gönder",
    signinSent: "Giriş bağlantısı e-postanıza gönderildi. Gelen kutunuzu kontrol edin.",
    signinLinkErr: "Bağlantı geçersiz veya süresi dolmuş. Lütfen tekrar deneyin.",
    signinNoAccount: "Hesabınız yok mu?",
    maiaTitle: "MaiA ile Tanışın",
    maiaLead: "Yapay zeka danışmanınız. Birkaç soruyla başlayalım.",
    mq1: "Bugün ne arıyorsunuz?",
    mq1a: "Lise", mq1b: "Üniversite (Lisans)", mq1c: "Yüksek Lisans / Doktora",
    mq2: "Tercih ettiğiniz bir yer var mı? (Örn. Avrupa, ABD, Almanya, New York)",
    mq2ph: "Örn. Almanya, Avrupa, New York…",
    mq3: "Aklınızda bir bölüm var mı? Ne okumak istersiniz?",
    mq3ph: "Örn. Bilgisayar Mühendisliği, İşletme…",
    mq3note: "(Lise arıyorsanız bu adımı atlayabilirsiniz.)",
    mq4: "Akademik burslar için her zaman başvuruyoruz. Elit bir sporcu musunuz? Spor bursu mu arıyorsunuz?",
    mq4a: "Evet, sporcu bursu arıyorum", mq4b: "Hayır",
    mq5: "Yurtdışı eğitim için yıllık bütçeniz nedir? Buna göre öneriler yapacağım.",
    mq5ph: "Tutar",
    maiaStart: "MaiA ile Başla",
    maiaPlaceholder: "MaiA'ya yazın…",
    maiaSend: "Gönder",
    maiaFinish: "Bitir ve Özetimi Al",
    maiaTyping: "MaiA yazıyor…",
    maiaWelcome: "Merhaba! Verdiğiniz bilgilere göre size en uygun programları arıyorum…",
    maiaDone: "Görüşmeniz tamamlandı. Özet e-posta adresinize ve danışmanlarımıza gönderildi. En kısa sürede sizinle iletişime geçeceğiz. 🎓",
    maiaSignout: "Çıkış",

    aboutCtaTitle: "Ücretsiz Değerlendirme",
    aboutCtaText: "Bugün bizimle iletişime geçin, ÜCRETSİZ bir değerlendirme yapalım ve danışmanlarımız yolunuzu geliştirmenize yardımcı olsun.",
    aboutCtaBtn: "Randevu Alın"
  },
  en: {
    ask: "Ask Anything to Your Client Representative",
    register: "Register",
    signin: "Sign in",
    regHaveAccount: "Already have an account?",
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
    apptTitle: "Book a Free Consultation",
    apptText: "Let's talk about your goals: which country, which program and which scholarship options suit you best? Schedule a free introductory call with our consultants.",
    apptBtn: "Book an Appointment",
    apptContact: "Contact Us",
    apptNote: "Questions? Write to us:",
    readStory: "Read the Story",
    studentsTitle: "Our Students",
    studentsLead: "The students we have placed at schools around the world, and their success stories.",
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
    regCheckEmail: "Confirmation email sent! Please check your inbox (and spam folder) to complete your registration.",
    regAlready: "This email address is already registered and confirmed. Welcome back!",
    regFailed: "Something went wrong during registration. Please try again later.",
    confirmOkTitle: "Registration Confirmed! 🎉",
    confirmOkText: "Welcome to the Openborders family. You'll be among the first to know when our AI client representative MaiA goes live.",
    confirmErrTitle: "Link Invalid or Expired",
    confirmErrText: "Your confirmation link is invalid or has passed its 48-hour validity. Please fill in the registration form again and we'll send you a fresh confirmation email.",
    aboutTitle: "Who We Are",
    aboutLead: "Your address for academic placements and athletic scholarships.",
    aboutIntro1: "Since 2013 we have been providing solutions through academic student placements, athletic scholarship consultancy, sports organisations, youth camps and our themed camps.",
    aboutIntro2: "Through our partners worldwide we organise events in Serbia, France, Italy, Spain and the USA, and together with our international partners we advise our students and athletes on securing education scholarships.",
    aboutIntro3: "With our partners' more than 17 years of experience in academic consultancy, athletic scholarship consultancy, and overseas university and relocation guidance, we offer you the widest range of opportunities from Türkiye, Serbia, the United Kingdom, Sweden and Luxembourg.",

    aboutServicesTitle: "What We Do",
    svcUniTitle: "University Placement",
    svcUniText: "The full journey for bachelor's and master's applications, from choosing programs to acceptance.",
    svcHighTitle: "High Schools & Academies",
    svcHighText: "Boarding schools, colleges and sports academies abroad for high-school students.",
    svcSportTitle: "Athletic Scholarships",
    svcSportText: "Scholarship opportunities and club connections across the USA, Canada, Europe and Asia.",
    svcCampTitle: "Camps & Events",
    svcCampText: "Youth camps, themed camps and international sports organisations.",

    aboutAcademicTitle: "Academic Placement",
    aboutAcademicText1: "Academic placement is as much our speciality as athletic scholarships. For students applying to bachelor's and master's programs in the USA, Canada, the UK and Europe, we guide every stage — from selecting the right university and program to preparing the application file, from the statement of purpose and reference letters to planning exams such as TOEFL, IELTS and SAT.",
    aboutAcademicText2: "Our work doesn't end at acceptance: we stand beside our students and their families through scholarship and funding applications, the visa process, accommodation and settling into their new city.",

    aboutHighTitle: "High School & Preparatory Programs",
    aboutHighText: "For students who want international experience before university, we work with boarding schools, private colleges and sports academies abroad. Together we identify the right school for each student's academic level, budget and sporting goals, and we manage the application, enrolment and family communication from start to finish.",

    aboutSportTitle: "Athletic Scholarships",
    aboutSportText1: "We collaborate with you on sports scholarships and education opportunities across the USA, Canada, Europe and Asia, so that the sport you compete in contributes to your education.",
    aboutSportText2: "American and Canadian universities award approximately 4.7 billion dollars in athletic scholarships every year. We work to help you benefit from these scholarships to the fullest, bringing you offers from different universities. Together we will find the best athletic scholarship options for you.",

    statSince: "Serving since",
    statExp: "Years of partner experience",
    statFund: "Annual athletic scholarship pool",
    statCountries: "Countries with offices and partners",

    partnersTitle: "Our Partners",
    partnersIntro: "Together with our partners around the world we offer our students the widest network of opportunities.",
    partnerPlaceholder: "Coming soon",
    parentsTitle: "From Our Parents",
    parentQuote1: "They were with us at every step of our son's journey, patiently explaining each stage from choosing a university to the visa process.",
    parentQuote2: "They considered both our daughter's academic and athletic goals together. Their effort in finding the right school was invaluable.",
    parentQuote3: "Studying abroad felt overwhelming to us. The Openborders team made everything clear and stayed in constant contact.",
    parentName1: "Parent testimonial",
    parentName2: "Parent testimonial",
    parentName3: "Parent testimonial",
    parentsNote: "Our reference list and parent testimonials will appear in this section soon.",

    signinTitle: "Sign in to MaiA",
    signinLead: "Enter your registered email and we'll send you a one-time sign-in link.",
    signinBtn: "Send sign-in link",
    signinSent: "Sign-in link sent to your email. Please check your inbox.",
    signinLinkErr: "The link is invalid or expired. Please try again.",
    signinNoAccount: "Don't have an account?",
    maiaTitle: "Meet MaiA",
    maiaLead: "Your AI consultant. Let's start with a few questions.",
    mq1: "What are you looking for today?",
    mq1a: "High school", mq1b: "University (Bachelor's)", mq1c: "Postgraduate / Master's / PhD",
    mq2: "Do you have a preferred location? (e.g. Europe, US, Germany, New York)",
    mq2ph: "e.g. Germany, Europe, New York…",
    mq3: "Do you have a major in mind? What do you want to study?",
    mq3ph: "e.g. Computer Science, Business…",
    mq3note: "(If you're looking for high school, you can skip this.)",
    mq4: "We always apply for academic scholarships. Are you an elite athlete? Are you looking for a sports scholarship?",
    mq4a: "Yes, I'm looking for a sports scholarship", mq4b: "No",
    mq5: "What is your yearly budget for studying abroad? I'll tailor suggestions accordingly.",
    mq5ph: "Amount",
    maiaStart: "Start with MaiA",
    maiaPlaceholder: "Message MaiA…",
    maiaSend: "Send",
    maiaFinish: "Finish & get my summary",
    maiaTyping: "MaiA is typing…",
    maiaWelcome: "Hi! Based on what you told me, I'm searching for the programs that fit you best…",
    maiaDone: "Your session is complete. A summary has been sent to your email and to our consultants. We'll be in touch very soon. 🎓",
    maiaSignout: "Sign out",

    aboutCtaTitle: "Free Assessment",
    aboutCtaText: "Get in touch today, let us make a FREE assessment, and let our consultants help you shape your path.",
    aboutCtaBtn: "Book an Appointment"
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
  renderFeatured(); // featured excerpt is language-dependent
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
function makePlacementCard(s) {
  const card = el("button", "placement-card");
  const img = el("img");
  img.loading = "lazy";
  img.src = assetRoot() + "/assets/img/students/" + s.slug + "-student.jpg";
  img.alt = s.name;
  card.appendChild(img);
  card.appendChild(el("h4", "", s.name));
  card.appendChild(el("span", "", s.university));
  card.addEventListener("click", () => openStory(s));
  return card;
}

function renderPlacements() {
  const row = document.getElementById("placementRow");
  if (!row) return;
  row.textContent = "";
  STUDENTS.slice(1, 5).forEach(s => row.appendChild(makePlacementCard(s)));
}

/* One big featured placement above the small cards (Discover-Episodes-style) */
function renderFeatured() {
  const box = document.getElementById("featuredPlacement");
  if (!box) return;
  const s = STUDENTS[0];
  box.textContent = "";

  const photoBtn = el("button", "f-photo");
  const img = el("img");
  img.src = assetRoot() + "/assets/img/students/" + s.slug + "-student.jpg";
  img.alt = s.name;
  photoBtn.appendChild(img);
  photoBtn.addEventListener("click", () => openStory(s));

  const info = el("div", "f-info");
  info.appendChild(el("div", "f-uni", s.university));
  info.appendChild(el("h3", "", s.name));
  info.appendChild(el("p", "f-excerpt", (s[getLang()] || s.en).split("\n\n")[0]));
  const btn = el("button", "pill", t("readStory"));
  btn.addEventListener("click", () => openStory(s));
  info.appendChild(btn);

  box.appendChild(photoBtn);
  box.appendChild(info);
}

/* ---------------- University logo marquee ----------------
   Transparent-PNG wordmarks, rendered monochrome (see .marquee CSS).
   Order here = order in the carousel. */
const LOGOS = [
  { slug: "harvard-university", name: "Harvard University" },
  { slug: "university-of-michigan", name: "University of Michigan" },
  { slug: "university-of-maryland-baltimore-county", name: "University of Maryland, Baltimore County" },
  { slug: "texas-a-m-university", name: "Texas A&M University" },
  { slug: "university-at-albany", name: "University at Albany" },
  { slug: "university-of-california-irvine", name: "University of California, Irvine" },
  { slug: "chicago-state-university", name: "Chicago State University" },
  { slug: "university-of-miami", name: "University of Miami" },
  { slug: "george-washington-university", name: "George Washington University" },
  { slug: "university-of-california-san-francisco", name: "University of California, San Francisco" },
  { slug: "wingate-university", name: "Wingate University" },
  { slug: "franklin-marshall-college", name: "Franklin & Marshall College" },
  { slug: "rome-city-institute", name: "Rome City Institute" },
  { slug: "monroe-university", name: "Monroe University" },
  { slug: "northwest-missouri-state-university", name: "Northwest Missouri State University" },
  { slug: "wagner-college", name: "Wagner College" },
  { slug: "rocky-mountain-college", name: "Rocky Mountain College" },
  { slug: "florida-atlantic-university", name: "Florida Atlantic University" },
  { slug: "lcc-international-university", name: "LCC International University" }
];

function renderMarquee() {
  const track = document.getElementById("marqueeTrack");
  if (!track) return;
  track.textContent = "";
  // two copies of the logo run -> seamless -50% loop
  for (let copy = 0; copy < 2; copy++) {
    LOGOS.forEach(l => {
      const item = el("span", "marquee-item");
      const img = el("img");
      img.loading = "lazy";
      img.src = assetRoot() + "/assets/img/logos/" + l.slug + ".png";
      img.alt = copy === 0 ? l.name : "";
      item.appendChild(img);
      if (copy === 1) item.setAttribute("aria-hidden", "true");
      track.appendChild(item);
    });
  }
}

/* ---------------- All-students page ---------------- */
function renderAllStudents() {
  const grid = document.getElementById("allStudentsGrid");
  if (!grid) return;
  grid.textContent = "";
  STUDENTS.forEach(s => grid.appendChild(makePlacementCard(s)));
}

/* ---------------- Scroll effects ----------------
   Hero tiles dissolve row by row as the content scrolls over the
   stage: each row fades and drifts upward on its own staggered
   schedule (top row first), instead of the whole grid at once. */
function computeTileRows() {
  const tiles = document.querySelectorAll("#tileGrid .tile");
  const tops = [...new Set([...tiles].map(t => t.offsetTop))].sort((a, b) => a - b);
  // rows dissolve bottom-up: the last row is stage 0, the top row last
  tiles.forEach(t => {
    t.dataset.row = String(tops.length - 1 - tops.indexOf(t.offsetTop));
  });
}

function onScroll() {
  const tiles = document.querySelectorAll("#tileGrid .tile");
  const pill = document.querySelector(".hero-footer");
  if (!tiles.length) return;
  if (!window.matchMedia("(min-width: 1101px)").matches) {
    tiles.forEach(t => { t.style.opacity = ""; t.style.transform = ""; t.style.pointerEvents = ""; });
    if (pill) { pill.style.opacity = ""; }
    return;
  }
  const p = window.scrollY / (window.innerHeight * 0.75);
  tiles.forEach(t => {
    const row = Number(t.dataset.row) || 0;
    const rp = Math.min(Math.max((p - row * 0.22) / 0.4, 0), 1);
    t.style.opacity = String(1 - rp);
    t.style.transform = "translateY(" + (-46 * rp) + "px)";
    t.style.pointerEvents = rp > 0.5 ? "none" : "";
  });
  if (pill) {
    const pp = Math.min(Math.max(p / 0.3, 0), 1);
    pill.style.opacity = String(1 - pp);
    pill.style.pointerEvents = pp > 0.5 ? "none" : "";
  }
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

/* expose helpers for the MaiA / sign-in pages */
window.OB_T = t;
window.OB_LANG = getLang;

/* ---------------- Init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  renderPlacements();
  renderMarquee();
  renderAllStudents();
  applyLang(); // also renders the featured placement

  computeTileRows();
  window.addEventListener("resize", () => { computeTileRows(); onScroll(); });
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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
  if (regForm) regForm.addEventListener("submit", async e => {
    e.preventDefault();
    const submitBtn = regForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: document.getElementById("regName").value,
          surname: document.getElementById("regSurname").value,
          email: document.getElementById("regEmail").value,
          phone: document.getElementById("regPhone").value,
          interest: document.getElementById("regInterest").value,
          lang: getLang()
        })
      });
      if (res.ok) {
        const data = await res.json();
        const msg = el("p", "maia-note",
          t(data.state === "already_confirmed" ? "regAlready" : "regCheckEmail"));
        regForm.replaceWith(msg);
      } else if (res.status === 404 || res.status === 405) {
        alert(t("regSoon")); // API not deployed yet (local/static preview)
      } else {
        alert(t("regFailed"));
      }
    } catch {
      alert(t("regSoon"));
    } finally {
      submitBtn.disabled = false;
    }
  });
});
