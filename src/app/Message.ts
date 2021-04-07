import axios from "axios";
import Phone from "./Phone";

export default class Message {
  public id: string;
  public body: string;
  public phone: Phone;
  public slot: string;
  public incoming: boolean;
  public datetime: Date;

  constructor({ sim_slot, msg_box, address, timestamps, body, _id }) {
    this.id = _id;
    this.slot = sim_slot;
    this.incoming = msg_box === "inbox";
    this.body = body;
    this.phone = new Phone(address);
    this.datetime = new Date(
      parseInt(timestamps["delivery"] || timestamps["sent"])
    );
  }

  via(operator: string) {
    return this.phone.operator === operator;
  }

  static fetch(): Promise<Message[]> {
    return axios
      .get(`${process.env.SMS_GATEWAY_URL}/v1/sms`)
      .then(({ data }) => data["messages"])
      .then((messages) => messages.map((message) => new Message(message)));
  }

  static inbox(messages: Message[]) {
    return messages.filter((message) => !!message.incoming);
  }

  static outbox(messages: Message[]) {
    return messages.filter((message) => !message.incoming);
  }
}
