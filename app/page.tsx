import { getUserBySession } from "@/server/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUserBySession();
  if (user) {
    return redirect("/requests");
  } else {
    return redirect("/login");
  }
}
