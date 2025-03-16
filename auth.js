// auth.js - Manejador de autenticación
// Este archivo maneja los eventos de login y registro
// Importar el objeto DB desde app.js
import { DB } from './app.js';

// Función para cambiar de vista
function showView(viewId) {
    // Ocultar todas las vistas
    document.querySelectorAll('.view-content').forEach(view => {
        view.classList.remove('active-view');
    });
    
    // Mostrar la vista solicitada
    const viewToShow = document.getElementById(viewId);
    if (viewToShow) {
        viewToShow.classList.add('active-view');
    }
}

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
            
            // Redirigir a la vista principal después de un breve retraso
            setTimeout(() => {
                // Activar el elemento de navegación de entrenamiento
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                document.querySelector('#nav-training .nav-link').classList.add('active');
                
                // Cambiar vista - asumiendo que hay una vista llamada 'training-view'
                // Si no existe, debes crear una vista en tu HTML con este ID
                // o cambiar esto al ID de la vista que deseas mostrar
                showView('training-view');
            }, 1000);
            
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

// También debemos agregar eventos para los elementos de navegación
document.addEventListener('DOMContentLoaded', function() {
    // Evento para cada elemento de navegación
    document.querySelectorAll('.navbar-nav .nav-item').forEach(navItem => {
        navItem.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Si no hay usuario logueado y no es la vista de inicio, redirigir al login
            if (!DB.users.currentUser && this.id !== 'nav-home') {
                showView('login-view');
                return;
            }
            
            // Cambiar la clase active
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.querySelector('.nav-link').classList.add('active');
            
            // Mostrar la vista correspondiente según el ID del elemento de navegación
            const viewId = this.id.replace('nav-', '') + '-view';
            showView(viewId);
        });
    });
});
