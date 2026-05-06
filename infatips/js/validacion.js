// Validación avanzada del formulario de registro con UX mejorada

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('registro-form');
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    const birthDateInput = document.querySelector('input[type="date"]');
    const ageInput = document.querySelector('input[type="number"]');
    const passwordInput = document.querySelector('.password-input');
    const passwordConfirmInput = document.querySelector('.password-confirm');
    const fileInput = document.querySelector('input[type="file"]');
    const submitBtn = document.getElementById('submit-btn');
    
    // ===== ESTABLECER MAX DE FECHA A HOY =====
    if (birthDateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const maxDate = `${year}-${month}-${day}`;
        birthDateInput.setAttribute('max', maxDate);
    }
    
    // ===== CALCULADORA DE EDAD =====
    if (birthDateInput) {
        birthDateInput.addEventListener('change', function() {
            const birthDate = new Date(this.value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            if (ageInput) {
                ageInput.value = age;
                validateField(birthDateInput);
            }
            updateProgress();
        });
    }

    // ===== TOGGLE DE CONTRASEÑA =====
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // ===== INDICADOR DE FORTALEZA DE CONTRASEÑA =====
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthBar = document.querySelector('.strength-bar');
            const strengthText = document.querySelector('.strength-text');
            
            // Calcular fortaleza
            let strength = 0;
            if (password.length >= 8) strength++;
            if (/[a-z]/.test(password)) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/\d/.test(password)) strength++;
            if (/[@$!%*?&]/.test(password)) strength++;
            
            // Actualizar indicador
            strengthBar.classList.remove('weak', 'medium', 'strong');
            strengthText.classList.remove('weak', 'medium', 'strong');
            
            if (strength < 3) {
                strengthBar.classList.add('weak');
                strengthText.classList.add('weak');
                strengthText.textContent = 'Débil';
            } else if (strength < 4) {
                strengthBar.classList.add('medium');
                strengthText.classList.add('medium');
                strengthText.textContent = 'Media';
            } else {
                strengthBar.classList.add('strong');
                strengthText.classList.add('strong');
                strengthText.textContent = 'Fuerte';
            }
            
            validateField(this);
            updateProgress();
        });
    }

    // ===== VALIDACIÓN EN TIEMPO REAL PARA TODOS LOS CAMPOS =====
    document.querySelectorAll('.form-input').forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            validateField(this);
            updateProgress();
        });
        
        field.addEventListener('change', function() {
            validateField(this);
            updateProgress();
        });
    });

    // ===== VALIDACIÓN DE COINCIDENCIA DE CONTRASEÑAS =====
    if (passwordConfirmInput) {
        passwordConfirmInput.addEventListener('input', function() {
            if (this.value && this.value !== passwordInput.value) {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
                const errorMsg = this.closest('[class*="col"]').querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.textContent = 'Las contraseñas no coinciden';
                    errorMsg.classList.remove('d-none');
                }
            } else if (this.value === passwordInput.value && this.value.length > 0) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                const errorMsg = this.closest('[class*="col"]').querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.textContent = '';
                    errorMsg.classList.add('d-none');
                }
            } else {
                this.classList.remove('is-valid', 'is-invalid');
                const errorMsg = this.closest('[class*="col"]').querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.textContent = '';
                    errorMsg.classList.add('d-none');
                }
            }
            updateProgress();
        });
    }

    // ===== VALIDACIÓN DE ARCHIVO =====
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = this.files[0];
            const errorMsg = this.closest('.col-12').querySelector('.error-message');
            
            if (file) {
                // Validar tamaño
                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                    errorMsg.textContent = 'El archivo no debe exceder 5MB';
                    errorMsg.classList.remove('d-none');
                    this.classList.add('is-invalid');
                    this.value = '';
                    return;
                }
                
                // Validar tipo
                const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    errorMsg.textContent = 'Solo se aceptan imágenes (PNG, JPEG, WEBP)';
                    errorMsg.classList.remove('d-none');
                    this.classList.add('is-invalid');
                    this.value = '';
                    return;
                }
                
                // Si es válido
                errorMsg.textContent = '';
                errorMsg.classList.add('d-none');
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
            updateProgress();
        });
    }

    // ===== FUNCIÓN DE VALIDACIÓN DE CAMPO =====
    function validateField(field) {
        if (!field) return;
        
        const errorMsg = field.closest('[class*="col"]')?.querySelector('.error-message');
        
        field.classList.remove('is-valid', 'is-invalid');
        
        if (errorMsg) {
            errorMsg.classList.add('d-none');
        }
        
        // Si está vacío y no es readonly, no hacer nada
        if (!field.value && field.getAttribute('readonly') === null) {
            return;
        }
        
        // Email
        if (field.type === 'email') {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (field.value.length > 0 && !regexEmail.test(field.value)) {
                field.classList.add('is-invalid');
                if (errorMsg) {
                    errorMsg.textContent = 'Correo electrónico inválido';
                    errorMsg.classList.remove('d-none');
                }
            } else if (field.value.length > 0) {
                field.classList.add('is-valid');
            }
            return;
        }
        
        // Teléfono
        if (field.type === 'tel') {
            const regexTel = /^[0-9]{10}$/;
            if (field.value.length > 0 && !regexTel.test(field.value)) {
                field.classList.add('is-invalid');
                if (errorMsg) {
                    errorMsg.textContent = 'Teléfono debe tener 10 dígitos';
                    errorMsg.classList.remove('d-none');
                }
            } else if (field.value.length > 0) {
                field.classList.add('is-valid');
            }
            return;
        }
        
        // Texto (nombres)
        if (field.type === 'text') {
            const regexText = /^[A-Za-záéíóúñ\s]{3,}$/;
            if (field.value.length > 0 && !regexText.test(field.value)) {
                field.classList.add('is-invalid');
                if (errorMsg) {
                    errorMsg.textContent = 'Mínimo 3 caracteres, solo letras y espacios';
                    errorMsg.classList.remove('d-none');
                }
            } else if (field.value.length > 0) {
                field.classList.add('is-valid');
            }
            return;
        }
        
        // Contraseña
        if (field.classList.contains('password-input')) {
            const regexPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;
            if (field.value.length > 0 && !regexPassword.test(field.value)) {
                field.classList.add('is-invalid');
                if (errorMsg) {
                    errorMsg.textContent = 'Debe contener mayúscula, minúscula, número y carácter especial';
                    errorMsg.classList.remove('d-none');
                }
            } else if (field.value.length > 0) {
                field.classList.add('is-valid');
            }
            return;
        }
        
        // Fecha
        if (field.type === 'date') {
            const birthDate = new Date(field.value);
            const today = new Date();
            if (field.value && birthDate > today) {
                field.classList.add('is-invalid');
                if (errorMsg) {
                    errorMsg.textContent = 'La fecha no puede ser futura';
                    errorMsg.classList.remove('d-none');
                }
            } else if (field.value) {
                field.classList.add('is-valid');
            }
            return;
        }
        
        // Select (Sexo, Parentesco)
        if (field.tagName === 'SELECT') {
            if (field.value === '') {
                // No validar como error si está vacío, solo si fue tocado
                field.classList.remove('is-valid');
            } else {
                field.classList.add('is-valid');
            }
            return;
        }
    }

    // ===== ACTUALIZAR BARRA DE PROGRESO =====
    function updateProgress() {
        if (!form) return;
        
        const fields = form.querySelectorAll('.form-input');
        let filledFields = 0;
        
        fields.forEach(field => {
            if (field.type === 'file') {
                // El archivo es opcional
                if (field.files && field.files.length > 0) {
                    filledFields++;
                }
            } else if (field.getAttribute('readonly')) {
                // Edad se calcula automáticamente
                if (field.value) filledFields++;
            } else if (field.value) {
                filledFields++;
            }
        });
        
        // Checkbox de términos
        const checkbox = document.getElementById('terminos');
        if (checkbox && checkbox.checked) {
            filledFields++;
        }
        
        const totalFields = fields.length + 1; // +1 para checkbox
        const progress = Math.round((filledFields / totalFields) * 100);
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (progressPercent) {
            progressPercent.textContent = progress;
        }
    }

    // ===== ENVÍO DEL FORMULARIO =====
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar todos los campos
            let isValid = true;
            const fields = form.querySelectorAll('.form-input');
            
            fields.forEach(field => {
                validateField(field);
                if (field.type !== 'file' && field.classList.contains('is-invalid')) {
                    isValid = false;
                }
                if (field.hasAttribute('required') && !field.value && field.type !== 'file') {
                    field.classList.add('is-invalid');
                    isValid = false;
                }
            });
            
            // Validar checkbox
            const checkbox = document.getElementById('terminos');
            if (!checkbox.checked) {
                isValid = false;
                checkbox.classList.add('is-invalid');
            }
            
            // Validar coincidencia de contraseñas
            if (passwordInput && passwordConfirmInput && passwordInput.value !== passwordConfirmInput.value) {
                passwordConfirmInput.classList.add('is-invalid');
                isValid = false;
            }
            
            if (!isValid) {
                alert('Por favor completa todos los campos correctamente');
                return;
            }
            
            // Mostrar loading
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
            
            // Simular envío (en 2 segundos)
            setTimeout(() => {
                console.log('Formulario enviado correctamente');
                alert('¡Registro completado correctamente!');
                // window.location.href = 'main.html';
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }
            }, 2000);
        });
    }
    
    // Inicializar progreso
    updateProgress();
});
