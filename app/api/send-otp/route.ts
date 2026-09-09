import { NextResponse } from 'next/server';

// 🛑 In-Memory Rate Limiting Tracker
const otpTracker: { [phone: string]: { count: number; lastSentTime: number; date: string } } = {};

const MAX_DAILY_OTP = 5;
const COOLDOWN_SECONDS = 60;

// 🧪 FREE TESTING NUMBERS (In numbers par Message Central API call nahi jayegi aur ₹0 katega)
const FREE_TEST_NUMBERS = [
  '9758884326', // Aapka number (Testing)
  '9411930458',
  '9884365360',
  '8354682086'

];

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const cleanNum = phone.toString().replace(/\D/g, '').slice(-10);
    const today = new Date().toISOString().split('T')[0];
    const now = Date.now();

    // 1. FREE DEMO & TESTING BYPASS (₹0 Deduction)
    if (FREE_TEST_NUMBERS.includes(cleanNum)) {
      console.log(`\n========================================`);
      console.log(`🚀 [FREE TEST OTP BYPASS] Phone: ${cleanNum} | Master OTP: 123456`);
      console.log(`💰 SMS Skipped! ₹0 Deducted.`);
      console.log(`========================================\n`);
      return NextResponse.json({
        success: true,
        verificationId: 'DEMO_TEST_SESSION',
        message: 'Demo mode active! Use OTP: 123456',
        remainingAttempts: MAX_DAILY_OTP,
      });
    }

    // 2. Initialize or Reset Tracker for today
    if (!otpTracker[cleanNum] || otpTracker[cleanNum].date !== today) {
      otpTracker[cleanNum] = { count: 0, lastSentTime: 0, date: today };
    }

    const userHistory = otpTracker[cleanNum];

    // 3. Cooldown Check (60 Seconds Minimum Gap)
    if (now - userHistory.lastSentTime < COOLDOWN_SECONDS * 1000) {
      const waitSec = Math.ceil((COOLDOWN_SECONDS * 1000 - (now - userHistory.lastSentTime)) / 1000);
      return NextResponse.json(
        { success: false, error: `Please wait ${waitSec}s before requesting a new OTP.` },
        { status: 429 }
      );
    }

    // 4. Daily Limit Check (Max 5 OTPs per day)
    if (userHistory.count >= MAX_DAILY_OTP) {
      return NextResponse.json(
        { success: false, error: 'Daily OTP limit reached (Max 5 per day). Please try after 24 hours.' },
        { status: 429 }
      );
    }

    // 5. Message Central Credentials
    const customerId = process.env.MESSAGECENTRAL_CUSTOMER_ID;
    const authToken = process.env.MESSAGECENTRAL_AUTH_TOKEN;

    if (!customerId || !authToken) {
      console.error('Message Central Credentials Missing in .env.local');
      return NextResponse.json(
        { success: false, error: 'SMS Gateway Config Error' },
        { status: 500 }
      );
    }

    // 🚀 Message Central VerifyNow API Call (Sasta & Direct SMS Route)
    const url = `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${customerId}&flowType=SMS&mobileNumber=${cleanNum}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'authToken': authToken,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (data.responseCode === 200 || data.data?.verificationId || data.verificationId) {
      userHistory.count += 1;
      userHistory.lastSentTime = now;

      const vId = data.data?.verificationId || data.verificationId;

      return NextResponse.json({
        success: true,
        verificationId: vId,
        message: 'OTP Sent successfully via Message Central!',
        remainingAttempts: MAX_DAILY_OTP - userHistory.count,
      });
    } else {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to send SMS' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Send OTP Server Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}