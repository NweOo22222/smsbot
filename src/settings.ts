const MIN = 60 * 1000; // in milliseconds

export const PER_SESSION = 120 * MIN; // 2hours
export const MAX_TOTAL_ACTION = 6;
export const MAX_CHARACTER_COUNT = 3000;
export const MOBILE_NUMBER = process.env.SMS_MOBILE_NUMBER || "ဒီဖုန်းနံပါတ်";
export const USE_SIM_SLOT = process.env.SIM_SLOT || 0;
