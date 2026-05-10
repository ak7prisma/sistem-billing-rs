import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tagihanId = url.searchParams.get("tagihanId");

  const redirectUrl = new URL("/pasien/history", req.url);

  if (!tagihanId) {
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const tagihanRef = adminDb.collection("tagihan").doc(tagihanId);
    const tagihanSnap = await tagihanRef.get();

    if (tagihanSnap.exists && tagihanSnap.data()?.status !== "lunas") {
      const secretKey = process.env.XENDIT_SECRET_KEY;
      if (secretKey) {
        const authHeader = Buffer.from(`${secretKey}:`).toString("base64");
        
        const response = await fetch(`https://api.xendit.co/v2/invoices?external_id=${tagihanId}`, {
          headers: {
            "Authorization": `Basic ${authHeader}`,
            "Content-Type": "application/json"
          }
        });
        
        if (response.ok) {
          const invoices = await response.json();
          
          const paidInvoice = invoices.find((inv: any) => inv.status === "PAID" || inv.status === "SETTLED");
          
          if (paidInvoice) {
            const tagihanData = tagihanSnap.data()!;
            
            await tagihanRef.update({
              status: "lunas",
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            await adminDb.collection("pembayaran").add({
              id_pembayaran: `PAY-VERIFY-${Date.now()}`,
              tagihan_id: tagihanId,
              metode_pembayaran: "xendit",
              jumlah_pembayaran: paidInvoice.amount,
              cover_bpjs: tagihanData.cover_bpjs || 0,
              iur_biaya: paidInvoice.amount,
              status: "berhasil",
              tanggal_pembayaran: admin.firestore.FieldValue.serverTimestamp(),
              xendit_invoice_id: paidInvoice.id
            });
            
            console.log(`Payment verified via redirect for Tagihan: ${tagihanId}`);
          }
        }
      }
    }
  } catch (error) {
    console.error("Verification Error:", error);
  }

  return NextResponse.redirect(redirectUrl);
}