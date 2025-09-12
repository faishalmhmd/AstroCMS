import type { APIRoute } from "astro"
import { authenticateUser, generateToken } from "../../../lib/auth.js"

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json() as {
      email?: string
      password?: string
    }

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const user = await authenticateUser(email, password)
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    const token = generateToken(user.id)

    // Set HTTP-only cookie
    return new Response(
      JSON.stringify({ message: "Login successful", user }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${
            7 * 24 * 60 * 60
          }; Path=/`,
        },
      }
    )
  } catch (error) {
    console.error("Login error:", error)
    return new Response(
      JSON.stringify({ error: "Login failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
