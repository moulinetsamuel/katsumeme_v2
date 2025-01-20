export class ApiError<T = unknown> extends Error {
  data?: T;
  status: number;

  constructor(message: string, status: number, data?: T) {
    super(message);
    this.data = data;
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
