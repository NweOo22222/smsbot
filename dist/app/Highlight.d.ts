interface NewsArticle {
    id: string;
    title: string;
    source: string;
    timestamp: number;
}
export default class Highlight {
    id: string;
    title: string;
    source: string;
    timestamp: number;
    createdAt: Date;
    constructor(highlight: NewsArticle);
    static find(id: any): any;
    static get(limit: number, date: Date, diff: string[]): Highlight[];
}
export {};
//# sourceMappingURL=Highlight.d.ts.map