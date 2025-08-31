//  Project: TCE Student Bus Payment Web App
//  Developed by:
//    Muthukumari Valliammai M - B.tech IT,TCE muthukumari2211@gmail.com, (Phone No: 6381825245) 
//    Aburvaa A S - B.tech IT,TCE aburvaasenthilkumarias@gmail.com, (Phone No: 8248224408) 
//    Kiruthika B - B.tech IT,TCE kirubala2005@gmail.com, (Phone No: 9360461440)    
//    Ms.C.V.Nisha Angeline - Assistant Professor.,IT,TCE

export interface User {
  id: string;
  email: string;
  name: string;
  department: string;
  rollno: string;
  stop: string;
  route: string;
  fare: number;
  paymentStatus: boolean;
  lastPaymentDate: string | null;
  role: 'student' | 'admin';
  photo:string;
  busname:string;
}