import { Component, Input, input, OnChanges, OnInit } from '@angular/core';
import { QuestionDetails, QuestionnaireResult, QuestionResult, Questions, SubThematics, Thematics } from "../data";
import { Question } from "../question/question";
import { GovukAccordionDirective } from "../../../common/directives/govuk-accordion-directive";

@Component({
  selector: 'app-questionnaire',
  imports: [Question, GovukAccordionDirective],
  templateUrl: './questionnaire.html',
  styleUrl: './questionnaire.scss'
})
export class Questionnaire implements OnInit, OnChanges {
  @Input() questionnaire: Thematics | undefined;
  questionnaireResult: QuestionnaireResult | undefined;

  ngOnInit(): void {
    this.initQuestionnaire();
  }

  ngOnChanges(): void {
    this.initQuestionnaire();
  }

  initQuestionnaire(): void {
    if (this.questionnaire) {
      let i = 0;
      const questionResults: QuestionResult[] = [];
      this.questionnaire.forEach((subThematics: SubThematics) =>
        subThematics.forEach((questions: Questions) =>

          questions.forEach((details: QuestionDetails, key: string)=> {
            i++;
            questionResults.push({id: details.id, noQuestion: i, question: key, status: 'READY', is65or20: details.is65or20, noAnswers: details.noAnswers});
          })));
      this.questionnaireResult = {noQuestions: i, answers: questionResults};
    }
  }

  onAnswerMatch($event: QuestionResult) {
    this.questionnaireResult!.answers[$event.noQuestion - 1] = $event;
  }

  getNoAnsweredQuestions() {
    return this.questionnaireResult!.answers.filter(question => question.status !== 'READY').length;
  }

  getNoCorrectAnswers() {
    return this.questionnaireResult!.answers.filter(question => question.status === 'ISSUED').length;
  }

  getQuestionResultById(id: number): QuestionResult {
    return this.questionnaireResult!.answers.filter(questionResult => questionResult.id === id)[0];
  }

}
