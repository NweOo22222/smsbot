export default class Analytic {
    timestamp: number;
    constructor({ timestamp }: {
        timestamp: any;
    });
    save(): void;
    static init(): void;
    static all(): Analytic[];
    static today(): Analytic[];
    static store(analytic: Analytic[]): void;
}
//# sourceMappingURL=Analytic.d.ts.map