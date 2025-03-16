// Importación de dependencias
import Chart from 'chart.js';

// Base de datos simulada (LocalStorage)
const DB = {
    // Gestión de usuarios
    users: {
        currentUser: null,
        
        // Inicializar desde localStorage o crear estructura inicial
        init() {
            const savedUsers = localStorage.getItem('gymtracker_users');
            this.users = savedUsers ? JSON.parse(savedUsers) : {};
            localStorage.setItem('gymtracker_users', JSON.stringify(this.users));
            
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
            
            localStorage.setItem('gymtracker_users', JSON.stringify(users));
            localStorage.setItem('gymtracker_currentUser', JSON.stringify(users[this.currentUser.email]));
            
            return { success: true };
        },
        
        // Cerrar sesión
        logout() {
            this.currentUser = null;
            localStorage.removeItem('gymtracker_currentUser');
        }
    },
    
    // Gestión de entrenamientos
    trainings: {
        // Guardar entrenamiento
        save(trainingData) {
            const users = JSON.parse(localStorage.getItem('gymtracker_users')) || {};
            const currentUser = JSON.parse(localStorage.getItem('gymtracker_currentUser'));
            
            if (!currentUser) {
                return { success: false, message: 'No hay sesión activa' };
            }
            
            const training = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                ...trainingData
            };
            
            users[currentUser.email].trainings.push(training);
            currentUser.trainings.push(training);
            
            localStorage.setItem('gymtracker_users', JSON.stringify(users));
            localStorage.setItem('gymtracker_currentUser', JSON.stringify(currentUser));
            
            return { success: true, training };
        },
        
        // Obtener entrenamientos del usuario actual
        getAll() {
            const currentUser = JSON.parse(localStorage.getItem('gymtracker_currentUser'));
            
            if (!currentUser) {
                return [];
            }
            
            return currentUser.trainings || [];
        },
        
        // Obtener un entrenamiento específico
        getById(id) {
            const currentUser = JSON.parse(localStorage.getItem('gymtracker_currentUser'));
            
            if (!currentUser) {
                return null;
            }
            
            return currentUser.trainings.find(t => t.id === id) || null;
        },
        
        // Eliminar un entrenamiento
        delete(id) {
            const users = JSON.parse(localStorage.getItem('gymtracker_users')) || {};
            const currentUser = JSON.parse(localStorage.getItem('gymtracker_currentUser'));
            
            if (!currentUser) {
                return { success: false, message: 'No hay sesión activa' };
            }
            
            users[currentUser.email].trainings = users[currentUser.email].trainings.filter(t => t.id !== id);
            currentUser.trainings = currentUser.trainings.filter(t => t.id !== id);
            
            localStorage.setItem('gymtracker_users', JSON.stringify(users));
            localStorage.setItem('gymtracker_currentUser', JSON.stringify(currentUser));
            
            return { success: true };
        }
    },
    
    // Gestión de programas de entrenamiento
    programs: {
        // Generar programa basado en el cuestionario
        generate(questionnaireData) {
            const users = JSON.parse(localStorage.getItem('gymtracker_users')) || {};
            const currentUser = JSON.parse(localStorage.getItem('gymtracker_currentUser'));
            
            if (!currentUser) {
                return { success: false, message: 'No hay sesión activa' };
            }
            
            // Aquí se generaría el programa real, por ahora es una simulación
            const program = {
                type: questionnaireData.trainingType,
                daysPerWeek: parseInt(questionnaireData.trainingDays),
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000).toISOString(), // 12 semanas
                currentWeek: 1,
                totalWeeks: 12,
                schedule: generateProgramSchedule(questionnaireData)
            };
            
            users[currentUser.email].program = program;
            currentUser.program = program;
            
            localStorage.setItem('gymtracker_users', JSON.stringify(users));
            localStorage.setItem('gymtracker_currentUser', JSON.stringify(currentUser));
            
            return { success: true, program };
        },
        
        // Obtener el programa actual
        getCurrent() {
            const currentUser = JSON.parse(localStorage.getItem('gymtracker_currentUser'));
            
            if (!currentUser) {
                return null;
            }
            
            return currentUser.program;
        },
        
        // Avanzar a la siguiente semana
        advanceWeek() {
            const users = JSON.parse(localStorage.getItem('gymtracker_users')) || {};
            const currentUser = JSON.parse(localStorage.getItem('gymtracker_currentUser'));
            
            if (!currentUser || !currentUser.program) {
                return { success: false, message: 'No hay programa activo' };
            }
            
            if (currentUser.program.currentWeek < currentUser.program.totalWeeks) {
                currentUser.program.currentWeek++;
                users[currentUser.email].program = currentUser.program;
                
                localStorage.setItem('gymtracker_users', JSON.stringify(users));
                localStorage.setItem('gymtracker_currentUser', JSON.stringify(currentUser));
                
                return { success: true };
            } else {
                return { success: false, message: 'Ya estás en la última semana' };
            }
        }
    }
};

