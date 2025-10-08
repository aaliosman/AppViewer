// import { NextResponse } from 'next/server';

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const email = searchParams.get('email');

//   if (!email) {
//     return NextResponse.json({ authorized: false });
//   }

//   const strapiUrl = `${
//     process.env.NEXT_PUBLIC_BASE_API_URL
//   }/api/users?filters[email][$eq]=${encodeURIComponent(email)}`;

//   const res = await fetch(strapiUrl, {
//     headers: {
//       Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
//     },
//   });

//   if (!res.ok) {
//     return NextResponse.json({ authorized: false });
//   }

//   const users = await res.json();
//   const exists = users?.length > 0;

//   return NextResponse.json({ authorized: exists });
// }

import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ authorized: false });
  }

  // ✅ استخدم عنوان Strapi الداخلي
  const strapiUrl = `${
    process.env.STRAPI_INTERNAL_API_URL
  }/api/users?filters[email][$eq]=${encodeURIComponent(email)}`;

  try {
    const res = await fetch(strapiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
      },
    });

    if (!res.ok) {
      console.error('Strapi response error:', res.status);
      return NextResponse.json({ authorized: false });
    }

    const data = await res.json();
    // ✅ بعض نسخ Strapi ترجع { data: [...] }
    const users = data?.data || data || [];
    const exists = Array.isArray(users) && users.length > 0;

    return NextResponse.json({ authorized: exists });
  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json({ authorized: false });
  }
}
