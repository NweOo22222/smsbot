import Headline from "./Headline";
export default class Article {
    id: string;
    content: string;
    image: string;
    source: string;
    link: string;
    title: string;
    constructor({ id, title, content, image, source }: {
        id: any;
        title: any;
        content: any;
        image: any;
        source: any;
    });
    find(keyword: any): RegExpMatchArray;
    toHeadline(): Headline;
    static fetchAll(): Article[];
    static update(): Promise<Article[]>;
    static store(articles: Article[]): void;
}
//# sourceMappingURL=Article.d.ts.map