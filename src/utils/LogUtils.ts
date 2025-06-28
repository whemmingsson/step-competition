export const getLogger = (context: string) => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log: (message?: string, ...optionalParams: any[]) => {
      if (import.meta.env.VITE_ENABLE_LOGGING === "true") {
        console.log(`[${context}] ${message}`, ...optionalParams);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (message?: string, ...optionalParams: any[]) => {
      if (import.meta.env.VITE_ENABLE_LOGGING === "true") {
        console.error(`[${context}] ${message}`, ...optionalParams);
      }
    },
  };
};
