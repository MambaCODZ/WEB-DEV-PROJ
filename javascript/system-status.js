document.addEventListener("DOMContentLoaded", () => {
    // --- DYNAMIC CSS INJECTION ---
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; display: inline-block; }
        @keyframes pulseAlert { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        .node-degraded { animation: pulseAlert 1.5s infinite; background-color: rgba(255, 193, 7, 0.1) !important; }
        tr { transition: background-color 0.3s ease; }
    `;
    document.head.appendChild(style);

    // --- TOAST HELPER ---
    const showToast = (message, type = 'bg-success') => {
        const toastEl = document.getElementById('actionToast');
        const toastMsg = document.getElementById('toastMessage');
        if(toastEl && toastMsg) {
            toastMsg.innerText = message;
            toastEl.className = `toast align-items-center border-0 shadow ${type}`;
            new bootstrap.Toast(toastEl).show();
        }
    };

    // --- ANIMATED COUNTERS ---
    const animateValue = (element, start, end, duration, suffix = "") => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4); 
            let currentVal = (easeProgress * (end - start) + start);
            
            // Format decimals if needed
            if(end % 1 !== 0) currentVal = currentVal.toFixed(2);
            else currentVal = Math.floor(currentVal);
            
            element.innerHTML = currentVal + suffix;
            if (progress < 1) window.requestAnimationFrame(step);
            else element.innerHTML = end + suffix;
        };
        window.requestAnimationFrame(step);
    };

    // Animate static dashboard numbers
    document.querySelectorAll('.stat-value').forEach(el => {
        let text = el.innerText.replace(/,/g, '');
        if(text.includes('%')) {
            animateValue(el, 0, parseFloat(text), 2000, '%');
        } else if (!isNaN(text) && !text.includes('/')) {
            animateValue(el, 0, parseInt(text, 10), 2000);
        }
    });

    // --- LIVE LATENCY SIMULATOR ---
    const latencyDisplay = document.getElementById("latencyDisplay");
    if (latencyDisplay) {
        setInterval(() => {
            const currentLatency = parseInt(latencyDisplay.innerText);
            const variation = Math.floor(Math.random() * 7) - 3; // -3 to +3
            let newLatency = currentLatency + variation;
            if(newLatency < 8) newLatency = 8;
            if(newLatency > 45) newLatency = 45;
            
            latencyDisplay.innerText = `${newLatency}ms`;
            
            // Color code based on speed
            if(newLatency > 30) latencyDisplay.style.color = '#dc3545';
            else if(newLatency > 20) latencyDisplay.style.color = '#ffc107';
            else latencyDisplay.style.color = ''; // default
        }, 2000); 
    }

    // --- SELF-HEALING NETWORK SIMULATION ---
    const tableRows = document.querySelectorAll("#nodesTable tbody tr");
    if (tableRows.length > 0) {
        setInterval(() => {
            // 20% chance every 10 seconds to degrade a random node
            if (Math.random() > 0.8) {
                const randomRow = tableRows[Math.floor(Math.random() * tableRows.length)];
                const statusCell = randomRow.querySelector('.status-cell');
                const originalStatus = statusCell.innerHTML;

                // Degrade
                statusCell.innerHTML = `<span class="custom-badge badge-warning"><i class="bi bi-exclamation-triangle me-1"></i>Syncing</span>`;
                randomRow.classList.add('node-degraded');

                // Auto-recover after 4 seconds
                setTimeout(() => {
                    statusCell.innerHTML = originalStatus;
                    randomRow.classList.remove('node-degraded');
                }, 4000);
            }
        }, 10000);
    }

    // --- BUTTON INTERACTIONS (Retained & Polished) ---
    const pingBtn = document.getElementById("pingAllBtn");
    if (pingBtn) {
        pingBtn.addEventListener("click", () => {
            const originalText = pingBtn.innerHTML;
            pingBtn.disabled = true;
            pingBtn.innerHTML = `<i class="bi bi-arrow-repeat spin me-2"></i>Pinging...`;
            
            const statusCells = document.querySelectorAll("#nodesTable .status-cell");
            const originalBadges = Array.from(statusCells).map(cell => cell.innerHTML);

            statusCells.forEach(cell => {
                cell.innerHTML = `<span class="custom-badge badge-warning"><i class="bi bi-hourglass-split me-1"></i>Pinging</span>`;
            });

            setTimeout(() => {
                pingBtn.disabled = false;
                pingBtn.innerHTML = originalText;
                statusCells.forEach((cell, index) => { cell.innerHTML = originalBadges[index]; });
                showToast("All nodes responded successfully (Avg 12ms).", "bg-success");
            }, 1500);
        });
    }

    const restartGatewayBtn = document.getElementById("restartGatewayBtn");
    if (restartGatewayBtn) {
        restartGatewayBtn.addEventListener("click", () => {
            const originalText = restartGatewayBtn.innerHTML;
            restartGatewayBtn.disabled = true;
            restartGatewayBtn.classList.add("text-danger");
            restartGatewayBtn.innerHTML = `<i class="bi bi-power me-2"></i>Rebooting...`;
            
            setTimeout(() => {
                restartGatewayBtn.disabled = false;
                restartGatewayBtn.classList.remove("text-danger");
                restartGatewayBtn.innerHTML = originalText;
                showToast("API Gateway rebooted and traffic rerouted.", "bg-info");
            }, 2500);
        });
    }
});