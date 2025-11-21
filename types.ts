export enum SkillCategory {
  Technical = 'Technical',
  Soft = 'Soft',
  Domain = 'Domain',
}

export interface SkillPoint {
  skillName: string;
  category: SkillCategory;
  currentProficiency: number; // 0-100
  requiredProficiency: number; // 0-100
  gapReason: string;
}

export interface ActionItem {
  title: string;
  description: string;
  projectPrompt: string;
  estimatedTime: string;
  learningResourceQuery: string; // New field for search query
}

export interface InterviewQuestion {
  question: string;
  expectedKeyPoints: string;
}

export interface AnalysisResult {
  matchScore: number; // 0-100
  summary: string;
  skills: SkillPoint[];
  actionPlan: ActionItem[];
  interviewPrep: InterviewQuestion[];
}

export interface FileUploadState {
  file: File | null;
  previewUrl: string | null;
}