document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. DYNAMIC CSS & MODAL INJECTION ---
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; display: inline-block; }
        
        @keyframes fadeOutRow { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0.95); } }
        .row-deleting { animation: fadeOutRow 0.4s ease forwards; pointer-events: none; }
        
        @keyframes slideInDown { 0% { opacity: 0; transform: translateY(-15px); } 100% { opacity: 1; transform: translateY(0); } }
        .row-adding { animation: slideInDown 0.5s ease forwards; }
        
        .status-toggle { cursor: pointer; transition: transform 0.2s; }
        .status-toggle:hover { transform: scale(1.05); }
    `;
    document.head.appendChild(style);

    // Inject the Add/Edit User Modal dynamically so you don't have to edit the HTML file
    const modalHTML = `
    <div class="modal fade" id="userFormModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header border-bottom-0 pb-0">
                    <h5 class="modal-title fw-bold" id="userModalTitle">Add New User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body pt-3">
                    <form id="userForm">
                        <div class="mb-3">
                            <label class="form-label text-muted small fw-bold mb-1">Full Name</label>
                            <input type="text" class="form-control" id="inputName" placeholder="e.g. Jane Doe" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted small fw-bold mb-1">Email Address</label>
                            <input type="email" class="form-control" id="inputEmail" placeholder="jane@entreprise.com" required>
                        </div>
                        <div class="row">
                            <div class="col-6 mb-3">
                                <label class="form-label text-muted small fw-bold mb-1">Role</label>
                                <select class="form-select" id="inputRole">
                                    <option value="Staff">Staff</option>
                                    <option value="Analyst">Analyst</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div class="col-6 mb-3">
                                <label class="form-label text-muted small fw-bold mb-1">Department</label>
                                <select class="form-select" id="inputDept">
                                    <option value="Operations">Operations</option>
                                    <option value="Financials">Financials</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="IT Security">IT Security</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-top-0 pt-0">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveUserBtn">Save User</button>
                </div>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const userModal = new bootstrap.Modal(document.getElementById('userFormModal'));
    let editMode = false;
    let currentRowToEdit = null;

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

    // --- 3. ATTACH EVENTS TO TABLE ROWS (Edit, Delete, Toggle Status) ---
    const attachRowEvents = (row) => {
        // Delete Action
        const deleteBtn = row.querySelector('.text-danger');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                row.classList.add('row-deleting');
                setTimeout(() => {
                    row.remove();
                    // Update Total Counter
                    const totalUsersEl = document.querySelector('.stat-value');
                    if(totalUsersEl) {
                        let currentCount = parseInt(totalUsersEl.innerText.replace(/,/g, ''));
                        totalUsersEl.innerText = (currentCount - 1).toLocaleString();
                    }
                    showToast("User successfully removed from directory.", "bg-dark");
                }, 400); 
            });
        }

        // Edit Action
        const editBtn = row.querySelector('.bi-pencil').parentElement;
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                editMode = true;
                currentRowToEdit = row;
                
                // Extract data from row to populate modal
                const name = row.querySelector('.fw-bold.text-dark').innerText;
                const email = row.querySelector('.small.text-muted').innerText;
                const role = row.cells[1].innerText;
                const dept = row.cells[2].innerText;

                document.getElementById('userModalTitle').innerText = "Edit User";
                document.getElementById('inputName').value = name;
                document.getElementById('inputEmail').value = email;
                document.getElementById('inputRole').value = role;
                document.getElementById('inputDept').value = dept;

                userModal.show();
            });
        }

        // Status Toggle Action
        const statusBadge = row.querySelector('.custom-badge');
        if(statusBadge) {
            statusBadge.classList.add('status-toggle');
            statusBadge.setAttribute('title', 'Click to toggle status');
            statusBadge.addEventListener('click', (e) => {
                const el = e.target;
                if(el.innerText === 'Active' || el.innerText === 'Pending') {
                    el.className = 'custom-badge badge-danger status-toggle';
                    el.innerText = 'Suspended';
                    showToast("User account has been suspended.", "bg-warning text-dark");
                } else {
                    el.className = 'custom-badge badge-success status-toggle';
                    el.innerText = 'Active';
                    showToast("User account is now active.", "bg-success");
                }
            });
        }
    };

    // Initialize existing rows
    document.querySelectorAll("#usersTable tbody tr").forEach(attachRowEvents);

    // --- 4. ADD / EDIT USER FORM LOGIC ---
    const addUserBtn = document.getElementById("addUserBtn");
    if (addUserBtn) {
        addUserBtn.addEventListener("click", () => {
            editMode = false;
            currentRowToEdit = null;
            document.getElementById('userForm').reset();
            document.getElementById('userModalTitle').innerText = "Add New User";
            userModal.show();
        });
    }

    document.getElementById("saveUserBtn").addEventListener("click", () => {
        const name = document.getElementById('inputName').value.trim();
        const email = document.getElementById('inputEmail').value.trim();
        const role = document.getElementById('inputRole').value;
        const dept = document.getElementById('inputDept').value;

        if(!name || !email) {
            alert("Please fill in both Name and Email.");
            return;
        }

        // Generate Avatar URL
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e2e8f0&color=1e293b`;

        if (editMode && currentRowToEdit) {
            // Update Existing Row
            currentRowToEdit.querySelector('.fw-bold.text-dark').innerText = name;
            currentRowToEdit.querySelector('.small.text-muted').innerText = email;
            currentRowToEdit.querySelector('img').src = avatarUrl;
            currentRowToEdit.cells[1].innerText = role;
            currentRowToEdit.cells[2].innerText = dept;
            
            showToast("User details updated successfully.", "bg-primary");
        } else {
            // Create New Row
            const tableBody = document.querySelector("#usersTable tbody");
            const newRow = document.createElement('tr');
            newRow.className = 'row-adding';
            newRow.innerHTML = `
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${avatarUrl}" class="rounded-circle" width="40" height="40">
                        <div>
                            <div class="fw-bold text-dark">${name}</div>
                            <div class="small text-muted">${email}</div>
                        </div>
                    </div>
                </td>
                <td class="fw-bold">${role}</td>
                <td>${dept}</td>
                <td><span class="custom-badge badge-success">Active</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light me-1"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-light text-danger"><i class="bi bi-trash"></i></button>
                </td>
            `;
            
            tableBody.insertBefore(newRow, tableBody.firstChild);
            attachRowEvents(newRow); // Attach listeners to the new buttons

            // Update Total Users Counter
            const totalUsersEl = document.querySelector('.stat-value');
            if(totalUsersEl) {
                let currentCount = parseInt(totalUsersEl.innerText.replace(/,/g, ''));
                totalUsersEl.innerText = (currentCount + 1).toLocaleString();
            }
            showToast("New user successfully added to directory.", "bg-success");
        }

        userModal.hide();
    });

    // --- 5. REAL CSV EXPORT ---
    const exportUsersBtn = document.getElementById("exportUsersBtn");
    if (exportUsersBtn) {
        exportUsersBtn.addEventListener("click", () => {
            const originalText = exportUsersBtn.innerHTML;
            exportUsersBtn.innerHTML = `<i class="bi bi-hourglass-split spin me-2"></i>Exporting...`;
            
            setTimeout(() => {
                let csvContent = "Name,Email,Role,Department,Status\n";
                
                document.querySelectorAll("#usersTable tbody tr").forEach(row => {
                    const name = row.querySelector('.fw-bold.text-dark').innerText;
                    const email = row.querySelector('.small.text-muted').innerText;
                    const role = row.cells[1].innerText;
                    const dept = row.cells[2].innerText;
                    const status = row.querySelector('.custom-badge').innerText;
                    
                    csvContent += `"${name}","${email}","${role}","${dept}","${status}"\n`;
                });

                // Trigger Download
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `user_directory_${new Date().getTime()}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                exportUsersBtn.innerHTML = originalText;
                showToast("Directory exported to CSV successfully.", "bg-primary");
            }, 1000);
        });
    }

    // --- 6. LIVE SEARCH ---
    const searchInput = document.getElementById("globalSearch");
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            const searchTerm = this.value.toLowerCase();
            document.querySelectorAll("#usersTable tbody tr").forEach(row => {
                const rowText = row.textContent.toLowerCase();
                row.style.display = rowText.includes(searchTerm) ? "" : "none";
            });
        });
    }
});