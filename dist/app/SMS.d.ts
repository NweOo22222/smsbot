declare type SimSlot = "0" | "1";
export default class SMS {
    static send(phone: string, message: string, sim_slot: SimSlot): Promise<any>;
}
export {};
//# sourceMappingURL=SMS.d.ts.map