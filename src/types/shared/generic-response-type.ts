export type GenericResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};
