import { useState, useEffect, useRef, forwardRef, createContext, useContext } from "react";

const DarkCtx = createContext(false);
const useDark = () => useContext(DarkCtx);
const NavCtx = createContext({ goTo: () => {} });
const useNav = () => useContext(NavCtx);
const t = (light, dark) => ({ light, dark });
const THEME = {
  pageBg:      t("#F7F4EF","#0D0D0D"),
  cardBg:      t("white","#1A1A1A"),
  cardBg2:     t("#FAFAF8","#222222"),
  navBg:       t("white","#141414"),
  navBorder:   t("#E5E7EB","#2A2A2A"),
  border:      t("#F0EDE8","#2A2A2A"),
  borderLight: t("#F3F4F6","#2D2D2D"),
  borderMid:   t("#F9F6F0","#242424"),
  textPrimary: t("#1F2937","#F1F0EE"),
  textSec:     t("#6B7280","#9CA3AF"),
  textMuted:   t("#6B7280","#9CA3AF"),
  alertBg:     t("#FFFBEB","#1C1400"),
  alertBdr:    t("#FDE68A","#78350F"),
  alertTxt:    t("#92400E","#FDE68A"),
  urgentBg:    t("#FEF9C3","#1C1400"),
  urgentBdr:   t("#FDE68A","#713F12"),
  urgentTxt:   t("#92400E","#FCD34D"),
  tipsBg:      t("#F0F9FF","#0C1F35"),
  tipsBdr:     t("#38BDF8","#1D4E8A"),
  tipsHead:    t("#0369A1","#60A5FA"),
  tipsTxt:     t("#0C4A6E","#93C5FD"),
  optBg:       t("#FDF4FF","#1C0F2E"),
  optBdr:      t("#E9D5FF","#3B1F5E"),
  optTxt:      t("#7C3AED","#C4B5FD"),
  sectionBg:   t("#FAFAF8","#1E1E1E"),
};
const v = (key, dark) => THEME[key][dark ? "dark" : "light"];

const CITY = {
  tokyo:   { color:"#3B7EFF", light:t("#EEF2FF","#1A2340"), border:t("#93C5FD","#2D4A7A") },
  kyoto:   { color:"#A855F7", light:t("#F5F3FF","#231840"), border:t("#C4B5FD","#4A3070") },
  osaka:   { color:"#F97316", light:t("#FFF7ED","#251200"), border:t("#FCA572","#5C2D00") },
  transit: { color:"#94A3B8", light:t("#F1F5F9","#1A1E26"), border:t("#94A3B8","#374151") },
  depart:  { color:"#34D399", light:t("#ECFDF5","#0A1E12"), border:t("#6EE7B7","#1A4030") },
};
const PERIOD = {
  matin: { label:"☀️ Matin",        color:t("#92400E","#FCD34D"), bg:t("#FFFBEB","#1C1200"), line:t("#FDE68A","#5C3800") },
  aprem: { label:"🌤 Après-midi",   color:t("#1E40AF","#60A5FA"), bg:t("#EFF6FF","#0A1628"), line:t("#BFDBFE","#1E3A6E") },
  soir:  { label:"🌙 Soir",         color:t("#4C1D95","#C4B5FD"), bg:t("#F5F3FF","#160D2E"), line:t("#DDD6FE","#3B1F6E") },
  nuit:  { label:"🌃 Nuit tardive", color:t("#374151","#CBD5E1"), bg:t("#F1F5F9","#0D1117"), line:t("#CBD5E1","#2D3748") },
};
const ST = {
  ok:   { label:"✅ Réservé",     bg:t("#DCFCE7","#14301E"), color:t("#166534","#4ADE80"), bdr:t("#BBF7D0","#1A5C30") },
  book: { label:"⚠️ À réserver", bg:t("#FEF9C3","#1C1400"), color:t("#854D0E","#FCD34D"), bdr:t("#FDE68A","#713F12") },
  free: { label:"🔓 Flexible",    bg:t("#F3F4F6","#252525"), color:t("#6B7280","#9CA3AF"), bdr:t("#E5E7EB","#3A3A3A") },
  note: { label:"ℹ️ Info",        bg:t("#EFF6FF","#0A1628"), color:t("#1D4ED8","#60A5FA"), bdr:t("#BFDBFE","#1E3A6E") },
  opt:  { label:"✨ Option bonus", bg:t("#FDF4FF","#1C0F2E"), color:t("#7E22CE","#C4B5FD"), bdr:t("#E9D5FF","#3B1F5E") },
};

const DAYS = [
  // ═══════════════════════════════════════════════════════
  // J1 — 27 AVRIL — ARRIVÉE HANEDA
  // ═══════════════════════════════════════════════════════
  {
    n:1, date:"27 avr", day:"Lun", city:"tokyo", title:"Arrivée Haneda → Asakusa", alert:null,
    sections:[
      { id:"matin", items:[
        {s:"note", t:"🕐 ~14h00 — ✈️ Haneda T3 → Asakusa — Itinéraire détaillé", sub:"Option A — Keikyu Line (recommandée, pas JR Pass) : Sortir côté Arrivées T3 → suivre panneaux 'Keikyu Line'. Prendre le Keikyu Airport Express (京急エアポート急行) direction Shinagawa/Asakusa. Descendre à Sengakuji (泉岳寺, 2 arrêts, 13 min) → changer pour Toei Asakusa Line direction Asakusa → descendre à Asakusa (浅草, 8 arrêts, 20 min). Total : 33 min, ~650¥ via Suica.\n\nOption B — JR Pass : Tokyo Monorail T3 → Hamamatsucho (14 min) → JR Yamanote Line direction Akihabara (3 arrêts) → Ginza Line → Asakusa. Total : ~55 min.\n\nAcheter la Suica IC Card à la machine bleue 'IC Card' dès la sortie douane — charger 5000¥ minimum. Elle sert pour tous les transports, konbinis, distributeurs."},
        {s:"free", t:"Check-in Asakusa Tobu Hotel — Matsuya-dori, Taito-ku", sub:"Adresse : 〒111-0032 東京都台東区雷門1-1-13. À 5 min à pied du Senso-ji (sortir par la porte principale et longer la rue vers le nord). Check-in à 14h — si arrivée avant 14h, déposer les bagages à la consigne (coinlocker) de la réception gratuitement. Demander un plan du quartier à la réception — ils en ont de très bons en français."},
      ]},
      { id:"aprem", items:[
        {s:"free", t:"🕒 15h30 — Senso-ji (浅草寺) — Circuit complet du temple", sub:"Entrée libre 24h/24. Depuis l'hôtel : longer la Matsuya-dori vers le sud, le Kaminarimon est visible au bout de la rue.\n\nKAMINARIMON (雷門) : La grande lanterne rouge pèse 670 kg. Observer les statues Fujin (dieu du vent, gauche) et Raijin (dieu du tonnerre, droite). Photo classique = se placer au centre de la rue face à la porte, cadrer pour inclure les deux tours au fond.\n\nNAKAMISE-DORI (仲見世通り) : 200 mètres de 54 boutiques. À droite en entrant : Kimuraya (aimono et melon pan), Sukeroku (ningyo-yaki 5 pièces ~600¥). À gauche : Asakusa Kinryuzan (poupées traditionnelles).\n\nHOZO-MON (宝蔵門) : La porte du trésor. 2 zori géantes (sandales) suspendues à l'arrière = offrande de Yamagata Prefecture.\n\nMAIN HALL (本堂) : Brûler un bâton d'encens (~200¥ la botte) et se purifier en se baissant sur la fumée — pour la santé selon la tradition.\n\nGOSHUIN : Tampon officiel du temple (御朱印) — se rendre au comptoir à gauche du temple principal, ~300¥. Très beau souvenir."},
        {s:"opt",  t:"Asakusa Culture Tourist Information Center — Terrasse gratuite 7F", sub:"Bâtiment en face du Kaminarimon (côté opposé). Ouvert 9h-22h. Ascenseur jusqu'au 7F. Terrasse panoramique entièrement gratuite avec vue directe plongeante sur le Kaminarimon et le Senso-ji — la meilleure photo du quartier sans billet. Au 2F : office de tourisme avec cartes en français et conseillers bilingues. Profiter également de la vue depuis la salle de réunion vitrée au 8F si accessible."},
        {s:"opt",  t:"Kappabashi Dougu Street (合羽橋道具街) — La rue des cuisiniers professionnels", sub:"🚶 15 min à pied nord-ouest de l'hôtel, ou bus A6 vers Tawaramachi. 800 mètres de 170 boutiques spécialisées.\n\nTOMIZAWA : meilleurs couteaux japonais (santoku, yanagiba).\n\nGANSO SHOKUHIN SAMPLE-YA (元祖食品サンプル屋) : fabricant des faux plats en plastique — on peut y assister à des ateliers de fabrication (~1500¥ pour faire son propre faux tempura).\n\nKAPPABASHI KITCHENWARE : baguettes, bols, assiettes en céramique au 1/3 du prix des boutiques touristiques. Ouvert majoritairement 9h-17h, fermé dimanche pour certaines boutiques. Le mardi et mercredi est idéal."},
        {s:"opt",  t:"Rickshaw (人力車) à Asakusa", sub:"Départ devant le Kaminarimon, côté droit. Deux compagnies : EBISUYA (えびすや, kimono rouge) et Tokyo RICKSHAW. Prix : 2 personnes, 10 min ~4000¥, 30 min ~10 000¥, 60 min ~16 000¥. Les jinrikisha-shi (tireurs) sont souvent bilingues. Circuit 30 min recommandé : Kaminarimon → Nakamise → Ruelles d'Asakusa → Sumida River → retour. Réservation possible sur le site ou sur place selon disponibilité."},
      ]},
      { id:"soir", items:[
        {s:"free", t:"🕖 18h30 — 🍽 Hoppy Street (ホッピー通り) — Dîner premier soir", sub:"À 5 min à pied de l'hôtel, dans le quartier de la Kototoi-dori. Deux ruelles parallèles en L formant 'Hoppy Street'. Ambiance populaire rétro, tables en plastique en terrasse, prix très abordables.\n\nIZAKAYA KAMIYA : Ouverte depuis 1880. Essayer le Denki Bran (電気ブラン) — cocktail maison depuis 1882, mélange de brandy, gin, vin et curacao (~350¥/verre).\n\nÀ COMMANDER : Yakitori à la carte (~150-200¥/brochette) — préférer negi-ma (poulet-poireau), kawa (peau croustillante), tsukune (boulette). Edamame (枝豆) en entrée ~400¥. Karaage (唐揚げ, poulet frit) à partager ~600¥.\n\nBOISSONS : Highball Suntory Kakubin (サントリー角ハイボール) ~400¥, Yuzu Sour (ゆずサワー) ~450¥, Umeshu soda (梅酒ソーダ) ~500¥, Chuhai Lemon (レモンチューハイ) ~400¥. Dire au serveur 'biru nashi de, [boisson] onegaishimasu' (pas de bière, [boisson] s'il vous plaît)."},
        {s:"opt",  t:"Bar à saké : Kurand Sake Market (クランドサケマーケット) Asakusa", sub:"Adresse : 浅草1-4-3, à 3 min de l'hôtel. Formule all-you-can-drink 100 sakés japonais sélectionnés : 2000¥/40 min ou 3000¥/80 min. Sakés classés par région et type — demander la carte en anglais. Commencer par un junmai ginjo léger et floral (ex: Dassai 23 ou Kubota), puis tester un nigori trouble. L'équipe explique les différences si demandé. Ouvert jusqu'à 23h. Idéal si décalage horaire empêche de dormir tôt."},
        {s:"opt",  t:"Senso-ji illuminé la nuit", sub:"Le temple est ouvert 24h/24. La nuit, les lanternes de bronze (800 en tout) sont allumées du crépuscule jusqu'à minuit. Vue particulièrement belle depuis l'arrière du temple côté jardin Denbo-in (depuis le portique nord). La rue Nakamise est fermée mais les abords du temple sont calmes et photogéniques. 10 min à pied de l'hôtel."},
      ]},
    ],
    tips:[
      "💴 CASH J1 : Retirer 40 000¥ minimum dès Haneda. ATM vert Japan Post Bank ou ATM 7-Eleven (logo rouge) dans le terminal — seuls compatibles avec les Visa/Mastercard étrangères. Code PIN 4 chiffres obligatoire.",
      "📱 OFFLINE J1 : Dans le terminal, connecter au wifi gratuit 'Haneda Free Wi-Fi' et télécharger Google Maps (zones Tokyo/Kyoto/Osaka/Nara) + Google Translate (pack japonais) + Navitime Japan. Ensuite vous êtes autonomes sans SIM.",
      "🛏 JET LAG : Rester éveillé jusqu'à 21h-22h heure japonaise même si épuisé. Exposer les yeux à la lumière naturelle l'après-midi (se promener dehors). Ne pas faire de sieste > 20 min.",
    ],
  },
  // ═══════════════════════════════════════════════════════
  // J2 — 28 AVRIL — AKIHABARA + SKYTREE
  // ═══════════════════════════════════════════════════════
  {
    n:2, date:"28 avr", day:"Mar", city:"tokyo", title:"Akihabara — Manga & Figurines + Skytree ✅ 18h", alert:null,
    sections:[
      { id:"matin", items:[
        {s:"free", t:"🕙 9h30 — Akihabara (秋葉原) — Guide Shopping Manga, Anime & Figurines", sub:"🚇 Depuis Asakusa : Ginza Line (浅草G-19 → 末広町G-14, 4 arrêts, 8 min, ~180¥) — sortie 3, direction 'Electric Town'. OU marcher 20 min le long de la Showa-dori.\n\nYODOBASHI CAMERA MULTIMEDIA AKIHABARA (ヨドバシカメラ) : Bâtiment principal + extension (9 étages). B1 = alimentation et souvenirs. 1F = smartphones, SIM touristiques. 2F = caméras et AV. 3F = PC. 4F = audio/casques. 5F = jeux vidéo. 6F = figurines et modélisme. 7F = instruments de musique. 8F = jouets et Lego.\n\nSUPER POTATO (スーパーポテト) : 1-2-10 Sotokanda, 4 étages. 1F = consoles NES/SNES/Mega Drive. 2F = N64, PS1. 3F = Saturn, Dreamcast, GameBoy. 4F = café rétro avec bornes d'arcade. Cartouches en parfait état 500-8000¥.\n\nRADIO KAIKAN (ラジオ会館) : 10 étages de figurines, cartes à collectionner (Pokémon notamment — packs scellés VSTAR/EX), manga, accessoires anime.\n\nANIMATE AKIHABARA : 5 étages de manga, light novels, CDs anime, goodies officiels."},
        {s:"free", t:"🕚 11h00 — Mandarake Complex (まんだらけコンプレックス) — Le temple du manga d'occasion", sub:"📍 Adresse : 3-11-12 Sotokanda (bâtiment gris 8 étages, à 3 min du Radio Kaikan).\n\n📚 CONCEPT : La plus grande chaîne de manga et anime d'occasion du monde. Chaque étage = une spécialité.\n\nÉTAGES : B2 = cosplay et vêtements. B1 = figurines rares et vintage. 1F = manga tous genres. 2F = CDs anime et doujinshi. 3F = cartes à collectionner (Pokémon, Yu-Gi-Oh) — parfois des cartes holographiques introuvables en Europe. 4F = jeux vidéo d'occasion. 5F = illustrations originales et artbooks dédicacés. 6F = poupées et BJD (Ball-Jointed Dolls). 7F = articles pour adultes (section séparée).\n\n💴 PRIX : Manga usagé 50-300¥/tome. Figurines vintage 300-50 000¥. Cartes Pokémon rares 500-30 000¥. Artbooks 500-5000¥.\n\n💡 ASTUCE : L'étage 3F (cartes) et l'étage 5F (art) sont les plus intéressants pour des souvenirs uniques introuvables en France. Payer en cash — certains étages n'acceptent pas les cartes."},
        {s:"opt",  t:"Maid Café — @home café (アットホームカフェ)", sub:"Adresse : Akihabara UDX Bldg 4F, 4-14-1 Sotokanda. Ouvert 11h30-22h. Prix : 550¥ cover charge/personne + conso obligatoire minimum ~700¥. Les 'maids' jouent un rôle de servantes en uniforme — elles font jouer des mini-jeux (pile ou face, pierre-feuille-ciseaux) et prononcent des incantations magiques sur les plats. Demander une photo polaroid avec une maid = ~500¥ supplémentaire. Expérience déconcertante mais représentative de la culture otaku tokyo. Durée recommandée : 45 min."},
        {s:"opt",  t:"Don Quijote Akihabara (ドン・キホーテ)", sub:"Adresse : 4-3-3 Sotokanda. Ouvert 24h/24. Le 'DONKI' multi-étages par excellence : B1 = alcools (excellente sélection whisky japonais Suntory/Nikka moins cher qu'à l'aéroport), 1F = friandises et KitKat japonais, 2F = cosmétiques et pharmacie, 3F = électronique, 4F = vêtements et costumes. Bon endroit pour acheter : KitKat sakura (~1200¥ la boîte 12 pièces), Pocky en éditions limitées, Pretz originaux. Mélodie publicitaire iconique et entêtante en boucle."},
      ]},
      { id:"aprem", items:[
        {s:"free", t:"🕓 15h00 — Solamachi (東京ソラマチ) — Shopping au pied du Skytree", sub:"🚇 Depuis Akihabara : Ginza Line direction Asakusa → Asakusa (2 arrêts) puis marcher 5 min vers le Skytree. OU depuis Akihabara JR → Kinshicho + Tobu Skytree Line (payant, ~10 min).\n\nLe Solamachi s'étend sur 4 étages (B1, 1F, 2F, 3F) et 312 boutiques.\n\nFOOD HALL (B1-1F) : Akimoto (bentos de luxe), Nanaya (matcha à 7 intensités différentes), Gontran Cherrier (boulangerie franco-japonaise).\n\nBOUTIQUES SOUVENIRS INCONTOURNABLES : Tokyo Banana Shop (バナナ型スポンジケーキ ~980¥/8 pièces — s'achètent ici sans file à l'aéroport), Royce Chocolate Boutique (chocolat Nama depuis Hokkaido), Solamachi boutique officielle Skytree.\n\nRESTAURANT 30F-31F : Terrasse Soleil (cuisine française avec vue Tokyo, réserver en ligne)."},
      ]},
      { id:"soir", items:[
        {s:"ok",   t:"✅ 🕕 18h00 — Tokyo Skytree (東京スカイツリー) — Heure confirmée", sub:"Entrée Skytree : côté est du bâtiment Solamachi, ascenseurs dédiés (panneaux 'Tower Entrance').\n\nTEMBO DECK (展望デッキ, 350m) : inclus dans votre billet. Ascenseur panoramique vitré en 50 secondes. À 18h : le soleil se couche derrière les buildings de Shinjuku côté ouest — spectaculaire. Côté est : vue sur Tokyo Bay et parfois le Mont Fuji au lointain. Jumelles disponibles à pièces.\n\nTEMBO GALLERIA (展望回廊, 445m) : supplément ~1000¥/pers à payer sur place. Tube en verre hélicoïdal à parcourir — vue dégagée à 360° depuis le tube. Vaut la différence si pas le vertige.\n\nRESTAURANT SKYTREE (340m) : Sky Restaurant 634 — réservation très conseillée, menu à partir de ~8000¥/pers. Sinon Musashi (ramen) ou Sky Café au niveau 350m.\n\nPrévoir 1h30-2h sur place. Quitter avant 20h pour éviter la cohue."},
        {s:"free", t:"🍽 Dîner post-Skytree — Options à Asakusa", sub:"Retour à pied à l'hôtel (5 min) puis choisir parmi :\n\nASAKUSA IMAHAN (浅草今半, sukiyaki depuis 1895) : Sukiyaki wagyu dans un ryotei traditionnel. Menu entrée à partir de ~6000¥/pers. Réservation souhaitée : 03-3841-1114.\n\nSOMETARO (染太郎) : Okonomiyaki à faire soi-même sur plaque intégrée à la table. ~1800¥/pers tout compris. Adresse : 2-2-2 Nishi-Asakusa, ruelle étroite.\n\nRAMEN KAGARI ASAKUSA : Ramen de poulet (tori paitan, bouillon onctueux blanc) — file 20-30 min mais vaut l'attente. Choisir 'tori soba' (~1200¥). À emporter ou manger debout au comptoir."},
        {s:"opt",  t:"Balade nocturne — Senso-ji + pont Azuma-bashi", sub:"Depuis l'hôtel, 7 min à pied vers le pont Azuma-bashi (吾妻橋) sur la Sumida-gawa — vue simultanée sur le Skytree illuminé (côté est) et l'enseigne Super Dry d'Asahi Beer (côté ouest). La nuit, le Senso-ji est quasi désert et les lanternes de bronze créent une atmosphère unique. Aller jusqu'à la pagode à 5 étages illuminée pour la photo de nuit."},
      ]},
    ],
    tips:[
      "⚡ AKIHABARA : Super Potato est souvent bondé le week-end — arriver à l'ouverture (11h) pour fouiller tranquillement. Certaines cartouches rétro sont en quantité limitée.",
      "📸 SKYTREE : pour photographier le coucher de soleil à 18h, se placer côté OUEST du Tembo Deck (fenêtres face à Shinjuku). Côté EST pour les photos de Tokyo Bay après 19h30.",
    ],
  },

  // ═══════════════════════════════════════════════════════
  // J3b — EXCURSION NIKKO (depuis Tokyo)
  // ═══════════════════════════════════════════════════════
  {
    n:3, nLabel:"N", date:"29 avr", day:"Mer", city:"tokyo", title:"Excursion Nikko — Tosho-gu & Futarasan 🏔",
    alert:"🎌 Showa Day — Nikko est ouvert et magnifique en période de cerisiers tardifs. Partir tôt pour éviter la foule de midi.",
    sections:[
      { id:"matin", items:[
        {s:"note", t:"🚄 6h30 — Départ depuis Asakusa → Nikko — Transport complet", sub:"🚇 OPTION JR PASS : Depuis Asakusa → Ueno (Ginza Line, 3 arrêts) → JR Tohoku-Honsen/Utsunomiya Line → Utsunomiya (1h50, JR Pass ✅) → JR Nikko Line → Nikko Station (45 min, JR Pass ✅). Total depuis Tokyo : ~2h35.\n\nDépart recommandé : Ueno 6h40 (Utsunomiya Line Rapid, semi-réservé — confirmer sur Navitime Japan). Arrivée Nikko ~9h15.\n\n🚄 OPTION TOBU LINE (recommandée, sans JR Pass) : Depuis Asakusa Station (Tobu Line, différente station) → Tobu-Nikko Station (1h50 direct avec le Tobu Limited Express Spacia). ~2800¥ aller simple. Plus rapide et direct — attention : pas couverte par le JR Pass.\n\nDe Nikko Station à Tosho-gu : Bus local depuis la gare (~730¥ aller) ou marche 30-40 min en montée."},
        {s:"free", t:"🕙 9h30 — Sanctuaire Tosho-gu (東照宮) — Le mausolée du shogun Ieyasu", sub:"Entrée : 1300¥ adulte (inclut sanctuaire principal + Yomei-mon + Nemuri-neko).\n\n⛩️ YOMEI-MON (陽明門) : 'La porte du crépuscule' — 12 colonnes couvertes de 508 sculptures polychromes. Légende : il manquerait volontairement une imperfection car la perfection appartient aux dieux.\n\n🐱 NEMURI-NEKO (眠り猫) : Le 'chat endormi' sculpté au-dessus de la porte Sakashitamon — une sculpture miniature (8cm) de bois laqué peint, considérée chef-d'œuvre par les connaisseurs. Passage sous la porte pour accéder au tombeau d'Ieyasu.\n\n🏛️ HONGUDEN (本殿) : Le sanctuaire principal en laque d'or et rouge vif. Seuls les visiteurs en tenue formelle peuvent pénétrer dans l'enceinte intérieure.\n\n🌳 SUGI AVENUE (杉並木) : L'allée de 13 000 cryptomères centenaires menant aux sanctuaires — classée UNESCO. Ambiance cathédrale végétale."},
        {s:"free", t:"🕚 11h30 — Sanctuaire Futarasan (二荒山神社) — Le sanctuaire de la montagne", sub:"🚶 10 min à pied depuis Tosho-gu. Entrée : 300¥.\n\nFondé en 782 par le moine Shodo Shonin. Dédié au dieu de la montagne Nikko-san. Moins spectaculaire que Tosho-gu mais atmosphère spirituelle plus authentique et très peu de touristes.\n\n🌸 Jardin de prières : lanternes de pierre recouvertes de mousse, cèdres millénaires, fontaine sacrée. En avril : cerisiers tardifs encore en fleurs.\n\nGoshuincho (livre de tampons officiels) disponible — ~500¥ pour un tampon Futarasan exclusif."},
      ]},
      { id:"aprem", items:[
        {s:"opt", t:"🕐 13h00 — Temple Rinnoji (輪王寺) — Les Trois Bouddhas géants", sub:"🚶 5 min de Tosho-gu. Entrée : 400¥ (séparé de Tosho-gu).\n\nLe grand Hondo (salle principale) abrite trois statues dorées de 8 mètres. Temple bouddhiste Tendai, fondé en 766. Jardin Shoyoen adjacent (~300¥) : jardin Edo traditionnel avec étang et pavillon de thé."},
        {s:"opt", t:"🕒 15h00 — Cascade Kegon (華厳の滝) — 97 mètres de chute", sub:"🚌 Bus depuis Nikko Station → Chuzenji-ko (~45 min, bus Tobu, ~1500¥ aller-retour). Accès à la plateforme principale : gratuit. Ascenseur jusqu'à la plateforme inférieure : ~570¥.\n\nLa cascade la plus célèbre du Japon (avec Nachi et Nunobiki). 97 mètres de chute directe. En mai : eau abondante post-fonte des neiges.\n\n⚠️ Temps supplémentaire : ajouter 1h30 minimum (trajet bus aller-retour + visite). Possible seulement si départ matinal avant 7h."},
        {s:"free", t:"🕔 15h30 — Déjeuner / street food à Nikko", sub:"GYOZA NO NIKKO : Chaîne locale près de la gare, gyozas artisanaux ~600¥.\n\nNIKKO MONKEYPARK (道の駅 日光) : Centre touristique avec restaurant à prix locaux. Yuba (豆腐皮, peau de tofu — spécialité de Nikko) en soupe ~1200¥ ou en sashimi ~800¥.\n\nYUBA est LA spécialité de Nikko depuis le 13e siècle (apportée par les moines de Kyoto). À goûter impérativement."},
      ]},
      { id:"soir", items:[
        {s:"free", t:"🕔 16h30 — Retour Tokyo + Dîner", sub:"Départ Nikko conseillé vers 16h30 pour arrivée Tokyo ~19h-19h30.\n\n🍽 DÎNER : retour Asakusa → Hoppy Street si envie d'izakaya familière, ou ramen Kagari Asakusa (tori paitan ~1200¥)."},
      ]},
    ],
    tips:[
      "🗺️ NIKKO PASS : Le 'Nikko All Area Pass' Tobu (~4500¥) couvre le train depuis Asakusa aller-retour + bus locaux Nikko. Meilleure option si pas de JR Pass ou si vous préférez la ligne Tobu (plus directe).",
      "🌸 CERISIERS TARDIFS : Nikko est en altitude (600m) — les cerisiers fleurissent 2-3 semaines après Tokyo. Fin avril = potentiellement encore en fleurs. Vérifier sakuraforecast.jp avant de partir.",
      "⏰ IMPÉRATIF : Partir d'Asakusa avant 7h pour avoir le temps de tout voir. Nikko ferme ses sanctuaires à 17h (16h en hiver).",
    ],
  },

  // ═══════════════════════════════════════════════════════
  // J4 — 30 AVRIL — HARAJUKU + TEAMLAB + SHIBUYA
  // ═══════════════════════════════════════════════════════
  {
    n:4, date:"30 avr", day:"Jeu", city:"tokyo", title:"Harajuku + TeamLab ✅ 15h + Shibuya Sky 🌇", alert:null,
    sections:[
      { id:"matin", items:[
        {s:"free", t:"🕗 8h00 — Meiji Jingu (明治神宮) — Protocole et itinéraire", sub:"🚇 Depuis Asakusa : Ginza Line (G-19) → Omotesando (G-02, 6 arrêts, 12 min) → marcher 10 min vers le nord jusqu'à l'entrée sud du sanctuaire. OU Yamanote Line → Harajuku (2 arrêts depuis Shibuya). Entrée : GRATUITE. Ouvert à l'aube, ferme à la tombée de la nuit.\n\nGRANDE TORII (大鳥居) : En cyprès hinoki, 12m de haut, reconstruit en 1975. S'incliner légèrement en passant sous la porte — protocole shinto.\n\nCHEMIN GRAVIER (参道) : 1,7 km à travers une forêt de 70 000 arbres de 365 espèces, tous plantés manuellement par 100 000 volontaires en 1920. Silence quasi-total à 8h.\n\nTONNEAUX DE SAKÉ (菰樽) : À mi-chemin côté droit. 245 tonneaux de Bourgogne offerts par la Bourgogne (côté opposé gauche). Offrandes symboliques au sanctuaire.\n\nSANCTUAIRE PRINCIPAL (本殿) : Prière shinto — 2 inclinaisons profondes, 2 claquements de mains, 1 inclinaison finale. Goshuin disponible (tampon officiel ~500¥) au bureau à droite.\n\nIRIS GARDEN (花菖蒲田) : Accessible par chemin secondaire. En floraison mi-juin mais le jardin intérieur est beau en avril. Entrée ~500¥."},
        {s:"opt",  t:"Yoyogi Park (代々木公園) — Adjacent au sanctuaire", sub:"Parc de 54 hectares séparé du sanctuaire par un parking. En Golden Week : groupes de danseurs de rockabilly le dimanche (phénomène Tokyo des années 80, encore présent), cosplay, pique-niques de familles, musique live. Entrée : gratuite. Le parc longe le bord ouest de la forêt du sanctuaire."},
        {s:"free", t:"🕙 10h00 — Takeshita Street (竹下通り) — Guide par stall", sub:"🚶 5 min depuis la forêt Meiji, traverser la rue Meiji-dori. Ouvert 10h-20h pour la majorité. 350 mètres entièrement piétons.\n\nCRÊPES JAPONAISES : Angela's Crêpe (アンジェラ's) au milieu de la rue — crêpes roulées en cône, garnitures à la crème fouettée, fraises, matcha, cheesecake ~500-800¥.\n\nTAKOYAKI : stand mi-parcours, ~600¥/6 pièces.\n\nCOTTON CANDY (バブルガム綿菓子) : Barbe à papa en formes d'animaux, photos Instagram garanties ~700¥.\n\nMODE HARAJUKU : 6%DOKIDOKI (バービー rose et paillettes), SWIMMER, WC (mode douce et pastel).\n\nLAFORET HARAJUKU : Grand magasin à l'entrée de la rue — mode avant-gardiste japonaise sur 8 étages, boutiques changeant toutes les saisons."},
        {s:"opt",  t:"Omotesando (表参道) — Architecture et déjeuner haut de gamme", sub:"🚶 10 min vers le sud depuis Takeshita. Large avenue bordée de zelkovas centenaires.\n\nÀ VOIR ABSOLUMENT : Prada Aoyama (Herzog & de Meuron, 2003) — façade en losanges de verre convexes. Hermès Maison (Renzo Piano, 2001) — façade de 15 000 briques de verre. Omotesando Hills (Tadao Ando, 2006) — mall en spirale ramp-style inspiré du Guggenheim.\n\nDÉJEUNER : Aoyama Flower Market Tea House (omotesando Hills B1F) — déjeuner dans un café entouré de fleurs fraîches. Ou UDON MUGI TO OLIVE au sous-sol d'Omotesando Hills — udon premium ~1500¥."},
      ]},
      { id:"aprem", items:[
        {s:"ok",   t:"✅ 🕒 15h00 — TeamLab Planets (チームラボプラネッツ) — Heure confirmée", sub:"🚇 Depuis Omotesando : Ginza Line (G-02) → Shimbashi (G-08) → Rinkai Line → Shin-Toyosu (20 min de Shimbashi) → marcher 5 min. Total depuis Omotesando : ~40 min.\n\nARRIVÉE : Présenter le QR code, se chausser dans les casiers (chaussures obligatoirement), retrousser les pantalons jusqu'aux genoux (on marche dans l'eau).\n\nLES 5 ŒUVRES MAJEURES : (1) 'Floating in the Falling Universe of Flowers' (Infinity Room) — la plus grande salle, fleurs numériques tombent autour de vous selon la saison du jour. Rester IMMOBILE 2-3 min : les fleurs réagissent à votre corps et créent un bloom autour de vous. (2) 'Universe of Water Particles' — marcher dans l'eau jusqu'aux genoux dans une cascade. (3) 'Soft Black Hole' — sol moelleux en velours qui s'enfonce sous les pas. (4) 'The Infinite Crystal Universe' (si inclus) — cristaux lumineux infinis. (5) 'Floating Flower Garden' — orchidées qui remontent au plafond à votre approche.\n\nDurée totale : 1h30 minimum. Sortie estimée à 16h45-17h."},
        {s:"opt",  t:"Toyosu Market (豊洲市場) — Vue depuis la passerelle si encore ouvert", sub:"🚶 5 min de TeamLab Planets (suivre le canal). Fermé le dimanche et certains jours fériés — vérifier tukiji.metro.tokyo.jp. Galerie de vision (passerelle vitrée) au-dessus de la criée au thon : accès gratuit, 5h-15h30. En fin d'après-midi seul le bâtiment de commerce reste ouvert. Les restaurants Toyosu Uogashi (3F) ferment vers 14h."},
      ]},
      { id:"aprem", items:[
        {s:"free", t:"🕓 15h45 — Odaiba (お台場) — Île artificielle futuriste", sub:"🚂 Depuis Shin-Toyosu (sortie TeamLab) : Rinkai Line → Tenkubashi → Yurikamome depuis Shimbashi (~10 min à pied) → Odaiba-Kaihinkoen (15 min). Total depuis TeamLab : ~30 min.\n\n🗽 REPLICA STATUE DE LA LIBERTÉ : 1/7e de l'originale, face à Rainbow Bridge. Photo emblématique avec le pont et la skyline de Tokyo en fond.\n\n🤖 GUNDAM UNICORN RX-0 : Devant DiverCity Tokyo Plaza — Gundam grandeur nature (19,7m). Transformations avec sons et lumières toutes les heures dès 11h. Entrée extérieure gratuite.\n\n🌉 VUE RAINBOW BRIDGE : Depuis la plage Odaiba Kaigan (sable artificiel), vue panoramique sur le pont et la skyline de Tokyo. Coucher de soleil face à la ville = lumière magique.\n\n🛍️ AQUA CITY ODAIBA : Mall avec restaurants, cinéma, vue directe sur le pont depuis les terrasses du 5F. Vue nocturne sur Rainbow Bridge depuis le restaurant."},
        {s:"opt", t:"✨ Teamlab Borderless (si réouvert en 2026)", sub:"Différent de Planets — installations numériques sans murs ni limites (concept 'borderless'). Vérifier teamlab.art pour la réouverture. Anciennement à Odaiba, déplacé à Azabudai Hills — vérifier la nouvelle adresse."},
      ]},
      { id:"soir", items:[
        {s:"book", t:"🌇 18h30 — Shibuya Sky (渋谷スカイ) — Coucher de soleil ⚠️ Réserver", sub:"⚠️ RÉSERVATION OBLIGATOIRE sur shibuya-scramble-square.com — section 'SKY'. 2000¥/adulte.\n\n🚇 Depuis Odaiba : Yurikamome → Shimbashi + Ginza Line → Shibuya (~35 min). Arriver à 18h15 au comptoir (Scramble Square Tower, niveau 2F → ascenseur dédié jusqu'au 46F).\n\nVUE DEPUIS LE TOIT (229m) : Toit entièrement ouvert avec garde-corps en verre transparent. Le Scramble Crossing est directement en contrebas. En mai à 18h30 : soleil se couchant derrière Shinjuku à l'ouest, dégradé rose-orange-violet exceptionnel.\n\nEDGE of SKY : Zone en porte-à-faux avec hamacs suspendus dans les airs — vertige garanti. File 5-15 min.\n\nOn distingue Tokyo Tower (sud), Tokyo Skytree (nord-est), Shinjuku (ouest). Durée recommandée : 1h."},
        {s:"free", t:"🕗 19h45 — Shibuya Crossing + Dîner", sub:"🚶 2 min depuis le Scramble Square en descendant. Traverser le carrefour (jusqu'à 3000 personnes simultanément). Vue depuis le Starbucks Shibuya Tsutaya (2F, côté fenêtre).\n\n🍣 KATSU MIDORI SUSHI : Sushi qualité marché-poisson. Shibuya Mark City 1F. File ~20-30 min. Assiettes 130-350¥.\n\n🍜 AFURI HARAJUKU : Ramen au bouillon yuzu (~1200¥) — léger et aromatique. File ~20 min."},
      ]},
    ],
    tips:[
      "⏰ TIMING J4 : TeamLab → Odaiba (~17h) → Shibuya Sky 18h30 (transit ~35 min). Quitter Odaiba à 17h45 au plus tard.",
      "🌇 SHIBUYA SKY : Réserver dès maintenant sur shibuya-scramble-square.com — sold out en Golden Week.",
      "🌉 ODAIBA : Vue nocturne sur Rainbow Bridge depuis la plage = une des plus belles de Tokyo.",
    ],
  },
  // ═══════════════════════════════════════════════════════
  // J5 — 1 MAI — KYU-FURUKAWA + DAWN + DAIKOKU
  // ═══════════════════════════════════════════════════════
  {
    n:5, date:"1 mai", day:"Ven", city:"tokyo", title:"Kyu-Furukawa + DAWN Robot Café 🤖 + Daikoku PA 🚗",
    alert:"🎌 Showa Day — Jour férié. Les transports sont chargés entre 11h-15h. Kyu-Furukawa reste calme grâce à son manque de notoriété internationale.",
    sections:[
      { id:"matin", items:[
        {s:"free", t:"🕘 9h00 — Jardins Kyu-Furukawa (旧古河庭園) — Festival des roses", sub:"🚇 Depuis Asakusa : Ginza Line (G-19) → Ueno (G-16, 3 arrêts) → Changer pour Tokyo Metro Namboku Line → Nishigahara (N-14, 6 arrêts). Total : ~35 min, ~240¥. Sortie 1, puis 7 min à pied en suivant les panneaux '旧古河庭園'.\n\nEntrée : 150¥ adulte. Ouvert 9h-17h (dernière entrée 16h30).\n\nROSERAIE OUEST : 3000 rosiers de 100 variétés plantés en 1917. En fin avril : floraison maximale. Varieties japonaises rares : Mister Lincoln (rouge bordeaux), Peace (jaune-rosé), Queen Elizabeth (rose). Parfum intense le matin.\n\nVILLA WESTERN STYLE : Conçue par Josiah Conder (même architecte que le Nikolai-do de Tokyo). Style Tudor, briques rouges. Visitable uniquement lors d'événements spéciaux — vérifier le site (teien.tokyo-park.or.jp) pour les jours 'villa ouverte'.\n\nJARDIN JAPONAIS CLASSIQUE (bas) : Étang avec carpes koï, pavillon de thé, cascade. Le jardin descend en terrasses depuis la villa. Le sentier en pierre débouche sur un bassin entouré d'azalées encore en fleurs fin avril.\n\nDurée recommandée : 1h30."},
        {s:"opt",  t:"Rikugien Garden (六義園) — 5 min à pied depuis Kyu-Furukawa", sub:"Adresse : 6-16-3 Hon-Komagome. Entrée : 300¥. Ouvert 9h-17h. Le jardin Edo de 300 ans le plus admiré de Tokyo. 88 paysages inspirés des 36 Poètes Immortels et du Manyoshu (recueil de poèmes de l'an 700). L'étang central avec son île se reflète dans l'eau calme le matin. Suivre le sentier dans le sens des aiguilles d'une montre pour voir les 88 scènes dans l'ordre. Le Tsutsuji-chaya (テツジ茶屋, pavillon de thé) propose matcha + wagashi (gâteau de saison) pour ~600¥ — très agréable après la marche dans le jardin."},
        {s:"opt",  t:"Quartier Yanaka (谷中) — Le Tokyo d'avant-guerre", sub:"🚇 Depuis Nishigahara : Namboku Line → Komagome (N-14 → N-15, 1 arrêt) → JR Yamanote → Nippori (2 arrêts). Total depuis Kyu-Furukawa : 15 min.\n\nYanaka Ginza (谷中銀座) : Shotengai (galerie marchande couverte) de 70 boutiques, la plus authentique de Tokyo. À tester : Nakamuraya (menchikatsu — croquette de viande ~150¥), Yanakado (senbei grillé devant vous, ~80¥/pièce).\n\nCimetière Yanaka (谷中霊園) : 7000 tombes dont celle du dernier shogun Tokugawa Yoshinobu. Promenade possible parmi les cerisiers et les chats errants du quartier. Atmosphère paisible et hors du temps."},
      ]},
      { id:"aprem", items:[
        {s:"free", t:"🕐 13h00 — Parlement Japonais Kokkai-gijido + quartier Nagatacho", sub:"🚇 Depuis Nishigahara : Namboku Line → Nagatacho (N-09, 5 arrêts, 10 min, ~200¥). Sortie 1.\n\nKOKKAI-GIJIDO : Le parlement en granit gris, achevé en 1936. La chambre des représentants (est) et la chambre des conseillers (ouest) flanquent la tour centrale de 65,45m. Visites intérieures gratuites du lundi au vendredi uniquement, en semaine hors vacances (kokkai.go.jp pour les horaires). Jours fériés : extérieur et jardins accessibles librement.\n\nHIBIYA PARK (日比谷公園, adjacent) : Premier parc occidental du Japon (1903). Parterres de fleurs, fontaine centrale, serre tropicale gratuite. Cafés en terrasse très agréables. Roseraie en bloom fin avril."},
        {s:"opt",  t:"Kitte Tokyo (キッテ) — Toit panoramique sur les Shinkansen", sub:"🚇 → JR Yamanote → Yurakucho (1 arrêt) puis 3 min à pied vers Tokyo Station. Bâtiment : ancien bureau de poste central réhabilité par Kengo Kuma.\n\nTOIT (4F terrasse) : gratuit, vue directe sur les voies de Tokyo Station (9 voies simultanément visibles). Les Shinkansen Nozomi, Hikari, Kodama défilent toutes les 3-4 min. Meilleur point de vue sur la façade en brique rouge de Tokyo Station (1914).\n\nSHOPPING KITTE : 1F = épicerie fine Atre (wagashi de luxe, saké premium). 3F = musée de la poste (gratuit, histoire du Japon postal)."},
      ]},
      { id:"soir", items:[
        {s:"book", t:"🕔 16h00 — 🤖 DAWN Avatar Robot Café (Bunshin Robot Café) — Nihonbashi", sub:"📍 Adresse : 3-8-3 Nihonbashi-Honcho, Chuo-ku, Tokyo (Nihonbashi Life Science Building 1F). Fermé le jeudi. Ouvert 11h-19h.\n\n🚇 Depuis le Parlement (Nagatacho) : Hanzomon Line → Mitsukoshimae ou Marunouchi Line → Otemachi, 5 min à pied vers Nihonbashi. Total ~15 min.\n\n🤖 CONCEPT : Le Robot Restaurant Shinjuku est définitivement fermé depuis 2020. DAWN est son successeur légitime et infiniment plus attachant. Des personnes atteintes de maladies invalidantes (SLA, paralysie, sclérose en plaques) téléopèrent depuis chez elles des robots OriHime et OriHime-D pour vous servir et discuter avec vous. Les 60+ \"pilotes\" travaillent grâce à la technologie alors qu'ils ne peuvent pas quitter leur lit.\n\n💴 TARIFS : OriHime Pass (service café simple, 1 consommation) = 2200¥. OriHime Diner (repas complet servi par robot) = 5500¥/pers — réservation obligatoire en ligne sur dawn2021.orylab.com.\n\n⏱️ Durée recommandée : 1h pour le café, 1h30 pour le dîner.\n\n📅 Pour le dîner robot : réserver à l'avance (pas de réservation le jour même). Si pas de dîner réservé, venir pour un café et observer les robots en service — déjà fascinant. Parfait avant de partir pour Daikoku PA en fin de soirée."},
        {s:"free", t:"🕖 19h00 — 🍽 Dîner Shinjuku ou Nihonbashi", sub:"Après la journée chargée, plusieurs options selon énergie :\n\nOmoide Yokocho (思い出横丁) : Ruelles yakitori fumantes côté ouest de la gare de Shinjuku. Atmosphère rétro, prix accessibles. Commander negi-ma, kawa, tsukune. Yuzu sour ou saké chaud.\n\nIchiran Shinjuku : Ramen en isoloir individuel, 980¥. Ouvert 24h.\n\nKonbini si épuisement post-Daikoku (nuit tardive) : Onigiri premium + bento."},
      ]},
      { id:"nuit", items:[
        {s:"free", t:"🕙 22h30 — 🚗 Daikoku Parking Area (大黒パーキングエリア) — Vendredi soir !", sub:"🚄 JR Keihin-Tohoku depuis Shimbashi ou Tokyo → Yokohama (~35 min, JR Pass ✅). Sortie Yokohama East Exit → taxi '大黒パーキングエリア' (~15 min, ~2000¥).\n\nVENDREDI SOIR = LE meilleur créneau de la semaine. Les propriétaires commencent la cruise avant le samedi. Certains vendredis : 500-1000 voitures entre minuit et 3h.\n\nGT-R R34/R35, Toyota Supra A80, Mazda RX-7 FD, Honda NSX, supercars européens, builds modifiés. Ambiance conviviale — les propriétaires adorent discuter et poser pour les photos.\n\nPic horaire : 23h-1h. Entrée gratuite. Cadrer avec le Yokohama Bay Bridge illuminé en fond.\n\nRetour : taxi → Yokohama Station + JR → Asakusa, retour hôtel ~2h."},
      ]},
    ],
    tips:[
      "🌹 KYU-FURUKAWA : Le jeudi et vendredi sont les meilleurs jours (moins de foule japonaise que le week-end). Arriver à l'ouverture (9h) pour les photos de roseraie sans touristes.",
      "🥩 WAGYU : La différence entre les grades A3/A4/A5 se voit au marbre (persillage blanc dans la viande rouge). A5 = marbre maximum, fondant total mais très riche — 2-3 tranches suffisent par personne.",
    ],
  },
  {
    n:6, nLabel:"H", date:"2 mai", day:"Sam", city:"transit", title:"Hakone — Lac Ashi, Ropeway & Onsen 🗻 (sac léger)",
    alert:"🎒 Journée sac léger — Laisser les valises à l'hôtel Asakusa. Hakone en train léger, retour le soir pour dormir à Tokyo. Pas de stress bagages !",
    sections:[
      { id:"matin", items:[
        {s:"note", t:"🚄 7h00 — Départ Tokyo → Hakone — Transport détaillé", sub:"🚄 SHINKANSEN KODAMA (JR Pass ✅) : Depuis Tokyo Station → Odawara (35 min, ~4000¥ valeur, JR Pass inclus). Depuis Odawara : Hakone Tozan Railway → Hakone-Yumoto (15 min, ~320¥). Total depuis Tokyo : ~1h.\n\n🚌 OPTION ROMANCECAR (non JR Pass) : Odakyu Limited Express Romancecar depuis Shinjuku → Hakone-Yumoto (1h25 direct, ~2500¥ aller). Plus confortable avec sièges désignés panoramiques.\n\n💡 HAKONE FREE PASS (Odakyu, ~6000¥/2 jours) : Couvre Romancecar depuis Shinjuku + tous les transports à l'intérieur de Hakone (bus, ropeway, bateau lac Ashi). Non compatible JR Pass mais souvent plus économique."},
        {s:"free", t:"🕘 9h00 — Lac Ashi (芦ノ湖) — Le lac et le Fuji", sub:"🚌 Depuis Hakone-Yumoto : Hakone Tozan Bus → Togendai ou Moto-Hakone (~50 min, ~1000¥ ou inclus Hakone Free Pass).\n\n⛵ CROISIÈRE LAC ASHI : Bateaux en forme de galions pirates (Hakone Sightseeing Cruise) traversent le lac d'est en ouest. ~1000¥ aller. Vue sur le Fuji depuis le lac quand ciel dégagé.\n\n🗻 VUE FUJI : La vue 'classique' carte postale du Fuji reflété dans le lac Ashi se prend depuis le sanctuaire Hakone Jinja (côté Moto-Hakone). Parfois visible dès l'aube, souvent caché par les nuages après 10h.\n\n⛩️ HAKONE JINJA : Sanctuaire shinto dans une forêt de cryptomères millénaires, directement au bord du lac. Torii rouge les pieds dans l'eau = la photo d'Hakone. Entrée gratuite."},
        {s:"free", t:"🕙 10h30 — Ropeway Komagatake (駒ヶ岳ロープウェー)", sub:"🚡 Depuis Togendai : Hakone Ropeway → Owakudani (30 min, ~1850¥ aller-retour) → continuer vers Ubako et Sounzan.\n\nOWAKUDANI (大涌谷) : Zone volcanique active avec fumerolles de soufre. Vue panoramique sur le Fuji si ciel dégagé. KURO-TAMAGO (黒卵) : Oeufs durs cuits dans les sources sulfureuses (coquille noire) — légende : chaque oeuf mangé ici ajoute 7 ans à votre vie. 5 oeufs ~500¥.\n\n⚠️ NIVEAU D'ALERTE : Owakudani peut être partiellement fermé selon activité volcanique. Vérifier hakonenavi.jp avant le départ."},
      ]},
      { id:"aprem", items:[
        {s:"opt", t:"🕐 13h30 — Mont Fuji 5e Station — Contraintes saisonnières", sub:"⚠️ ACCÈS EN MAI : La Route Fuji Subaru (côté Yamanashi, 5e station à 2300m) ouvre généralement mi-avril, mais peut rester fermée jusqu'à fin avril selon enneigement. En 2024 et 2025 : ouverture autour du 15-20 avril. Vérifier sur fujisan-climb.jp avant de planifier.\n\nSi ouverte : Bus Fujikyu depuis Kawaguchiko Station (~2100¥) → 5e Station (50 min). Vue exceptionnelle sur les Alpes japonaises et le cratère.\n\nSi fermée : La vue sur le Fuji depuis le lac Kawaguchi (à 30 min d'Hakone en bus) reste splendide — torii orange d'Arakurayama Sengen Park avec pagode et Fuji en fond = photo emblématique.\n\nDurée excursion Fuji 5e Station : 3h minimum depuis Hakone. Faisable seulement si départ très matinal (6h30-7h depuis Tokyo)."},
        {s:"free", t:"🕒 15h00 — Onsen à Hakone — Bain thermal au pied du Fuji", sub:"♨️ TENZAN TOHJI-KYO (天山湯治郷) : Onsen traditionnel à Hakone-Yumoto. Bains mixtes en plein air dans la forêt. ~1500¥. Serviettes disponibles en location.\n\nYUMOTO FUJIYA (湯本富士屋ホテル) : Onsen de l'hôtel historique, accessible aux non-résidents ~1800¥. Sources alcalines douces — idéales pour la peau.\n\n📋 PROTOCOLE ONSEN : Douche complète (savon + shampoing) AVANT d'entrer dans le bain commun. Pas de maillot. Cheveux attachés ou sous serviette. Tatouages visibles = refus dans certains établissements (vérifier avant).\n\nEau à 39-42°C — rester max 15 min par session pour éviter le malaise. Boire de l'eau avant et après."},
      ]},
      { id:"soir", items:[
        {s:"free", t:"🕔 17h00 — Hakone → Kyoto via Shinkansen (JR Pass ✅)", sub:"🚄 Depuis Hakone-Yumoto → Odawara (Hakone Tozan, 15 min) → Shinkansen HIKARI → Kyoto Station (2h40, JR Pass ✅).\n\nDépart Odawara conseillé : 17h30-18h pour arrivée Kyoto ~20h-20h30.\n\nÀ FAIRE EN GARE D'ODAWARA : Acheter un Ekiben (bento de gare) avant d'embarquer — Odawara est célèbre pour ses bentos au bœuf local et au poisson séché.\n\n⚠️ IMPORTANT : Ce jour est la transition vers Kyoto. S'assurer que les sièges Shinkansen sont réservés à l'avance (guichet JR).\n\n🏨 CHECK-IN THE BLOSSOM KYOTO (~21h) : Arrivée tardive — appeler l'hôtel pour confirmer l'accueil tardif (late check-in). La plupart des hôtels japonais de catégorie ont un service de réception 24h/24.\n\n🍽 DÎNER TARDIF KYOTO : Ramen Ippudo Kyoto (ouvert jusqu'à 23h) ou konbini de qualité (FamilyMart → onigiri premium). Garder l'énergie pour J8 Arashiyama avec départ 6h."},
      ]},
    ],
    tips:[
      "🗻 MÉTÉO FUJI : Le matin (avant 10h) = la fenêtre de visibilité la plus fiable. L'après-midi, les nuages couvrent souvent le sommet. Vérifier mountain-forecast.com/mountains/mount-fuji la veille.",
      "🎫 HAKONE FREE PASS vs JR PASS : Le Hakone Free Pass d'Odakyu (~6000¥/2j depuis Shinjuku) couvre tous les transports internes. Avec le JR Pass, vous économisez uniquement le Shinkansen jusqu'à Odawara (~4000¥ valeur) mais payez les transports internes séparément. Calculer selon votre situation.",
      "♨️ ONSEN : Si vous avez des tatouages, appeler avant de réserver. Tenzan Tohji-kyo est l'un des plus tolérants. Prévoir ~2h pour profiter pleinement.",
    ],
  },

  // ═══════════════════════════════════════════════════════
  // J7 — 3 MAI — TOKYO → KYOTO
  // ═══════════════════════════════════════════════════════
  {
    n:7, date:"3 mai", day:"Dim", city:"transit", title:"Matinée Tokyo → Shinkansen → Kyoto 🚄",
    alert:"🎌 Journée Constitution — Shinkansen très chargé. Sièges OBLIGATOIREMENT réservés à l'avance.",
    sections:[
      { id:"matin", items:[
        {s:"free", t:"🕗 8h00 — Dernier matin à Asakusa — Avant le grand départ", sub:"Petit-déjeuner inclus à l'hôtel. Balade légère vers le Senso-ji à l'aube (quasi désert à 8h) pour une dernière photo du temple matinal.\n\nNakamise-dori ouvre à 9h30 — dernière chance pour des souvenirs oubliés.\n\nCheck-out à 11h. Demander à la réception de garder les bagages si le Shinkansen part plus tard."},
        {s:"opt", t:"🕙 9h00 — Shinjuku Gyoen (新宿御苑) — Option matinée tranquille", sub:"🚇 Ginza Line → Shinjuku (~8 min). Entrée 500¥. Ouvert 9h-16h30.\n\nJardin national immense et calme le matin. Mix jardin anglais, japonais et serre française. L'alcool y est interdit — parfait pour un moment de sérénité avant le transit.\n\nDurée : 1h. Sortir avant 11h pour récupérer les bagages et filer vers Tokyo Station."},
      ]},
      { id:"aprem", items:[
        {s:"book", t:"🕚 11h30 — Shinkansen HIKARI Tokyo → Kyoto (JR Pass ✅) ⚠️ Sièges réservés", sub:"🚇 Depuis Asakusa : Ginza Line → Nihonbashi + Tozai Line → Tokyo Station, ou taxi direct ~2500¥ (pratique avec bagages).\n\nHIKARI uniquement — pas le Nozomi (non couvert JR Pass). Durée : 2h40. Voie 14-18.\n\nSIÈGE : Fenêtre côté GAUCHE (sens de marche) pour voir le Mont Fuji entre Shin-Fuji et Mishima.\n\nEKIBEN : Gransta Mall (B1-B2 Tokyo Station) avant d'embarquer — bento Wagyu Gyutan, saumon au koji, sushi pressé.\n\nArrivée Kyoto ~14h → check-in The Blossom Kyoto (à partir de 15h) → explorer Pontocho dès le soir."},
        {s:"opt", t:"🕒 17h00 — Nishiki Market (錦市場) — Premier contact Kyoto", sub:"'Le restaurant de Kyoto' — galerie couverte de 390m, 130 boutiques. Ouvert jusqu'à 18h environ.\n\nTsukemono (légumes marinés), takoyaki de poulpe, dango grillé, amazake chaud."},
      ]},
      { id:"soir", items:[
        {s:"free", t:"🕖 18h30 — Pontocho (先斗町) — Première soirée Kyoto", sub:"Ruelle pavée de 500m longeant la rivière Kamo. Terrasses kawayuka en surplomb de la rivière (installées dès le 1er mai).\n\nSaké Gekkeikan ou Kizakura (brassés à Fushimi, 5km) ~800¥/verre, Kyo-no-hana cocktail (saké + yuzu), Highball Kakubin.\n\nNombreux restaurants sans réservation en début de ruelle jusqu'à 19h."},
        {s:"free", t:"🍽 Dîner Kyoto — Premier soir", sub:"Misoka-an Kawamichiya (そば 御多福) : Udon maison depuis 1716. Commander 'nishiki-ten udon' (7 garnitures, ~1800¥).\n\nIppudo Kyoto : Ramen tonkotsu adapté Kyoto (bouillon légèrement sucré). En face de Nishiki Market. ~1200¥."},
      ]},
    ],
    tips:[
      "🗻 MONT FUJI : Visible depuis le Shinkansen côté gauche, ~20-25 min après Tokyo. Vérifier la météo de Shizuoka la veille.",
      "🎫 RÉFLEXE KYOTO STATION : Activer le JR Pass au guichet si pas encore fait, puis réserver sièges Kyoto→Osaka (7 mai) et Osaka→Tokyo (10 mai) immédiatement.",
      "🏨 CHECK-IN TARDIF : Si arrivée avant 15h, déposer les bagages à la réception et partir explorer Nishiki Market directement.",
    ],
  },

  // ═══════════════════════════════════════════════════════
  // J8 — 4 MAI — ARASHIYAMA
  // ═══════════════════════════════════════════════════════
  {
    n:8, date:"4 mai", day:"Lun", city:"kyoto", title:"Arashiyama — Bambous & Temples",
    alert:"🎌 Jour Vert — Arashiyama au pic absolu. Stratégie lever du soleil non-négociable.",
    sections:[
      { id:"matin", items:[
        {s:"free", t:"🕕 6h45 — 🎋 Forêt de bambou d'Arashiyama — Lever du soleil", sub:"⏰ ARRIVER AVANT 7H — c'est la règle la plus importante du voyage.\n\n🚌 Bus 28 depuis Shijo-Kawaramachi (2 arrêts depuis l'hôtel à pied) → Arashiyama (35-40 min, 230¥ Suica). Départ bus à 6h10 pour arriver vers 6h50. OU JR Sagano Line depuis Kyoto Station → Saga-Arashiyama (22 min, JR Pass ✅) — premier train 6h09 depuis Kyoto Station.\n\nDANS LA FORÊT : L'entrée principale est entre le Tenryu-ji et le sanctuaire Nonomiya. Le chemin droit de 400 mètres est délimité par des milliers de tiges de bambou géants (Phyllostachys reticulata) de 20-25 mètres. À l'aube : lumière verte filtrée en rayons obliques, sons de vent dans les bambous, aucun touriste.\n\nCOMPOSITION PHOTO : Se placer au centre du chemin, cadrer vers le haut — les bambous se rejoignent visuellement au-dessus. La lumière directe du soleil crée des rayons verticaux entre 7h-7h30. Utiliser le mode portrait/bokeh pour isoler une tige.\n\nAPRÈS 9H : Des dizaines de bus de tourisme déversent les passagers — impossible de faire une photo sans monde. La magie disparaît."},
        {s:"free", t:"🕘 9h00 — Adashino Nenbutsuji (Nenbutsuji) — Temple des âmes oubliées", sub:"🚶 25 min à pied depuis la forêt de bambou, en remontant vers le nord (direction Sagano collines). Suivre la Sagano Toriimoto-dori (rue aux maisons d'époque). Ouvert 9h-17h. Entrée 500¥.\n\nHISTOIRE : Temple fondé au 9e siècle par le moine Kukai (Kobo Daishi) pour honorer les personnes mortes sans sépulture dans la région. 8000 statues de pierre bouddhistes (jizo et bouddhas) dispersées dans une forêt moussue.\n\nATMOSPHÈRE : Une des expériences spirituelles les plus intenses de Kyoto. Silence complet, pas de cérémonie touristique. Les statues sont recouvertes de mousse de plusieurs siècles. Très peu de visiteurs étrangers (la plupart ne savent pas que ça existe).\n\nDurée : 30-45 min."},
        {s:"opt",  t:"Jojakko-ji (常寂光寺) — Temple de la mousse secrète", sub:"🚶 15 min à pied d'Adashino en redescendant vers Arashiyama. Ouvert 9h-17h. Entrée 500¥. Temple de montagne avec un sentier escarpé montant vers une pagode (5 étages, période Edo). Le sol est entièrement couvert de mousse de plusieurs espèces (21 types différents comptabilisés). La pagode au sommet offre une vue sur Arashiyama avec une touche de toit de la forêt de bambou visible. Moins connu que Kinkaku-ji mais d'une beauté contemplative incomparable."},
        {s:"free", t:"🕙 10h30 — Tenryu-ji (Tenryu-ji) — Jardin Zen UNESCO", sub:"🚶 Retour vers le bas d'Arashiyama, adjacent à la forêt de bambou. Ouvert 8h30-17h30. Entrée jardin : 500¥, temple intérieur : 300¥ supplémentaire.\n\nJARDIN SOGEN : Dessiné par Muso Soseki en 1339. Étang Sogen avec des pierres dressées en arrière-plan représentant les montagnes Arashiyama et Kameyama. Style Shakkei (emprunt de paysage) = le jardin utilise les montagnes naturelles comme décor de fond. Aucune montagne artificielle dans le jardin — tout est naturel, intégré visuellement.\n\nSAISON ACTUELLE : Azalées en fleurs fin avril-début mai autour de l'étang. Les iris s'ouvrent mi-mai.\n\nNOREN RESTAURANT (霞食堂) : Déjeuner vegan shojin ryori (cuisine bouddhiste) à l'intérieur du temple. Réservation : 075-881-1235. Menu à partir de ~5000¥/pers."},
      ]},
      { id:"aprem", items:[
        {s:"opt",  t:"Okochi Sanso (大河内山荘) — Villa secrète d'acteur", sub:"🚶 Adjacent à la sortie nord de la forêt de bambou. Ouvert 9h-17h. Entrée 1000¥ (thé matcha + wagashi inclus dans le prix).\n\nL'acteur Okochi Denjiro (star du cinéma muet japonais des années 20-40) a construit cette villa-jardin sur 20 000 m² pendant 30 ans. Plusieurs pavillons de styles différents reliés par des sentiers.\n\nVUE : Depuis le pavillon principal du sommet, panorama sur Kyoto (Kinkaku-ji visible par temps dégagé), la rivière Oi, et les collines d'Arashiyama. L'une des meilleures vues de Kyoto peu connue.\n\nTHÉ MATCHA : Servi dans le salon final, vous asseyez sur tatami face au jardin. Un des meilleurs matcha cérémoniels que vous goûterez."},
        {s:"free", t:"🕐 13h00 — Togetsukyo Bridge + Rives de la rivière Oi", sub:"Le pont 'de la lune qui passe' (153 mètres) est le symbole d'Arashiyama. Depuis le pont : vue sur les montagnes boisées — les sommets changent de couleur selon la saison. Les rives sud (Katsura-gawa) sont moins fréquentées et accessibles à pied — bonne pause pour s'asseoir sur les rochers et observer les bateaux de pêche.\n\nSTREET FOOD RUE PRINCIPALE : Mochi-yaki (餅焼き) — galette de riz grillée au soja, ~150¥. Yatsuhashi cru (生八つ橋) — pâte de riz parfumée à la cannelle, fourrée à l'anko (pâte de haricots rouges), ~150¥/pièce. Matcha soft cream ~450¥."},
        {s:"opt",  t:"Sagano Scenic Railway (嵯峨野トロッコ列車)", sub:"Départ : Torokko Saga Station (adjacent à JR Saga-Arashiyama). Arrivée : Torokko Kameoka. Durée : 25 min aller. Train à vapeur vintage traversant les gorges de l'Oi-gawa (Hozu Gorge). Viaducs en bois au-dessus de la rivière torrentielle. Uniquement 3 wagons découverts — s'habiller chaudement en mai (vent). Billets : 880¥/pers aller. ⚠️ Réservation fortement recommandée en Golden Week via le guichet JR de Kyoto Station ou en ligne (sagano-kanko.co.jp)."},
      ]},
      { id:"soir", items:[
        {s:"book", t:"🕖 18h30 — 🍽 Gion Tanto — Cuisine kyotoïte traditionnelle ⚠️ Réserver", sub:"⚠️ RÉSERVATION OBLIGATOIRE plusieurs semaines à l'avance — tenter maintenant via Tablecheck.\n\nAdresse : Gion (Higashiyama-ku, côté Hanamikoji).\n\nBus retour depuis Arashiyama vers Gion : Bus 11 ou 93 → Gion (~45 min, 230¥) ou taxi ~2500¥.\n\nMENU : Cuisine kaiseki simplifiée en cadre machiya (maison de commerce historique en bois). Menus à partir de ~8000¥/pers. Plats de saison (旬の料理 — shun no ryori) : nimono (mijoté de légumes de Kyoto), yakimono (poisson de rivière grillé au sel), hassun (plateau d'entrées de saison). Insister pour le menu 'kyoryori' (京料理) au téléphone — pas le menu 'omakase général'.\n\nBOISSONS : Saké froid de la région de Fushimi (伏見の酒), notamment Tsuki no Katsura (月の桂) ou Gekkeikan Junmai (月桂冠)."},
        {s:"opt",  t:"Alternative : Pontocho kawayuka si pas de réservation Gion Tanto", sub:"Bus retour depuis Arashiyama → Shijo → marcher vers Pontocho (15 min total). Sans réservation possible en début de soirée (avant 19h) dans les restaurants en milieu de ruelle. Pointer la terrasse rivière : 'kawayuka, futari/sannin onegaishimasu' (pour 2/3 personnes s'il vous plaît). Carte souvent illustrée de photos — pointer les plats."},
      ]},
    ],
    tips:[
      "🎋 TIMING ABSOLU : Bus depuis l'hôtel à 5h45-6h10 pour être dans la forêt à 6h45-7h. Ces 45 min valent plus que 3h entre 9h et 12h. C'est la règle d'or d'Arashiyama.",
      "🚌 BUS KYOTO PAIEMENT : Déposer la monnaie exacte (230¥) ou passer la Suica au lecteur vert à MONTER dans le bus et à DESCENDRE. Le chauffeur annonce les arrêts en japonais puis en anglais dans les zones touristiques.",
    ],
  },
  // ═══════════════════════════════════════════════════════
  // J9 — 5 MAI — FUSHIMI + NARA
  // ═══════════════════════════════════════════════════════
  {
    n:9, date:"5 mai", day:"Mar", city:"kyoto", title:"Fushimi Inari + Excursion Nara",
    alert:"🎌 Journée des Enfants — Nara très animé. Fushimi Inari gérable si arrivée avant 7h.",
    sections:[
      { id:"matin", items:[
        {s:"free", t:"🕕 6h30 — Fushimi Inari Taisha (Fushimi Inari) — Guide de la montée", sub:"🚄 JR Nara Line depuis Kyoto Station → Inari Station (稲荷, 5 min, JR Pass ✅). Premier train 6h09. Sortir par la sortie unique → le sanctuaire est directement en face (1 min à pied).\n\nSANCTUAIRE BAS : Gratuit, 24h/24. Passer sous la première torii vermillon (17m de haut) puis le deuxième portique (Ro-Mon). L'aire de purification (temizuya) : se laver les mains gauche puis droite, puis la bouche.\n\nCHEMIN DES TORII (千本鳥居) : Commence après le sanctuaire principal. 2 voies parallèles de torii serrés — prendre la voie DE GAUCHE à la montée (la plus dense de torii).\n\nARRÊTS JALONS : Yotsutsuji Junction (45 min de marche) — premier carrefour avec bancs et vue sur Kyoto. Suffisant si temps limité. Kodama-tani (1h15) — mi-montagne, atmosphère plus sauvage, renards sculptés. Inariyama Summit (233m, 1h45) — calme absolu, petit autel en forêt.\n\nTORII : Chaque torii est une offrande d'une entreprise ou famille (inscription au dos avec le nom du donateur et la date). Prix d'un torii : 175 000¥ (petit) à 1 300 000¥ (grand). Plus de 10 000 torii au total.\n\nRENARDS KITSUNE : Statues de renards gardiennes partout sur le chemin. Ils tiennent dans la gueule : une clé (clé du grenier à riz), un rouleau de prière, une gerbe de riz ou un joyau. Mesagers du dieu Inari.\n\nRedescendre par la voie opposée — différentes perspectives."},
        {s:"opt",  t:"Inari-zushi et petit-déjeuner au bas du sanctuaire", sub:"Au retour de la montée, plusieurs petits restaurants ouvrent dès 9h au bas du sanctuaire. TANBAYA (丹波屋) sur la route principale vers la gare : inari-zushi (稲荷寿司, pochette de tofu frit remplie de riz vinaigré) ~200¥/pièce. Spécialité locale car Inari = dieu du riz, et les renards adorent le tofu frit selon la légende. Commander un set de 5 pièces + miso soup ~600¥."},
      ]},
      { id:"aprem", items:[
        {s:"free", t:"🕙 11h00 — Nara — Itinéraire complet de la journée", sub:"🚄 JR Nara Line depuis Inari Station → Nara (奈良, 42 min, JR Pass ✅). Descendre à JR Nara Station (pas Kintetsu Nara). 20 min à pied vers le parc (suivre les panneaux 'Nara Park / 奈良公園').\n\nPARC DE NARA (奈良公園) : 1200 daims sacrés (鹿, shika) classés 'trésors naturels nationaux'. COMPORTEMENT DES DAIMS : Ils s'inclinent si vous vous inclinez en premier (comportement appris pour recevoir les senbei). ⚠️ NE JAMAIS tenir un senbei visible à la main sans être prêt à être cerné — ils mordent les vêtements et sacs. Mettre les sachets dans les poches dès achat. Acheter les senbei (150-200¥/sachet) aux vendeurs le long du chemin principal.\n\nTODAI-JI (東大寺) : Entrée 600¥. La porte Nandaimon (南大門, 18m) est gardée par deux Nio géants (gardiens bouddhistes). Le Grand Bouddha (Daibutsu, 大仏) en bronze : 15 mètres, 437 tonnes. Fonte en 752, reconstruit deux fois (actuel 1709). COLONNE PERCÉE (穿孔柱) : Un des piliers intérieurs a un trou de 37 cm de diamètre — la taille de la narine du Bouddha. Passer à travers = 'illumination garantie dans la prochaine vie'. File de 5-10 min.\n\nKASUGA TAISHA (春日大社) : 15 min à pied de Todai-ji vers le sud-est. Sanctuaire fondé en 768. Allée de 2000 lanternes de pierre menant à l'entrée. Les lanternes sont allumées deux fois par an (Setsubun en février et Obon en août) — illumination totale incomparable. Sanctuaire intérieur ~500¥ supplémentaire.\n\nNARA-MACHI (ならまち) : Quartier préservé de machiya, 15 min au sud du parc. Galeries céramique, cafés en maisons traditionnelles, ateliers calligraphie."},
      ]},
      { id:"soir", items:[
        {s:"free", t:"Retour Kyoto + Dîner", sub:"🚄 JR Nara → Kyoto (~42 min, JR Pass ✅). Arrivée vers 17h.\n\nDÎNER : Omen Noodles (おめん) — adresse Okazaki, 5 min du Heian Shrine. Udon semi-épais servis avec plateau de légumes à tremper dans un dashi léger. La façon de manger : verser le bouillon dans le bol, y tremper les légumes et les noodles alternativement. ~1400¥. Ambiance chaleureuse, bois sombre, clientèle locale."},
        {s:"book", t:"🕖 19h00 — 🍽 Kichi Kichi Omurice — Chef Yukimura ⚠️ Quasi-impossible", sub:"⚠️ DIFFICULTÉ MAXIMALE — 6 places seulement, réservation quasi-impossible. Tenter via : (1) Site officiel kichikichi.co.jp — formulaire de réservation souvent bloqué des mois à l'avance. (2) DM Instagram @kichikichi_yukimura. (3) Pocket Concierge ou Tablecheck (ils y sont parfois listés). (4) Se présenter à l'ouverture (19h) et demander s'il y a annulation — rare mais possible.\n\nSHOW : Le Chef Yukimura prépare chaque omurice devant les 6 convives : riz sauté au poulet puis enveloppé d'une crêpe d'œufs ultra-fine, ouverture théâtrale au couteau devant vous. Sauce demi-glace maison. Prix : ~4000-6000¥/pers. Vidéos YouTube 'Kichi Kichi Chef' donnent une idée du spectacle."},
      ]},
    ],
    tips:[
      "🦌 NARA : Les daims muent en mai — leur pelage est encore un peu hirsute. Avril-mai = période de naissance des faons. Si vous voyez un faon seul : ne pas le toucher, la mère est toujours proche.",
      "🚄 DEPUIS INARI : JR Nara Line directe (pas besoin de revenir à Kyoto Station). Gain de temps : 20 min par rapport à passer par Kyoto Station.",
    ],
  },
  // ═══════════════════════════════════════════════════════
  // J10 — 6 MAI — KIYOMIZUDERA + GION
  // ═══════════════════════════════════════════════════════
  {
    n:10, date:"6 mai", day:"Mer", city:"kyoto", title:"Kiyomizudera + Ninenzaka + Gion",
    alert:"🎌 Dernier jour férié Golden Week — foule modérée comparée aux jours précédents.",
    sections:[
      { id:"matin", items:[
        {s:"free", t:"🕕 6h30 — Kiyomizudera (Kiyomizudera) — Itinéraire complet", sub:"🚌 Bus 100 (express) depuis Shijo-Kawaramachi → Kiyomizumichi (清水道, 15 min, 230¥). Monter à pied la rue Matsubara-dori (200m, boutiques de céramiques Kiyomizu-yaki).\n\nOuverture : 6h. Arriver à 6h30 = quasi désert. Entrée : 500¥.\n\nSAIMON (西門) : Entrée principale à l'ouest. Pagode à 3 étages (1632) en bois sans clou.\n\nBUTAI (舞台) : La scène suspendue à 13 mètres de hauteur au-dessus de la vallée Otowa. Construite de 139 poutres d'hinoki imbriquées sans vis ni clou. Expression japonaise 'Kiyomizu no butai kara tobi oriru' (sauter de la scène de Kiyomizudera) = prendre une décision courageuse.\n\nOTOWA-NO-TAKI (音羽の瀧) : Cascade à 3 filets séparés sous la scène. S'agenouiller, prendre le ladle en métal, boire d'UN SEUL filet : gauche = longévité, centre = succès aux études, droite = chance en amour. ⚠️ Ne boire qu'un seul filet — boire les 3 serait de la cupidité selon la tradition. Faire la queue (~10 min).\n\nJISHU SHRINE (地主神社) : Directement derrière le main hall. Deux pierres séparées de 18 mètres — marcher de l'une à l'autre les yeux fermés = trouver l'amour. Guidé par un ami = trouver l'amour par intermédiaire.\n\nCHEMIN DE RETOUR : Prendre le chemin nord pour descendre vers Ninenzaka (panneaux 'Sannenzaka')."},
        {s:"free", t:"🕗 8h30 — Ninenzaka & Sannenzaka — Guide boutique par boutique", sub:"🚶 5 min depuis la sortie nord de Kiyomizudera.\n\nSANNENZAKA : La ruelle haute, pavée, bordée de maisons Edo. STARBUCKS RESERVE KYOTO NINENZAKA (一号館) : dans une machiya à deux étages — café en atmosphère japonaise, Starbucks Reserve Bar (méthodes de préparation rares). File ~15-30 min. Vaut le détour pour le cadre même si vous ne buvez pas de café.\n\nNINENZAKA : La ruelle basse, menant vers Kodai-ji.\n\nLOCATION KIMONO : Sur les deux ruelles, boutiques Yumeyakata (夢館) et Kyoto Kimono Rental Wargo (わぁご). Prix : ~3000¥ avec coiffure et accessoires. Durée location : 9h-17h30. Réserver 1 semaine à l'avance en ligne (plus facile le matin).\n\nBOUTIQUES À TESTER : Sfera (porcelaine Kiyomizu-yaki contemporaine), Yojiya (よーじや, cosmétiques au charbon de bambou — specialité Kyoto), Ichihara (一原, poteries céladon), Tsujiri (辻利, thé matcha depuis 1860 — leur glace matcha =  ~500¥)."},
        {s:"opt",  t:"Kodai-ji (高台寺) — Temple de Nene, veuve de Hideyoshi", sub:"🚶 5 min de Ninenzaka. Ouvert 9h-17h30. Entrée 600¥.\n\nTemple fondé en 1606 par Nene (北政所), veuve de Toyotomi Hideyoshi, pour la mémoire de son mari.\n\nJARDINS ZEN : Jardin de mousse Hojo et jardin Engetsu-chi (étang circulaire).\n\nBAMBOUSERAIE BAMBOO GROVE : Sentier couvert de bambous géants, différent d'Arashiyama — plus petit mais très photogénique.\n\nPLAFONDS LAQUÉS : Planchers d'un ancien bateau de Hideyoshi réutilisés comme plafond — technique unique 'funatama-zukuri'."},
      ]},
      { id:"aprem", items:[
        {s:"free", t:"🕒 15h00 — Gion (Gion) — Comment observer les Geishas et Maikos", sub:"🚶 15 min de Ninenzaka vers le nord le long de Ninen-zaka-dori puis Furumonzen-dori.\n\nHANAMIKOJI STREET (花見小路通) : La rue la plus photographiée de Kyoto. 600 mètres de restaurantes, ochaya (maisons de thé), petits commerces. Trottoir pavé, lanternes.\n\nVOIR DES MAIKOS : Les maikos (舞妓, apprenties geisha) sortent de leurs okiya (maison-école) en fin d'après-midi pour se rendre à leurs engagements du soir, généralement entre 17h30 et 20h. S'asseoir dans un café avec vue sur la rue — ne pas attendre au milieu du trottoir ni bloquer l'entrée des ochaya. RÈGLES OFFICIELLES DE LA VILLE : panneau à l'entrée de Hanamikoji = photographier sans permission = amende possible.\n\nHANAMIKOJI CÔTÉ PARALLÈLE : La ruelle Tominaga-cho et Shinmonzen-dori = moins bondées, plus authentiques.\n\nSHIRAKAWA SUJI (白川筋) : Côté nord de Hanamikoji, le long du canal Shirakawa. Saules pleureurs, lanternes de pierre, ponts en bois. La plus belle rue de Kyoto la nuit."},
        {s:"opt",  t:"Philosopher's Path (哲学の道) — Chemin contemplatif", sub:"🚇 Bus vers Ginkaku-ji (銀閣寺) depuis Shijo-Kawaramachi. Sentier de 2 km le long du canal d'irrigation Biwa-ko (creusé pour amener l'eau du lac Biwa jusqu'à Kyoto). Nommé d'après le philosophe Nishida Kitaro qui s'y promenait quotidiennement pour méditer. En mai : iris et azalées le long du canal, moins bondé qu'en saison sakura. Le chemin va de Ginkaku-ji (Pavillon d'Argent, ~1000¥) jusqu'au Nanzen-ji au sud. Durée totale : 45 min de marche tranquille."},
        {s:"free", t:"Shopping final Kyoto : Teramachi & Shinkyogoku", sub:"Galeries couvertes perpendiculaires à la rue Shijo.\n\nTERAMACHI (寺町通) : Boutiques haut de gamme. SOU SOU (SOU・SOU) : vêtements japonais contemporains réinterprétant le style traditionnel (tabi, jinbei) — entre 3000-15 000¥. KYUKYODO (鳩居堂) : Encens et papeterie de luxe depuis 1663.\n\nSHINKYOGOKU (新京極) : Plus populaire et accessible. Amulettes de temple (omamori) pas chères, t-shirts 'Kyoto' humoristiques, lacets de sandales colorés."},
      ]},
      { id:"soir", items:[
        {s:"free", t:"🍽 Dernière soirée Kyoto — Options", sub:"KATSUKURA SHIJO (かつくら三条店) : Tonkatsu kyotoïte — différent du Tokyo-style car beurré de sésame torréfié. Moudre soi-même les graines de sésame dans le mortier fourni à table puis y tremper le porc pané. ~2500¥.\n\nGION TANTO si toujours disponible.\n\nIZAKAYA ÉVÉ : Kyoto Cache-Cache (カシュカシュ) — izakaya franco-japonaise, Pontocho, chef japonais ayant travaillé en France. Menu ~4000¥. Curiosité culturelle."},
        {s:"opt",  t:"Dernier saké de Kyoto : Bar Suigun (水軍) ou Fushimi sake tastings", sub:"BAR SUIGUN : Shimonzen-dori, Gion. 200+ sakés dont des raretés de Fushimi brassées en édition limitée. Dégustation à partir de 90ml (~600-1200¥/verre). Le propriétaire parle anglais et guide avec passion. Spécialité recommandée : Tama no Hikari (玉乃光) junmai daiginjo, brassé depuis 1673 à Fushimi."},
      ]},
    ],
    tips:[
      "📸 KIYOMIZUDERA : La meilleure photo de la scène suspendue est depuis le sentier nord (chemin vers Jishu Shrine) — vue de face sur la scène avec la vallée en dessous. À 6h30, lumière matinale directe sur les bois.",
      "👘 KIMONO : Si location à Ninenzaka, inclure l'accès taxi pour Gion — marcher en geta (sandales en bois) sur pavés = épuisant après 2h.",
    ],
  },
  // ═══════════════════════════════════════════════════════
  // J11 — 7 MAI — KYOTO → OSAKA
  // ═══════════════════════════════════════════════════════
  {
    n:11, date:"7 mai", day:"Jeu", city:"transit", title:"Kyoto → Osaka", alert:null,
    sections:[
      { id:"matin", items:[
        {s:"free", t:"🕘 9h00 — Nishiki Market (Nishiki Market) — Shopping matinal", sub:"🚶 10 min de l'hôtel. Ouvert dès 9h pour la majorité des stands.\n\nÀ ACHETER ABSOLUMENT : TSUKEMONO (漬物) chez Nishiki Tsuruya — bocaux de légumes marinés (narazuke au saké, karasumu, shibazuke violet). À ramener en France en bocal hermétique ~800-1500¥.\n\nYATSUHASHI (八つ橋) EN BOÎTE CADEAU : Seizando — la version cuite (硬八つ橋) et la version crue (生八つ橋) en différents parfums (cannelle, matcha, ichigo). ~1200¥/boîte 20 pièces. Solide pour le voyage.\n\nSAKÉ LOCAL : Nishiki Sake Shop — Hakutsuru (灘区) ou Kizakura (黄桜, brassé à Fushimi, 5km) en petites bouteilles 180ml (~500-700¥) = idéal pour goûter sans surcharger les bagages.\n\nCheck-out The Blossom Kyoto 11h. Consigne bagages à la gare Kyoto (coinlocker 400-700¥) si Shinkansen en début d'après-midi."},
        {s:"opt",  t:"Nijo-jo (二条城) — Château des Shoguns Tokugawa", sub:"🚇 Tozai Line → Nijo-jo-mae (1 arrêt, 3 min) ou 20 min à pied de l'hôtel. Ouvert 8h45-17h. Entrée 800¥.\n\nNINOMARU PALACE (二の丸御殿) : L'intérieur est visitable — parquet 'rossignol' (鶯張り, uguisubari) : des clous spéciaux dans les lattes font 'chirper' le parquet à chaque pas = système d'alarme anti-assassin historique. 33 pièces richement décorées en fusuma (panneaux coulissants) peints par l'école Kano. L'abdication de l'Empereur Meiji (1867) a été annoncée dans ce palais.\n\nJARDIN HONMARU : Jardin de style différent de Kyoto habituel — plus végétal, moins minéral."},
      ]},
      { id:"aprem", items:[
        {s:"free", t:"Kyoto → Osaka — Options de transport", sub:"Option 1 — SHINKANSEN (JR Pass ✅) : Kyoto → Shin-Osaka (14 min, Hikari ou Kodama). Pratique si bagages lourds et arrivée rapide désirée. Depuis Shin-Osaka : Midosuji Line → Shinsaibashi (3 arrêts, ~10 min, 230¥).\n\nOption 2 — JR TOKAIDO-SANYO LINE (JR Pass ✅) : Kyoto → Osaka Station (30 min, plus local). Depuis Osaka Station : Midosuji Line → Shinsaibashi (2 arrêts, ~5 min).\n\nCheck-in Takuto Hotel Osaka Shinsaibashi (à partir de 15h). Adresse : 3-6-8 Bakuromachi, Chuo-ku. Dotonbori = 2 min à pied en sortant de l'hôtel côté sud."},
        {s:"opt",  t:"Kuromon Ichiba Market (黒門市場) — Premier contact Osaka", sub:"🚇 Namba ou Nipponbashi Station (5 min de Shinsaibashi). Ouvert 9h-18h. 2 rues parallèles de 170 boutiques. Surnommé 'le restaurant de bouche des chefs d'Osaka'.\n\nSTAND INCONTOURNABLES : MATSURI (まつり) — huîtres de Hiroshima sur grille ouverte, ~300¥/pièce. DAIKI SUISAN (大起水産) — sashimi debout, plateau 5 pièces ~1200¥. NIKU NO TAKI (肉の滝) — wagyu kobe grillé sur braise ~500¥/tranche.\n\nBon endroit pour un déjeuner tardif avant de s'installer à l'hôtel."},
      ]},
      { id:"soir", items:[
        {s:"free", t:"🕖 18h30 — Dotonbori (Dotonbori) — Guide de la soirée d'arrivée", sub:"🚶 2 min de l'hôtel. Le quartier le plus animé et le plus dense en enseignes d'Osaka.\n\nGLICO MAN (グリコサイン) : L'enseigne sportif coureur depuis 1935. Illuminée de 20h à minuit. Meilleure photo : depuis le pont Ebisu-bashi (戎橋) légèrement sur la droite.\n\nKANI DORAKU (かに道楽) : L'enseigne crabe géant animatronique qui pince et tourne. Le restaurant sur 5 étages propose des kaiseki au crabe (setset-menu ~6000¥) — si réservation faite en avance.\n\nBALADE EN BATEAU : Tombori River Cruise (とんぼりリバークルーズ) — 20 min sur le canal Dotonbori, départ quai Dotonbori-bashi, ~1000¥/pers. Vue sur les enseignes depuis l'eau = la photo d'Osaka par excellence."},
        {s:"free", t:"🍽 Street food Dotonbori — Baptême Osaka Kuidaore", sub:"TAKOYAKI : KUKURU (くくる) — octopus balls en style Osaka avec katsuobushi (copeaux de bonite) et sauce brown sucrée. Commander 6 pièces ~600¥. Manger chaud, attention brûlures. AIZUYA (会津屋) à 200m — version originale plus simple, fondateur historique du takoyaki.\n\nOKONOMIYAKI : CHIBO (千房) Dotonbori — okonomiyaki préparée devant vous sur plaque chauffante à la table. Commander 'buta tama' (porc + œuf, ~1800¥) ou 'gyusuki' (bœuf + oignons).\n\nKUSHIKATSU : DARUMA (だるま) Dotonbori — ⚠️ RÈGLE ABSOLUE ET VISIBLE SUR TOUS LES MURS : 二度漬け禁止 (ni-do-duke kinshi = re-tremper interdit). Une seule immersion dans la sauce commune. Violation = demande de quitter le restaurant. Commander : lotus racine, asperge, fromage, crevette, porc. ~130-200¥/brochette.\n\nGYOZA : Osaka Ohsho (王将) — chaîne populaire, gyoza frits ultra-croustillants, 6 pièces ~290¥."},
      ]},
    ],
    tips:[
      "🗣 OSAKA DIALECT : Les Osakans parlent le 'Kansai-ben' (関西弁). 'Maido !' = bonjour / bienvenue (lieu de commerce). 'Ookini !' = merci. Montrer que vous connaissez = sourires garantis.",
      "⚠️ KUSHIKATSU : La sauce commune dans les seaux en bois est partagée entre tous les clients. Re-tremper après avoir mordu = règle d'hygiène absolue au Japon. Demander un supplément de sauce si pas assez.",
    ],
  },
  // ═══════════════════════════════════════════════════════
  // J12 — 8 MAI — USJ
  // ═══════════════════════════════════════════════════════
  {
    n:12, date:"8 mai", day:"Ven", city:"osaka", title:"Universal Studios Japan ✅", alert:null,
    sections:[
      { id:"matin", items:[
        {s:"ok",   t:"✅ Universal Studios Japan — Stratégie d'attaque", sub:"🚇 Depuis Shinsaibashi : Midosuji Line → Namba (1 arrêt) → JR Osaka Loop Line → Nishikujo (2 arrêts) → JR Yumesaki Line → USJ Station (1 arrêt). Total 25-30 min. JR Pass ✅ jusqu'à USJ Station.\n\nARRIVER 8H30 (30 min avant ouverture 9h) : File d'entrée déjà constituée. S'installer à l'entrée Gate 3 (côté Nintendo World). Avoir billet sur smartphone, ID prêt.\n\nPREMIER SPRINT (9h00) : Dès les portes ouvertes, aller DIRECTEMENT à NINTENDO WORLD en suivant les panneaux. Distance depuis l'entrée : ~800m à gauche. Sprint ou marche rapide.\n\nDANS LE PARC NINTENDO : Avant même d'entrer dans Nintendo World, ouvrir l'app USJ et réserver le 'Area Entry Pass' (入場整理券) pour Nintendo World — se remplit en 3-5 min maximum après l'ouverture.\n\nMARIO KART : La course des Grands Champions — l'attraction principale. File séparée de Nintendo World, commencer par elle dès l'entrée dans l'area. Power-Up Bands (~3800¥) pour collecter des pièces dans tout le monde.\n\nYOSHI'S ADVENTURE : Circuit en Yoshi pour les découvertes en 3D, moins de file que Mario Kart."},
        {s:"free", t:"Wizarding World of Harry Potter — Stratégie", sub:"Attendre 45-60 min après l'ouverture (quand la foule est à Nintendo World). Entrée par Hogsmeade Village.\n\nBUTTERBEER : La boisson iconique — froide (comme un cream soda caramel) ou chaude (cidre de pomme épicé avec crème). ~950¥. Éviter le butterscotch fudge (trop sucré).\n\nOLLIVANDERS WAND EXPERIENCE : Spectacle de 10 min où la baguette 'choisit' un volontaire. 5-7 représentations/jour — arriver 15 min avant.\n\nHARRY POTTER AND THE FORBIDDEN JOURNEY : Attraction principale en Hogwarts Castle — file 30-60 min.\n\nFLIGHT OF THE HIPPOGRIFF : Montagnes russes extérieures, vue sur le château. File plus courte.\n\nBOUTIQUES : Ollivanders (baguettes), Honeydukes (friandises), Dervish & Banges (robes de sorciers)."},
      ]},
      { id:"aprem", items:[
        {s:"free", t:"Jurassic World, Flying Dinosaur, Hollywood", sub:"FLYING DINOSAUR (フライング・ダイナソー) : L'attraction la plus intense du parc — montagnes russes suspendues inversées avec loopings. File : 60-120 min à l'ouverture, 20-40 min en fin de journée. Conseillé en fin de journée.\n\nJAWS (ジョーズ) : Classique des années 90, toujours dans le parc. Embarquement en bateau, requin animatronique. File 10-20 min l'après-midi.\n\nMINION PARK : DESPICABLE ME MINION MAYHEM — simulation 4D assise, 10-15 min de file.\n\nSHREK 4D ADVENTURE : Autre simulation, famille.\n\nFOOD TRUCKS ET STANDS : Jurassic Park Restaurant (hamburgers ~1500¥), Minion Café (nuggets de poulet forme Minion ~1200¥), Butterbeer Cart (déjà mentionné)."},
        {s:"opt",  t:"Express Pass — Vaut-il l'investissement ?", sub:"EXPRESS PASS 7 (7 attractions) : ~12 000¥/pers (tarif variable selon date). Élimine la file pour Mario Kart, Flying Dinosaur, Forbidden Journey et 4 autres. En Golden Week les files peuvent dépasser 3h pour Mario Kart sans Express — l'Express Pass peut faire gagner 5-6h de file sur la journée.\n\nAcheter UNIQUEMENT sur le site officiel usj.co.jp (section 'Billets') AVANT le voyage — sold out souvent.\n\nExpress Pass 4 (~8000¥) : moins d'attractions couvertes mais suffisant si Nintendo World Entry Pass déjà réservé."},
      ]},
      { id:"soir", items:[
        {s:"free", t:"Retour Osaka + dîner", sub:"Quitter le parc vers 17h-18h selon énergie. 🚇 USJ → Osaka Station → Shinsaibashi (30 min).\n\nICHIRAN NAMBA (一蘭 道頓堀店) : Adresse : 1-7-25 Dotonbori. Ramen en isoloir individuel — identique à Tokyo mais dans le décor Dotonbori. File 10-20 min. Tonkotsu ~980¥. Kaedama (補麺, extra noodles) ~130¥.\n\nKONBINI si épuisement total : Onigiri variété Osaka (takoyaki flavor, mentaiko), sandwich Katsu Sando (porc pané), matcha frappe. Budget ~600¥/pers."},
      ]},
    ],
    tips:[
      "📱 USJ APP : Créer le compte AVANT le départ depuis la France (usj.co.jp/app). L'appli doit être chargée et connectée avant d'arriver au parc. Connexion wifi lente à l'entrée = risque de rater la réservation Nintendo.",
      "⏰ FLYING DINOSAUR : File maximale 9h-15h, minimum 30 min avant fermeture. Si journée chargée, sacrifier Flying Dinosaur pour Nintendo World + HP = meilleur choix.",
    ],
  },
  // ═══════════════════════════════════════════════════════
  // J13 — 9 MAI — CHÂTEAU + UMEDA SKY
  // ═══════════════════════════════════════════════════════
  {
    n:13, date:"9 mai", day:"Sam", city:"osaka", title:"Château d'Osaka + Umeda Sky + Kittan Hibiki Wagyu 🥩", alert:null,
    sections:[
      { id:"matin", items:[
        {s:"free", t:"Château d'Osaka (大阪城) — Visite complète", sub:"🚇 Tanimachi Line → Tanimachi 4-chome (谷町四丁目, 4 arrêts depuis Shinsaibashi, 7 min). Puis 10 min à pied vers l'est en suivant les douves.\n\nDOUVES EXTÉRIEURES (外堀) : Les douves du château forment le 2e anneau de défense. Le mur de pierres cyclopéennes (certains blocs > 100 tonnes) est intact depuis l'époque Toyotomi (1583).\n\nJARDIN NISHINOMARU (西の丸庭園) : À l'ouest du château, entrée 200¥. Vue face au donjon depuis le jardin. Cerisiers (à feuilles vertes en mai, mais troncs et architecture superbes).\n\nDONJON (天守閣) : Entrée 600¥. 8 étages. 1F-6F : Musée interactif de l'ère Sengoku (guerres civiles 1467-1615). Armures de samouraïs originales, cartes de batailles, reconstitutions de la Bataille d'Osaka (1615). 7F : Reconstitution du donjon d'or de Toyotomi (plaqué or selon les chroniques). 8F TOIT : Vue panoramique sur Osaka — Skyline avec Umeda Sky Building visible au nord, Abeno Harukas au sud.\n\nDURÉE : 1h30 avec musée, 45 min sans."},
        {s:"opt",  t:"Osaka Museum of History (大阪歴史博物館) — En face du château", sub:"Bâtiment moderne de 10 étages. Entrée 600¥. Points forts : reconstruction grandeur nature d'un palais de Naniwa (l'ancienne Osaka, 7e siècle) au 10F. Reconstitution d'un marché Edo au 7F. Dioramas de l'Osaka du 19e siècle. Les fenêtres du 10F offrent une vue sur les vestiges archéologiques du palais Naniwa directement en dessous du bâtiment."},
      ]},
      { id:"aprem", items:[
        {s:"free", t:"Tenjinbashi Suji Shopping Street (天神橋筋商店街) — La plus longue du Japon", sub:"🚇 Tanimachi Line → Tenjinbashisuji 6-chome (天神橋筋六丁目, 5 arrêts, 8 min).\n\n2,6 kilomètres entièrement couverts entre Tenjinbashi 1-chome et 7-chome. 600+ boutiques.\n\nQUARTIERS PAR SECTION : 1-chome et 2-chome = alimentation, fishmongers, tofu artisanal. 3-chome = vêtements et mode locale. 4-chome et 5-chome = restaurants populaires (ramen local à ~700¥, okonomiyaki maison). 6-chome = 100¥ shops, électronique d'occasion, pharmacies.\n\nSPÉCIALITÉS À CHERCHER : Osaka Tenmangu Shrine boutique (omamori locaux) — le sanctuaire est adjacent à la ruelle 2-chome. Okonomiyaki Yoshino — institution locale depuis 40 ans, menu ~900¥.\n\nDurée : 45 min à 1h30 selon rythme."},
        {s:"free", t:"Umeda Sky Building (梅田スカイビル) — Floating Garden Observatory", sub:"🚇 Midosuji Line → Umeda (梅田, 3 arrêts depuis Tenjinbashisuji, 5 min). Puis 10 min à pied vers le nord-ouest en suivant les panneaux 'Sky Building'.\n\nBâtiment conçu par Hiroshi Hara (1993) : deux tours de 40 étages reliées par un anneau d'observation suspendu à 173m.\n\nASCENSEUR VITRÉ : Montée jusqu'au 39F en ascenseur vitré extérieur en 50 secondes — sensation de suspension dans le vide.\n\nFLOATING GARDEN OBSERVATORY (空中庭園展望台) : Anneau ouvert circulaire à 173m. Tour dans le sens des aiguilles d'une montre pour la vue 360°. En mai à 18h-19h : soleil se couchant derrière les Rokko Mountains (nord-ouest), ciel dégradé rose-orange-violet sur les buildings. Entrée 1500¥.\n\nUNDERGROUND DINING : Le sous-sol du Sky Building recrée une ruelle commerçante de l'ère Taisho (Takimi-koji, 瀧見小路) — 10 restaurants dans des boutiques vintage."},
        {s:"opt",  t:"Grand Front Osaka (グランフロント大阪) — Adjacent à Umeda", sub:"Mall contemporain au-dessus de la gare Osaka.\n\nSOUTH BUILDING B2-B3 : Cave à saké Tanabata (棚機) — 300+ sakés dont raretés de petites brasseries. Dégustation au verre ~300-800¥.\n\nNORTH BUILDING 1F : Fromagerie et charcuterie importées + produits japonais fins (yamagata beef, uni d'Hokkaido).\n\nKNOWLEDGE CAPITAL 3F : Espace d'expositions d'innovations technologiques japonaises, souvent gratuites ou ~500¥."},
      ]},
      { id:"soir", items:[
        {s:"book", t:"🕖 19h00 — 🍽 Kittan Hibiki (起燃ひびき) — Wagyu Yakiniku Osaka ⚠️ Réserver", sub:"⚠️ RÉSERVATION OBLIGATOIRE. Plateforme : Tablecheck.com ou Tableall.com, chercher 'Kittan Hibiki Osaka'.\n\n🚇 Depuis Umeda Sky Building : Midosuji Line → Shinsaibashi ou Namba (~5 min). L'adresse exacte et l'étage sont à confirmer lors de la réservation.\n\nCE QU'IL FAUT COMMANDER :\n🥩 Zabuton (座布団) — paleron extrêmement marbré, fondant\n🥩 Harami (ハラミ) — bavette de bœuf, saveur intense\n🥩 Wagyu tongue (牛タン) — langue fine, griller 20 secondes par face\n🥩 Negi-shio tan — langue avec sel et citron vert\n\nCOMMENT GRILLER : Grille à charbon de bois, 30-45 secondes d'un côté, retourner une seule fois, manger immédiatement. Ne jamais surcuire.\n\nBOISSONS : Saké junmai daiginjo froid ~900¥/verre — accord parfait avec le gras du wagyu. Ou highball Hibiki Japanese Harmony ~1200¥."},
        {s:"opt",  t:"Après le dîner : Kitashinchi ou Dotonbori", sub:"KITASHINCHI (北新地) : Quartier de bars premium à 10 min à pied — verre de whisky japonais pour terminer la soirée.\n\nDOTONBORI : Retour à pied vers l'hôtel (~15 min), ambiance néons et street food nocturne."},
        {s:"opt",  t:"Shin-Sekai (新世界) + Tour Tsutenkaku (通天閣)", sub:"🚇 Midosuji Line → Dobutsuen-mae (動物園前, 3 arrêts, 5 min). Quartier de l'Osaka des années 30-50, intact. Tour Tsutenkaku (108m, réplique 1956) — 700¥, vue sur Osaka en 'rétro'. Billiken statue (porte-bonheur en fonte) au sommet — frotter les pieds pour la chance. Rues Shin-Sekai = kushikatsu partout (~130¥/brochette), atmosphère populaire et authentique."},
      ]},
    ],
    tips:[
      "🌇 UMEDA SKY : Coucher de soleil à Osaka en mai vers 18h50. Arriver à 18h15 pour choisir la position. Côté nord-ouest = best sunset position. Prévoir veste légère — vent à 173m.",
      "🏯 OSAKA-JO : Les murs de pierres cyclopéens (pierres de plusieurs tonnes) sont la vraie merveille du château, plus que le donjon reconstruit. Faire le tour complet des douves (45 min à pied) pour voir les différents assemblages."],
  },
  // ═══════════════════════════════════════════════════════
  // J14 — 10 MAI — TRANSIT OSAKA → TOKYO HANEDA
  // ═══════════════════════════════════════════════════════
  {
    n:14, date:"10 mai", day:"Dim", city:"transit", title:"Shi Tenno Ji + Retour Tokyo → Haneda", alert:null,
    sections:[
      { id:"matin", items:[
        {s:"free", t:"Shi Tenno Ji (四天王寺) — Plus ancien temple du Japon", sub:"🚇 Tanimachi Line → Shitennoji-mae Yuhigaoka (四天王寺前夕陽ヶ丘, 3 arrêts depuis Shinsaibashi, 5 min). Fondé en 593 par le Prince Shotoku (厩戸皇子), le premier grand promoteur du bouddhisme au Japon.\n\nENCEINTE CENTRALE (中心伽藍) : Entrée 300¥. Disposition en ligne droite nord-sud : portail sud (南大門) → grande torii en pierre → portail central (中門) → pagode à 5 étages (五重塔) → salle principale (金堂) → salle des conférences (講堂). Reconstruction fidèle de la disposition de 593.\n\nGARDEN GARAN (石庭) : Jardin de pierres adjacent à l'enceinte principale. ~300¥ supplémentaire. Pierre de bronze gravée : plan original du temple. Très calme le matin — quasi aucun touriste.\n\nMARCHÉ DU DIMANCHE : Chaque 21-22 du mois (et 1er du mois) = grand marché aux antiquités dans le temple. En mai 10 = pas de marché, mais le quartier alentour a des brocanteurs.\n\nDurée : 45 min."},
        {s:"opt",  t:"Kuromon Ichiba Market — Derniers achats à Osaka", sub:"🚇 Depuis Shi Tenno Ji : Tanimachi Line → Namba (2 arrêts, 4 min). Ouvert jusqu'à 18h.\n\nDERNIERS ACHATS RECOMMANDÉS : KitKat Japonais exclusifs : saveur Hojicha (チョコレート), Osaka Frite (たこやき), Matcha blanc. Boîte de 12 : ~1000¥.\n\nFruits emballés : Melon de Shizuoka en demi-sphère (présenté comme bijou), ~1500-3000¥. À manger dans l'avion.\n\nDashi Kombu (昆布) : algue kombu séchée de Hokkaido pour faire des bouillons à la maison, ~800¥/sachet.\n\nCheck-out Takuto Hotel 10h. Bagages en consigne gare Namba ou Shin-Osaka."},
      ]},
      { id:"aprem", items:[
        {s:"free", t:"Shin-Osaka → Tokyo — Dernier Shinkansen", sub:"🚄 Hikari depuis Shin-Osaka → Tokyo (~2h30, JR Pass ✅). Départ recommandé 11h30-12h. Acheter un EKIBEN depuis le niveau B1 de Shin-Osaka Station : Bento Makunouchi (幕の内弁当, plateau varié ~1400¥), Takowasa (pieuvre marinée au wasabi, ~500¥ en garniture), Kaki-no-ha-zushi (sushi enveloppé dans feuilles de persimmon, de Nara).\n\nArrivée Tokyo ~14h.\n\nHÔTEL NUIT 10 MAI (à confirmer) : Haneda Excel Hotel Tokyu (TCAT dans T2) — chambre directement dans le terminal, le plus pratique. Ou Keikyu EX Inn Tokyo-Haneda — hôtel budget propre à 300m du terminal via navette. Enregistrement dès 15h."},
        {s:"opt",  t:"Dernier quartier Tokyo selon heure d'arrivée", sub:"Si arrivée à Tokyo 14h → hôtel Haneda 15h30 : court détour possible.\n\nDAIKANYAMA (代官山) : Quartier café-culture. Tsutaya Books Daikanyama (蔦屋書店) = la librairie la plus belle du Japon (livres + vinyles + café).\n\nOU SHIMOKITAZAWA (下北沢) : Quartier indie music, théâtres underground, friperies, cafés de quartier. Très peu touristique."},
      ]},
      { id:"soir", items:[
        {s:"free", t:"🍽 Dernier dîner japonais — Choisir avec intention", sub:"AUTOUR HANEDA/SHINAGAWA :\n\nGENKI SUSHI KAITEN (元気寿司) : Sushi sur tapis roulant connecté numériquement — commander sur tablette, le sushi arrive par rampe directement devant vous. ~130-350¥/assiette. Ou SUSHIRO (スシロー) même concept.\n\nICHIRAN SHINAGAWA : Si le ramen en isoloir n'a pas encore été fait, c'est la dernière chance.\n\nDERNIER KONBINI : Lawson ou FamilyMart de l'hôtel Haneda : onigiri Tuna-mayo (ツナマヨ), Nattoroll (納豆巻き, saveur très japonaise), Melon Pan, Taiyaki (gaufre en forme de poisson fourré anko). Budget ~600¥/pers."},
        {s:"opt",  t:"Dernier verre — Kampai final", sub:"WHISKY : Si l'hôtel Haneda Excel a un bar (niveau lobby) : Suntory Hibiki 17 ans ou Nikka Single Malt Yoichi en straight ~1800-2500¥/verre. Expérience mémorable pour clôturer 15 jours.\n\nSAKE : Chercher un convenience store 'high-end' dans les terminaux (Newdays ou Kiosk) — bouteilles de saké Dassai (獺祭) 180ml ~600¥. À boire dans la chambre ou à ramener non-ouvert."},
      ]},
    ],
    tips:[
      "🧳 TAKUHAIBIN (宅配便) : Si bagages lourds, envoyer depuis l'hôtel Osaka (J13 soir) vers le comptoir Yamato Transport à Haneda Airport. Coût : ~2000-2500¥/valise. Livraison garantie en 24h. Demander le service à la réception de l'hôtel. Récupérer au comptoir 'Yamato Transport' côté départ international, Haneda T3.",
      "⏰ VOL 11H45 DEMAIN : Être au Terminal 3 International avant 9h30 MAXIMUM. Check-in, sécurité, douanes = prévoir 2h minimum. Réveil à 7h30 recommandé.",
    ],
  },
  // ═══════════════════════════════════════════════════════
  // J15 — 11 MAI — DÉPART HANEDA
  // ═══════════════════════════════════════════════════════
  {
    n:15, date:"11 mai", day:"Lun", city:"depart", title:"Sayōnara Nihon ! ✈️", alert:null,
    sections:[
      { id:"matin", items:[
        {s:"note", t:"✈️ Vol 11h45 — Haneda Terminal 3 International — Timing précis", sub:"⏰ 7h30 : Réveil + petit-déjeuner hôtel si disponible.\n\n8h30 : Départ hôtel. Depuis Haneda Excel (terminal) : navette interne 10 min. Depuis Keikyu EX Inn : Keikyu Line → Haneda T3 ~12 min (Suica). Depuis Shinagawa : Keikyu → Haneda T3 ~25 min (départ Shinagawa 8h15).\n\n9h00 : Arrivée au Terminal 3 International (国際線ターミナル). Niveau départ = 3F.\n\n9h00-9h30 : Enregistrement (CHECK-IN) — comptoir selon compagnie. Enregistrement en ligne souvent disponible depuis l'app de la compagnie.\n\n9h30-10h00 : Contrôle de sécurité (手荷物検査). File habituelle 10-20 min.\n\n10h00-10h15 : Douane de sortie (出国審immigration control).\n\n10h15-11h15 : Duty-free et accès aux gates.\n\n11h15-11h45 : Embarquement."},
        {s:"free", t:"Duty-Free Haneda T3 — Guide par catégorie", sub:"Zone duty-free accessible après la douane de sortie.\n\nWHISKY JAPONAIS (la priorité) : NIKKA SINGLE MALT YOICHI (余市) 700ml ~5000¥ — arômes tourbés, meilleur de Hokkaido. NIKKA FROM THE BARREL (ニッカ フロム ザ バレル) 500ml ~4000¥ — double maturation, très concentré. SUNTORY HIBIKI JAPANESE HARMONY (響 ジャパニーズハーモニー) 700ml ~5500¥ — blend floral, le plus accessible. YAMAZAKI 12 ANS (山崎12年) si disponible ~12 000¥ — rare, parfois en stock à l'aéroport.\n\nKITKAT JAPONAIS : KITKAT BOUTIQUE Haneda = sélection la plus large. Boîte premium 12 pièces assorties (matcha, hojicha, sakura, fromage, fraise) ~2000¥.\n\nTHÉ MATCHA : Ito En (伊藤園) poudre matcha cérémonie, ITO premium gyokuro, sachets sencha.\n\nCOSMÉTIQUES : Shiseido Ultimune sérum, SK-II Pitera Essence, Hada Labo Gokujyun lotion (hydratation extrême) — tous moins chers en duty-free qu'en France.\n\nWAGASHI COFFRETS : Toraya (虎屋) yokan (gelée de haricots rouges en barre) ~1500¥, Kitchoan (銀座鹿の子) assortiment sec ~2000¥."},
        {s:"free", t:"Dernier onigiri au konbini Haneda 🍙", sub:"Konbini Lawson et FamilyMart dans la zone publique avant les douanes (plus grand choix). ONIGIRI RECOMMANDÉS : Sake (鮭, saumon grillé), Tuna-mayo (ツナマヨ), Kombu (昆布, algue marinée). Manger à l'aéroport avant d'embarquer = adieu au Japon en bonne compagnie gastronomique."},
      ]},
      { id:"aprem", items:[
        {s:"note", t:"またね、日本！ (Mata ne, Nihon !) — À bientôt, Japon !", sub:"15 jours de temples millénaires et de néons LED, de ramen slurpés en isoloir et de wagyu fondu sur la langue, de cerisiers et de forêts de bambou, de daims sacrés et de GT-R rugissants dans la nuit de Yokohama. Le Japon sera encore là à votre retour. Et il sera encore plus beau qu'à l'aller. Mata ne !"},
      ]},
      { id:"soir", items:[] },
    ],
    tips:[
      "🛃 DOUANE DE RETOUR EN FRANCE : Franchise 430€/personne pour les achats hors UE. Whisky (>22°) = 1 litre sans taxe (duty-free inclus). Déclarer au-delà. Les emballages originaux et reçus sont votre meilleure protection.",
      "💴 SUICA IC CARD : Rembourser le dépôt (500¥) + solde restant au guichet JR de Haneda avant de passer les douanes. Ou garder la carte — elle reste valide jusqu'en 2028 et fonctionne si vous revenez.",
    ],
  },
];

// ─── CHECKLIST ──────────────────────────────────────────────────
const CHECKLIST = [
  { cat:"🎟 Activités — Déjà confirmées", color:"#22C55E", items:[
    { name:"Tokyo Skytree", date:"28 avril — 18h00", platform:"tokyo-skytree.jp", status:"ok", note:"" },
    { name:"TeamLab Planets Tokyo (Toyosu)", date:"30 avril — 15h00", platform:"teamlab.art", status:"ok", note:"" },
    { name:"Universal Studios Japan", date:"8 mai — journée", platform:"usj.co.jp", status:"ok", note:"" },
  ]},
  { cat:"🔴 Urgence absolue — Réserver maintenant", color:"#F87171", items:[
    { name:"Shibuya Sky (Scramble Square)", date:"30 avril soir — 18h30", platform:"shibuya-scramble-square.com", status:"book", note:"Sold out rapidement en Golden Week" },
    { name:"Kittan Hibiki — Wagyu Yakiniku Osaka", date:"Soir du 9 mai (J13)", platform:"Tablecheck.com ou Tableall.com — chercher Kittan Hibiki Osaka", status:"book", note:"Réserver plusieurs semaines à l'avance" },
    { name:"Gion Tanto — Cuisine kyotoïte machiya", date:"Soir du 4 ou 6 mai", platform:"Tablecheck ou contact direct", status:"book", note:"Délai minimum 2-3 semaines — urgent" },
    { name:"Kichi Kichi Omurice — Chef Yukimura", date:"Soir du 5 mai", platform:"kichikichi.co.jp ou DM Instagram @kichikichi_yukimura", status:"book", note:"6 places seulement — tenter tous les canaux" },
    { name:"Hôtel nuit du 10 mai (proche Haneda)", date:"10 → 11 mai", platform:"Booking.com / Agoda / hotel direct", status:"book", note:"Haneda Excel Hotel Tokyu ou Keikyu EX Inn Haneda" },
  ]},
  { cat:"🟠 Important — Faire dès l'arrivée au Japon", color:"#FB923C", items:[
    { name:"Sièges Shinkansen Tokyo→Kyoto (3 mai)", date:"Dès activation JR Pass — PRIORITÉ J1", platform:"Guichet 'みどりの窓口' (Midori no Madoguchi)", status:"book", note:"Dire: Hikari, Tokyo kara Kyoto, san-gatsu, sannin, madogawa onegaishimasu" },
    { name:"Sièges Shinkansen Kyoto→Osaka (7 mai) + Osaka→Tokyo (10 mai)", date:"Idem — J1 ou J2", platform:"Guichet JR en gare", status:"book", note:"" },
    { name:"Compte USJ App + Entry Pass Nintendo World", date:"Compte à créer AVANT le départ", platform:"usj.co.jp", status:"book", note:"Entry Pass se réserve sur place dans le parc dès l'ouverture" },
  ]},
  { cat:"🟡 Optionnel — Réserver si intérêt", color:"#FBBF24", items:[
    { name:"DAWN Avatar Robot Café (OriHime Diner)", date:"1 mai — Après-midi (16h)", platform:"dawn2021.orylab.com — réserver le OriHime Diner", status:"book", note:"5500¥/pers. Réservation obligatoire en ligne, pas de réservation le jour même. Fermé le jeudi." },
    { name:"Hozugawa Boat Ride (Arashiyama)", date:"4 mai après-midi", platform:"hozugawa.co.jp", status:"free", note:"~4000¥/pers, ~2h descente gorges" },
    { name:"Sagano Scenic Railway (Arashiyama)", date:"4 mai", platform:"sagano-kanko.co.jp", status:"free", note:"880¥/pers, réservation recommandée" },
    { name:"Location kimono (Ninenzaka, Kyoto)", date:"6 mai matin", platform:"Yumeyakata.com ou wargo.jp", status:"free", note:"~3000-5000¥ avec coiffure et accessoires" },
    { name:"Daikoku Parking Area (Yokohama)", date:"Soir du 2 mai — vendredi nuit", platform:"Aucune réservation — taxi depuis Yokohama Station", status:"free", note:"Gratuit. Taxi Yokohama → Daikoku Futo ~2000¥" },
  ]},
  { cat:"🗺️ Excursions — À planifier", color:"#34D399", items:[
    { name:"Excursion Nikko — Tosho-gu & Futarasan", date:"29 avril (J3b) — départ 6h30", platform:"JR Pass ✅ OU Tobu Nikko All Area Pass (~4500¥) sur tobuline.co.jp", status:"free", note:"Partir avant 7h impérativement — sanctuaires ferment à 17h" },
    { name:"Hakone Free Pass (optionnel)", date:"2 mai (J6b) — si pas JR Pass", platform:"odakyu.jp — Hakone Free Pass ~6000¥/2 jours", status:"free", note:"Couvre Romancecar + tous transports internes Hakone" },
    { name:"Route Fuji Subaru 5e Station — Vérifier ouverture", date:"2 mai si ouvert (mi-avril selon année)", platform:"fujisan-climb.jp pour dates d'ouverture", status:"free", note:"⚠️ Peut être fermée jusqu'à fin avril — toujours vérifier avant" },
    { name:"Onsen Hakone — Réserver si tatouages", date:"2 mai après-midi", platform:"tenzan.jp ou yumoto-fujiya.co.jp", status:"free", note:"Tenzan Tohji-kyo = plus tolérant aux tatouages" },
  ]},
  { cat:"📱 À faire avant le départ (France)", color:"#60A5FA", items:[
    { name:"Google Maps offline (Tokyo/Kyoto/Osaka/Nara)", date:"Avant départ", platform:"Google Maps app > Télécharger la zone hors ligne", status:"book", note:"Indispensable — connexion data pas toujours disponible" },
    { name:"Google Translate japonais offline + mode caméra", date:"Avant départ", platform:"Google Translate", status:"book", note:"Mode caméra = scanner les menus en temps réel" },
    { name:"Navitime Japan", date:"Avant départ", platform:"App Store / Google Play", status:"book", note:"Meilleur pour itinéraires JR + transferts complexes" },
    { name:"Créer compte USJ", date:"Avant départ", platform:"usj.co.jp", status:"book", note:"Obligatoire pour Entry Pass Nintendo World le 8 mai" },
    { name:"Pocket Concierge ou Tablecheck (compte)", date:"Avant départ", platform:"pocketconcierge.jp / tablecheck.com", status:"book", note:"Pour tenter réservations restaurants depuis la France" },
  ]},
];

const TABS = [
  { id:"tokyo",     label:"🗼 Tokyo",     sub:"J1→J7 • Nikko • Hakone",        range:[1,7],   city:"tokyo"  },
  { id:"kyoto",     label:"⛩ Kyoto",     sub:"J8→J11",       range:[8,11],  city:"kyoto"  },
  { id:"osaka",     label:"🎡 Osaka",     sub:"J12→J14",      range:[12,14], city:"osaka"  },
  { id:"depart",    label:"✈️ Départ",    sub:"J15",           range:[15,15], city:"depart" },
  { id:"infos",     label:"💡 Infos",     sub:"Pratiques",     range:[],      city:"transit"},
  { id:"checklist", label:"📋 Checklist", sub:"Réservations",  range:[],      city:"transit"},
  { id:"gastro",    label:"🍜 Gastronomie", sub:"Guide complet", range:[],      city:"transit"},
  { id:"meteo",     label:"🌤 Météo",       sub:"& Préparation", range:[],      city:"transit"},
  { id:"phrasebook",label:"🗣 Phrasebook",  sub:"Guide japonais", range:[],      city:"transit"},
  { id:"calendrier", label:"🎌 Calendrier",  sub:"Événements",     range:[],      city:"transit"},
];


// ─── SEARCH UTILITIES ─────────────────────────────────────────────
function highlight(text, query, dark) {
  if (!query || !text) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{
        background: dark ? "#854D0E" : "#FEF08A",
        color: dark ? "#FEF9C3" : "#78350F",
        borderRadius: "2px",
        padding: "0 1px",
      }}>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function matchesQuery(day, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  if (day.title.toLowerCase().includes(q)) return true;
  if (day.alert && day.alert.toLowerCase().includes(q)) return true;
  if (day.tips && day.tips.some(tip => tip.toLowerCase().includes(q))) return true;
  return day.sections.some(sec =>
    sec.items.some(item =>
      (item.t && item.t.toLowerCase().includes(q)) ||
      (item.sub && item.sub.toLowerCase().includes(q))
    )
  );
}

function countMatches(days, query) {
  if (!query) return 0;
  return days.filter(d => matchesQuery(d, query)).length;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("tokyo");
  const [openDays, setOpenDays] = useState(new Set([1]));
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  // ── Mode Voyage en cours ──────────────────────────────────────
  const [voyageMode, setVoyageMode] = useState(true);
  // Trip boundaries expressed in Japan time (JST = UTC+9). Using explicit offset avoids
  // the user's local timezone skewing "Jour X of your trip" when they are in France
  // before departure OR on Japanese soil after arrival.
  const TRIP_START = new Date("2026-04-27T00:00:00+09:00");
  const TRIP_END   = new Date("2026-05-11T23:59:59+09:00");
  const now = new Date();
  const msToStart = TRIP_START - now;
  const daysToStart = Math.ceil(msToStart / 86400000);
  const inTrip = now >= TRIP_START && now <= TRIP_END;
  const afterTrip = now > TRIP_END;
  // Day number is the floor of elapsed days since midnight JST of April 27th, plus 1.
  // Using floor (not ceil) avoids returning 0 at the exact stroke of midnight and
  // handles fractional days cleanly.
  const currentDayN = inTrip
    ? Math.min(15, Math.floor((now - TRIP_START) / 86400000) + 1)
    : null;
  const currentDayObj = currentDayN != null
    ? DAYS.find(d => d.n === currentDayN)
    : null;
  const [timeStr, setTimeStr] = useState(() => {
    const d = new Date();
    const jp = new Intl.DateTimeFormat("fr-FR",{timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit"}).format(d);
    return jp;
  });
  useEffect(() => {
    const t = setInterval(() => {
      const jp = new Intl.DateTimeFormat("fr-FR",{timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit"}).format(new Date());
      setTimeStr(jp);
    }, 30000);
    return () => clearInterval(t);
  }, []);

  // ── PWA: register the service worker ─────────────────────────────
  // Registered after first paint so it never blocks initial render.
  // Dev note: the SW file must live at the site root (/sw.js) — not
  // nested under /assets/ — otherwise its scope is limited.
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const reg = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(err => console.warn("[PWA] SW registration failed:", err));
    };
    if (document.readyState === "complete") reg();
    else window.addEventListener("load", reg, { once: true });
  }, []);

  const toggleDay = n => setOpenDays(p => { const s=new Set(p); s.has(n)?s.delete(n):s.add(n); return s; });
  const tab = TABS.find(t => t.id === activeTab);
  const allDays = DAYS.filter(d => tab.range.length && d.n >= tab.range[0] && d.n <= tab.range[1]).sort((a,b) => a.n - b.n);
  const days = query ? allDays.filter(d => matchesQuery(d, query)) : allDays;
  const totalMatches = query ? countMatches(allDays, query) : 0;

  useEffect(() => {
    if (!query) return;
    // Use a small delay so React has flushed the new DOM, then querySelector the
    // first matching day card. Refs were unreliable because the conditional ref
    // attachment in DayCard fires inconsistently across re-renders.
    const id = setTimeout(() => {
      const firstCard = document.querySelector('main article[id^="day-"]');
      if (firstCard) {
        const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        firstCard.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }
    }, 60);
    return () => clearTimeout(id);
  }, [query, activeTab]);

  // Auto-navigate to current day
  useEffect(() => {
    if (voyageMode && inTrip && currentDayN != null) {
      const tabForDay = TABS.find(t => t.range.length && currentDayN >= t.range[0] && currentDayN <= t.range[1]);
      if (tabForDay) {
        setActiveTab(tabForDay.id);
        setTimeout(() => {
          const el = document.getElementById("day-" + currentDayN);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  // eslint-disable-next-line
  }, [voyageMode]);

  return (
    <NavCtx.Provider value={{ goTo: (tabId, dayN) => {
        setActiveTab(tabId);
        setTimeout(() => {
          const el = document.getElementById("day-" + dayN);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }}}>
    <DarkCtx.Provider value={dark}>
      <div className="min-h-screen" style={{ fontFamily:"'DM Sans',system-ui,sans-serif", background:v("pageBg",dark), transition:"background 0.3s" }}>
        <style>{`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*{box-sizing:border-box;}
html, body { margin:0; padding:0; }
button{font-family:inherit; -webkit-tap-highlight-color: transparent; }
a { -webkit-tap-highlight-color: transparent; }

/* Prevent text selection on UI chrome, allow it on content/inputs */
*, *::before, *::after { -webkit-user-select: none; user-select: none; }
input, textarea, [contenteditable], p, h1, h2, h3, h4, h5, h6, span, div[data-selectable] {
  -webkit-user-select: text; user-select: text;
}

/* Anti iOS input zoom: Safari zooms any input under 16px on focus */
input, textarea, select { font-size: 16px !important; }

/* Focus-visible ring for keyboard users */
:focus { outline: none; }
:focus-visible {
  outline: 2px solid #B0000A;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Smooth momentum scrolling on iOS */
html, body { -webkit-overflow-scrolling: touch; overscroll-behavior-y: none; }

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Safe area insets for iPhone notch/Dynamic Island and Android gesture bar */
@supports (padding: max(0px)) {
  .safe-top { padding-top: max(1.75rem, env(safe-area-inset-top)); }
  .safe-bottom { padding-bottom: max(0.5rem, env(safe-area-inset-bottom)); }
  .safe-fab-bottom { bottom: max(1.1rem, calc(env(safe-area-inset-bottom) + 0.5rem)); }
}

/* iOS 100vh bug fix: use dynamic viewport unit with fallback.
   100vh on iOS Safari includes the retractable URL bar, which causes
   content to be cut off when it hides. 100dvh adapts to the actual
   visible viewport. */
.min-h-screen { min-height: 100vh; min-height: 100dvh; }

/* Enforce minimum 44x44 touch targets on close/icon buttons marked
   with data-tap="icon". Applied via attribute so we don't break the
   many small chip-style buttons elsewhere. */
button[data-tap="icon"] {
  min-width: 44px;
  min-height: 44px;
}
button[data-tap="action"] {
  min-height: 44px;
  padding-left: 0.9rem;
  padding-right: 0.9rem;
}

/* Horizontal scroll fade indicator for the tab nav */
.nav-scroll-wrap {
  position: relative;
}
.nav-scroll-wrap::after {
  content: "";
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 28px;
  pointer-events: none;
  background: linear-gradient(to right, transparent, var(--nav-fade-color, white));
}
.nav-scroll-wrap[data-dark="true"]::after { --nav-fade-color: #141414; }

/* Hide scrollbar on the horizontal tabs nav (Chrome Android shows it by default) */
.nav-scroll-wrap nav { scrollbar-width: none; -ms-overflow-style: none; }
.nav-scroll-wrap nav::-webkit-scrollbar { display: none; }

/* Scroll-snap for the tabs nav so swipes feel natural on mobile */
.nav-scroll-wrap nav { scroll-snap-type: x proximity; }
.nav-scroll-wrap nav > div > button { scroll-snap-align: start; }

/* Defer rendering/layout of off-screen day cards. This keeps first
   paint fast on older phones even with 16 data-heavy days. */
article[id^="day-"] {
  content-visibility: auto;
  contain-intrinsic-size: 0 200px;
}

/* Prevent horizontal scroll at page level (common mobile bug when a
   child accidentally overflows the viewport). */
html, body { overflow-x: hidden; max-width: 100vw; }

@media print {
  header, nav, .no-print, [class*="urgent"], [class*="search"], [class*="toggle"],
  button:not(.print-show) { display:none !important; }
  body { background: white !important; color: black !important; }
  main { padding: 0 !important; max-width: 100% !important; }
  article { break-inside: avoid; page-break-inside: avoid; border: 1px solid #ccc !important; margin-bottom: 0.5cm !important; }
  @page { margin: 1.5cm; size: A4; }
}
`}</style>
        <OfflineBanner />
        <InstallBanner />
        <EmergencyFAB />
        <header className="safe-top" style={{ background:"linear-gradient(135deg,#7B0000 0%,#B0000A 60%,#CC2020 100%)", padding:"1.75rem 1.25rem 1.5rem", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:"-40px", top:"-40px", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", color:"rgba(255,255,255,0.55)", fontSize:"0.78rem", letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:"0.35rem" }}>Voyage Japon · 3 adultes · 27 avril – 11 mai 2026</p>
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif", color:"white", fontSize:"1.85rem", fontWeight:600, lineHeight:1.2, marginBottom:"1rem" }}>Itinéraire Complet</h1>
            </div>
            <button
              onClick={()=>setDark(d=>!d)}
              title={dark?"Mode clair":"Mode sombre"}
              aria-label={dark?"Passer en mode clair":"Passer en mode sombre"}
              style={{
                flexShrink:0, marginLeft:"0.75rem",
                width:"44px", height:"44px",
                borderRadius:"12px", border:"none", cursor:"pointer",
                background: dark ? "rgba(250,204,21,0.25)" : "rgba(255,255,255,0.18)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"1.1rem",
                transition:"background 0.2s",
              }}
            >
              {dark ? "🌙" : "☀️"}
            </button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"0.45rem" }}>
            {["🏨 4 séjours réservés","🎫 JR Pass ✅","✈️ Haneda (HND)","🎌 Golden Week","👥 3 adultes","☕ Petit-déj inclus"].map((b,i)=>(
              <span key={i} style={{ background:"rgba(255,255,255,0.12)", borderRadius:"20px", padding:"0.18rem 0.6rem", color:"rgba(255,255,255,0.92)", fontSize:"0.7rem" }}>{b}</span>
            ))}
          </div>
          {/* U1 — Trip progress bar */}
          <TripProgressBar
            currentDayN={currentDayN}
            inTrip={inTrip}
            afterTrip={afterTrip}
            onJump={(dayN) => {
              const tabForDay = TABS.find(t => t.range.length && dayN >= t.range[0] && dayN <= t.range[1]);
              if (tabForDay) {
                setActiveTab(tabForDay.id);
                setOpenDays(prev => new Set(prev).add(dayN));
                setTimeout(() => {
                  const el = document.getElementById("day-" + dayN);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 120);
              }
            }}
          />
        </header>
        <div
          onClick={() => setActiveTab("checklist")}
          style={{ background:v("urgentBg",dark), borderBottom:`2px solid ${v("urgentBdr",dark)}`, padding:"0.6rem 1.25rem", transition:"background 0.3s", cursor:"pointer" }}
          role="button"
          aria-label="Voir la checklist des réservations"
        >
          <UrgentReservationsBanner />
        </div>
        {/* ── MODE VOYAGE ── */}
        {voyageMode && (
          <div style={{ background: inTrip ? (dark?"#0A2010":"#DCFCE7") : afterTrip ? (dark?"#1A1A2E":"#EEF2FF") : (dark?"#1C1400":"#FEF9C3"), padding:"0.5rem 1rem", display:"flex", alignItems:"center", gap:"0.5rem", borderBottom:`1px solid ${inTrip?(dark?"#14301E":"#BBF7D0"):afterTrip?(dark?"#2D4A7A":"#BFDBFE"):(dark?"#713F12":"#FDE68A")}`, flexWrap:"wrap" }}>
            {!inTrip && !afterTrip && daysToStart > 0 && (
              <>
                <span style={{ fontSize:"1rem" }}>⏳</span>
                <span style={{ fontSize:"0.75rem", fontWeight:600, color: dark?"#FCD34D":"#92400E", flex:1 }}>Départ dans <strong>{daysToStart}</strong> jour{daysToStart>1?"s":""} — 27 avril 2026</span>
              </>
            )}
            {inTrip && currentDayObj && (
              <>
                <span style={{ fontSize:"1rem" }}>🗾</span>
                <span style={{ fontSize:"0.75rem", fontWeight:600, color:dark?"#4ADE80":"#166534", flex:1 }}>Jour {currentDayN} de votre voyage — {currentDayObj.title}</span>
                <span style={{ fontSize:"0.7rem", color:dark?"#4ADE80":"#166534" }}>🕐 Tokyo {timeStr}</span>
              </>
            )}
            {afterTrip && (
              <>
                <span style={{ fontSize:"1rem" }}>🎌</span>
                <span style={{ fontSize:"0.75rem", fontWeight:600, color:dark?"#93C5FD":"#1E40AF", flex:1 }}>Voyage terminé — Sayōnara Nihon ! 15 jours · 3 villes · des souvenirs pour toujours</span>
              </>
            )}
            <button
              onClick={()=>setVoyageMode(false)}
              aria-label="Masquer le mode voyage"
              data-tap="icon"
              style={{
                fontSize:"0.9rem",
                color:dark?"rgba(255,255,255,0.45)":"rgba(0,0,0,0.4)",
                background:"transparent", border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                borderRadius:"8px",
                fontFamily:"inherit", flexShrink:0,
              }}
            >✕</button>
          </div>
        )}
        {/* ── SEARCH BAR ── */}
        <div style={{ background:v("cardBg",dark), borderBottom:`1px solid ${v("navBorder",dark)}`, padding:"0.55rem 1rem", display:"flex", alignItems:"center", gap:"0.5rem", transition:"background 0.3s" }}>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:"0.5rem", background:v("cardBg2",dark), border:`1px solid ${v("borderLight",dark)}`, borderRadius:"8px", padding:"0.38rem 0.7rem" }}>
            <span style={{ color:v("textMuted",dark), fontSize:"0.82rem", flexShrink:0, userSelect:"none" }}>🔍</span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Rechercher un lieu, activité, restaurant…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:"0.78rem", color:v("textPrimary",dark), fontFamily:"inherit" }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Effacer la recherche"
                data-tap="icon"
                style={{
                  border:"none", background:"transparent", cursor:"pointer",
                  color:v("textMuted",dark), fontSize:"1.05rem",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  borderRadius:"8px", lineHeight:1, flexShrink:0,
                }}
              >✕</button>
            )}
          </div>
          {query && (
            <>
              <span style={{ fontSize:"0.72rem", color:v("textSec",dark), whiteSpace:"nowrap", flexShrink:0 }}>
                {totalMatches > 0 ? `${totalMatches}` : "0"}
              </span>
              <button
                onClick={() => {
                  setQuery("");
                  if (searchRef.current) searchRef.current.blur();
                }}
                style={{
                  fontSize:"0.75rem", fontWeight:600,
                  color: dark ? "#60A5FA" : "#1D4ED8",
                  background:"transparent", border:"none", cursor:"pointer",
                  padding:"0.4rem 0.35rem", fontFamily:"inherit", flexShrink:0,
                }}
              >Annuler</button>
            </>
          )}
        </div>
        <div className="nav-scroll-wrap" data-dark={dark ? "true" : "false"}>
        <nav style={{ background:v("navBg",dark), borderBottom:`1px solid ${v("navBorder",dark)}`, overflowX:"auto", WebkitOverflowScrolling:"touch", transition:"background 0.3s" }}>
          <div style={{ display:"flex", minWidth:"max-content" }}>
            {TABS.map(tb => {
              const cc = CITY[tb.city];
              const active = activeTab === tb.id;
              return (
                <button key={tb.id} onClick={()=>setActiveTab(tb.id)} style={{ padding:"0.85rem 0.9rem", border:"none", background:"transparent", cursor:"pointer", borderBottom:active?`3px solid ${cc.color}`:"3px solid transparent", transition:"all 0.15s", outline:"none" }}>
                  <div style={{ fontSize:"0.8rem", fontWeight:600, color:active?cc.color:v("textSec",dark), whiteSpace:"nowrap" }}>{tb.label}</div>
                  <div style={{ fontSize:"0.68rem", color:v("textMuted",dark), marginTop:"1px" }}>{tb.sub}</div>
                </button>
              );
            })}
          </div>
        </nav>
        </div>
        <main style={{ padding:"0.875rem 0.875rem calc(6rem + env(safe-area-inset-bottom, 0px))", maxWidth:"760px", margin:"0 auto" }}>
          {activeTab==="infos"     && <InfoSection />}
          {activeTab==="checklist" && <ChecklistSection />}
          {activeTab==="gastro"    && <GastroSection />}
          {activeTab==="meteo"     && <MeteoSection />}
          {activeTab==="phrasebook"&& <PhrasebookSection />}
          {activeTab==="calendrier"&& <CalendrierSection />}
          {!["infos","checklist","gastro","meteo","phrasebook","calendrier"].includes(activeTab) && (
            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
              {/* U16 — Expand/Collapse all */}
              {!query && days.length > 0 && (
                <div style={{ display:"flex", gap:"0.5rem", justifyContent:"flex-end" }}>
                  <button
                    onClick={() => setOpenDays(new Set(days.map(d => d.n)))}
                    data-tap="action"
                    style={{
                      fontSize:"0.75rem", fontWeight:600,
                      color: v("textSec",dark),
                      background: "transparent",
                      border: `1px solid ${v("borderLight",dark)}`,
                      borderRadius: "8px",
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >▼ Tout déplier</button>
                  <button
                    onClick={() => setOpenDays(new Set())}
                    data-tap="action"
                    style={{
                      fontSize:"0.75rem", fontWeight:600,
                      color: v("textSec",dark),
                      background: "transparent",
                      border: `1px solid ${v("borderLight",dark)}`,
                      borderRadius: "8px",
                      cursor: "pointer", fontFamily: "inherit",
                    }}
                  >▲ Tout replier</button>
                </div>
              )}
              {query && days.length === 0 ? (
                <div style={{ textAlign:"center", padding:"2rem 1rem", color:v("textSec",dark) }}>
                  <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>🔍</div>
                  <p style={{ fontSize:"0.9rem", fontWeight:600, color:v("textPrimary",dark), margin:"0 0 0.25rem" }}>Aucun résultat pour « {query} »</p>
                  <p style={{ fontSize:"0.78rem", margin:0 }}>Essayez un autre mot-clé ou changez d'onglet.</p>
                </div>
              ) : (
                days.map((d) => (
                  <DayCard
                    key={d.n}
                    day={d}
                    isOpen={query ? true : openDays.has(d.n)}
                    onToggle={() => toggleDay(d.n)}
                    query={query}
                  />
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </DarkCtx.Provider>
    </NavCtx.Provider>
  );
}

const DayCard = forwardRef(function DayCard({ day, isOpen, onToggle, query }, ref) {
  const dark = useDark();
  const [viewMode, setViewMode] = useState(() => {
    try { return localStorage.getItem("viewMode") || "cards"; } catch { return "cards"; }
  });
  const toggleView = () => {
    const next = viewMode === "cards" ? "timeline" : "cards";
    setViewMode(next);
    try { localStorage.setItem("viewMode", next); } catch {}
  };
  const cc = CITY[day.city]||CITY.transit;
  const cityNames = { tokyo:"Tokyo", kyoto:"Kyoto", osaka:"Osaka", transit:"Transit", depart:"Départ" };
  return (
    <article ref={ref} id={"day-" + day.n} style={{ background:v("cardBg",dark), borderRadius:"12px", overflow:"hidden", boxShadow:dark?"0 1px 4px rgba(0,0,0,0.4)":"0 1px 4px rgba(0,0,0,0.07)", border:`1px solid ${v("border",dark)}`, transition:"background 0.3s, border 0.3s" }}>
      <button onClick={onToggle} style={{ width:"100%", display:"flex", alignItems:"center", gap:"0.85rem", padding:"0.85rem 1rem", background:"transparent", border:"none", cursor:"pointer", textAlign:"left", outline:"none" }}>
        <div style={{ flexShrink:0, width:"2.5rem", height:"2.5rem", borderRadius:"50%", background:cc.light[dark?"dark":"light"], border:`2px solid ${cc.border[dark?"dark":"light"]}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:"0.68rem", color:cc.color, fontWeight:700, lineHeight:1 }}>J</span>
          <span style={{ fontSize:day.nLabel?"0.85rem":"0.95rem", color:cc.color, fontWeight:700, lineHeight:1 }}>{day.nLabel||day.n}</span>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", flexWrap:"wrap", marginBottom:"0.2rem" }}>
            <span style={{ fontSize:"0.72rem", fontWeight:600, color:cc.color, background:cc.light[dark?"dark":"light"], padding:"0.1rem 0.45rem", borderRadius:"10px", flexShrink:0 }}>{cityNames[day.city]||day.city}</span>
            <span style={{ fontSize:"0.68rem", color:v("textMuted",dark), flexShrink:0 }}>{day.day} {day.date}</span>
            {day.alert && <span style={{ fontSize:"0.7rem", background:dark?"#2A1800":"#FEF3C7", color:dark?"#FCD34D":"#92400E", padding:"0.1rem 0.4rem", borderRadius:"8px" }}>🎌 Jour férié</span>}
          </div>
          <div style={{ fontSize:"0.9rem", fontWeight:600, color:v("textPrimary",dark), lineHeight:1.3, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", wordBreak:"break-word" }}>{day.title}</div>
        </div>
        <span style={{ color:v("textMuted",dark), fontSize:"0.8rem", flexShrink:0, display:"inline-block", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
      </button>
      {day.alert && (
        <div style={{ margin:"0 0.875rem 0.75rem", padding:"0.5rem 0.75rem", background:v("alertBg",dark), borderRadius:"8px", borderLeft:`3px solid ${v("alertBdr",dark)}` }}>
          <p style={{ fontSize:"0.74rem", color:v("alertTxt",dark), lineHeight:1.45, margin:0 }}>{day.alert}</p>
        </div>
      )}
      {isOpen && (
        <div style={{ padding:"0 0.875rem 0.875rem" }}>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"0.5rem" }}>
            <button onClick={e=>{e.stopPropagation();toggleView();}} data-tap="action" style={{ fontSize:"0.75rem", borderRadius:"8px", border:`1px solid ${v("borderLight",dark)}`, background:viewMode==="timeline"?(dark?"#1A2340":"#EEF2FF"):"transparent", color:viewMode==="timeline"?"#3B7EFF":v("textMuted",dark), cursor:"pointer", fontFamily:"inherit" }}>
              {viewMode==="timeline"?"📋 Cartes":"⏱ Timeline"}
            </button>
          </div>
          {viewMode==="timeline" ? (
            <TimelineView sections={day.sections} city={day.city} />
          ) : (
          <>{day.sections.filter(s=>s.items.length>0).map(section=><SectionBlock key={section.id} section={section} query={query} dayN={day.n} dayCity={day.city} />)}</>
          )}
          {day.tips?.length>0 && (
            <div style={{ marginTop:"0.75rem", padding:"0.65rem 0.75rem", background:v("tipsBg",dark), borderRadius:"8px", borderLeft:`3px solid ${v("tipsBdr",dark)}` }}>
              <p style={{ fontSize:"0.72rem", fontWeight:700, color:v("tipsHead",dark), marginBottom:"0.35rem", textTransform:"uppercase", letterSpacing:"0.06em" }}>💡 Conseils du jour</p>
              {day.tips.map((tip,i)=><p key={i} style={{ fontSize:"0.75rem", color:v("tipsTxt",dark), lineHeight:1.45, margin:i>0?"0.3rem 0 0":0 }}>{query ? highlight(tip, query, dark) : tip}</p>)}
            </div>
          )}
          {/* U13 — Personal day notes */}
          <DayNotes dayN={day.n} />
          {/* E1 — Collapse button */}
          <button
            onClick={() => {
              // Scroll back to the day header first so the user isn't left in the middle of another day
              const el = document.getElementById("day-" + day.n);
              if (el) {
                const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
              }
              setTimeout(onToggle, 50);
            }}
            style={{
              width:"100%",
              marginTop:"0.75rem",
              padding:"0.55rem",
              background:"transparent",
              border:`1px dashed ${v("borderLight",dark)}`,
              borderRadius:"8px",
              color:v("textMuted",dark),
              fontSize:"0.72rem", fontWeight:600,
              cursor:"pointer", fontFamily:"inherit",
              minHeight:"40px",
            }}
          >
            ▲ Replier cette journée
          </button>
          {/* U2 — Prev / Next day navigation */}
          <DayNav dayN={day.n} />
        </div>
      )}
    </article>
  );
});

// ─── DAY NOTES (U13) ─────────────────────────────────────────────
function DayNotes({ dayN }) {
  const dark = useDark();
  const [note, setNote] = useDayNote(dayN);
  const [expanded, setExpanded] = useState(!!note);
  return (
    <div style={{ marginTop:"0.75rem", padding:"0.65rem 0.75rem", background:v("cardBg2",dark), borderRadius:"8px", border:`1px dashed ${v("borderLight",dark)}` }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          background:"transparent", border:"none", padding:0, cursor:"pointer",
          fontFamily:"inherit", display:"flex", alignItems:"center", gap:"0.4rem",
          color:v("textSec",dark), fontSize:"0.7rem", fontWeight:600,
          width:"100%", justifyContent:"space-between",
        }}
      >
        <span>📝 Mes notes {note ? `(${note.length} car.)` : ""}</span>
        <span style={{ transform: expanded ? "rotate(180deg)" : "none", transition:"transform 0.2s" }}>▼</span>
      </button>
      {expanded && (
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Tes impressions, ce que tu as aimé, à retenir pour la prochaine fois..."
          rows={3}
          style={{
            width:"100%", marginTop:"0.5rem", padding:"0.5rem 0.6rem",
            border:`1px solid ${v("borderLight",dark)}`, borderRadius:"6px",
            background:v("cardBg",dark), color:v("textPrimary",dark),
            fontSize:"0.78rem", fontFamily:"inherit", resize:"vertical",
            outline:"none", boxSizing:"border-box", lineHeight:1.45,
          }}
        />
      )}
    </div>
  );
}

// ─── DAY PREV/NEXT NAV (U2) ──────────────────────────────────────
function DayNav({ dayN }) {
  const dark = useDark();
  const { goTo } = useNav();
  const sortedDays = [...DAYS].sort((a,b) => a.n - b.n);
  const idx = sortedDays.findIndex(d => d.n === dayN);
  const prev = idx > 0 ? sortedDays[idx - 1] : null;
  const next = idx < sortedDays.length - 1 ? sortedDays[idx + 1] : null;
  const tabForDay = (d) => {
    const tb = TABS.find(t => t.range.length && d.n >= t.range[0] && d.n <= t.range[1]);
    return tb ? tb.id : "tokyo";
  };
  const btnStyle = (disabled) => ({
    flex:1,
    display:"flex", alignItems:"center", gap:"0.4rem",
    padding:"0.5rem 0.7rem",
    background:"transparent",
    border:`1px solid ${v("borderLight",dark)}`,
    borderRadius:"8px",
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.35 : 1,
    fontFamily:"inherit",
    color: v("textPrimary",dark),
    fontSize:"0.72rem",
    minWidth:0,
  });
  return (
    <div style={{ display:"flex", gap:"0.5rem", marginTop:"0.65rem" }}>
      <button
        disabled={!prev}
        onClick={() => prev && goTo(tabForDay(prev), prev.n)}
        style={{ ...btnStyle(!prev), justifyContent:"flex-start" }}
        aria-label={prev ? `Jour précédent : J${prev.n}` : "Pas de jour précédent"}
      >
        <span style={{ fontSize:"0.85rem", flexShrink:0 }}>←</span>
        <div style={{ minWidth:0, flex:1, textAlign:"left" }}>
          <div style={{ fontSize:"0.7rem", color:v("textMuted",dark), fontWeight:600 }}>Précédent</div>
          {prev && <div style={{ fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>J{prev.nLabel || prev.n} · {prev.date}</div>}
        </div>
      </button>
      <button
        disabled={!next}
        onClick={() => next && goTo(tabForDay(next), next.n)}
        style={{ ...btnStyle(!next), justifyContent:"flex-end" }}
        aria-label={next ? `Jour suivant : J${next.n}` : "Pas de jour suivant"}
      >
        <div style={{ minWidth:0, flex:1, textAlign:"right" }}>
          <div style={{ fontSize:"0.7rem", color:v("textMuted",dark), fontWeight:600 }}>Suivant</div>
          {next && <div style={{ fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>J{next.nLabel || next.n} · {next.date}</div>}
        </div>
        <span style={{ fontSize:"0.85rem", flexShrink:0 }}>→</span>
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// C. TIMELINE VIEW
// ═══════════════════════════════════════════════════════════════════
function TimelineView({ sections, city }) {
  const dark = useDark();
  const cc = CITY[city] || CITY.transit;
  const [expandedItem, setExpandedItem] = useState(null);

  // Parse hour from item title (e.g. "🕘 9h00 — ..." → 9)
  const parseHour = (t) => {
    const m = t.match(/(\d{1,2})h(\d{0,2})/);
    return m ? parseFloat(m[1]) + (m[2] ? parseInt(m[2]||"0")/60 : 0) : null;
  };

  // Default hours by section
  const defaultHours = { matin: 8.5, aprem: 14, soir: 19.5, nuit: 22.5 };

  // Flatten all items with time
  const allItems = sections.flatMap(sec =>
    sec.items.map((item, idx) => {
      const h = parseHour(item.t);
      return {
        ...item,
        sectionId: sec.id,
        hour: h !== null ? h : defaultHours[sec.id] || 10,
        hasExactHour: h !== null,
        key: sec.id + "-" + idx,
      };
    })
  ).sort((a, b) => a.hour - b.hour);

  // Timeline: 7h to 24h
  const START_H = 7, END_H = 24;
  const TOTAL_H = END_H - START_H;
  const PX_PER_H = 52;
  const totalHeight = TOTAL_H * PX_PER_H;

  const sectionColors = {
    matin: { bg: "#FDE68A", color: "#92400E" },
    aprem: { bg: "#BFDBFE", color: "#1E40AF" },
    soir:  { bg: "#DDD6FE", color: "#4C1D95" },
    nuit:  { bg: "#CBD5E1", color: "#374151" },
  };

  const statusIcon = { ok:"✅", book:"⚠️", free:"🔓", note:"ℹ️", opt:"✨" };

  return (
    <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
      <div style={{ display:"flex", minWidth:"280px", position:"relative", paddingLeft:"2.5rem", paddingRight:"0.5rem", paddingTop:"0.5rem", paddingBottom:"0.5rem" }}>
        {/* Hour labels + lines */}
        <div style={{ position:"absolute", left:0, top:"0.5rem", width:"2.5rem", height:totalHeight }}>
          {Array.from({ length: TOTAL_H + 1 }, (_, i) => i + START_H).map(h => (
            <div key={h} style={{ position:"absolute", top: (h - START_H) * PX_PER_H - 6, left:0, width:"100%" }}>
              <span style={{ fontSize:"0.68rem", color:v("textMuted",dark), fontWeight:600, display:"block", textAlign:"right", paddingRight:"6px", lineHeight:1 }}>{h}h</span>
            </div>
          ))}
        </div>
        {/* Grid lines */}
        <div style={{ position:"absolute", left:"2.5rem", right:"0.5rem", top:"0.5rem", height:totalHeight, pointerEvents:"none" }}>
          {Array.from({ length: TOTAL_H + 1 }, (_, i) => i + START_H).map(h => (
            <div key={h} style={{ position:"absolute", top: (h - START_H) * PX_PER_H, left:0, right:0, height:"1px", background: h % 2 === 0 ? (dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)") : (dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.03)") }} />
          ))}
        </div>
        {/* Activity blocks */}
        <div style={{ flex:1, position:"relative", height:totalHeight }}>
          {allItems.map((item, i) => {
            const top = Math.max(0, (item.hour - START_H) * PX_PER_H);
            const sc = sectionColors[item.sectionId] || sectionColors.aprem;
            const isExp = expandedItem === item.key;
            const isOpt = item.s === "opt";
            return (
              <div key={item.key}
                onClick={() => setExpandedItem(isExp ? null : item.key)}
                style={{
                  position:"absolute", top, left:"4px", right:"4px",
                  borderLeft:`3px solid ${cc.color}`,
                  borderRadius:"0 6px 6px 0",
                  padding:"0.25rem 0.4rem",
                  cursor:"pointer",
                  zIndex: isExp ? 10 : 1,
                  boxShadow: isExp ? (dark?"0 4px 12px rgba(0,0,0,0.4)":"0 4px 12px rgba(0,0,0,0.15)") : "none",
                  border:`1px solid ${isExp?cc.color:(dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)")}`,
                  borderLeftWidth:"3px",
                  transition:"all 0.2s",
                  maxHeight: isExp ? "400px" : "52px",
                  overflow:"hidden",
                  background: isExp
                    ? (dark?"#1A1A1A":"white")
                    : isOpt
                      ? (dark?"rgba(124,58,237,0.18)":"rgba(124,58,237,0.1)")
                      : (dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)"),
                }}
              >
                <div style={{ display:"flex", alignItems:"center", gap:"0.3rem", flexWrap:"wrap" }}>
                  <span style={{ fontSize:"0.7rem", fontWeight:700, padding:"0.08rem 0.3rem", borderRadius:"4px", background:sc.bg, color:sc.color, flexShrink:0 }}>
                    {item.hour % 1 === 0 ? `${Math.floor(item.hour)}h` : `${Math.floor(item.hour)}h${Math.round((item.hour%1)*60).toString().padStart(2,"0")}`}
                  </span>
                  <span style={{ fontSize:"0.7rem", flexShrink:0 }}>{statusIcon[item.s]||""}</span>
                  <span style={{ fontSize:"0.7rem", fontWeight:600, color:v("textPrimary",dark), lineHeight:1.2, flex:1 }}>
                    {item.t.replace(/^[🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛🕜🕝🕞🕟🕠🕡🕢🕣🕤🕥🕦🕧]\s*\d{1,2}h\d{0,2}\s*—\s*/u,"").slice(0,50)}
                  </span>
                </div>
                {isExp && item.sub && (
                  <div style={{ marginTop:"0.4rem", paddingTop:"0.4rem", borderTop:`1px solid ${v("borderLight",dark)}` }}>
                    {item.sub.split("\n\n").map((para, pi) => (
                      <p key={pi} style={{ fontSize:"0.68rem", color:v("textSec",dark), margin: pi > 0 ? "0.3rem 0 0" : 0, lineHeight:1.45 }}>{para}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// ─── DONE ITEMS HOOK (U12) ───────────────────────────────────────
// Tracks which planning items the user has marked as completed.
// Storage: Set of stable string keys "dayN-sectionId-idx".
const DONE_ITEMS_KEY = "japan-done-items-v1";
const DONE_ITEMS_EVENT = "japan-done-items-changed";

function useDoneItems() {
  const [done, setDone] = useState(() => {
    try {
      const raw = localStorage.getItem(DONE_ITEMS_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });
  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem(DONE_ITEMS_KEY);
        setDone(raw ? new Set(JSON.parse(raw)) : new Set());
      } catch {}
    };
    window.addEventListener(DONE_ITEMS_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(DONE_ITEMS_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  const toggle = (key) => {
    setDone(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      try {
        localStorage.setItem(DONE_ITEMS_KEY, JSON.stringify([...next]));
        window.dispatchEvent(new Event(DONE_ITEMS_EVENT));
      } catch {}
      if (navigator.vibrate) navigator.vibrate(8);
      return next;
    });
  };
  return { done, toggle };
}

// ─── DAY NOTES HOOK (U13) ────────────────────────────────────────
const DAY_NOTES_KEY = "japan-day-notes-v1";

function useDayNote(dayN) {
  const [note, setNote] = useState(() => {
    try {
      const raw = localStorage.getItem(DAY_NOTES_KEY);
      const all = raw ? JSON.parse(raw) : {};
      return all[dayN] || "";
    } catch { return ""; }
  });
  const update = (val) => {
    setNote(val);
    try {
      const raw = localStorage.getItem(DAY_NOTES_KEY);
      const all = raw ? JSON.parse(raw) : {};
      if (val) all[dayN] = val;
      else delete all[dayN];
      localStorage.setItem(DAY_NOTES_KEY, JSON.stringify(all));
    } catch {}
  };
  return [note, update];
}

// ─── MAPS HELPER (U19) ───────────────────────────────────────────
// Strip emoji + leading "🕐 14h00 — " hour prefix from item title to build
// a clean Google Maps search query.
const cleanTitleForMaps = (title) => {
  return title
    .replace(/^[🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛🕜🕝🕞🕟🕠🕡🕢🕣🕤🕥🕦🕧]\s*/u, "")
    .replace(/^\d{1,2}h\d{0,2}\s*—\s*/, "")
    .replace(/^[✅⚠️🔓ℹ️✨]\s*/u, "")
    .replace(/^[🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛🕜🕝🕞🕟🕠🕡🕢🕣🕤🕥🕦🕧]\s*\d{1,2}h\d{0,2}\s*—\s*/u, "")
    .split("—")[0]
    .split("(")[0]
    .trim();
};

const mapsLink = (query, city) => {
  const q = `${cleanTitleForMaps(query)} ${city || ""}`.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
};


function SectionBlock({ section, query, dayN, dayCity }) {
  const dark = useDark();
  const cfg = PERIOD[section.id]||{ label:section.id, color:t("#374151","#CBD5E1"), bg:t("#F9FAFB","#1E1E1E"), line:t("#E5E7EB","#2D2D2D") };
  // U6: when searching, only render items in this section that actually match.
  // The period label above acts as a breadcrumb: user sees "☀️ Matin" only for
  // matching items, so context is preserved without verbose breadcrumb chips.
  const visibleItems = query
    ? section.items
        .map((item, i) => ({ item, i }))
        .filter(({ item }) => {
          const q = query.toLowerCase();
          return (item.t && item.t.toLowerCase().includes(q)) ||
                 (item.sub && item.sub.toLowerCase().includes(q));
        })
    : section.items.map((item, i) => ({ item, i }));

  if (visibleItems.length === 0) return null;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", margin:"0.75rem 0 0.45rem" }}>
        <div style={{ height:"1px", background:cfg.line[dark?"dark":"light"], flex:1 }}/>
        <span style={{ fontSize:"0.72rem", fontWeight:700, color:cfg.color[dark?"dark":"light"], background:cfg.bg[dark?"dark":"light"], padding:"0.18rem 0.6rem", borderRadius:"12px", whiteSpace:"nowrap", border:`1px solid ${cfg.line[dark?"dark":"light"]}` }}>
          {cfg.label}
          {query && <span style={{ marginLeft:"0.35rem", opacity:0.7 }}>· {visibleItems.length}</span>}
        </span>
        <div style={{ height:"1px", background:cfg.line[dark?"dark":"light"], flex:1 }}/>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
        {visibleItems.map(({ item, i }) => (
          <ActivityItem
            key={i}
            item={item}
            query={query}
            itemKey={`${dayN}-${section.id}-${i}`}
            dayCity={dayCity}
          />
        ))}
      </div>
    </div>
  );
}

function ActivityItem({ item, query, itemKey, dayCity }) {
  const dark = useDark();
  const { done, toggle } = useDoneItems();
  const st = ST[item.s]||ST.free;
  const isOpt = item.s==="opt";
  const isDone = itemKey ? done.has(itemKey) : false;
  const cityName = { tokyo:"Tokyo", kyoto:"Kyoto", osaka:"Osaka" }[dayCity] || "";

  return (
    <div style={{
      padding:"0.6rem 0.75rem",
      background: isDone
        ? (dark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.05)")
        : (isOpt ? v("optBg",dark) : v("cardBg2",dark)),
      borderRadius:"8px",
      border:`1px solid ${isDone ? "rgba(16,185,129,0.3)" : (isOpt ? v("optBdr",dark) : v("borderLight",dark))}`,
      transition:"background 0.2s, border 0.2s",
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"0.5rem" }}>
        <p style={{
          fontSize:"0.83rem", fontWeight:600,
          color: isDone ? v("textMuted",dark) : (isOpt ? v("optTxt",dark) : v("textPrimary",dark)),
          lineHeight:1.35, flex:1, margin:0,
          textDecoration: isDone ? "line-through" : "none",
          opacity: isDone ? 0.7 : 1,
        }}>{query ? highlight(item.t, query, dark) : item.t}</p>
        <span style={{ fontSize:"0.68rem", fontWeight:500, padding:"0.15rem 0.4rem", borderRadius:"6px", whiteSpace:"nowrap", flexShrink:0, marginTop:"1px", background:st.bg[dark?"dark":"light"], color:st.color[dark?"dark":"light"], border:`1px solid ${st.bdr[dark?"dark":"light"]}` }}>{st.label}</span>
      </div>
      {item.sub && (
        <div style={{
          fontSize:"0.75rem",
          color: isDone ? v("textMuted",dark) : (isOpt ? v("optTxt",dark) : v("textSec",dark)),
          lineHeight:1.55, margin:"0.35rem 0 0",
          opacity: isDone ? 0.6 : (isOpt ? 0.9 : 1),
        }}>
          {item.sub.split("\n\n").map((para, pi) => (
            <p key={pi} style={{ margin: pi > 0 ? "0.45rem 0 0" : 0 }}>
              {query ? highlight(para, query, dark) : para}
            </p>
          ))}
        </div>
      )}
      {/* Action bar: mark as done + open in maps */}
      {itemKey && (
        <div style={{ display:"flex", gap:"0.4rem", marginTop:"0.55rem", paddingTop:"0.5rem", borderTop:`1px solid ${v("borderLight",dark)}`, flexWrap:"wrap" }}>
          <button
            onClick={(e) => { e.stopPropagation(); toggle(itemKey); }}
            aria-pressed={isDone}
            style={{
              fontSize:"0.7rem", fontWeight:600, padding:"0.28rem 0.55rem",
              borderRadius:"6px", cursor:"pointer", fontFamily:"inherit",
              border: `1px solid ${isDone ? "#10B981" : v("borderLight",dark)}`,
              background: isDone ? "#10B981" : "transparent",
              color: isDone ? "white" : v("textMuted",dark),
              transition:"all 0.15s",
            }}
          >
            {isDone ? "✓ Fait" : "○ Marquer fait"}
          </button>
          <a
            href={mapsLink(item.t, cityName)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize:"0.7rem", fontWeight:600, padding:"0.28rem 0.55rem",
              borderRadius:"6px", textDecoration:"none", fontFamily:"inherit",
              border: `1px solid ${v("borderLight",dark)}`,
              background:"transparent",
              color: dark ? "#60A5FA" : "#0369A1",
            }}
          >
            🗺 Ouvrir dans Maps
          </a>
        </div>
      )}
    </div>
  );
}

// ─── RESERVATION STATUS HOOK ──────────────────────────────────────────
// Shared state between the urgent banner and the checklist section.
// "Urgent" reservations = items with status:"book" in the "🔴 Urgence absolue" category.
// Stored as a Set of stable string keys (category index + item name).
const RESERVATION_STORAGE_KEY = "japan-reservations-done-v1";

const reservationKey = (catIdx, itemName) => `${catIdx}::${itemName}`;

// Listen for storage events so multiple components stay in sync within the same tab.
const RESERVATION_EVENT = "japan-reservations-changed";

function useReservationStatus() {
  const [done, setDone] = useState(() => {
    try {
      const raw = localStorage.getItem(RESERVATION_STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });

  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem(RESERVATION_STORAGE_KEY);
        setDone(raw ? new Set(JSON.parse(raw)) : new Set());
      } catch {}
    };
    window.addEventListener(RESERVATION_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(RESERVATION_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const toggle = (key) => {
    setDone(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      try {
        localStorage.setItem(RESERVATION_STORAGE_KEY, JSON.stringify([...next]));
        window.dispatchEvent(new Event(RESERVATION_EVENT));
      } catch {}
      return next;
    });
  };

  return { done, toggle };
}

// Get all "urgent" book items (= items needing booking, in the "Urgence absolue" category)
const getUrgentBookItems = () => {
  const out = [];
  CHECKLIST.forEach((cat, ci) => {
    if (!cat.cat.includes("Urgence")) return;
    cat.items.forEach(item => {
      if (item.status === "book") out.push({ catIdx: ci, name: item.name, date: item.date });
    });
  });
  return out;
};

function UrgentReservationsBanner() {
  const dark = useDark();
  const { done } = useReservationStatus();
  const urgent = getUrgentBookItems();
  const total = urgent.length;
  const doneCount = urgent.filter(it => done.has(reservationKey(it.catIdx, it.name))).length;
  const remaining = total - doneCount;
  const allDone = remaining === 0 && total > 0;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.4rem" }}>
        <span style={{ fontSize:"1rem", flexShrink:0 }}>{allDone ? "🎉" : "⚠️"}</span>
        <p style={{ color:v("urgentTxt",dark), fontSize:"0.78rem", lineHeight:1.4, margin:0, fontWeight:700, flex:1 }}>
          {allDone
            ? "Toutes les réservations urgentes sont faites !"
            : <>Réservations urgentes : <strong style={{ fontSize:"0.92rem" }}>{doneCount}/{total}</strong> faites — <strong>{remaining} restante{remaining > 1 ? "s" : ""}</strong></>
          }
        </p>
        <span style={{ fontSize:"0.7rem", color:v("urgentTxt",dark), opacity:0.7, flexShrink:0 }}>Voir →</span>
      </div>
      {/* Progress bar */}
      <div style={{ height:"5px", borderRadius:"3px", background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", overflow:"hidden" }}>
        <div style={{
          height:"100%", width:`${pct}%`,
          background: allDone
            ? "linear-gradient(90deg,#10B981,#34D399)"
            : "linear-gradient(90deg,#DC2626,#F59E0B)",
          borderRadius:"3px", transition:"width 0.3s ease",
        }} />
      </div>
    </div>
  );
}

function ChecklistSection() {
  const dark = useDark();
  const { done, toggle } = useReservationStatus();

  // Global progress across all "book" items
  const allBookItems = [];
  CHECKLIST.forEach((cat, ci) => {
    cat.items.forEach(item => {
      if (item.status === "book") allBookItems.push({ catIdx: ci, name: item.name });
    });
  });
  const totalBook = allBookItems.length;
  const doneBook = allBookItems.filter(it => done.has(reservationKey(it.catIdx, it.name))).length;
  const pctBook = totalBook > 0 ? Math.round((doneBook / totalBook) * 100) : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
      <div style={{ background:v("cardBg",dark), borderRadius:"12px", overflow:"hidden", border:`1px solid ${v("border",dark)}`, transition:"background 0.3s" }}>
        <div style={{ padding:"0.875rem 1rem", background:dark?"#1C1400":"#FEF9C3", borderBottom:`2px solid ${dark?"#713F12":"#FDE68A"}` }}>
          <h2 style={{ fontSize:"0.95rem", fontWeight:700, color:dark?"#FCD34D":"#78350F", margin:"0 0 0.4rem" }}>📋 Checklist des Réservations</h2>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.25rem" }}>
            <span style={{ fontSize:"0.7rem", fontWeight:600, color:dark?"#FCD34D":"#92400E" }}>Progression : {doneBook} / {totalBook}</span>
            <span style={{ fontSize:"0.7rem", fontWeight:700, color:dark?"#FCD34D":"#92400E" }}>{pctBook}%</span>
          </div>
          <div style={{ height:"5px", borderRadius:"3px", background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pctBook}%`, background:"linear-gradient(90deg,#F59E0B,#10B981)", borderRadius:"3px", transition:"width 0.3s ease" }} />
          </div>
        </div>
        {CHECKLIST.map((cat, ci) => (
          <div key={ci} style={{ borderBottom:ci<CHECKLIST.length-1?`1px solid ${v("borderLight",dark)}`:"none" }}>
            <div style={{ padding:"0.6rem 1rem 0.35rem", background:v("sectionBg",dark) }}>
              <p style={{ fontSize:"0.72rem", fontWeight:700, color:cat.color, margin:0 }}>{cat.cat}</p>
            </div>
            {cat.items.map((item, ii) => {
              const key = reservationKey(ci, item.name);
              const isBookable = item.status === "book";
              const isDone = isBookable && done.has(key);
              return (
                <div
                  key={ii}
                  onClick={() => isBookable && toggle(key)}
                  role={isBookable ? "button" : undefined}
                  aria-pressed={isBookable ? isDone : undefined}
                  style={{
                    padding:"0.65rem 1rem",
                    borderBottom: ii < cat.items.length - 1 ? `1px solid ${v("borderMid",dark)}` : "none",
                    display:"flex", alignItems:"flex-start", gap:"0.75rem",
                    cursor: isBookable ? "pointer" : "default",
                    background: isDone ? (dark?"rgba(16,185,129,0.08)":"rgba(16,185,129,0.06)") : "transparent",
                    transition:"background 0.15s",
                  }}
                >
                  {/* Checkbox for bookable items, icon otherwise */}
                  {isBookable ? (
                    <div style={{
                      flexShrink:0, width:"1.2rem", height:"1.2rem", borderRadius:"5px",
                      border:`2px solid ${isDone?"#10B981":(dark?"#713F12":"#D97706")}`,
                      background: isDone ? "#10B981" : "transparent",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      marginTop:"1px", transition:"all 0.15s",
                    }}>
                      {isDone && <span style={{ color:"white", fontSize:"0.78rem", fontWeight:800, lineHeight:1 }}>✓</span>}
                    </div>
                  ) : (
                    <span style={{ fontSize:"1rem", flexShrink:0, marginTop:"1px" }}>
                      {item.status === "ok" ? "✅" : "🔓"}
                    </span>
                  )}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.5rem", flexWrap:"wrap" }}>
                      <p style={{ fontSize:"0.84rem", fontWeight:600, color:v("textPrimary",dark), margin:0, textDecoration: isDone ? "line-through" : "none", opacity: isDone ? 0.65 : 1 }}>{item.name}</p>
                      <span style={{ fontSize:"0.7rem", fontWeight:600, padding:"0.15rem 0.5rem", borderRadius:"10px", background:ST[item.status==="ok"?"ok":item.status==="book"?"book":"free"].bg[dark?"dark":"light"], color:ST[item.status==="ok"?"ok":item.status==="book"?"book":"free"].color[dark?"dark":"light"], border:`1px solid ${ST[item.status==="ok"?"ok":item.status==="book"?"book":"free"].bdr[dark?"dark":"light"]}`, whiteSpace:"nowrap", flexShrink:0 }}>{isDone ? "✅ Fait" : item.status==="ok"?"✅ Réservé":item.status==="book"?"⚠️ À faire":"🔓 Optionnel"}</span>
                    </div>
                    <p style={{ fontSize:"0.73rem", color:v("textPrimary",dark), margin:"0.15rem 0 0", opacity: isDone ? 0.6 : 1 }}>📅 {item.date}</p>
                    <p style={{ fontSize:"0.73rem", color:v("textSec",dark), margin:"0.05rem 0 0", opacity: isDone ? 0.6 : 1 }}>🔗 {item.platform}</p>
                    {item.note && <p style={{ fontSize:"0.71rem", color:"#F87171", margin:"0.15rem 0 0", opacity: isDone ? 0.5 : 1 }}>⚡ {item.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GASTRO SECTION ──────────────────────────────────────────────────────────
const GASTRO = [
  {
    id: "ramen", emoji: "🍜", title: "Ramen & Nouilles", color: "#DC2626",
    items: [
      {
        emoji:"🐖", name:"Tonkotsu (博多とんこつ)", diff:"🟢",
        prio:1,
        desc:"Bouillon d'os de porc mijoté 12-18h jusqu'à blanchir. Texture crémeuse et riche, quasi opaque. Origine : Hakata (Fukuoka). Garnitures : chashu, œuf mollet, gingembre rouge, nori, germes de soja. Intensité : ★★★★☆",
        prix:"¥800-1200", ou:"Ichiran Shinjuku (isoloir individuel, 24h/24). Shin-Shin si passage à Fukuoka.",
        adresse:"Ichiran — 3-34-11 Shinjuku, ouvert 24h/24",
        spots:[
          { nom:"Ichiran Shinjuku 一蘭 新宿", quartier:"Shinjuku, Tokyo", note:"⭐ 4.4/5 Google", prix:"~980¥/bol", resa:"Sans réservation — file gérée", diff:"🟢", url:"https://ichiran.com", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku" },
          { nom:"Shin-Shin しんしん 博多本店", quartier:"Hakata, Fukuoka (hors parcours — référence nationale)", note:"⭐ 4.6/5 Tabelog", prix:"~900¥/bol", resa:"File sur place", diff:"🟢", url:"", tabId:null, dayN:null, dayLabel:null },
        ]
      },
      {
        emoji:"🥢", name:"Shoyu (東京醤油ラーメン)", diff:"🟢",
        prio:2,
        desc:"Bouillon clair de poulet et dashi assaisonné de sauce soja. Style tokyoïte — élégant, moins gras. Noodles fins et droits. Garnitures : chashu, menma, narutomaki.",
        prix:"¥900-1400", ou:"Fuunji à Shinjuku pour version tsukemen shoyu. Aoba pour la version shoyu pure.",
        adresse:"Fuunji — 2-14-3 Yoyogi, Shibuya-ku",
        spots:[
          { nom:"Fuunji 風雲児 新宿", quartier:"Yoyogi / Shinjuku, Tokyo", note:"⭐ 4.5/5 Tabelog", prix:"~1050¥ (tsukemen M)", resa:"Sans réservation — ouvre 11h, arriver avant", diff:"🟢", url:"", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku" },
          { nom:"Menya Musashi 麺屋武蔵 新宿本店", quartier:"Shinjuku, Tokyo", note:"⭐ 4.3/5 Google", prix:"~1100¥", resa:"Sans réservation", diff:"🟢", url:"https://www.menya634.co.jp", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku" },
        ]
      },
      {
        emoji:"🌶", name:"Miso (札幌味噌ラーメン)", diff:"🟢",
        prio:3,
        desc:"Pâte de miso incorporée dans un bouillon de poulet/porc. Origine Sapporo. Très réconfortant, sucré-salé. Garnitures : maïs, beurre, porc haché, bambou.",
        prix:"¥900-1300", ou:"Hokkaido Ramen Santouka à Shinjuku Takashimaya. Disponible aussi à Osaka.",
        adresse:"Hokkaido Ramen Santouka — Shinjuku Takashimaya",
        spots:[
          { nom:"Santouka 山頭火 新宿", quartier:"Shinjuku Takashimaya, Tokyo", note:"⭐ 4.3/5 Google", prix:"~1150¥", resa:"Sans réservation", diff:"🟢", url:"https://www.santouka.co.jp", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku" },
          { nom:"Santouka 山頭火 梅田", quartier:"Umeda, Osaka", note:"⭐ 4.2/5 Google", prix:"~1100¥", resa:"Sans réservation", diff:"🟢", url:"https://www.santouka.co.jp", tabId:"osaka", dayN:13, dayLabel:"J13 — Château Osaka + Umeda" },
        ]
      },
      {
        emoji:"🧊", name:"Shio (塩ラーメン)", diff:"🟢",
        prio:2,
        desc:"Le plus léger — bouillon au sel, transparent et doré. Révèle le goût pur des ingrédients. Origine Hakodate. Idéal après une journée chargée.",
        prix:"¥800-1200", ou:"Afuri Harajuku — leur yuzu shio ramen (~1200¥) est le meilleur de Tokyo.",
        adresse:"Afuri — 1-1-7 Ebisu, Shibuya-ku",
        spots:[
          { nom:"Afuri 阿夫利 原宿", quartier:"Harajuku, Tokyo", note:"⭐ 4.4/5 Google", prix:"~1200¥ (yuzu shio)", resa:"Sans réservation", diff:"🟢", url:"https://afuri.com", tabId:"tokyo", dayN:4, dayLabel:"J4 — Harajuku + TeamLab + Shibuya Sky" },
          { nom:"Afuri 阿夫利 難波", quartier:"Namba, Osaka", note:"⭐ 4.3/5 Google", prix:"~1200¥", resa:"Sans réservation", diff:"🟢", url:"https://afuri.com", tabId:"osaka", dayN:11, dayLabel:"J11 — Arrivée Osaka + Dotonbori" },
        ]
      },
      {
        emoji:"🥣", name:"Tsukemen (つけ麺)", diff:"🟢",
        prio:2,
        desc:"Noodles froids séparés d'un bouillon chaud concentré — on trempe chaque bouchée. Bouillon 3x plus intense. Noodles épais et fermes. En fin de repas : ajouter du dashi chaud pour diluer.",
        prix:"¥1000-1500", ou:"Fuunji à Shinjuku (référence absolue). File ~20-30 min.",
        adresse:"Fuunji — 2-14-3 Yoyogi, ouvre à 11h",
        spots:[
          { nom:"Fuunji 風雲児", quartier:"Yoyogi / Shinjuku, Tokyo", note:"⭐ 4.5/5 Tabelog — File légendaire", prix:"~1050¥ (taille M)", resa:"File sur place — arriver à l'ouverture (11h)", diff:"🟢", url:"", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku / Golden Gai" },
          { nom:"Rokurinsha 六厘舎 東京", quartier:"Tokyo Station (First Avenue B1)", note:"⭐ 4.4/5 Tabelog", prix:"~1050¥", resa:"File sur place — ouvre 7h30", diff:"🟢", url:"", tabId:"tokyo", dayN:7, dayLabel:"J7 — Shinkansen Tokyo → Kyoto" },
        ]
      },
      {
        emoji:"🌀", name:"Tantanmen (担々麺)", diff:"🟡",
        prio:3,
        desc:"Version japonaise du Dan Dan mian — bouillon sésame et piment, porc haché épicé. Moins piquant que l'original. Commander : 'karai-sa futsu' (piment moyen).",
        prix:"¥900-1300", ou:"T's Tantan à Tokyo Station (version vegan très appréciée).",
        adresse:"T's Tantan — Tokyo Station Keiyo Street, B1",
        spots:[
          { nom:"T's Tantan タンタン 東京", quartier:"Tokyo Station (Keiyo Street, B1)", note:"⭐ 4.2/5 Google — Michelin Guide 2023", prix:"~1100¥", resa:"Sans réservation", diff:"🟢", url:"", tabId:"tokyo", dayN:7, dayLabel:"J7 — Départ Shinkansen (Tokyo Station)" },
          { nom:"Ippudo 一風堂 心斎橋", quartier:"Shinsaibashi, Osaka", note:"⭐ 4.3/5 Google", prix:"~980¥", resa:"Sans réservation", diff:"🟢", url:"https://www.ippudo.com", tabId:"osaka", dayN:11, dayLabel:"J11 — Arrivée Osaka + Dotonbori" },
        ]
      },
    ]
  },
  {
    id: "sushi", emoji: "🍣", title: "Sushis & Poissons crus", color: "#0369A1",
    items: [
      {
        emoji:"👨‍🍳", name:"Omakase (おまかせ)", diff:"🔴",
        prio:1,
        desc:"Littéralement 'je vous fais confiance' — le chef choisit et sert lui-même. Expérience ultime. Comptoir 8-12 places, 1h30-2h. Le wasabi est appliqué directement par le chef.",
        prix:"¥15 000-50 000+", ou:"Pocket Concierge ou Tablecheck pour disponibilités.",
        adresse:"Réserver via pocketconcierge.jp",
        spots:[
          { nom:"Sushi Saito 鮨 さいとう", quartier:"Roppongi, Tokyo", note:"⭐ Michelin 3 étoiles (liste d'attente >1 an)", prix:"~¥50 000+", resa:"Réservation impossible sans connexion locale", diff:"🔴", url:"", tabId:null, dayN:null, dayLabel:null },
          { nom:"Sushi Yoshitake 鮨 よしたけ", quartier:"Ginza, Tokyo", note:"⭐ Michelin 3 étoiles — parfois disponible via pocketconcierge.jp", prix:"~¥30 000", resa:"Pocket Concierge — réserver 2-3 mois à l'avance", diff:"🔴", url:"https://pocketconcierge.jp", tabId:"tokyo", dayN:2, dayLabel:"J2 — Akihabara + Skytree (dîner Ginza option)" },
        ]
      },
      {
        emoji:"🎠", name:"Kaiten-zushi (回転寿司)", diff:"🟢",
        prio:2,
        desc:"Sushis sur tapis roulant — commander via tablette tactile en anglais. Qualité bien supérieure à la réputation. Assiettes 130-350¥.",
        prix:"¥1500-3000 pour un repas complet", ou:"Uobei Shibuya, Genki Sushi Shinjuku, Katsu Midori Shibuya Mark City.",
        adresse:"Uobei — 2-29-11 Dogenzaka, Shibuya-ku",
        spots:[
          { nom:"Uobei 魚べい 渋谷", quartier:"Dogenzaka, Shibuya, Tokyo", note:"⭐ 4.2/5 Google — tablette anglais, ultra-rapide", prix:"~130-350¥/assiette (~2000¥ repas)", resa:"File sur place — moins de 20 min en général", diff:"🟢", url:"https://uobei.jp", tabId:"tokyo", dayN:4, dayLabel:"J4 — Harajuku + Shibuya Sky (dîner Shibuya)" },
          { nom:"Genki Sushi 元気寿司 新宿", quartier:"Shinjuku, Tokyo", note:"⭐ 4.1/5 Google — commande tablette anglais", prix:"~130-300¥/assiette", resa:"Sans réservation", diff:"🟢", url:"https://genkisushi.co.jp", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku" },
        ]
      },
      {
        emoji:"🎣", name:"Tsukiji — Petit-déjeuner sushi", diff:"🟡",
        prio:1,
        desc:"Le marché extérieur de Tsukiji ouvre à 5h. Sushis ultra-frais dans des mini-restaurants de 6-12 places. Gingembre (gari) = palate cleanser entre les pièces.",
        prix:"¥2500-4000 pour un plateau 7-10 pièces", ou:"Tsukiji pendant J6 (2 mai matin). Sushisei Honten et Daiwa Sushi = meilleures adresses.",
        adresse:"Sushisei Honten — 4-13-9 Tsukiji, Chuo-ku (ouvert 7h)",
        spots:[
          { nom:"Sushisei Honten 寿司清本店 築地", quartier:"Tsukiji, Tokyo", note:"⭐ 4.4/5 Tabelog — institution depuis 1889", prix:"~3000¥ omakase du matin", resa:"File courte en semaine avant 9h", diff:"🟡", url:"", tabId:"tokyo", dayN:6, dayLabel:"J6 — Hakone sac léger (matin Tsukiji option)" },
          { nom:"Daiwa Sushi 大和寿司 築地", quartier:"Tsukiji, Tokyo", note:"⭐ 4.5/5 Tabelog — file mais vaut l'attente", prix:"~3500¥ menu 10 pièces", resa:"File sur place, dès 5h30", diff:"🟡", url:"", tabId:"tokyo", dayN:6, dayLabel:"J6 — Matin Tsukiji" },
        ]
      },
      {
        emoji:"🐟", name:"Pièces incontournables à connaître", diff:"🟢",
        prio:2,
        desc:"OTORO : ventre de thon ultra-gras. HAMACHI : yellowtail gras naturel. UNI : oursin crémeux. IKURA : œufs de saumon en gunkan. ANAGO : anguille de mer confite. TAMAGOYAKI : omelette sucrée en dernier — teste la maison.",
        prix:"Otoro : ¥500-2000 la pièce en omakase", ou:"Toutes disponibles à Tsukiji le matin ou en kaiten-zushi.",
        adresse:"Pour l'otoro frais : arriver à Tsukiji avant 8h",
        spots:[
          { nom:"Katsu Midori Sushi かつみどり 渋谷", quartier:"Shibuya Mark City 1F, Tokyo", note:"⭐ 4.4/5 Tabelog — rapport qualité/prix exceptionnel", prix:"~2500¥ repas complet", resa:"File ~30 min en soirée — sans réservation", diff:"🟢", url:"", tabId:"tokyo", dayN:4, dayLabel:"J4 — Dîner Shibuya (après Shibuya Sky)" },
        ]
      },
    ]
  },
  {
    id: "viandes", emoji: "🥩", title: "Viandes & Grillades", color: "#B45309",
    items: [
      {
        emoji:"🔥", name:"Yakiniku — Wagyu (焼肉)", diff:"🟡",
        prio:1,
        desc:"Grillades à la table sur charbon. Wagyu noté A1-A5 (persillage). A5 = marbre maximum. Griller 30 secondes par face, manger immédiatement.",
        prix:"A3 : ¥3000-5000/pers. A5 : ¥8000-15000/pers", ou:"Kittan Hibiki Osaka (J13, 9 mai — déjà réservé).",
        adresse:"Kittan Hibiki Osaka — réservation via Tablecheck.com",
        spots:[
          { nom:"Kittan Hibiki 起燃ひびき 大阪", quartier:"Shinsaibashi / Namba, Osaka", note:"⭐ 4.5/5 Tabelog — wagyu de Kyushu", prix:"~8000-12000¥/pers", resa:"Tablecheck.com — réserver 3-4 semaines à l'avance", diff:"🔴", url:"https://tablecheck.com", tabId:"osaka", dayN:13, dayLabel:"J13 — Château Osaka (dîner Kittan Hibiki)" },
          { nom:"Ushigoro Bambina 牛ごろバンビーナ 新宿", quartier:"Shinjuku, Tokyo", note:"⭐ 4.4/5 Tabelog — wagyu A4/A5 accessible", prix:"~6000-10000¥/pers", resa:"Tablecheck ou Tableall — réserver à l'avance", diff:"🔴", url:"https://tablecheck.com", tabId:"tokyo", dayN:5, dayLabel:"J5 — Vendredi soir Tokyo" },
        ]
      },
      {
        emoji:"🍲", name:"Sukiyaki vs Shabu-shabu", diff:"🟡",
        prio:2,
        desc:"SUKIYAKI : bœuf dans sauce sucrée-salée (warishita), tremper dans œuf cru. SHABU-SHABU : bouillon dashi neutre, agiter la tranche 10 secondes. Tremper en sauce ponzu ou sésame.",
        prix:"¥4000-8000/pers selon grade", ou:"Shabusen à Umeda Osaka (J13). Imahan à Asakusa pour sukiyaki.",
        adresse:"Asakusa Imahan — 3-1-12 Nishi-Asakusa (sukiyaki wagyu depuis 1895)",
        spots:[
          { nom:"Asakusa Imahan 浅草今半 本店", quartier:"Nishi-Asakusa, Tokyo", note:"⭐ 4.5/5 Tabelog — sukiyaki wagyu depuis 1895", prix:"~6000-12000¥/pers", resa:"Réserver par téléphone : 03-3841-1114 ou Tablecheck", diff:"🔴", url:"https://tablecheck.com", tabId:"tokyo", dayN:2, dayLabel:"J2 — Akihabara + Skytree (dîner Asakusa option)" },
          { nom:"Shabusen しゃぶせん 梅田", quartier:"Umeda, Osaka", note:"⭐ 4.2/5 Google — shabu-shabu wagyu accessible", prix:"~4000-7000¥/pers", resa:"Sans réservation en général", diff:"🟡", url:"", tabId:"osaka", dayN:13, dayLabel:"J13 — Umeda Sky Building (dîner Umeda)" },
        ]
      },
      {
        emoji:"🍗", name:"Yakitori (焼き鳥) — Guide des pièces", diff:"🟢",
        prio:2,
        desc:"Brochettes poulet sur charbon bincho-tan. Negima, tsukune, kawa, reba, nankotsu, tebasaki, sasami. Assaisonnement : shio (sel) ou tare (sauce sucrée-salée).",
        prix:"¥150-400/brochette", ou:"Omoide Yokocho Shinjuku (J5). Torikizoku partout. Birdland à Ginza.",
        adresse:"Omoide Yokocho — côté ouest gare Shinjuku, JR West Exit",
        spots:[
          { nom:"Torikizoku 鳥貴族 全国", quartier:"Toutes les grandes villes (chaîne nationale)", note:"⭐ 4.0/5 Google — 327¥/brochette, tout le menu", prix:"~2000¥ dîner complet avec boissons", resa:"Sans réservation", diff:"🟢", url:"https://torikizoku.co.jp", tabId:"tokyo", dayN:4, dayLabel:"J4 — Dîner Shibuya (option économique)" },
          { nom:"Birdland バードランド 銀座", quartier:"Ginza, Tokyo", note:"⭐ Michelin Bib Gourmand — yakitori haut de gamme", prix:"~5000-8000¥/pers (omakase brochettes)", resa:"Réservation obligatoire — Tablecheck ou direct", diff:"🔴", url:"https://tablecheck.com", tabId:"tokyo", dayN:6, dayLabel:"J6 — Matin Ginza (dîner Ginza soir)" },
        ]
      },
      {
        emoji:"🥓", name:"Tonkatsu (とんかつ)", diff:"🟢",
        prio:2,
        desc:"Côtelette panée dans panko et frite. Rosu-katsu = échine (plus gras). Hire-katsu = filet (plus maigre). Moudre le sésame soi-même. Riz + miso + chou à volonté.",
        prix:"¥1500-3500", ou:"Ginza Bairin (J6 — institution depuis 1927). Maisen à Omotesando. Katsukura à Kyoto.",
        adresse:"Ginza Bairin — 7-8-1 Ginza, Chuo-ku (ouvert 11h-22h)",
        spots:[
          { nom:"Ginza Bairin 銀座梅林 本店", quartier:"Ginza, Tokyo", note:"⭐ 4.4/5 Tabelog — institution depuis 1927", prix:"~2500-3500¥ (rosu-katsu set)", resa:"File en semaine midi — sans réservation", diff:"🟢", url:"", tabId:"tokyo", dayN:6, dayLabel:"J6 — Matin Ginza + Tsukiji" },
          { nom:"Katsukura かつくら 三条店", quartier:"Shijo / Kawaramachi, Kyoto", note:"⭐ 4.3/5 Google — tonkatsu kyotoïte au sésame", prix:"~2000-3000¥", resa:"Sans réservation — file possible le midi", diff:"🟢", url:"https://katsukura.jp", tabId:"kyoto", dayN:10, dayLabel:"J10 — Kiyomizudera + Gion (dîner Kyoto)" },
        ]
      },
      {
        emoji:"🥩", name:"Gyudon (牛丼)", diff:"🟢",
        prio:3,
        desc:"Bol de riz avec bœuf mijoté sauce sucrée-salée. Le fast-food japonais, prêt en 3 min, 24h/24. Yoshinoya, Matsuya, Sukiya = les trois chaînes. Ajouter œuf cru pour +100¥.",
        prix:"¥400-700", ou:"Yoshinoya dans toutes les grandes gares de Tokyo, Kyoto, Osaka.",
        adresse:"Yoshinoya — toutes les grandes gares, ouvert 24h/24",
        spots:[
          { nom:"Yoshinoya 吉野家 全国", quartier:"Toutes les grandes gares du Japon", note:"⭐ 4.0/5 Google — chaîne nationale, menu illustré", prix:"~468¥ gyudon regular", resa:"Sans réservation — service express", diff:"🟢", url:"https://www.yoshinoya.com", tabId:"tokyo", dayN:1, dayLabel:"J1 — Arrivée Asakusa (option dîner rapide)" },
        ]
      },
    ]
  },
  {
    id: "streetfood", emoji: "🏮", title: "Street Food & Snacks", color: "#7C3AED",
    items: [
      {
        emoji:"🐙", name:"Takoyaki (たこ焼き)", diff:"🟢",
        prio:1,
        desc:"Billes de pâte fourrées d'un morceau de poulpe. Croustillantes dehors, fondantes dedans. Mayo Kewpie, sauce okonomiyaki, katsuobushi qui 'danse'. ATTENTION : brûlant à l'intérieur.",
        prix:"¥500-700 pour 6 pièces", ou:"Dotonbori Osaka (J11 arrivée) : Kukuru et Aizuya côte à côte.",
        adresse:"Kukuru — Dotonbori, Osaka",
        spots:[
          { nom:"Kukuru くくる 道頓堀", quartier:"Dotonbori, Osaka", note:"⭐ 4.4/5 Tabelog — le plus coté de Dotonbori", prix:"~650¥ pour 8 pièces", resa:"File sur place (5-15 min en soirée)", diff:"🟢", url:"", tabId:"osaka", dayN:11, dayLabel:"J11 — Arrivée Osaka + Dotonbori" },
          { nom:"Aizuya 会津屋 道頓堀", quartier:"Dotonbori, Osaka", note:"⭐ 4.3/5 Tabelog — fondateur historique du takoyaki (1933)", prix:"~500¥ pour 6 pièces (version originale sans mayo)", resa:"Sans réservation", diff:"🟢", url:"", tabId:"osaka", dayN:11, dayLabel:"J11 — Arrivée Osaka + Dotonbori" },
        ]
      },
      {
        emoji:"🥞", name:"Okonomiyaki (お好み焼き)", diff:"🟡",
        prio:2,
        desc:"Style Osaka : ingrédients mélangés dans la pâte. Style Hiroshima : couches séparées. Garnitures : bœuf, crevettes, fromage. Sauce + mayo + katsuobushi + aonori.",
        prix:"¥1000-2000", ou:"Chibo à Dotonbori Osaka (J11 arrivée). Sometaro à Asakusa Tokyo.",
        adresse:"Chibo — 1-5-5 Dotonbori, Osaka",
        spots:[
          { nom:"Chibo 千房 道頓堀", quartier:"Dotonbori, Osaka", note:"⭐ 4.3/5 Google — okonomiyaki et teppanyaki devant vous", prix:"~1500-2000¥/pers", resa:"Sans réservation — file en soirée", diff:"🟡", url:"https://chibo.com", tabId:"osaka", dayN:11, dayLabel:"J11 — Arrivée Osaka + Dotonbori" },
          { nom:"Sometaro 染太郎 浅草", quartier:"Nishi-Asakusa, Tokyo", note:"⭐ 4.4/5 Tabelog — faire soi-même sur plaque à table", prix:"~1800¥/pers tout compris", resa:"Sans réservation — ambiance nostalgique années 40", diff:"🟡", url:"", tabId:"tokyo", dayN:2, dayLabel:"J2 — Skytree (dîner Asakusa option)" },
        ]
      },
      {
        emoji:"🎏", name:"Taiyaki (たい焼き)", diff:"🟢",
        prio:2,
        desc:"Gaufre en forme de daurade. Fourrages : anko, crème pâtissière, matcha. La queue = la partie la plus croustillante.",
        prix:"¥200-400", ou:"Nakamise-dori Asakusa (J1). Wakaba à Yotsuya pour le plus célèbre.",
        adresse:"Wakaba — 4-16-11 Yotsuya",
        spots:[
          { nom:"Wakaba わかば 四谷", quartier:"Yotsuya, Tokyo", note:"⭐ 4.5/5 Tabelog — le taiyaki le plus célèbre de Tokyo (1953)", prix:"~200¥/pièce (anko uniquement)", resa:"File sur place — arriver à l'ouverture (11h30)", diff:"🟢", url:"", tabId:"tokyo", dayN:5, dayLabel:"J5 — Vendredi Tokyo" },
        ]
      },
      {
        emoji:"🍙", name:"Onigiri (おにぎり)", diff:"🟢",
        prio:1,
        desc:"Triangle de riz enveloppé de nori. Les meilleurs sont au 7-Eleven selon un sondage national. Fourrages : saumon, tuna-mayo, mentaiko, umeboshi. Ouvrir selon les numéros (1→2→3).",
        prix:"¥120-200", ou:"7-Eleven, FamilyMart, Lawson — partout, 24h/24.",
        adresse:"7-Eleven — n'importe quelle grande station de métro",
        spots:[
          { nom:"7-Eleven セブンイレブン", quartier:"Partout au Japon — dans chaque gare", note:"⭐ Meilleur onigiri konbini selon sondage national 2024", prix:"~120-180¥/onigiri", resa:"Sans réservation — ouvert 24h/24", diff:"🟢", url:"", tabId:"tokyo", dayN:1, dayLabel:"J1 — Arrivée Asakusa" },
        ]
      },
      {
        emoji:"🥚", name:"Tamago Sando (たまごサンド)", diff:"🟢",
        prio:3,
        desc:"Sandwich aux œufs sur shokupan ultra-moelleux avec mayo Kewpie. FamilyMart en vend le meilleur en konbini.",
        prix:"¥250-600", ou:"FamilyMart partout pour la version quotidienne.",
        adresse:"FamilyMart — toutes les gares",
        spots:[
          { nom:"FamilyMart ファミリーマート", quartier:"Partout au Japon", note:"⭐ Meilleur tamago sando konbini — élu par Buzzfeed Japan", prix:"~250¥", resa:"Sans réservation", diff:"🟢", url:"", tabId:"tokyo", dayN:1, dayLabel:"J1 — Arrivée Asakusa" },
          { nom:"Eggscelent エッグセレント 新宿", quartier:"Shinjuku, Tokyo", note:"⭐ 4.4/5 Google — version artisanale œuf coulant", prix:"~700-1000¥", resa:"File sur place", diff:"🟢", url:"", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku" },
        ]
      },
      {
        emoji:"🍡", name:"Dango & Mochi de rue", diff:"🟢",
        prio:2,
        desc:"DANGO : boules de riz sur brochette, glacées de sauce soja sucrée. MOCHI : galette de riz gluant élastique. Warabi mochi = version fondante.",
        prix:"¥100-300", ou:"Nakamise-dori Asakusa, Nishiki Market Kyoto, Arashiyama.",
        adresse:"Nakamuraya — Nakamise-dori Asakusa",
        spots:[
          { nom:"Nakamuraya 中村家 浅草", quartier:"Nakamise-dori, Asakusa, Tokyo", note:"⭐ 4.3/5 Tabelog — ningyo-yaki et dango depuis 1868", prix:"~150-300¥", resa:"Sans réservation — stand en plein air", diff:"🟢", url:"", tabId:"tokyo", dayN:1, dayLabel:"J1 — Arrivée Asakusa + Senso-ji" },
          { nom:"Kagizen Yoshifusa 鍵善良房 祇園", quartier:"Gion, Kyoto", note:"⭐ 4.5/5 Tabelog — daifuku et kuzu kiri depuis 1711", prix:"~600¥ (kuzu kiri, dessert signature)", resa:"Sans réservation — salon de thé", diff:"🟡", url:"", tabId:"kyoto", dayN:10, dayLabel:"J10 — Kiyomizudera + Gion" },
        ]
      },
    ]
  },
  {
    id: "quotidien", emoji: "🍱", title: "Plats du Quotidien", color: "#065F46",
    items: [
      {
        emoji:"🍛", name:"Curry japonais (カレー)", diff:"🟢",
        prio:3,
        desc:"Plus doux et sucré que l'indien, texture de sauce épaisse grâce à un roux. Servi sur riz avec katsu ou légumes. Niveau épice 1-10+. CoCo Ichibanya = chaîne nationale, menu illustré anglais.",
        prix:"¥600-1200", ou:"CoCo Ichibanya dans toutes les grandes villes.",
        adresse:"CoCo Ichibanya — Shinjuku, Namba Osaka, Kyoto Station area",
        spots:[
          { nom:"CoCo Ichibanya カレーハウスCoCo壱番屋 新宿", quartier:"Shinjuku, Tokyo", note:"⭐ 4.1/5 Google — menu anglais, niveau épice au choix", prix:"~800-1200¥", resa:"Sans réservation — self-service rapide", diff:"🟢", url:"https://www.ichibanya.co.jp", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku" },
          { nom:"CoCo Ichibanya カレーハウスCoCo壱番屋 難波", quartier:"Namba, Osaka", note:"⭐ 4.1/5 Google", prix:"~800-1200¥", resa:"Sans réservation", diff:"🟢", url:"https://www.ichibanya.co.jp", tabId:"osaka", dayN:11, dayLabel:"J11 — Arrivée Osaka" },
        ]
      },
      {
        emoji:"🍗", name:"Karaage (唐揚げ)", diff:"🟢",
        prio:2,
        desc:"Poulet frit mariné soja+gingembre+ail, enrobé de fécule. Croustillant fin dehors, juteux dedans. Avec mayo Kewpie et citron.",
        prix:"¥400-800 en izakaya, ¥200 en konbini", ou:"Partout en izakaya. KFC Japan aussi très populaire.",
        adresse:"Torikizoku — chaîne accessible partout",
        spots:[
          { nom:"Naka-ya なかや 高円寺", quartier:"Koenji, Tokyo", note:"⭐ 4.6/5 Tabelog — réputé comme le meilleur karaage de Tokyo", prix:"~1500¥ (set lunch + riz)", resa:"File sur place — lunch uniquement", diff:"🟢", url:"", tabId:"tokyo", dayN:5, dayLabel:"J5 — Vendredi Tokyo" },
        ]
      },
      {
        emoji:"🍜", name:"Udon (うどん)", diff:"🟢",
        prio:2,
        desc:"Noodles épais de blé, texture ferme. Bouillon Kansai pâle (dashi kombu) vs Kanto foncé (sauce soja). Marugame Seimen = chaîne de qualité ~500¥.",
        prix:"¥400-800 en chaîne, ¥1200-1800 en restaurant", ou:"Marugame Seimen partout. Omen à Kyoto pour version artisanale.",
        adresse:"Marugame Seimen — Shinjuku, Osaka Namba, Kyoto Station",
        spots:[
          { nom:"Marugame Seimen 丸亀製麺 全国", quartier:"Toutes les grandes villes — nombreuses adresses", note:"⭐ 4.2/5 Google — chaîne nationale référence", prix:"~480-700¥ selon garnitures", resa:"Self-service sans réservation", diff:"🟢", url:"https://www.marugame-seimen.com", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku (déjeuner rapide)" },
          { nom:"Omen おめん 岡崎", quartier:"Okazaki / Heian Shrine, Kyoto", note:"⭐ 4.4/5 Tabelog — udon artisanal, institution expats Kyoto", prix:"~1400¥ (udon set)", resa:"Sans réservation — ambiance chaleureuse", diff:"🟢", url:"", tabId:"kyoto", dayN:9, dayLabel:"J9 — Fushimi Inari + Nara (dîner Kyoto)" },
        ]
      },
      {
        emoji:"🍝", name:"Soba (そば)", diff:"🟢",
        prio:2,
        desc:"Nouilles fines à la farine de sarrasin. Mori soba = froid sur bambou. Kake soba = dans bouillon. Goût de noisette. En fin de repas : sobayu (eau de cuisson) pour diluer.",
        prix:"¥700-1500", ou:"Misoka-an Kawamichiya à Kyoto (depuis 1716). Honke Owariya pour soba de cour impériale.",
        adresse:"Misoka-an Kawamichiya — 375 Nakagyo-ku, Kyoto",
        spots:[
          { nom:"Misoka-an Kawamichiya 御多福 河道屋 蕎麦", quartier:"Nakagyo-ku, Kyoto", note:"⭐ 4.4/5 Tabelog — soba maison depuis 1716", prix:"~1800¥ (nishiki-ten udon / soba)", resa:"Sans réservation — ouvert midi et soir", diff:"🟢", url:"", tabId:"kyoto", dayN:7, dayLabel:"J7 — Arrivée Kyoto (dîner Pontocho area)" },
          { nom:"Honke Owariya 本家 尾張屋 本店", quartier:"Sakyo-ku, Kyoto", note:"⭐ 4.5/5 Tabelog — fournisseur de la cour impériale depuis 1465", prix:"~1800-3000¥", resa:"Sans réservation — déjeuner uniquement", diff:"🟢", url:"", tabId:"kyoto", dayN:8, dayLabel:"J8 — Arashiyama (déjeuner option Kyoto centre)" },
        ]
      },
      {
        emoji:"🥟", name:"Gyoza (餃子)", diff:"🟢",
        prio:3,
        desc:"Ravioli frits — peau croustillante d'un côté. Tremper dans vinaigre + sauce soja + rayu (huile de piment). Osaka Ohsho = chaîne populaire, 6 pièces ~290¥.",
        prix:"¥290-600 pour 6 pièces", ou:"Osaka Ohsho partout à Osaka. Harajuku Gyoza Lou à Tokyo.",
        adresse:"Osaka Ohsho — Dotonbori Osaka",
        spots:[
          { nom:"Harajuku Gyoza Lou 原宿餃子楼", quartier:"Harajuku, Tokyo", note:"⭐ 4.3/5 Tabelog — légendaire depuis 1977, file permanente", prix:"~600¥ pour 12 pièces", resa:"File sur place — attente 20-30 min, vaut le détour", diff:"🟢", url:"", tabId:"tokyo", dayN:4, dayLabel:"J4 — Harajuku (déjeuner option)" },
          { nom:"Osaka Ohsho 大阪王将 道頓堀", quartier:"Dotonbori, Osaka", note:"⭐ 4.1/5 Google — gyoza frits ultra-croustillants, 290¥/6pcs", prix:"~600¥ repas complet", resa:"Sans réservation", diff:"🟢", url:"https://www.osaka-ohsho.com", tabId:"osaka", dayN:11, dayLabel:"J11 — Dotonbori Osaka" },
        ]
      },
    ]
  },
  {
    id: "desserts", emoji: "🍡", title: "Desserts & Sucreries", color: "#BE185D",
    items: [
      {
        emoji:"🍡", name:"Wagashi (和菓子) — Confiseries traditionnelles", diff:"🟡",
        prio:2,
        desc:"Art confiseur japonais. NAMAGASHI : confiseries fraîches de saison. YOKAN : gelée ferme d'azuki. DORAYAKI : deux pancakes fourrés d'anko.",
        prix:"¥200-800 pièce", ou:"Toraya à Tokyo (depuis 1526). Nishiki Market Kyoto pour wagashi de saison.",
        adresse:"Toraya — 4-9-22 Akasaka, Minato-ku",
        spots:[
          { nom:"Toraya 虎屋 青山", quartier:"Aoyama / Akasaka, Tokyo", note:"⭐ 4.5/5 Tabelog — fournisseur de la cour impériale depuis 1526", prix:"~500-1500¥ pièce", resa:"Sans réservation pour le salon de thé", diff:"🟡", url:"https://www.toraya-group.co.jp", tabId:"tokyo", dayN:5, dayLabel:"J5 — Vendredi Tokyo" },
          { nom:"Kagizen Yoshifusa 鍵善良房 祇園", quartier:"Gion, Kyoto", note:"⭐ 4.5/5 Tabelog — depuis 1711, kuzu kiri signature", prix:"~600-1200¥", resa:"Sans réservation — salon de thé", diff:"🟡", url:"", tabId:"kyoto", dayN:10, dayLabel:"J10 — Kiyomizudera + Gion" },
        ]
      },
      {
        emoji:"🧊", name:"Kakigori (かき氷) — Glace pilée japonaise", diff:"🟢",
        prio:2,
        desc:"Glace rasée ultra-fine (texture neige fraîche). Parfums : UJIKINTOKI = matcha + azuki, ICHIGO = fraise fraîche. Saison : mai-septembre.",
        prix:"¥600-1500", ou:"Stands touristiques à Asakusa, Nishiki Market, Dotonbori.",
        adresse:"Himitsudo — 4-25-11 Yanaka, Tokyo",
        spots:[
          { nom:"Himitsudo 氷 ひみつ堂 谷中", quartier:"Yanaka, Tokyo", note:"⭐ 4.7/5 Tabelog — le kakigori le plus coté de Tokyo", prix:"~900-1500¥", resa:"File sur place — attente 45-90 min en été, arriver avant l'ouverture", diff:"🟢", url:"", tabId:"tokyo", dayN:5, dayLabel:"J5 — Vendredi Tokyo (Yanaka option)" },
          { nom:"Kagiya かぎや 祇園", quartier:"Gion, Kyoto", note:"⭐ 4.3/5 Tabelog — kakigori matcha + warabi mochi", prix:"~800-1200¥", resa:"Sans réservation en semaine", diff:"🟢", url:"", tabId:"kyoto", dayN:10, dayLabel:"J10 — Gion Kyoto" },
        ]
      },
      {
        emoji:"🍦", name:"Soft Cream (ソフトクリーム)", diff:"🟢",
        prio:1,
        desc:"Glaces japonaises d'un autre niveau. Saveurs : Hokkaido milk, matcha, charbon noir, sakura. Tourbillon parfait avec pointe.",
        prix:"¥300-600", ou:"Arashiyama, Nakamise-dori Asakusa, Nishiki Market, Solamachi.",
        adresse:"Partout sur les rues touristiques",
        spots:[
          { nom:"Nanaya ななや 自由が丘", quartier:"Jiyugaoka, Tokyo", note:"⭐ 4.5/5 Tabelog — 7 intensités de matcha, la crème glacée matcha de référence", prix:"~500¥ (intensité 7 = la plus intense)", resa:"Sans réservation — parfois file", diff:"🟢", url:"https://www.nanaya-matcha.com", tabId:"tokyo", dayN:5, dayLabel:"J5 — Vendredi Tokyo" },
          { nom:"Soft cream Solamachi ソラマチ", quartier:"Tokyo Skytree, Asakusa, Tokyo", note:"⭐ Solamachi 2F — nombreux stands dont Hokkaido milk et matcha", prix:"~350-500¥", resa:"Sans réservation", diff:"🟢", url:"", tabId:"tokyo", dayN:2, dayLabel:"J2 — Skytree (Solamachi)" },
        ]
      },
      {
        emoji:"🥞", name:"Fluffy Pancakes (ふわふわパンケーキ)", diff:"🟢",
        prio:3,
        desc:"Pancakes soufflés de 5-8 cm, texture nuage. Cuits lentement à couvert. Totalement différents des pancakes américains.",
        prix:"¥900-1600", ou:"Gram Café & Pancakes — Osaka (J11-J13). Aussi à Tokyo Shinjuku.",
        adresse:"Gram Café & Pancakes — Shinsaibashi, Osaka",
        spots:[
          { nom:"Gram Café & Pancakes グラム 心斎橋", quartier:"Shinsaibashi, Osaka", note:"⭐ 4.4/5 Google — les fluffy pancakes originaux d'Osaka", prix:"~1200-1500¥ (3 pancakes)", resa:"File sur place — attente 20-45 min le week-end", diff:"🟢", url:"https://gram-cafe.com", tabId:"osaka", dayN:12, dayLabel:"J12 — USJ (brunch avant ou après)" },
          { nom:"Butter バター 新宿", quartier:"Shinjuku Isetan MEN'S 2F, Tokyo", note:"⭐ 4.3/5 Google — fluffy pancakes style café Tokyo", prix:"~1100-1400¥", resa:"Sans réservation — file le week-end", diff:"🟢", url:"", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku (brunch option)" },
        ]
      },
      {
        emoji:"🍮", name:"Purin & Cheesecake japonais", diff:"🟢",
        desc:"PURIN : flan plus ferme que le français, caramel amer dessous. Lawson Premium Purin = meilleur en konbini. CHEESECAKE SOUFFLÉ : texture coton, léger comme une mousse.",
        prix:"¥200-600", ou:"Lawson konbini pour le purin. Uncle Tetsu à Osaka et Tokyo.",
        adresse:"Uncle Tetsu — Grand Front Osaka, Umeda",
        spots:[
          { nom:"Uncle Tetsu アンクル・テツ 大阪", quartier:"Grand Front Osaka, Umeda, Osaka", note:"⭐ 4.3/5 Google — cheesecake soufflé frais à emporter", prix:"~900¥ (cheesecake entier, ~8 parts)", resa:"File sur place — 10-20 min", diff:"🟢", url:"https://uncletetsu.com", tabId:"osaka", dayN:13, dayLabel:"J13 — Umeda Sky Building (Grand Front Osaka)" },
          { nom:"Lawson Premium Purin ローソン プリン", quartier:"Partout au Japon", note:"⭐ Élu meilleur purin konbini 2024", prix:"~250¥", resa:"Sans réservation — konbini 24h/24", diff:"🟢", url:"", tabId:"tokyo", dayN:1, dayLabel:"J1 — Arrivée Asakusa" },
        ]
      },
      {
        emoji:"🍓", name:"Mochi & Daifuku (大福)", diff:"🟢",
        prio:2,
        desc:"MOCHI : galette de riz gluant élastique. DAIFUKU : mochi fourré anko, matcha, ichigo daifuku (fraise entière enveloppée). WARABI MOCHI : version fondante au bracken saupoudrée de kinako.",
        prix:"¥150-400", ou:"Nishiki Market Kyoto, Nakamise-dori Asakusa, Arashiyama.",
        adresse:"Kagizen Yoshifusa — Gion Kyoto",
        spots:[
          { nom:"Daiyasu 大やす 錦市場", quartier:"Nishiki Market, Kyoto", note:"⭐ 4.4/5 Tabelog — daifuku frais et warabi mochi", prix:"~200-350¥/pièce", resa:"Sans réservation — stand ouvert dès 9h", diff:"🟢", url:"", tabId:"kyoto", dayN:7, dayLabel:"J7 — Arrivée Kyoto + Nishiki Market" },
          { nom:"Mochi stand 餅スタンド 嵐山", quartier:"Arashiyama rue principale, Kyoto", note:"⭐ 4.2/5 Google — mochi kinako grillé devant vous", prix:"~150-250¥/pièce", resa:"Sans réservation — stands de rue", diff:"🟢", url:"", tabId:"kyoto", dayN:8, dayLabel:"J8 — Arashiyama" },
        ]
      },
    ]
  },
  {
    id: "boissons", emoji: "🍵", title: "Thés, Cafés & Boissons", color: "#0D9488",
    items: [
      {
        emoji:"🍵", name:"Matcha (抹茶) — Niveaux et styles", diff:"🟡",
        prio:1,
        desc:"USUCHA : version diluée, servi en cérémonie touristique. KOICHA : très concentré, réservé aux cérémonies formelles. MATCHA LATTE : partout depuis ¥500. Le meilleur vient d'Uji (宇治) près de Kyoto.",
        prix:"¥500-1200", ou:"Ippodo Tea à Kyoto (Nakagyo-ku — référence depuis 1717). Nakamura Tokichi à Uji.",
        adresse:"Ippodo Tea — 52 Teramachi Nijo, Nakagyo-ku, Kyoto",
        spots:[
          { nom:"Ippodo Tea 一保堂茶舗 京都本店", quartier:"Teramachi Nijo, Kyoto", note:"⭐ 4.6/5 Tabelog — la maison de thé de référence depuis 1717", prix:"~800¥ (matcha + wagashi), ~600¥ (thé au verre)", resa:"Sans réservation — salon de thé japonais", diff:"🟡", url:"https://www.ippodo-tea.co.jp", tabId:"kyoto", dayN:10, dayLabel:"J10 — Kiyomizudera + Gion (Teramachi shopping)" },
          { nom:"Nanaya ななや 七番", quartier:"Jiyugaoka, Tokyo (aussi Shinjuku)", note:"⭐ 4.5/5 Tabelog — 7 niveaux d'intensité matcha (1=doux, 7=intense)", prix:"~500-700¥ (glace ou latte)", resa:"Sans réservation", diff:"🟢", url:"https://www.nanaya-matcha.com", tabId:"tokyo", dayN:5, dayLabel:"J5 — Vendredi Tokyo" },
        ]
      },
      {
        emoji:"🌿", name:"Hojicha & Autres thés japonais", diff:"🟢",
        prio:2,
        desc:"HOJICHA : torréfié, caramel grillé, quasi sans caféine. GENMAICHA : thé vert + riz soufflé, goût de pop-corn. MUGICHA : orge glacé, sans théine, gratuit dans beaucoup de restaurants.",
        prix:"¥300-600 en café, gratuit en restaurant", ou:"Ippodo Tea à Kyoto. IYEMON SALON à Kyoto pour expérience immersive.",
        adresse:"IYEMON SALON — Shijo-Karasuma, Kyoto",
        spots:[
          { nom:"IYEMON SALON 一右衛門 四条烏丸", quartier:"Shijo-Karasuma, Kyoto", note:"⭐ 4.4/5 Google — salon de thé moderne, tous les styles de thé japonais", prix:"~600-1200¥ (thé + wagashi)", resa:"Sans réservation", diff:"🟡", url:"", tabId:"kyoto", dayN:7, dayLabel:"J7 — Arrivée Kyoto (quartier Shijo)" },
        ]
      },
      {
        emoji:"🥤", name:"Ramune, Calpis & Boissons iconiques", diff:"🟢",
        prio:3,
        desc:"RAMUNE : soda pétillant en bouteille verre à bille. CALPIS : boisson lactée fermentée. MELON SODA : vert fluo iconique. GEORGIA MAX COFFEE : café en canette ultra-sucré en distributeur.",
        prix:"¥120-300 en distributeur", ou:"Distributeurs automatiques partout — un toutes les 100m dans les villes.",
        adresse:"N'importe quel distributeur automatique",
        spots:[
          { nom:"Distributeurs automatiques 自動販売機", quartier:"Partout au Japon — un tous les 100m en ville", note:"⭐ Expérience unique — sélection impossible à trouver en France", prix:"¥100-300", resa:"Disponible 24h/24", diff:"🟢", url:"", tabId:"tokyo", dayN:1, dayLabel:"J1 — Arrivée Asakusa" },
        ]
      },
    ]
  },
  {
    id: "alcools", emoji: "🥃", title: "Alcools sans bière", color: "#92400E",
    items: [
      {
        emoji:"🥃", name:"Whisky japonais — Les références", diff:"🟡",
        prio:2,
        desc:"HIBIKI HARMONY : blend floral et soyeux. NIKKA FROM THE BARREL : très concentré (51%), complexe. YAMAZAKI 12 ANS : single malt, fruits et miel. NIKKA YOICHI : tourbé, fumé. HAKUSHU : herbacé.",
        prix:"¥800-2500/verre en bar, ¥3000-15000/bouteille duty-free", ou:"Zoetrope Bar à Shinjuku : 200+ whiskys japonais. Bar High Five à Ginza.",
        adresse:"Zoetrope — 3-6-2 Nishi-Shinjuku",
        spots:[
          { nom:"Zoetrope ゾエトロープ 新宿", quartier:"Nishi-Shinjuku, Tokyo", note:"⭐ 4.6/5 Tabelog — le bar whisky japonais de référence (200+ bouteilles)", prix:"~800-2500¥/verre", resa:"Sans réservation — ouvert dès 19h", diff:"🟡", url:"", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku / Daikoku PA soir" },
          { nom:"Bar High Five ハイファイブ 銀座", quartier:"Ginza, Tokyo", note:"⭐ 4.7/5 Tabelog — l'un des meilleurs bars à cocktails du monde (Tales of the Cocktail)", prix:"~1500-3000¥/cocktail", resa:"Réservation recommandée", diff:"🔴", url:"", tabId:"tokyo", dayN:6, dayLabel:"J6 — Matin Ginza (bar option le soir)" },
        ]
      },
      {
        emoji:"🍶", name:"Saké par région — Comprendre les styles", diff:"🟡",
        prio:2,
        desc:"JUNMAI : riz pur, corps rond. GINJO : floral. DAIGINJO : arômes de fruits. NIGORI : trouble, sucré. FUSHIMI/Kyoto : élégant et doux. NADA/Kobe : sec et robuste. NIIGATA : très sec.",
        prix:"¥600-1500/verre, ¥500-2000/bouteille", ou:"Bar Suigun à Gion Kyoto (J10 soir). Isetan Shinjuku B2 pour achats.",
        adresse:"Bar Suigun — Shimonzen-dori, Gion, Kyoto",
        spots:[
          { nom:"Bar Suigun バー水軍 祇園", quartier:"Shimonzen-dori, Gion, Kyoto", note:"⭐ 4.5/5 Tabelog — 200+ sakés dont raretés Fushimi", prix:"~600-1500¥/verre de 90ml", resa:"Sans réservation", diff:"🟡", url:"", tabId:"kyoto", dayN:10, dayLabel:"J10 — Dernière soirée Gion Kyoto" },
          { nom:"Kurand Sake Market クランドサケマーケット 浅草", quartier:"Asakusa, Tokyo", note:"⭐ 4.3/5 Google — 100+ sakés all-you-can-drink", prix:"~2000¥/40 min ou 3000¥/80 min", resa:"Sans réservation — files possibles le soir", diff:"🟢", url:"", tabId:"tokyo", dayN:1, dayLabel:"J1 — Arrivée Asakusa (bar à saké)" },
        ]
      },
      {
        emoji:"🌾", name:"Shochu (焼酎) & Umeshu (梅酒)", diff:"🟢",
        prio:3,
        desc:"SHOCHU : distillé 25-35%, base patate douce, orge ou riz. UMESHU : prunes macérées dans shochu. Doux, fruité, ~12%. Artisanaux des izakayas > industriels.",
        prix:"¥400-800/verre", ou:"Dans tous les izakayas — demander 'tezukuri umeshu arimasu ka ?'",
        adresse:"Toutes les izakayas — Golden Gai Shinjuku, Pontocho Kyoto, Dotonbori Osaka",
        spots:[
          { nom:"Golden Gai ゴールデン街 新宿", quartier:"Kabukicho, Shinjuku, Tokyo", note:"⭐ Expérience unique — 200+ bars thématiques de 5-10 places", prix:"~600-900¥/verre (cover charge 500-1000¥)", resa:"Sans réservation — choisir son bar sur le thème", diff:"🟡", url:"", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku / Golden Gai" },
        ]
      },
    ]
  },
  {
    id: "konbini", emoji: "🏪", title: "Konbini & Dépachika", color: "#374151",
    items: [
      {
        emoji:"7️⃣", name:"Konbini — Incontournables à acheter", diff:"🟢",
        prio:1,
        desc:"7-ELEVEN : onigiri frais, meilleur purin. FAMILY MART : Famichiki (poulet frit ¥200), meilleur tamago sando. LAWSON : Premium Purin (¥250), karaage-kun. NIKUMAN : brioche vapeur porc ~¥150.",
        prix:"¥100-500 la plupart des articles", ou:"Dans chaque gare, 24h/24. ATM Japan Post Bank à l'intérieur.",
        adresse:"7-Eleven pour la qualité, FamilyMart pour le Famichiki, Lawson pour le purin",
        spots:[
          { nom:"7-Eleven セブンイレブン 全国", quartier:"Partout dans toutes les villes du voyage", note:"⭐ Classé n°1 des konbinis pour la qualité alimentaire", prix:"¥100-500", resa:"Ouvert 24h/24", diff:"🟢", url:"https://www.sej.co.jp", tabId:"tokyo", dayN:1, dayLabel:"J1 — Arrivée Asakusa (provisions arrivée)" },
        ]
      },
      {
        emoji:"🏬", name:"Dépachika (デパ地下) — Sous-sols de grands magasins", diff:"🟡",
        prio:2,
        desc:"Sous-sols B1-B2 des grands magasins = marchés gastronomiques d'exception. TOKYO : Isetan Shinjuku B2. KYOTO : Takashimaya Shijo B1-B2. OSAKA : Daimaru Umeda B1-B2.",
        prix:"¥500-5000 selon les achats", ou:"Isetan Shinjuku (J5/J6). Takashimaya Kyoto (J7-J10). Daimaru Osaka (J11-J13).",
        adresse:"Isetan Shinjuku — 3-14-1 Shinjuku, B1-B2",
        spots:[
          { nom:"Isetan Shinjuku 伊勢丹 新宿 B2F", quartier:"Shinjuku, Tokyo", note:"⭐ 4.4/5 Tabelog (dépachika) — la meilleure sélection de wagashi et saké de Tokyo", prix:"¥500-5000 selon produit", resa:"Ouvert 10h30-20h", diff:"🟡", url:"https://www.isetan.mistore.jp", tabId:"tokyo", dayN:5, dayLabel:"J5 — Shinjuku" },
          { nom:"Daimaru Umeda 大丸 梅田 B1-B2F", quartier:"Umeda, Osaka", note:"⭐ 4.3/5 Tabelog — spécialités d'Osaka, bentos de luxe, wagashi", prix:"¥500-3000", resa:"Ouvert 10h-20h30", diff:"🟡", url:"", tabId:"osaka", dayN:13, dayLabel:"J13 — Umeda (Grand Front Osaka area)" },
        ]
      },
      {
        emoji:"🍱", name:"Ekiben (駅弁) — Bentos de gare", diff:"🟢",
        prio:2,
        desc:"Bentos vendus dans les grandes gares, à manger dans le Shinkansen. TOKYO STATION (Gransta Mall B1-B2) : bento Wagyu Gyutan (¥1800). ODAWARA : spécialités locales.",
        prix:"¥1000-2500", ou:"Gransta Mall Tokyo Station (J7 départ Shinkansen). Shin-Osaka (J14 retour Tokyo).",
        adresse:"Gransta Mall — Tokyo Station B1-B2",
        spots:[
          { nom:"Gransta グランスタ 東京駅", quartier:"Tokyo Station, B1-B2", note:"⭐ 4.5/5 Tabelog — plus de 100 ekiben de toutes les régions", prix:"¥1000-2500/bento", resa:"Ouvert 7h-22h30 — plus grande sélection le matin", diff:"🟢", url:"https://www.gransta.jp", tabId:"tokyo", dayN:7, dayLabel:"J7 — Shinkansen Tokyo → Kyoto (acheter avant d'embarquer)" },
        ]
      },
    ]
  },
];

function SpotCard({ spot, catColor }) {
  const dark = useDark();
  const { goTo } = useNav();
  const diffColor2 = {
    "🟢": { bg: t("#DCFCE7","#14301E"), color: t("#166534","#4ADE80") },
    "🟡": { bg: t("#FEF9C3","#1C1400"), color: t("#854D0E","#FCD34D") },
    "🔴": { bg: t("#FEE2E2","#2D0A0A"), color: t("#991B1B","#F87171") },
  };
  const dc2 = diffColor2[spot.diff] || diffColor2["🟢"];
  return (
    <div style={{ background:v("cardBg2",dark), border:`1px solid ${v("borderLight",dark)}`, borderRadius:"8px", padding:"0.55rem 0.7rem" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"0.5rem", marginBottom:"0.25rem" }}>
        <div>
          <span style={{ fontSize:"0.8rem", fontWeight:700, color:catColor }}>{spot.nom}</span>
          <span style={{ fontSize:"0.7rem", color:v("textMuted",dark), marginLeft:"0.4rem" }}>· {spot.quartier}</span>
        </div>
        <span style={{ fontSize:"0.7rem", fontWeight:600, padding:"0.12rem 0.4rem", borderRadius:"6px", whiteSpace:"nowrap", flexShrink:0, background:dc2.bg[dark?"dark":"light"], color:dc2.color[dark?"dark":"light"] }}>
          {spot.diff}
        </span>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.3rem 0.75rem", marginBottom:"0.3rem" }}>
        <span style={{ fontSize:"0.7rem", color:v("textSec",dark) }}>{spot.note}</span>
        <span style={{ fontSize:"0.7rem", color:v("textSec",dark) }}>💴 {spot.prix}</span>
        <span style={{ fontSize:"0.7rem", color:v("textSec",dark) }}>📋 {spot.resa}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", flexWrap:"wrap" }}>
        {spot.url && (
          <a href={spot.url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize:"0.68rem", color:catColor, textDecoration:"none", fontWeight:600 }}>
            🔗 Réserver / Site officiel
          </a>
        )}
        {spot.tabId && spot.dayN && (
          <button
            onClick={() => goTo(spot.tabId, spot.dayN)}
            style={{ fontSize:"0.68rem", color:dark?"#60A5FA":"#1D4ED8", background:"transparent", border:"none", cursor:"pointer", padding:0, fontWeight:600, textDecoration:"underline" }}>
            → Voir {spot.dayLabel} dans le planning
          </button>
        )}
      </div>
    </div>
  );
}


function GastroSection() {
  const dark = useDark();
  const { goTo } = useNav();
  const [openSections, setOpenSections] = useState(new Set(["ramen"]));
  const [filter, setFilter] = useState(0); // 0=all, 1=incontournables, 2=recommandés
  const [cityFilter, setCityFilter] = useState("all"); // C17: all | tokyo | kyoto | osaka
  const [highlightedItem, setHighlightedItem] = useState(null); // "catId::itemName"

  const goToGastroItem = (catId, itemName) => {
    // 1. Open the accordion
    setOpenSections(p => { const s = new Set(p); s.add(catId); return s; });
    // 2. Reset filter to show all (so item is visible)
    setFilter(0);
    // 3. Highlight + scroll after render
    const key = catId + "::" + itemName;
    setHighlightedItem(key);
    setTimeout(() => {
      const el = document.getElementById("gastro-item-" + key.replace(/[^a-zA-Z0-9]/g, "-"));
      if (el) el.scrollIntoView({ behavior:"smooth", block:"center" });
    }, 80);
    // 4. Remove highlight after 2.2s
    setTimeout(() => setHighlightedItem(null), 2200);
  };

  const toggleSection = id => setOpenSections(p => {
    const s = new Set(p);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const diffLabel = { "🟢": "Facile", "🟡": "Pointer du doigt", "🔴": "Réservation/japonais" };
  const diffColor = {
    "🟢": { bg: t("#DCFCE7","#14301E"), color: t("#166534","#4ADE80") },
    "🟡": { bg: t("#FEF9C3","#1C1400"), color: t("#854D0E","#FCD34D") },
    "🔴": { bg: t("#FEE2E2","#2D0A0A"), color: t("#991B1B","#F87171") },
  };

  const prioBadge = {
    1: { label:"⭐ Incontournable", bg: t("#FEF3C7","#2D1800"), color: t("#92400E","#FBBF24"), border: t("#FDE68A","#78350F") },
    2: { label:"🔶 Recommandé",     bg: t("#FFF7ED","#1C1000"), color: t("#C2410C","#FB923C"), border: t("#FED7AA","#7C2D12") },
    3: { label:"· Bonus",            bg: t("#F3F4F6","#252525"), color: t("#6B7280","#9CA3AF"), border: t("#E5E7EB","#3A3A3A") },
  };

  const TOP10 = [
    { rank:1, emoji:"🍜", name:"Ramen au comptoir", hook:"Le rituel le plus intime et universel de la gastronomie japonaise.", moment:"Ichiran Shinjuku — n'importe quel soir à Tokyo", tabId:"tokyo", dayN:5, catId:"ramen", itemName:"Tonkotsu (博多とんこつ)" },
    { rank:2, emoji:"🐟", name:"Sushi à Tsukiji au lever du jour", hook:"Le poisson le plus frais du monde, dans la lumière froide de l'aube.", moment:"Tsukiji Outer Market — J6 matin (5h-8h)", tabId:"tokyo", dayN:6, catId:"sushi", itemName:"Tsukiji — Petit-déjeuner sushi" },
    { rank:3, emoji:"🥩", name:"Wagyu yakiniku", hook:"Une tranche de A5 qui fond avant même de toucher la langue.", moment:"Kittan Hibiki Osaka — J13 soir (réservé)", tabId:"osaka", dayN:13, catId:"viandes", itemName:"Yakiniku — Wagyu (焼肉)" },
    { rank:4, emoji:"🍙", name:"Onigiri du 7-Eleven à 7h du matin", hook:"Le petit-déjeuner le plus japonais du monde, pour 160 yens.", moment:"N'importe quel 7-Eleven, chaque matin du voyage", tabId:"tokyo", dayN:1, catId:"streetfood", itemName:"Onigiri (おにぎり)" },
    { rank:5, emoji:"🍵", name:"Cérémonie du matcha à Kyoto", hook:"Un bol de poudre verte et 1000 ans d'histoire dans chaque gorgée.", moment:"Ippodo Tea — J10 (Teramachi Kyoto)", tabId:"kyoto", dayN:10, catId:"boissons", itemName:"Matcha (抹茶) — Niveaux et styles" },
    { rank:6, emoji:"🐙", name:"Takoyaki à Dotonbori", hook:"Huit billes brûlantes, un carrefour de néons — l'âme d'Osaka en une bouchée.", moment:"Kukuru ou Aizuya — J11 arrivée Osaka", tabId:"osaka", dayN:11, catId:"streetfood", itemName:"Takoyaki (たこ焼き)" },
    { rank:7, emoji:"🍦", name:"Soft cream Hokkaido", hook:"La crème glacée la plus pure du monde, au lait de vache de montagne.", moment:"Solamachi (pied du Skytree) ou Arashiyama — J2 ou J8", tabId:"tokyo", dayN:2, catId:"desserts", itemName:"Soft Cream (ソフトクリーム)" },
    { rank:8, emoji:"🍗", name:"Yakitori dans Omoide Yokocho", hook:"Charbon, fumée, saké chaud — Tokyo dans sa plus belle sincérité.", moment:"Omoide Yokocho, Shinjuku — J5 soir", tabId:"tokyo", dayN:5, catId:"viandes", itemName:"Yakitori (焼き鳥) — Guide des pièces" },
    { rank:9, emoji:"🥚", name:"Tamago sando du FamilyMart", hook:"Le sandwich à l'œuf le plus élaboré de l'histoire de la restauration rapide.", moment:"FamilyMart, chaque matin — première priorité J1", tabId:"tokyo", dayN:1, catId:"streetfood", itemName:"Tamago Sando (たまごサンド)" },
    { rank:10, emoji:"🏯", name:"Ekiben dans le Shinkansen", hook:"Un bento de gare, le Fuji à gauche, 285 km/h — repas impossible à reproduire.", moment:"Gransta Mall Tokyo Station — J7 (avant d'embarquer)", tabId:"tokyo", dayN:7, catId:"konbini", itemName:"Ekiben (駅弁) — Bentos de gare" },
  ];

  // Apply both prio filter and city filter (C17). City filter keeps an item
  // if at least one of its spots matches the selected city.
  const filteredGastro = GASTRO.map(cat => {
    let items = cat.items;
    if (filter !== 0) items = items.filter(item => item.prio === filter);
    if (cityFilter !== "all") {
      items = items.filter(item =>
        item.spots && item.spots.some(s => s.tabId === cityFilter)
      );
    }
    return { ...cat, items };
  }).filter(cat => cat.items.length > 0);

  const rankColors = ["#DC2626","#B45309","#0369A1","#065F46","#7C3AED","#BE185D","#0D9488","#92400E","#374151","#1553C4"];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>

      {/* ── TOP 10 SECTION ── */}
      <div style={{ background:v("cardBg",dark), borderRadius:"12px", overflow:"hidden", border:`1px solid ${v("border",dark)}`, boxShadow:dark?"0 2px 8px rgba(0,0,0,0.4)":"0 2px 8px rgba(0,0,0,0.1)" }}>
        <div style={{ background:"linear-gradient(135deg,#7B0000 0%,#B0000A 60%,#CC2020 100%)", padding:"0.9rem 1rem" }}>
          <p style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.6)", letterSpacing:"0.15em", textTransform:"uppercase", margin:"0 0 0.2rem" }}>Sélection éditoriale</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.25rem", fontWeight:600, color:"white", margin:"0 0 0.5rem" }}>Top 10 — Les incontournables culinaires</h2>
          <p style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.75)", margin:0, lineHeight:1.5 }}>
            Ces 10 expériences définissent la gastronomie japonaise. Un premier voyage sans elles est incomplet. Le classement s'établit sur trois critères : unicité culturelle (faisable seulement au Japon), accessibilité (sans budget illimité), et densité d'émotion gustative. Du plus universel au plus mémorable.
          </p>
        </div>
        <div style={{ padding:"0.75rem" }}>
          {TOP10.map((item, i) => (
            <div key={i} style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start", padding:"0.6rem 0.25rem", borderBottom: i < 9 ? `1px solid ${v("borderMid",dark)}` : "none" }}>
              <div style={{ flexShrink:0, width:"2rem", height:"2rem", borderRadius:"50%", background:rankColors[i], display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:"0.75rem", fontWeight:800, color:"white", lineHeight:1 }}>{item.rank}</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.1rem", flexWrap:"wrap" }}>
                  <span style={{ fontSize:"0.9rem" }}>{item.emoji}</span>
                  <span style={{ fontSize:"0.85rem", fontWeight:700, color:v("textPrimary",dark) }}>{item.name}</span>
                </div>
                <p style={{ fontSize:"0.72rem", color:v("textSec",dark), margin:"0 0 0.2rem", fontStyle:"italic", lineHeight:1.4 }}>{item.hook}</p>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", flexWrap:"wrap", marginBottom:"0.35rem" }}>
                  <span style={{ fontSize:"0.68rem", color:v("textMuted",dark) }}>📍 {item.moment}</span>
                  {item.tabId && (
                    <button onClick={() => goTo(item.tabId, item.dayN)} style={{ fontSize:"0.68rem", color:dark?"#60A5FA":"#1D4ED8", background:"transparent", border:"none", cursor:"pointer", padding:0, fontWeight:600, textDecoration:"underline" }}>
                      → Planning
                    </button>
                  )}
                </div>
                {item.catId && (
                  <div style={{ borderTop:`1px solid ${v("borderMid",dark)}`, marginTop:"0.35rem", paddingTop:"0.35rem" }}>
                    <button
                      onClick={() => goToGastroItem(item.catId, item.itemName)}
                      style={{ fontSize:"0.69rem", color:dark?"#9CA3AF":"#6B7280", background:"transparent", border:"none", cursor:"pointer", padding:0, fontFamily:"inherit", transition:"color 0.15s" }}
                      onMouseEnter={e => e.target.style.color = dark?"#F1F0EE":"#1F2937"}
                      onMouseLeave={e => e.target.style.color = dark?"#9CA3AF":"#6B7280"}
                    >
                      → Détails &amp; adresses
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTER BUTTONS ── */}
      <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
        {[
          { val:0, label:"Tous les plats" },
          { val:1, label:"⭐ Incontournables" },
          { val:2, label:"🔶 Fortement recommandés" },
        ].map(btn => (
          <button key={btn.val} onClick={() => setFilter(btn.val)} style={{
            padding:"0.35rem 0.75rem", borderRadius:"20px", border:`1.5px solid ${filter===btn.val?(dark?"#FBBF24":"#D97706"):(dark?"#3A3A3A":"#E5E7EB")}`,
            background: filter===btn.val ? (dark?"#2D1800":"#FEF3C7") : "transparent",
            color: filter===btn.val ? (dark?"#FBBF24":"#92400E") : v("textSec",dark),
            fontSize:"0.73rem", fontWeight: filter===btn.val ? 700 : 400,
            cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s",
          }}>
            {btn.label}
          </button>
        ))}
        {(filter !== 0 || cityFilter !== "all") && (
          <span style={{ fontSize:"0.68rem", color:v("textMuted",dark), alignSelf:"center" }}>
            {filteredGastro.reduce((n,c) => n+c.items.length, 0)} plats affichés
          </span>
        )}
      </div>

      {/* C17 — City filter */}
      <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
        {[
          { val:"all",   label:"Toutes villes",      color:"#6B7280" },
          { val:"tokyo", label:"🗼 Tokyo",           color:"#3B7EFF" },
          { val:"kyoto", label:"⛩ Kyoto",           color:"#A855F7" },
          { val:"osaka", label:"🎡 Osaka",           color:"#F97316" },
        ].map(btn => {
          const active = cityFilter === btn.val;
          return (
            <button key={btn.val} onClick={() => setCityFilter(btn.val)} style={{
              padding:"0.3rem 0.7rem", borderRadius:"20px",
              border:`1.5px solid ${active ? btn.color : (dark?"#3A3A3A":"#E5E7EB")}`,
              background: active ? `${btn.color}22` : "transparent",
              color: active ? btn.color : v("textSec",dark),
              fontSize:"0.7rem", fontWeight: active ? 700 : 400,
              cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s",
            }}>
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* ── ACCORDION CATEGORIES ── */}
      {filteredGastro.map(cat => {
        const isOpen = filter !== 0 || openSections.has(cat.id);
        return (
          <div key={cat.id} style={{ background:v("cardBg",dark), borderRadius:"12px", overflow:"hidden", border:`1px solid ${v("border",dark)}`, boxShadow:dark?"0 1px 6px rgba(0,0,0,0.3)":"0 1px 4px rgba(0,0,0,0.07)" }}>
            <button onClick={() => toggleSection(cat.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.85rem 1rem", background:"transparent", border:"none", cursor:"pointer", textAlign:"left", outline:"none" }}>
              <span style={{ fontSize:"1.4rem", flexShrink:0 }}>{cat.emoji}</span>
              <span style={{ flex:1, fontSize:"0.95rem", fontWeight:700, color:cat.color }}>{cat.title}</span>
              <span style={{ fontSize:"0.68rem", color:v("textMuted",dark), marginRight:"0.5rem" }}>{cat.items.length} plat{cat.items.length>1?"s":""}</span>
              <span style={{ color:v("textMuted",dark), fontSize:"0.8rem", display:"inline-block", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
            </button>
            {isOpen && (
              <div style={{ borderTop:`1px solid ${v("borderLight",dark)}` }}>
                {cat.items.map((item, idx) => {
                  const dc = diffColor[item.diff];
                  const pb = prioBadge[item.prio];
                  const itemKey = cat.id + "::" + item.name;
                  const itemId = "gastro-item-" + itemKey.replace(/[^a-zA-Z0-9]/g, "-");
                  const isHighlighted = highlightedItem === itemKey;
                  return (
                    <div key={idx} id={itemId} style={{ padding:"0.8rem 1rem", borderBottom:idx<cat.items.length-1?`1px solid ${v("borderMid",dark)}`:"none", transition:"background 0.5s ease", background: isHighlighted ? (dark?"rgba(251,191,36,0.18)":"rgba(251,191,36,0.22)") : "transparent", borderRadius: isHighlighted ? "6px" : "0" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"0.4rem", marginBottom:"0.35rem", flexWrap:"wrap" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", flex:1, minWidth:0 }}>
                          <span style={{ fontSize:"1.1rem", flexShrink:0 }}>{item.emoji}</span>
                          <span style={{ fontSize:"0.88rem", fontWeight:700, color:v("textPrimary",dark) }}>{item.name}</span>
                        </div>
                        <div style={{ display:"flex", gap:"0.3rem", flexShrink:0, flexWrap:"wrap", justifyContent:"flex-end" }}>
                          {pb && (
                            <span style={{ fontSize:"0.7rem", fontWeight:700, padding:"0.15rem 0.45rem", borderRadius:"8px", whiteSpace:"nowrap", background:pb.bg[dark?"dark":"light"], color:pb.color[dark?"dark":"light"], border:`1px solid ${pb.border[dark?"dark":"light"]}` }}>
                              {pb.label}
                            </span>
                          )}
                          <span style={{ fontSize:"0.7rem", fontWeight:600, padding:"0.15rem 0.45rem", borderRadius:"8px", whiteSpace:"nowrap", background:dc.bg[dark?"dark":"light"], color:dc.color[dark?"dark":"light"] }}>
                            {item.diff} {diffLabel[item.diff]}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize:"0.75rem", color:v("textSec",dark), lineHeight:1.55, margin:"0 0 0.45rem", paddingLeft:"1.6rem" }}>{item.desc}</p>
                      <div style={{ paddingLeft:"1.6rem", display:"flex", flexDirection:"column", gap:"0.2rem", marginBottom: item.spots?.length ? "0.65rem" : 0 }}>
                        <p style={{ fontSize:"0.72rem", color:v("textSec",dark), margin:0 }}>
                          <span style={{ fontWeight:600, color:v("textPrimary",dark) }}>💴 Prix : </span>{item.prix}
                        </p>
                        <p style={{ fontSize:"0.72rem", color:v("textSec",dark), margin:0 }}>
                          <span style={{ fontWeight:600, color:v("textPrimary",dark) }}>📍 Pendant le voyage : </span>{item.ou}
                        </p>
                      </div>
                      {item.spots?.length > 0 && (
                        <div style={{ paddingLeft:"1.6rem", display:"flex", flexDirection:"column", gap:"0.5rem" }}>
                          {item.spots
                            .filter(spot => cityFilter === "all" || spot.tabId === cityFilter)
                            .map((spot, si) => (
                              <SpotCard key={si} spot={spot} catColor={cat.color} />
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
// B. CONVERTISSEUR ¥/€
// ═══════════════════════════════════════════════════════════════════
function ConverterCard() {
  const dark = useDark();
  const [rate, setRate] = useState(163);
  const [yen, setYen] = useState("");
  const [eur, setEur] = useState("");
  const refs = [
    { label:"Ramen Ichiran", yen:980 },
    { label:"Billet métro", yen:230 },
    { label:"Repas konbini", yen:600 },
    { label:"TeamLab Planets", yen:3200 },
    { label:"Nuit hôtel moy.", yen:12000 },
    { label:"Billet Skytree", yen:2100 },
  ];
  const handleYen = v => { setYen(v); setEur(v === "" ? "" : (parseFloat(v)/rate).toFixed(2)); };
  const handleEur = v => { setEur(v); setYen(v === "" ? "" : Math.round(parseFloat(v)*rate).toString()); };
  const handleRate = v => {
    const r = parseFloat(v) || 163;
    setRate(r);
    if (yen !== "") setEur((parseFloat(yen)/r).toFixed(2));
  };
  const reset = () => { setYen(""); setEur(""); };
  const inp = { border:`1px solid ${v("borderLight",dark)}`, borderRadius:"8px", padding:"0.5rem 0.65rem", background:v("cardBg2",dark), color:v("textPrimary",dark), fontSize:"1.1rem", fontWeight:600, width:"100%", outline:"none", fontFamily:"inherit", boxSizing:"border-box" };
  return (
    <InfoCard title="💴 Convertisseur ¥ / €" color="#F59E0B" headerBg={t("#FFFBEB","#1C1400")}>
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"0.75rem", alignItems:"center" }}>
        <div style={{ flex:1 }}>
          <label style={{ fontSize:"0.7rem", color:v("textMuted",dark), display:"block", marginBottom:"0.2rem", fontWeight:600, letterSpacing:"0.06em" }}>YEN ¥</label>
          <input type="number" placeholder="0" value={yen} onChange={e=>handleYen(e.target.value)} style={inp} />
        </div>
        <div style={{ fontSize:"1.2rem", color:v("textMuted",dark), alignSelf:"flex-end", paddingBottom:"0.5rem" }}>⇄</div>
        <div style={{ flex:1 }}>
          <label style={{ fontSize:"0.7rem", color:v("textMuted",dark), display:"block", marginBottom:"0.2rem", fontWeight:600, letterSpacing:"0.06em" }}>EURO €</label>
          <input type="number" placeholder="0.00" value={eur} onChange={e=>handleEur(e.target.value)} style={inp} />
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.75rem" }}>
        <span style={{ fontSize:"0.72rem", color:v("textSec",dark), whiteSpace:"nowrap" }}>Taux : 1€ =</span>
        <input type="number" value={rate} onChange={e=>handleRate(e.target.value)} style={{ ...inp, fontSize:"0.85rem", width:"80px", fontWeight:700, color:"#F59E0B" }} />
        <span style={{ fontSize:"0.72rem", color:v("textSec",dark) }}>¥</span>
        <button onClick={reset} style={{ marginLeft:"auto", fontSize:"0.7rem", color:v("textMuted",dark), background:"transparent", border:`1px solid ${v("borderLight",dark)}`, borderRadius:"6px", padding:"0.25rem 0.6rem", cursor:"pointer", fontFamily:"inherit" }}>Réinitialiser</button>
      </div>
      <div style={{ borderTop:`1px solid ${v("borderLight",dark)}`, paddingTop:"0.6rem" }}>
        <p style={{ fontSize:"0.7rem", color:v("textMuted",dark), marginBottom:"0.4rem", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>Références rapides</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.3rem" }}>
          {refs.map((r,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:"0.72rem", padding:"0.25rem 0.5rem", background:v("cardBg2",dark), borderRadius:"6px" }}>
              <span style={{ color:v("textSec",dark) }}>{r.label}</span>
              <span style={{ fontWeight:600, color:"#F59E0B" }}>{(r.yen/rate).toFixed(2)}€</span>
            </div>
          ))}
        </div>
      </div>
    </InfoCard>
  );
}

// ═══════════════════════════════════════════════════════════════════
// D. CHECKLIST DÉPART (dans InfoSection)
// ═══════════════════════════════════════════════════════════════════
function DepartureChecklist() {
  const dark = useDark();
  const ITEMS = [
    { cat:"✈️ Avant de partir (depuis la France)", items:[
      "Valider et activer le JR Pass en ligne (jrpass.com)",
      "Réserver TeamLab, Skytree, Shibuya Sky, USJ, DAWN Robot Café",
      "Prévenir sa banque de la destination Japon (éviter blocage carte)",
      "Télécharger applis offline (Google Maps, Translate, Navitime, Hyperdia)",
      "Screenshots offline de toutes les réservations confirmées",
      "Vérifier validité passeports (6 mois minimum après retour)",
      "Souscrire une assurance voyage avec rapatriement",
      "Acheter adaptateur prise japonaise (Type A, comme USA)",
      "Changer ~200€ en yens ou prévoir retrait ATM dès Haneda",
    ]},
    { cat:"🛬 À l'aéroport / à l'arrivée (Haneda J1)", items:[
      "Retirer des yens à l'ATM Japan Post Bank (vert) ou 7-Eleven (rouge)",
      "Acheter et charger la Suica IC Card (machine bleue, T3)",
      "Activer la SIM data ou eSIM",
      "Télécharger Google Maps offline si pas encore fait (wifi Haneda)",
      "Activer le JR Pass au guichet Midori no Madoguchi (みどりの窓口)",
    ]},
    { cat:"🗓 Pendant le voyage", items:[
      "Réserver les sièges Shinkansen dès J1 au guichet JR (tous les trajets)",
      "Recharger la Suica régulièrement (garder minimum 2000¥)",
      "Garder du cash sur soi en permanence (10 000¥ minimum)",
      "Prendre le goshuin (tampon officiel) dans chaque temple visité",
    ]},
  ];
  const total = ITEMS.reduce((n,c) => n + c.items.length, 0);
  const storageKey = "japan-checklist-v1";
  const [checked, setChecked] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(storageKey)||"[]")); }
    catch { return new Set(); }
  });
  const toggle = key => {
    setChecked(prev => {
      const s = new Set(prev);
      s.has(key) ? s.delete(key) : s.add(key);
      try { localStorage.setItem(storageKey, JSON.stringify([...s])); } catch {}
      return s;
    });
  };
  const reset = () => {
    setChecked(new Set());
    try { localStorage.removeItem(storageKey); } catch {}
  };
  const done = checked.size;
  const pct = Math.round((done/total)*100);
  return (
    <InfoCard title="✅ Checklist départ" color="#10B981" headerBg={t("#ECFDF5","#0A1E12")}>
      <div style={{ marginBottom:"0.75rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.3rem" }}>
          <span style={{ fontSize:"0.75rem", fontWeight:600, color:v("textPrimary",dark) }}>{done} / {total} tâches</span>
          <span style={{ fontSize:"0.75rem", color:"#10B981", fontWeight:700 }}>{pct}%</span>
        </div>
        <div style={{ height:"6px", borderRadius:"3px", background:v("borderLight",dark), overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#10B981,#34D399)", borderRadius:"3px", transition:"width 0.3s ease" }} />
        </div>
      </div>
      {ITEMS.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: ci < ITEMS.length-1 ? "0.75rem" : 0 }}>
          <p style={{ fontSize:"0.72rem", fontWeight:700, color:v("textPrimary",dark), margin:"0 0 0.35rem", letterSpacing:"0.02em" }}>{cat.cat}</p>
          {cat.items.map((item, ii) => {
            const key = `${ci}-${ii}`;
            const isChecked = checked.has(key);
            return (
              <div key={ii} onClick={() => toggle(key)} style={{ display:"flex", alignItems:"flex-start", gap:"0.5rem", padding:"0.3rem 0.4rem", borderRadius:"6px", cursor:"pointer", marginBottom:"0.15rem", background: isChecked ? (dark?"rgba(16,185,129,0.1)":"rgba(16,185,129,0.08)") : "transparent", transition:"background 0.15s" }}>
                <div style={{ flexShrink:0, width:"1rem", height:"1rem", borderRadius:"4px", border:`1.5px solid ${isChecked?"#10B981":v("borderLight",dark)}`, background: isChecked ? "#10B981" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", marginTop:"1px", transition:"all 0.15s" }}>
                  {isChecked && <span style={{ color:"white", fontSize:"0.7rem", fontWeight:800, lineHeight:1 }}>✓</span>}
                </div>
                <span style={{ fontSize:"0.74rem", color: isChecked ? v("textMuted",dark) : v("textSec",dark), textDecoration: isChecked ? "line-through" : "none", lineHeight:1.4, transition:"all 0.15s" }}>{item}</span>
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ borderTop:`1px solid ${v("borderLight",dark)}`, paddingTop:"0.5rem", marginTop:"0.5rem", textAlign:"right" }}>
        <button onClick={reset} style={{ fontSize:"0.68rem", color:v("textMuted",dark), background:"transparent", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Tout réinitialiser</button>
      </div>
    </InfoCard>
  );
}

// ═══════════════════════════════════════════════════════════════════
// A. ONGLET MÉTÉO & PRÉPARATION
// ═══════════════════════════════════════════════════════════════════
function MeteoSection() {
  const dark = useDark();
  const METEO = [
    { city:"Tokyo 🗼", color:"#3B7EFF", bg: t("#EEF2FF","#1A2340"), border: t("#93C5FD","#2D4A7A"),
      weeks:[
        { label:"27 avr — 3 mai (Golden Week)", icon:"🌤", tmin:15, tmax:22, pluie:25, humidite:60, soleil:"7h/j", note:"Douceur printanière. Possible averses courtes. Veste légère le matin." },
        { label:"4 — 10 mai", icon:"☀️", tmin:17, tmax:24, pluie:15, humidite:55, soleil:"8h/j", note:"Plein printemps. Le meilleur moment de l'année à Tokyo. Journées parfaites." },
      ]
    },
    { city:"Kyoto ⛩", color:"#A855F7", bg: t("#F5F3FF","#231840"), border: t("#C4B5FD","#4A3070"),
      weeks:[
        { label:"4 — 7 mai (Golden Week fin)", icon:"🌤", tmin:14, tmax:23, pluie:30, humidite:65, soleil:"6h/j", note:"Printemps tardif plus humide. Un imperméable léger reste utile." },
        { label:"7 — 10 mai", icon:"⛅", tmin:16, tmax:25, pluie:20, humidite:58, soleil:"7h/j", note:"Temperatures en hausse. Idéal pour les balades tôt le matin." },
      ]
    },
    { city:"Osaka 🎡", color:"#F97316", bg: t("#FFF7ED","#251200"), border: t("#FCA572","#5C2D00"),
      weeks:[
        { label:"7 — 11 mai", icon:"☀️", tmin:17, tmax:26, pluie:18, humidite:57, soleil:"8h/j", note:"Chaud et ensoleillé. Crème solaire obligatoire. Parfait pour l'extérieur." },
      ]
    },
  ];
  const VALISE = [
    { cat:"👗 Vêtements", color:"#3B7EFF", items:[
      "🧥 Veste légère imperméable — obligatoire (averses courtes imprévisibles)",
      "🧣 Pull ou cardigan pour les matins frais (15°C à l'aube)",
      "👕 T-shirts légers × 5-6 (chaleur de 22-26°C l'après-midi)",
      "👖 Jean ou pantalon léger × 2 (temples = respect, shorts déconseillés)",
      "🧦 Chaussettes propres en nombre — onsen et temples (chaussures enlevées)",
      "👟 Chaussures ultra-confortables (15 000-20 000 pas/jour minimum)",
      "🩴 Sandales ou slip-ons faciles à enlever (temples multiples/jour)",
    ]},
    { cat:"🎒 Accessoires voyage", color:"#10B981", items:[
      "🔌 Adaptateur prise japonaise Type A (comme USA — 2 fiches plates)",
      "🔋 Batterie externe 20 000 mAh (journées de 12h sans recharge)",
      "☂️ Parapluie compact pliant (indispensable, vente partout à 600¥ si oublié)",
      "🎒 Sac à dos léger 15-20L pour les excursions (pas la valise)",
      "💳 Deux cartes bancaires (Visa + Mastercard) — certains ATM n'acceptent qu'une",
      "📱 Câble de charge universel + chargeur rapide",
    ]},
    { cat:"💊 Santé & Pharmacie", color:"#F59E0B", items:[
      "🌞 Crème solaire SPF 50+ — UV forts en mai au Japon (indice UV 8-9)",
      "💊 Anti-diarrhéiques (changement alimentaire radical)",
      "🤢 Médicaments mal des transports si shinkansen à haute vitesse",
      "🩹 Pansements anti-ampoules (15-20k pas/jour = ampoules garanties J2)",
      "😷 Masques chirurgicaux (encore très courants — poli de s'adapter)",
      "💊 Antihistaminiques (cryptomères japonais = allergies printanières)",
      "🔁 Ordonnances en double + médicaments habituels (pharmacies peu accessibles)",
    ]},
    { cat:"📄 Documents essentiels", color:"#DC2626", items:[
      "🛂 Passeports valables 6 mois minimum après la date de retour",
      "📋 Assurance voyage avec numéro d'urgence accessible offline",
      "🎫 JR Pass physique ou QR Code — jamais dans la valise en soute",
      "📸 Screenshots offline de TOUTES les réservations (TeamLab, hôtels, vols)",
      "🏦 Numéro d'opposition carte bancaire noté séparément du portefeuille",
      "📞 Numéro ambassade de France Tokyo : +81-3-5798-6000",
    ]},
    { cat:"📱 Applications à installer avant le départ", color:"#7C3AED", items:[
      "Google Maps — télécharger cartes offline Tokyo, Kyoto, Osaka, Nara",
      "Google Translate — télécharger pack japonais pour utilisation offline",
      "Navitime Japan — meilleur pour les transports (métro + JR + bus)",
      "Hyperdia — horaires Shinkansen précis avec options JR Pass",
      "IC Card app — gestion Suica à distance",
      "Tabelog — avis restaurants japonais (avec traduction auto)",
    ]},
  ];
  const URGENCES = [
    { emoji:"🚨", titre:"Numéros d'urgence au Japon", items:[
      { label:"Police (警察)", val:"110", note:"Pour vol, accident, urgence civile" },
      { label:"Pompiers / SAMU (消防・救急)", val:"119", note:"Pour incendie, malaise, urgence médicale" },
      { label:"Numéro d'urgence étranger (English)", val:"#9110", note:"Police avec assistance anglais" },
    ]},
    { emoji:"🏥", titre:"Hôpitaux avec service anglophone", items:[
      { label:"Tokyo — St. Luke's International", val:"03-5550-7166", note:"Chuo-ku Tokyo, urgences 24h/24" },
      { label:"Tokyo — International Clinic", val:"03-3582-2646", note:"Roppongi, médecins anglophones" },
      { label:"Kyoto — Kyoto University Hospital", val:"075-751-3111", note:"Service international disponible" },
      { label:"Osaka — Osaka Red Cross Hospital", val:"06-6774-5111", note:"Tennoji-ku, urgences internationales" },
    ]},
    { emoji:"🇫🇷", titre:"Ambassade de France au Japon", items:[
      { label:"Adresse", val:"4-11-44 Minami-Azabu, Minato-ku, Tokyo", note:"Métro Hiro-o (Hibiya Line)" },
      { label:"Téléphone urgences consulaires", val:"+81-3-5798-6000", note:"24h/24 pour urgences citoyens français" },
      { label:"Email", val:"urgence.tokyo-amba@diplomatie.gouv.fr", note:"Réponse sous 24h hors urgence" },
    ]},
    { emoji:"🏯", titre:"Si vous perdez votre JR Pass", items:[
      { label:"Étape 1", val:"Déclarer immédiatement au guichet JR le plus proche (みどりの窓口)", note:"" },
      { label:"Étape 2", val:"Présenter votre Exchange Order original (le document reçu à l'achat)", note:"Garder une copie photo sur téléphone" },
      { label:"Étape 3", val:"Un JR Pass perdu ne peut généralement pas être remplacé — prévoir un budget de remplacement (env. 50 000¥)", note:"" },
    ]},
    { emoji:"🌋", titre:"Tremblement de terre — Procédure officielle", items:[
      { label:"Pendant la secousse", val:"Se protéger sous une table solide ou contre un mur intérieur. NE PAS courir dehors.", note:"" },
      { label:"Si dans un bâtiment moderne", val:"Rester à l'intérieur — les bâtiments japonais sont construits aux normes antisismiques", note:"" },
      { label:"Après la secousse", val:"Couper le gaz si possible. Éloignez-vous des fenêtres. Suivre les instructions des autorités locales.", note:"" },
      { label:"Application d'alerte", val:"Installer 'Safety tips Japan' (JNT officielle) — alertes séisme en français", note:"" },
    ]},
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
      {/* GOLDEN WEEK ALERT */}
      <div style={{ background:v("urgentBg",dark), border:`2px solid ${v("urgentBdr",dark)}`, borderRadius:"10px", padding:"0.75rem 0.9rem" }}>
        <p style={{ fontSize:"0.8rem", fontWeight:700, color:v("urgentTxt",dark), margin:"0 0 0.3rem" }}>🎌 Golden Week — 27 avril → 6 mai 2026</p>
        <p style={{ fontSize:"0.74rem", color:v("urgentTxt",dark), margin:0, lineHeight:1.5 }}>
          La plus grande semaine de vacances du Japon. Transports et sites touristiques à capacité maximale. Les Shinkansen sont complets des semaines à l'avance — réserver les sièges dès J1 au guichet JR. Les restaurants populaires affichent complet — toutes vos réservations doivent être faites avant le départ.
        </p>
      </div>
      {/* MÉTÉO CARTES */}
      <InfoCard title="🌡 Météo semaine par semaine" color="#0EA5E9" headerBg={t("#F0F9FF","#0C1F35")}>
        {METEO.map((city, ci) => (
          <div key={ci} style={{ marginBottom: ci < METEO.length-1 ? "1rem" : 0 }}>
            <p style={{ fontSize:"0.82rem", fontWeight:700, color:city.color, margin:"0 0 0.5rem" }}>{city.city}</p>
            {city.weeks.map((w, wi) => (
              <div key={wi} style={{ background:city.bg[dark?"dark":"light"], border:`1px solid ${city.border[dark?"dark":"light"]}`, borderRadius:"8px", padding:"0.6rem 0.75rem", marginBottom: wi < city.weeks.length-1 ? "0.4rem" : 0 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.4rem", flexWrap:"wrap", gap:"0.25rem" }}>
                  <span style={{ fontSize:"0.72rem", fontWeight:600, color:v("textPrimary",dark) }}>{w.label}</span>
                  <span style={{ fontSize:"1.2rem" }}>{w.icon}</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.3rem", marginBottom:"0.4rem" }}>
                  {[
                    { ico:"🌡", val:`${w.tmin}-${w.tmax}°C`, lbl:"Temp" },
                    { ico:"🌧", val:`${w.pluie}%`, lbl:"Pluie" },
                    { ico:"💧", val:`${w.humidite}%`, lbl:"Humidité" },
                    { ico:"☀️", val:w.soleil, lbl:"Soleil" },
                  ].map((s,si) => (
                    <div key={si} style={{ textAlign:"center", background:"rgba(0,0,0,0.06)", borderRadius:"6px", padding:"0.3rem 0.2rem" }}>
                      <div style={{ fontSize:"0.85rem" }}>{s.ico}</div>
                      <div style={{ fontSize:"0.68rem", fontWeight:700, color:v("textPrimary",dark) }}>{s.val}</div>
                      <div style={{ fontSize:"0.68rem", color:v("textMuted",dark) }}>{s.lbl}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize:"0.7rem", color:v("textSec",dark), margin:0, fontStyle:"italic" }}>💡 {w.note}</p>
              </div>
            ))}
          </div>
        ))}
      </InfoCard>
      {/* VALISE */}
      <InfoCard title="🧳 Que mettre dans sa valise ?" color="#7C3AED" headerBg={t("#F5F3FF","#1C0F2E")}>
        {VALISE.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: ci < VALISE.length-1 ? "0.85rem" : 0 }}>
            <p style={{ fontSize:"0.75rem", fontWeight:700, color:cat.color, margin:"0 0 0.35rem" }}>{cat.cat}</p>
            {cat.items.map((item, ii) => (
              <div key={ii} style={{ display:"flex", gap:"0.4rem", marginBottom:"0.2rem" }}>
                <p style={{ fontSize:"0.73rem", color:v("textSec",dark), margin:0, lineHeight:1.45 }}>{item}</p>
              </div>
            ))}
          </div>
        ))}
      </InfoCard>
      {/* URGENCES */}
      <InfoCard title="🚨 Imprévus & Urgences" color="#DC2626" headerBg={t("#FEF2F2","#2D0A0A")}>
        {URGENCES.map((section, si) => (
          <div key={si} style={{ marginBottom: si < URGENCES.length-1 ? "0.9rem" : 0, paddingBottom: si < URGENCES.length-1 ? "0.9rem" : 0, borderBottom: si < URGENCES.length-1 ? `1px solid ${v("borderLight",dark)}` : "none" }}>
            <p style={{ fontSize:"0.78rem", fontWeight:700, color:v("textPrimary",dark), margin:"0 0 0.4rem" }}>{section.emoji} {section.titre}</p>
            {section.items.map((item, ii) => (
              <div key={ii} style={{ marginBottom:"0.3rem" }}>
                <span style={{ fontSize:"0.72rem", fontWeight:600, color:"#DC2626" }}>{item.label} : </span>
                <span style={{ fontSize:"0.72rem", color:v("textSec",dark) }}>{item.val}</span>
                {item.note && <span style={{ fontSize:"0.68rem", color:v("textMuted",dark), display:"block", marginLeft:"0.5rem" }}>→ {item.note}</span>}
              </div>
            ))}
          </div>
        ))}
      </InfoCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// C. PHRASEBOOK
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// 🎌 CALENDRIER CULTUREL INTERACTIF
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// A. PWA — OFFLINE BANNER + INSTALL BANNER
// ═══════════════════════════════════════════════════════════════════
function OfflineBanner() {
  const dark = useDark();
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const on  = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  if (!offline) return null;
  return (
    <div style={{ background:dark?"#14301E":"#DCFCE7", padding:"0.35rem 1rem", display:"flex", alignItems:"center", gap:"0.5rem", borderBottom:`1px solid ${dark?"#166534":"#BBF7D0"}` }}>
      <span style={{ fontSize:"0.7rem" }}>🟢</span>
      <span style={{ fontSize:"0.72rem", fontWeight:600, color:dark?"#4ADE80":"#166534" }}>Mode hors-ligne — toutes les données sont disponibles</span>
    </div>
  );
}

// Detect iOS Safari running in a normal browser tab (not standalone PWA)
const isIOSSafari = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Mac") && "ontouchend" in document);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  const isStandalone = window.navigator.standalone === true ||
    (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
  return isIOS && isSafari && !isStandalone;
};

function InstallBanner() {
  const dark = useDark();
  const [prompt, setPrompt] = useState(null);
  const [showIOS, setShowIOS] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try { return !!localStorage.getItem("pwa-dismissed"); } catch { return false; }
  });

  useEffect(() => {
    // Android/Chrome path: listen for the install prompt
    const handler = e => { e.preventDefault(); setPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    // iOS path: no event, just detect
    if (isIOSSafari()) setShowIOS(true);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (dismissed) return null;
  if (!prompt && !showIOS) return null;

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem("pwa-dismissed", "1"); } catch {}
  };

  const installAndroid = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setPrompt(null);
    else dismiss();
  };

  // iOS manual tutorial
  if (showIOS && !prompt) {
    return (
      <div style={{ background:dark?"#1A2340":"#EEF2FF", padding:"0.65rem 1rem", borderBottom:`1px solid ${dark?"#2D4A7A":"#93C5FD"}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
          <span style={{ fontSize:"1rem" }}>🗾</span>
          <div style={{ flex:1, fontSize:"0.75rem", fontWeight:600, color:dark?"#93C5FD":"#1E40AF", lineHeight:1.4 }}>
            Installer l'app : touchez <span style={{
              display:"inline-flex", alignItems:"center", justifyContent:"center",
              width:"1.2rem", height:"1.2rem", borderRadius:"4px",
              background:dark?"#2D4A7A":"#BFDBFE", color:dark?"#BFDBFE":"#1E40AF",
              fontSize:"0.7rem", verticalAlign:"middle", margin:"0 2px",
            }}>⎋</span> puis <strong>« Sur l'écran d'accueil »</strong>
          </div>
          <button
            onClick={dismiss}
            aria-label="Masquer"
            data-tap="icon"
            style={{
              fontSize:"0.95rem",
              display:"flex", alignItems:"center", justifyContent:"center",
              borderRadius:"8px",
              color:v("textMuted",dark), background:"transparent",
              border:"none", cursor:"pointer", fontFamily:"inherit", flexShrink:0,
            }}
          >✕</button>
        </div>
      </div>
    );
  }

  // Android/Chrome prompt
  return (
    <div style={{ background:dark?"#1A2340":"#EEF2FF", padding:"0.5rem 1rem", display:"flex", alignItems:"center", gap:"0.5rem", borderBottom:`1px solid ${dark?"#2D4A7A":"#93C5FD"}`, flexWrap:"wrap" }}>
      <span style={{ fontSize:"0.9rem" }}>🗾</span>
      <span style={{ fontSize:"0.75rem", fontWeight:600, color:dark?"#93C5FD":"#1E40AF", flex:1 }}>Installer l'app pour l'utiliser hors-ligne</span>
      <button
        onClick={installAndroid}
        data-tap="action"
        style={{
          fontSize:"0.82rem", fontWeight:700, color:"white",
          background:"#1D4ED8", border:"none", borderRadius:"8px",
          cursor:"pointer", fontFamily:"inherit",
        }}
      >Installer</button>
      <button
        onClick={dismiss}
        data-tap="action"
        style={{
          fontSize:"0.78rem", color:v("textMuted",dark),
          background:"transparent", border:"none", cursor:"pointer",
          fontFamily:"inherit",
        }}
      >Plus tard</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 🚨 EMERGENCY FAB — One-tap emergency access (F4 + C10)
// ═══════════════════════════════════════════════════════════════════
// Floating red button bottom-right → opens full-screen emergency sheet with:
// - JP emergency numbers (110 police, 119 ambulance/fire)
// - French consulate contacts
// - English-friendly hospitals per city
// - Critical phrases in JP with speech synthesis
// - User-editable personal info (hotel du jour, allergies, blood type, emergency contact)
//   persisted in localStorage
// ═══════════════════════════════════════════════════════════════════
const EMERGENCY_NUMBERS = [
  { label:"🚓 Police", tel:"110", note:"Gratuit, 24h/24. Disponibilité anglophone limitée — parler lentement." },
  { label:"🚑 Ambulance / Pompiers", tel:"119", note:"Gratuit, 24h/24. Dire 'kyukyu desu' (urgence médicale) ou 'kaji desu' (incendie)." },
  { label:"📞 Info tourisme 24/7 JNTO", tel:"+81-50-3816-2787", note:"Hotline anglophone officielle. Aide générale aux voyageurs, orientation urgences." },
];

const EMERGENCY_CONSULATES = [
  { label:"🇫🇷 Ambassade France — Tokyo", tel:"+81-3-5798-6000", addr:"4-11-44 Minami-Azabu, Minato-ku, Tokyo 106-8514", note:"Standard 24h/24 en cas d'urgence consulaire (perte passeport, arrestation, accident grave)." },
  { label:"🇫🇷 Consulat France — Kyoto (honoraire)", tel:"+81-75-761-4471", addr:"Via l'Institut français, 8 Izumidono-cho, Yoshida, Sakyo-ku, Kyoto", note:"Consulat honoraire — pour démarches non urgentes, rediriger sur Tokyo pour urgences réelles." },
  { label:"🇫🇷 Consulat général — Osaka-Kobe", tel:"+81-6-4790-1500", addr:"Crystal Tower 10F, 1-2-27 Shiromi, Chuo-ku, Osaka 540-6010", note:"Compétent pour la région Kansai. Permanence urgences 24h/24." },
];

const EMERGENCY_HOSPITALS = [
  { city:"Tokyo", name:"St. Luke's International Hospital 聖路加国際病院", tel:"+81-3-3541-5151", addr:"9-1 Akashi-cho, Chuo-ku, Tokyo", note:"Anglophone. Service urgences 24h/24. Le plus réputé pour les étrangers." },
  { city:"Tokyo", name:"Tokyo Medical & Surgical Clinic", tel:"+81-3-3436-3028", addr:"32 Shiba Koen Bldg 2F, 3-4-30 Shiba Koen, Minato-ku", note:"Clinique privée entièrement anglophone. Horaires bureau — pas d'urgences nocturnes." },
  { city:"Kyoto", name:"Kyoto University Hospital 京都大学医学部附属病院", tel:"+81-75-751-3111", addr:"54 Kawahara-cho, Shogoin, Sakyo-ku, Kyoto", note:"Grand hôpital universitaire. Services d'urgence disponibles, desk anglophone limité." },
  { city:"Kyoto", name:"Japan Baptist Hospital 日本バプテスト病院", tel:"+81-75-781-5194", addr:"47 Yamanomoto-cho, Kitashirakawa, Sakyo-ku, Kyoto", note:"Hôpital fondé par des missionnaires — personnel anglophone, réputation solide." },
  { city:"Osaka", name:"Osaka University Hospital 大阪大学医学部附属病院", tel:"+81-6-6879-5111", addr:"2-15 Yamadaoka, Suita, Osaka", note:"CHU principal de la région Kansai. Services d'urgence 24h/24." },
  { city:"Osaka", name:"Sumitomo Hospital 住友病院", tel:"+81-6-6443-1261", addr:"5-3-20 Nakanoshima, Kita-ku, Osaka", note:"Central Osaka, personnel partiellement anglophone." },
];

const EMERGENCY_PHRASES = [
  { fr:"Au secours !", jp:"助けてください！", rom:"Tasukete kudasai!" },
  { fr:"Appelez une ambulance !", jp:"救急車を呼んでください！", rom:"Kyūkyūsha wo yonde kudasai!" },
  { fr:"Appelez la police !", jp:"警察を呼んでください！", rom:"Keisatsu wo yonde kudasai!" },
  { fr:"J'ai besoin d'un médecin", jp:"医者が必要です", rom:"Isha ga hitsuyō desu" },
  { fr:"Je me sens très mal", jp:"気分がとても悪いです", rom:"Kibun ga totemo warui desu" },
  { fr:"J'ai une allergie grave", jp:"重いアレルギーがあります", rom:"Omoi arerugī ga arimasu" },
  { fr:"Parlez-vous anglais ?", jp:"英語を話せますか？", rom:"Eigo wo hanasemasu ka?" },
  { fr:"Mon passeport a été volé", jp:"パスポートが盗まれました", rom:"Pasupōto ga nusumaremashita" },
  { fr:"Je suis perdu(e)", jp:"道に迷いました", rom:"Michi ni mayoimashita" },
  { fr:"Pouvez-vous appeler ce numéro ?", jp:"この番号に電話してもらえますか？", rom:"Kono bangō ni denwa shite moraemasu ka?" },
];

// Speech synthesis helper — speaks Japanese text if a JP voice is available.
// Returns true on success.
const speakJapanese = (text) => {
  try {
    if (!("speechSynthesis" in window)) return false;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ja-JP";
    utter.rate = 0.85;
    utter.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const jpVoice = voices.find(v => v.lang === "ja-JP" || v.lang.startsWith("ja"));
    if (jpVoice) utter.voice = jpVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return true;
  } catch { return false; }
};

function EmergencyFAB() {
  const dark = useDark();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  // User-editable personal info persisted in localStorage
  const [personal, setPersonal] = useState(() => {
    try {
      const saved = localStorage.getItem("japan-emergency-personal");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      hotelName: "Asakusa Tobu Hotel",
      hotelAddressJP: "〒111-0032 東京都台東区雷門1-1-13",
      hotelAddressFR: "1-1-13 Kaminarimon, Taito-ku, Tokyo 111-0032",
      allergies: "",
      bloodType: "",
      emergencyContactName: "",
      emergencyContactTel: "",
      insuranceName: "",
      insuranceNumber: "",
    };
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("japan-emergency-personal", JSON.stringify(personal)); } catch {}
  }, [personal]);

  // Prime voice list on mount (some browsers need this trigger)
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const copyText = (text, key) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(key);
      if (navigator.vibrate) navigator.vibrate(10);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const updatePersonal = (field, val) => setPersonal(p => ({ ...p, [field]: val }));

  const telLink = (tel) => `tel:${tel.replace(/[^+0-9]/g, "")}`;

  const inputStyle = {
    width:"100%", padding:"0.4rem 0.55rem", borderRadius:"6px",
    border:`1px solid ${v("borderLight",dark)}`, background:v("cardBg2",dark),
    color:v("textPrimary",dark), fontSize:"0.78rem", fontFamily:"inherit",
    boxSizing:"border-box", outline:"none",
  };
  const labelStyle = {
    fontSize:"0.7rem", color:v("textMuted",dark), fontWeight:600,
    display:"block", marginBottom:"0.2rem", letterSpacing:"0.03em",
    textTransform:"uppercase",
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le mode urgence"
        className="no-print safe-fab-bottom"
        style={{
          position:"fixed", right:"1.1rem", zIndex:900,
          width:"3.5rem", height:"3.5rem", borderRadius:"50%",
          background:"linear-gradient(135deg,#DC2626 0%,#991B1B 100%)",
          border:"none", cursor:"pointer",
          boxShadow:"0 4px 14px rgba(220,38,38,0.5), 0 2px 6px rgba(0,0,0,0.2)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"1.5rem", color:"white", fontFamily:"inherit",
          transition:"transform 0.15s",
        }}
        onTouchStart={e => { e.currentTarget.style.transform = "scale(0.92)"; }}
        onTouchEnd={e => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        🚨
      </button>

      {/* FULL-SCREEN MODAL */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Informations d'urgence"
          style={{
            position:"fixed", inset:0, zIndex:1000,
            background:"rgba(0,0,0,0.75)",
            display:"flex", flexDirection:"column",
            overflowY:"auto", WebkitOverflowScrolling:"touch",
          }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="min-h-screen" style={{
            maxWidth:"640px", margin:"0 auto", width:"100%",
            background:v("pageBg",dark),
            display:"flex", flexDirection:"column",
          }}>
            {/* HEADER */}
            <div style={{
              background:"linear-gradient(135deg,#DC2626 0%,#991B1B 100%)",
              padding:"1rem 1.1rem",
              display:"flex", alignItems:"center", gap:"0.75rem",
              position:"sticky", top:0, zIndex:10,
              boxShadow:"0 2px 8px rgba(0,0,0,0.3)",
            }}>
              <span style={{ fontSize:"1.6rem" }}>🚨</span>
              <div style={{ flex:1 }}>
                <h2 style={{ fontSize:"1.1rem", fontWeight:700, color:"white", margin:0 }}>Mode urgence</h2>
                <p style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.85)", margin:"0.1rem 0 0" }}>Numéros, hôpitaux, phrases vitales</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                style={{
                  background:"rgba(255,255,255,0.15)", border:"none",
                  width:"2.4rem", height:"2.4rem", borderRadius:"50%",
                  color:"white", fontSize:"1rem", cursor:"pointer",
                  fontFamily:"inherit",
                }}
              >✕</button>
            </div>

            {/* CONTENT */}
            <div style={{ padding:"0.875rem", display:"flex", flexDirection:"column", gap:"0.875rem" }}>

              {/* NUMBERS — biggest, top */}
              <div style={{ background:v("cardBg",dark), borderRadius:"12px", border:`2px solid #DC2626`, overflow:"hidden" }}>
                <div style={{ padding:"0.65rem 0.875rem", background:dark?"#2D0A0A":"#FEE2E2", borderBottom:`1px solid ${dark?"#7F1D1D":"#FECACA"}` }}>
                  <p style={{ fontSize:"0.78rem", fontWeight:700, color:dark?"#F87171":"#991B1B", margin:0 }}>📞 Numéros d'urgence (Japon)</p>
                </div>
                {EMERGENCY_NUMBERS.map((n, i) => (
                  <a
                    key={i}
                    href={telLink(n.tel)}
                    style={{
                      display:"block", padding:"0.875rem",
                      borderBottom: i < EMERGENCY_NUMBERS.length - 1 ? `1px solid ${v("borderLight",dark)}` : "none",
                      textDecoration:"none", color:v("textPrimary",dark),
                    }}
                  >
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.5rem", marginBottom:"0.15rem" }}>
                      <span style={{ fontSize:"0.88rem", fontWeight:700, color:v("textPrimary",dark) }}>{n.label}</span>
                      <span style={{ fontSize:"1.25rem", fontWeight:800, color:"#DC2626" }}>{n.tel}</span>
                    </div>
                    <p style={{ fontSize:"0.68rem", color:v("textSec",dark), margin:0, lineHeight:1.4 }}>{n.note}</p>
                  </a>
                ))}
              </div>

              {/* PERSONAL INFO CARD — to show to staff / paramedics */}
              <div style={{ background:v("cardBg",dark), borderRadius:"12px", border:`1px solid ${v("border",dark)}`, overflow:"hidden" }}>
                <div style={{ padding:"0.65rem 0.875rem", background:v("sectionBg",dark), borderBottom:`1px solid ${v("borderLight",dark)}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <p style={{ fontSize:"0.78rem", fontWeight:700, color:v("textPrimary",dark), margin:0 }}>🆔 Mes infos (à montrer)</p>
                  <button
                    onClick={() => setEditing(e => !e)}
                    style={{ fontSize:"0.7rem", color:"#0369A1", background:"transparent", border:`1px solid #0369A1`, borderRadius:"6px", padding:"0.2rem 0.55rem", cursor:"pointer", fontFamily:"inherit" }}
                  >{editing ? "✓ Enregistrer" : "✏️ Modifier"}</button>
                </div>
                <div style={{ padding:"0.875rem", display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                  {editing ? (
                    <>
                      <div>
                        <label style={labelStyle}>Hôtel actuel — nom</label>
                        <input style={inputStyle} value={personal.hotelName} onChange={e=>updatePersonal("hotelName",e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Adresse hôtel (japonais) — à montrer au taxi</label>
                        <input style={inputStyle} value={personal.hotelAddressJP} onChange={e=>updatePersonal("hotelAddressJP",e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Adresse hôtel (latin)</label>
                        <input style={inputStyle} value={personal.hotelAddressFR} onChange={e=>updatePersonal("hotelAddressFR",e.target.value)} />
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:"0.5rem" }}>
                        <div>
                          <label style={labelStyle}>Allergies / conditions</label>
                          <input style={inputStyle} value={personal.allergies} onChange={e=>updatePersonal("allergies",e.target.value)} placeholder="ex : arachides, pénicilline"/>
                        </div>
                        <div>
                          <label style={labelStyle}>Groupe sang.</label>
                          <input style={inputStyle} value={personal.bloodType} onChange={e=>updatePersonal("bloodType",e.target.value)} placeholder="O+"/>
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Contact d'urgence — nom</label>
                        <input style={inputStyle} value={personal.emergencyContactName} onChange={e=>updatePersonal("emergencyContactName",e.target.value)} placeholder="ex : Maman"/>
                      </div>
                      <div>
                        <label style={labelStyle}>Contact d'urgence — téléphone</label>
                        <input style={inputStyle} type="tel" value={personal.emergencyContactTel} onChange={e=>updatePersonal("emergencyContactTel",e.target.value)} placeholder="+33 6 ..."/>
                      </div>
                      <div>
                        <label style={labelStyle}>Assurance voyage — nom</label>
                        <input style={inputStyle} value={personal.insuranceName} onChange={e=>updatePersonal("insuranceName",e.target.value)} />
                      </div>
                      <div>
                        <label style={labelStyle}>Assurance — n° de contrat / urgence</label>
                        <input style={inputStyle} value={personal.insuranceNumber} onChange={e=>updatePersonal("insuranceNumber",e.target.value)} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p style={{ fontSize:"0.7rem", color:v("textMuted",dark), margin:0, textTransform:"uppercase", letterSpacing:"0.04em", fontWeight:600 }}>Hôtel</p>
                        <p style={{ fontSize:"0.88rem", fontWeight:700, color:v("textPrimary",dark), margin:"0.1rem 0 0.1rem" }}>{personal.hotelName}</p>
                        <p style={{ fontSize:"1rem", fontWeight:600, color:v("textPrimary",dark), margin:"0.2rem 0", lineHeight:1.35 }}>{personal.hotelAddressJP}</p>
                        <p style={{ fontSize:"0.72rem", color:v("textSec",dark), margin:"0.1rem 0 0" }}>{personal.hotelAddressFR}</p>
                        <button
                          onClick={() => copyText(personal.hotelAddressJP, "hotel-jp")}
                          style={{ marginTop:"0.4rem", fontSize:"0.7rem", color:copied==="hotel-jp"?"#10B981":"#0369A1", background:"transparent", border:`1px solid ${copied==="hotel-jp"?"#10B981":"#0369A1"}`, borderRadius:"6px", padding:"0.25rem 0.55rem", cursor:"pointer", fontFamily:"inherit" }}
                        >{copied==="hotel-jp" ? "✓ Copié" : "📋 Copier adresse JP"}</button>
                      </div>
                      {(personal.allergies || personal.bloodType) && (
                        <div style={{ paddingTop:"0.5rem", borderTop:`1px solid ${v("borderLight",dark)}` }}>
                          {personal.allergies && (
                            <p style={{ fontSize:"0.78rem", margin:"0 0 0.25rem", color:v("textPrimary",dark) }}>
                              <span style={{ fontWeight:700, color:"#DC2626" }}>⚠️ Allergies :</span> {personal.allergies}
                            </p>
                          )}
                          {personal.bloodType && (
                            <p style={{ fontSize:"0.78rem", margin:0, color:v("textPrimary",dark) }}>
                              <span style={{ fontWeight:700 }}>🩸 Groupe :</span> {personal.bloodType}
                            </p>
                          )}
                        </div>
                      )}
                      {personal.emergencyContactName && (
                        <div style={{ paddingTop:"0.5rem", borderTop:`1px solid ${v("borderLight",dark)}` }}>
                          <p style={{ fontSize:"0.7rem", color:v("textMuted",dark), margin:0, textTransform:"uppercase", letterSpacing:"0.04em", fontWeight:600 }}>Contact d'urgence</p>
                          <p style={{ fontSize:"0.82rem", fontWeight:600, color:v("textPrimary",dark), margin:"0.1rem 0 0" }}>{personal.emergencyContactName}</p>
                          {personal.emergencyContactTel && (
                            <a href={telLink(personal.emergencyContactTel)} style={{ fontSize:"0.88rem", fontWeight:700, color:"#0369A1", textDecoration:"none" }}>{personal.emergencyContactTel}</a>
                          )}
                        </div>
                      )}
                      {personal.insuranceName && (
                        <div style={{ paddingTop:"0.5rem", borderTop:`1px solid ${v("borderLight",dark)}` }}>
                          <p style={{ fontSize:"0.7rem", color:v("textMuted",dark), margin:0, textTransform:"uppercase", letterSpacing:"0.04em", fontWeight:600 }}>Assurance</p>
                          <p style={{ fontSize:"0.78rem", fontWeight:600, color:v("textPrimary",dark), margin:"0.1rem 0 0" }}>{personal.insuranceName}</p>
                          {personal.insuranceNumber && <p style={{ fontSize:"0.72rem", color:v("textSec",dark), margin:"0.1rem 0 0" }}>{personal.insuranceNumber}</p>}
                        </div>
                      )}
                      {!personal.allergies && !personal.bloodType && !personal.emergencyContactName && !personal.insuranceName && (
                        <p style={{ fontSize:"0.72rem", color:v("textMuted",dark), margin:0, fontStyle:"italic" }}>💡 Cliquez sur Modifier pour ajouter vos allergies, groupe sanguin, contact d'urgence et assurance voyage.</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* CRITICAL PHRASES with audio */}
              <div style={{ background:v("cardBg",dark), borderRadius:"12px", border:`1px solid ${v("border",dark)}`, overflow:"hidden" }}>
                <div style={{ padding:"0.65rem 0.875rem", background:v("sectionBg",dark), borderBottom:`1px solid ${v("borderLight",dark)}` }}>
                  <p style={{ fontSize:"0.78rem", fontWeight:700, color:v("textPrimary",dark), margin:0 }}>🗣 Phrases vitales</p>
                  <p style={{ fontSize:"0.7rem", color:v("textMuted",dark), margin:"0.15rem 0 0" }}>Appuyer sur 🔊 pour que votre téléphone les prononce en japonais</p>
                </div>
                {EMERGENCY_PHRASES.map((p, i) => (
                  <div key={i} style={{ padding:"0.7rem 0.875rem", borderBottom: i < EMERGENCY_PHRASES.length - 1 ? `1px solid ${v("borderLight",dark)}` : "none" }}>
                    <p style={{ fontSize:"0.72rem", color:v("textSec",dark), margin:"0 0 0.2rem" }}>{p.fr}</p>
                    <p style={{ fontSize:"0.92rem", fontWeight:700, color:v("textPrimary",dark), margin:"0 0 0.15rem" }}>{p.jp}</p>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"0.5rem" }}>
                      <p style={{ fontSize:"0.7rem", color:v("textMuted",dark), fontStyle:"italic", margin:0 }}>{p.rom}</p>
                      <div style={{ display:"flex", gap:"0.35rem" }}>
                        <button
                          onClick={() => speakJapanese(p.jp)}
                          aria-label={`Prononcer ${p.fr}`}
                          style={{ fontSize:"0.7rem", padding:"0.28rem 0.55rem", borderRadius:"6px", border:`1px solid #0369A1`, background:"transparent", color:"#0369A1", cursor:"pointer", fontFamily:"inherit" }}
                        >🔊 Lire</button>
                        <button
                          onClick={() => copyText(p.jp, `phrase-${i}`)}
                          style={{ fontSize:"0.7rem", padding:"0.28rem 0.55rem", borderRadius:"6px", border:`1px solid ${copied===`phrase-${i}`?"#10B981":v("borderLight",dark)}`, background:"transparent", color:copied===`phrase-${i}`?"#10B981":v("textMuted",dark), cursor:"pointer", fontFamily:"inherit" }}
                        >{copied===`phrase-${i}` ? "✓" : "📋"}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CONSULATES */}
              <div style={{ background:v("cardBg",dark), borderRadius:"12px", border:`1px solid ${v("border",dark)}`, overflow:"hidden" }}>
                <div style={{ padding:"0.65rem 0.875rem", background:v("sectionBg",dark), borderBottom:`1px solid ${v("borderLight",dark)}` }}>
                  <p style={{ fontSize:"0.78rem", fontWeight:700, color:v("textPrimary",dark), margin:0 }}>🇫🇷 Représentations françaises</p>
                </div>
                {EMERGENCY_CONSULATES.map((c, i) => (
                  <div key={i} style={{ padding:"0.8rem 0.875rem", borderBottom: i < EMERGENCY_CONSULATES.length - 1 ? `1px solid ${v("borderLight",dark)}` : "none" }}>
                    <p style={{ fontSize:"0.8rem", fontWeight:700, color:v("textPrimary",dark), margin:"0 0 0.2rem" }}>{c.label}</p>
                    <a href={telLink(c.tel)} style={{ fontSize:"0.92rem", fontWeight:700, color:"#0369A1", textDecoration:"none", display:"block", marginBottom:"0.15rem" }}>📞 {c.tel}</a>
                    <p style={{ fontSize:"0.7rem", color:v("textSec",dark), margin:"0 0 0.25rem", lineHeight:1.4 }}>{c.addr}</p>
                    <p style={{ fontSize:"0.68rem", color:v("textMuted",dark), margin:0, lineHeight:1.4, fontStyle:"italic" }}>{c.note}</p>
                  </div>
                ))}
              </div>

              {/* HOSPITALS */}
              <div style={{ background:v("cardBg",dark), borderRadius:"12px", border:`1px solid ${v("border",dark)}`, overflow:"hidden" }}>
                <div style={{ padding:"0.65rem 0.875rem", background:v("sectionBg",dark), borderBottom:`1px solid ${v("borderLight",dark)}` }}>
                  <p style={{ fontSize:"0.78rem", fontWeight:700, color:v("textPrimary",dark), margin:0 }}>🏥 Hôpitaux english-friendly</p>
                </div>
                {["Tokyo","Kyoto","Osaka"].map((city) => (
                  <div key={city} style={{ borderBottom:`1px solid ${v("borderLight",dark)}` }}>
                    <p style={{ fontSize:"0.7rem", fontWeight:700, color:v("textMuted",dark), margin:0, padding:"0.5rem 0.875rem 0.25rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>{city}</p>
                    {EMERGENCY_HOSPITALS.filter(h => h.city === city).map((h, i) => (
                      <div key={i} style={{ padding:"0.5rem 0.875rem 0.75rem" }}>
                        <p style={{ fontSize:"0.78rem", fontWeight:600, color:v("textPrimary",dark), margin:"0 0 0.15rem" }}>{h.name}</p>
                        <a href={telLink(h.tel)} style={{ fontSize:"0.85rem", fontWeight:700, color:"#0369A1", textDecoration:"none", display:"block", marginBottom:"0.1rem" }}>📞 {h.tel}</a>
                        <p style={{ fontSize:"0.68rem", color:v("textSec",dark), margin:"0 0 0.2rem", lineHeight:1.4 }}>{h.addr}</p>
                        <p style={{ fontSize:"0.7rem", color:v("textMuted",dark), margin:0, lineHeight:1.35, fontStyle:"italic" }}>{h.note}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <p style={{ fontSize:"0.7rem", color:v("textMuted",dark), textAlign:"center", margin:"0.5rem 0 1rem", lineHeight:1.4 }}>
                💾 Vos infos personnelles sont enregistrées uniquement sur cet appareil.<br/>
                Elles ne sont jamais envoyées sur internet.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 📊 TRIP PROGRESS BAR (U1) — Top of header
// 15 segments coloured by city, current day pulses, taps jump to that day
// ═══════════════════════════════════════════════════════════════════
function TripProgressBar({ currentDayN, inTrip, afterTrip, onJump }) {
  // Build sorted list of all 15 days
  const sortedDays = [...DAYS].sort((a, b) => a.n - b.n);
  return (
    <div style={{ marginTop:"1rem" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.35rem" }}>
        <span style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.6)", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" }}>Progression du voyage</span>
        <span style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.6)", fontWeight:600 }}>
          {afterTrip ? "✓ Terminé" : inTrip && currentDayN ? `J${currentDayN} / 15` : "J0 / 15"}
        </span>
      </div>
      <div style={{ display:"flex", gap:"3px" }}>
        {sortedDays.map(d => {
          const cc = CITY[d.city] || CITY.transit;
          const isCurrent = inTrip && currentDayN === d.n;
          const isPast = (afterTrip) || (inTrip && currentDayN && d.n < currentDayN);
          return (
            <button
              key={d.n}
              onClick={() => onJump(d.n)}
              aria-label={`Aller au jour ${d.n} : ${d.title}`}
              title={`J${d.nLabel || d.n} · ${d.date} — ${d.title}`}
              style={{
                flex:1,
                height: isCurrent ? "10px" : "6px",
                background: isCurrent ? cc.color : isPast ? cc.color : "rgba(255,255,255,0.25)",
                opacity: isCurrent ? 1 : isPast ? 0.85 : 1,
                border:"none",
                borderRadius:"3px",
                cursor:"pointer",
                padding:0,
                transition:"all 0.2s",
                boxShadow: isCurrent ? `0 0 0 2px rgba(255,255,255,0.5), 0 0 8px ${cc.color}` : "none",
              }}
            />
          );
        })}
      </div>
      {/* City labels under */}
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.25rem", fontSize:"0.68rem", color:"rgba(255,255,255,0.55)", fontWeight:600, letterSpacing:"0.04em" }}>
        <span>🗼 Tokyo</span>
        <span>⛩ Kyoto</span>
        <span>🎡 Osaka</span>
        <span>✈️</span>
      </div>
    </div>
  );
}


function CalendrierSection() {
  const dark = useDark();
  const { goTo } = useNav();
  const [filter, setFilter] = useState("all"); // all | ferie | festival | pratique | foule

  // Impact colors
  const IMPACT = {
    critique: { label:"🔴 Impact critique",  bg:t("#FEE2E2","#2D0A0A"), color:t("#991B1B","#F87171"), dot:"#EF4444" },
    fort:     { label:"🟠 Impact fort",      bg:t("#FFF7ED","#1C1000"), color:t("#C2410C","#FB923C"), dot:"#F97316" },
    modere:   { label:"🟡 Impact modéré",    bg:t("#FEF9C3","#1C1400"), color:t("#854D0E","#FCD34D"), dot:"#EAB308" },
    faible:   { label:"🟢 Faible impact",    bg:t("#DCFCE7","#14301E"), color:t("#166534","#4ADE80"), dot:"#22C55E" },
    positif:  { label:"✨ Opportunité",      bg:t("#F5F3FF","#1C0F2E"), color:t("#6D28D9","#C4B5FD"), dot:"#8B5CF6" },
  };

  const TYPE_COLOR = {
    ferie:    "#DC2626",
    festival: "#7C3AED",
    pratique: "#0369A1",
    foule:    "#B45309",
  };

  // Timeline events — each with date, title, type, impact, description, tips[], dayN, tabId
  const EVENTS = [
    // ── AVANT LE VOYAGE ──
    {
      date: "27 avr", jour: "Lun", label: "Arrivée à Tokyo",
      type: "pratique", impact: "faible", emoji: "✈️",
      titre: "Arrivée Haneda — Dimanche soir",
      desc: "Haneda est moins bondé le lundi matin. Les files d'immigration sont plus fluides qu'en fin de semaine. Premier contact avec le Japon.",
      tips: ["Retirer du cash immédiatement à l'ATM Japan Post du terminal", "Acheter la Suica avant de sortir du terminal"],
      dayN: 1, tabId: "tokyo",
    },
    {
      date: "28 avr", jour: "Mar", label: "Veille Golden Week",
      type: "foule", impact: "fort", emoji: "⚠️",
      titre: "J-2 avant Golden Week — Agitation qui monte",
      desc: "Les Japonais commencent à se déplacer. Les trains sont déjà chargés en soirée. Les restaurants populaires de Tokyo affichent complet dès 18h.",
      tips: ["Réserver le dîner à l'avance ce soir", "Éviter les déplacements en Shinkansen après 17h"],
      dayN: 2, tabId: "tokyo",
    },
    {
      date: "29 avr", jour: "Mer", label: "Showa Day 昭和の日",
      type: "ferie", impact: "modere", emoji: "🎌",
      titre: "Showa Day — 1er jour férié Golden Week",
      desc: "Commémore l'Empereur Showa (Hirohito, 1926-1989). Premier jour officiel de la Golden Week. Les musées et jardins ouvrent mais sont chargés dès 10h. Les sites moins connus comme Nikko restent plus calmes que Tokyo.",
      tips: ["Nikko (J3) est un excellent choix ce jour : accessible et moins bondé que les attractions tokyoïtes", "Éviter Ueno Park et Shinjuku Gyoen qui sont pris d'assaut par les familles"],
      dayN: 3, tabId: "tokyo",
    },
    {
      date: "30 avr", jour: "Jeu", label: "Veille 1er mai",
      type: "foule", impact: "fort", emoji: "🌊",
      titre: "Pic de déplacement inter-cités",
      desc: "Journée de déplacement massif — des millions de Japonais quittent Tokyo vers les régions. Gares bondées en après-midi. Harajuku et Shibuya sont les zones les plus chargées de la journée.",
      tips: ["TeamLab à 15h : prévoir 20 min supplémentaires pour les transports", "Shibuya Sky 18h30 : arriver 15 min en avance pour les files de sécurité", "Akihabara est paradoxalement plus calme que les jours précédents"],
      dayN: 4, tabId: "tokyo",
    },
    {
      date: "1 mai", jour: "Ven", label: "Fête du Travail",
      type: "ferie", impact: "modere", emoji: "⚒️",
      titre: "Fête du Travail — Pas fériée au Japon",
      desc: "Contrairement à la France, le 1er mai n'est PAS un jour férié officiel au Japon. La vie continue normalement. Cependant, c'est encore la Golden Week — les transports restent chargés. Bonne journée pour les jardins (Kyu-Furukawa est calme).",
      tips: ["Kyu-Furukawa : roseraie en pleine floraison fin avril-début mai", "DAWN Robot Café : réservation obligatoire, très demandé en Golden Week"],
      dayN: 5, tabId: "tokyo",
    },
    {
      date: "2 mai", jour: "Sam", label: "Week-end Golden Week",
      type: "foule", impact: "fort", emoji: "🏔",
      titre: "Samedi Golden Week — Hakone & excursions",
      desc: "Le samedi central de la Golden Week. Les excursions populaires (Hakone, Nikko, Kamakura) sont prises d'assaut. Hakone peut être très fréquenté mais reste praticable en partant tôt.",
      tips: ["Partir de Tokyo avant 8h pour Hakone", "Le ropeway Owakudani peut avoir des files de 30-45 min — prévoir", "Daikoku PA le soir : samedi = encore très bon créneau JDM"],
      dayN: 6, tabId: "tokyo",
    },
    {
      date: "3 mai", jour: "Dim", label: "Jour de la Constitution 憲法記念日",
      type: "ferie", impact: "critique", emoji: "🚨",
      titre: "Constitution Day — Shinkansen les plus bondés de l'année",
      desc: "Jour férié commémorant la Constitution de 1947. Combiné au dimanche, c'est LE jour le plus chargé pour les Shinkansen de toute l'année. Les trains Tokyo→Kyoto sont complets des semaines à l'avance.",
      tips: ["Sièges OBLIGATOIREMENT réservés à l'avance — impossibles sans réservation", "Partir avant 11h pour éviter le pic 11h-16h", "Prévoir un bento Tokyo Station — les files de restauration sont longues"],
      dayN: 7, tabId: "tokyo",
    },
    {
      date: "4 mai", jour: "Lun", label: "Jour Vert 緑の日",
      type: "ferie", impact: "critique", emoji: "🌿",
      titre: "Midori no Hi — Arashiyama au pic absolu",
      desc: "Jour férié dédié à la nature. Arashiyama est litteralement inaccessible en voiture et bondé à partir de 9h. La forêt de bambous peut accueillir jusqu'à 30 000 visiteurs par jour.",
      tips: ["Départ bus 5h45-6h10 OBLIGATOIRE pour être dans la forêt avant 7h", "Après 9h : la magie disparaît totalement", "Tenryu-ji : arriver dès l'ouverture (8h30) avant les bus de tourisme"],
      dayN: 8, tabId: "kyoto",
    },
    {
      date: "5 mai", jour: "Mar", label: "Kodomo no Hi 子供の日",
      type: "ferie", impact: "fort", emoji: "🎏",
      titre: "Fête des Enfants — Carpes Koi dans tout le Japon",
      desc: "Dernier jour férié officiel de la Golden Week. Des milliers de koinobori (banderoles carpes en tissu) flottent partout — Kyoto, les temples, les villages. Nara est particulièrement animé avec les familles et les daims. Les transports Kyoto→Osaka commencent à se charger.",
      tips: ["Les koinobori dans les rues de Kyoto sont magnifiques à photographier", "Nara : les faons de mai sont en période de naissance — voir un faon = chance", "Fushimi Inari : encore chargé mais moins que les jours précédents"],
      dayN: 9, tabId: "kyoto",
    },
    {
      date: "6 mai", jour: "Mer", label: "Fin Golden Week",
      type: "foule", impact: "modere", emoji: "📉",
      titre: "Retour progressif à la normale",
      desc: "Premier jour non-férié depuis le 28 avril. Les familles japonaises rentrent chez elles. La foule diminue rapidement, notamment à Gion et Kiyomizudera. C'est l'une des meilleures journées de la semaine pour les temples.",
      tips: ["Kiyomizudera à 6h30 : quasi désert malgré la fin de semaine", "Les restaurants de Gion acceptent plus facilement les walk-ins", "Dernière chance de voir les koinobori encore suspendus"],
      dayN: 10, tabId: "kyoto",
    },
    {
      date: "7 mai", jour: "Jeu", label: "Transit Kyoto → Osaka",
      type: "pratique", impact: "faible", emoji: "🚄",
      titre: "Retour à la normale — Kyoto → Osaka",
      desc: "La Golden Week est terminée. Les trains sont à nouveau fluides. Dotonbori sera animé mais sans la foule extrême de la semaine précédente. C'est le Japon quotidien qui reprend.",
      tips: ["Nishiki Market ouvre à 9h — idéal pour les derniers achats avant Osaka", "Le Shinkansen Kyoto→Osaka est à nouveau disponible sans réservation"],
      dayN: 11, tabId: "kyoto",
    },
    {
      date: "8 mai", jour: "Ven", label: "USJ — Vendredi ordinaire",
      type: "pratique", impact: "modere", emoji: "🎢",
      titre: "Universal Studios Japan — Fréquentation normale",
      desc: "Hors Golden Week, USJ est nettement plus agréable. Un vendredi de mai hors vacances = files d'attente de 30-60 min pour les grandes attractions. Nintendo World peut nécessiter une Entry Pass obtenue à l'ouverture.",
      tips: ["Arriver à l'ouverture (8h30 ou 9h selon le jour) pour Nintendo World", "Entry Pass Nintendo World : se distribue dans le parc dès l'ouverture — courir direct", "Les spectacles de nuit sont particulièrement beaux en mai"],
      dayN: 12, tabId: "osaka",
    },
    {
      date: "9 mai", jour: "Sam", label: "Samedi ordinaire à Osaka",
      type: "pratique", impact: "faible", emoji: "🏯",
      titre: "Samedi hors saison — Idéal pour Osaka",
      desc: "Un samedi ordinaire à Osaka, bien différent de la Golden Week. Le Château d'Osaka sera animé mais sans excès. Umeda Sky en fin d'après-midi pour le coucher de soleil — files d'attente raisonnables.",
      tips: ["Château d'Osaka : arriver avant 10h pour les photos sans foule", "Kittan Hibiki le soir : votre réservation tombe pile au bon moment"],
      dayN: 13, tabId: "osaka",
    },
    {
      date: "10 mai", jour: "Dim", label: "Retour vers Tokyo",
      type: "pratique", impact: "faible", emoji: "🏠",
      titre: "Dimanche de retour — Shinkansen confortable",
      desc: "Un dimanche ordinaire de mai. Le Shinkansen Osaka→Tokyo est bien plus agréable qu'en Golden Week. Shi Tenno Ji le matin est calme et contemplative — l'un des temples les moins fréquentés d'Osaka malgré son importance historique.",
      tips: ["Shi Tenno Ji ouvre à 8h30 — quasi désert le dimanche matin hors Golden Week", "Gransta Mall à Tokyo Station pour le dernier ekiben avant l'hôtel Haneda"],
      dayN: 14, tabId: "osaka",
    },
    {
      date: "11 mai", jour: "Lun", label: "Départ Haneda",
      type: "pratique", impact: "faible", emoji: "✈️",
      titre: "Lundi matin — Haneda T3 Internationaux",
      desc: "Un lundi matin est idéal pour le départ. Les files d'immigration sont fluides, les boutiques duty-free sont ouvertes dès 6h. Dernier moment pour acheter du whisky Nikka à prix duty-free.",
      tips: ["Être au T3 avant 9h30 IMPÉRATIVEMENT pour un vol 11h45", "Duty-free Haneda T3 : meilleurs prix pour Nikka, Hibiki, Suntory"],
      dayN: 15, tabId: "depart",
    },
  ];

  // Festival & cultural events (overlay on timeline)
  const FESTIVALS = [
    { date:"29 avr", titre:"Koinobori suspendus", desc:"Les carpes de tissu (鯉のぼり) flottent dans tout le Japon du 29 avril au 5 mai en l'honneur des garçons. Voir les koinobori dans les rues de Kyoto et aux temples = expérience visuelle unique.", emoji:"🎏" },
    { date:"3-5 mai", titre:"Hakata Dontaku Festival", desc:"L'un des plus grands festivals du Japon à Fukuoka (hors parcours) — mais les processions festives se reflètent dans toute la culture nationale Golden Week.", emoji:"🥁" },
    { date:"4 mai", titre:"Hollyhock Festival (Aoi Matsuri) — Préparation", desc:"Le Aoi Matsuri de Kyoto a lieu le 15 mai — une semaine après votre départ. Mais fin avril-début mai, les répétitions costumées ont lieu dans Kyoto. Chance d'apercevoir des cortèges en tenue Heian.", emoji:"🌿" },
    { date:"5 mai", titre:"Mise en place Sanja Matsuri à Asakusa", desc:"Le Sanja Matsuri (Fête des trois sanctuaires) se prépare à Asakusa pour la 3e semaine de mai. Les mikoshi (palanquins sacrés) sont sortis pour inspection fin avril-début mai — les voir dans Asakusa est exceptionnel.", emoji:"⛩️" },
  ];

  const FILTERS = [
    { val:"all", label:"Tout voir" },
    { val:"ferie", label:"🎌 Jours fériés" },
    { val:"foule", label:"🌊 Impact foule" },
    { val:"festival", label:"🎏 Festivals" },
    { val:"pratique", label:"✈️ Pratique" },
  ];

  const filteredEvents = filter === "all" ? EVENTS : EVENTS.filter(e => e.type === filter);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>

      {/* INTRO */}
      <div style={{ background:v("cardBg",dark), border:`1px solid ${v("border",dark)}`, borderRadius:"12px", padding:"0.875rem 1rem" }}>
        <h2 style={{ fontSize:"1rem", fontWeight:700, color:v("textPrimary",dark), margin:"0 0 0.4rem" }}>🎌 Calendrier culturel — 27 avril → 11 mai</h2>
        <p style={{ fontSize:"0.75rem", color:v("textSec",dark), margin:"0 0 0.5rem", lineHeight:1.55 }}>
          Votre séjour chevauche la <strong style={{ color:"#DC2626" }}>Golden Week</strong> (27 avril → 6 mai), la plus grande semaine de vacances du Japon. Chaque jour a un impact différent sur la foule, les transports et les prix. Utilisez ce calendrier pour anticiper et adapter votre rythme.
        </p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}>
          {Object.entries(IMPACT).map(([k,v2]) => (
            <span key={k} style={{ fontSize:"0.7rem", fontWeight:600, padding:"0.15rem 0.5rem", borderRadius:"8px", background:v2.bg[dark?"dark":"light"], color:v2.color[dark?"dark":"light"] }}>{v2.label}</span>
          ))}
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
        {FILTERS.map(f => (
          <button key={f.val} onClick={() => setFilter(f.val)} style={{
            padding:"0.3rem 0.65rem", borderRadius:"20px", fontSize:"0.72rem", fontFamily:"inherit", cursor:"pointer",
            border:`1.5px solid ${filter===f.val?(dark?"#FBBF24":"#D97706"):(dark?"#3A3A3A":"#E5E7EB")}`,
            background: filter===f.val ? (dark?"#2D1800":"#FEF3C7") : "transparent",
            color: filter===f.val ? (dark?"#FBBF24":"#92400E") : v("textSec",dark),
            fontWeight: filter===f.val ? 700 : 400, transition:"all 0.15s",
          }}>{f.label}</button>
        ))}
      </div>

      {/* TIMELINE */}
      <div style={{ position:"relative", paddingLeft:"2.5rem" }}>
        {/* Vertical line */}
        <div style={{ position:"absolute", left:"0.9rem", top:0, bottom:0, width:"2px", background:`linear-gradient(to bottom, #DC2626, #F97316, #EAB308, #22C55E, #3B7EFF)`, borderRadius:"1px", opacity:0.4 }} />

        {filteredEvents.map((ev, i) => {
          const imp = IMPACT[ev.impact];
          const typeCol = TYPE_COLOR[ev.type] || "#374151";
          // Find matching festivals for this date
          const fests = FESTIVALS.filter(f => f.date === ev.date || (ev.date >= f.date.split("-")[0] && f.date.includes("-") && ev.date <= f.date.split("-")[1]));
          return (
            <div key={i} style={{ position:"relative", marginBottom: i < filteredEvents.length-1 ? "0.875rem" : 0 }}>
              {/* Dot */}
              <div style={{
                position:"absolute", left:"-2rem", top:"0.9rem",
                width:"0.7rem", height:"0.7rem", borderRadius:"50%",
                background: imp.dot, border:`2px solid ${dark?"#1A1A1A":"white"}`,
                boxShadow:`0 0 0 2px ${imp.dot}40`,
                zIndex:1,
              }} />
              {/* Card */}
              <div style={{ background:v("cardBg",dark), borderRadius:"10px", border:`1px solid ${v("border",dark)}`, overflow:"hidden", boxShadow:dark?"0 1px 4px rgba(0,0,0,0.3)":"0 1px 4px rgba(0,0,0,0.07)" }}>
                {/* Header */}
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.6rem 0.875rem", background:imp.bg[dark?"dark":"light"], borderBottom:`1px solid ${v("borderLight",dark)}` }}>
                  <span style={{ fontSize:"1.1rem", flexShrink:0 }}>{ev.emoji}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", flexWrap:"wrap" }}>
                      <span style={{ fontSize:"0.72rem", fontWeight:700, color:typeCol, whiteSpace:"nowrap" }}>{ev.date} — {ev.jour}</span>
                      <span style={{ fontSize:"0.7rem", fontWeight:600, padding:"0.1rem 0.4rem", borderRadius:"6px", background:imp.bg[dark?"dark":"light"], color:imp.color[dark?"dark":"light"], border:`1px solid ${imp.dot}40`, whiteSpace:"nowrap" }}>{imp.label}</span>
                    </div>
                    <p style={{ fontSize:"0.82rem", fontWeight:700, color:v("textPrimary",dark), margin:"0.1rem 0 0", lineHeight:1.3 }}>{ev.titre}</p>
                  </div>
                </div>
                {/* Body */}
                <div style={{ padding:"0.6rem 0.875rem" }}>
                  <p style={{ fontSize:"0.73rem", color:v("textSec",dark), margin:"0 0 0.5rem", lineHeight:1.5 }}>{ev.desc}</p>
                  {/* Tips */}
                  {ev.tips.length > 0 && (
                    <div style={{ background:v("tipsBg",dark), borderLeft:`3px solid ${v("tipsBdr",dark)}`, borderRadius:"0 6px 6px 0", padding:"0.4rem 0.6rem", marginBottom:"0.45rem" }}>
                      {ev.tips.map((tip, ti) => (
                        <p key={ti} style={{ fontSize:"0.7rem", color:v("tipsTxt",dark), margin: ti > 0 ? "0.25rem 0 0" : 0, lineHeight:1.4 }}>
                          💡 {tip}
                        </p>
                      ))}
                    </div>
                  )}
                  {/* Festival overlays */}
                  {fests.map((f, fi) => (
                    <div key={fi} style={{ background:v("optBg",dark), border:`1px solid ${v("optBdr",dark)}`, borderRadius:"6px", padding:"0.35rem 0.6rem", marginBottom:"0.35rem", display:"flex", gap:"0.4rem", alignItems:"flex-start" }}>
                      <span style={{ fontSize:"0.9rem", flexShrink:0 }}>{f.emoji}</span>
                      <div>
                        <p style={{ fontSize:"0.7rem", fontWeight:700, color:v("optTxt",dark), margin:"0 0 0.1rem" }}>{f.titre}</p>
                        <p style={{ fontSize:"0.72rem", color:v("optTxt",dark), margin:0, opacity:0.85, lineHeight:1.4 }}>{f.desc}</p>
                      </div>
                    </div>
                  ))}
                  {/* Link to planning */}
                  {ev.tabId && (
                    <button onClick={() => goTo(ev.tabId, ev.dayN)} style={{ fontSize:"0.68rem", color:dark?"#60A5FA":"#1D4ED8", background:"transparent", border:"none", cursor:"pointer", padding:0, fontWeight:600, textDecoration:"underline", fontFamily:"inherit" }}>
                      → Voir J{ev.dayN} dans le planning
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LÉGENDE */}
      <div style={{ background:v("cardBg",dark), border:`1px solid ${v("border",dark)}`, borderRadius:"10px", padding:"0.7rem 0.875rem" }}>
        <p style={{ fontSize:"0.68rem", fontWeight:700, color:v("textPrimary",dark), margin:"0 0 0.4rem", textTransform:"uppercase", letterSpacing:"0.06em" }}>Légende des types</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.3rem" }}>
          {Object.entries(TYPE_COLOR).map(([k, col]) => (
            <div key={k} style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
              <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:col, flexShrink:0 }} />
              <span style={{ fontSize:"0.68rem", color:v("textSec",dark), textTransform:"capitalize" }}>
                {{ ferie:"🎌 Jour férié", festival:"🎏 Festival", pratique:"✈️ Info pratique", foule:"🌊 Alerte foule" }[k]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhrasebookSection() {
  const dark = useDark();
  const [open, setOpen] = useState(new Set(["resto"]));
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState(null);
  const toggle = id => setOpen(p => { const s=new Set(p); s.has(id)?s.delete(id):s.add(id); return s; });
  const copyPhrase = (txt, idx) => {
    try { navigator.clipboard.writeText(txt); } catch {}
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };
  const DIFF = {
    "🟢":{ bg:t("#DCFCE7","#14301E"), color:t("#166534","#4ADE80") },
    "🟡":{ bg:t("#FEF9C3","#1C1400"), color:t("#854D0E","#FCD34D") },
    "🔴":{ bg:t("#FEE2E2","#2D0A0A"), color:t("#991B1B","#F87171") },
  };
  const CATS = [
    { id:"resto", emoji:"🍽", titre:"Au restaurant", color:"#DC2626", phrases:[
      { fr:"Une table pour 3 personnes s'il vous plaît", jp:"3人お願いします", rom:"Sannin onegaishimasu", diff:"🟢" },
      { fr:"Le menu en anglais, s'il vous plaît", jp:"英語のメニューはありますか？", rom:"Eigo no menyu wa arimasu ka?", diff:"🟡" },
      { fr:"Je recommande celui-ci (pointer)", jp:"これをください", rom:"Kore wo kudasai", diff:"🟢" },
      { fr:"L'addition s'il vous plaît", jp:"お会計をお願いします", rom:"Okaikei wo onegaishimasu", diff:"🟡" },
      { fr:"C'est délicieux !", jp:"おいしい！", rom:"Oishii!", diff:"🟢" },
      { fr:"Je suis allergique à [ingrédient]", jp:"[食材]アレルギーがあります", rom:"[shokuzai] arerugi ga arimasu", diff:"🔴" },
      { fr:"Sans viande / végétarien", jp:"肉なしでお願いします", rom:"Niku nashi de onegaishimasu", diff:"🟡" },
      { fr:"Pas de bière s'il vous plaît", jp:"ビールなしでお願いします", rom:"Biiru nashi de onegaishimasu", diff:"🟡" },
    ]},
    { id:"transport", emoji:"🚇", titre:"Dans les transports", color:"#0369A1", phrases:[
      { fr:"Où est le quai pour [ville] ?", jp:"[都市]行きのホームはどこですか？", rom:"[toshi]-yuki no hoomu wa doko desu ka?", diff:"🔴" },
      { fr:"Ce siège est-il libre ?", jp:"ここは空いていますか？", rom:"Koko wa aite imasu ka?", diff:"🟡" },
      { fr:"Je vais à Asakusa", jp:"浅草に行きます", rom:"Asakusa ni ikimasu", diff:"🟡" },
      { fr:"Comment aller à [lieu] ?", jp:"[場所]はどうやって行きますか？", rom:"[basho] wa dou yatte ikimasu ka?", diff:"🔴" },
      { fr:"Validez votre Suica ici (pointer)", jp:"ここでスイカをタッチしてください", rom:"Koko de Suika wo tatchi shite kudasai", diff:"🔴" },
      { fr:"À quelle heure part le prochain train ?", jp:"次の電車は何時ですか？", rom:"Tsugi no densha wa nanji desu ka?", diff:"🔴" },
    ]},
    { id:"shopping", emoji:"🛍", titre:"Shopping", color:"#7C3AED", phrases:[
      { fr:"Combien ça coûte ?", jp:"いくらですか？", rom:"Ikura desu ka?", diff:"🟢" },
      { fr:"Je regarde seulement", jp:"見ているだけです", rom:"Mite iru dake desu", diff:"🟡" },
      { fr:"Avez-vous la taille S/M/L ?", jp:"S/M/Lサイズはありますか？", rom:"S/M/L saizu wa arimasu ka?", diff:"🟡" },
      { fr:"Je paye en espèces", jp:"現金で払います", rom:"Genkin de haraimasu", diff:"🟡" },
      { fr:"Un sac s'il vous plaît", jp:"袋をください", rom:"Fukuro wo kudasai", diff:"🟢" },
      { fr:"Avez-vous quelque chose de moins cher ?", jp:"もっと安いものはありますか？", rom:"Motto yasui mono wa arimasu ka?", diff:"🔴" },
    ]},
    { id:"hotel", emoji:"🏨", titre:"À l'hôtel", color:"#065F46", phrases:[
      { fr:"J'ai une réservation au nom de...", jp:"...で予約しています", rom:"... de yoyaku shite imasu", diff:"🟡" },
      { fr:"Check-in / Check-out s'il vous plaît", jp:"チェックイン/チェックアウトお願いします", rom:"Chekku-in/Chekku-auto onegaishimasu", diff:"🟢" },
      { fr:"Des serviettes supplémentaires s'il vous plaît", jp:"タオルを追加でください", rom:"Taoru wo tsuika de kudasai", diff:"🟡" },
      { fr:"Le wifi ne fonctionne pas", jp:"ワイファイが繋がりません", rom:"Waifai ga tsunagarimasen", diff:"🟡" },
      { fr:"Pouvez-vous garder mes bagages ?", jp:"荷物を預かってもらえますか？", rom:"Nimotsu wo azukatte moraemasu ka?", diff:"🔴" },
      { fr:"La chambre est très belle, merci", jp:"部屋がとても素敵です、ありがとう", rom:"Heya ga totemo suteki desu, arigatou", diff:"🟡" },
    ]},
    { id:"urgence", emoji:"🚨", titre:"Urgences", color:"#991B1B", phrases:[
      { fr:"Au secours !", jp:"助けてください！", rom:"Tasukete kudasai!", diff:"🟢" },
      { fr:"Appelez la police !", jp:"警察を呼んでください！", rom:"Keisatsu wo yonde kudasai!", diff:"🟡" },
      { fr:"J'ai besoin d'un médecin", jp:"医者が必要です", rom:"Isha ga hitsuyou desu", diff:"🟡" },
      { fr:"Je suis perdu(e)", jp:"迷子になりました", rom:"Maigo ni narimashita", diff:"🟡" },
      { fr:"Je me sens mal", jp:"気分が悪いです", rom:"Kibun ga warui desu", diff:"🟢" },
      { fr:"Mon passeport a été volé", jp:"パスポートが盗まれました", rom:"Pasupooto ga nusumaremashita", diff:"🔴" },
    ]},
    { id:"politesse", emoji:"🙏", titre:"Politesse & Formules", color:"#B45309", phrases:[
      { fr:"Merci beaucoup", jp:"ありがとうございます", rom:"Arigatou gozaimasu", diff:"🟢" },
      { fr:"Excusez-moi / Pardon", jp:"すみません", rom:"Sumimasen", diff:"🟢" },
      { fr:"Bonjour (le matin)", jp:"おはようございます", rom:"Ohayou gozaimasu", diff:"🟢" },
      { fr:"Bonjour (la journée)", jp:"こんにちは", rom:"Konnichiwa", diff:"🟢" },
      { fr:"Bonsoir", jp:"こんばんは", rom:"Konbanwa", diff:"🟢" },
      { fr:"Bon appétit (avant de manger)", jp:"いただきます", rom:"Itadakimasu", diff:"🟡" },
      { fr:"Merci pour le repas (après)", jp:"ごちそうさまでした", rom:"Gochisousama deshita", diff:"🔴" },
      { fr:"Je ne comprends pas", jp:"わかりません", rom:"Wakarimasen", diff:"🟢" },
      { fr:"Parlez-vous anglais ?", jp:"英語を話せますか？", rom:"Eigo wo hanasemasu ka?", diff:"🟡" },
    ]},
  ];
  const filtered = q.trim()
    ? CATS.map(cat=>({...cat, phrases:cat.phrases.filter(p=>
        p.fr.toLowerCase().includes(q.toLowerCase()) ||
        p.rom.toLowerCase().includes(q.toLowerCase()) ||
        p.jp.includes(q)
      )})).filter(cat=>cat.phrases.length>0)
    : CATS;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
      <div style={{ background:v("cardBg",dark), borderRadius:"10px", padding:"0.6rem 0.75rem", border:`1px solid ${v("border",dark)}` }}>
        <p style={{ fontSize:"0.75rem", color:v("textSec",dark), margin:0, lineHeight:1.5 }}>
          🗣 <strong style={{ color:v("textPrimary",dark) }}>Mini guide de conversation</strong> — Phrases essentielles avec phonétique. Appuyez sur <strong>Copier</strong> pour montrer votre téléphone.
        </p>
      </div>
      {/* Search */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", background:v("cardBg2",dark), border:`1px solid ${v("borderLight",dark)}`, borderRadius:"8px", padding:"0.38rem 0.7rem" }}>
        <span style={{ color:v("textMuted",dark), fontSize:"0.82rem" }}>🔍</span>
        <input type="text" placeholder="Chercher une phrase..." value={q} onChange={e=>setQ(e.target.value)}
          style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:"0.78rem", color:v("textPrimary",dark), fontFamily:"inherit" }} />
        {q && <button onClick={()=>setQ("")} style={{ border:"none", background:"transparent", cursor:"pointer", color:v("textMuted",dark), fontSize:"0.8rem", padding:0 }}>✕</button>}
      </div>
      {filtered.length===0 && (
        <div style={{ textAlign:"center", padding:"2rem", color:v("textSec",dark) }}>
          <div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>🤔</div>
          <p style={{ fontSize:"0.85rem", margin:0 }}>Aucune phrase pour « {q} »</p>
        </div>
      )}
      {filtered.map(cat => {
        const isOpen = q ? true : open.has(cat.id);
        return (
          <div key={cat.id} style={{ background:v("cardBg",dark), borderRadius:"12px", overflow:"hidden", border:`1px solid ${v("border",dark)}` }}>
            <button onClick={()=>toggle(cat.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.8rem 1rem", background:"transparent", border:"none", cursor:"pointer", outline:"none" }}>
              <span style={{ fontSize:"1.3rem" }}>{cat.emoji}</span>
              <span style={{ flex:1, fontSize:"0.9rem", fontWeight:700, color:cat.color, textAlign:"left" }}>{cat.titre}</span>
              <span style={{ fontSize:"0.68rem", color:v("textMuted",dark), marginRight:"0.4rem" }}>{cat.phrases.length} phrases</span>
              <span style={{ color:v("textMuted",dark), fontSize:"0.8rem", display:"inline-block", transform:isOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}>▼</span>
            </button>
            {isOpen && (
              <div style={{ borderTop:`1px solid ${v("borderLight",dark)}` }}>
                {cat.phrases.map((p, pi) => {
                  const dc = DIFF[p.diff];
                  const isCopied = copied === `${cat.id}-${pi}`;
                  return (
                    <div key={pi} style={{ padding:"0.75rem 1rem", borderBottom: pi<cat.phrases.length-1?`1px solid ${v("borderMid",dark)}`:"none" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"0.5rem", marginBottom:"0.3rem" }}>
                        <p style={{ fontSize:"0.73rem", color:v("textSec",dark), margin:0 }}>{p.fr}</p>
                        <span style={{ fontSize:"0.68rem", fontWeight:600, padding:"0.12rem 0.4rem", borderRadius:"6px", whiteSpace:"nowrap", flexShrink:0, background:dc.bg[dark?"dark":"light"], color:dc.color[dark?"dark":"light"] }}>{p.diff}</span>
                      </div>
                      <p style={{ fontSize:"0.88rem", fontWeight:700, color:cat.color, margin:"0 0 0.2rem", letterSpacing:"0.02em" }}>{p.rom}</p>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"0.5rem" }}>
                        <p style={{ fontSize:"0.78rem", color:v("textMuted",dark), margin:0, flex:1 }}>{p.jp}</p>
                        <div style={{ display:"flex", gap:"0.3rem", flexShrink:0 }}>
                          <button
                            onClick={()=>speakJapanese(p.jp)}
                            aria-label={`Prononcer ${p.fr}`}
                            style={{ fontSize:"0.7rem", padding:"0.2rem 0.5rem", borderRadius:"6px", border:`1px solid ${cat.color}`, background:"transparent", color:cat.color, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}
                          >
                            🔊 Lire
                          </button>
                          <button onClick={()=>copyPhrase(p.jp, `${cat.id}-${pi}`)} style={{ fontSize:"0.7rem", padding:"0.2rem 0.5rem", borderRadius:"6px", border:`1px solid ${v("borderLight",dark)}`, background: isCopied ? (dark?"#14301E":"#DCFCE7") : "transparent", color: isCopied ? "#10B981" : v("textMuted",dark), cursor:"pointer", fontFamily:"inherit", transition:"all 0.2s", whiteSpace:"nowrap" }}>
                            {isCopied ? "✓ Copié" : "Copier"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
// E. PARTAGE DU PLANNING
// ═══════════════════════════════════════════════════════════════════
function ShareSection() {
  const dark = useDark();
  const { goTo } = useNav();
  const [qrVisible, setQrVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrReady, setQrReady] = useState(false);

  // Load QR library dynamically
  const loadQR = () => {
    if (window.QRCode) { setQrVisible(true); setQrReady(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = () => { setQrReady(true); setQrVisible(true); };
    s.onerror = () => alert("Impossible de charger la librairie QR Code. Vérifiez votre connexion.");
    document.head.appendChild(s);
  };

  useEffect(() => {
    if (qrVisible && qrReady && window.QRCode) {
      const el = document.getElementById("qr-canvas");
      if (el) {
        el.innerHTML = "";
        new window.QRCode(el, {
          text: window.location.href || "https://japan-itinerary.app",
          width: 180, height: 180,
          colorDark: dark ? "#F1F0EE" : "#1F2937",
          colorLight: dark ? "#1A1A1A" : "#FFFFFF",
        });
      }
    }
  }, [qrVisible, qrReady, dark]);

  const downloadQR = () => {
    const canvas = document.querySelector("#qr-canvas canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "japon-2026-qr.png";
    a.click();
  };

  const copyText = () => {
    const lines = [];
    DAYS.sort((a,b)=>a.n-b.n).forEach(day => {
      lines.push(`\n📅 ${day.date} — ${day.title}`);
      day.sections.forEach(sec => {
        const label = {matin:"☀️ Matin",aprem:"🌤 Après-midi",soir:"🌙 Soir",nuit:"🌃 Nuit"}[sec.id]||sec.id;
        sec.items.filter(it=>it.s!=="opt").forEach(it => {
          const shortT = it.t.replace(/^[🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛✅⚠️🔓ℹ️✨]\s*/u,"");
          lines.push(`  ${label.split(" ")[0]} ${shortT.slice(0,60)}`);
        });
      });
    });
    const text = lines.join("\n");
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Copie non supportée. Voici le texte :\n" + text);
    }
  };

  const printPlanning = () => window.print();

  const btnStyle = (color) => ({
    display:"flex", alignItems:"center", gap:"0.5rem",
    padding:"0.55rem 0.875rem", borderRadius:"8px",
    border:`1px solid ${color}`, background:"transparent",
    color: color, fontSize:"0.78rem", fontWeight:600,
    cursor:"pointer", fontFamily:"inherit", width:"100%",
    justifyContent:"flex-start", transition:"background 0.15s",
  });

  return (
    <InfoCard title="📤 Partager & Exporter" color="#0369A1" headerBg={t("#F0F9FF","#0C1F35")}>
      <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
        <button style={btnStyle("#0369A1")} onClick={printPlanning}>
          🖨️ <span>Télécharger en PDF</span>
          <span style={{ marginLeft:"auto", fontSize:"0.7rem", color:v("textMuted",dark) }}>Cmd+P / Ctrl+P</span>
        </button>
        <button style={btnStyle(copied?"#10B981":"#0369A1")} onClick={copyText}>
          {copied ? "✅" : "📋"} <span>{copied ? "Copié !" : "Copier le résumé texte"}</span>
        </button>
        <button style={btnStyle("#7C3AED")} onClick={loadQR}>
          📲 <span>Générer un QR Code</span>
          <span style={{ marginLeft:"auto", fontSize:"0.7rem", color:v("textMuted",dark) }}>qrcode.js</span>
        </button>
        {qrVisible && (
          <div style={{ background:v("cardBg2",dark), borderRadius:"10px", padding:"0.875rem", textAlign:"center", border:`1px solid ${v("borderLight",dark)}` }}>
            <div id="qr-canvas" style={{ display:"inline-block", padding:"0.5rem", background:"white", borderRadius:"8px" }} />
            <p style={{ fontSize:"0.7rem", color:v("textSec",dark), margin:"0.5rem 0 0.5rem" }}>Scannez pour partager l'app</p>
            <button onClick={downloadQR} style={{ fontSize:"0.72rem", color:"#7C3AED", background:"transparent", border:`1px solid #7C3AED`, borderRadius:"6px", padding:"0.25rem 0.75rem", cursor:"pointer", fontFamily:"inherit" }}>
              ⬇️ Télécharger en PNG
            </button>
          </div>
        )}
        <div style={{ marginTop:"0.25rem", padding:"0.5rem 0.65rem", background:v("sectionBg",dark), borderRadius:"6px" }}>
          <p style={{ fontSize:"0.68rem", color:v("textMuted",dark), margin:0, lineHeight:1.45 }}>
            💡 <strong>PDF :</strong> ouvre la boîte d'impression du navigateur — choisir "Enregistrer en PDF". Le style d'impression est optimisé pour A4.
          </p>
        </div>
      </div>
    </InfoCard>
  );
}

// ═══════════════════════════════════════════════════════════════════
// B. RAPPELS & NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════
function NotificationsSection() {
  const dark = useDark();
  const [permission, setPermission] = useState(() => {
    try { return Notification.permission; } catch { return "unsupported"; }
  });
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("japan-reminders") || "[]"); } catch { return []; }
  });
  const [newRem, setNewRem] = useState({ day:"27 avr", time:"09:00", text:"" });
  const [showForm, setShowForm] = useState(false);

  const saveReminders = (list) => {
    setReminders(list);
    try { localStorage.setItem("japan-reminders", JSON.stringify(list)); } catch {}
  };

  const requestPermission = async () => {
    if (!("Notification" in window)) { setPermission("unsupported"); return; }
    const p = await Notification.requestPermission();
    setPermission(p);
    if (p === "granted") {
      new Notification("🗾 Japon 2026", { body: "Rappels activés ! Vous serez notifié avant vos activités.", icon: "🗾" });
    }
  };

  const addReminder = () => {
    if (!newRem.text.trim()) return;
    const list = [...reminders, { ...newRem, id: Date.now() }];
    saveReminders(list);
    setNewRem({ day:"27 avr", time:"09:00", text:"" });
    setShowForm(false);
  };

  const removeReminder = (id) => saveReminders(reminders.filter(r => r.id !== id));

  // Generate ICS export for all "ok" activities
  const exportICS = () => {
    const okItems = [];
    DAYS.forEach(day => {
      day.sections.forEach(sec => {
        sec.items.filter(it => it.s === "ok").forEach(it => {
          const hourMatch = it.t.match(/(\d{1,2})h(\d{0,2})/);
          const h = hourMatch ? parseInt(hourMatch[1]) : 10;
          const mn = hourMatch && hourMatch[2] ? parseInt(hourMatch[2]) : 0;
          const dateMap = {
            "27 avr":"20260427","28 avr":"20260428","29 avr":"20260429","30 avr":"20260430",
            "1 mai":"20260501","2 mai":"20260502","3 mai":"20260503","4 mai":"20260504",
            "5 mai":"20260505","6 mai":"20260506","7 mai":"20260507","8 mai":"20260508",
            "9 mai":"20260509","10 mai":"20260510","11 mai":"20260511",
          };
          const dateStr = dateMap[day.date] || "20260427";
          okItems.push({ title: it.t.replace(/[^a-zA-ZÀ-ÿ0-9 ]/g,"").trim(), date: dateStr, h, mn });
        });
      });
    });
    // Compute end time safely: add 1 hour, wrap past midnight to the next day
    const addHour = (dateStr, h, mn) => {
      let endH = h + 1;
      let endDate = dateStr;
      if (endH >= 24) {
        endH = endH - 24;
        // Roll date forward by 1 day
        const y = parseInt(dateStr.slice(0,4));
        const m = parseInt(dateStr.slice(4,6)) - 1;
        const d = parseInt(dateStr.slice(6,8));
        const nd = new Date(Date.UTC(y, m, d + 1));
        endDate = `${nd.getUTCFullYear()}${String(nd.getUTCMonth()+1).padStart(2,"0")}${String(nd.getUTCDate()).padStart(2,"0")}`;
      }
      return { endDate, endH, endMn: mn };
    };
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Japon 2026//FR",
      "CALSCALE:GREGORIAN",
      // Minimal VTIMEZONE for Asia/Tokyo (no DST, fixed +0900)
      "BEGIN:VTIMEZONE",
      "TZID:Asia/Tokyo",
      "BEGIN:STANDARD",
      "DTSTART:19700101T000000",
      "TZOFFSETFROM:+0900",
      "TZOFFSETTO:+0900",
      "TZNAME:JST",
      "END:STANDARD",
      "END:VTIMEZONE",
    ];
    okItems.forEach((ev, idx) => {
      const { endDate, endH, endMn } = addHour(ev.date, ev.h, ev.mn);
      const start = `${ev.date}T${String(ev.h).padStart(2,"0")}${String(ev.mn).padStart(2,"0")}00`;
      const end = `${endDate}T${String(endH).padStart(2,"0")}${String(endMn).padStart(2,"0")}00`;
      const uid = `japon2026-${ev.date}-${idx}@local`;
      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTART;TZID=Asia/Tokyo:${start}`,
        `DTEND;TZID=Asia/Tokyo:${end}`,
        `SUMMARY:🎌 ${ev.title}`,
        "DESCRIPTION:Activité réservée — Voyage Japon 2026",
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], { type:"text/calendar" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "japon-2026.ics";
    a.click();
  };

  const days_list = ["27 avr","28 avr","29 avr","30 avr","1 mai","2 mai","3 mai","4 mai","5 mai","6 mai","7 mai","8 mai","9 mai","10 mai","11 mai"];

  return (
    <InfoCard title="🔔 Rappels & Notifications" color="#7C3AED" headerBg={t("#F5F3FF","#1C0F2E")}>
      {permission === "unsupported" ? (
        <div style={{ marginBottom:"0.75rem" }}>
          <p style={{ fontSize:"0.74rem", color:v("textSec",dark), margin:"0 0 0.5rem" }}>⚠️ Les notifications navigateur ne sont pas supportées ici. Exportez vos activités dans votre calendrier :</p>
          <button onClick={exportICS} style={{ fontSize:"0.75rem", fontWeight:600, color:"#7C3AED", background:"transparent", border:"1px solid #7C3AED", borderRadius:"8px", padding:"0.4rem 0.75rem", cursor:"pointer", fontFamily:"inherit" }}>
            📅 Exporter en .ics (Google/Apple Calendar)
          </button>
        </div>
      ) : permission === "denied" ? (
        <p style={{ fontSize:"0.74rem", color:"#DC2626", margin:"0 0 0.75rem" }}>🚫 Notifications bloquées dans les paramètres du navigateur. Activez-les dans les préférences du site.</p>
      ) : permission !== "granted" ? (
        <div style={{ marginBottom:"0.75rem" }}>
          <p style={{ fontSize:"0.74rem", color:v("textSec",dark), margin:"0 0 0.5rem", lineHeight:1.5 }}>Recevez des rappels avant vos activités importantes du voyage.</p>
          <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
            <button onClick={requestPermission} style={{ fontSize:"0.75rem", fontWeight:600, color:"white", background:"#7C3AED", border:"none", borderRadius:"8px", padding:"0.4rem 0.75rem", cursor:"pointer", fontFamily:"inherit" }}>
              🔔 Activer les rappels
            </button>
            <button onClick={exportICS} style={{ fontSize:"0.75rem", fontWeight:600, color:"#7C3AED", background:"transparent", border:"1px solid #7C3AED", borderRadius:"8px", padding:"0.4rem 0.75rem", cursor:"pointer", fontFamily:"inherit" }}>
              📅 Exporter en .ics
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.75rem", padding:"0.4rem 0.6rem", background:dark?"#14301E":"#DCFCE7", borderRadius:"6px" }}>
          <span style={{ fontSize:"0.8rem" }}>✅</span>
          <span style={{ fontSize:"0.73rem", fontWeight:600, color:dark?"#4ADE80":"#166534" }}>Notifications activées</span>
          <button onClick={exportICS} style={{ marginLeft:"auto", fontSize:"0.68rem", color:v("textMuted",dark), background:"transparent", border:"none", cursor:"pointer", fontFamily:"inherit" }}>📅 Export .ics</button>
        </div>
      )}
      {/* Reminders list */}
      {reminders.length > 0 && (
        <div style={{ marginBottom:"0.75rem" }}>
          <p style={{ fontSize:"0.68rem", fontWeight:700, color:v("textPrimary",dark), margin:"0 0 0.35rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>Rappels programmés</p>
          {reminders.map(r => (
            <div key={r.id} style={{ display:"flex", alignItems:"center", gap:"0.5rem", padding:"0.3rem 0.5rem", background:v("cardBg2",dark), borderRadius:"6px", marginBottom:"0.25rem" }}>
              <span style={{ fontSize:"0.72rem", fontWeight:600, color:"#7C3AED", flexShrink:0 }}>{r.day} {r.time}</span>
              <span style={{ fontSize:"0.72rem", color:v("textSec",dark), flex:1 }}>{r.text}</span>
              <button onClick={()=>removeReminder(r.id)} style={{ fontSize:"0.7rem", color:v("textMuted",dark), background:"transparent", border:"none", cursor:"pointer", padding:"0.1rem", flexShrink:0 }}>✕</button>
            </div>
          ))}
        </div>
      )}
      {/* Add reminder */}
      {!showForm ? (
        <button onClick={()=>setShowForm(true)} style={{ fontSize:"0.73rem", color:"#7C3AED", background:"transparent", border:"1px dashed #7C3AED", borderRadius:"6px", padding:"0.35rem 0.75rem", cursor:"pointer", fontFamily:"inherit", width:"100%" }}>
          + Ajouter un rappel manuellement
        </button>
      ) : (
        <div style={{ background:v("cardBg2",dark), borderRadius:"8px", padding:"0.65rem", border:`1px solid ${v("borderLight",dark)}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.4rem", marginBottom:"0.4rem" }}>
            <div>
              <label style={{ fontSize:"0.7rem", color:v("textMuted",dark), display:"block", marginBottom:"0.15rem" }}>Jour</label>
              <select value={newRem.day} onChange={e=>setNewRem(p=>({...p,day:e.target.value}))} style={{ width:"100%", padding:"0.3rem 0.4rem", borderRadius:"6px", border:`1px solid ${v("borderLight",dark)}`, background:v("cardBg",dark), color:v("textPrimary",dark), fontSize:"0.72rem", fontFamily:"inherit" }}>
                {days_list.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:"0.7rem", color:v("textMuted",dark), display:"block", marginBottom:"0.15rem" }}>Heure</label>
              <input type="time" value={newRem.time} onChange={e=>setNewRem(p=>({...p,time:e.target.value}))} style={{ width:"100%", padding:"0.3rem 0.4rem", borderRadius:"6px", border:`1px solid ${v("borderLight",dark)}`, background:v("cardBg",dark), color:v("textPrimary",dark), fontSize:"0.72rem", fontFamily:"inherit" }} />
            </div>
          </div>
          <input type="text" placeholder="Description du rappel..." value={newRem.text} onChange={e=>setNewRem(p=>({...p,text:e.target.value}))} style={{ width:"100%", padding:"0.35rem 0.5rem", borderRadius:"6px", border:`1px solid ${v("borderLight",dark)}`, background:v("cardBg",dark), color:v("textPrimary",dark), fontSize:"0.73rem", fontFamily:"inherit", marginBottom:"0.4rem", outline:"none", boxSizing:"border-box" }} />
          <div style={{ display:"flex", gap:"0.4rem" }}>
            <button onClick={addReminder} style={{ flex:1, fontSize:"0.73rem", fontWeight:600, color:"white", background:"#7C3AED", border:"none", borderRadius:"6px", padding:"0.35rem 0", cursor:"pointer", fontFamily:"inherit" }}>Ajouter</button>
            <button onClick={()=>setShowForm(false)} style={{ fontSize:"0.73rem", color:v("textSec",dark), background:"transparent", border:`1px solid ${v("borderLight",dark)}`, borderRadius:"6px", padding:"0.35rem 0.6rem", cursor:"pointer", fontFamily:"inherit" }}>Annuler</button>
          </div>
        </div>
      )}
    </InfoCard>
  );
}


function InfoCard({ title, color, headerBg, children }) {
  const dark = useDark();
  return (
    <div style={{ background:v("cardBg",dark), borderRadius:"12px", overflow:"hidden", boxShadow:dark?"0 1px 4px rgba(0,0,0,0.4)":"0 1px 4px rgba(0,0,0,0.07)", border:`1px solid ${v("border",dark)}`, transition:"background 0.3s" }}>
      <div style={{ padding:"0.75rem 1rem", borderBottom:`1px solid ${v("borderLight",dark)}`, background:headerBg[dark?"dark":"light"] }}>
        <h2 style={{ fontSize:"0.9rem", fontWeight:700, color, margin:0 }}>{title}</h2>
      </div>
      <div style={{ padding:"0.875rem 1rem" }}>{children}</div>
    </div>
  );
}

function InfoSection() {
  const dark = useDark();
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
      <ConverterCard />
      <DepartureChecklist />
      <ShareSection />
      <NotificationsSection />
      <InfoCard title="🚄 Transports & JR Pass" color="#34D399" headerBg={t("#ECFDF5","#0A1E12")}>
        {[
          ["🎫 JR Pass — Ce qui est couvert","Shinkansen HIKARI et KODAMA uniquement (⚠️ PAS le Nozomi ni le Mizuho). JR Locaux dans toutes les villes. Tokyo Monorail Haneda. JR Nara Line (Inari, Nara). JR Yumesaki Line (USJ). JR Sagano Line (Arashiyama). Réserver sièges GRATUITEMENT au guichet Midori no Madoguchi (みどりの窓口) dans toutes les grandes gares — indispensable 3 mai."],
          ["🚇 Suica IC Card","Acheter à la machine bleue 'IC Card' dès Haneda T3 — charger 5000¥. Valide : tous les métros de Tokyo/Osaka/Kyoto, bus Kyoto (230¥ fixe), konbinis 7-Eleven / FamilyMart / Lawson, certains taxis. Recharger aux machines vertes dans chaque station."],
          ["✈️ Haneda Arrivée (27 avr) — Options précises","Keikyu Airport Express T3 → Sengakuji (2 arrêts, 13 min) → Toei Asakusa Line → Asakusa (8 arrêts, 20 min). Total : ~33 min, ~650¥ Suica.\n\nOU Tokyo Monorail T3 → Hamamatsucho (14 min, JR Pass) → JR Yamanote → Akihabara → Ginza Line → Asakusa. Total : ~55 min."],
          ["✈️ Haneda Départ (11 mai 11h45)","Être au T3 International avant 9h30. Depuis Keikyu EX Inn Haneda : Keikyu Line ~12 min. Depuis Shinagawa : Keikyu ~25 min — départ hôtel 8h15. Enregistrement + sécurité + douane = 2h minimum."],
          ["🚄 Shinkansen — Horaires clés","Tokyo→Kyoto (3 mai) : Hikari toutes les 30 min depuis ~6h, durée ~2h40. Siège côté gauche pour le Fuji.\n\nKyoto→Shin-Osaka (7 mai) : Hikari ou Kodama, ~15 min.\n\nShin-Osaka→Tokyo (10 mai) : Hikari ~2h30. Réserver tous les sièges le J1 au guichet JR."],
        ].map(([t2,d],i)=>(
          <div key={i} style={{ marginBottom:i<4?"0.65rem":0 }}>
            <p style={{ fontSize:"0.8rem", fontWeight:600, color:"#34D399", margin:0 }}>{t2}</p>
            <p style={{ fontSize:"0.75rem", color:v("textSec",dark), marginTop:"0.1rem", lineHeight:1.5 }}>{d}</p>
          </div>
        ))}
      </InfoCard>
      <InfoCard title="🍶 Boissons — Sans bière !" color="#A855F7" headerBg={t("#F5F3FF","#231840")}>
        {[
          ["🥃 Highball Whisky (ハイボール)","Le standard de toutes les izakayas. Suntory Kakubin (角) + soda = définition du haiboru. Toki ou Hibiki pour les versions premium. Commander : 'Kakubin haiboru hitotsu onegaishimasu'. ~400-700¥."],
          ["🍶 Saké (日本酒)","Junmai (純米) = riz pur, body rond. Ginjo (吟醸) = fermentation basse température, floral. Daiginjo (大吟醸) = arômes complexes de fruit. Nigori (にごり) = trouble, légèrement sucré. Hiyaoroshi (ひやおろし) = saké saisonnier automnal. Commander : 'osusume no junmai ginjo kudasai' (recommandez-moi un junmai ginjo). 80-180ml selon le verre."],
          ["🌸 Umeshu (梅酒)","Vin de prune macérée dans du shochu avec sucre. Choya Gold ou Nankoubai = références. Sur glace (ロック, rokku) ou en soda. Très doux, ~12% alcool. ~500¥/verre."],
          ["🍋 Chuhai / Yuzu Sour","Shochu + soda + sirop de fruit. Versions : lemon (レモンサワー), yuzu (ゆずサワー), grapefruit (グレープフルーツ), ume (梅). 3-7% alcool. ~400-500¥. Le yuzu sour est particulièrement aromatique."],
          ["🍵 Matcha & Hojicha","Matcha latte (抹茶ラテ) : partout depuis 300¥. Hojicha (ほうじ茶) : thé torréfié, caramel doux, peu de caféine. Amazake (甘酒) : saké doux chauffé, 0% alcool, fermenté de riz — goûter au moins une fois, ~200¥."],
          ["🍬 Ramune (ラムネ)","Soda pétillant en bouteille en verre avec bille. Pour ouvrir : insérer le poussoir plastique fourni dans le goulot et appuyer d'un coup sec. La bille tombe dans la bouteille. Saveurs : citron, melon, fraise, cola. ~150-200¥ en supermarché, ~300¥ touristique."],
        ].map(([t2,d],i)=>(
          <div key={i} style={{ marginBottom:i<5?"0.55rem":0, paddingBottom:i<5?"0.55rem":0, borderBottom:i<5?`1px solid ${dark?"#3B1F5E":"#EDE9FE"}`:"none" }}>
            <p style={{ fontSize:"0.8rem", fontWeight:600, color:"#A855F7", margin:0 }}>{t2}</p>
            <p style={{ fontSize:"0.74rem", color:v("textSec",dark), marginTop:"0.1rem", lineHeight:1.45 }}>{d}</p>
          </div>
        ))}
      </InfoCard>
      <InfoCard title="🎌 Codes Culturels" color={dark?"#F1F0EE":"#374151"} headerBg={t("#F9FAFB","#1A1A1A")}>
        {[
          "💴 CASH : Retirer dans les ATM verts Japan Post Bank ou ATM 7-Eleven (logo rouge). Les distributeurs BNP/Société Générale ne fonctionnent pas. PIN 4 chiffres. Garder 10 000¥ minimum sur soi en permanence.",
          "🍽 RESTAURANTS : Attendre toujours d'être placé (même si c'est vide). 'Itadakimasu' avant de manger. Aucun pourboire — c'est vraiment offensant. Paiement à la caisse en sortant dans 80% des cas. Mettre l'argent dans le plateau (pas en main).",
          "🚇 TRANSPORTS : Téléphone en silencieux OBLIGATOIRE dans les wagons. Ne pas manger dans le métro. Escalators : file à gauche à Tokyo, à droite à Osaka (inversé !). Céder les sièges bleus (sièges prioritaires) aux personnes âgées.",
          "👟 TEMPLES ET MAISONS : Enlever les chaussures à l'entrée dès qu'il y a un engawa (pas de bois) ou des chaussons prévus. Tabi (chaussettes japonaises à doigt séparé) sont appréciées dans les ryokan.",
          "📸 PHOTOS : Demander toujours avant de photographier des personnes. Les Geiko/Maiko à Gion = surtout ne pas bloquer leur chemin ni les toucher. Certains temples et jardins interdisent les photos (panneau 撮影禁止, satsueï kinshi).",
          "♨️ ONSEN : Se doucher ENTIÈREMENT avec savon ET shampoing au poste douche individuel avant d'entrer dans le bain commun. Pas de maillot de bain dans les bains publics. Tatouages : beaucoup d'onsen refusent encore. Vérifier avant.",
          "🗣 MOTS CLÉS INDISPENSABLES : Sumimasen = excusez-moi / pardon\n\nArigatou gozaimasu = merci beaucoup\n\nIkura desu ka ? = combien ?\n\nEigo menu arimasu ka ? = avez-vous le menu en anglais ?\n\nOishii ! = délicieux !",
        ].map((tip,i)=><p key={i} style={{ fontSize:"0.75rem", color:v("textSec",dark), lineHeight:1.5, margin:i>0?"0.4rem 0 0":0 }}>{tip}</p>)}
      </InfoCard>
    </div>
  );
}
