import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import * as admin from "firebase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Xendit sending invoice.paid event
    if (body.status === "PAID") {
      const tagihanId = body.external_id;
      const amount = body.amount;
      const xenditInvoiceId = body.id;

      console.log(`Webhook received for Tagihan: ${tagihanId}, Amount: ${amount}`);

      // 1. Find the Tagihan in Firestore using Admin SDK
      const tagihanRef = adminDb.collection("tagihan").doc(tagihanId);
      const tagihanSnap = await tagihanRef.get();

      if (!tagihanSnap.exists) {
        console.error(`Tagihan with ID ${tagihanId} not found in Firestore.`);
        return NextResponse.json({ error: "Tagihan not found" }, { status: 404 });
      }

      const tagihanData = tagihanSnap.data();
      
      // 2. Update Tagihan Status to Lunas
      await tagihanRef.update({
        status: "lunas",
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 3. Create a Payment Record
      await adminDb.collection("pembayaran").add({
        id_pembayaran: `PAY-WEBHOOK-${Date.now()}`,
        tagihan_id: tagihanId,
        metode_pembayaran: "xendit",
        jumlah_pembayaran: amount,
        cover_bpjs: tagihanData?.cover_bpjs || 0,
        iur_biaya: amount,
        status: "berhasil",
        tanggal_pembayaran: admin.firestore.FieldValue.serverTimestamp(),
        xendit_invoice_id: xenditInvoiceId
      });

      console.log(`Successfully processed payment for Tagihan: ${tagihanId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}