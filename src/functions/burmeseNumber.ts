const numbers = [
  "\u1040", //* "၀"
  "\u1041", //* "၁"
  "\u1042", //* "၂"
  "\u1043", //* "၃"
  "\u1044", //* "၄"
  "\u1045", //* "၅"
  "\u1046", //* "၆"
  "\u1047", //* "၇"
  "\u1048", //* "၈"
  "\u1049", //* "၉"
];

export default function burmeseNumber(number: string | number) {
  return number
    .toString()
    .split("")
    .map((n) => numbers[n] || n)
    .join("");
}
