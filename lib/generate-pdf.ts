// PDF generation utility using jspdf and html2canvas
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generatePDF(
  elementId: string,
  filename = "veneer-report.pdf"
): Promise<Blob> {
  try {
    // Get the HTML element to convert to PDF
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID ${elementId} not found`);
    }

    // Create a canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow images from other domains
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Calculate dimensions to maintain aspect ratio
    const imgWidth = 210; // A4 width in mm (210mm)
    const pageHeight = 297; // A4 height in mm (297mm)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Create PDF of A4 size
    const pdf = new jsPDF("p", "mm", "a4");
    let position = 0;

    // // Add image to PDF (first page)
    pdf.addImage(
      canvas.toDataURL("image/jpeg", 1.0),
      "JPEG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    // If content spans multiple pages, add new pages
    let heightLeft = imgHeight;

    while (heightLeft >= pageHeight) {
      position = heightLeft - pageHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 1.0),
        "JPEG",
        0,
        -position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    // Return the PDF as a blob
    return pdf.output("blob");
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

// Function to download the PDF
export function downloadPDF(blob: Blob, filename = "veneer-report.pdf"): void {
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  // Append to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}
