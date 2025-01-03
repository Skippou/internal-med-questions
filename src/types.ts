export interface Question {
  filepath: string;
  specialty: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'ultra-hard';
  id: string;
  title: string;
}

export interface FilterPanelProps {
  questions: Question[];
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

export interface QuestionCardProps {
  question: Question;
  isViewed: boolean;
  onView: () => void;
}
