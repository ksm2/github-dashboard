export class Logger {
  info(message: string): void {
    this.log('INFO   ', message);
  }

  private log(level: string, message: string): void {
    process.stdout.write(`${new Date().toISOString()} [${level}] ${message}\n`);
  }
}
