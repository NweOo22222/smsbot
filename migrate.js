const { default: Phone } = require("./dist/app/Phone");
const { default: DB } = require("./dist/app/DB");

if (existsSync(DATABASE_PATH)) {
  const db = DB.read();
  db["phone"] = db["phone"].map((phone) => new Phone(phone.number));
  DB.save(db);
  console.log("DB:Migrated [OK]");
} else {
  console.log("DB:Unexisted [ ]");
}
