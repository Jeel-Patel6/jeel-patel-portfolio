/**
 * Central portfolio data for Jeel Patel.
 * Every fact on the site comes from this file.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

export const profile = {
  fullName: 'Jeel Patel',
  displayName: 'Jeel Patel',
  role: 'AI/ML Student & Developer',
  tagline: ['AI/ML Student', 'Developer', 'Intelligent Systems'],
  intro:
    "Hi, I'm Jeel, a student in Computer Science Engineering, specializing in AI & ML. I'm interested in building intelligent systems, from neural network fundamentals to practical projects. I enjoy turning ideas into working code and learning by building. I'm open to collaborating on projects and hackathons.",
  location: 'India',
  email: 'jeelpatel611@gmail.com',
  links: {
    linkedin: '',
    github: '',
  },
  portrait: {
    src: '/assets/portrait-720.webp',
    srcSet: '/assets/portrait-420.webp 420w, /assets/portrait-720.webp 720w, /assets/portrait-1100.webp 1100w',
    alt: 'Portrait of Jeel Patel',
  },
  interests: ['Intelligent Systems', 'Neural Networks', 'Practical Machine Learning', 'Hackathons'],
};

export const education = [
  {
    school: 'Computer Science Engineering',
    place: 'Specializing in AI & ML',
    degree: 'Computer Science Engineering (AI & ML)',
    period: 'Current Student',
    score: 'AI & ML Specialization',
  },
];

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  /** Project type, e.g. "Machine Learning" / "Web Application". */
  type: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  /**
   * Repository + deployed links. Currently unconfigured — set them here when
   * repos or live demos are published. Cards render a neutral placeholder until then.
   *   github: 'https://github.com/<user>/<repo>',
   *   demo:   'https://<your-app>.onrender.com',
   */
  github?: string;
  demo?: string;
  /**
   * Real screenshot of the project UI (e.g. '/assets/previews/crop.png').
   * When absent, cards show an intentional art-directed "PROJECT PREVIEW" placeholder.
   */
  preview?: string;
  palette: Palette;
  motif: 'crop' | 'safety' | 'predict' | 'portal' | 'shield' | 'flow' | 'tenants';
};

