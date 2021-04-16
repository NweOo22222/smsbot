import { UserAction } from "./Session";
export default class HourlySession {
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
//# sourceMappingURL=HourlySession.d.ts.map