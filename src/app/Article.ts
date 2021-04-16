import axios from "axios";

export default class Article {
  public id: string;
  public content: string;
  public image: string;
  public title: string;
  public source: string;
  public link: string;

  constructor({ id, content, image, title, source, link }) {
    this.id = id;
    this.content = content;
    this.image = image;
    this.title = title;
    this.source = source;
    this.link = link;
  }

  static update() {
    return axios
      .get("https://api.nweoo.com/articles?limit=30")
      .then(({ data }) => (data || []).map((article) => new Article(article)));
  }

  static store() {
    //
  }
}
