import { getUserBySession } from "@/server/session";
import { BottomNav } from "./BottomNav";

export async function AppShell() {
  const user = await getUserBySession();
  if (!user) return null;
  return <BottomNav userLevel={user.level} />;
}
