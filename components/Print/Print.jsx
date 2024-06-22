import React, { useRef } from 'react';

const PrintButton = ({ children }) => {
  const componentRef = useRef();

  const handlePrint = () => {
    const printContent = componentRef.current;
    const printWindow = window.open('', '', 'height=600,width=800');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            ${Array.from(document.styleSheets)
              .map(styleSheet => {
                try {
                  return Array.from(styleSheet.cssRules).map(rule => rule.cssText).join('');
                } catch (e) {
                  console.log('Access to stylesheet blocked by CORS policy');
                  return '';
                }
              })
              .join('\n')}
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div>
      <div ref={componentRef}>
        {children}
      </div>
      <button onClick={handlePrint}>Print</button>
    </div>
  );
};

export default PrintButton;