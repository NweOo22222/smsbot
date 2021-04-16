import Highlight from "./Highlight";
import Credit from "./Credit";
import Headline from "./Headline";
import Session, { UserAction } from "./Session";
declare type Operator = "Telenor" | "Ooredoo" | "MPT" | "MYTEL";
export default class Phone {
    number: string;
    id: string;
    total_count: number;
    first_date: Date;
    headlines: string[];
    highlights: string[];
    credit: Credit;
    operator: Operator;
    session: Session;
    constructor(number: string);
    incr(action: UserAction): this;
    markAsSent(highlights: Highlight[], headlines: Headline[]): this;
    reset(): this;
    save(): this;
    get localNumber(): string;
}
export {};
//# sourceMappingURL=Phone.d.ts.map