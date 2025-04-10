import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class StockService {

    private List<StockData> stockList = new ArrayList<>();

    public void registerStock(StockData stockData) {
        stockList.add(stockData);
    }

    public ResponseEntity<byte[]> exportPdf() {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        try {
            PdfWriter writer = PdfWriter.getInstance(document, outputStream);
            document.open();

            // Adicionar metadados
            document.addTitle("Relatório de Estoque");
            document.addAuthor("Sistema de Controle de Estoque");

            // Adicionar título
            Paragraph title = new Paragraph("Relatório de Estoque", new Font(Font.FontFamily.HELVETICA, 20, Font.BOLD));
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20f);
            document.add(title);

            // Criar tabela
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setSpacingBefore(20f);

            // Definir larguras relativas das colunas
            float[] columnWidths = {1.5f, 3f, 1.5f, 2f, 1.5f};
            table.setWidths(columnWidths);

            // Adicionar cabeçalho da tabela
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            PdfPCell cell;

            cell = new PdfPCell(new Phrase("Data de Registro", headerFont));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(8f);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Nome do Material", headerFont));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(8f);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Quantidade Utilizada", headerFont));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(8f);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Material em Falta", headerFont));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(8f);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Quantidade para Compra", headerFont));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(8f);
            table.addCell(cell);

            // Adicionar dados à tabela
            Font rowFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL);
            for (StockData stockData : stockList) {
                table.addCell(new Phrase(stockData.getRegistrationDate(), rowFont));
                table.addCell(new Phrase(stockData.getMaterialName(), rowFont));
                table.addCell(new Phrase(String.valueOf(stockData.getQuantityUsed()), rowFont));
                table.addCell(new Phrase(stockData.getMissingMaterial(), rowFont));
                table.addCell(new Phrase(String.valueOf(stockData.getPurchaseQuantity()), rowFont));
            }

            document.add(table);
            System.out.println("PDF gerado com sucesso.");

        } catch (DocumentException e) {
            e.printStackTrace();
            System.err.println("Erro ao gerar PDF: " + e.getMessage());
        } finally {
            document.close();
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_estoque.pdf");
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
        return ResponseEntity.ok().headers(headers).body(outputStream.toByteArray());
    }
}

document.getElementById('stockForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        registrationDate: document.getElementById('registrationDate').value,
        materialName: document.getElementById('materialName').value,
        quantityUsed: document.getElementById('quantityUsed').value,
        missingMaterial: document.getElementById('missingMaterial').value,
        purchaseQuantity: document.getElementById('purchaseQuantity').value
    };

    if (!validateForm(formData)) {
        showNotification('Por favor, preencha todos os campos corretamente.', 'error');
        return;
    }

    fetch('/api/stock/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.text())
    .then(data => {
        showNotification(data, 'success');
    })
    .catch(error => {
        console.error('Erro ao registrar estoque:', error);
        showNotification('Erro ao registrar estoque.', 'error');
    });
});

document.getElementById('exportPdf').addEventListener('click', function() {
    document.getElementById('loading').classList.remove('hidden');

    fetch('/api/stock/exportPdf', {
        method: 'GET'
    })
    .then(response => {
        if (response.ok) {
            return response.blob();
        }
        throw new Error('Erro ao exportar PDF.');
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'relatorio_estoque.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showNotification('Exportação para PDF concluída!', 'success');
    })
    .catch(error => {
        console.error('Erro ao exportar para PDF:', error);
        showNotification('Erro ao exportar para PDF.', 'error');
    })
    .finally(() => {
        document.getElementById('loading').classList.add('hidden');
    });
});

function validateForm(formData) {
    return formData.registrationDate && formData.materialName && formData.quantityUsed !== undefined;
}

function showNotification(message, type) {
    const notificationDiv = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;
    notificationDiv.appendChild(notification);
    setTimeout(() => notificationDiv.removeChild(notification), 3000);
}
