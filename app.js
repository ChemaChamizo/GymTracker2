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
            if (savedUsers) {
                this.users = JSON.parse(savedUsers);
            } else {
                localStorage.setItem('gymtracker_users', JSON.stringify({}));
            }
            
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
            
            this.currentUser = users[this.currentUser.email];
            
            localStorage.setItem('gymtracker_users', JSON.stringify(users));
            localStorage.setItem('gymtracker_currentUser', JSON.stringify(this.currentUser));
            
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
        muscles: ['quadriceps', 'glutes', 'calves']
    },
    {
        id: 'dumbbell-lunge',
        name: 'Dumbbell Lunge',
        categories: ['MC', 'FT', 'RS'],
        fatigue: 'medium',
        muscles: ['quadriceps', 'glutes', 'hamstrings']
    }
];

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
            ],
            fatigueLimit: 100 + (week * 5)
        };
    } else {
        // Para programas de 4-5 días (split)
        let session = { day, exercises: [], fatigueLimit: 85 + (week * 5) };
        
        switch (day % 4) {
            case 1:
                session.name = `Día ${day}: Squat`;
                session.focus = 'lower';
                session.exercises = [
                    { id: 'back-squat', sets: 5, repsMin: 5, repsMax: 5, rpe: 8 },
                    { id: 'leg-press', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                    { id: 'bulgarian-split-squat', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                    { id: 'romanian-deadlift', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 }
                ];
                break;
            case 2:
                session.name = `Día ${day}: Bench`;
                session.focus = 'push';
                session.exercises = [
                    { id: 'bench-press', sets: 5, repsMin: 5, repsMax: 5, rpe: 8 },
                    { id: 'overhead-press', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                    { id: 'dumbbell-bench-press', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                    { id: 'dumbbell-shoulder-press', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 }
                ];
                break;
            case 3:
                session.name = `Día ${day}: Deadlift`;
                session.focus = 'pull';
                session.exercises = [
                    { id: 'deadlift', sets: 5, repsMin: 3, repsMax: 5, rpe: 8 },
                    { id: 'barbell-row', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                    { id: 'pull-up', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                    { id: 'lat-pulldown', sets: 3, repsMin: 10, repsMax: 12, rpe: 7 }
                ];
                break;
            case 0:
                session.name = `Día ${day}: Accesorios`;
                session.focus = 'accessories';
                session.exercises = [
                    { id: 'front-squat', sets: 3, repsMin: 6, repsMax: 8, rpe: 7 },
                    { id: 'dumbbell-bench-press', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                    { id: 'pull-up', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                    { id: 'push-press', sets: 3, repsMin: 6, repsMax: 8, rpe: 7 }
                ];
                break;
        }
        
        return session;
    }
}

function generateBodybuildingSession(day, week, daysPerWeek) {
    let session = { day, exercises: [], fatigueLimit: 80 + (week * 4) };
    
    if (daysPerWeek <= 3) {
        // Rutina dividida en 3 días
        switch (day % 3) {
            case 1:
                session.name = `Día ${day}: Pecho y Espalda`;
                session.focus = 'push_pull_upper';
                session.exercises = [
                    { id: 'bench-press', sets: 4, repsMin: 8, repsMax: 10, rpe: 8 },
                    { id: 'barbell-row', sets: 4, repsMin: 8, repsMax: 10, rpe: 8 },
                    { id: 'dumbbell-bench-press', sets: 3, repsMin: 10, repsMax: 12, rpe: 8 },
                    { id: 'lat-pulldown', sets: 3, repsMin: 10, repsMax: 12, rpe: 8 },
                    { id: 'overhead-press', sets: 3, repsMin: 10, repsMax: 12, rpe: 7 }
                ];
                break;
            case 2:
                session.name = `Día ${day}: Piernas y Core`;
                session.focus = 'lower';
                session.exercises = [
                    { id: 'back-squat', sets: 4, repsMin: 8, repsMax: 10, rpe: 8 },
                    { id: 'romanian-deadlift', sets: 4, repsMin: 8, repsMax: 10, rpe: 8 },
                    { id: 'leg-press', sets: 3, repsMin: 10, repsMax: 12, rpe: 8 },
                    { id: 'bulgarian-split-squat', sets: 3, repsMin: 10, repsMax: 12, rpe: 8 }
                ];
                break;
            case 0:
                session.name = `Día ${day}: Hombros y Brazos`;
                session.focus = 'upper_accessories';
                session.exercises = [
                    { id: 'overhead-press', sets: 4, repsMin: 8, repsMax: 10, rpe: 8 },
                    { id: 'dumbbell-shoulder-press', sets: 3, repsMin: 10, repsMax: 12, rpe: 8 },
                    { id: 'pull-up', sets: 4, repsMin: 8, repsMax: 10, rpe: 8 }
                ];
                break;
        }
    } else {
        // Rutina dividida en 5 días
        switch (day % 5) {
            case 1:
                session.name = `Día ${day}: Pecho`;
                session.focus = 'chest';
                session.exercises = [
                    { id: 'bench-press', sets: 4, repsMin: 8, repsMax: 10, rpe: 8 },
                    { id: 'dumbbell-bench-press', sets: 4, repsMin: 10, repsMax: 12, rpe: 8 }
                ];
                break;
            case 2:
                session.name = `Día ${day}: Espalda`;
                session.focus = 'back';
                session.exercises = [
                    { id: 'barbell-row', sets: 4, repsMin: 8, repsMax: 10, rpe: 8 },
                    { id: 'lat-pulldown', sets: 4, repsMin: 10, repsMax: 12, rpe: 8 },
                    { id: 'pull-up', sets: 3, repsMin: 8, repsMax: 10, rpe: 8 }
                ];
                break;
            case 3:
                session.name = `Día ${day}: Piernas`;
                session.focus = 'legs';
                session.exercises = [
                    { id: 'back-squat', sets: 4, repsMin: 8, repsMax: 10, rpe: 8 },
                    { id: 'leg-press', sets: 4, repsMin: 10, repsMax: 12, rpe: 8 },
                    { id: 'romanian-deadlift', sets: 3, repsMin: 10, repsMax: 12, rpe: 8 },
                    { id: 'bulgarian-split-squat', sets: 3, repsMin: 10, repsMax: 12, rpe: 8 }
                ];
                break;
            case 4:
                session.name = `Día ${day}: Hombros`;
                session.focus = 'shoulders';
                session.exercises = [
                    { id: 'overhead-press', sets: 4, repsMin: 8, repsMax: 10, rpe: 8 },
                    { id: 'dumbbell-shoulder-press', sets: 4, repsMin: 10, repsMax: 12, rpe: 8 },
                    { id: 'push-press', sets: 3, repsMin: 8, repsMax: 10, rpe: 8 }
                ];
                break;
            case 0:
                session.name = `Día ${day}: Brazos y Core`;
                session.focus = 'arms_core';
                session.exercises = [
                    { id: 'dumbbell-bench-press', sets: 3, repsMin: 10, repsMax: 12, rpe: 8 },
                    { id: 'pull-up', sets: 3, repsMin: 8, repsMax: 10, rpe: 8 }
                ];
                break;
        }
    }
    
    return session;
}

function generateWeightliftingSession(day, week, daysPerWeek) {
    let session = { day, exercises: [], fatigueLimit: 90 + (week * 5) };
    
    if (daysPerWeek <= 3) {
        // 3 días por semana
        switch (day % 3) {
            case 1:
                session.name = `Día ${day}: Snatch + Accesorios`;
                session.focus = 'snatch';
                session.exercises = [
                    { id: 'snatch', sets: 5, repsMin: 2, repsMax: 3, rpe: 8 },
                    { id: 'overhead-press', sets: 3, repsMin: 6, repsMax: 8, rpe: 7 },
                    { id: 'pull-up', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                    { id: 'front-squat', sets: 3, repsMin: 6, repsMax: 8, rpe: 7 }
                ];
                break;
            case 2:
                session.name = `Día ${day}: Clean & Jerk + Accesorios`;
                session.focus = 'clean_jerk';
                session.exercises = [
                    { id: 'clean', sets: 4, repsMin: 2, repsMax: 3, rpe: 8 },
                    { id: 'jerk', sets: 4, repsMin: 2, repsMax: 3, rpe: 8 },
                    { id: 'back-squat', sets: 3, repsMin: 5, repsMax: 6, rpe: 7 },
                    { id: 'push-press', sets: 3, repsMin: 6, repsMax: 8, rpe: 7 }
                ];
                break;
            case 0:
                session.name = `Día ${day}: Squats + Accesorios`;
                session.focus = 'squat_accessories';
                session.exercises = [
                    { id: 'back-squat', sets: 5, repsMin: 3, repsMax: 5, rpe: 8 },
                    { id: 'front-squat', sets: 3, repsMin: 3, repsMax: 5, rpe: 7 },
                    { id: 'barbell-row', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                    { id: 'overhead-press', sets: 3, repsMin: 6, repsMax: 8, rpe: 7 }
                ];
                break;
        }
    } else {
        // 4-5 días por semana
        switch (day % 5) {
            case 1:
                session.name = `Día ${day}: Snatch Técnica`;
                session.focus = 'snatch_technique';
                session.exercises = [
                    { id: 'snatch', sets: 6, repsMin: 2, repsMax: 2, rpe: 7 },
                    { id: 'overhead-press', sets: 3, repsMin: 6, repsMax: 8, rpe: 7 },
                    { id: 'pull-up', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 }
                ];
                break;
            case 2:
                session.name = `Día ${day}: Clean & Jerk Técnica`;
                session.focus = 'clean_jerk_technique';
                session.exercises = [
                    { id: 'clean', sets: 5, repsMin: 2, repsMax: 2, rpe: 7 },
                    { id: 'jerk', sets: 5, repsMin: 2, repsMax: 2, rpe: 7 },
                    { id: 'push-press', sets: 3, repsMin: 6, repsMax: 8, rpe: 7 }
                ];
                break;
            case 3:
                session.name = `Día ${day}: Snatch Intensidad`;
                session.focus = 'snatch_intensity';
                session.exercises = [
                    { id: 'snatch', sets: 5, repsMin: 1, repsMax: 2, rpe: 8 },
                    { id: 'front-squat', sets: 4, repsMin: 3, repsMax: 5, rpe: 7 }
                ];
                break;
            case 4:
                session.name = `Día ${day}: Clean & Jerk Intensidad`;
                session.focus = 'clean_jerk_intensity';
                session.exercises = [
                    { id: 'clean', sets: 4, repsMin: 1, repsMax: 2, rpe: 8 },
                    { id: 'jerk', sets: 4, repsMin: 1, repsMax: 2, rpe: 8 },
                    { id: 'back-squat', sets: 4, repsMin: 3, repsMax: 5, rpe: 8 }
                ];
                break;
            case 0:
                session.name = `Día ${day}: Squats + Accesorios`;
                session.focus = 'squat_accessories';
                session.exercises = [
                    { id: 'back-squat', sets: 5, repsMin: 3, repsMax: 5, rpe: 8 },
                    { id: 'front-squat', sets: 3, repsMin: 3, repsMax: 5, rpe: 7 },
                    { id: 'barbell-row', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 }
                ];
                break;
        }
    }
    
    return session;
}

function generateHybridSession(day, week, daysPerWeek) {
    // Implementación básica, se ampliaría en una versión real
    let session = { day, exercises: [], fatigueLimit: 85 + (week * 4) };
    
    switch (day % 4) {
        case 1:
            session.name = `Día ${day}: Fuerza Superior`;
            session.focus = 'upper_strength';
            session.exercises = [
                { id: 'bench-press', sets: 4, repsMin: 5, repsMax: 5, rpe: 8 },
                { id: 'overhead-press', sets: 3, repsMin: 6, repsMax: 8, rpe: 7 },
                { id: 'pull-up', sets: 4, repsMin: 6, repsMax: 8, rpe: 8 },
                { id: 'barbell-row', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 }
            ];
            break;
        case 2:
            session.name = `Día ${day}: Fuerza Inferior`;
            session.focus = 'lower_strength';
            session.exercises = [
                { id: 'back-squat', sets: 4, repsMin: 5, repsMax: 5, rpe: 8 },
                { id: 'deadlift', sets: 3, repsMin: 5, repsMax: 5, rpe: 8 },
                { id: 'romanian-deadlift', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                { id: 'bulgarian-split-squat', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 }
            ];
            break;
        case 3:
            session.name = `Día ${day}: Hipertrofia Superior`;
            session.focus = 'upper_hypertrophy';
            session.exercises = [
                { id: 'dumbbell-bench-press', sets: 4, repsMin: 10, repsMax: 12, rpe: 8 },
                { id: 'dumbbell-shoulder-press', sets: 4, repsMin: 10, repsMax: 12, rpe: 8 },
                { id: 'lat-pulldown', sets: 4, repsMin: 10, repsMax: 12, rpe: 8 }
            ];
            break;
        case 0:
            session.name = `Día ${day}: Hipertrofia Inferior`;
            session.focus = 'lower_hypertrophy';
            session.exercises = [
                { id: 'leg-press', sets: 4, repsMin: 10, repsMax: 12, rpe: 8 },
                { id: 'front-squat', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
                { id: 'bulgarian-split-squat', sets: 3, repsMin: 10, repsMax: 12, rpe: 8 }
            ];
            break;
    }
    
    return session;
}

function generateCrosstrainingSession(day, week) {
    // Implementación básica, se ampliaría en una versión real
    return {
        day,
        name: `Día ${day}: CrossTraining`,
        focus: 'functional_strength',
        exercises: [
            { id: 'clean', sets: 4, repsMin: 3, repsMax: 5, rpe: 7 },
            { id: 'pull-up', sets: 3, repsMin: 8, repsMax: 10, rpe: 8 },
            { id: 'push-press', sets: 3, repsMin: 8, repsMax: 10, rpe: 8 },
            { id: 'box-jump', sets: 3, repsMin: 5, repsMax: 8, rpe: 7 },
            { id: 'kettlebell-swing', sets: 3, repsMin: 12, repsMax: 15, rpe: 8 }
        ],
        fatigueLimit: 95 + (week * 5)
    };
}

function generateFunctionalSession(day, week) {
    // Implementación básica, se ampliaría en una versión real
    return {
        day,
        name: `Día ${day}: Entrenamiento Funcional`,
        focus: 'functional',
        exercises: [
            { id: 'kettlebell-swing', sets: 4, repsMin: 12, repsMax: 15, rpe: 8 },
            { id: 'dumbbell-lunge', sets: 3, repsMin: 10, repsMax: 12, rpe: 7 },
            { id: 'push-press', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
            { id: 'pull-up', sets: 3, repsMin: 8, repsMax: 10, rpe: 8 }
        ],
        fatigueLimit: 80 + (week * 4)
    };
}

function generateRunnerSession(day, week, daysPerWeek) {
    // Implementación básica, se ampliaría en una versión real
    return {
        day,
        name: `Día ${day}: Fuerza para Corredores`,
        focus: 'running_strength',
        exercises: [
            { id: 'bulgarian-split-squat', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
            { id: 'box-jump', sets: 3, repsMin: 6, repsMax: 8, rpe: 7 },
            { id: 'kettlebell-swing', sets: 3, repsMin: 12, repsMax: 15, rpe: 7 },
            { id: 'dumbbell-lunge', sets: 3, repsMin: 10, repsMax: 12, rpe: 7 }
        ],
        fatigueLimit: 75 + (week * 3)
    };
}

function generateGeneralTrainingSession(day, week) {
    // Entrenamiento general por defecto
    return {
        day,
        name: `Día ${day}: Entrenamiento General`,
        focus: 'general',
        exercises: [
            { id: 'back-squat', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
            { id: 'bench-press', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
            { id: 'barbell-row', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 },
            { id: 'overhead-press', sets: 3, repsMin: 8, repsMax: 10, rpe: 7 }
        ],
        fatigueLimit: 75 + (week * 3)
    };
}

// Funciones de cálculo para RM y fatiga
function calculateRM(weight, reps, rpe) {
    // Versión mejorada de la fórmula de Epley con ajuste por RPE
    const rpeAdjustment = getRPEAdjustment(rpe);
    return (weight * (1 + 0.0333 * reps)) / rpeAdjustment;
}

function getRPEAdjustment(rpe) {
    // Factor de ajuste según RPE (basado en la tabla de equivalencias)
    const rpeAdjustments = {
        6: 0.85,  // 85% del RM
        6.5: 0.87,
        7: 0.89,  // 89% del RM
        7.5: 0.91,
        8: 0.93,  // 93% del RM
        8.5: 0.95,
        9: 0.97,  // 97% del RM
        9.5: 0.99,
        10: 1.0   // 100% del RM
    };
    
    return rpeAdjustments[rpe] || 0.9; // Valor por defecto si el RPE no está en la tabla
}

function calculateFatigueIndex(initialRM, finalRM) {
    // Índice de fatiga por serie
    return Math.round(((initialRM - finalRM) / initialRM) * 100);
}

function calculateTotalFatigue(exercises) {
    // Calcular la fatiga total de la sesión
    let totalFatigue = 0;
    let exerciseCount = exercises.length;
    
    exercises.forEach(exercise => {
        const exerciseObj = EXERCISES.find(e => e.id === exercise.exerciseId);
        const fatigueWeight = getFatigueWeight(exerciseObj ? exerciseObj.fatigue : 'medium');
        
        if (exercise.sets) {
            exercise.sets.forEach(set => {
                if (set.fatigueIndex) {
                    totalFatigue += (set.fatigueIndex * fatigueWeight);
                }
            });
        }
    });
    
    // Normalizar por el número de ejercicios
    return Math.round(totalFatigue / (exerciseCount || 1));
}

function getFatigueWeight(fatigueLevel) {
    // Ponderación según el nivel de fatiga del ejercicio
    switch (fatigueLevel) {
        case 'high': return 1.5;
        case 'medium': return 1.0;
        case 'low': return 0.7;
        default: return 1.0;
    }
}

// Controlador principal de la aplicación
class AppController {
    constructor() {
        this.currentView = 'login-view';
        this.exercises = EXERCISES;
        this.db = DB;
        this.db.users.init();
        
        this.exerciseCounter = 0;
        this.initEventListeners();
        this.checkLoggedInUser();
        this.updateDateDisplay();
    }
    
    // Inicialización de eventos
    initEventListeners() {
        // Eventos de navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const navId = e.currentTarget.parentElement.id;
                if (navId === 'nav-home') this.showView('dashboard-view');
                else if (navId === 'nav-training') this.showView('training-view');
                else if (navId === 'nav-history') this.showView('history-view');
                else if (navId === 'nav-metrics') this.showView('metrics-view');
                else if (navId === 'nav-profile') this.showView('profile-view');
            });
        });
        
        // Eventos de formularios de login/registro
        document.querySelectorAll('input[name="loginOption"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'login') {
                    document.getElementById('login-form').style.display = 'block';
                    document.getElementById('register-form').style.display = 'none';
                } else {
                    document.getElementById('login-form').style.display = 'none';
                    document.getElementById('register-form').style.display = 'block';
                }
            });
        });
        
        // Formulario de inicio de sesión
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = this.db.users.login(email, password);
            if (result.success) {
                this.onLoginSuccess();
            } else {
                alert(result.message || 'Error de inicio de sesión');
            }
        });
        
        // Formulario de registro
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerPasswordConfirm').value;
            
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }
            
            const result = this.db.users.register(email, password);
            if (result.success) {
                // Iniciar sesión automáticamente
                this.db.users.login(email, password);
                this.showView('questionnaire-view');
            } else {
                alert(result.message || 'Error al registrarse');
            }
        });
        
        // Formulario del cuestionario
        document.getElementById('questionnaire-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const questionnaireData = {
                name: document.getElementById('qName').value,
                birthdate: document.getElementById('qBirthdate').value,
                weight: document.getElementById('qWeight').value,
                experience: document.getElementById('qExperience').value,
                injuries: document.getElementById('qInjuries').value,
                trainingType: document.getElementById('qTrainingType').value,
                trainingDays: document.getElementById('qTrainingDays').value
            };
            
            // Actualizar perfil con los datos del cuestionario
            this.db.users.updateProfile(questionnaireData);
            
            // Generar programa basado en el cuestionario
            const programResult = this.db.programs.generate(questionnaireData);
            
            if (programResult.success) {
                this.showView('program-options-view');
            } else {
                alert(programResult.message || 'Error al generar el programa');
            }
        });
        
        // Botones post-cuestionario
        document.getElementById('try-program-btn').addEventListener('click', () => {
            this.showView('dashboard-view');
        });
        
        document.getElementById('manual-tracking-btn').addEventListener('click', () => {
            this.showView('dashboard-view');
        });
        
        // Botón para iniciar entrenamiento
        document.getElementById('start-training-btn').addEventListener('click', () => {
            this.showView('training-view');
        });
        
        // Opciones de estado físico antes de entrenar
        document.querySelectorAll('.feeling-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Quitar selección previa
                document.querySelectorAll('.feeling-btn').forEach(b => b.classList.remove('selected'));
                
                // Marcar el botón seleccionado
                e.currentTarget.classList.add('selected');
                
                // Guardar el estado seleccionado
                const feelingValue = e.currentTarget.dataset.value;
                this.selectedFeeling = feelingValue;
                
                // Mostrar el formulario de entrenamiento
                document.getElementById('daily-feeling-prompt').style.display = 'none';
                document.getElementById('training-form-container').style.display = 'block';
            });
        });
        
        // Botón para añadir ejercicio
        document.getElementById('add-exercise-btn').addEventListener('click', () => {
            this.showExerciseModal();
        });
        
        // Búsqueda en modal de ejercicios
        document.getElementById('exercise-search').addEventListener('input', (e) => {
            this.filterExercises(e.target.value);
        });
        
        // Filtros de categoría en modal de ejercicios
        document.querySelectorAll('#exercise-select-modal [data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.filterExercisesByCategory(filter);
            });
        });
        
        // Guardar entrenamiento
        document.getElementById('save-training-btn').addEventListener('click', () => {
            this.saveTraining();
        });
        
        // Inicializar gráficos en la vista de métricas
        document.querySelectorAll('[data-metric]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-metric]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.updateMetricsChart(e.currentTarget.dataset.metric);
            });
        });
        
        // Cambio de ejercicio en métricas
        document.getElementById('metrics-exercise-select').addEventListener('change', () => {
            const activeMetricBtn = document.querySelector('[data-metric].active');
            if (activeMetricBtn) {
                this.updateMetricsChart(activeMetricBtn.dataset.metric);
            }
        });
        
        // Cambio de período en métricas
        document.getElementById('metrics-period-select').addEventListener('change', () => {
            const activeMetricBtn = document.querySelector('[data-metric].active');
            if (activeMetricBtn) {
                this.updateMetricsChart(activeMetricBtn.dataset.metric);
            }
        });
        
        // Formulario de perfil
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const profileData = {
                name: document.getElementById('profileName').value,
                birthdate: document.getElementById('profileBirthdate').value,
                weight: document.getElementById('profileWeight').value,
                experience: document.getElementById('profileExperience').value,
                trainingType: document.getElementById('profileTrainingType').value
            };
            
            const result = this.db.users.updateProfile(profileData);
            
            if (result.success) {
                this.updateProfileDisplay();
                alert('Perfil actualizado correctamente');
            } else {
                alert(result.message || 'Error al actualizar el perfil');
            }
        });
    }
    
    // Verificar si hay un usuario logueado
    checkLoggedInUser() {
        if (this.db.users.currentUser) {
            this.onLoginSuccess();
        } else {
            this.showView('login-view');
        }
    }
    
    // Acciones al iniciar sesión correctamente
    onLoginSuccess() {
        // Si el usuario ya completó el cuestionario, ir al dashboard
        if (this.db.users.currentUser && this.db.users.currentUser.profile && this.db.users.currentUser.profile.name) {
            this.showView('dashboard-view');
            this.updateProfileDisplay();
            this.initDashboardCharts();
        } else {
            // Si es la primera vez, mostrar el cuestionario
            this.showView('questionnaire-view');
        }
    }
    
    // Cambiar entre vistas
    showView(viewId) {
        // Ocultar todas las vistas
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.remove('active-view');
        });
        
        // Mostrar la vista seleccionada
        document.getElementById(viewId).classList.add('active-view');
        this.currentView = viewId;
        
        // Actualizar navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Activar el ítem de navegación correspondiente
        if (viewId === 'dashboard-view') {
            document.querySelector('#nav-home .nav-link').classList.add('active');
        } else if (viewId === 'training-view') {
            document.querySelector('#nav-training .nav-link').classList.add('active');
        } else if (viewId === 'history-view') {
            document.querySelector('#nav-history .nav-link').classList.add('active');
        } else if (viewId === 'metrics-view') {
            document.querySelector('#nav-metrics .nav-link').classList.add('active');
            this.initMetricsCharts();
        } else if (viewId === 'profile-view') {
            document.querySelector('#nav-profile .nav-link').classList.add('active');
        }
        
        // Si es la vista de entrenamiento, resetear a la pregunta inicial
        if (viewId === 'training-view') {
            document.getElementById('daily-feeling-prompt').style.display = 'block';
            document.getElementById('training-form-container').style.display = 'none';
            document.querySelectorAll('.feeling-btn').forEach(btn => btn.classList.remove('selected'));
            document.getElementById('exercises-container').innerHTML = '';
            this.exerciseCounter = 0;
            this.updateTrainingSummary();
        }
    }
    
    // Mostrar modal para seleccionar ejercicio
    showExerciseModal() {
        // Llenar la lista de ejercicios
        this.populateExerciseList();
        
        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('exercise-select-modal'));
        modal.show();
    }
    
    // Llenar la lista de ejercicios en el modal
    populateExerciseList() {
        const exerciseList = document.getElementById('exercise-list');
        exerciseList.innerHTML = '';
        
        this.exercises.forEach(exercise => {
            const li = document.createElement('a');
            li.className = 'list-group-item list-group-item-action exercise-list-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <strong>${exercise.name}</strong>
                    <div class="text-muted small">Músculos: ${exercise.muscles.join(', ')}</div>
                </div>
                <div>
                    ${exercise.categories.map(cat => `<span class="badge bg-secondary me-1">${cat}</span>`).join('')}
                    <span class="badge ${this.getFatigueBadgeClass(exercise.fatigue)}">${this.capitalizeFatigue(exercise.fatigue)}</span>
                </div>
            `;
            
            li.addEventListener('click', () => {
                this.addExerciseToTraining(exercise);
                bootstrap.Modal.getInstance(document.getElementById('exercise-select-modal')).hide();
            });
            
            exerciseList.appendChild(li);
        });
    }
    
    // Filtrar ejercicios por texto
    filterExercises(searchText) {
        const exerciseList = document.getElementById('exercise-list');
        const items = exerciseList.querySelectorAll('.exercise-list-item');
        
        searchText = searchText.toLowerCase();
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchText)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Filtrar ejercicios por categoría
    filterExercisesByCategory(category) {
        const exerciseList = document.getElementById('exercise-list');
        exerciseList.innerHTML = '';
        
        let filteredExercises;
        
        if (category === 'all') {
            filteredExercises = this.exercises;
        } else {
            filteredExercises = this.exercises.filter(exercise => 
                exercise.categories.includes(category)
            );
        }
        
        filteredExercises.forEach(exercise => {
            const li = document.createElement('a');
            li.className = 'list-group-item list-group-item-action exercise-list-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <strong>${exercise.name}</strong>
                    <div class="text-muted small">Músculos: ${exercise.muscles.join(', ')}</div>
                </div>
                <div>
                    ${exercise.categories.map(cat => `<span class="badge bg-secondary me-1">${cat}</span>`).join('')}
                    <span class="badge ${this.getFatigueBadgeClass(exercise.fatigue)}">${this.capitalizeFatigue(exercise.fatigue)}</span>
                </div>
            `;
            
            li.addEventListener('click', () => {
                this.addExerciseToTraining(exercise);
                bootstrap.Modal.getInstance(document.getElementById('exercise-select-modal')).hide();
            });
            
            exerciseList.appendChild(li);
        });
    }
    
    // Añadir ejercicio seleccionado al entrenamiento
    addExerciseToTraining(exercise) {
        const exercisesContainer = document.getElementById('exercises-container');
        const exerciseId = `exercise-${++this.exerciseCounter}`;
        
        const exerciseCard = document.createElement('div');
        exerciseCard.className = 'card exercise-card';
        exerciseCard.id = exerciseId;
        exerciseCard.dataset.exerciseId = exercise.id;
        
        exerciseCard.innerHTML = `
            <div class="exercise-header d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-0">${exercise.name}</h5>
                    <div class="text-muted small">
                        ${exercise.categories.map(cat => `<span class="badge bg-secondary me-1">${cat}</span>`).join('')}
                        <span class="badge ${this.getFatigueBadgeClass(exercise.fatigue)}">${this.capitalizeFatigue(exercise.fatigue)}</span>
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-primary add-set-btn" data-exercise="${exerciseId}">
                        <i class="bi bi-plus-circle"></i> Añadir serie
                    </button>
                    <button class="btn btn-sm btn-outline-danger remove-exercise-btn" data-exercise="${exerciseId}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="sets-container">
                    <!-- Aquí se añadirán las series -->
                </div>
            </div>
        `;
        
        exercisesContainer.appendChild(exerciseCard);
        
        // Evento para añadir serie
        exerciseCard.querySelector('.add-set-btn').addEventListener('click', () => {
            this.addSetToExercise(exerciseId);
        });
        
        // Evento para eliminar ejercicio
        exerciseCard.querySelector('.remove-exercise-btn').addEventListener('click', () => {
            exerciseCard.remove();
            this.updateTrainingSummary();
        });
        
        // Añadir primera serie automáticamente
        this.addSetToExercise(exerciseId);
        this.updateTrainingSummary();
    }
    
    // Añadir serie a un ejercicio
    addSetToExercise(exerciseId) {
        const setsContainer = document.querySelector(`#${exerciseId} .sets-container`);
        const setNumber = setsContainer.children.length + 1;
        
        const setRow = document.createElement('div');
        setRow.className = 'row set-row align-items-center';
        setRow.dataset.setNumber = setNumber;
        
        setRow.innerHTML = `
            <div class="col-md-1">
                <div class="set-number">${setNumber}</div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <label class="form-label small">Peso (kg)</label>
                    <input type="number" class="form-control form-control-sm weight-input" min="0" step="0.5" required>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <label class="form-label small">Reps</label>
                    <input type="number" class="form-control form-control-sm reps-input" min="1" required>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label class="form-label small">RPE (6-10)</label>
                    <div class="rpe-container">
                        <div class="rpe-scale">
                            <div class="rpe-value rpe-6" data-rpe="6">6</div>
                            <div class="rpe-value rpe-7" data-rpe="7">7</div>
                            <div class="rpe-value rpe-8" data-rpe="8">8</div>
                            <div class="rpe-value rpe-9" data-rpe="9">9</div>
                            <div class="rpe-value rpe-10" data-rpe="10">10</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label class="form-label small">RM Estimado</label>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control form-control-sm rm-display" readonly>
                        <button class="btn btn-outline-secondary calculate-rm-btn" type="button">Calcular</button>
                    </div>
                </div>
            </div>
            <div class="col-md-1">
                <button class="btn btn-sm btn-outline-danger remove-set-btn">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `;
        
        setsContainer.appendChild(setRow);
        
        // Eventos para el cálculo de RM
        const rpeButtons = setRow.querySelectorAll('.rpe-value');
        rpeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                rpeButtons.forEach(b => b.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                
                // Calcular RM automáticamente si ya hay peso y repeticiones
                const weightInput = setRow.querySelector('.weight-input');
                const repsInput = setRow.querySelector('.reps-input');
                
                if (weightInput.value && repsInput.value) {
                    const weight = parseFloat(weightInput.value);
                    const reps = parseInt(repsInput.value);
                    const rpe = parseFloat(e.currentTarget.dataset.rpe);
                    
                    if (!isNaN(weight) && !isNaN(reps) && !isNaN(rpe)) {
                        const rm = calculateRM(weight, reps, rpe);
                        setRow.querySelector('.rm-display').value = `${Math.round(rm * 10) / 10} kg`;
                        
                        // Calcular y guardar el índice de fatiga si hay series previas
                        if (setNumber > 1) {
                            const previousSetRow = setsContainer.querySelector(`[data-set-number="${setNumber - 1}"]`);
                            const previousRmText = previousSetRow.querySelector('.rm-display').value;
                            
                            if (previousRmText) {
                                const previousRm = parseFloat(previousRmText);
                                if (!isNaN(previousRm)) {
                                    const fatigueIndex = calculateFatigueIndex(previousRm, rm);
                                    setRow.dataset.fatigueIndex = fatigueIndex;
                                    
                                    // Mostrar índice de fatiga
                                    const fatigueDisplay = document.createElement('div');
                                    fatigueDisplay.className = `small ${this.getFatigueTextClass(fatigueIndex)}`;
                                    fatigueDisplay.textContent = `Fatiga: ${fatigueIndex}%`;
                                    
                                    // Reemplazar o añadir
                                    const existingFatigueDisplay = setRow.querySelector('.fatigue-display');
                                    if (existingFatigueDisplay) {
                                        existingFatigueDisplay.replaceWith(fatigueDisplay);
                                    } else {
                                        setRow.querySelector('.col-md-3:nth-child(4)').appendChild(fatigueDisplay);
                                    }
                                    
                                    fatigueDisplay.classList.add('fatigue-display');
                                }
                            }
                        }
                        
                        this.updateTrainingSummary();
                    }
                }
            });
        });
        
        // Botón de calcular RM
        setRow.querySelector('.calculate-rm-btn').addEventListener('click', () => {
            const weightInput = setRow.querySelector('.weight-input');
            const repsInput = setRow.querySelector('.reps-input');
            const rpeSelected = setRow.querySelector('.rpe-value.selected');
            
            if (weightInput.value && repsInput.value && rpeSelected) {
                const weight = parseFloat(weightInput.value);
                const reps = parseInt(repsInput.value);
                const rpe = parseFloat(rpeSelected.dataset.rpe);
                
                if (!isNaN(weight) && !isNaN(reps) && !isNaN(rpe)) {
                    const rm = calculateRM(weight, reps, rpe);
                    setRow.querySelector('.rm-display').value = `${Math.round(rm * 10) / 10} kg`;
                    
                    // Calcular y guardar el índice de fatiga si hay series previas
                    if (setNumber > 1) {
                        const previousSetRow = setsContainer.querySelector(`[data-set-number="${setNumber - 1}"]`);
                        const previousRmText = previousSetRow.querySelector('.rm-display').value;
                        
                        if (previousRmText) {
                            const previousRm = parseFloat(previousRmText);
                            if (!isNaN(previousRm)) {
                                const fatigueIndex = calculateFatigueIndex(previousRm, rm);
                                setRow.dataset.fatigueIndex = fatigueIndex;
                                
                                // Mostrar índice de fatiga
                                const fatigueDisplay = document.createElement('div');
                                fatigueDisplay.className = `small ${this.getFatigueTextClass(fatigueIndex)}`;
                                fatigueDisplay.textContent = `Fatiga: ${fatigueIndex}%`;
                                
                                // Reemplazar o añadir
                                const existingFatigueDisplay = setRow.querySelector('.fatigue-display');
                                if (existingFatigueDisplay) {
                                    existingFatigueDisplay.replaceWith(fatigueDisplay);
                                } else {
                                    setRow.querySelector('.col-md-3:nth-child(4)').appendChild(fatigueDisplay);
                                }
                                
                                fatigueDisplay.classList.add('fatigue-display');
                            }
                        }
                    }
                    
                    this.updateTrainingSummary();
                }
            } else {
                alert('Por favor, introduce el peso, repeticiones y selecciona un RPE');
            }
        });
        
        // Botón de eliminar serie
        setRow.querySelector('.remove-set-btn').addEventListener('click', () => {
            setRow.remove();
            
            // Renumerar las series
            const setRows = setsContainer.querySelectorAll('.set-row');
            setRows.forEach((row, index) => {
                row.dataset.setNumber = index + 1;
                row.querySelector('.set-number').textContent = index + 1;
            });
            
            this.updateTrainingSummary();
        });
    }
    
    // Actualizar resumen del entrenamiento
    updateTrainingSummary() {
        const exercises = document.querySelectorAll('.exercise-card');
        let totalExercises = exercises.length;
        let totalSets = 0;
        let totalVolume = 0;
        let fatigueIndices = [];
        
        exercises.forEach(exercise => {
            const setRows = exercise.querySelectorAll('.set-row');
            totalSets += setRows.length;
            
            setRows.forEach(setRow => {
                const weightInput = setRow.querySelector('.weight-input');
                const repsInput = setRow.querySelector('.reps-input');
                
                if (weightInput.value && repsInput.value) {
                    const weight = parseFloat(weightInput.value);
                    const reps = parseInt(repsInput.value);
                    
                    if (!isNaN(weight) && !isNaN(reps)) {
                        totalVolume += weight * reps;
                    }
                }
                
                if (setRow.dataset.fatigueIndex) {
                    fatigueIndices.push(parseInt(setRow.dataset.fatigueIndex));
                }
            });
        });
        
        // Calcular índice de fatiga promedio
        const avgFatigue = fatigueIndices.length > 0 
            ? Math.round(fatigueIndices.reduce((a, b) => a + b, 0) / fatigueIndices.length) 
            : 0;
        
        // Actualizar los valores en la UI
        document.getElementById('total-exercises').textContent = totalExercises;
        document.getElementById('total-sets').textContent = totalSets;
        document.getElementById('total-volume').textContent = totalVolume;
        document.getElementById('fatigue-index').textContent = avgFatigue;
    }
    
    // Guardar el entrenamiento
    saveTraining() {
        const exercises = document.querySelectorAll('.exercise-card');
        const trainingData = {
            date: new Date().toISOString(),
            feeling: this.selectedFeeling,
            exercises: []
        };
        
        exercises.forEach(exerciseEl => {
            const exerciseId = exerciseEl.dataset.exerciseId;
            const exercise = this.exercises.find(e => e.id === exerciseId);
            
            if (!exercise) return;
            
            const exerciseData = {
                exerciseId,
                name: exercise.name,
                categories: exercise.categories,
                fatigue: exercise.fatigue,
                sets: []
            };
            
            const setRows = exerciseEl.querySelectorAll('.set-row');
            setRows.forEach(setRow => {
                const weightInput = setRow.querySelector('.weight-input');
                const repsInput = setRow.querySelector('.reps-input');
                const rpeSelected = setRow.querySelector('.rpe-value.selected');
                const rmDisplay = setRow.querySelector('.rm-display');
                
                if (weightInput.value && repsInput.value && rpeSelected) {
                    const weight = parseFloat(weightInput.value);
                    const reps = parseInt(repsInput.value);
                    const rpe = parseFloat(rpeSelected.dataset.rpe);
                    const rm = rmDisplay.value ? parseFloat(rmDisplay.value) : null;
                    const fatigueIndex = setRow.dataset.fatigueIndex ? parseInt(setRow.dataset.fatigueIndex) : 0;
                    
                    exerciseData.sets.push({
                        weight,
                        reps,
                        rpe,
                        rm,
                        fatigueIndex
                    });
                }
            });
            
            trainingData.exercises.push(exerciseData);
        });
        
        // Guardar en la base de datos
        const result = this.db.trainings.save(trainingData);
        
        if (result.success) {
            alert('Entrenamiento guardado correctamente');
            this.showView('dashboard-view');
        } else {
            alert(result.message || 'Error al guardar el entrenamiento');
        }
    }
    
    // Actualizar la visualización del perfil
    updateProfileDisplay() {
        const user = this.db.users.currentUser;
        
        if (!user) return;
        
        // Actualizar información básica
        if (user.profile) {
            document.getElementById('profile-name').textContent = user.profile.name || 'Usuario';
            document.getElementById('profile-email').textContent = user.email;
            
            // Actualizar los campos del formulario
            document.getElementById('profileName').value = user.profile.name || '';
            document.getElementById('profileEmail').value = user.email;
            document.getElementById('profileBirthdate').value = user.profile.birthdate || '';
            document.getElementById('profileWeight').value = user.profile.weight || '';
            
            if (user.profile.experience) {
                document.getElementById('profileExperience').value = user.profile.experience;
            }
            
            if (user.profile.trainingType) {
                document.getElementById('profileTrainingType').value = user.profile.trainingType;
            }
        }
        
        // Actualizar estadísticas
        document.getElementById('profile-workouts').textContent = user.trainings ? user.trainings.length : 0;
        
        // Actualizar información del programa
        if (user.program) {
            document.getElementById('profile-program-week').textContent = user.program.currentWeek;
            document.getElementById('program-type').textContent = this.getTrainingTypeName(user.profile.trainingType);
            document.getElementById('program-days').textContent = user.program.daysPerWeek;
            document.getElementById('program-progress').textContent = `Semana ${user.program.currentWeek} de ${user.program.totalWeeks}`;
            
            const progressBar = document.querySelector('.progress-bar');
            const progressPercentage = (user.program.currentWeek / user.program.totalWeeks) * 100;
            progressBar.style.width = `${progressPercentage}%`;
            progressBar.setAttribute('aria-valuenow', progressPercentage);
            progressBar.textContent = `${Math.round(progressPercentage)}%`;
        }
    }
    
    // Inicializar gráficos del dashboard
    initDashboardCharts() {
        // Gráfico de RM
        const rmChart = document.getElementById('rm-chart');
        
        if (rmChart) {
            const ctx = rmChart.getContext('2d');
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
                    datasets: [{
                        label: 'Squat',
                        data: [100, 105, 107, 110, 115],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        tension: 0.4
                    }, {
                        label: 'Bench Press',
                        data: [80, 82, 85, 87, 90],
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        tension: 0.4
                    }, {
                        label: 'Deadlift',
                        data: [130, 135, 140, 145, 150],
                        borderColor: 'rgba(255, 206, 86, 1)',
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Evolución del RM Estimado'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        },
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Peso (kg)'
                            }
                        }
                    }
                }
            });
        }
    }
    
    // Inicializar gráficos de métricas
    initMetricsCharts() {
        // Gráfico principal de métricas
        this.updateMetricsChart('rm');
        
        // Gráfico de distribución de intensidad
        const intensityChart = document.getElementById('intensity-chart');
        
        if (intensityChart) {
            const ctx = intensityChart.getContext('2d');
            
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['60-70%', '70-80%', '80-90%', '90-100%'],
                    datasets: [{
                        data: [20, 40, 30, 10],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(255, 99, 132, 0.7)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        title: {
                            display: true,
                            text: 'Distribución de la Intensidad (% del RM)'
                        }
                    }
                }
            });
        }
    }
    
    // Actualizar gráfico principal de métricas
    updateMetricsChart(metricType) {
        const metricsChart = document.getElementById('metrics-chart');
        
        if (!metricsChart) return;
        
        const ctx = metricsChart.getContext('2d');
        
        // Eliminar gráfico previo si existe
        if (this.metricsChart) {
            this.metricsChart.destroy();
        }
        
        let chartData = {};
        
        // Configurar datos según el tipo de métrica
        switch (metricType) {
            case 'rm':
                chartData = {
                    labels: ['01/09', '08/09', '15/09', '22/09', '29/09', '06/10', '13/10'],
                    datasets: [{
                        label: 'RM Estimado',
                        data: [100, 102, 105, 103, 108, 110, 115],
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        tension: 0.4
                    }]
                };
                break;
            case 'volume':
                chartData = {
                    labels: ['01/09', '08/09', '15/09', '22/09', '29/09', '06/10', '13/10'],
                    datasets: [{
                        label: 'Volumen (kg)',
                        data: [3200, 3500, 3300, 3800, 4000, 3900, 4200],
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.4
                    }]
                };
                break;
            case 'fatigue':
                chartData = {
                    labels: ['01/09', '08/09', '15/09', '22/09', '29/09', '06/10', '13/10'],
                    datasets: [{
                        label: 'Índice de Fatiga',
                        data: [25, 30, 35, 28, 32, 27, 30],
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        tension: 0.4
                    }]
                };
                break;
            case 'rpe':
                chartData = {
                    labels: ['01/09', '08/09', '15/09', '22/09', '29/09', '06/10', '13/10'],
                    datasets: [{
                        label: 'RPE Promedio',
                        data: [7.5, 8, 8.2, 7.8, 8.5, 8.3, 8.0],
                        borderColor: 'rgba(255, 206, 86, 1)',
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        tension: 0.4
                    }]
                };
                break;
        }
        
        this.metricsChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: this.getMetricTitle(metricType)
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: this.getMetricYAxisLabel(metricType)
                        },
                        beginAtZero: metricType !== 'rpe'
                    }
                }
            }
        });
    }
    
    // Obtener título para el gráfico de métricas
    getMetricTitle(metricType) {
        switch (metricType) {
            case 'rm': return 'Evolución del RM Estimado';
            case 'volume': return 'Evolución del Volumen de Entrenamiento';
            case 'fatigue': return 'Evolución del Índice de Fatiga';
            case 'rpe': return 'Evolución del RPE Promedio';
            default: return '';
        }
    }
    
    // Obtener etiqueta del eje Y para el gráfico de métricas
    getMetricYAxisLabel(metricType) {
        switch (metricType) {
            case 'rm': return 'Peso (kg)';
            case 'volume': return 'Volumen Total (kg)';
            case 'fatigue': return 'Índice de Fatiga (%)';
            case 'rpe': return 'RPE (0-10)';
            default: return '';
        }
    }
    
    // Obtener nombre completo del tipo de entrenamiento
    getTrainingTypeName(code) {
        const types = {
            'PW': 'Powerlifting',
            'MC': 'Musculación',
            'WL': 'Weightlifting',
            'HT': 'Entrenamiento Híbrido',
            'CT': 'Crosstraining',
            'FT': 'Entrenamiento Funcional',
            'RS': 'Fuerza para Corredores'
        };
        
        return types[code] || code;
    }
    
    // Obtener clase de badge según nivel de fatiga
    getFatigueBadgeClass(fatigueLevel) {
        switch (fatigueLevel) {
            case 'high': return 'bg-danger';
            case 'medium': return 'bg-warning text-dark';
            case 'low': return 'bg-success';
            default: return 'bg-secondary';
        }
    }
    
    // Obtener clase de texto según índice de fatiga
    getFatigueTextClass(fatigueIndex) {
        if (fatigueIndex >= 15) return 'text-danger';
        if (fatigueIndex >= 7) return 'text-warning';
        return 'text-success';
    }
    
    // Capitalizar nivel de fatiga
    capitalizeFatigue(fatigue) {
        return fatigue.charAt(0).toUpperCase() + fatigue.slice(1);
    }
    
    // Actualizar la fecha en la pantalla
    updateDateDisplay() {
        const todayDate = document.getElementById('today-date');
        if (todayDate) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            todayDate.textContent = new Date().toLocaleDateString('es-ES', options);
        }
    }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const app = new AppController();
});

