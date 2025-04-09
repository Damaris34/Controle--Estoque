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
        showNotification('Exportação para PDF concluída!', 'success');
    })
    .catch(error => {
        console.error('Erro ao exportar para PDF:', error);
        showNotification('Erro ao exportar para PDF.', 'error');
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
        showNotification('Exportação para PDF concluída!', 'success');
    })
    .catch(error => {
        console.error('Erro ao exportar para PDF:', error);
        showNotification('Erro ao exportar para PDF.', 'error');
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
