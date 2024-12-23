export const logger = {
  error(message: string, error: unknown) {
    console.error(message, {
      type: (error as Error).constructor.name,
      message: (error as Error).message,
      code: (error as { code?: string }).code,
      stack: (error as Error).stack,
      timestamp: new Date().toISOString(),
    });
  },
  info(message: string, data?: Record<string, unknown>) {
    console.log(message, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  },
};
