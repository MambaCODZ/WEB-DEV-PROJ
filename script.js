
const cursorDot = document.createElement('div');
cursorDot.classList.add('cursor-dot');
document.body.appendChild(cursorDot);
const cardContainer = document.getElementById('cardContainer');

cardContainer.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '0'; 
});

cardContainer.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '1'; 
});


window.addEventListener('mousemove', function(e) {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
});

const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('passwordInput');
const toggleIcon = document.getElementById('toggleIcon');

togglePasswordBtn.addEventListener('click', function () {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.replace('bi-eye-slash', 'bi-eye');
    }
});
const strengthBar = document.getElementById('strengthBar');

passwordInput.addEventListener('input', function() {
    const val = passwordInput.value;
    let strength = 0;

    if (val.length > 0) strength += 25; 
    if (val.length >= 6) strength += 25; 
    if (val.match(/[A-Z]/)) strength += 25; 
    if (val.match(/[0-9]/)) strength += 25; 

    strengthBar.style.width = strength + '%';
    strengthBar.className = 'progress-bar transition-all';
    
    if (strength <= 25) {
        strengthBar.classList.add('bg-danger');
    } else if (strength <= 50) {
        strengthBar.classList.add('bg-warning');
    } else if (strength <= 75) {
        strengthBar.classList.add('bg-info');
    } else {
        strengthBar.classList.add('bg-success');
    }
});

//Verification Des Cordonnées Insérées Par L'utilisateur
const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const btnText = document.getElementById('btnText');
const btnSpinner = document.getElementById('btnSpinner');
const loginContainer = document.getElementById('loginContainer');
const passwordError = document.getElementById('passwordError');

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    
    cardContainer.classList.remove('shake-error');
    passwordError.classList.add('d-none');

    const isPasswordValid = passwordInput.value.length >= 6;
    
    if (!loginForm.checkValidity() || !isPasswordValid) {
        loginForm.classList.add('was-validated');
        
        if (!isPasswordValid && passwordInput.value.length > 0) {
            passwordError.classList.remove('d-none');
        }

        void cardContainer.offsetWidth; 
        cardContainer.classList.add('shake-error');
        
    }  else {
        loginForm.classList.remove('was-validated');
        
        // Disable button and show loading spinner
        loginBtn.disabled = true;
        btnText.innerText = 'Connecting... ';
        btnSpinner.classList.remove('d-none');

        //premier redirection   
        setTimeout(function() {
            loginContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-shield-check" style="font-size: 5rem; color: #0f172a;"></i>
                    <h3 class="mt-4 fw-bold formal-header">Access Granted</h3>
                    <p class="fw-medium fs-5" style="color: #334155;">Redirecting to your feed...</p>
                </div>
            `;
            //deuxieme redirection a la page principale du site
            setTimeout(function() {
            
                window.location.href = "main.html"; 
            }, 1500);

        }, 2000);
    }
});