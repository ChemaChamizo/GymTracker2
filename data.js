// Base de datos de ejercicios con clasificación
export const EXERCISES = [
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
    },
    {
        id: 'good-morning',
        name: 'Good Morning',
        categories: ['PW', 'MC', 'HT'],
        fatigue: 'medium',
        muscles: ['hamstrings', 'glutes', 'lower_back']
    },
    {
        id: 'incline-bench-press',
        name: 'Incline Bench Press',
        categories: ['MC', 'HT'],
        fatigue: 'medium',
        muscles: ['chest', 'triceps', 'shoulders']
    },
    {
        id: 'dips',
        name: 'Dips',
        categories: ['MC', 'HT', 'FT'],
        fatigue: 'medium',
        muscles: ['chest', 'triceps', 'shoulders']
    },
    {
        id: 'seated-row',
        name: 'Seated Row',
        categories: ['MC', 'HT'],
        fatigue: 'low',
        muscles: ['lats', 'rhomboids', 'biceps']
    },
    {
        id: 'walking-lunge',
        name: 'Walking Lunge',
        categories: ['MC', 'FT', 'RS'],
        fatigue: 'medium',
        muscles: ['quadriceps', 'glutes', 'hamstrings']
    },
    {
        id: 'chin-up',
        name: 'Chin-up',
        categories: ['MC', 'CT', 'FT'],
        fatigue: 'medium',
        muscles: ['lats', 'biceps', 'forearms']
    },
    {
        id: 'clean-and-jerk',
        name: 'Clean and Jerk',
        categories: ['WL', 'CT', 'HT'],
        fatigue: 'high',
        muscles: ['quadriceps', 'glutes', 'shoulders', 'triceps', 'traps']
    },
    {
        id: 'power-clean',
        name: 'Power Clean',
        categories: ['WL', 'CT', 'HT', 'PW'],
        fatigue: 'high',
        muscles: ['quadriceps', 'glutes', 'traps', 'shoulders']
    },
    {
        id: 'goblet-squat',
        name: 'Goblet Squat',
        categories: ['MC', 'FT', 'RS'],
        fatigue: 'medium',
        muscles: ['quadriceps', 'glutes', 'upper_back']
    },
    {
        id: 'calf-raise',
        name: 'Calf Raise',
        categories: ['MC', 'RS'],
        fatigue: 'low',
        muscles: ['calves']
    }
];

// Fórmulas y funciones de cálculo para RM y fatiga
export function calculateRM(weight, reps, rpe) {
    // Versión mejorada de la fórmula de Epley con ajuste por RPE
    const rpeAdjustment = getRPEAdjustment(rpe);
    return (weight * (1 + 0.0333 * reps)) / rpeAdjustment;
}

export function getRPEAdjustment(rpe) {
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

export function calculateFatigueIndex(initialRM, finalRM) {
    // Índice de fatiga por serie
    return Math.round(((initialRM - finalRM) / initialRM) * 100);
}

export function calculateTotalFatigue(exercises) {
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

