document.addEventListener("DOMContentLoaded", () => {

    // --- 1. GLOBAL TOAST HELPER ---
    const showGlobalToast = (message, type = 'bg-primary') => {
        let toastEl = document.getElementById('actionToast');
        let toastMsg = document.getElementById('toastMessage');
        
        // If the page doesn't have a toast container, inject one quickly
        if (!toastEl) {
            const toastHTML = `
                <div class="toast-container position-fixed bottom-0 end-0 p-4" style="z-index: 1090;">
                    <div id="actionToast" class="toast align-items-center border-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="d-flex">
                            <div class="toast-body fw-bold text-white" id="toastMessage"></div>
                            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', toastHTML);
            toastEl = document.getElementById('actionToast');
            toastMsg = document.getElementById('toastMessage');
        }

        toastMsg.innerText = message;
        toastEl.className = `toast align-items-center border-0 shadow ${type}`;
        new bootstrap.Toast(toastEl).show();
    };



    // --- 3. LOGOUT LOGIC ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logoutBtn.innerHTML = `<i class="bi bi-box-arrow-right me-2"></i> Logging out...`;
            setTimeout(() => {
                // Simulate redirecting to a login page
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    alert("Redirecting to Login Page..."); 
                }, 500);
            }, 800);
        });
    }

    // --- 4. QUICK SETTINGS OFFCANVAS (Dynamic Injection) ---
    // We inject this HTML so you don't have to paste it into every single HTML file
    const settingsOffcanvasHTML = `
    <div class="offcanvas offcanvas-end" tabindex="-1" id="settingsOffcanvas" aria-labelledby="settingsOffcanvasLabel" style="z-index: 1080;">
        <div class="offcanvas-header border-bottom bg-light">
            <h6 class="offcanvas-title fw-bold text-dark" id="settingsOffcanvasLabel"><i class="bi bi-gear-fill text-primary me-2"></i>Quick Settings</h6>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body p-4">
            
            <!-- UI Preferences -->
            <h6 class="text-muted small fw-bold mb-3">UI PREFERENCES</h6>
            
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <div class="fw-bold text-dark" style="font-size: 0.9rem;">Compact Sidebar</div>
                    <div class="text-muted" style="font-size: 0.75rem;">Reduce sidebar width</div>
                </div>
                <div class="form-check form-switch m-0 p-0">
                    <input class="form-check-input ms-2 border-secondary" type="checkbox" id="compactSidebarToggle">
                </div>
            </div>
            
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <div class="fw-bold text-dark" style="font-size: 0.9rem;">Animations</div>
                    <div class="text-muted" style="font-size: 0.75rem;">Enable UI transitions</div>
                </div>
                <div class="form-check form-switch m-0 p-0">
                    <input class="form-check-input ms-2 border-secondary" type="checkbox" id="animationsToggle" checked>
                </div>
            </div>

            <hr class="text-muted opacity-25">

            <!-- Notifications -->
            <h6 class="text-muted small fw-bold mb-3 mt-4">NOTIFICATIONS</h6>
            
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <div class="fw-bold text-dark" style="font-size: 0.9rem;">Email Alerts</div>
                    <div class="text-muted" style="font-size: 0.75rem;">Receive daily summaries</div>
                </div>
                <div class="form-check form-switch m-0 p-0">
                    <input class="form-check-input ms-2 border-secondary" type="checkbox" id="emailAlertsToggle" checked>
                </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <div class="fw-bold text-dark" style="font-size: 0.9rem;">Critical SMS</div>
                    <div class="text-muted" style="font-size: 0.75rem;">For system downtimes</div>
                </div>
                <div class="form-check form-switch m-0 p-0">
                    <input class="form-check-input ms-2 border-secondary" type="checkbox" id="smsAlertsToggle">
                </div>
            </div>

            <hr class="text-muted opacity-25">

            <!-- Action Buttons -->
            <div class="mt-4 d-grid gap-2">
                <button class="btn btn-outline-primary btn-sm fw-bold"><i class="bi bi-person-badge me-2"></i>Manage Profile</button>
                <button class="btn btn-outline-danger btn-sm fw-bold" id="clearDataBtn"><i class="bi bi-trash3 me-2"></i>Clear App Data</button>
            </div>

        </div>
    </div>
    `;
    
    // Inject into body
    document.body.insertAdjacentHTML('beforeend', settingsOffcanvasHTML);
    const settingsOffcanvas = new bootstrap.Offcanvas(document.getElementById('settingsOffcanvas'));

    // Find the Settings button from the profile dropdown
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        if (item.innerHTML.includes('bi-gear') || item.innerText.includes('Settings')) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                settingsOffcanvas.show();
            });
        }
    });

    // --- 5. SETTINGS INTERACTIVITY ---
    
    // Compact Sidebar Toggle
    const compactSidebarToggle = document.getElementById('compactSidebarToggle');
    if (compactSidebarToggle) {
        compactSidebarToggle.addEventListener('change', (e) => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                if(e.target.checked) {
                    sidebar.style.width = '200px';
                    showGlobalToast("Compact sidebar enabled.", "bg-primary");
                } else {
                    sidebar.style.width = '260px'; // Assuming your default is 260px
                    showGlobalToast("Default sidebar restored.", "bg-secondary");
                }
            }
        });
    }

    // Generic toggles for visual feedback
    const genericToggles = ['animationsToggle', 'emailAlertsToggle', 'smsAlertsToggle'];
    genericToggles.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', (e) => {
                const settingName = e.target.parentElement.previousElementSibling.querySelector('.fw-bold').innerText;
                const status = e.target.checked ? 'enabled' : 'disabled';
                showGlobalToast(`${settingName} ${status}.`, e.target.checked ? 'bg-success' : 'bg-secondary');
            });
        }
    });

    // Clear Data Button (Simulates resetting localStorage)
    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            clearDataBtn.innerHTML = `<i class="bi bi-arrow-repeat spin me-2"></i>Clearing...`;
            setTimeout(() => {
                localStorage.clear();
                clearDataBtn.innerHTML = `<i class="bi bi-check-circle me-2"></i>Data Cleared`;
                clearDataBtn.classList.replace('btn-outline-danger', 'btn-success');
                showGlobalToast("Local application data wiped.", "bg-dark");
                
                setTimeout(() => {
                    clearDataBtn.innerHTML = `<i class="bi bi-trash3 me-2"></i>Clear App Data`;
                    clearDataBtn.classList.replace('btn-success', 'btn-outline-danger');
                }, 2000);
            }, 1000);
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // GLOBAL UTILITIES
    // ==========================================
    
    // Toast Notification System
    const showToast = (message, type = 'success') => {
        const toastEl = document.getElementById('actionToast');
        if (!toastEl) return;
        
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.textContent = message;
        
        // Change color based on type
        toastEl.className = `toast align-items-center border-0 shadow text-white bg-${type}`;
        
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    };

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };


    // ==========================================
    // 1. REVENUE METRICS PAGE LOGIC
    // ==========================================
    if (document.getElementById('revenueGrowthChart')) {
        let currentMRR = 84500;
        let currentARPU = 124.50;

        // Initialize Chart.js
        const ctx = document.getElementById('revenueGrowthChart').getContext('2d');
        const revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Gross Revenue ($)',
                    data: [45000, 48000, 52000, 51000, 59000, 65000, 71000, 78000, 81000, 84500],
                    borderColor: '#1d4ed8',
                    backgroundColor: 'rgba(29, 78, 216, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
                    x: { grid: { display: false } }
                }
            }
        });

        // Handle Add Revenue Stream Form
        const revForm = document.getElementById('revenueForm');
        revForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const streamName = document.getElementById('streamName').value;
            const streamValue = parseFloat(document.getElementById('streamValue').value);

            // Update KPIs
            currentMRR += streamValue;
            document.getElementById('mrrDisplay').textContent = formatCurrency(currentMRR);
            
            // Slightly increase ARPU artificially for demonstration
            currentARPU += (streamValue / 1000); 
            document.getElementById('arpuDisplay').textContent = formatCurrency(currentARPU);

            // Add projection point to chart
            revenueChart.data.labels.push('Nov (Proj)');
            revenueChart.data.datasets[0].data.push(currentMRR);
            revenueChart.update();

            // Close Modal & Reset Form
            const modal = bootstrap.Modal.getInstance(document.getElementById('addRevenueModal'));
            modal.hide();
            revForm.reset();

            showToast(`${streamName} stream added! Projections updated.`);
        });
    }


    // ==========================================
    // 2. BILLING & INVOICES PAGE LOGIC
    // ==========================================
    if (document.getElementById('invoiceTable')) {
        const invoiceTable = document.getElementById('invoiceTable').getElementsByTagName('tbody')[0];
        
        // Handle Generate Invoice
        const invForm = document.getElementById('invoiceForm');
        invForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const client = document.getElementById('invClient').value;
            const amount = parseFloat(document.getElementById('invAmount').value);
            const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const invNumber = `INV-2023-${Math.floor(Math.random() * 900) + 100}`;

            // Create new row dynamically
            const newRow = invoiceTable.insertRow(0); // Insert at top
            newRow.innerHTML = `
                <td class="ps-4 fw-bold">${invNumber}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="avatar-circle bg-primary text-white" style="width:30px; height:30px; font-size:12px;">${client.charAt(0)}</div>
                        <span>${client}</span>
                    </div>
                </td>
                <td>${date}</td>
                <td class="fw-bold">${formatCurrency(amount)}</td>
                <td><span class="custom-badge badge-warning status-badge">Pending</span></td>
                <td class="pe-4 text-end">
                    <button class="btn btn-sm btn-outline-success mark-paid-btn me-1">Mark Paid</button>
                    <button class="btn btn-sm btn-outline-secondary download-inv-btn"><i class="bi bi-download"></i></button>
                </td>
            `;

            // Close Modal & Show Toast
            const modal = bootstrap.Modal.getInstance(document.getElementById('createInvoiceModal'));
            modal.hide();
            invForm.reset();
            showToast(`Invoice ${invNumber} generated for ${client}.`);
        });

        // Event Delegation for dynamically added buttons in the table
        invoiceTable.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;
            
            const row = target.closest('tr');
            const invNum = row.cells[0].innerText;

            // MARK AS PAID LOGIC
            if (target.classList.contains('mark-paid-btn')) {
                const badge = row.querySelector('.status-badge');
                badge.className = 'custom-badge badge-success status-badge';
                badge.innerText = 'Paid';
                target.remove(); // Remove the button once paid
                showToast(`Invoice ${invNum} marked as Paid!`);
            }

            // DOWNLOAD INVOICE LOGIC (Generates a real file)
            if (target.classList.contains('download-inv-btn')) {
                const client = row.cells[1].innerText.trim();
                const amount = row.cells[3].innerText;
                const status = row.querySelector('.status-badge').innerText;
                
                // Create mock invoice text
                const invoiceContent = `
========================================
             ENTERPRISE INC.
========================================
INVOICE: ${invNum}
CLIENT:  ${client}
STATUS:  ${status}
----------------------------------------
TOTAL DUE: ${amount}
========================================
Thank you for your business!`;

                // Create a Blob and trigger actual browser download
                const blob = new Blob([invoiceContent], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${invNum}_${client.replace(/\s+/g, '_')}.txt`;
                link.click();
                
                showToast(`Downloading ${invNum}...`);
            }
        });
    }


    // ==========================================
    // 3. EXPORT REPORTS PAGE LOGIC
    // ==========================================
    if (document.getElementById('exportForm')) {
        const exportForm = document.getElementById('exportForm');
        
        exportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            const format = document.getElementById('exportFormat').value;
            
            const includeRev = document.getElementById('dataRevenue').checked;
            const includeTx = document.getElementById('dataTransactions').checked;
            const includeTax = document.getElementById('dataTax').checked;

            // Validation
            if (!startDate || !endDate) {
                showToast('Please select a valid date range.', 'danger');
                return;
            }

            showToast('Compiling financial data...', 'primary');

            // Generate Mock Data based on toggles
            let exportData = [];
            if (includeRev) exportData.push({ metric: 'Gross Revenue', value: '$84,500.00', date: endDate });
            if (includeTx) exportData.push({ metric: 'Transactions', count: 1240, volume: '$120,400.00' });
            if (includeTax) exportData.push({ metric: 'Estimated Tax', value: '$12,450.00', rate: '15%' });

            // File generation logic based on dropdown selection
            setTimeout(() => {
                let fileContent, mimeType, extension;

                if (format === 'json') {
                    // Export as JSON
                    fileContent = JSON.stringify({ range: { start: startDate, end: endDate }, data: exportData }, null, 2);
                    mimeType = 'application/json';
                    extension = 'json';
                } else {
                    // Export as CSV
                    const headers = Object.keys(exportData[0]).join(',');
                    const rows = exportData.map(obj => Object.values(obj).map(v => `"${v}"`).join(',')).join('\n');
                    fileContent = `${headers}\n${rows}`;
                    mimeType = 'text/csv';
                    extension = 'csv';
                }

                // Trigger Download
                const blob = new Blob([fileContent], { type: mimeType });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `Financial_Report_${startDate}_to_${endDate}.${extension}`;
                link.click();

                showToast(`Report successfully exported as ${extension.toUpperCase()}!`, 'success');
            }, 800); // Slight delay to simulate processing
        });
    }
});