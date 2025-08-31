//  Project: TCE Student Bus Payment Web App
//  Developed by:
//    Muthukumari Valliammai M - B.tech IT,TCE muthukumari2211@gmail.com, (Phone No: 6381825245) 
//    Aburvaa A S - B.tech IT,TCE aburvaasenthilkumarias@gmail.com, (Phone No: 8248224408) 
//    Kiruthika B - B.tech IT,TCE kirubala2005@gmail.com, (Phone No: 9360461440)    
//    Ms.C.V.Nisha Angeline - Assistant Professor.,IT,TCE

import { User } from '../models/User';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export class AuthService {
  // Demo credentials - replace with Firebase Auth later
  private static demoCredentials = [
    { email: 'student1@college.edu', password: 'password123', role: 'student' },
    { email: 'student2@college.edu', password: 'password123', role: 'student' },
    { email: 'student3@college.edu', password: 'password123', role: 'student' },
    { email: 'admin@college.edu', password: 'admin123', role: 'admin' }
  ];

  static async login(email: string, password: string): Promise<User | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));



    try {
      // Firebase Auth sign in
      await signInWithEmailAndPassword(auth, email, password);
      // Fetch student document from Firestore using email as document ID
      const studentDoc = await getDoc(doc(db, 'user', email));
      if (!studentDoc.exists()) return null;
      return studentDoc.data() as User;
    } catch (error) {
      return null;
    }
  }

  static async logout(): Promise<void> {
    // Clear any session data
    localStorage.removeItem('currentUser');
  }
}