import { Injectable } from '@angular/core';
import { PageTextResult } from "pdf-parse";
import { TextResult } from "pdf-parse";
import { PDFParse } from 'pdf-parse';
import { CivicsTest, QuestionDetails, Questions, SubThematics, Thematics } from "./data";
import { range } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UscisPdfParser {
  private static PDF_PARSER_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/pdf-parse/web/pdf.worker.min.mjs';
  private static USCIS_CIVICS_TEST_PDF_URL = 'assets/2025-Civics-Test-128-Questions-and-Answers.pdf';

  async getPdf(): Promise<void> {
    PDFParse.setWorker(UscisPdfParser.PDF_PARSER_WORKER_URL);
    const parser = new PDFParse({url: UscisPdfParser.USCIS_CIVICS_TEST_PDF_URL});
    parser.getText().then(this.parseData.bind(this)).catch(error => console.error('Error occurred while fetching PDF', error));
  }

  parseData(text: TextResult) {
    console.log(text.getPageText(1));
    const civicsTest= this.parseCoverPage(text.getPageText(1));
    let questionText = '';
    for (let i = 2; i <= 19; i++) {
      const pageText = text.getPageText(i);
      questionText = questionText.concat(pageText.substring(pageText.indexOf('\n') + 1));
    }
    console.log(questionText);
    this.parseQuestionPage(questionText);

  }

  parseCoverPage(text: string): CivicsTest {

    // Text trimmed of pagination + url and the asterisk supposed to be between the parenthesis
    let trimmedText = text.substring(text.split('\n', 2).join('\n').length + 1);

    // version is the first line of this substring
    const version = trimmedText.substring(0, trimmedText.indexOf('\n'));

    // we remove the version
    trimmedText = trimmedText.substring(trimmedText.indexOf('\n') + 1);

    // title is the first line of this substring
    const title = trimmedText.substring(0, trimmedText.indexOf('\n'));

    // the disclaimer is just the rest of the text
    const disclaimer = trimmedText.substring(trimmedText.indexOf('\n') + 1);

    return {
      title: title,
      version: version,
      disclaimer: disclaimer,
      numQuestions: 128,
      thematics: new Map<string, SubThematics>()
    };
  }

  parseQuestionPage(text: string) {
    const thematics: Thematics = new Map<string, SubThematics>();

    let currentThematic = '';
    let currentSubThematic = '';
    let currentQuestion = '';

    text.split('\n').forEach((line: string) => {
      if (!!line.match('\\b\\w{3,}[A-Z]+\\b')) {
        currentThematic = line;
        thematics.set(currentThematic, new Map<string, Questions>());
      } else if (!!line.match('^[A-Z]:')) {
        currentSubThematic = line;
        thematics.get(currentThematic)!.set(currentSubThematic, new Map<string, QuestionDetails>());
      } else if (!!line.match('^\\d+.')) {
        currentQuestion = line;
        console.log(currentThematic, currentSubThematic, currentQuestion);
        thematics.get(currentThematic)!.get(currentSubThematic)!.set(currentQuestion, {is65or20: !!line.match('\\*\\n$'), answers: []});
      } else if (!!line.match('^• ')) {
        thematics.get(currentThematic)!.get(currentSubThematic)!.get(currentQuestion)!.answers.push(line);
      } else {
        console.error("Unknown line does not match any pattern: ", line);
      }
    });

    console.log(thematics);
  }

}
