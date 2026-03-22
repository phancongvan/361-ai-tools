export interface Tool {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  tags: string[];
  icon: string;
  rating: number;
  reviews: number;
  pricing: string;
  developer: string;
  website: string;
  features: string[];
}

export const TOOLS: Tool[] = [
  {
    id: 'lumina-ai',
    name: 'Lumina AI',
    description: 'Advanced image generation with neural consistency technology for architectural visualization.',
    longDescription: 'Lumina AI is a state-of-the-art generative model specifically fine-tuned for architectural and interior design visualization. It ensures structural consistency and realistic lighting across multiple generated views of the same concept.',
    category: 'Generative AI',
    tags: ['Design', 'Architecture', '3D'],
    icon: 'Wand2',
    rating: 4.8,
    reviews: 1240,
    pricing: 'Freemium',
    developer: 'Lumina Labs',
    website: 'https://lumina.ai',
    features: ['Neural consistency', '4K export', 'Style transfer', 'API access']
  },
  {
    id: 'codeflow',
    name: 'CodeFlow',
    description: 'Real-time logic debugging and code optimization for large-scale TypeScript applications.',
    longDescription: 'CodeFlow integrates directly into your IDE to provide real-time suggestions, logic debugging, and performance optimization specifically tailored for large TypeScript codebases. It learns from your team\'s coding patterns.',
    category: 'Machine Learning',
    tags: ['Coding', 'Workflow', 'TypeScript'],
    icon: 'Terminal',
    rating: 4.9,
    reviews: 3420,
    pricing: 'Paid',
    developer: 'Flow Systems',
    website: 'https://codeflow.dev',
    features: ['Real-time debugging', 'Pattern recognition', 'Automated refactoring']
  },
  {
    id: 'echosynth',
    name: 'EchoSynth',
    description: 'High-fidelity voice synthesis that captures the emotional nuances of human speech naturally.',
    longDescription: 'EchoSynth goes beyond traditional text-to-speech by allowing creators to direct the emotional performance of the AI voice. Adjust pacing, breathiness, and emotional intensity with a simple timeline interface.',
    category: 'Audio & Video',
    tags: ['Speech', 'Marketing', 'Voice'],
    icon: 'Mic',
    rating: 4.7,
    reviews: 890,
    pricing: 'Freemium',
    developer: 'Echo Audio',
    website: 'https://echosynth.io',
    features: ['Emotional control', 'Voice cloning', 'Multi-language support']
  },
  {
    id: 'insightcore',
    name: 'InsightCore',
    description: 'Predictive market analytics engine for retail businesses looking to optimize supply chains.',
    longDescription: 'InsightCore ingests your historical sales data, current inventory levels, and macroeconomic indicators to predict demand spikes and suggest optimal supply chain routing to minimize costs and stockouts.',
    category: 'Machine Learning',
    tags: ['Data', 'Commerce', 'Analytics'],
    icon: 'BarChart',
    rating: 4.6,
    reviews: 512,
    pricing: 'Enterprise',
    developer: 'Core Analytics',
    website: 'https://insightcore.com',
    features: ['Demand forecasting', 'Supply chain optimization', 'Custom dashboards']
  },
  {
    id: 'nexus-write',
    name: 'Nexus Write',
    description: 'Context-aware copywriting assistant that maintains brand voice across all marketing channels.',
    longDescription: 'Nexus Write allows you to upload your brand guidelines, past successful campaigns, and target audience personas. It then generates copy that perfectly aligns with your brand voice for emails, social media, and landing pages.',
    category: 'Generative AI',
    tags: ['Copywriting', 'Marketing', 'Content'],
    icon: 'PenTool',
    rating: 4.5,
    reviews: 2100,
    pricing: 'Paid',
    developer: 'Nexus Media',
    website: 'https://nexuswrite.ai',
    features: ['Brand voice training', 'Multi-channel formats', 'A/B testing suggestions']
  },
  {
    id: 'visionary-vid',
    name: 'VisionaryVid',
    description: 'Text-to-video generation platform focused on creating high-quality educational content.',
    longDescription: 'VisionaryVid specializes in turning scripts and lesson plans into engaging educational videos. It automatically generates relevant B-roll, animations, and on-screen text to keep learners engaged.',
    category: 'Audio & Video',
    tags: ['Video', 'Education', 'Content'],
    icon: 'Video',
    rating: 4.4,
    reviews: 750,
    pricing: 'Freemium',
    developer: 'Visionary Ed',
    website: 'https://visionaryvid.com',
    features: ['Script-to-video', 'Auto-captioning', 'Educational templates']
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Tools', icon: 'LayoutGrid' },
  { id: 'ml', label: 'Machine Learning', icon: 'Brain' },
  { id: 'genai', label: 'Generative AI', icon: 'Sparkles' },
  { id: 'av', label: 'Audio & Video', icon: 'Video' },
  { id: 'copy', label: 'Copywriting', icon: 'PenTool' },
];

export const PRICING_OPTIONS = ['Free', 'Freemium', 'Paid', 'Enterprise'];
