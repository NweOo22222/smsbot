import { Configuration } from "./app/Config";

export const config: Configuration = {
  MOBILE_NUMBER: "ဒီဖုန်းနံပါတ်",
  USE_SIMSLOT: -1,
  PER_DAILY_SESSION: 43200000, // 12 hr.
  PER_HOURLY_SESSION: 7200000, // 2 hr.
  SPAM_PROTECTION_TIME: 5000, // 5 sec
  MAX_DAILY_LIMIT: 12,
  MAX_HOURLY_LIMIT: 5,
  MAX_CHARACTER_LIMIT: 165,
  NEWS_PER_SMS: 5,
};
