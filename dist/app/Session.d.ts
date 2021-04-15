export interface UserAction {
    total_action: number;
}
export default class Session {
    expired: Date;
    total_action: number;
    constructor({ expired, total_action }: {
        expired: any;
        total_action: any;
    });
    incr(action: UserAction): this;
    restart(): void;
    isExpired(): boolean;
    isDenied(): boolean;
    isReachedLimit(): boolean;
    get exceedTotalAction(): boolean;
    get remaining(): number;
}
//# sourceMappingURL=Session.d.ts.map