export interface UserAction {
    total_action: number;
    read_count: number;
    character_count: number;
}
export default class Session {
    protected expired: Date;
    total_action: number;
    read_count: number;
    character_count: number;
    constructor({ expired, read_count, total_action, character_count }: {
        expired: any;
        read_count: any;
        total_action: any;
        character_count: any;
    });
    incr(action: UserAction): this;
    restart(): void;
    isExpired(): boolean;
    canReadArticle(): boolean;
    isDenied(): boolean;
    get exceedTotalAction(): boolean;
    get exceedCharacterCount(): boolean;
}
//# sourceMappingURL=Session.d.ts.map