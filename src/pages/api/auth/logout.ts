export async function POST() {
  return new Response(
    JSON.stringify({ message: 'Logged out successfully' }),
    { 
      status: 200, 
      headers: { 
        'Content-Type': 'application/json',
        'Set-Cookie': 'auth_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
      }
    }
  );
}