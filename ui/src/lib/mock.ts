import {
  Briefcase,
  Layers3,
  Building,
  LandPlot,
  TrendingUp,
  Globe2,
  Car,
  CalendarCheck,
  Hammer,
  Banknote,
  Users,
  Target,
  Wrench,
  LeafyGreen,
} from 'lucide-react';
import type {
  KeyCompetency,
  Thematic,
  TrainingModule,
  TrainingSession,
  JobOffer,
} from './types'; // Import de la nouvelle interface

// --- SECTEURS D'ACTIVITÉ (TEXTE CONCRET) ---
const SECTORS = {
  urbanDev: 'Développement Urbain et Aménagement',
  publicAdmin: 'Administration Publique et Collectivités',
  finance: 'Finance, Banque et Assurance',
  realEstate: 'Immobilier et Foncier',
  btp: 'Bâtiment et Travaux Publics (BTP)',
  social: 'Ingénierie Sociale et Humanitaire',
  environmental: 'Environnement et Énergie',
  business: 'Logistique et Commerce',
};

// --- I. Compétences Clés (pour la Page Modules) ---
export const MOCK_COMPETENCIES: KeyCompetency[] = [
  {
    key: 'urbanPlanning',
    title: 'Planification Urbaine Stratégique',
    description:
      "Capacité à concevoir des schémas directeurs, des plans d'aménagement et des outils d'urbanisme durable. Inclut la gestion des zonages et l'application des lois foncières.",
    icon: Layers3,
    sectors: [SECTORS.urbanDev, SECTORS.publicAdmin],
    advantages: [
      'Devenir maître d’ouvrage dans les projets de développement urbain.',
      'Anticiper les besoins d’infrastructures et de mobilité des villes.',
    ],
  },
  {
    key: 'gisMastery',
    title: 'Maîtrise des SIG et Analyse Géospatiale',
    description:
      "Expertise complète dans l'utilisation des Systèmes d'Information Géographique pour la modélisation, l'analyse des risques, la cartographie avancée et la prise de décision territoriale.",
    icon: Globe2,
    sectors: [SECTORS.publicAdmin, SECTORS.environmental, SECTORS.urbanDev],
    advantages: [
      'Prendre des décisions éclairées basées sur des données fiables et localisées.',
      "Automatiser les tâches complexes d'analyse spatiale et de reporting.",
    ],
  },
  {
    key: 'projectFinance',
    title: 'Financement et Montage de Projets',
    description:
      'Compétence critique pour élaborer des stratégies de financement, monter des dossiers selon les standards des bailleurs de fonds internationaux (BM, BAD, AFD), et garantir la bancabilité des projets.',
    icon: Banknote,
    sectors: [SECTORS.finance, SECTORS.publicAdmin, SECTORS.realEstate],
    advantages: [
      'Sécuriser des financements institutionnels majeurs pour des projets à grande échelle.',
      'Optimiser les modèles économiques des partenariats Public-Privé (PPP).',
    ],
  },
  {
    key: 'socialEngineering',
    title: 'Ingénierie Sociale et Négociation',
    description:
      "Maîtrise des techniques de concertation, de négociation et de résolution de conflits dans le cadre de projets d'aménagement ou de développement impliquant des communautés.",
    icon: Users,
    sectors: [SECTORS.social, SECTORS.publicAdmin],
    advantages: [
      'Garantir l’acceptabilité sociale des projets et minimiser les blocages.',
      'Concevoir des projets à fort impact inclusif et durable.',
    ],
  },
  {
    key: 'sustainableDev',
    title: 'Développement Territorial Durable',
    description:
      'Capacité à intégrer de manière transversale les dimensions environnementales, sociales et économiques dans la conception, le pilotage et l’évaluation des projets d’aménagement.',
    icon: LeafyGreen,
    sectors: [SECTORS.environmental, SECTORS.urbanDev, SECTORS.publicAdmin],
    advantages: [
      'Piloter des initiatives en conformité avec les Objectifs de Développement Durable (ODD).',
      'Obtenir des certifications environnementales pour les infrastructures.',
    ],
  },
  {
    key: 'btpManagement',
    title: 'Gestion de Chantier BTP',
    description:
      "Organisation, planification et supervision d'ouvrages BTP. Inclut la gestion des équipes, l'ordonnancement, le pilotage et la coordination des travaux.",
    icon: Hammer,
    sectors: [SECTORS.btp, SECTORS.urbanDev],
    advantages: [
      'Garantir le respect des délais et des budgets de construction.',
      'Assurer la conformité et la sécurité sur le site.',
    ],
  },
  {
    key: 'realEstateValuation',
    title: 'Évaluation Foncière et Immobilière',
    description:
      'Maîtrise des méthodes d’évaluation avancées pour déterminer la juste valeur des biens fonciers et immobiliers dans divers contextes (expropriation, transaction, fiscalité).',
    icon: TrendingUp,
    sectors: [SECTORS.realEstate, SECTORS.finance],
    advantages: [
      'Optimiser les investissements immobiliers et minimiser les risques financiers.',
      'Mener des expertises reconnues par les tribunaux et les banques.',
    ],
  },
  {
    key: 'logistics',
    title: 'Logistique et Transit International',
    description:
      'Gestion optimisée des chaînes d’approvisionnement, des opérations de transit et des procédures de dédouanement dans un cadre réglementaire national et international.',
    icon: Wrench,
    sectors: [SECTORS.business, SECTORS.btp, SECTORS.publicAdmin],
    advantages: [
      'Réduire les coûts de transport et les délais logistiques.',
      'Assurer la conformité douanière des importations/exportations.',
    ],
  },
];

