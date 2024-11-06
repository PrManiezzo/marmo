import { Quotation, QuotationItem, QuotationService } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateQuotationPDF = async (quotation: Quotation) => {
  const doc = new jsPDF();

  // Add company header
  doc.setFontSize(20);
  doc.text('MarmoTech', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Orçamento de Produtos e Serviços', 105, 30, { align: 'center' });

  // Add quotation details
  doc.setFontSize(10);
  doc.text(`Orçamento Nº: ${quotation.id}`, 14, 45);
  doc.text(`Data: ${new Date(quotation.createdAt).toLocaleDateString('pt-BR')}`, 14, 52);
  doc.text(`Validade: ${new Date(quotation.validUntil).toLocaleDateString('pt-BR')}`, 14, 59);
  doc.text(`Cliente: ${quotation.customerName}`, 14, 66);

  // Add products table
  if (quotation.items.length > 0) {
    doc.text('Produtos:', 14, 80);
    
    const productHeaders = [['Item', 'Quantidade', 'Preço Unit.', 'Total']];
    const productData = quotation.items.map((item: QuotationItem) => [
      item.productName,
      `${item.quantity}`,
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(item.unitPrice),
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(item.total)
    ]);

    doc.autoTable({
      startY: 85,
      head: productHeaders,
      body: productData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] }
    });
  }

  // Add services table
  if (quotation.services.length > 0) {
    const servicesStartY = doc.previousAutoTable.finalY + 15;
    doc.text('Serviços:', 14, servicesStartY);

    const serviceHeaders = [['Serviço', 'Quantidade', 'Preço Unit.', 'Total']];
    const serviceData = quotation.services.map((service: QuotationService) => [
      service.serviceName,
      `${service.quantity}`,
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(service.unitPrice),
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(service.total)
    ]);

    doc.autoTable({
      startY: servicesStartY + 5,
      head: serviceHeaders,
      body: serviceData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] }
    });
  }

  // Add total
  const finalY = doc.previousAutoTable.finalY + 15;
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Valor Total: ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(quotation.total)}`,
    195,
    finalY,
    { align: 'right' }
  );

  // Add observations if any
  if (quotation.observations) {
    doc.setFont('helvetica', 'normal');
    doc.text('Observações:', 14, finalY + 15);
    doc.setFontSize(9);
    const splitObservations = doc.splitTextToSize(quotation.observations, 180);
    doc.text(splitObservations, 14, finalY + 22);
  }

  // Add footer with dates
  const footerY = finalY + 40;
  if (quotation.measurementDate) {
    doc.text(
      `Data prevista para medição: ${new Date(quotation.measurementDate).toLocaleDateString('pt-BR')}`,
      14,
      footerY
    );
  }
  if (quotation.installationDate) {
    doc.text(
      `Data prevista para instalação: ${new Date(quotation.installationDate).toLocaleDateString('pt-BR')}`,
      14,
      footerY + 7
    );
  }

  // Add signature lines
  doc.setFontSize(10);
  const signatureY = footerY + 30;
  
  doc.line(20, signatureY, 90, signatureY);
  doc.line(120, signatureY, 190, signatureY);
  
  doc.text('Responsável', 55, signatureY + 5, { align: 'center' });
  doc.text('Cliente', 155, signatureY + 5, { align: 'center' });

  // Save the PDF
  doc.save(`orcamento-${quotation.id}.pdf`);
};