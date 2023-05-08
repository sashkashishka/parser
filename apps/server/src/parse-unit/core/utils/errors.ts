class CustomError extends Error {
  public code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export class MaxConsecutiveError extends CustomError {}

export class ParseFetchError extends CustomError {}
