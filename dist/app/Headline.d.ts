export default class Headline {
    id: string;
    title: string;
    source: string;
    timestamp: number;
    createdAt: Date;
    constructor({ id, source, timestamp, createdAt, title }: {
        id: any;
        source: any;
        timestamp: any;
        createdAt: any;
        title: any;
    });
    static find(id: any): any;
    static store(headlines: Headline[]): void;
    static latest(limit?: any, diff?: any[]): Headline[];
}
//# sourceMappingURL=Headline.d.ts.map