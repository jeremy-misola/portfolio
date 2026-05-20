import fs from 'fs/promises';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');

const defaultSettings = {
  id: 1,
  fullName: 'Jeremy Misola',
  headline_en: 'Cloud & Platform Engineer focused on Kubernetes and observability',
  headline_fr: 'Ingenieur Cloud et Plateforme axe Kubernetes et observabilite',
  bio_en:
    'Computer Science student focused on Kubernetes platform engineering, GitOps, observability, and infrastructure automation.',
  bio_fr:
    'Etudiant en informatique axe sur l ingenierie de plateforme Kubernetes, GitOps, observabilite et automatisation de l infrastructure.',
  resumeUrl: '',
  email: 'misolarellinj06@gmail.com',
  phone: '514-569-4387',
  location: 'Montreal, QC',
  linkedinUrl: 'https://linkedin.com/in/jeremy-misola-969402302',
  githubUrl: 'https://github.com/jeremy-misola',
};

const defaultSkills = [
  ['1', 'Go', 'Go', 'Languages', 'Advanced'],
  ['2', 'Java', 'Java', 'Languages', 'Advanced'],
  ['3', 'Python', 'Python', 'Languages', 'Advanced'],
  ['4', 'SQL', 'SQL', 'Languages', 'Intermediate'],
  ['5', 'Azure', 'Azure', 'Cloud & Orchestration', 'Intermediate'],
  ['6', 'Kubernetes', 'Kubernetes', 'Cloud & Orchestration', 'Advanced'],
  ['7', 'Kubebuilder', 'Kubebuilder', 'Cloud & Orchestration', 'Advanced'],
  ['8', 'Docker', 'Docker', 'Cloud & Orchestration', 'Advanced'],
  ['9', 'Terraform', 'Terraform', 'Cloud & Orchestration', 'Advanced'],
  ['10', 'Ansible', 'Ansible', 'Cloud & Orchestration', 'Intermediate'],
  ['11', 'Istio', 'Istio', 'Distributed Systems', 'Intermediate'],
  ['12', 'Longhorn', 'Longhorn', 'Distributed Systems', 'Intermediate'],
  ['13', 'OpenTelemetry', 'OpenTelemetry', 'Distributed Systems', 'Intermediate'],
  ['14', 'Envoy', 'Envoy', 'Distributed Systems', 'Intermediate'],
  ['15', 'GitOps (ArgoCD)', 'GitOps (ArgoCD)', 'DevOps/SRE', 'Advanced'],
  ['16', 'LGTM Stack', 'Pile LGTM', 'DevOps/SRE', 'Advanced'],
  ['17', 'CI/CD Pipelines', 'Pipelines CI/CD', 'DevOps/SRE', 'Advanced'],
].map(([id, name_en, name_fr, category, level], index) => ({
  id,
  name_en,
  name_fr,
  category,
  level,
  displayOrder: index + 1,
}));

const defaultEducation = [
  {
    id: '1',
    school: 'Concordia University',
    location: 'Montreal, QC',
    degree_en: 'Bachelor of Computer Science',
    degree_fr: 'Baccalaureat en informatique',
    startDate: '2026-08-01',
    endDate: '2029-05-31',
    description_en: 'Bachelor of Computer Science program.',
    description_fr: 'Programme de baccalaureat en informatique.',
    displayOrder: 1,
  },
  {
    id: '2',
    school: 'Champlain College Saint-Lambert',
    location: 'Saint-Lambert, QC',
    degree_en: 'Diploma of College Studies (DEC) in Computer Science',
    degree_fr: 'Diplome d etudes collegiales (DEC) en informatique',
    startDate: '2023-08-01',
    endDate: '2026-06-30',
    description_en: 'Computer Science DEC program.',
    description_fr: 'Programme DEC en informatique.',
    displayOrder: 2,
  },
];

const defaultHobbies = [
  {
    id: '1',
    name_en: 'Capture The Flag (CTF)',
    name_fr: 'Capture The Flag (CTF)',
    description_en: 'Security and reverse engineering challenges.',
    description_fr: 'Defis de securite et d ingenierie inverse.',
    displayOrder: 1,
  },
  {
    id: '2',
    name_en: 'Hackathons',
    name_fr: 'Hackathons',
    description_en: 'Building AI and cloud prototypes under time constraints.',
    description_fr: 'Construction de prototypes IA et cloud sous contraintes de temps.',
    displayOrder: 2,
  },
  {
    id: '3',
    name_en: 'Homelab Engineering',
    name_fr: 'Ingenierie Homelab',
    description_en: 'Designing and automating self-hosted Kubernetes infrastructure.',
    description_fr: 'Conception et automatisation d une infrastructure Kubernetes auto-hebergee.',
    displayOrder: 3,
  },
];

async function readDataFile(filename, fallback) {
  try {
    const filePath = path.join(dataDirectory, filename);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.warn(`Falling back to in-memory ${filename} data:`, error?.code || error?.message || error);
    return fallback;
  }
}

export async function getProjectsFallback() {
  return readDataFile('projects.json', []);
}

export async function getExperienceFallback() {
  return readDataFile('experience.json', []);
}

export async function getTestimonialsFallback() {
  const testimonials = await readDataFile('testimonials.json', []);
  return Array.isArray(testimonials)
    ? testimonials.filter((testimonial) => testimonial.status === 'approved')
    : [];
}

export async function getSkillsFallback() {
  return defaultSkills;
}

export async function getEducationFallback() {
  return defaultEducation;
}

export async function getHobbiesFallback() {
  return defaultHobbies;
}

export async function getSettingsFallback() {
  return defaultSettings;
}
