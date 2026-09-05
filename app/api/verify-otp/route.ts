import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, otp, verificationId } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone and OTP are required' },
        { status: 400 }
      );
    }

    const cleanNum = phone.toString().replace(/\D/g, '').slice(-10);

    // 🌟 Master Bypass (Testing और Demo के लिए हमेशा चालू)
    if (otp === '123456' || verificationId === 'DEMO_TEST_SESSION') {
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully (Demo Master OTP)',
      });
    }

    // Support both naming styles (with or without underscore)
    const customerId =
      process.env.MESSAGE_CENTRAL_CUSTOMER_ID ||
      process.env.MESSAGECENTRAL_CUSTOMER_ID;
    const authToken =
      process.env.MESSAGE_CENTRAL_AUTH_TOKEN ||
      process.env.MESSAGECENTRAL_AUTH_TOKEN;

    if (!customerId || !authToken) {
      return NextResponse.json(
        { success: false, error: 'Message Central credentials missing' },
        { status: 500 }
      );
    }

    // 🚀 Message Central OTP Validate Request
    const verificationParam = verificationId ? `&verificationId=${verificationId}` : '';
    const url = `https://cpaas.messagecentral.com/verification/v3/validateOtp?countryCode=91&customerId=${customerId}&mobileNumber=${cleanNum}${verificationParam}&code=${otp}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'authToken': authToken,
      },
    });

    const data = await res.json();

    if (
      data.responseCode === 200 &&
      (data.data?.verificationStatus === 'VERIFICATION_COMPLETED' || data.message === 'SUCCESS')
    ) {
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully!',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: data.message || 'Invalid or expired OTP. Please try again.',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}