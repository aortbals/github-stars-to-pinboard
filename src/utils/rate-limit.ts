const PLAYBACK =
  process.env.NODE_ENV === 'test' && process.env.JEST_PLAYBACK_MODE === 'play';

/**
 * The `async-sema` rate limit value in seconds for outbound API requests.
 */
export const RATE_LIMIT_SECONDS = (function rateLimitSeconds() {
  if (PLAYBACK) {
    // up to 100 per second
    return 100;
  }

  // Dev default of 1 every 10 seconds
  return 0.25;
})();
