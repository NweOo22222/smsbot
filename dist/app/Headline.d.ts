export default class HeadlineNews {
    id: string;
    title: string;
    source: string;
    datetime: Date;
    constructor({ source, id, timestamp, title }: {
        source: any;
        id: any;
        timestamp: any;
        title: any;
    });
    static fetch(): Promise<HeadlineNews[]>;
    static filter(headlines: HeadlineNews[]): HeadlineNews[];
    static store(headlines: HeadlineNews[]): void;
    static exclude(headlines: HeadlineNews[], sent?: any[]): HeadlineNews[];
    static getLatest(limit?: number, diff?: any[]): HeadlineNews[];
}
//# sourceMappingURL=Headline.d.ts.map