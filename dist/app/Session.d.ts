import DailySession from "./DailySession";
import HourlySession from "./HourlySession";
export interface UserAction {
    total_action?: number;
    expired?: Date;
    notified?: Boolean;
}
export interface UserSession {
    daily: UserAction;
    hourly: UserAction;
    banned?: Boolean;
    disabled?: Boolean;
    unlimited?: Boolean;
}
export default class Session {
    hourly: HourlySession;
    daily: DailySession;
    banned: Boolean;
    disabled: Boolean;
    unlimited: Boolean;
    constructor(session: UserSession);
    extend(): void;
    reset(): void;
    incr(action: UserAction): this;
}
//# sourceMappingURL=Session.d.ts.map