import { FileText, Building2, Activity } from 'lucide-angular';

// Interface for chat messages
export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

// Interface for analysis results
export interface AnalysisResults {
  energyUsage: number;
  recommendations: string[];
  simulationData: { month: string; usage: number }[];
}

// Interface for features
export interface Feature {
  title: string;
  description: string;
  icon: any; // Using 'any' since we're importing Lucide icons
  action: () => void;
  examples: string[];
}

export const mockFeatures: Feature[] = [
  {
    title: 'File Processing',
    description: 'Upload and analyze building documents',
    icon: FileText,
    action: () => {}, // Will be overridden in component
    examples: [
      'Upload IDF files for energy simulation',
      'Process building documentation',
      'Extract data from PDFs and drawings',
    ],
  },
  {
    title: '3D Visualization',
    description: 'Interactive building model viewer',
    icon: Building2,
    action: () => {},
    examples: [
      'View 3D building models',
      'Analyze building components',
      'Explore architectural details',
    ],
  },
  {
    title: 'Energy Analysis',
    description: 'Comprehensive energy performance insights',
    icon: Activity,
    action: () => {},
    examples: [
      'Generate energy audit reports',
      'Simulate building performance',
      'Get optimization recommendations',
    ],
  },
];

export const mockChats: {
  [key: string]: ChatMessage[];
} = {
  'Office Building Analysis': [
    {
      sender: 'AI',
      message: 'Analyzing office energy data...',
      timestamp: '10:00 AM',
    },
    {
      sender: 'User',
      message: 'What’s the HVAC efficiency?',
      timestamp: '10:01 AM',
    },
    {
      sender: 'AI',
      message: 'HVAC efficiency is at 85%. Suggest upgrading.',
      timestamp: '10:02 AM',
    },
  ],
  'Residential Complex Audit': [
    {
      sender: 'AI',
      message: 'Residential audit complete.',
      timestamp: '9:30 AM',
    },
    {
      sender: 'User',
      message: 'Any insulation recommendations?',
      timestamp: '9:31 AM',
    },
  ],
  'Shopping Mall Energy Sim': [
    {
      sender: 'AI',
      message: 'Simulation running for mall...',
      timestamp: '11:00 AM',
    },
  ],
  'Hospital HVAC Analysis': [
    { sender: 'AI', message: 'HVAC analysis started.', timestamp: '8:00 AM' },
  ],
  'School Building Review': [
    {
      sender: 'AI',
      message: 'School review in progress.',
      timestamp: '2:00 PM',
    },
  ],
  'Data Center Optimization': [
    {
      sender: 'AI',
      message: 'Optimizing data center cooling.',
      timestamp: '3:00 PM',
    },
  ],
};

export const mockAnalysisResults: AnalysisResults = {
  energyUsage: 250000,
  recommendations: [
    'Upgrade HVAC system efficiency',
    'Implement smart lighting controls',
    'Improve building envelope insulation',
  ],
  simulationData: [
    { month: 'Jan', usage: 25000 },
    { month: 'Feb', usage: 22000 },
    { month: 'Mar', usage: 20000 },
  ],
};
