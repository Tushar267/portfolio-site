import React from "react";
import { backfillCreatedAt } from "../utils/backfillCreatedAt";

export default function Backfill() {
  const runBackfill = async () => {
    await backfillCreatedAt();
    alert("Backfill done!");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Backfill createdAt</h2>
      <button onClick={runBackfill}>Run Backfill</button>
    </div>
  );
}
