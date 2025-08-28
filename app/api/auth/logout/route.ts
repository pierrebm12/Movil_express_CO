import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ message: "Logout exitoso" })

  // Remove session cookie
  response.cookies.set("session-id", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  })

  return response
}
