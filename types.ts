
export interface StyleSuggestion {
  category: string;
  original: string;
  replacement: string;
  explanation: string;
}

export interface TableData {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface TableIdea {
  title: string;
  rational: string;
  suggestedColumns: string[];
}

export interface EditorAnalysis {
  score: number;
  scoreExplanation: string;
  styleSuggestions: StyleSuggestion[];
  improvedText: string;
  tables: TableData[];
  tableIdeas: TableIdea[];
  discussionPoints: string[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
