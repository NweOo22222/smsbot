export default class Headline {
    id: string;
    title: string;
    source: string;
    datetime: Date;
    constructor({ id, source, datetime, timestamp, title }: {
        id: any;
        source: any;
        datetime: any;
        timestamp: any;
        title: any;
    });
    static find(id: any): any;
    static fetch(): Promise<Headline[]>;
    static store(headlines: Headline[]): void;
    static latest(limit?: any, diff?: any[]): Headline[];
}
//# sourceMappingURL=Headline.d.ts.map