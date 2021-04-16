import { UserAction } from "./Session";
export default class DailySession {
    expired: Date;
    total_action: number;
    notified: Boolean;
    constructor(action: UserAction);
    extend(): this;
    incr(action: UserAction): this;
    reset(): void;
    isExpired(): boolean;
    isDenied(): boolean;
    get remaining(): number;
}
//# sourceMappingURL=DailySession.d.ts.map