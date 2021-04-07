import axios from "axios";

type SimSlot = "0" | "1";

export default class SMS {
  static send(phone: string, message: string, sim_slot: SimSlot) {
    const uri = new URL(process.env.SMS_GATEWAY_URL);
    uri.pathname = "/v1/sms/send";
    uri.search = "?phone=" + phone;
    uri.searchParams.append("sim_slot", sim_slot);
    uri.searchParams.append("message", message);
    console.log({ phone, message, url: uri.toString() });
    return axios({
      method: "GET",
      url: uri.toString(),
    }).then(({ data }) => data);
  }
}
