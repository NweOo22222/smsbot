import Phone from "./Phone";
export default class Message {
    body: string;
    phone: Phone;
    constructor({ address, body }: {
        address: any;
        body: any;
    });
    via(operator: string): boolean;
    static fetch(): Promise<Message[]>;
}
//# sourceMappingURL=Message.d.ts.map