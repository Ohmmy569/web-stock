"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export async function Addhistory(
  user : string,
  partCode: string,
  type: string,
  partName: string,
  amount: number,
  brand: string,
  costPrice: number,
  salePrice: number,
) {
  const collectionRef = collection(db, "history");
  const [PartHistory, setPartHistory] = useState([] as any[] | undefined);
  await addDoc(collectionRef, {
    user : user,
    partCode: partCode,
    type: type,
    partName: partName,
    amount: amount,
    brand: brand,
    costPrice: costPrice,
    salePrice: salePrice,
    timestamp: serverTimestamp(),
  });

  //if history > 30 delete the oldest one
  const q = query(collection(db, "history"));
  const querySnapshot = await onSnapshot(q, (snapshot) => {
    setPartHistory(snapshot.docs.map((doc) => doc.data()));
  });
  if (PartHistory != undefined) {
    if (PartHistory?.length > 30) {
      const q = query(collection(db, "history"));
      const querySnapshot = await onSnapshot(q, (snapshot) => {
        setPartHistory(snapshot.docs.map((doc) => doc.data()));
      });
      const oldest = PartHistory?.sort((a, b) => a.timestamp - b.timestamp);
      const oldestId = oldest[0].id;
      const docRef = doc(collectionRef, oldestId);
      await deleteDoc(docRef);
    }
  }
}
