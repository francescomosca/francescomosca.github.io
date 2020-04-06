// export const _ = ()

/**
 * Fake JQuery selector
 * @param selector
 */
export const $ = (selector: string) => document.querySelector(selector);

export const isDevMode = process.env.NODE_ENV === 'development';