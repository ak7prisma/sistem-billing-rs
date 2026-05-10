import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { tagihanId, amount, customerName, customerEmail } = await req.json();

    const secretKey = process.env.XENDIT_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Xendit Secret Key not found" }, { status: 500 });
    }

    // Basic Auth header for Xendit
    const authHeader = Buffer.from(`${secretKey}:`).toString("base64");

    const response = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_id: tagihanId,
        amount: amount,
        description: `Pembayaran Tagihan Rumah Sakit - ${tagihanId}`,
        invoice_duration: 86400,
        customer: {
          given_names: customerName,
          email: customerEmail,
        },
        success_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/payment/verify?tagihanId=${tagihanId}`,
        failure_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pasien/invoice/${tagihanId}`,
        currency: "IDR",
        items: [
          {
             name: "Tagihan Rumah Sakit",
             quantity: 1,
             price: amount
          }
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Xendit API Error:", data);
      return NextResponse.json({ error: data.message || "Failed to create invoice" }, { status: response.status });
    }

    return NextResponse.json({ invoice_url: data.invoice_url });
  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}