export interface PropertyData {
  address: string;
  status: 'FOR_SALE' | 'RECENTLY_SOLD';
}

export interface AgentData {
  name: string;
  phone: string;
  email: string;
  headshot: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface FormData extends PropertyData, AgentData {}

export interface SocialMediaCaption {
  platform: string;
  type: string;
  caption: string;
  cta: string;
}

export interface ImageSpec {
  type: string;
  description: string;
  dimensions: string;
  overlay: string | null;
  banner: string | null;
}

export interface EmailTemplate {
  name: string;
  type: string;
  html: string;
}

export interface LandingPageData {
  html: string;
  seo: {
    title: string;
    description: string;
  };
}

export interface VideoConcept {
  type?: string;
  title: string;
  description: string;
  duration?: string;
  script?: string;
}

export interface DeliveryPackage {
  social_media: {
    captions: SocialMediaCaption[];
    hashtags: string[];
    imageSpecs: ImageSpec[];
  };
  email: {
    templates: EmailTemplate[];
    subjectLines: string[];
  };
  landing_page: LandingPageData;
  video: {
    concepts: VideoConcept[];
  };
}

export interface AccessLinks {
  dashboard: string;
  landingPage: string;
  downloadPack: string;
}

export interface ActionButton {
  url: string;
  label: string;
}

export interface Actions {
  approve: ActionButton;
  regenerate: ActionButton;
  download: ActionButton;
}

export interface Summary {
  property: string;
  price: string;
  status: string;
  deliverables: {
    socialMediaPosts: string;
    emailTemplates: string;
    landingPage: string;
    videoContent: string;
  };
}

export interface WebhookResponse {
  status: string;
  message: string;
  summary: Summary;
  access: AccessLinks;
  actions: Actions;
  deliveryPackage: DeliveryPackage;
  timestamp: string;
}

export interface GenerationStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  progress: number;
}

export interface SessionData {
  id: string;
  formData: FormData;
  webhookResponse?: WebhookResponse;
  createdAt: string;
}

export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  supportedFormats: string[];
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    color: '#FF0000',
    supportedFormats: ['video', 'description', 'tags']
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    supportedFormats: ['post', 'carousel', 'video']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: '#E4405F',
    supportedFormats: ['feed', 'reels', 'stories']
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    supportedFormats: ['post', 'article']
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: '🐦',
    color: '#000000',
    supportedFormats: ['thread', 'media']
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    supportedFormats: ['video', 'hashtags']
  }
];