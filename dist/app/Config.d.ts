declare type SIMSlot = -1 | 0 | 1;
declare type ConfigKeyName = "MOBILE_NUMBER" | "USE_SIMSLOT" | "MAX_DAILY_LIMIT" | "PER_DAILY_SESSION" | "MAX_HOURLY_LIMIT" | "PER_HOURLY_SESSION" | "MAX_CHARACTER_LIMIT";
export interface Configuration {
    MOBILE_NUMBER: string;
    USE_SIMSLOT: SIMSlot;
    MAX_DAILY_LIMIT: number;
    PER_DAILY_SESSION: number;
    MAX_HOURLY_LIMIT: number;
    PER_HOURLY_SESSION: number;
    MAX_CHARACTER_LIMIT: number;
}
export default class Config {
    static init(): void;
    static read(): object;
    static save(config: object): void;
    static set(keyName: ConfigKeyName | string, value: any): void;
    static get(keyName: ConfigKeyName): string | number;
    static getAll(): Configuration;
}
export {};
//# sourceMappingURL=Config.d.ts.map