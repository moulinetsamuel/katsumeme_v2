export class ApiError<T = unknown> extends Error {
  data?: T;

  constructor(message: string, data?: T) {
    super(message);
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
