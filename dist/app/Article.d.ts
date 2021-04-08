export default class Article {
    id: string;
    title: string;
    content: string;
    source: string;
    link: string;
    image: string;
    datetime: Date;
    constructor({ id, content, source, datetime, title, link, image }: {
        id: any;
        content: any;
        source: any;
        datetime: any;
        title: any;
        link: any;
        image: any;
    });
    static fetch(): Promise<Article[]>;
    static store(articles: Article[]): void;
}
//# sourceMappingURL=Article.d.ts.map