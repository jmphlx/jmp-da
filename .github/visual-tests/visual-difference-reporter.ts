import {FullResult, Reporter, TestCase, TestResult} from '@playwright/test/reporter';
import {writeFileSync} from 'fs';

class MyReporter implements Reporter {
  private testResults: { [key: string]: TestResult } = {};
  private testCases: { [key: string]: TestCase } = {};
  private _outputFile: string | undefined;

  constructor(options: { outputFile?: string } = {}) {
    this._outputFile = options.outputFile;
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.testResults[test.id] = result;
    this.testCases[test.id] = test;
  }

  onEnd(result: FullResult) {
    const failures = Object.entries(this.testResults)
      .filter(([id, result]) => result.status !== 'passed');

    let summary = ''
    if (failures.length > 0) {
      summary += `### :small_orange_diamond: This branch has ${failures.length} visual difference${failures.length > 1 ? 's' : ''} compared to the main branch.\n`;
      for (const [id, result] of failures) {
        const test: TestCase = this.testCases[id];
        if (result.status !== 'passed') {
          summary += `${result.error.message}\n`;
        }
      }

      if(process.env.GITHUB_SERVER_URL) {
      summary += '\n\n' +
        `See [diff images in the artifact "screenshots"](${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID})`;
      }
    } else {
      summary += `All ${Object.keys(this.testResults).length} tests passed.\n`;
    }

    if (this._outputFile) {
      writeFileSync(this._outputFile, summary);
    } else {
      console.log(summary);
    }
  }
}

export default MyReporter;