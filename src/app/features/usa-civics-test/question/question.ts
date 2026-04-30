import { Component, inject, Input, output, OutputEmitterRef } from '@angular/core';
import { Answer, QuestionDetails, QuestionResult, STATUS } from "../data";
import { Product } from '../../product-nutrition-comparison/data';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AnswerMatcher, HIGH_THRESHOLD, LOW_THRESHOLD, MatchResult } from "../answer-matcher";

@Component({
  selector: 'app-question',
  imports: [ReactiveFormsModule],
  templateUrl: './question.html',
  styleUrl: './question.scss',
})
export class Question {
  @Input() question: string | undefined;
  @Input() details: QuestionDetails | undefined;
  @Input() result: QuestionResult | undefined;

  answerResultEmitter: OutputEmitterRef<QuestionResult> = output<QuestionResult>();
  answerResult: QuestionResult | undefined;
  readonly answerMatcher: AnswerMatcher = inject(AnswerMatcher);

  acceptableAnswers: MatchResult[] | undefined;
  answer: FormControl<string> = new FormControl('', {nonNullable: true});

  onSubmit(): void {
    this.acceptableAnswers = this.answerMatcher.matchAnswer(this.answer.value, this.details!.answers, this.details!.noAnswers);
    this.answerResult = {id: this.result!.id, noQuestion: this.result!.noQuestion, question: this.result!.question, status: this.determineQuestionResultStatus(this.acceptableAnswers), is65or20: this.result!.is65or20, noAnswers: this.result!.noAnswers};
    this.answerResultEmitter.emit(this.answerResult);
  }

  private determineQuestionResultStatus(answers: MatchResult[]): STATUS {
    return answers.map(answer => answer.score).filter(score => score >= LOW_THRESHOLD).length >= this.details!.noAnswers ? 'ISSUED' : 'REFUSED';
  }
}