// Datos de ejercicios
const EXERCISES = [
    {
        id: 'back-squat',
        name: 'Back Squat',
        categories: ['PW', 'WL', 'MC', 'HT'],
        fatigue: 'high',
        muscles: ['quadriceps', 'glutes', 'lower_back']
    },
    {
        id: 'bench-press',
        name: 'Bench Press',
        categories: ['PW', 'MC', 'HT'],
        fatigue: 'medium',
        muscles: ['chest', 'triceps', 'shoulders']
    },
    {
        id: 'deadlift',
        name: 'Deadlift',
        categories: ['PW', 'MC', 'HT'],
        fatigue: 'high',
        muscles: ['hamstrings', 'glutes', 'lower_back', 'traps']
    },
    {
        id: 'overhead-press',
        name: 'Overhead Press',
        categories: ['PW', 'MC', 'HT'],
        fatigue: 'medium',
        muscles: ['shoulders', 'triceps', 'upper_back']
    },
    {
        id: 'pull-up',
        name: 'Pull-up',
        categories: ['MC', 'CT', 'FT'],
        fatigue: 'medium',
        muscles: ['lats', 'biceps', 'forearms']
    },
    {
        id: 'barbell-row',
        name: 'Barbell Row',
        categories: ['PW', 'MC', 'HT'],
        fatigue: 'medium',
        muscles: ['lats', 'rhomboids', 'biceps', 'forearms']
    },
    {
        id: 'leg-press',
        name: 'Leg Press',
        categories: ['MC', 'HT'],
        fatigue: 'medium',
        muscles: ['quadriceps', 'glutes', 'hamstrings']
    },
    {
        id: 'dumbbell-shoulder-press',
        name: 'Dumbbell Shoulder Press',
        categories: ['MC', 'HT', 'FT'],
        fatigue: 'medium',
        muscles: ['shoulders', 'triceps']
    },
    {
        id: 'dumbbell-bench-press',
        name: 'Dumbbell Bench Press',
        categories: ['MC', 'HT', 'FT'],
        fatigue: 'medium',
        muscles: ['chest', 'triceps', 'shoulders']
    },
    {
        id: 'romanian-deadlift',
        name: 'Romanian Deadlift',
        categories: ['PW', 'MC', 'HT', 'RS'],
        fatigue: 'medium',
        muscles: ['hamstrings', 'glutes', 'lower_back']
    },
    {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        categories: ['MC', 'HT', 'FT'],
        fatigue: 'low',
        muscles: ['lats', 'biceps', 'forearms']
    },
    {
        id: 'bulgarian-split-squat',
        name: 'Bulgarian Split Squat',
        categories: ['MC', 'HT', 'FT', 'RS'],
        fatigue: 'medium',
        muscles: ['quadriceps', 'glutes', 'hamstrings']
    },
    {
        id: 'clean',
        name: 'Clean',
        categories: ['WL', 'CT', 'HT'],
        fatigue: 'high',
        muscles: ['quadriceps', 'glutes', 'traps', 'shoulders']
    },
    {
        id: 'snatch',
        name: 'Snatch',
        categories: ['WL', 'CT', 'HT'],
        fatigue: 'high',
        muscles: ['quadriceps', 'glutes', 'shoulders', 'traps']
    },
    {
        id: 'jerk',
        name: 'Jerk',
        categories: ['WL', 'CT', 'HT'],
        fatigue: 'medium',
        muscles: ['quadriceps', 'shoulders', 'triceps']
    },
    {
        id: 'push-press',
        name: 'Push Press',
        categories: ['WL', 'CT', 'HT', 'FT'],
        fatigue: 'medium',
        muscles: ['shoulders', 'triceps', 'quadriceps']
    },
    {
        id: 'kettlebell-swing',
        name: 'Kettlebell Swing',
        categories: ['CT', 'FT', 'HT', 'RS'],
        fatigue: 'medium',
        muscles: ['glutes', 'hamstrings', 'lower_back']
    },
    {
        id: 'front-squat',
        name: 'Front Squat',
        categories: ['WL', 'CT', 'HT', 'PW'],
        fatigue: 'high',
        muscles: ['quadriceps', 'glutes', 'upper_back']
    },
    {
        id: 'box-jump',
        name: 'Box Jump',
        categories: ['CT', 'FT', 'RS'],
        fatigue: 'medium',
        muscles: ['
