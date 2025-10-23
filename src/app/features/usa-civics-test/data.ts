export type Answer = string;

export type QuestionDetails = {
  is65or20: boolean;
  answers: Answer[];
};

export type Questions = Map<string, QuestionDetails>

export type SubThematics = Map<string, Questions>

export type Thematics = Map<string, SubThematics>;

export type CivicsTest = {
  title: string;
  version: string;
  disclaimer: string;
  numQuestions: 128;
  thematics: Thematics;
};
