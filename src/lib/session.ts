import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireTeacher() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/entrar");
  }
  return session.user;
}
