const cities = require("../../data/ygn.json");

export default class Tag {
  constructor(public content: string) {}

  findDistrictInYangon() {
    return cities.filter(({ name_mm }) => {
      return (this.content || "").includes(name_mm);
    });
  }
}
