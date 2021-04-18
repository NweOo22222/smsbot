import { UserAction } from "./Session";
export default class HourlySession {
    expired: Date;
    total_action: number;
    notified: Boolean;
    character_count: number;
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
//# sourceMappingURL=HourlySession.d.ts.map