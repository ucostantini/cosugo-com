import { Component, inject, OnInit, output } from '@angular/core';
import { UscisPdfParser } from '../uscis-pdf-parser';
import { CivicsTest, QuestionDetails, Questions, SubThematics, Thematics } from "../data";
import { Questionnaire } from "../questionnaire/questionnaire";
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-test.component',
  imports: [Questionnaire, ReactiveFormsModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit {
  private readonly parser: UscisPdfParser = inject(UscisPdfParser);
  civicsTest: CivicsTest | undefined;
  questionnaire: Thematics | undefined;

  is65and20FormControl: FormControl<boolean> = new FormControl(false, {nonNullable: true});

  ngOnInit(): void {
    this.parser.getPdf().subscribe(
      civicsTest => {
        this.civicsTest = civicsTest;
        this.questionnaire = this.getXRandomQuestions(this.is65and20FormControl.defaultValue);
      });

    this.is65and20FormControl.valueChanges.subscribe((value: boolean) => {
      this.questionnaire = this.getXRandomQuestions(value);
    });
  }

  getXRandomQuestions(is65and20: boolean): Thematics {
    const questionnaire: Thematics = new Map<string, SubThematics>();
    const NO_QUESTION = is65and20 ? 10 : 20;
    const TOTAL_NO_QUESTION = is65and20 ? 20 : 128;

    let totalComputedSize = 0;
    let entryWithMostQuestions: {thematic: string, subThematic: string};
    let biggestSizeAllocation = -1;

    this.civicsTest!.thematics.forEach((value: SubThematics, key: string) => {
      questionnaire.set(key, new Map<string, Questions>() as SubThematics);
      value.forEach((subValue: Questions, subKey: string) => {
        questionnaire.get(key)?.set(subKey, new Map<string, QuestionDetails>() as Questions);

        const isEligibleQuestion = ([, questionDetails]: [string, QuestionDetails]): boolean =>
          !is65and20 || questionDetails.is65and20;
        const tmpQuestions: [string, QuestionDetails][] = Array.from(subValue.entries()).filter(isEligibleQuestion);

        let sizeAllocation: number = Math.round(tmpQuestions.length * (NO_QUESTION / TOTAL_NO_QUESTION));
        totalComputedSize += sizeAllocation;

        if (sizeAllocation > biggestSizeAllocation) {
          biggestSizeAllocation = sizeAllocation;
          entryWithMostQuestions = {thematic: key, subThematic: subKey};
        }

        while(sizeAllocation > 0) {
          const rnd = Math.floor(Math.random() * tmpQuestions.length);
          const entry: [string, QuestionDetails][] = tmpQuestions.splice(rnd, 1);

          questionnaire.get(key)?.get(subKey)?.set(entry[0][0], entry[0][1]);
          sizeAllocation--;
        }

      });
    });

    while (totalComputedSize > NO_QUESTION) {
      const questions: Questions = questionnaire.get(entryWithMostQuestions!.thematic)!.get(entryWithMostQuestions!.subThematic)!;
      questions.delete(questions.keys().next().value!)
      totalComputedSize--;
    }

    return questionnaire;
  }
}
