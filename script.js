const calculatedHashes = [];

async function calculateHashes() {
    const fileInput = document.getElementById('fileInput');
    const hashResults = document.getElementById('hashResults');
    if (fileInput.files.length === 0) {
        alert('Por favor, selecciona al menos un archivo para calcular los hashes.');
        return;
    }

    showWarningModal();

    await new Promise(resolve => {
        const modalButton = document.querySelector('#warningModal button');
        modalButton.addEventListener('click', () => {
            resolve();
        });
    });

    for (const file of fileInput.files) {
        const reader = new FileReader();

        await new Promise(resolve => {
            reader.onload = async function(event) {
                const dataBuffer = event.target.result;
                const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
                const fileInfo = {
                    filename: file.name,
                    hash: hashHex
                };

                calculatedHashes.push(fileInfo);

                const resultElement = document.createElement('div');
                resultElement.classList.add('result');
                resultElement.innerHTML = `
                    <p><b>Nombre de archivo (.ext):</b> ${fileInfo.filename}</p>
                    <p><span style="color: #007bff;"><b>Hash SHA-256:</b> ${fileInfo.hash}</span></p>
                `;
                hashResults.appendChild(resultElement);
                resolve();
            };

            reader.readAsArrayBuffer(file);
        });
    }

    showSuccessModal();
}

function showWarningModal() {
    document.getElementById('warningModal').style.display = 'block';
}

function closeWarningModal() {
    document.getElementById('warningModal').style.display = 'none';
}

function showSuccessModal() {
    document.getElementById('successModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

function downloadResults() {
    if (calculatedHashes.length === 0) {
        alert('No hay resultados para descargar.');
        return;
    }

    const currentDateArgentina = new Date();
    currentDateArgentina.toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' });

    const formattedDate = currentDateArgentina.toLocaleDateString();
    const formattedTime = currentDateArgentina.toLocaleTimeString();

    const resultsText = calculatedHashes.map(item => `Nombre de archivo (.ext): ${item.filename}
Hash SHA-256: ${item.hash}
-----------------------------------------------
`).join('\n');

    const dateAndTimeInfo = `

-----------------------------------------------
Calculadora Algorítmica SHA-256 v2.5.8
Fecha y Hora de creación: ${formattedDate} ${formattedTime}
-----------------------------------------------
`;

    const finalResultsText = resultsText + dateAndTimeInfo;

    const blob = new Blob([finalResultsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Resultados_SHA-256.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

    function clearResults() {
        const hashResults = document.getElementById('hashResults');
        hashResults.innerHTML = '';
        calculatedHashes.length = 0;
        const fileInput = document.getElementById('fileInput');
        fileInput.value = '';
    }
