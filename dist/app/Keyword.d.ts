export default class Keyword {
    text: string;
    protected sent: boolean;
    constructor(text: string);
    get meta(): string;
    onAskHelp(callback: Function): void;
    onAskHeadlines(callback: Function): void;
    onAskCount(callback: Function): void;
    onAskReset(callback: Function): void;
    onAskInfo(callback: Function): void;
    onReset(callback: Function): void;
    onUpdate(callback: Function): void;
    onUnexisted(callback: Function): void;
}
//# sourceMappingURL=Keyword.d.ts.map