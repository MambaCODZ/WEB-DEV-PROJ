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