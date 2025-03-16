// auth.js - Manejador de autenticación
// Este archivo maneja los eventos de login y registro
// Importar el objeto DB desde app.js
import { DB } from './app.js';

// Cambio entre formularios de login/registro
document.querySelectorAll('input[name="loginOption"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'login') {
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('register-form').style.display = 'none';
        } else {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('register-form').style.display = 'block';
        }
        
        // Ocultar cualquier mensaje previo
        document.getElementById('auth-message').style.display = 'none';
    });
});

// Manejar el envío del formulario de registro
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerPasswordConfirm').value;
    const messageElement = document.getElementById('auth-message');
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        messageElement.className = 'alert alert-danger mt-3';
        messageElement.textContent = 'Las contraseñas no coinciden';
        messageElement.style.display = 'block';
        return;
    }
    
    // Acceder a la base de datos y registrar al usuario
    // Usamos el objeto DB directamente ya que está definido en app.js
    // que se carga globalmente
    try {
        // Intentar registrar al usuario
        const result = DB.users.register(email, password);
        
        // Mostrar resultado
        if (result.success) {
            messageElement.className = 'alert alert-success mt-3';
            messageElement.textContent = '¡Cuenta creada con éxito! Ya puedes iniciar sesión.';
            
            // Limpiar formulario
            this.reset();
            
            // Volver al formulario de login
            document.getElementById('loginRadio').checked = true;
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('register-form').style.display = 'none';
        } else {
            messageElement.className = 'alert alert-danger mt-3';
            messageElement.textContent = result.message || 'Error al crear la cuenta';
        }
        
        messageElement.style.display = 'block';
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        messageElement.className = 'alert alert-danger mt-3';
        messageElement.textContent = 'Error al crear la cuenta: ' + error.message;
        messageElement.style.display = 'block';
    }
});

// Manejar el envío del formulario de login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageElement = document.getElementById('auth-message');
    
    try {
        // Intentar iniciar sesión
        const result = DB.users.login(email, password);
        
        // Mostrar resultado
        if (result.success) {
            messageElement.className = 'alert alert-success mt-3';
            messageElement.textContent = '¡Sesión iniciada correctamente!';
            messageElement.style.display = 'block';
            
            // Aquí puedes redirigir a la vista principal
            // Por ejemplo: window.location.href = 'dashboard.html';
            // O cambiar la vista activa en la SPA
            
            // Limpiar formulario
            this.reset();
        } else {
            messageElement.className = 'alert alert-danger mt-3';
            messageElement.textContent = result.message || 'Error al iniciar sesión';
            messageElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        messageElement.className = 'alert alert-danger mt-3';
        messageElement.textContent = 'Error al iniciar sesión: ' + error.message;
        messageElement.style.display = 'block';
    }
});
