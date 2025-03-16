// Importación de dependencias
import Chart from 'chart.js';

// Base de datos simulada usando módulos ES6
const DB = {
    // Gestión de usuarios
    users: {
        currentUser: null,
        usersList: {}, // Añadir esta propiedad para almacenar la lista de usuarios
        
        // Inicializar desde localStorage o crear estructura inicial
        init() {
            const savedUsers = localStorage.getItem('gymtracker_users');
            this.usersList = savedUsers ? JSON.parse(savedUsers) : {};
            localStorage.setItem('gymtracker_users', JSON.stringify(this.usersList));
            
            const savedCurrentUser = localStorage.getItem('gymtracker_currentUser');
            if (savedCurrentUser) {
                this.currentUser = JSON.parse(savedCurrentUser);
            }
            
            return this;
        },
        
        // Registro de usuario
        register(email, password, userData = {}) {
            const users = JSON.parse(localStorage.getItem('gymtracker_users')) || {};
            
            if (users[email]) {
                return { success: false, message: 'Este correo ya está registrado' };
            }
            
            users[email] = {
                email,
                password, // En producción NUNCA almacenar contraseñas en texto plano
                profile: { 
                    ...userData,
                    createdAt: new Date().toISOString()
                },
                trainings: [],
                program: null
            };
            
            // Actualizar también nuestra copia local
            this.usersList = users;
            
            localStorage.setItem('gymtracker_users', JSON.stringify(users));
            return { success: true };
        },
        
        // Login de usuario
        login(email, password) {
            const users = JSON.parse(localStorage.getItem('gymtracker_users')) || {};
            
            if (!users[email] || users[email].password !== password) {
                return { success: false, message: 'Credenciales incorrectas' };
            }
            
            this.currentUser = users[email];
            localStorage.setItem('gymtracker_currentUser', JSON.stringify(this.currentUser));
            return { success: true };
        },
        
        // Actualización del perfil
        updateProfile(profileData) {
            if (!this.currentUser) {
                return { success: false, message: 'No hay sesión activa' };
            }
            
            const users = JSON.parse(localStorage.getItem('gymtracker_users')) || {};
            users[this.currentUser.email].profile = {
                ...users[this.currentUser.email].profile,
                ...profileData
            };
            
            // Actualizar también nuestra copia local
            this.usersList = users;
            this.currentUser = users[this.currentUser.email];
            
            localStorage.setItem('gymtracker_users', JSON.stringify(users));
            localStorage.setItem('gymtracker_currentUser', JSON.stringify(users[this.currentUser.email]));
            
            return { success: true };
        },
        
        // Cerrar sesión
        logout() {
            this.currentUser = null;
            localStorage.removeItem('gymtracker_currentUser');
        }
    }
    
    // El resto del código de app.js sigue igual...
    // ...
};

// Inicializar la base de datos simulada
DB.users.init();

// Exportar el objeto DB
export { DB };
