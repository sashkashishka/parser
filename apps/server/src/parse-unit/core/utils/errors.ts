export class CustomError extends Error {
  public code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export class MaxConsecutiveError extends CustomError {}

// get category id
export class NoAdListParamsError extends CustomError {}

export class GetAdListParamsError extends CustomError {}

// get ad list
export class NoAdListError extends CustomError {}

export class GetAdListError extends CustomError {}
