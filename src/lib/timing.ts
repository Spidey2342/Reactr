/**
 * Auto-advancing screens (splash, countdown, intro, waiting, result timer, pick timer) read this.
 * The e2e audit sets window.__REACTR_FREEZE__ so a screen stays put long enough to be inspected.
 */
export const frozen = (): boolean => Boolean((globalThis as { __REACTR_FREEZE__?: boolean }).__REACTR_FREEZE__)
