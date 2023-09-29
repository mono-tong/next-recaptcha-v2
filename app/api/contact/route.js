import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    recaptchaToken: formData.get('recaptchaToken'),
  };

  try {
    const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET,
        response: data.recaptchaToken,
      }),
    });

    const recaptchaData = await recaptchaRes.json();

    if (!!recaptchaData.success) {
      throw new Error('Failed to verify Google reCAPTCHA.');
    }

    /** send form data to backend */
    // ...

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 403 }
    );
  }

  return NextResponse.json('pass');
}
