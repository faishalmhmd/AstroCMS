// lib/user.ts
import type { APIContext } from "astro";
import { getUserFromRequest } from "./auth";

export interface User {
  id: string;
  username: string;
  email: string;
}

export async function getUser(Astro: APIContext): Promise<User | null> {
  try {
    const user = await getUserFromRequest(Astro.request);
    return user as User ?? null;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
