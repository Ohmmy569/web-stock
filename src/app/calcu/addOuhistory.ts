"use client";
export async function AddOuhistory(
  user : string,
  partCode: string,
  type: string,
  partName: string,
  amount: number,
  brand: string,
  costPrice: number,
  salePrice: number,
  action: string
) {

  try{
  const res = await fetch("/api/addhistory", {
    method: "POST",
    body: JSON.stringify({
      user,
      partCode,
      type,
      partName,
      amount,
      brand,
      costPrice,
      salePrice,
      action,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if(!res.ok){
  
    throw new Error("An error occured while creating history.");
  }
}catch(error){
  throw new Error("An error occured while creating history." + error);
}

  //if history > 30 delete the oldest one
  // const q = query(collection(db, "history"));
  // const querySnapshot = onSnapshot(q, (snapshot) => {
  // });
  // if (PartHistory != undefined) {
  //   if (PartHistory?.length > 200) {
  //     const q = query(collection(db, "history"));
  //     const querySnapshot = onSnapshot(q, (snapshot) => {
  //       PartHistory = snapshot.docs.map((doc) => doc.data());
  //     });
      
  //     const oldest = PartHistory?.sort((a, b) => a.timestamp - b.timestamp);
  //     const oldestId = oldest[0].id;
  //     const docRef = doc(collectionRef, oldestId);
  //     await deleteDoc(docRef);
  //   }
  // }
}
