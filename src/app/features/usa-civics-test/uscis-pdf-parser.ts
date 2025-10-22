import { Injectable } from '@angular/core';
import { PageTextResult } from "pdf-parse";
import { TextResult } from "pdf-parse";
import { PDFParse } from 'pdf-parse';

@Injectable({
  providedIn: 'root'
})
export class UscisPdfParser {
  private static PDF_PARSER_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdf-parse@latest/dist/pdf-parse/web/pdf.worker.min.mjs';
  private static USCIS_CIVICS_TEST_PDF_URL = 'assets/2025-Civics-Test-128-Questions-and-Answers.pdf';

  async getPdf(): Promise<void> {
    PDFParse.setWorker(UscisPdfParser.PDF_PARSER_WORKER_URL);
    const parser = new PDFParse({url: UscisPdfParser.USCIS_CIVICS_TEST_PDF_URL});
    parser.getText().then(this.parseData).catch(error => console.error('Error occurred while fetching PDF', error));
  }

  parseData(text: TextResult) {
    const page0: string = text.getPageText(1);
    console.log(page0);
    for (const page of text.pages as PageTextResult[]) {
      if (page.num > 2) {
        console.log(page.text)
      }
    }

  }
}
