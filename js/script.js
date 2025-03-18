window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 1000);
});

// Gestion 
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    
    tabs.forEach(tab => {
        tab.style.display = 'none';
    });
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(tabId).style.display = 'block';
    event.target.classList.add('active');
}

// Calculateur 
function calculateSubnet() {
    const ipInput = document.getElementById('ip').value;
    const maskInput = document.getElementById('mask').value;
    const resultDiv = document.getElementById('subnet-result');

    try {
        let mask;
        let maskBits;
        if (maskInput.startsWith('/')) {
            maskBits = parseInt(maskInput.slice(1));
            mask = cidrToMask(maskBits);
        } else {
            mask = maskInput.split('.').map(Number);
            maskBits = mask.reduce((acc, val) => 
                acc + val.toString(2).split('1').length - 1, 0);
        }

        const ip = ipInput.split('.').map(Number);
        const network = ip.map((octet, i) => octet & mask[i]);
        const broadcast = network.map((octet, i) => octet | (255 - mask[i]));
        const first = [...network]; first[3] += 1;
        const last = [...broadcast]; last[3] -= 1;
        const hosts = Math.pow(2, 32 - maskBits) - 2;
        const subnetNumber = network[3] / (256 / Math.pow(2, 32 - maskBits));

        document.getElementById('network').textContent = network.join('.');
        document.getElementById('first').textContent = first.join('.');
        document.getElementById('last').textContent = last.join('.');
        document.getElementById('broadcast').textContent = broadcast.join('.');
        document.getElementById('hosts').textContent = hosts;
        document.getElementById('subnet-number').textContent = Math.floor(subnetNumber);
        
        resultDiv.style.display = 'block';
    } catch (error) {
        alert('Veuillez entrer une IP et un masque valides');
    }
}

function cidrToMask(bits) {
    const mask = [0, 0, 0, 0];
    for (let i = 0; i < bits; i++) {
        mask[Math.floor(i / 8)] |= (1 << (7 - (i % 8)));
    }
    return mask;
}

// Convertisseur 
function convert() {
    const inputValue = document.getElementById('input-value').value.trim();
    const fromBase = document.getElementById('from-base').value;
    const toBase = document.getElementById('to-base').value;
    const resultDiv = document.getElementById('convert-result');
    const outputSpan = document.getElementById('convert-output');

    try {
        let decimal;
        
        switch (fromBase) {
            case 'dec':
                decimal = parseInt(inputValue, 10);
                break;
            case 'bin':
                decimal = parseInt(inputValue, 2);
                break;
            case 'hex':
                decimal = parseInt(inputValue, 16);
                break;
            default:
                throw new Error('Base invalide');
        }

        if (isNaN(decimal)) {
            throw new Error('Valeur invalide');
        }

        let result;
        switch (toBase) {
            case 'dec':
                result = decimal.toString(10);
                break;
            case 'bin':
                result = ('00000000' + decimal.toString(2)).slice(-8);
                break;
            case 'hex':
                result = decimal.toString(16).toUpperCase();
                break;
            default:
                throw new Error('Base invalide');
        }

        outputSpan.textContent = result;
        resultDiv.style.display = 'block';
    } catch (error) {
        alert('Veuillez entrer une valeur valide pour la base sélectionnée');
    }
}

// Bloc-notes ->
function saveNotes() {
    const notes = document.getElementById('notes').value;
    localStorage.setItem('networkNotes', notes);
    alert('Notes sauvegardées !');
}

function clearNotes() {
    document.getElementById('notes').value = '';
    localStorage.removeItem('networkNotes');
    alert('Notes effacées !');
}

// To charges ->
window.addEventListener('load', () => {
    const savedNotes = localStorage.getItem('networkNotes');
    if (savedNotes) {
        document.getElementById('notes').value = savedNotes;
    }
});