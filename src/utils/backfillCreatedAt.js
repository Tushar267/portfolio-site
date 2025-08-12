import { collection, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function backfillCreatedAt() {
  const snap = await getDocs(collection(db, "products"));
  for (const d of snap.docs) {
    const data = d.data();
    if (!data.createdAt) {
      console.log(`Updating: ${d.id}`);
      await updateDoc(doc(db, "products", d.id), { createdAt: serverTimestamp() });
    }
  }
  console.log("Backfill complete ✅");
}
