document.addEventListener("DOMContentLoaded", () => {
    // Live Search
    const searchInput = document.getElementById("globalSearch");
    const tableRows = document.querySelectorAll("#securityTable tbody tr");

    if (searchInput) {
        searchInput.addEventListener("input", function() {
            const searchTerm = this.value.toLowerCase();
            tableRows.forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? "" : "none";
            });
        });
    }

    // Toast Helper
    const showToast = (message, type = 'bg-success') => {
        const toastEl = document.getElementById('actionToast');
        const toastMsg = document.getElementById('toastMessage');
        if(toastEl && toastMsg) {
            toastMsg.innerText = message;
            toastEl.className = `toast align-items-center border-0 shadow ${type}`;
            new bootstrap.Toast(toastEl).show();
        }
    };

    // Deep Scan Button
    const runScanBtn = document.getElementById("runScanBtn");
    const lastScanTime = document.getElementById("lastScanTime");
    
    if (runScanBtn) {
        runScanBtn.addEventListener("click", () => {
            const originalText = runScanBtn.innerHTML;
            runScanBtn.disabled = true;
            runScanBtn.innerHTML = `<i class="bi bi-radar spin me-2" style="animation: spin 1.5s linear infinite;"></i>Scanning...`;

            setTimeout(() => {
                runScanBtn.disabled = false;
                runScanBtn.innerHTML = originalText;
                
                // Update time
                const now = new Date();
                lastScanTime.innerText = `Today, ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                
                showToast("Deep scan completed. No new vulnerabilities found.", "bg-success");
            }, 2500);
        });
    }

    // Export Audit
    const exportAuditBtn = document.getElementById("exportAuditBtn");
    if (exportAuditBtn) {
        exportAuditBtn.addEventListener("click", () => {
            const originalText = exportAuditBtn.innerHTML;
            exportAuditBtn.innerHTML = `<i class="bi bi-hourglass-split me-2"></i>Compiling...`;
            setTimeout(() => {
                exportAuditBtn.innerHTML = originalText;
                showToast("Audit log (.csv) downloaded securely.", "bg-primary");
            }, 1000);
        });
    }

    // Keyframes
    const style = document.createElement('style');
    style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
});