//  Project: TCE Student Bus Payment Web App
//  Developed by:
//    Muthukumari Valliammai M - B.tech IT,TCE muthukumari2211@gmail.com, (Phone No: 6381825245) 
//    Aburvaa A S - B.tech IT,TCE aburvaasenthilkumarias@gmail.com, (Phone No: 8248224408) 
//    Kiruthika B - B.tech IT,TCE kirubala2005@gmail.com, (Phone No: 9360461440)    
//    Ms.C.V.Nisha Angeline - Assistant Professor.,IT,TCE

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function BusPassVerify() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [status, setStatus] = useState<'loading'|'verified'|'not-verified'|'not-found'>('loading');
  const [student, setStudent] = useState<any>(null);

  const contentRef = useRef(null);

  useEffect(() => {
    async function checkPayment() {
      if (!email) {
        setStatus('not-found');
        return;
      }
      const docRef = doc(db, 'user', email);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setStatus('not-found');
        return;
      }
      const data = docSnap.data();
      setStudent(data);
      setStatus(data.paymentStatus ? 'verified' : 'not-verified');
    }
    checkPayment();
  }, [email]);

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`BusPass_${student.name || 'Student'}.pdf`);
  };

  if (status === 'loading') return <div className="p-8 text-center">Checking payment status...</div>;
  if (status === 'not-found') return <div className="p-8 text-center text-red-600">Student not found.</div>;
  if (status === 'not-verified') return <div className="p-8 text-center text-red-600">Payment Not Verified</div>;

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow text-center">
      <div ref={contentRef} className="p-4">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Payment Verified</h2>
        <div className="text-left text-gray-800">
          <div><strong>Name:</strong> {student.name}</div>
          <div><strong>Email:</strong> {student.email}</div>
          <div><strong>Department:</strong> {student.department}</div>
          <div><strong>Phone:</strong> {student.rollno}</div>
          <div><strong>Bus Stop:</strong> {student.stop}</div>
          <div><strong>Route:</strong> {student.route}</div>
        </div>
        <div className="mt-4 text-green-600 font-semibold">Bus Pass Active for this year</div>
      </div>

      {status === 'verified' && (
        <button
          onClick={handleDownloadPdf}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Download Bus Pass as PDF
        </button>
      )}
    </div>
  );
}

export default BusPassVerify;