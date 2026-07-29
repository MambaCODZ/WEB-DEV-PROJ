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
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. LIVE SEARCH FILTERING ---
    const searchInput = document.getElementById("globalSearch");
    const tableRows = document.querySelectorAll("#nodesTable tbody tr");

    if (searchInput) {
        searchInput.addEventListener("input", function() {
            const searchTerm = this.value.toLowerCase();
            
            tableRows.forEach(row => {
                // Get all text content from the row
                const rowData = row.textContent.toLowerCase();
                
                // Show or hide based on match
                if (rowData.includes(searchTerm)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }

    // --- 2. SIMULATE LIVE SERVER LATENCY ---
    const latencyDisplay = document.getElementById("latencyDisplay");
    
    // Update the latency every 4 seconds to make the dashboard feel "alive"
    if (latencyDisplay) {
        setInterval(() => {
            // Generate a random latency between 10ms and 28ms
            const newLatency = Math.floor(Math.random() * 18) + 10;
            latencyDisplay.innerText = `${newLatency}ms`;
        }, 4000); 
    }


    // --- 3. TOAST NOTIFICATION HELPER ---
    // Reusable function to show Bootstrap toasts
    const showToast = (message, type = 'bg-success') => {
        const toastEl = document.getElementById('actionToast');
        const toastMsg = document.getElementById('toastMessage');
        
        if(toastEl && toastMsg) {
            toastMsg.innerText = message;
            
            // Remove existing color classes, then add the new one
            toastEl.classList.remove('bg-success', 'bg-primary', 'bg-warning', 'bg-info');
            toastEl.classList.add(type);
            
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    };


    // --- 4. ACTION BUTTONS INTERACTIVITY ---

    // A. Ping All Nodes
    const pingBtn = document.getElementById("pingAllBtn");
    if (pingBtn) {
        pingBtn.addEventListener("click", () => {
            const originalText = pingBtn.innerHTML;
            
            // 1. Set button to loading state
            pingBtn.disabled = true;
            pingBtn.innerHTML = `<i class="bi bi-arrow-repeat spin me-2" style="animation: spin 1s linear infinite;"></i>Pinging...`;

            // 2. Temporarily change table badges to "Pinging..."
            const statusCells = document.querySelectorAll("#nodesTable .status-cell");
            const originalBadges = [];

            statusCells.forEach((cell, index) => {
                originalBadges[index] = cell.innerHTML; // Save original HTML
                cell.innerHTML = `<span class="custom-badge badge-warning"><i class="bi bi-hourglass-split me-1"></i>Pinging</span>`;
            });

            // 3. Reset after simulated delay
            setTimeout(() => {
                pingBtn.disabled = false;
                pingBtn.innerHTML = originalText;
                
                // Restore original table badges
                statusCells.forEach((cell, index) => {
                    cell.innerHTML = originalBadges[index];
                });

                showToast("All nodes responded successfully.", "bg-success");
            }, 1200);
        });
    }

    // B. Download Health Report
    const downloadReportBtn = document.getElementById("downloadReportBtn");
    if (downloadReportBtn) {
        downloadReportBtn.addEventListener("click", () => {
            const originalText = downloadReportBtn.innerHTML;
            downloadReportBtn.innerHTML = `<i class="bi bi-arrow-down-circle me-2"></i>Preparing PDF...`;
            
            setTimeout(() => {
                downloadReportBtn.innerHTML = originalText;
                showToast("Health report downloaded successfully.", "bg-primary");
            }, 800);
        });
    }

    // C. Restart Gateway
    const restartGatewayBtn = document.getElementById("restartGatewayBtn");
    if (restartGatewayBtn) {
        restartGatewayBtn.addEventListener("click", () => {
            const originalText = restartGatewayBtn.innerHTML;
            restartGatewayBtn.disabled = true;
            restartGatewayBtn.classList.add("text-danger");
            restartGatewayBtn.innerHTML = `<i class="bi bi-power me-2"></i>Restarting...`;
            
            setTimeout(() => {
                restartGatewayBtn.disabled = false;
                restartGatewayBtn.classList.remove("text-danger");
                restartGatewayBtn.innerHTML = originalText;
                showToast("API Gateway restarted and stable.", "bg-info");
            }, 2000);
        });
    }
    
    // Add CSS for the spinning animation dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin { 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
});