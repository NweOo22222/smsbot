import { UserAction } from "./Session";
export default class DailySession {
    expired: Date;
    total_action: number;
    character_count: number;
    notified: Boolean;
    constructor(action: UserAction);
    extend(): this;
    incr(action: UserAction): this;
    reset(): void;
    isExpired(): boolean;
    isDenied(): boolean;
    get remaining(): number;
    get characters(): number;
    get actions(): number;
}
//# sourceMappingURL=DailySession.d.ts.map