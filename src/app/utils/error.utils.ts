export const createError = (
  statusCode: number,
  message: string,
  error?: any
) => {
  const err = new Error(message) as any;
  err.statusCode = statusCode;
  if (error) err.error = error;
  return err;
};
