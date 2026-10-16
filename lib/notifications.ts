// Notification Engine for InstaClick
const ADMIN_PHONE = "7982776458";
const ADMIN_EMAIL = "info@instaclick.co.in";    

interface BookingNotificationData {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  packageName: string;
  totalAmount: number;
  advancePaid: number;
  eventDate?: string;
  address?: string;
}

// Helper: Format 10-digit Indian numbers
function formatIndianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 ? `91${cleaned}` : cleaned;
}

// Helper: Message Central Send Request
async function sendSMSViaMessageCentral(mobileNumber: string, messageText: string) {
  const customerId = process.env.MESSAGECENTRAL_CUSTOMER_ID || "C-5D480F495581418";
  const authToken = process.env.MESSAGECENTRAL_AUTH_TOKEN;

  if (!authToken) {
    console.warn("[MessageCentral] Missing AUTH_TOKEN in env.");
    return;
  }

  const formattedMobile = formatIndianPhone(mobileNumber);

  try {
    const url = `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=${customerId}&flowType=SMS&mobileNumber=${formattedMobile.slice(-10)}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "authToken": authToken,
        "Content-Type": "application/json",
      },
    });

    const resData = await res.json();
    console.log(`[MessageCentral] SMS to ${mobileNumber}:`, resData);
    return resData;
  } catch (err) {
    console.error(`[MessageCentral Error] Failed to send to ${mobileNumber}:`, err);
  }
}

// 1. Triggered on New Booking Creation
export async function sendNewBookingNotifications(data: BookingNotificationData) {
  console.log(`\n========================================`);
  console.log(`🔔 [DISPATCHING LIVE BOOKING NOTIFICATIONS]`);
  console.log(`Order: #${data.bookingId} | Client: ${data.customerName} (${data.customerPhone})`);
  console.log(`Package: ${data.packageName} | Paid: ₹${data.advancePaid} / Total: ₹${data.totalAmount}`);
  console.log(`Location: ${data.address} | Date: ${data.eventDate}`);
  console.log(`Admin Target: ${ADMIN_PHONE} | ${ADMIN_EMAIL}`);
  console.log(`========================================\n`);

  // Customer SMS
  const customerMsg = `Hello ${data.customerName}, your shoot #${data.bookingId} for ${data.packageName} is booked successfully! Team InstaClick.`;
  await sendSMSViaMessageCentral(data.customerPhone, customerMsg);

  // Admin SMS Alert
  const adminMsg = `New Booking #${data.bookingId} received! Client: ${data.customerName} (${data.customerPhone}), Package: ${data.packageName}, Amount: Rs.${data.totalAmount}.`;
  await sendSMSViaMessageCentral(ADMIN_PHONE, adminMsg);
}

// 2. Triggered when Status is updated to 'completed' / 'delivered'
export async function sendBookingCompletedNotification(bookingId: string, customerPhone: string, customerName: string) {
  console.log(`\n========================================`);
  console.log(`✅ [DISPATCHING SHOOT COMPLETED ALERT]`);
  console.log(`Booking #${bookingId} for ${customerName} (${customerPhone}) marked as COMPLETED.`);
  console.log(`========================================\n`);

  const completionMsg = `Dear ${customerName}, your shoot #${bookingId} has been marked as Completed / Assets Delivered! Thank you for choosing InstaClick.`;
  await sendSMSViaMessageCentral(customerPhone, completionMsg);
}