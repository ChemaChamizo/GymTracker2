import bcrypt from 'bcryptjs';
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
        
        register(email, password, userData = {}) {
            const users = JSON.parse(localStorage.getItem('gymtracker_users')) || {};
            
            if (users[email]) {
                return { success: false, message: 'Este correo ya está registrado' };
            }
            
            // Cifrar la contraseña antes de guardarla
            const hashedPassword = bcrypt.hashSync(password, 10);
        
            users[email] = {
                email,
                password: hashedPassword, // Ahora la contraseña está cifrada 🔒
                profile: { 
                    ...userData,
                    createdAt: new Date().toISOString()
                },
                trainings: [],
                program: null
            };
            
            this.usersList = users;
            localStorage.setItem('gymtracker_users', JSON.stringify(users));
            return { success: true };
        }
        
        
        login(email, password) {
            const users = JSON.parse(localStorage.getItem('gymtracker_users')) || {};
            
            if (!users[email]) {
                return { success: false, message: 'Usuario no encontrado' };
            }
        
            // Comparar la contraseña ingresada con la cifrada
            const isPasswordCorrect = bcrypt.compareSync(password, users[email].password);
        
            if (!isPasswordCorrect) {
                return { success: false, message: 'Contraseña incorrecta' };
            }
        
            this.currentUser = users[email];
            localStorage.setItem('gymtracker_currentUser', JSON.stringify(this.currentUser));
            return { success: true };
        }
        
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
