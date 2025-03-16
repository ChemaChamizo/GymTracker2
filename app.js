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

// Inicializar la base de datos simulada
DB.users.init();

// Función para generar estructura del programa de entrenamiento
function generateProgramSchedule(questionnaireData) {
    // Esta función sería mucho más compleja y personalizada en una implementación real
    // Por ahora, generamos un programa esquemático basado en el tipo de entrenamiento y días disponibles
    
    const daysPerWeek = parseInt(questionnaireData.trainingDays);
    const trainingType = questionnaireData.trainingType;
    let schedule = [];
    
    // Generamos 12 semanas
    for (let week = 1; week <= 12; week++) {
        let weekSchedule = [];
        
        // Según los días disponibles, creamos sesiones apropiadas para el tipo de entrenamiento
        for (let day = 1; day <= daysPerWeek; day++) {
            let session = {};
            
            // Distribución según tipo de entrenamiento
            switch (trainingType) {
                case 'PW': // Powerlifting
                    if (daysPerWeek <= 3) {
                        session = generatePowerliftingSession(day, week, 'fullbody');
                    } else {
                        session = generatePowerliftingSession(day, week, 'split');
                    }
                    break;
                    
                case 'MC': // Musculación
                    session = generateBodybuildingSession(day, week, daysPerWeek);
                    break;
                    
                case 'WL': // Weightlifting
                    session = generateWeightliftingSession(day, week, daysPerWeek);
                    break;
                    
                case 'HT': // Entrenamiento híbrido
                    session = generateHybridSession(day, week, daysPerWeek);
                    break;
                    
                case 'CT': // Crosstraining
                    session = generateCrosstrainingSession(day, week);
                    break;
                    
                case 'FT': // Entrenamiento funcional
                    session = generateFunctionalSession(day, week);
                    break;
                    
                case 'RS': // Fuerza para corredores
                    session = generateRunnerSession(day, week, daysPerWeek);
                    break;
                    
                default:
                    session = generateGeneralTrainingSession(day, week);
            }
            
            weekSchedule.push(session);
        }
        
        schedule.push({
            week,
            sessions: weekSchedule
        });
    }
    
    return schedule;
}

// Funciones para generar diferentes tipos de sesiones
function generatePowerliftingSession(day, week, type) {
    if (type === 'fullbody') {
        return {
            day,
            name: `Día ${day}: Full Body`,
            focus: 'fullbody',
            exercises: [
                { id: 'back-squat', sets: 4, repsMin: 5, repsMax: 5, rpe: 8 },
                { id: 'bench-press', sets: 4, repsMin: 5, repsMax: 5, rpe: 8 },
                { id: 'deadlift', sets: 3, repsMin: 5, repsMax: 5, rpe: 8 },
                { id: 'overhead-press', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                { id: 'barbell-row', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 }
           
