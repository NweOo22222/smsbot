export default class Keyword {
    text: string;
    protected command: boolean;
    protected others: any[];
    protected sent: boolean;
    constructor(text: string);
    onAskHelp(callback: Function): void;
    onAskHeadlines(callback: Function): void;
    onAskRead(callback: Function): void;
    onAskCount(callback: Function): void;
    onAskReset(callback: Function): void;
    onUpdate(callback: Function): void;
    onUnexisted(callback: Function): void;
    get meta(): string;
}
//# sourceMappingURL=Keyword.d.ts.map