// --- II. Thématiques (pour les filtres) ---
export const MOCK_THEMATICS: Thematic[] = [
  { name: 'Urbanisme et Aménagement', slug: 'urbanPlanning', icon: Layers3 },
  {
    name: 'Décentralisation et Développement Local',
    slug: 'decentralization',
    icon: Target,
  },
  {
    name: 'Architecture et Construction',
    slug: 'architecture',
    icon: Building,
  },
  {
    name: 'Ingénierie Foncière et Immobilière',
    slug: 'landEngineering',
    icon: LandPlot,
  },
  {
    name: 'Gestion de Projets',
    slug: 'projectManagement',
    icon: CalendarCheck,
  },
  {
    name: 'Environnement et Ingénierie Sociale',
    slug: 'environment',
    icon: LeafyGreen,
  },
  { name: 'Mobilité et Réseaux', slug: 'mobility', icon: Car },
  { name: 'Tourisme et Hôtellerie', slug: 'tourism', icon: Globe2 },
  { name: 'Métiers Techniques', slug: 'trades', icon: Briefcase },
];

// --- III. Formations (Modules) ---
export const MOCK_TRAININGS: TrainingModule[] = [
  // URBANISME - AMENAGEMENT
  {
    id: 'urb-marketing-territorial',
    title: 'Expertise en Marketing Territorial et Attractivité des Territoires',
    description:
      'Maîtrisez les stratégies pour rendre votre territoire compétitif et attractif aux investissements et aux résidents.',
    duration: 60,
    priceMin: 800,
    priceMax: 1500,
    participants: 120,
    enrolled: 15,
    thematic: 'Urbanisme et Aménagement',
    competencyKeys: ['urbanPlanning', 'projectFinance'],
    detailedDescription:
      "Programme intensif axé sur les méthodes de branding territorial, l'analyse des forces et faiblesses d'une zone et le déploiement de plans d'action ciblés pour l'attractivité économique et résidentielle. Inclut des études de cas africaines.",
    learningOutcomes: [
      'Concevoir un plan de marketing territorial adapté aux enjeux locaux.',
      "Identifier et mobiliser les leviers d'attractivité (économique, culturel, touristique).",
      'Élaborer des stratégies de communication et de promotion efficaces.',
    ],
    targetAudience:
      'Cadres des collectivités, urbanistes, responsables de promotion économique.',
    detailedModules: [
      'Fondamentaux du marketing territorial : concepts et enjeux.',
      "Diagnostic du territoire et identification des potentiels d'attractivité.",
      'Stratégies de positionnement et branding territorial.',
      "Financement et mise en œuvre du plan d'action.",
    ],
  },
  {
    id: 'urb-projets-urbains-bailleur',
    title:
      'Conception et Pilotage des Projets Urbains sur Standards Bailleurs de Fonds',
    description:
      'Acquérez les outils et méthodes pour concevoir et piloter des projets conformes aux exigences des bailleurs internationaux (BM, BAD, etc.).',
    duration: 75,
    priceMin: 1200,
    priceMax: 2000,
    participants: 85,
    enrolled: 8,
    thematic: 'Urbanisme et Aménagement',
    competencyKeys: ['projectFinance', 'sustainableDev'],
    detailedDescription:
      "Formation essentielle pour aligner vos projets d'aménagement urbain avec les standards de la Banque Mondiale, de la BAD ou d'autres institutions de financement, assurant la bancabilité et le succès des réalisations.",
    learningOutcomes: [
      "Maîtriser les procédures de passation de marchés et les documents d'appel d'offres des bailleurs.",
      'Intégrer les sauvegardes environnementales et sociales (SES) dans le cycle de projet.',
      'Assurer le suivi-évaluation et la redevabilité (MEAL) selon les exigences des financeurs.',
    ],
    targetAudience:
      'Chefs de projet, consultants, cadres d’agences d’exécution, ingénieurs.',
    detailedModules: [
      'Cycle de projet et normes des bailleurs de fonds.',
      'Études de faisabilité technique, économique et financière.',
      'Gestion des risques et cadre de mesure des résultats.',
      'Méthodes de reporting et audit.',
    ],
  },
  // DECENTRALISATION ET DEVELOPPEMENT LOCAL
  {
    id: 'dece-evaluation-potentiel',
    title:
      'Évaluation des Potentialités Économiques, Financières et Fiscales des Collectivités Locales',
    description:
      'Apprenez à diagnostiquer, évaluer et maximiser le potentiel de développement et les ressources propres de votre collectivité.',
    duration: 50,
    priceMin: 700,
    priceMax: 1300,
    participants: 150,
    enrolled: 22,
    thematic: 'Décentralisation et Développement Local',
    competencyKeys: ['projectFinance', 'socialEngineering'],
    detailedDescription:
      "Ce module permet aux élus et fonctionnaires territoriaux d'identifier les marges de manœuvre financières, d'optimiser la collecte fiscale locale et de planifier des investissements rentables pour le développement local.",
    learningOutcomes: [
      'Mener un diagnostic complet des ressources économiques et fiscales.',
      "Élaborer des stratégies d'optimisation des revenus locaux.",
      'Constituer une base de données fiable sur les collectivités.',
    ],
    targetAudience:
      'Élus locaux, Directeurs financiers de Mairies, Cadres de l’Administration Territoriale.',
    detailedModules: [
      "Méthodes d'évaluation du potentiel fiscal et financier.",
      'Financement du développement local et mobilisation des ressources.',
      'Indicateurs de performance et de gouvernance locale.',
      'Planification et orientation économique territoriale.',
    ],
  },
  // ARCHITECTURE ET CONSTRUCTION
  {
    id: 'archi-gestion-chantier',
    title: 'Gestion de Chantier et Coordination des Travaux BTP',
    description:
      'Maîtrisez les méthodes avancées de gestion de projet, d’ordonnancement et de coordination des équipes pour des chantiers livrés dans les délais et budgets.',
    duration: 80,
    priceMin: 1500,
    priceMax: 2500,
    participants: 60,
    enrolled: 10,
    thematic: 'Architecture et Construction',
    competencyKeys: ['btpManagement', 'logistics'],
    detailedDescription:
      'Formation pratique et intensive sur le pilotage des opérations de construction (OPC). Elle couvre la sécurité, la qualité, la gestion des interfaces et la résolution rapide des problèmes courants de chantier.',
    learningOutcomes: [
      'Planifier et séquencer les tâches de construction (méthode PERT/GANTT).',
      'Assurer la sécurité et la conformité réglementaire sur le chantier.',
      'Optimiser la logistique et la gestion des approvisionnements.',
    ],
    targetAudience:
      'Ingénieurs BTP, Conducteurs de travaux, Architectes, Maîtres d’ouvrage.',
    detailedModules: [
      'Méthodes de planification et de suivi (Lean Construction).',
      'Gestion des risques, des coûts et de la qualité (HSE).',
      'Coordination des corps de métier et réunions de chantier.',
      'Réception des ouvrages et levée des réserves.',
    ],
  },
  // INGENIERIE FONCIERE ET IMMOBILIERE
  {
    id: 'fonc-promotion-immo',
    title:
      'Techniques Avancées de Promotion Immobilière : Solutions Clé en Main',
    description:
      'De l’étude de faisabilité à la commercialisation, apprenez à monter et réussir des projets immobiliers rentables et sécurisés.',
    duration: 70,
    priceMin: 1000,
    priceMax: 1800,
    participants: 90,
    enrolled: 18,
    thematic: 'Ingénierie Foncière et Immobilière',
    competencyKeys: ['realEstateValuation', 'projectFinance'],
    detailedDescription:
      "Ce programme couvre le cycle complet de la promotion immobilière, incluant l'analyse de rentabilité, l'évaluation foncière, le montage juridique et fiscal des opérations, et les stratégies de marketing immobilier pour maximiser les ventes.",
    learningOutcomes: [
      'Mener une étude de faisabilité et de rentabilité pour tout projet immobilier.',
      'Maîtriser les procédures de sécurisation foncière et les transactions.',
      'Élaborer des stratégies de vente et de négociation immobilière efficaces.',
    ],
    targetAudience:
      'Promoteurs immobiliers, Investisseurs, Agents immobiliers, Géomètres.',
    detailedModules: [
      'Recherche foncière et analyse de marché.',
      "Montage juridique, fiscal et financier de l'opération.",
      'Conception architecturale et marketing des programmes.',
      'Commercialisation, vente et livraison.',
    ],
  },
];

