import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generateInvoice = async (orderNumber) => {
  const element = document.getElementById("invoice-content");

  if (!element) {
    console.error("Invoice element not found");
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  pdf.save(`ABS-INVOICE-${orderNumber}.pdf`);
};
