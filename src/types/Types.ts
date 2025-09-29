export interface ResultFail<E = unknown> {
  success: false;
  message: string;
  data?: E;
}

export interface ResultSuccess<S> {
  success: true;
  data: S;
  message?: string;
}

export type Result<T, E = unknown> = ResultSuccess<T> | ResultFail<E>;