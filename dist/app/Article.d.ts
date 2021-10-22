import Headline from "./Headline";
export default class Article {
    id: string;
    content: string;
    image: string;
    source: string;
    link: string;
    title: string;
    timestamp: number;
    createdAt: Date;
    constructor({ id, title, content, image, source, timestamp }: {
        id: any;
        title: any;
        content: any;
        image: any;
        source: any;
        timestamp: any;
    });
    find(keyword: any): RegExpMatchArray;
    toHeadline(): Headline;
    static fetchAll(): Article[];
    static update(limit?: number): Promise<Article[]>;
    static store(articles: Article[]): void;
}
//# sourceMappingURL=Article.d.ts.map