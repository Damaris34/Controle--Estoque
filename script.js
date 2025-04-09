document.getElementById('stockForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        registrationDate: document.getElementById('registrationDate').value,
        materialName: document.getElementById('materialName').value,
        quantityUsed: document.getElementById('quantityUsed').value,
        missingMaterial: document.getElementById('missingMaterial').value,
        purchaseQuantity: document.getElementById('purchaseQuantity').value
    };

    fetch('/api/stock/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch(error => {
        console.error('Erro ao registrar estoque:', error);
    });
});

document.getElementById('exportPdf').addEventListener('click', function() {
    fetch('/api/stock/exportPdf', {
        method: 'GET'
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'estoque.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Exportação para PDF concluída!');
    })
    .catch(error => {
        console.error('Erro ao exportar para PDF:', error);
    });
});
