/* ------------------------------------------------------------------ */
/*  Règlement intérieur du Tennis Padel Club Soufflenheim — 2023/24.  */
/*  Transcription du document approuvé par le Comité de direction     */
/*  en septembre 2023.                                                 */
/* ------------------------------------------------------------------ */

export const reglementMeta = {
  saison: "2023/24",
  preambule:
    "Le Tennis Padel Club de Soufflenheim, association loi de 1901, est utilisateur de 2 courts de tennis extérieurs, 1 court couvert et 1 court de padel couvert — 1 rue de Koenigsbruck, 67620 Soufflenheim.",
  approbation:
    "Approuvé par le Comité de direction en septembre 2023. Pour le comité, le président : Serge Moreau.",
};

export type ReglementSousSection = {
  title?: string;
  intro?: string;
  points?: string[];
};

export type ReglementArticle = {
  title: string;
  sections: ReglementSousSection[];
};

export const reglementArticles: ReglementArticle[] = [
  {
    title: "Article 1 — Membres, cotisations, inscription",
    sections: [
      {
        title: "Membres",
        points: [
          "Seuls sont membres du club les personnes étant à jour de leur cotisation annuelle.",
          "Tarifs affichés au Club House.",
          "Les membres, titulaires de la licence FFT attachée au Tennis Padel Club de Soufflenheim, peuvent être éligibles, élus et remplir toutes les fonctions au sein du comité directeur du Tennis Padel Club de Soufflenheim.",
        ],
      },
      {
        title: "Cotisations",
        points: [
          "La cotisation annuelle est valable du 1er septembre au 31 août de l'année suivante.",
          "Le montant de la cotisation annuelle peut être révisé chaque année. Chaque modification de cotisation doit être soumise à l'approbation de l'Assemblée générale ou du Comité de direction.",
        ],
      },
      {
        title: "Inscription",
        intro:
          "Pour être retenu, l'ensemble du dossier doit être complet et signé. Le dossier comprend :",
        points: [
          "La signature du règlement intérieur (un exemplaire remis à chaque membre par mail).",
          "Le paiement de la cotisation annuelle par Ten'up, carte bancaire.",
          "Le paiement de la caution pour remise d'un badge d'accès au court.",
        ],
      },
    ],
  },
  {
    title: "Article 2 — Licence FFT",
    sections: [
      {
        intro:
          "Les membres du club (cours, entraînements, compétitions, individuels ou collectifs) sont obligatoirement licenciés à la Fédération Française de Tennis Padel. Ils bénéficient, à ce titre, d'une assurance de la FFT les couvrant lors d'un accident et en responsabilité civile (voir les couvertures d'assurance sur le site de la FFT ou l'affichage dans le court couvert tennis).",
      },
    ],
  },
  {
    title: "Article 3 — Accès et réservations aux courts",
    sections: [
      {
        title: "3.1 — Accès général",
        points: [
          "L'accès aux courts est réservé aux membres du club à jour de leur cotisation.",
          "Sur décision du comité, aucune location horaire ne sera possible.",
          "Une, voire deux invitations pourront être exceptionnellement autorisées pour inciter ces invités à devenir membres du club.",
          "L'esprit club est notre devise.",
          "Le club s'autorise à exclure tout joueur qui ne respecte pas l'article 3.1.",
        ],
      },
      {
        title: "3.1 A — Badge d'accès",
        points: [
          "Un badge pour les courts pourra être fourni lors du paiement de la cotisation annuelle. Il sera demandé une caution de 5 € par badge souhaité.",
          "Cette caution sera remboursée à tout moment quand un membre rendra son badge. Ce badge devra être rendu avant le 30 septembre de l'année si le joueur ne désire pas renouveler la licence pour la nouvelle année.",
          "Le badge donne aussi accès au court, aux toilettes et aux douches en cas de fermeture du club house — accès par la porte du club côté place de la foire, à côté du défibrillateur.",
          "La détention d'un badge donne accès aux courts extérieurs et couvert ; elle est proposable à tous les membres âgés de 11 ans au minimum (sous la responsabilité des parents si mineurs).",
        ],
      },
      {
        title: "3.2 — Réservations des courts",
        points: [
          "Les réservations se font sur Ten'up (application à télécharger sur votre mobile).",
          "Les adhérents peuvent réserver deux heures à la fois pour le tennis et 1 h 30 pour le padel, et ne renouveler une autre réservation qu'après avoir joué.",
          "Pour réserver un court, il faut préciser le nom de chaque joueur du club pour le tennis, et de 3 joueurs du club pour le padel.",
          "Tout court non occupé 10 minutes après le début de l'heure de réservation est réputé disponible.",
          "Des réservations ponctuelles et exceptionnelles peuvent être effectuées à la diligence du Comité de direction (compétitions, enseignement, animations…).",
        ],
      },
    ],
  },
  {
    title: "Article 4 — École de tennis",
    sections: [
      {
        points: [
          "Tout cours de tennis organisé par le club demande une participation financière. Celle-ci doit obligatoirement être payée à l'inscription. Tarifs sur notre site internet.",
          "Avant de déposer leurs enfants au club, les parents doivent s'assurer qu'il y a bien un responsable pour les accueillir (enseignant).",
          "La responsabilité de l'enseignant n'est engagée que durant le temps du cours, précisément. En dehors de cet horaire, les parents restent responsables de leurs enfants.",
          "Un cours adultes existe sous conditions.",
        ],
      },
    ],
  },
  {
    title: "Article 5 — Tenue vestimentaire",
    sections: [
      {
        intro: "Sur les courts et dans l'enceinte du club :",
        points: [
          "Une tenue correcte et décente est de rigueur, le torse nu est interdit.",
          "Les chaussures de sport sont obligatoires et doivent être adaptées à la pratique du tennis et du padel ainsi qu'à la nature du sol.",
        ],
      },
    ],
  },
  {
    title: "Article 6 — Entretien",
    sections: [
      {
        title: "6.1 — Les courts",
        points: [
          "Les courts doivent être maintenus en parfait état de propreté. Veuillez ramener vos boîtes de balles et déchets chez vous.",
          "Le court doit être fermé à clé à la fin de chaque partie.",
          "Chaque membre est responsable de l'entretien du club et doit signaler toute imperfection qu'il pourrait détecter à un membre du Bureau.",
        ],
      },
      {
        title: "6.2 — Le club",
        points: [
          "Une permanence du Club House sera assurée les week-ends et en soirée (les horaires seront affichés et diffusés sur le site internet et les réseaux).",
          "Les parties communes (accès, vestiaires, Club House, toilettes et douches…) doivent être maintenues en parfait état de propreté.",
        ],
      },
    ],
  },
  {
    title: "Article 7 — Discipline",
    sections: [
      {
        points: [
          "Il est interdit de fumer sur les courts et dans l'enceinte du club house.",
          "Toute autre activité que le tennis et le padel est interdite sur les courts.",
          "Nous invitons vivement les membres à ne pas jouer avec des personnes n'étant pas membres du club. La solidarité associative s'impose.",
          "Boîtes, bouteilles, papiers, etc. doivent être déposés dans les poubelles prévues à cet effet.",
          "La présence d'animaux est interdite sur les courts.",
          "Les membres du Comité de direction ont vocation à pénétrer sur les courts pour régler tout litige en suspens.",
          "En cas de faute grave d'un adhérent, le Comité de direction peut procéder à sa radiation temporaire ou définitive.",
          "Il est recommandé de ne pas laisser les enfants en bas âge sans surveillance, sur les courts ou dans l'enceinte du club.",
        ],
      },
    ],
  },
  {
    title: "Article 8 — Responsabilité",
    sections: [
      {
        points: [
          "Le club décline toute responsabilité en cas de perte ou de vol sur les courts et dans les vestiaires.",
          "Toute l'infrastructure du tennis club de Soufflenheim est sous vidéosurveillance.",
        ],
      },
    ],
  },
  {
    title: "Article 9 — Application du règlement",
    sections: [
      {
        points: [
          "Le présent règlement pourra être modifié par une décision du comité.",
          "L'adhésion au club entraîne l'acceptation de toutes les clauses du présent règlement.",
        ],
      },
    ],
  },
];

