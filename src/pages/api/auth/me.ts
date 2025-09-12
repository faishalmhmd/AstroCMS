import type { APIRoute } from "astro"
import { getUserFromRequest } from "../../../lib/auth.js"

export const GET: APIRoute = async ({ request }) => {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({ user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Auth check error:", error)
    return new Response(
      JSON.stringify({ error: "Authentication failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
