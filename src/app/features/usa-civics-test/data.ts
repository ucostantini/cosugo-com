import { MatchResult } from './answer-matcher';

export type Answer = string;

export type QuestionDetails = {
  id: number;
  is65and20: boolean;
  isVariableAnswer: boolean;
  noAnswers: number;
  answers: Answer[];
};

export type Questions = Map<string, QuestionDetails>

export type SubThematics = Map<string, Questions>

export type Thematics = Map<string, SubThematics>;

export type CivicsTest = {
  title: string;
  version: string;
  disclaimer: string;
  thematics: Thematics;
};

export type STATUS = 'READY' | 'ISSUED' | 'REFUSED' | 'IGNORED';

export type QuestionResult = {
  id: number;
  noQuestion: number;
  question: string;
  is65and20: boolean;
  noAnswers: number;
  status: STATUS;
};

export type QuestionnaireResult = {
  noQuestions: number;
  answers: QuestionResult[];
};
