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

  is65or20FormControl: FormControl<boolean> = new FormControl(false, {nonNullable: true});

  ngOnInit(): void {
    this.parser.getPdf().subscribe(
      civicsTest => {
        this.civicsTest = civicsTest;
        this.questionnaire = this.get20RandomQuestions(this.is65or20FormControl.defaultValue);
      });

    this.is65or20FormControl.valueChanges.subscribe((value: boolean) => {
      this.questionnaire = this.get20RandomQuestions(value);
    });
  }

  // TODO question with multiple answers not supported
  get20RandomQuestions(is65or20: boolean): Thematics {
    const questionnaire: Thematics = new Map<string, SubThematics>();
    const NO_QUESTION = 20;
    const TOTAL_NO_QUESTION = 128;

    let totalComputedSize = 0;
    let entryWithMostQuestions: {thematic: string, subThematic: string};
    let biggestSizeAllocation = -1;
    if (is65or20) {
      this.civicsTest!.thematics.forEach((value: SubThematics, key: string) => {
        questionnaire.set(key, new Map<string, Questions>() as SubThematics);
        value.forEach((subValue: Questions, subKey: string) => {
          questionnaire.get(key)?.set(subKey, new Map<string, QuestionDetails>() as Questions);
          subValue.forEach((subsubValue: QuestionDetails, subsubkey: string) => {
            if (subsubValue.is65or20) {
              questionnaire.get(key)?.get(subKey)?.set(subsubkey, subsubValue);
            }
          });
        });
      });
    } else {
      this.civicsTest!.thematics.forEach((value: SubThematics, key: string) => {
        questionnaire.set(key, new Map<string, Questions>() as SubThematics);
        value.forEach((subValue: Questions, subKey: string) => {
          questionnaire.get(key)?.set(subKey, new Map<string, QuestionDetails>() as Questions);
          let sizeAllocation: number = Math.round(subValue.size * (NO_QUESTION / TOTAL_NO_QUESTION));
          totalComputedSize += sizeAllocation;
          if (sizeAllocation > biggestSizeAllocation) {
            biggestSizeAllocation = sizeAllocation;
            entryWithMostQuestions = {thematic: key, subThematic: subKey};
          }

          const tmpQuestions: [string, QuestionDetails][] = Array.from(subValue.entries());
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
    }

    return questionnaire;
  }
}