// --- IV. Sessions de Calendrier ---
export const MOCK_SESSIONS: TrainingSession[] = [
  {
    id: 'sess-001',
    moduleId: 'urb-marketing-territorial',
    startDate: '2025-10-25',
    location: 'En ligne (Visio)',
  },
  {
    id: 'sess-002',
    moduleId: 'archi-gestion-chantier',
    startDate: '2025-11-10',
    location: "Abidjan, Côte d'Ivoire",
  },
  {
    id: 'sess-003',
    moduleId: 'fonc-promotion-immo',
    startDate: '2025-11-05',
    location: 'Dakar, Sénégal',
  },
  {
    id: 'sess-004',
    moduleId: 'dece-evaluation-potentiel',
    startDate: '2025-12-01',
    location: 'En ligne (Visio)',
  },
  {
    id: 'sess-005',
    moduleId: 'urb-projets-urbains-bailleur',
    startDate: '2025-09-15', // Passée
    location: 'Ouagadougou, Burkina Faso',
  },
];

// --- V. Offres d'Emploi (texte concret) ---
export const MOCK_JOB_OFFERS: JobOffer[] = [
  {
    id: 1,
    title: 'Chef de Projet SIG Senior',
    location: 'Abidjan',
    contract: 'CDI',
  },
  {
    id: 2,
    title: 'Formateur/Expert en Urbanisme Durable',
    location: 'Dakar/Remote',
    contract: 'CDD',
  },
  {
    id: 3,
    title: 'Assistant(e) de Direction Bilingue',
    location: 'Ouagadougou',
    contract: 'CDI',
  },
];
