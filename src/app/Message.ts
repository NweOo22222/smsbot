import axios from "axios";
import Phone from "./Phone";

export default class Message {
  public body: string;
  public phone: Phone;

  constructor({ address, body }) {
    this.body = body;
    this.phone = new Phone(address);
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
}
