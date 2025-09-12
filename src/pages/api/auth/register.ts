import type { APIRoute } from "astro";
import { createUser } from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, email, password } = await request.json() as {
      username?: string;
      email?: string;
      password?: string;
    };

    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await createUser(username, email, password);

    return new Response(
      JSON.stringify({ message: "User created successfully", user }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
};
