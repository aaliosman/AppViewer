import { NextResponse } from 'next/server';

export async function GET(req) {
  console.log('ttttttttttttttttttttttttttttttttt');
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  console.log('%c[] -> email : ', 'color: #aad5fe', email);

  if (!email) {
    return NextResponse.json({ authorized: false });
  }

  const strapiUrl = `${
    process.env.NEXT_PUBLIC_BASE_API_URL
  }/api/users?filters[email][$eq]=${encodeURIComponent(email)}`;

  const res = await fetch(strapiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
    },
  });
  console.log('%c[] -> res : ', 'color: #09a71c', res);

  if (!res.ok) {
    return NextResponse.json({ authorized: false });
  }

  const users = await res.json();
  const exists = users?.length > 0;

  return NextResponse.json({ authorized: exists });
}
