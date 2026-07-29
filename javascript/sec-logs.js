document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. DYNAMIC CSS INJECTION ---
    // Injecting CSS for our new interactive animations so you don't have to touch your CSS files
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; display: inline-block; }
        
        @keyframes highlightRow {
            0% { background-color: rgba(25, 135, 84, 0.2); transform: translateX(-10px); opacity: 0; }
            100% { background-color: transparent; transform: translateX(0); opacity: 1; }
        }
        .new-log-row {
            animation: highlightRow 1s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }
        
        .ip-badge {
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .ip-badge:hover {
            transform: scale(1.05);
            background-color: #e2e8f0 !important;
        }
    `;
    document.head.appendChild(style);

    // --- 2. TOAST HELPER ---
    const showToast = (message, type = 'bg-success') => {
        const toastEl = document.getElementById('actionToast');
        const toastMsg = document.getElementById('toastMessage');
        if(toastEl && toastMsg) {
            toastMsg.innerText = message;
            toastEl.className = `toast align-items-center border-0 shadow ${type}`;
            new bootstrap.Toast(toastEl).show();
        }
    };

    // --- 3. ANIMATED NUMBER COUNTERS (On Load) ---
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Use easeOutQuart for a premium slow-down effect at the end
            const easeProgress = 1 - Math.pow(1 - progress, 4); 
            
            const currentVal = Math.floor(easeProgress * (end - start) + start);
            element.innerHTML = currentVal.toLocaleString(); 
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.innerHTML = end.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    };

    // Find all stat values that are numbers and animate them
    document.querySelectorAll('.stat-value').forEach(el => {
        const text = el.innerText.replace(/,/g, '');
        if (!isNaN(text) && text.trim() !== '') {
            const endValue = parseInt(text, 10);
            animateValue(el, 0, endValue, 2000); // 2 second animation
        }
    });

    // --- 4. LIVE METRIC TICKING ---
    // Make the firewall blocks look like they are actively stopping threats
    const firewallBlocksEl = document.getElementById("firewallBlocks");
    if (firewallBlocksEl) {
        setInterval(() => {
            if (Math.random() > 0.6) { // 40% chance to tick up every 3 seconds
                let currentVal = parseInt(firewallBlocksEl.innerText.replace(/,/g, ''), 10);
                currentVal += Math.floor(Math.random() * 3) + 1;
                firewallBlocksEl.innerText = currentVal.toLocaleString();
                
                // Add a subtle flash effect to the number
                firewallBlocksEl.style.color = '#198754';
                setTimeout(() => { firewallBlocksEl.style.color = ''; }, 500);
            }
        }, 3000);
    }

    // --- 5. LIVE LOG INJECTION (The "Wow" Factor) ---
    const tableBody = document.querySelector("#securityTable tbody");
    const notificationBell = document.querySelector(".bi-bell .position-absolute");
    
    const mockThreats = [
        { type: "Port Scan Detected", ip: "114.119.16.22", user: "Unknown", sev: "Medium", badge: "warning", icon: "bi-search" },
        { type: "DDoS Mitigation Active", ip: "Multiple", user: "System", sev: "High", badge: "danger", icon: "bi-shield-slash" },
        { type: "Malware Signature Blocked", ip: "185.15.59.20", user: "Guest Network", sev: "High", badge: "danger", icon: "bi-bug" },
        { type: "Admin Login Success", ip: "192.168.1.10", user: "System Admin", sev: "Low", badge: "success", icon: "bi-person-check" }
    ];

    setInterval(() => {
        if (!tableBody) return;

        // Pick a random threat
        const threat = mockThreats[Math.floor(Math.random() * mockThreats.length)];
        const now = new Date();
        const timeString = `Today, ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}`;

        // Create new row
        const newRow = document.createElement("tr");
        newRow.className = "interactive-row new-log-row";
        newRow.setAttribute("data-severity", threat.sev.toLowerCase());
        newRow.setAttribute("data-details", `Automated system detection at ${timeString}. Action handled by security protocols.`);
        
        newRow.innerHTML = `
            <td class="text-muted small">${timeString}</td>
            <td class="fw-bold"><i class="bi ${threat.icon} text-muted me-2"></i>${threat.type}</td>
            <td><span class="badge bg-light text-dark border ip-badge" title="Double click to copy">${threat.ip}</span></td>
            <td>${threat.user}</td>
            <td><span class="custom-badge badge-${threat.badge}">${threat.sev}</span></td>
        `;

        // Prepend to table
        tableBody.insertBefore(newRow, tableBody.firstChild);

        // Keep table from getting too long (max 6 rows)
        if (tableBody.children.length > 6) {
            tableBody.removeChild(tableBody.lastChild);
        }

        // Pulse the notification bell
        if (notificationBell && (threat.sev === "High" || threat.sev === "Medium")) {
            notificationBell.style.transform = "scale(1.5) translate(-50%, -50%)";
            setTimeout(() => { notificationBell.style.transform = "translate(-50%, -50%)"; }, 300);
        }

        // Re-attach click listeners for the new row (Modal & Copy IP)
        attachRowListeners(newRow);

    }, 12000); // Injects a new log every 12 seconds

    // --- 6. ATTACH LISTENERS (Modal & Copy IP) ---
    const logModal = new bootstrap.Modal(document.getElementById('logDetailsModal'));
    
    function attachRowListeners(row) {
        // Modal logic
        row.addEventListener("click", (e) => {
            // Prevent modal if clicking the IP badge directly
            if (e.target.classList.contains('ip-badge')) return;

            document.getElementById('modalEventType').innerText = row.cells[1].innerText;
            document.getElementById('modalIpAddress').innerText = row.cells[2].innerText;
            document.getElementById('modalSeverity').innerHTML = row.cells[4].innerHTML;
            document.getElementById('modalDetails').innerText = row.getAttribute("data-details");
            logModal.show();
        });

        // Double-click IP to copy
        const ipBadge = row.querySelector('.ip-badge');
        if (ipBadge) {
            ipBadge.addEventListener("dblclick", (e) => {
                const ipText = e.target.innerText;
                navigator.clipboard.writeText(ipText).then(() => {
                    showToast(`IP Address ${ipText} copied to clipboard!`, "bg-dark");
                });
            });
        }
    }

    // Attach to existing rows on load
    document.querySelectorAll("#securityTable tbody tr").forEach(attachRowListeners);

    // --- 7. LIVE SEARCH & FILTERS ---
    const searchInput = document.getElementById("globalSearch");
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            const searchTerm = this.value.toLowerCase();
            document.querySelectorAll("#securityTable tbody tr").forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? "" : "none";
            });
        });
    }

    const filterButtons = document.querySelectorAll("#severityFilters button");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach(b => {
                b.classList.remove("btn-dark", "active");
                b.classList.add("btn-outline-dark");
            });
            e.target.classList.remove("btn-outline-dark");
            e.target.classList.add("btn-dark", "active");

            const filterValue = e.target.getAttribute("data-filter");
            document.querySelectorAll("#securityTable tbody tr").forEach(row => {
                const rowSeverity = row.getAttribute("data-severity");
                if (filterValue === "all" || rowSeverity === filterValue) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    });

    // --- 8. BUTTON ACTIONS (CSV, Cache, Scan) ---
    // [Keeping the exact same logic from the previous iteration for these buttons]
    
    const exportAuditBtn = document.getElementById("exportAuditBtn");
    if (exportAuditBtn) {
        exportAuditBtn.addEventListener("click", () => {
            const originalText = exportAuditBtn.innerHTML;
            exportAuditBtn.innerHTML = `<i class="bi bi-hourglass-split spin me-2"></i>Generating CSV...`;
            setTimeout(() => {
                let csvContent = "Timestamp,Event Type,IP Address,User/Service,Severity,Forensic Details\n";
                document.querySelectorAll("#securityTable tbody tr").forEach(row => {
                    const timestamp = row.cells[0].innerText.replace(/,/g, ''); 
                    const eventType = row.cells[1].innerText;
                    const ipAddress = row.cells[2].innerText;
                    const user = row.cells[3].innerText;
                    const severity = row.cells[4].innerText;
                    const details = row.getAttribute("data-details").replace(/,/g, ';'); 
                    csvContent += `${timestamp},${eventType},${ipAddress},${user},${severity},${details}\n`;
                });

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `security_audit_log_${new Date().getTime()}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                exportAuditBtn.innerHTML = originalText;
                showToast("Audit log downloaded successfully.", "bg-primary");
            }, 1200);
        });
    }

    const clearCacheBtn = document.getElementById("clearCacheBtn");
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener("click", () => {
            clearCacheBtn.disabled = true;
            let progress = 0;
            const interval = setInterval(() => {
                progress += 20;
                clearCacheBtn.innerHTML = `<i class="bi bi-trash3-fill me-2"></i>Clearing... ${progress}%`;
                if (progress >= 100) {
                    clearInterval(interval);
                    clearCacheBtn.innerHTML = `<i class="bi bi-check-circle me-2"></i>Cleared`;
                    clearCacheBtn.classList.replace('btn-outline-danger', 'btn-success');
                    showToast("System cache and temp logs cleared.", "bg-success");
                    setTimeout(() => {
                        clearCacheBtn.disabled = false;
                        clearCacheBtn.classList.replace('btn-success', 'btn-outline-danger');
                        clearCacheBtn.innerHTML = `<i class="bi bi-trash3 me-2"></i>Clear Cache`;
                    }, 3000);
                }
            }, 300);
        });
    }

    const runScanBtn = document.getElementById("runScanBtn");
    const lastScanTime = document.getElementById("lastScanTime");
    if (runScanBtn) {
        runScanBtn.addEventListener("click", () => {
            const originalText = runScanBtn.innerHTML;
            runScanBtn.disabled = true;
            runScanBtn.innerHTML = `<i class="bi bi-radar spin me-2"></i>Scanning...`;
            setTimeout(() => {
                runScanBtn.disabled = false;
                runScanBtn.innerHTML = originalText;
                const now = new Date();
                lastScanTime.innerText = `Today, ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                showToast("Deep scan completed. No new vulnerabilities found.", "bg-success");
            }, 2500);
        });
    }
});