"server only";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { User } from "@/types/user.type";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const hmac = new TextEncoder().encode(process.env.JWT_SECRET!);

// Signed Javascript Web Token 생성
async function encrypt(data: unknown) {
  const token = await new SignJWT(data as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7day")
    .sign(hmac);

  return token;
}

export async function decrypt(session: string) {
  try {
    const { payload } = await jwtVerify(session, hmac, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (e) {
    return null;
  }
}

export const cookie = {
  name: "session",
  options: {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  },
  duration: 7 * 24 * 60 * 60 * 1000, // 7일
};

export async function createSession(user: User) {
  const expires = new Date(Date.now() + cookie.duration);
  const session = await encrypt({ ...user, expires });
  (await cookies()).set(cookie.name, session, { ...cookie.options, expires });
}

export async function verifySession(): Promise<User> {
  const sessonCookie = (await cookies()).get(cookie.name)?.value;
  const session = await decrypt(sessonCookie || "");

  if (!session) redirect("/");

  return {
    groupId: Number(session.groupId),
    cellId: Number(session.cellId),
    name: session.name as string,
    birth: session.birth as string,
    gisu: Number(session.gisu),
    level: Number(session.level),
  };
}

export async function deleteSession() {
  (await cookies()).delete(cookies.name);
  redirect("/");
}
