import Phone from "./Phone";
export default class Message {
    id: string;
    body: string;
    phone: Phone;
    slot: string;
    incoming: boolean;
    datetime: Date;
    constructor({ sim_slot, msg_box, address, timestamps, body, _id }: {
        sim_slot: any;
        msg_box: any;
        address: any;
        timestamps: any;
        body: any;
        _id: any;
    });
    via(operator: string): boolean;
    static fetch(): Promise<Message[]>;
    static inbox(messages: Message[]): Message[];
    static outbox(messages: Message[]): Message[];
}
//# sourceMappingURL=Message.d.ts.map