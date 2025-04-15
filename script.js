let registros = [];

function registrarUso() {
    const dataRegistroUso = document.getElementById('dataRegistroUso').value;
    const materialUtilizado = document.getElementById('materialUtilizado').value;
    const quantidadeUtilizada = document.getElementById('quantidadeUtilizada').value;

    registros.push({
        data: dataRegistroUso,
        material: materialUtilizado,
        quantidade: quantidadeUtilizada,
        tipo: 'Uso'
    });

    atualizarTabela();
    limparFormulario('usoForm');
}

function registrarEntrada() {
    const dataRegistroEntrada = document.getElementById('dataRegistroEntrada').value;
    const materialEmFalta = document.getElementById('materialEmFalta').value;
    const quantidadeEntrada = document.getElementById('quantidadeEntrada').value;

    registros.push({
        data: dataRegistroEntrada,
        material: materialEmFalta,
        quantidade: quantidadeEntrada,
        tipo: 'Entrada'
    });

    atualizarTabela();
    limparFormulario('entradaForm');
}

function atualizarTabela() {
    const tbody = document.querySelector('#registrosTable tbody');
    tbody.innerHTML = '';

    registros.forEach(registro => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${registro.data}</td>
            <td>${registro.material}</td>
            <td>${registro.quantidade}</td>
            <td>${registro.tipo}</td>
        `;
        tbody.appendChild(row);
    });
}

function limparFormulario(formId) {
    document.getElementById(formId).reset();
}

function gerarPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // Adicionar cabeçalho
    doc.setFontSize(18);
    doc.text('Controle de Estoque', 20, 20);
    doc.setFontSize(12);
    doc.text('Data de Geração: ' + new Date().toLocaleDateString(), 20, 30);

    // Configurações da tabela
    const headers = [['Data de Registro', 'Material', 'Quantidade', 'Tipo']];
    const data = registros.map(registro => [
        registro.data,
        registro.material,
        registro.quantidade,
        registro.tipo
    ]);

    // Adicionar tabela ao PDF
    doc.autoTable({
        startY: 40,
        head: headers,
        body: data,
        theme: 'striped',
        styles: {
            fontSize: 12,
            cellPadding: 5,
            overflow: 'linebreak',
            halign: 'center',
            valign: 'middle'
        },
        headStyles: {
            fillColor: [40, 167, 69],
            textColor: 255,
            fontSize: 14
        },
        bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: 0
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        },
        didDrawPage: function (data) {
            // Adicionar rodapé
            doc.setFontSize(10);
            doc.text('Página ' + doc.internal.getNumberOfPages(), data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });

    // Adicionar rodapé em todas as páginas
    const totalPagesExp = '{total_pages_count_string}';
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 10,
        body: [
            [{ content: 'Relatório gerado automaticamente', colSpan: 4, styles: { halign: 'center', fillColor: [220, 220, 220] } }],
            [{ content: 'Total de Registros: ' + registros.length, colSpan: 4, styles: { halign: 'center' } }]
        ],
        theme: 'plain',
        didDrawPage: function (data) {
            // Rodapé
            doc.setFontSize(10);
            doc.text('Página ' + doc.internal.getNumberOfPages(), data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });

    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    // Salvar o PDF
    doc.save('controle_de_estoque.pdf');
}
