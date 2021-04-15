export default class Highlight {
    id: string;
    title: string;
    source: string;
    datetime: Date;
    constructor({ id, source, timestamp, title }: {
        id: any;
        source: any;
        timestamp: any;
        title: any;
    });
    static find(id: any): any;
    static get(limit: number, date: Date, diff: string[]): Highlight[];
}
//# sourceMappingURL=Highlight.d.ts.map