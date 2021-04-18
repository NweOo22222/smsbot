export default class Keyword {
    text: string;
    protected sent: boolean;
    constructor(text: string);
    get meta(): string;
    onCommonMistake(callback: Function): void;
    onUnmatched(callback: Function): void;
    onSearchContent(callback: Function): void;
    onAskReporter(callback: Function): void;
    onAskHelp(callback: Function): void;
    onAskHeadlines(callback: Function): void;
    onAskRead(callback: Function): void;
    onAskCount(callback: Function): void;
    onAskReset(callback: Function): void;
    onAskInfo(callback: Function): void;
}
//# sourceMappingURL=Keyword.d.ts.map