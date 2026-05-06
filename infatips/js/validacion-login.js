// Validación del formulario de login

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.querySelector('form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    // Validación en tiempo real del email
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value.length > 0 && !regexEmail.test(this.value)) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });

        emailInput.addEventListener('focus', function() {
            this.classList.remove('is-invalid');
        });
    }

    // Validación en tiempo real de la contraseña
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            if (this.value.length < 8 && this.value.length > 0) {
                this.classList.add('is-invalid');
            } else if (this.value.length >= 8) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-invalid', 'is-valid');
            }
        });

        passwordInput.addEventListener('focus', function() {
            this.classList.remove('is-invalid');
        });
    }

    // Validación al enviar el formulario
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar que el formulario tenga los campos requeridos
            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                alert('Por favor completa todos los campos requeridos');
                return;
            }

            // Validar email
            const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regexEmail.test(emailInput.value)) {
                emailInput.classList.add('is-invalid');
                alert('Por favor ingresa un correo válido');
                return;
            }

            // Validar contraseña
            if (passwordInput.value.length < 8) {
                passwordInput.classList.add('is-invalid');
                alert('La contraseña debe tener al menos 8 caracteres');
                return;
            }

            // Si todo es válido
            console.log('Formulario de login válido');
            console.log('Email:', emailInput.value);
            
            // Guardar en localStorage si está marcado "Recordar"
            const rememberCheckbox = document.querySelector('#remember');
            if (rememberCheckbox && rememberCheckbox.checked) {
                localStorage.setItem('recordarEmail', emailInput.value);
                console.log('Email guardado para próximo inicio');
            }

            alert('¡Iniciando sesión!');
            // Descomentar para enviar de verdad:
            // form.submit();
            window.location.href = 'main.html';
        });
    }

    // Cargar email guardado si existe
    const rememberCheckbox = document.querySelector('#remember');
    const savedEmail = localStorage.getItem('recordarEmail');
    
    if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
    }

    // Limpiar email guardado si se desmarca
    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('change', function() {
            if (!this.checked) {
                localStorage.removeItem('recordarEmail');
            }
        });
    }
});
