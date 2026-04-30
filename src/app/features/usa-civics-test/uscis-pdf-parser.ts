import { inject, Injectable } from '@angular/core';
import { PageTextResult } from "pdf-parse";
import { TextResult } from "pdf-parse";
import { PDFParse } from 'pdf-parse';
import { CivicsTest, QuestionDetails, Questions, SubThematics, Thematics } from "./data";
import { first, firstValueFrom, map, Observable, range } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UscisPdfParser {
  private static PDF_PARSER_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/pdf-parse/web/pdf.worker.min.mjs';
  private static USCIS_CIVICS_TEST_PDF_URL = 'assets/2025-Civics-Test-128-Questions-and-Answers.pdf';
  private readonly http: HttpClient = inject(HttpClient);

  getPdf(): Observable<CivicsTest> {
    return this.http.get('assets/usa-civics-test.txt', { responseType: 'text' }).pipe(
      map(this.parseCoverPage.bind(this)),
      first()
    );
  }

  parseCoverPage(text: string): CivicsTest {

    // We split the rest of the text with the proprietary separator. First part is the disclaimer, second part are the questions
    const disclaimerAndQuestions: string[] = text.split('##########');

    // version is the first line of this substring
    const version = disclaimerAndQuestions[0].substring(0, disclaimerAndQuestions[0].indexOf('\n'));

    // we remove the version
    disclaimerAndQuestions[0] = disclaimerAndQuestions[0].substring(disclaimerAndQuestions[0].indexOf('\n') + 1);

    // title is the first line of this substring
    const title = disclaimerAndQuestions[0].substring(0, disclaimerAndQuestions[0].indexOf('\n'));

    // the disclaimer is just the rest of the text
    const disclaimer = disclaimerAndQuestions[0].substring(disclaimerAndQuestions[0].indexOf('\n') + 1);

    return {
      title: title,
      version: version,
      disclaimer: disclaimer,
      thematics: this.parseQuestionPage(disclaimerAndQuestions[1])
    };
  }

  parseQuestionPage(text: string): Thematics {
    const thematics: Thematics = new Map<string, SubThematics>();

    let currentThematic = '';
    let currentSubThematic = '';
    let currentQuestion = '';

    text.split('\n').forEach((line: string) => {
      if (!!line.match('\\b\\w{5,}[A-Z]+\\b')) {
        currentThematic = line;
        thematics.set(currentThematic, new Map<string, Questions>());
      } else if (!!line.match('^[A-Z]:')) {
        currentSubThematic = line;
        thematics.get(currentThematic)!.set(currentSubThematic, new Map<string, QuestionDetails>());
      } else if (!!line.match('^\\d+.')) {
        const is65or20 = !!line.match('\\*');
        if (is65or20) {
          line = line.replace(' *', '');
        }
        let isVariableAnswer = false;
        if (!!line.match('###')) {
          isVariableAnswer = true;
          line = line.replace('###', '');
        }
        let noAnswers = 1;
        if (!!line.match('--\\d')) {
          const tmp = line.match('--\\d')![0].replace('--', '');
          noAnswers = Number(tmp);
          line = line.replace(/--\d/, '');
        }
        const splitResult = line.split(/^(\d+)\.\s*(.*)$/);
        currentQuestion = splitResult[2];
        thematics.get(currentThematic)!.get(currentSubThematic)!.set(currentQuestion, {id: Number(splitResult[1]), is65or20: is65or20, isVariableAnswer: isVariableAnswer, noAnswers: noAnswers, answers: []});
      } else if (!!line.match('^• ')) {
        line = line.replace('• ', '');
        thematics.get(currentThematic)!.get(currentSubThematic)!.get(currentQuestion)!.answers.push(line);
      } else if(line.length != 0) {
        console.error("Unknown line does not match any pattern: ", line);
      }
    });
    return thematics;
  }

}
