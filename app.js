let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myChart;

function addTransaction(type) {
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    if (!amount || !description) return alert("Inserisci tutti i dati");

    const transaction = {
        id: Date.now(),
        amount: parseFloat(amount),
        description,
        category,
        type,
        date: new Date().toISOString().split('T')[0]
    };

    transactions.push(transaction);
    updateUI();
    saveData();
}

function updateUI() {
    // Calcolo Saldo
    const total = transactions.reduce((acc, t) => {
        return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
    
    document.getElementById('total-balance').innerText = `€ ${total.toFixed(2)}`;
    updateChart();
}

function updateChart() {
    const categories = [...new Set(transactions.map(t => t.category))];
    const totals = categories.map(cat => {
        return transactions
            .filter(t => t.category === cat && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    });

    const ctx = document.getElementById('financeChart').getContext('2d');
    
    if (myChart) myChart.destroy();
    
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                data: totals,
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
            }]
        },
        options: { responsive: true }
    });
}

function saveData() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Inizializzazione
updateUI();