export type BureauMembre = {
  role: string;
  name: string;
  phone: string;
  email: string;
};

export const bureau: BureauMembre[] = [
  {
    role: "Président",
    name: "Serge Moreau",
    phone: "06 10 14 60 39",
    email: "president.tpcs@gmail.com",
  },
  {
    role: "Vice-président",
    name: "Stéphane Walkiewicz",
    phone: "06 03 08 15 48",
    email: "stephanew11@yahoo.fr",
  },
  {
    role: "Vice-président",
    name: "Patrick Lefebvre",
    phone: "06 95 41 12 67",
    email: "patrick67620@gmail.com",
  },
  {
    role: "Vice-président",
    name: "Georges Niebel",
    phone: "06 11 28 37 78",
    email: "georges.niebel@orange.fr",
  },
  {
    role: "Trésorière",
    name: "Hélène Niebel",
    phone: "06 11 28 37 78",
    email: "georges.niebel@orange.fr",
  },
  {
    role: "Trésorier assistant",
    name: "Jean-Claude Vitzikam",
    phone: "07 70 94 22 00",
    email: "jcvitzikam@sfr.fr",
  },
  {
    role: "Assesseur",
    name: "Valentin Beck",
    phone: "06 43 80 36 65",
    email: "beck.valentin@orange.fr",
  },
];
