document.addEventListener("DOMContentLoaded", () => {
    // Live Search
    const searchInput = document.getElementById("globalSearch");
    const tableRows = document.querySelectorAll("#usersTable tbody tr");

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

    // Export Users
    const exportUsersBtn = document.getElementById("exportUsersBtn");
    if (exportUsersBtn) {
        exportUsersBtn.addEventListener("click", () => {
            const originalText = exportUsersBtn.innerHTML;
            exportUsersBtn.innerHTML = `<i class="bi bi-arrow-repeat spin me-2" style="animation: spin 1s linear infinite;"></i>Exporting...`;
            setTimeout(() => {
                exportUsersBtn.innerHTML = originalText;
                showToast("User directory exported to CSV.", "bg-info");
            }, 1200);
        });
    }

    // Add User Mock Click
    const addUserBtn = document.getElementById("addUserBtn");
    if (addUserBtn) {
        addUserBtn.addEventListener("click", () => {
             showToast("Opening Add User portal...", "bg-primary");
        });
    }
    
    // Keyframes
    const style = document.createElement('style');
    style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
});