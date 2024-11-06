import { Order, OrderItem, OrderService } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateOrderPDF = async (order: Order) => {
  const doc = new jsPDF();

  // Add company header
  doc.setFontSize(20);
  doc.text('MarmoTech', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Pedido de Produtos e Serviços', 105, 30, { align: 'center' });

  // Add order details
  doc.setFontSize(10);
  doc.text(`Pedido Nº: ${order.id}`, 14, 45);
  doc.text(`Data: ${new Date(order.createdAt).toLocaleDateString('pt-BR')}`, 14, 52);
  doc.text(`Cliente: ${order.customerName}`, 14, 59);
  doc.text(`Status: ${
    {
      pending: 'Pendente',
      in_progress: 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    }[order.status]
  }`, 14, 66);

  // Add products table
  if (order.items.length > 0) {
    doc.text('Produtos:', 14, 80);
    
    const productHeaders = [['Item', 'Quantidade', 'Preço Unit.', 'Total']];
    const productData = order.items.map((item: OrderItem) => [
      item.productName,
      `${item.quantity}`,
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(item.price),
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(item.price * item.quantity)
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
  if (order.services && order.services.length > 0) {
    const servicesStartY = doc.previousAutoTable.finalY + 15;
    doc.text('Serviços:', 14, servicesStartY);

    const serviceHeaders = [['Serviço', 'Quantidade', 'Preço Unit.', 'Total', 'Observações']];
    const serviceData = order.services.map((service: OrderService) => [
      service.serviceName,
      `${service.quantity}`,
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(service.price),
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(service.price * service.quantity),
      service.observations || ''
    ]);

    doc.autoTable({
      startY: servicesStartY + 5,
      head: serviceHeaders,
      body: serviceData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] }
    });
  }

  // Add payment information
  const paymentY = doc.previousAutoTable.finalY + 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Informações de Pagamento:', 14, paymentY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Status: ${
    {
      pending: 'Pendente',
      partial: 'Parcial',
      completed: 'Pago'
    }[order.paymentStatus]
  }`, 14, paymentY + 7);
  
  if (order.paymentMethod) {
    doc.text(`Forma de Pagamento: ${
      {
        credit_card: 'Cartão de Crédito',
        debit_card: 'Cartão de Débito',
        bank_transfer: 'Transferência Bancária',
        cash: 'Dinheiro',
        pix: 'PIX'
      }[order.paymentMethod]
    }`, 14, paymentY + 14);
  }

  // Add total
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Valor Total: ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(order.totalPrice)}`,
    195,
    paymentY + 25,
    { align: 'right' }
  );

  // Add dates
  const datesY = paymentY + 40;
  doc.setFont('helvetica', 'normal');
  doc.text(`Data de Entrega: ${new Date(order.deliveryDate).toLocaleDateString('pt-BR')}`, 14, datesY);
  
  if (order.installationDate) {
    doc.text(
      `Data de Instalação: ${new Date(order.installationDate).toLocaleDateString('pt-BR')}`,
      14,
      datesY + 7
    );
  }

  // Add observations if any
  if (order.observations) {
    doc.text('Observações:', 14, datesY + 20);
    doc.setFontSize(9);
    const splitObservations = doc.splitTextToSize(order.observations, 180);
    doc.text(splitObservations, 14, datesY + 27);
  }

  // Add signature lines
  const signatureY = datesY + 50;
  doc.setFontSize(10);
  
  doc.line(20, signatureY, 90, signatureY);
  doc.line(120, signatureY, 190, signatureY);
  
  doc.text('Responsável', 55, signatureY + 5, { align: 'center' });
  doc.text('Cliente', 155, signatureY + 5, { align: 'center' });

  // Save the PDF
  doc.save(`pedido-${order.id}.pdf`);
};