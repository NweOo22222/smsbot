export default class Headline {
    id: string;
    title: string;
    source: string;
    datetime: Date;
    constructor({ source, id, datetime, title }: {
        source: any;
        id: any;
        datetime: any;
        title: any;
    });
    static filter(headlines: Headline[]): Headline[];
    static exclude(headlines: Headline[], sent?: any[]): Headline[];
    static latest(limit?: number, diff?: any[]): Headline[];
}
//# sourceMappingURL=Headline.d.ts.map