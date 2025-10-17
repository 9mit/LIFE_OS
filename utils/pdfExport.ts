
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { InsightSummary } from "../types/data";

export async function exportDashboardToPDF(
  element: HTMLElement,
  summary: InsightSummary
) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#111827' // Dark background for better contrast if needed
  });
  const imageData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const imageWidth = 190;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const imageHeight = (canvas.height * imageWidth) / canvas.width;
  const offsetX = (pageWidth - imageWidth) / 2;

  pdf.setFontSize(16);
  pdf.text("LifeOS Dashboard Report", 105, 20, { align: "center" });

  pdf.setFontSize(11);
  pdf.text(`Total records: ${summary.totalRecords}`, 14, 30);
  pdf.text(`Active sources: ${summary.activeSources}`, 14, 36);
  pdf.text(`Top keywords: ${summary.keywords.join(", ")}`, 14, 42);

  pdf.addImage(imageData, "PNG", offsetX, 48, imageWidth, imageHeight);
  pdf.save(`lifeos-report-${Date.now()}.pdf`);
}
