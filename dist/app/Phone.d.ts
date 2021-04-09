import Headline from "./Headline";
import Session, { UserAction } from "./Session";
declare type Operator = "Telenor" | "Ooredoo" | "MPT" | "MYTEL";
export default class Phone {
    number: string;
    id: string;
    total_count: number;
    first_date: Date;
    last_date: Date;
    headlines: string[];
    articles: string[];
    operator: Operator;
    session: Session;
    constructor(number: string);
    toJSON(): object;
    incr(action: UserAction): this;
    markAsSent(headlines: Headline[]): this;
    save(): void;
    get localNumber(): string;
}
export {};
//# sourceMappingURL=Phone.d.ts.map