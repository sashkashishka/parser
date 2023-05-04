export const JWT_SECRET = process.env.JWT_SECRET || 'four-words-all-caps';
export const HASH_SALT = process.env.HASH_SALT;
export const IS_DEV = process.env.NODE_ENV === 'development';
