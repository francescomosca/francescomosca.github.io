// export const _ = ()

export const $ = (selector: string) => document.querySelector(selector);

export const isDevMode = process.env.NODE_ENV === 'development';