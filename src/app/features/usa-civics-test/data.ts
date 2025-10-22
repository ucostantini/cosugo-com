export type Answer = {
  answer: string;
};

export type Question = {
  question: string;
  is65or20: boolean;
  answers: Answer[];
};

export type SubThematic = {
  name: string;
  questions: Question[];
};


export type Thematic = {
  name: string;
  subThematics: SubThematic[]
};

export type CivicsTest = {
  title: string;
  version: string;
  disclaimer: string;
  numQuestions: 128;
  thematics: Thematic[];
};
