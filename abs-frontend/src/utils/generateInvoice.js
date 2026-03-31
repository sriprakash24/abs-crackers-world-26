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
    scrollY: -window.scrollY,
  });

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const pageHeight = 295;

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pageCanvasHeight = (canvas.width * pageHeight) / pageWidth;

  let renderedHeight = 0;

  while (renderedHeight < canvas.height) {
    const pageCanvas = document.createElement("canvas");
    const pageCtx = pageCanvas.getContext("2d");

    pageCanvas.width = canvas.width;
    pageCanvas.height = Math.min(
      pageCanvasHeight,
      canvas.height - renderedHeight,
    );

    // 🔥 Slice exact portion
    pageCtx.drawImage(
      canvas,
      0,
      renderedHeight,
      canvas.width,
      pageCanvas.height,
      0,
      0,
      canvas.width,
      pageCanvas.height,
    );

    const imgData = pageCanvas.toDataURL("image/png");

    const pageImgHeight = (pageCanvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, pageImgHeight);

    renderedHeight += pageCanvas.height;

    if (renderedHeight < canvas.height) {
      pdf.addPage();
    }
  }

  pdf.save(`ABS-INVOICE-${orderNumber}.pdf`);
};
