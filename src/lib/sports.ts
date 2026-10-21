/* ------------------------------------------------------------------ */
/*  Page sports (/padel, avec le tennis et le pickleball en version   */
/*  courte sous les ancres #tennis et #pickleball) : textes de        */
/*  référence pour la recherche locale (« club de padel Bas-Rhin »,   */
/*  « école de tennis Haguenau »…). Volontairement hors CMS, comme le */
/*  règlement intérieur : photo, atouts et tarifs viennent eux du     */
/*  contenu géré dans l'admin (disciplines, adhésions).               */
/*  Pas de nombre de courts ni de prix ici : ils vivent dans l'admin  */
/*  et ne doivent être mis à jour qu'à un seul endroit.               */
/* ------------------------------------------------------------------ */

export type SportSlug = "tennis" | "padel" | "pickleball";

export type SportPage = {
  slug: SportSlug;
  /* Nom de la discipline dans l'admin (photo, atouts, bouton) */
  discipline: string;
  /* Nom court pour le menu, le fil d'Ariane et les liens croisés */
  label: string;
  metaTitle: string;
  metaDescription: string;
  hero: { kicker: string; title: string; text: string };
  intro: { kicker: string; title: string; paragraphs: string[] };
  highlights: { title: string; text: string }[];
  /* Adhésions à afficher (filtre sur le nom de la formule) */
  memberships?: RegExp;
  faqs: { q: string; a: string }[];
};

