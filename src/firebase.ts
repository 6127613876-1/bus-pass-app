//  Project: TCE Student Bus Payment Web App
//  Developed by:
//    Muthukumari Valliammai M - B.tech IT,TCE muthukumari2211@gmail.com, (Phone No: 6381825245) 
//    Aburvaa A S - B.tech IT,TCE aburvaasenthilkumarias@gmail.com, (Phone No: 8248224408) 
//    Kiruthika B - B.tech IT,TCE kirubala2005@gmail.com, (Phone No: 9360461440)    
//    Ms.C.V.Nisha Angeline - Assistant Professor.,IT,TCE

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkqfy62hfhmBar4HniopH92DSyRoA4IQw",
  authDomain: "student-bus-pass-21440.firebaseapp.com",
  projectId: "student-bus-pass-21440",
  storageBucket: "student-bus-pass-21440.appspot.com", // ✅ Add comma here
  messagingSenderId: "708525573674",
  appId: "1:708525573674:web:5600c145c5d69287b62553",
  measurementId: "G-X6L1LF1LVE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
