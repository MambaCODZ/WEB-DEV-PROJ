


const darkModeBtn = document.getElementById('darkModeBtn');
const darkModeSwitch = document.getElementById('darkModeSwitch');

darkModeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    document.body.classList.toggle('dark-theme');
    
  
    const isDark = document.body.classList.contains('dark-theme');
    darkModeSwitch.checked = isDark;


    const chartTextColor = isDark ? '#94a3b8' : '#64748b';
    const chartGridColor = isDark ? '#27272a' : '#e2e8f0';

    Chart.helpers.each(Chart.instances, function(instance) {
        instance.options.scales.x.ticks.color = chartTextColor;
        instance.options.scales.y.ticks.color = chartTextColor;
        instance.options.scales.y.grid.color = chartGridColor;
        instance.update();
    });
});


document.getElementById('logoutBtn').addEventListener('click', function() {

    window.location.href = 'index.html'; 
});

const tooltipsOptions = {
    backgroundColor: '#0f172a',
    titleColor: '#ffffff',
    bodyColor: '#cbd5e1',
    padding: 12,
    cornerRadius: 6,
    displayColors: true,
};

const ctxOps = document.getElementById('opsChart').getContext('2d');
const opsChartInstance = new Chart(ctxOps, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Processed Transactions',
                data: [120, 190, 150, 210, 180, 140, 230],
                borderColor: '#1d4ed8',
                backgroundColor: 'rgba(29, 78, 216, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#1d4ed8',
                pointHoverRadius: 6
            },
            {
                label: 'Server Load (%)',
                data: [45, 65, 55, 75, 60, 50, 80],
                borderColor: '#64748b',
                backgroundColor: 'rgba(100, 116, 139, 0.05)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#64748b',
                pointHoverRadius: 6
            }
        ]
    },
    options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false }, tooltip: tooltipsOptions },
        scales: {
            y: { beginAtZero: true, grid: { color: '#e2e8f0', borderDash: [4, 4] } },
            x: { grid: { display: false } }
        }
    }
});


const ctxFin = document.getElementById('financialChart').getContext('2d');
new Chart(ctxFin, {
    type: 'bar',
    data: {
        labels: ['Q1', 'Q2', 'Q3'],
        datasets: [
            { label: 'Overhead', data: [42000, 48000, 41000], backgroundColor: '#94a3b8', borderRadius: 4 },
            { label: 'Profit', data: [65000, 78000, 85000], backgroundColor: '#1d4ed8', borderRadius: 4 }
        ]
    },
    options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 10 } }, tooltip: tooltipsOptions },
        scales: {
            y: { beginAtZero: true, grid: { color: '#e2e8f0', borderDash: [4, 4] } },
            x: { grid: { display: false } }
        }
    }
});


const timeFilters = document.querySelectorAll('.time-filter');

timeFilters.forEach(btn => {
    btn.addEventListener('click', function() {
    
        timeFilters.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const newTransactions = Array.from({length: 7}, () => Math.floor(Math.random() * 200) + 100);
        const newServerLoad = Array.from({length: 7}, () => Math.floor(Math.random() * 60) + 30);

        // Inject new data and animate the chart update
        opsChartInstance.data.datasets[0].data = newTransactions;
        opsChartInstance.data.datasets[1].data = newServerLoad;
        opsChartInstance.update();
    });
});

const ctxTraffic = document.getElementById('trafficChart').getContext('2d');
const trafficChartInstance = new Chart(ctxTraffic, {
    type: 'doughnut',
    data: {
        labels: ['Direct', 'Referral', 'Organic', 'Social'],
        datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: [
                '#1d4ed8', // Primary Blue
                '#3b82f6', // Light Blue
                '#93c5fd', // Pale Blue
                '#e2e8f0'  // Gray
            ],
            borderWidth: 0,
            hoverOffset: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%', // Makes the ring thinner and more modern
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 20,
                    color: '#64748b' // Default legend text color
                }
            },
            tooltip: tooltipsOptions
        }
    }
});


darkModeBtn.addEventListener('click', function(e) {
   
    
    const isDark = document.body.classList.contains('dark-theme');
    const chartTextColor = isDark ? '#94a3b8' : '#64748b';

    if (trafficChartInstance) {
        trafficChartInstance.options.plugins.legend.labels.color = chartTextColor;
        
      
        trafficChartInstance.data.datasets[0].backgroundColor[3] = isDark ? '#27272a' : '#e2e8f0'; 
        trafficChartInstance.update();
    }
});
function showToast(message, type = 'success') {
    const toastEl = document.getElementById('actionToast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastEl.classList.remove('bg-success', 'bg-primary');
    if (type === 'success') toastEl.classList.add('bg-success');
    if (type === 'primary') toastEl.classList.add('bg-primary');
    
    toastMessage.textContent = message;
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}


const newTransactionForm = document.getElementById('newTransactionForm');
if(newTransactionForm) {
    newTransactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const clientName = document.getElementById('clientName').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        const status = document.getElementById('transactionStatus').value;
        
        const id = '#TRX-' + Math.floor(Math.random() * 9000 + 1000);
        const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        let badgeClass = 'badge-success';
        if(status === 'Pending') badgeClass = 'badge-warning';
        if(status === 'Failed') badgeClass = 'badge-danger';

        const newRow = `
            <tr>
                <td class="fw-bold">${id}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(clientName)}&background=f1f5f9&color=1e293b" class="rounded-circle" width="30" height="30" alt="${clientName}">
                        <span>${clientName}</span>
                    </div>
                </td>
                <td>${date}</td>
                <td class="fw-bold">$${amount}</td>
                <td><span class="custom-badge ${badgeClass}">${status}</span></td>
            </tr>
        `;

        
        const tableBody = document.querySelector('#transactionTable tbody');
        if(tableBody) tableBody.insertAdjacentHTML('afterbegin', newRow);

      
        bootstrap.Modal.getInstance(document.getElementById('newTransactionModal')).hide();
        this.reset();
        showToast('Transaction successfully recorded!', 'success');
    });
}


const btnGenerateReport = document.getElementById('btnGenerateReport');
if(btnGenerateReport) {
    btnGenerateReport.addEventListener('click', function() {
        const btn = this;
        const originalContent = btn.innerHTML;
        
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.disabled = false;
            showToast('System report generated and downloaded.', 'primary');
        }, 2000);
    });
}

const addUserForm = document.getElementById('addUserForm');
if(addUserForm) {
    addUserForm.addEventListener('submit', function(e) {
        e.preventDefault();
        bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
        this.reset();
        showToast('New user added to directory.', 'success');
    });
}

const sendCampaignForm = document.getElementById('sendCampaignForm');
if(sendCampaignForm) {
    sendCampaignForm.addEventListener('submit', function(e) {
        e.preventDefault();
        bootstrap.Modal.getInstance(document.getElementById('sendCampaignModal')).hide();
        this.reset();
        showToast('Marketing campaign dispatched!', 'primary');
    });
}