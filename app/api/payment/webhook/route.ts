import { NextResponse } from "next/server";
import { db } from "@/lib/firebase/config";
import { 
  doc, 
  updateDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Xendit sending invoice.paid event
    if (body.status === "PAID") {
      const tagihanId = body.external_id;
      const amount = body.amount;
      const paymentMethod = body.payment_method || "XENDIT";

      // 1. Find the Tagihan in Firestore
      const tagihanRef = doc(db, "tagihan", tagihanId);
      
      // 2. Update Tagihan Status to Lunas
      await updateDoc(tagihanRef, {
        status: "lunas"
      });

      // 3. Create a Payment Record
      await addDoc(collection(db, "pembayaran"), {
        tagihan_id: tagihanId,
        metode_pembayaran: paymentMethod.toLowerCase(),
        jumlah_pembayaran: amount,
        status: "berhasil",
        tanggal_pembayaran: serverTimestamp(),
        xendit_invoice_id: body.id
      });

      console.log(`Payment Success: ${tagihanId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Failed" }, { status: 500 });
  }
}
