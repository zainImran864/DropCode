/** Normalized result of running code through Piston. */
export interface RunResult {
  language: string;
  version: string;
  stdout: string;
  stderr: string;
  code: number;
  output: string;
  compileOutput: string | null;
}
