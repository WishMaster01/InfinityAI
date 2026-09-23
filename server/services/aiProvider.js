const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const withProviderReliability = async (
  operation,
  {
    timeoutMs = Number(process.env.AI_PROVIDER_TIMEOUT_MS) || 45000,
    retries = Number(process.env.AI_PROVIDER_RETRIES) || 2,
  } = {},
) => {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await Promise.race([
        operation({ signal: controller.signal, attempt }),
        new Promise((_, reject) =>
          controller.signal.addEventListener(
            "abort",
            () => {
              const error = new Error("AI provider request timed out.");
              error.code = "AI_PROVIDER_TIMEOUT";
              error.statusCode = 504;
              reject(error);
            },
            { once: true },
          ),
        ),
      ]);
    } catch (error) {
      lastError = error;
      const retryable =
        error?.code === "AI_PROVIDER_TIMEOUT" ||
        error?.status === 429 ||
        error?.status >= 500 ||
        error?.response?.status >= 500;
      if (!retryable || attempt === retries) throw error;
      await sleep(250 * 2 ** attempt);
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError;
};
