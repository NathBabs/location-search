class CustomError extends Error {
  statusCode: number;
  constructor(message: string | undefined, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}


export function customError(error: { message: string; statusCode: number }) { 
    return new CustomError(error.message, error.statusCode);
}

export type CustomTypeError = {
    message: string;
    statusCode: number;
};