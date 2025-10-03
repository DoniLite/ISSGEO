import type { LucideIcon } from 'lucide-react';

// --- NOUVELLES INTERFACES ---

// DTO pour un module de compétence
export interface KeyCompetency {
  key: string; // ID unique ou slug (inchangé)
  title: string; // TITRE CONCRET (ex: 'Planification Urbaine Stratégique')
  description: string; // Description concrète de la compétence
  icon: LucideIcon; // Icône associée
  sectors: string[]; // Liste des secteurs d'activité (texte concret)
  advantages: string[]; // Liste des avantages (texte concret)
}

// DTO pour un module de formation
export interface TrainingModule {
  id: string;
  title: string; // TITRE CONCRET
  description: string; // Description courte concrète
  duration: number; // Durée estimée en heures
  priceMin: number; // Prix minimum estimé
  priceMax: number; // Prix maximum estimé
  participants: number; // Nombre de participants précédents
  enrolled: number; // Nombre d'inscrits en cours
  thematic: string; // Thématique (texte concret)
  competencyKeys: string[]; // Liste des clés des compétences clés (ID/slug)
  // Champs pour la page détaillée
  detailedDescription: string;
  learningOutcomes: string[]; // Objectifs d'apprentissage (texte concret)
  targetAudience: string; // Public cible (texte concret)
  detailedModules: string[]; // Contenu détaillé (plan de cours, texte concret)
}

// DTO pour le calendrier
export interface TrainingSession {
  id: string;
  moduleId: string; // Lien vers le module de formation
  startDate: string; // Date de début (ex: 'YYYY-MM-DD')
  location: string; // Lieu (texte concret)
}

// DTO pour les filtres (Thématique)
export interface Thematic {
  name: string; // Nom concret de la thématique
  slug: string; // Slug (ID) pour les filtres (anciennement 'key')
  icon: LucideIcon;
}

// DTO pour les offres d'emploi
export interface JobOffer {
  id: number;
  title: string;
  location: string;
  contract: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
}
