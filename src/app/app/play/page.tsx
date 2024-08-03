import { RepeatStart } from "@/feature/repeat/starter";
import { Auth } from "@/utils/server/check-token";

export default async function PlayPage() {
  const result = await Auth();
  return <RepeatStart languages={result.targets} />;
}
