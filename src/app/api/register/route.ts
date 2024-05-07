// pages/api/firestore.ts

import { NextResponse, NextRequest } from 'next/server';
import admin from 'firebase-admin';

// ตั้งค่า Firebase Admin
import serviceAccount from "../../../../serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'YOUR_DATABASE_URL' // เปลี่ยนเป็น URL ของ Firebase Firestore ของคุณ
  });
}

// เชื่อมต่อกับ Firestore
const db = admin.firestore();

export async function GET() {
  try {
    // ทำอะไรกับ Firestore ได้ตรงนี้

   return NextResponse.json({ success: true , message: 'Data saved successfully'});
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false , message: 'An error occurred while saving data'});
  }
}
