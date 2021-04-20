export default function remainingTime(ms: number) {
  let min = Math.round(ms / 60);
  let hrs = Math.round(min / 60);
  return hrs < 1 ? min + " မိနစ်" : hrs + " နာရီ";
}
