const DEFAULT_ERROR = "We encountered an unexpected issue while generating your storybook. Please try again.";

/** Convert server errors to plain text that is safe and useful to show customers. */
export function formatGenerationError(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return DEFAULT_ERROR;

  const message = value.trim();
  if (/\b504\b|gateway[\s-]*time[\s-]*out|timed?\s*out|timeout/i.test(message)) {
    return "Book generation took too long and the service timed out. Please try again.";
  }

  try {
    const parsed: unknown = JSON.parse(message);
    if (typeof parsed === "string" && parsed !== message) return formatGenerationError(parsed);
    if (parsed && typeof parsed === "object" && "message" in parsed) {
      return formatGenerationError(parsed.message);
    }
  } catch {
    // Most errors are already plain text rather than JSON.
  }

  if (/<\/?[a-z][^>]*>|&lt;\/?[a-z]/i.test(message)) return DEFAULT_ERROR;
  return message;
}
