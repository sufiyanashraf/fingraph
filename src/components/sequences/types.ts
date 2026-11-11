export type TopicLevel = 'Beginner' | 'Foundation' | 'Intermediate' | 'Advanced' | 'University';

export type SequenceTopicId =
  | 'basics'
  | 'ap'
  | 'gp'
  | 'hp'
  | 'means'
  | 'special'
  | 'finite_infinite'
  | 'decimals'
  | 'sigma'
  | 'telescoping'
  | 'convergence'
  | 'tests'
  | 'power_series'
  | 'taylor_maclaurin'
  | 'binomial';

export interface SequenceFormula {
  name: string;
  formula: string;
  condition?: string;
  description: string;
}

export interface CommonMistake {
  title: string;
  description: string;
  correction: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  stepByStep: string[];
}

export interface TopicAction {
  id: string;
  label: string;
  description?: string;
}

export interface WorkedExample {
  problem: string;
  step1Identify: string;
  step2Method: string;
  step3Substitute: string;
  step4Simplify: string;
  step5Answer: string;
}

export type VisualType =
  | 'pattern'
  | 'partial_sums'
  | 'telescoping'
  | 'means'
  | 'convergence'
  | 'taylor'
  | 'binomial'
  | 'decimals'
  | 'none';

export interface SubtopicData {
  id: string;
  title: string;
  shortDesc: string;
  level: TopicLevel;
  definition: string;
  classicNote?: string;
  formulas: SequenceFormula[];
  inputLabel: string;
  inputPlaceholder: string;
  defaultInput: string;
  defaultInputSecondary?: string;
  inputSecondaryLabel?: string;
  examplePills: string[];
  actions: TopicAction[];
  defaultAction: string;
  workedExample: WorkedExample;
  commonMistakes: CommonMistake[];
  practiceQuestions: PracticeQuestion[];
  visualType: VisualType;
}

export interface MajorTopic {
  id: SequenceTopicId;
  number: string;
  title: string;
  shortTitle: string;
  level: TopicLevel;
  roadmapStage: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  subtopics: SubtopicData[];
}

export interface SolverOutput {
  success: boolean;
  action: string;
  topicTitle: string;
  givenValues: { label: string; value: string | number }[];
  formulaUsed: string;
  step1Identify: string;
  step2Method: string;
  step3Substitute: string;
  step4Simplify: string;
  step5Answer: string;
  decimalAnswer?: string;
  visualData?: any;
  notes?: string[];
  error?: string;
}