export const sportPages: Record<SportSlug, SportPage> = {
  padel: {
    slug: "padel",
    discipline: "Padel",
    label: "Padel",
    metaTitle: "Padel à Soufflenheim, près de Haguenau (Bas-Rhin)",
    metaDescription:
      "Padel couvert en Alsace du Nord, à 20 min de Haguenau : tournois, cours et réservation en ligne 7j/7. Tennis et pickleball aussi au Tennis Padel Club Soufflenheim.",
    hero: {
      kicker: "Padel · Soufflenheim, Bas-Rhin",
      title: "Le padel en Alsace du Nord, à l'abri de la pluie",
      text: "Au Tennis Padel Club Soufflenheim, on joue au padel toute l'année : réservation en ligne 7j/7, tournois réguliers et une ambiance de club de village, entre Haguenau et le Rhin.",
    },
    intro: {
      kicker: "Le padel au club",
      title: "Jouer au padel à Soufflenheim",
      paragraphs: [
        "Le padel est devenu en quelques saisons l'un des moteurs du club. Sport de raquette qui se joue à quatre sur une piste encadrée de vitres, il se prend en main dès la première partie : pas besoin d'avoir déjà tenu une raquette pour s'amuser.",
        "Piste couverte et éclairée : on joue par tous les temps, de jour comme en soirée. Les membres réservent leur créneau sur Ten'up, l'application de la Fédération Française de Tennis, 7 jours sur 7.",
        "Débutant curieux, joueur de tennis en quête de nouveauté ou compétiteur : le club organise des tournois de padel toute l'année, des initiations et des cours avec son entraîneur padel. Les nouveaux membres peuvent emprunter des raquettes pour se lancer.",
      ],
    },
    highlights: [
      {
        title: "Par tous les temps",
        text: "Piste couverte et éclairée : la pluie n'annule jamais un match, l'hiver non plus.",
      },
      {
        title: "Un tournoi chaque mois",
        text: "Au moins un tournoi de padel par mois, inscriptions sur Ten'up : l'occasion de se mesurer aux joueurs de tout le Bas-Rhin.",
      },
      {
        title: "Un entraîneur dédié",
        text: "Initiations et cours avec notre entraîneur padel, pour les jeunes comme pour les adultes.",
      },
    ],
    memberships: /padel/i,
    faqs: [
      {
        q: "Comment jouer au padel au club ?",
        a: "Le plus simple est d'adhérer au club : l'adhésion annuelle tennis + padel (cotisation au club + licence FFT) donne accès à la piste, réservable sur Ten'up 7 jours sur 7. Une formule existe aussi pour les joueurs qui ne prennent pas leur licence au club. Pour une première découverte, contactez-nous : des initiations sont organisées régulièrement.",
      },
      {
        q: "Faut-il savoir jouer au tennis pour se mettre au padel ?",
        a: "Non. Le padel se prend en main très vite : service à la cuillère, raquette pleine et rebonds sur les vitres rendent les échanges longs dès la première partie. Les joueurs de tennis y trouvent vite leurs repères, mais les débutants complets s'amusent tout autant.",
      },
      {
        q: "Organisez-vous des tournois de padel ?",
        a: "Oui : au moins un tournoi de padel par mois. Les inscriptions se font sur Ten'up ou directement auprès du club. Les prochaines dates sont aussi annoncées dans le calendrier du site et sur nos réseaux sociaux.",
      },
      {
        q: "Peut-on prendre des cours de padel ?",
        a: "Oui. Le club travaille avec un entraîneur padel qui propose des cours aux jeunes comme aux adultes. Contactez le club : nous vous mettrons en relation pour convenir d'un programme adapté à votre niveau.",
      },
    ],
  },

  tennis: {
    slug: "tennis",
    discipline: "Tennis",
    label: "Tennis",
    metaTitle: "Club de tennis à Soufflenheim, près de Haguenau (Bas-Rhin)",
    metaDescription:
      "Courts extérieurs et court couvert, école de tennis dès 5 ans, équipes en championnat et Open annuel : le tennis en Alsace du Nord, à 20 min de Haguenau.",
    hero: {
      kicker: "Tennis · Soufflenheim, Bas-Rhin",
      title: "Le tennis à Soufflenheim, depuis 1979",
      text: "École de tennis, loisir, compétition : un club à taille humaine en Alsace du Nord, avec un court couvert pour jouer toute l'année.",
    },
    intro: {
      kicker: "Le tennis au club",
      title: "Un club de tennis pour tous les âges",
      paragraphs: [
        "Le tennis est l'âme du club : c'est autour de lui que le club est né en 1979, rue de Koenigsbruck. Plus de quarante-cinq ans plus tard, on y joue toujours en famille, entre amis ou en compétition, dans une ambiance de club de village.",
        "Les courts extérieurs accueillent les beaux jours et les soirées d'été, le court couvert prend le relais quand la météo alsacienne fait des siennes. L'éclairage est compris dans l'adhésion, et chaque membre réserve son créneau en ligne sur Ten'up.",
        "Côté compétition, le club engage des équipes en championnat et organise chaque année son Open de tennis, avec au moins un tableau senior messieurs et un tableau senior dames.",
      ],
    },
    highlights: [
      {
        title: "École de tennis dès 5 ans",
        text: "30 séances d'une heure dans la saison pour les 5 à 17 ans, encadrées par notre entraîneur jeunes.",
      },
      {
        title: "Un court couvert",
        text: "Pour continuer à jouer l'hiver, quand il pleut ou quand la nuit tombe tôt.",
      },
      {
        title: "Licence FFT",
        text: "La licence de la Fédération Française de Tennis accompagne l'adhésion : assurance, tournois et classement.",
      },
    ],
    memberships: /tennis|jeunes|famille/i,
    faqs: [
      {
        q: "À partir de quel âge peut-on s'inscrire à l'école de tennis ?",
        a: "Dès 5 ans. L'école de tennis accueille les 5 à 17 ans, avec 30 séances d'une heure réparties sur la saison. La saison commence le 1er septembre : c'est le meilleur moment pour s'inscrire, notamment lors des portes ouvertes du club.",
      },
      {
        q: "Proposez-vous des cours de tennis pour adultes ?",
        a: "Oui : un entraîneur s'occupe des adultes (18 ans et plus). Contactez le club pour être mis en relation et convenir d'un programme adapté à vos objectifs.",
      },
      {
        q: "Comment réserver un court de tennis ?",
        a: "Les membres réservent sur Ten'up, l'application ou le site de la Fédération Française de Tennis, 7 jours sur 7. L'accès aux courts se fait ensuite avec un badge, remis contre une caution de 5 €.",
      },
      {
        q: "Le club participe-t-il à des compétitions ?",
        a: "Oui : le club engage des équipes en championnat et organise chaque année son Open de tennis, avec au moins un tableau senior messieurs et un tableau senior dames. Les inscriptions aux tournois se font sur Ten'up.",
      },
    ],
  },

  pickleball: {
    slug: "pickleball",
    discipline: "Pickleball",
    label: "Pickleball",
    metaTitle: "Pickleball en Alsace : initiation à Soufflenheim (Bas-Rhin)",
    metaDescription:
      "Découvrez le pickleball au Tennis Padel Club Soufflenheim : sessions d'initiation gratuites, matériel prêté, idéal en famille. En Alsace du Nord, à 20 min de Haguenau.",
    hero: {
      kicker: "Pickleball · Soufflenheim, Bas-Rhin",
      title: "Le pickleball débarque en Alsace du Nord",
      text: "Le sport de raquette qui monte, à découvrir en famille ou entre amis au club : on vous prête le matériel, il ne reste qu'à venir.",
    },
    intro: {
      kicker: "Le pickleball au club",
      title: "Qu'est-ce que le pickleball ?",
      paragraphs: [
        "Né aux États-Unis dans les années 1960, le pickleball se joue en simple ou en double, avec une raquette pleine et une balle en plastique perforée, sur un terrain plus petit qu'un court de tennis. Les règles s'apprennent en quelques minutes et les échanges durent.",
        "Proche du tennis de plage et du padel, il convient à tous les âges et à tous les niveaux : c'est l'une des activités les plus conviviales du club, idéale pour jouer en famille.",
        "Le club propose des sessions découverte, notamment le week-end : le matériel est prêté, il suffit d'une tenue de sport.",
      ],
    },
    highlights: [
      {
        title: "Initiation gratuite",
        text: "Les sessions découverte sont gratuites : idéal pour essayer sans engagement.",
      },
      {
        title: "Matériel prêté",
        text: "Raquettes et balles fournies : venez simplement en tenue de sport.",
      },
      {
        title: "De 7 à 77 ans",
        text: "Un terrain plus petit, une balle plus lente : enfants, parents et grands-parents jouent ensemble.",
      },
    ],
    faqs: [
      {
        q: "Faut-il être membre pour essayer le pickleball ?",
        a: "Non : les sessions d'initiation sont gratuites et le matériel est fourni. Contactez-nous pour connaître les prochaines dates.",
      },
      {
        q: "Quelle différence avec le tennis et le padel ?",
        a: "Le terrain est plus petit, la raquette est pleine et la balle, en plastique perforé, va moins vite : les échanges sont accessibles dès le premier essai. Contrairement au padel, il n'y a pas de vitres : on joue sur un terrain ouvert, avec un filet un peu plus bas qu'au tennis.",
      },
      {
        q: "Quel équipement prévoir ?",
        a: "Une tenue de sport et des chaussures adaptées aux terrains de tennis. Le club prête les raquettes et les balles.",
      },
    ],
  },
};

/* Ordre d'affichage : le padel d'abord */
export const sportOrder: SportSlug[] = ["padel", "tennis", "pickleball"];

/* Adresse d'un sport : le padel a la page, les autres une ancre dessous. */
export const sportHref = (slug: SportSlug) => (slug === "padel" ? "/padel" : `/padel#${slug}`);