export const projects: Project[] = [
  {
    id: 'crop-recommendation-model',
    title: 'Crop Recommendation Model',
    year: '2026',
    type: 'Machine Learning',
    logline: 'A machine-learning project exploring crop recommendation.',
    stack: ['Python', 'Machine Learning'],
    build: [
      'A machine-learning project exploring crop recommendation based on agricultural and environmental inputs.',
      'Investigates data-driven techniques to provide intelligent crop suitability guidance.',
    ],
    features: [
      'Crop recommendation exploration',
      'Machine learning modeling pipeline',
      'Data-driven crop suitability evaluation',
    ],
    metrics: [],
    palette: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
    motif: 'crop',
  },
  {
    id: 'landslide-evacuation-safety',
    title: 'Landslide Evacuation and Safety',
    year: '2026',
    type: 'AI / ML',
    logline: 'A project focused on landslide safety and evacuation.',
    stack: ['Python', 'Machine Learning'],
    build: [
      'A project focused on landslide safety and evacuation planning.',
      'Designed to structure hazard response and evaluate evacuation safety protocols.',
    ],
    features: [
      'Landslide hazard safety focus',
      'Evacuation protocol structuring',
      'Intelligent scenario evaluation',
    ],
    metrics: [],
    palette: { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' },
    motif: 'safety',
  },
  {
    id: 'car-price-prediction-model',
    title: 'Car Price Prediction Model',
    year: '2026',
    type: 'Machine Learning',
    logline: 'A team project developed with three team members.',
    stack: ['Python', 'Machine Learning'],
    build: [
      'A team project developed collaboratively with three team members.',
      'Predicts vehicle market pricing using machine-learning approaches and parameter evaluation.',
    ],
    features: [
      'Collaborative team project built with 3 team members',
      'Vehicle valuation and price prediction modeling',
      'Multivariable feature evaluation for pricing',
    ],
    metrics: [
      { value: '3', label: 'team members collaboration' },
    ],
    palette: { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' },
    motif: 'predict',
  },
  {
    id: 'university-portal',
    title: 'University Portal',
    year: '2026',
    type: 'Web Application',
    logline: 'A university portal featuring an attendance tracker and assignment handling.',
    stack: ['Java', 'HTML', 'CSS', 'MySQL'],
    build: [
      'Developed a university portal featuring an attendance tracker and assignment handling.',
      'Created structured workflows for student attendance tracking and assignment submission.',
    ],
    features: [
      'Attendance tracker system',
      'Assignment submission and handling workflow',
      'Responsive academic management interface',
    ],
    metrics: [],
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'portal',
  },
];

export type Skill = { name: string; mono: string };
export type SkillCategory = { id: string; title: string; skills: Skill[] };

/**
 * The skill set in five fixed categories. Each skill appears exactly once;
 * SQL (language) and MySQL (database) are intentionally distinct entries.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    skills: [
      { name: 'Python', mono: 'Py' },
      { name: 'Java', mono: 'Jv' },
      { name: 'SQL', mono: 'Sq' },
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI / Machine Learning',
    skills: [
      { name: 'Scikit-learn', mono: 'Sk' },
      { name: 'NumPy', mono: 'Nm' },
      { name: 'Model Evaluation', mono: 'Ev' },
    ],
  },
  {
    id: 'generative-ai',
    title: 'Generative AI',
    skills: [
      { name: 'Prompt Engineering', mono: 'Pe' },
      { name: 'LLM Integration', mono: 'LL' },
    ],
  },
  {
    id: 'web-development',
    title: 'Web Development',
    skills: [
      { name: 'HTML', mono: 'Ht' },
      { name: 'CSS', mono: 'Cs' },
      { name: 'React', mono: 'Re' },
      { name: 'FastAPI', mono: 'Fa' },
    ],
  },
  {
    id: 'database-tools',
    title: 'Database & Tools',
    skills: [
      { name: 'MySQL', mono: 'My' },
      { name: 'Git', mono: 'Gt' },
      { name: 'GitHub', mono: 'Gh' },
      { name: 'Jupyter Notebook', mono: 'Jn' },
    ],
  },
];

/** Total skills across all categories (for the section meta). */
export const totalSkills = skillCategories.reduce((n, c) => n + c.skills.length, 0);

/** How I actually solve problems — the working method behind the projects. */
export const processSteps = [
  {
    step: '01',
    title: 'Understand the Problem',
    body: 'Identify the real problem, the people it affects, and the constraints around it — before writing any code. If the problem is stated vaguely, sharpen it first.',
  },
  {
    step: '02',
    title: 'Research and Explore',
    body: 'Look at possible approaches, existing solutions, relevant technologies, and the data available. Find what is already solved and where the interesting work is.',
  },
  {
    step: '03',
    title: 'Design the Solution',
    body: 'Decide the architecture, the technical approach, and the implementation strategy. Structure the workflow so each piece has a clear responsibility.',
  },
  {
    step: '04',
    title: 'Build and Experiment',
    body: 'Develop, test ideas as they come up, and iterate. When working with a team, keep the pieces small enough that everyone can move without blocking each other.',
  },
  {
    step: '05',
    title: 'Evaluate and Improve',
    body: 'Validate the outcome against the original problem, identify the weak spots honestly, and refine. Shipping is not the finish line — understanding why it works is.',
  },
];

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };

/**
 * Fixed page structure.
 * The Collaboration (contact) section is rendered after all of these, outside the loop.
 */
export type SectionId = 'about' | 'process' | 'projects' | 'skills';

export const sectionOrder: SectionId[] = ['about', 'process', 'projects', 'skills'];

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'About', card: 'About Me', meta: 'Background & focus', palette: violet },
  process: { nav: 'Process', card: 'How I Solve Problems', meta: 'Working method', palette: amber },
  projects: { nav: 'Projects', card: 'My Projects', meta: `${projects.length} Projects · 2026`, palette: crimson },
  skills: { nav: 'Skills', card: 'My Skills', meta: `5 Categories · ${totalSkills} Skills`, palette: ocean },
};
