export default class Article {
    id: string;
    content: string;
    image: string;
    title: string;
    source: string;
    link: string;
    constructor({ id, content, image, title, source, link }: {
        id: any;
        content: any;
        image: any;
        title: any;
        source: any;
        link: any;
    });
    static update(): Promise<any>;
    static store(): void;
}
//# sourceMappingURL=Article.d.ts.map