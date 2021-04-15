import { DEFAULT_CREDIT_POINT } from "../settings";

export default class Credit {
  public point: number;

  constructor({ point }) {
    this.point = parseInt(point) || DEFAULT_CREDIT_POINT;
  }

  incr(value: number) {
    this.point += value;
    return this;
  }

  get percent() {
    return ((this.point / DEFAULT_CREDIT_POINT) * 100).toFixed(2);
  }
}
