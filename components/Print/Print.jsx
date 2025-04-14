import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PrintButton = ({ children }) => {
  const componentRef = useRef();

  const handleDownloadPDF = () => {
    const input = componentRef.current;
    html2canvas(input)
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('download.pdf');
      })
      .catch(error => {
       
      });
  };

  return (
    <div>
      <div ref={componentRef}>
        {children}
      </div>
      <button onClick={handleDownloadPDF}>Print</button>
    </div>
  );
};

export default PrintButton;
