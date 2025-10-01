export async function POST(request) {
  const baseUrl = process.env.BASE_API_URL;
  try {
    const body = await request.json();
    console.log('%c[] -> body : ', 'color: #212a55', body);

    // validate
    if (!body.name || !body.email || !body.phone) {
      return new Response(
        JSON.stringify({ message: 'الحقول الأساسية مفقودة.' }),
        { status: 400 }
      );
    }
    console.log(process.env.SUBMISSION_WEBHOOK);
    // send to Google Sheets via webhook
    const webhook = process.env.SUBMISSION_WEBHOOK;
    if (!webhook) {
      return new Response(
        JSON.stringify({ message: 'لم يتم إعداد Webhook لجوجل شيت.' }),
        { status: 500 }
      );
    }

    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return new Response(
      JSON.stringify({ message: 'تم إرسال البيانات إلى Google Sheets.' }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || 'خطأ في الخادم.' }),
      { status: 500 }
    );
  }
}
