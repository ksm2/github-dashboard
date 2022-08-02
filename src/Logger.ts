export class Logger {
  info(message: string): void {
    this.log('INFO   ', message);
  }

  error(message: string): void {
    this.log('ERROR  ', message);
  }

  private log(level: string, message: string): void {
    process.stdout.write(`${new Date().toISOString()} [${level}] ${message}\n`);
  }
}
