const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./gymtracker.db', (err) => {
  if (err) console.error('Error al conectar con SQLite:', err.message);
  else console.log('Conectado a la base de datos SQLite');
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Crear tablas si no existen
db.serialize(() => {
  // Se agregaron nuevos campos: water_goal, sleep_goal y kcal_goal
  db.run(`
    CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER,
      weight REAL,
      height REAL,
      target_weight REAL,
      water_goal REAL,
      sleep_goal REAL,
      kcal_goal INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS date (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS kcal (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      calories INTEGER,
      date_id INTEGER UNIQUE,
      FOREIGN KEY (date_id) REFERENCES date(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sleep (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hours REAL,
      date_id INTEGER UNIQUE,
      FOREIGN KEY (date_id) REFERENCES date(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS water (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      liters REAL,
      date_id INTEGER UNIQUE,
      FOREIGN KEY (date_id) REFERENCES date(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS exercise_names (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER,
      weight REAL,
      reps INTEGER,
      sets INTEGER,
      rir INTEGER,
      date_id INTEGER,
      FOREIGN KEY (exercise_id) REFERENCES exercise_names(id) ON DELETE CASCADE,
      FOREIGN KEY (date_id) REFERENCES date(id) ON DELETE CASCADE
    )
  `);
});


// Rutas del usuario (actualizadas para incluir metas)

// Crear usuario con metas
app.post('/api/usuario', (req, res) => {
  const { name, age, weight, height, target_weight, water_goal, sleep_goal, kcal_goal } = req.body;

  if (!name || !age || !weight || !height || !target_weight || water_goal == null || sleep_goal == null || kcal_goal == null) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  db.run(
    `INSERT INTO usuario (name, age, weight, height, target_weight, water_goal, sleep_goal, kcal_goal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, age, weight, height, target_weight, water_goal, sleep_goal, kcal_goal],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Obtener el último usuario registrado
app.get('/api/usuario', (req, res) => {
  db.get('SELECT * FROM usuario ORDER BY id DESC LIMIT 1', [], (err, row) => {
    if (err) {
      console.error("Error en la consulta a la base de datos:", err);
      return res.status(500).json({ error: 'Error al acceder a la base de datos.' });
    }
    if (!row) {
      return res.status(404).json();
    }
    res.json(row);
  });
});

// Actualizar usuario (incluyendo metas)
app.put('/api/usuario', (req, res) => {
  const { id, name, age, weight, height, target_weight, water_goal, sleep_goal, kcal_goal } = req.body;

  if (!id || !name || !age || !weight || !height || !target_weight || water_goal == null || sleep_goal == null || kcal_goal == null) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  db.run(
    `UPDATE usuario SET name = ?, age = ?, weight = ?, height = ?, target_weight = ?, water_goal = ?, sleep_goal = ?, kcal_goal = ? WHERE id = ?`,
    [name, age, weight, height, target_weight, water_goal, sleep_goal, kcal_goal, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'Usuario actualizado' });
    }
  );
});

app.delete('/api/usuario', (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'El campo id es obligatorio' });
  }

  db.run(`DELETE FROM usuario WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Usuario eliminado' });
  });
});

// Rutas de ejercicios
app.post('/api/workouts', (req, res) => {
  const { date_id, exercise_id, weight, reps, sets, rir } = req.body;
  if (!date_id || !exercise_id || !weight || !reps || !sets || !rir) {  
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  db.run(
    `INSERT INTO workouts (date_id, exercise_id, weight, reps, sets, rir) VALUES (?, ?, ?, ?, ?, ?)`,
    [date_id, exercise_id, weight, reps, sets, rir],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.get('/api/workouts', (req, res) => {
  db.all(
    `SELECT workouts.id, workouts.date, exercise_names.name AS exercise, workouts.weight, workouts.reps, workouts.sets
     FROM workouts
     JOIN exercise_names ON workouts.exercise_id = exercise_names.id`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.put('/api/workouts/:id', (req, res) => {
  const { id } = req.params;
  const { weight, reps, sets } = req.body;

  db.run(
    `UPDATE workouts SET weight = ?, reps = ?, sets = ? WHERE id = ?`,
    [weight, reps, sets, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'Registro actualizado' });
    }
  );
});

app.delete('/api/workouts/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM workouts WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Registro eliminado' });
  });
});

app.get('/api/workouts/date/:date_id', (req, res) => {
  const { date_id } = req.params;

  db.all(
    `SELECT 
       workouts.id, 
       exercise_names.name AS exercise, 
       workouts.weight, 
       workouts.reps, 
       workouts.sets, 
       workouts.rir 
     FROM workouts
     JOIN exercise_names ON workouts.exercise_id = exercise_names.id
     WHERE workouts.date_id = ?`,
    [date_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Rutas para exercise_names

// Guardar un nuevo nombre de ejercicio
app.post('/api/exercise_names', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El campo "name" es obligatorio' });
  }

  db.run(
    `INSERT INTO exercise_names (name) VALUES (?)`,
    [name],
    function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({});
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, name });
    }
  );
});

// Obtener todos los nombres de ejercicios
app.get('/api/exercise_names', (req, res) => {
  db.all(`SELECT * FROM exercise_names`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Actualizar un nombre de ejercicio existente
app.put('/api/exercise_names/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El campo "name" es obligatorio' });
  }

  db.run(
    `UPDATE exercise_names SET name = ? WHERE id = ?`,
    [name, id],
    function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ error: 'El nombre del ejercicio ya existe' });
        }
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Ejercicio no encontrado' });
      }

      res.status(200).json({ message: 'Ejercicio actualizado', id, name });
    }
  );
});

// Eliminar un nombre de ejercicio
app.delete('/api/exercise_names/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM exercise_names WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Ejercicio no encontrado' });
    }

    res.status(200).json({ message: 'Ejercicio eliminado' });
  });
});

// Guardar o devolver ID de una fecha
app.post('/api/dates', (req, res) => {
  const { date } = req.body;

  if (!date) {
    return res.status(400).json({ error: 'El campo "date" es obligatorio' });
  }

  db.run(
    `INSERT INTO date (date) VALUES (?)`,
    [date],
    function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          // Si la fecha ya existe, obtenemos su ID
          db.get(
            `SELECT id FROM date WHERE date = ?`,
            [date],
            (err, row) => {
              if (err) return res.status(500).json({ error: err.message });
              res.json(row);
            }
          );
        } else {
          return res.status(500).json({ error: err.message });
        }
      } else {
        // Si la fecha fue insertada, devolvemos el nuevo ID
        res.json({ id: this.lastID });
      }
    }
  );
});

// Obtener ID y fecha según un enlace
app.get('/api/dates/:date', (req, res) => {
  const { date } = req.params;

  db.get(
    `SELECT id, date FROM date WHERE date = ?`,
    [date],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Fecha no encontrada' });
      res.json(row);
    }
  );
});

// Rutas "genéricas" para datos

// Calorías
app.get('/api/kcal/:date_id', (req, res) => {
  const { date_id } = req.params;

  db.get(
    `SELECT id, calories FROM kcal WHERE date_id = ?`,
    [date_id],
    (err, row) => {
      if (err) {
        console.error('Error al obtener calorías:', err);
        return res.status(500).json({ error: 'Error al acceder a la base de datos.' });
      }
      if (!row) {
        return res.status(404).json({ error: 'No se encontraron calorías para esta fecha.' });
      }
      res.json(row);
    }
  );
});

app.get('/api/kcal', (req, res) => {
  db.all(`SELECT * FROM kcal`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/kcal/date/:date_id', (req, res) => {
  const { date_id } = req.params;

  db.all(
    `SELECT kcal.id, kcal.calories FROM kcal WHERE kcal.date_id = ?`,
    [date_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.post('/api/kcal', (req, res) => {
  const { date_id, calories } = req.body;

  if (!date_id || calories == null) {
    return res.status(400).json({ error: 'El campo "date_id" y "calories" son obligatorios.' });
  }

  db.run(
    `
    INSERT INTO kcal (date_id, calories) 
    VALUES (?, ?)
    ON CONFLICT(date_id) 
    DO UPDATE SET calories = excluded.calories
    `,
    [date_id, calories],
    function (err) {
      if (err) {
        console.error('Error al guardar calorías:', err);
        return res.status(500).json({ error: 'Error al guardar las calorías.' });
      }
      res.status(200).json({ message: 'Calorías guardadas correctamente.' });
    }
  );
});

// Agua
app.get('/api/water/:date_id', (req, res) => {
  const { date_id } = req.params;

  db.get(
    `SELECT id, liters FROM water WHERE date_id = ?`,
    [date_id],
    (err, row) => {
      if (err) {
        console.error('Error al obtener agua:', err);
        return res.status(500).json({ error: 'Error al acceder a la base de datos.' });
      }
      if (!row) {
        return res.status(404).json({ error: 'No se encontraron litros para esta fecha.' });
      }
      res.json(row);
    }
  );
});

app.get('/api/water', (req, res) => {
  db.all(`SELECT * FROM water`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/water/date/:date_id', (req, res) => {
  const { date_id } = req.params;

  db.all(
    `SELECT water.id, water.liters FROM water WHERE water.date_id = ?`,
    [date_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.post('/api/water', (req, res) => {
  const { date_id, liters } = req.body;

  if (!date_id || liters == null) {
    return res.status(400).json({ error: 'El campo "date_id" y "litros" son obligatorios.' });
  }

  db.run(
    `
    INSERT INTO water (date_id, liters) 
    VALUES (?, ?)
    ON CONFLICT(date_id) 
    DO UPDATE SET liters = excluded.liters
    `,
    [date_id, liters],
    function (err) {
      if (err) {
        console.error('Error al guardar litros:', err);
        return res.status(500).json({ error: 'Error al guardar los litros.' });
      }
      res.status(200).json({ message: 'Litros guardados correctamente.' });
    }
  );
});

// Sueño
app.get('/api/sleep/:date_id', (req, res) => {
  const { date_id } = req.params;

  db.get(
    `SELECT id, hours FROM sleep WHERE date_id = ?`,
    [date_id],
    (err, row) => {
      if (err) {
        console.error('Error al obtener las horas:', err);
        return res.status(500).json({ error: 'Error al acceder a la base de datos.' });
      }
      if (!row) {
        return res.status(404).json({ error: 'No se encontraron horas de sueño para esta fecha.' });
      }
      res.json(row);
    }
  );
});

app.get('/api/sleep', (req, res) => {
  db.all(`SELECT * FROM sleep`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/sleep/date/:date_id', (req, res) => {
  const { date_id } = req.params;

  db.all(
    `SELECT sleep.id, sleep.hours FROM sleep WHERE sleep.date_id = ?`,
    [date_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.post('/api/sleep', (req, res) => {
  const { date_id, hours } = req.body;

  if (!date_id || hours == null) {
    return res.status(400).json({ error: 'El campo "date_id" y "hours" son obligatorios.' });
  }

  db.run(
    `
    INSERT INTO sleep (date_id, hours) 
    VALUES (?, ?)
    ON CONFLICT(date_id) 
    DO UPDATE SET hours = excluded.hours
    `,
    [date_id, hours],
    function (err) {
      if (err) {
        console.error('Error al guardar horas:', err);
        return res.status(500).json({ error: 'Error al guardar las horas.' });
      }
      res.status(200).json({ message: 'Horas guardadas correctamente.' });
    }
  );
});

// Nuevo endpoint de análisis diario
app.get('/api/analytics/daily/:date_id', (req, res) => {
  const { date_id } = req.params;

  // Asumimos que el usuario a analizar es el último registrado
  db.get('SELECT * FROM usuario ORDER BY id DESC LIMIT 1', [], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    db.get(`SELECT liters FROM water WHERE date_id = ?`, [date_id], (err, waterRow) => {
      if (err) return res.status(500).json({ error: err.message });
      db.get(`SELECT hours FROM sleep WHERE date_id = ?`, [date_id], (err, sleepRow) => {
        if (err) return res.status(500).json({ error: err.message });
        db.get(`SELECT calories FROM kcal WHERE date_id = ?`, [date_id], (err, kcalRow) => {
          if (err) return res.status(500).json({ error: err.message });

          // Si no existen registros, asumimos cero
          const water = waterRow ? waterRow.liters : 0;
          const sleep = sleepRow ? sleepRow.hours : 0;
          const kcal = kcalRow ? kcalRow.calories : 0;

          // Usamos las metas almacenadas en el usuario; en caso de no tenerlas se usan valores predeterminados
          const waterGoal = user.water_goal || 2;
          const sleepGoal = user.sleep_goal || 8;
          const kcalGoal = user.kcal_goal || 1500;

          const waterFeedback = water >= waterGoal
            ? "¡Excelente! Has alcanzado tu meta de agua."
            : `Te faltan ${(waterGoal - water).toFixed(1)} litros para cumplir tu meta.`;

          const sleepFeedback = sleep >= sleepGoal
            ? "¡Buen trabajo! Has cumplido tu meta de sueño."
            : `Te faltan ${(sleepGoal - sleep).toFixed(1)} horas de sueño.`;

          const kcalFeedback = kcal <= kcalGoal
            ? "Perfecto, tu consumo calórico está dentro del rango."
            : "Cuidado, has superado el consumo recomendado de calorías.";

          res.json({
            water: waterFeedback,
            sleep: sleepFeedback,
            kcal: kcalFeedback,
            waterValue: water,
            sleepValue: sleep,
            kcalValue: kcal
          });
        });
      });
    });
  });
});

// Nuevo endpoint para análisis de progreso avanzado
app.get('/api/analytics/progress', (req, res) => {
  // Se espera que se pase el parámetro "range" (day, week o month)
  const range = req.query.range || 'day';
  const today = new Date();
  let startDate;

  // Calcula la fecha de inicio según el rango solicitado
  if (range === 'day') {
    // Solo registros de hoy (formato YYYY-MM-DD)
    startDate = today.toISOString().slice(0, 10);
  } else if (range === 'week') {
    const past = new Date();
    past.setDate(today.getDate() - 7);
    startDate = past.toISOString().slice(0, 10);
  } else if (range === 'month') {
    const past = new Date();
    past.setDate(today.getDate() - 30);
    startDate = past.toISOString().slice(0, 10);
  } else {
    return res.status(400).json({ error: "El rango debe ser 'day', 'week' o 'month'" });
  }

  // Fecha de fin es hoy
  const endDate = today.toISOString().slice(0, 10);

  // Consulta SQL:
  // Se unen las tablas workouts, date y exercise_names para obtener la fecha y el nombre del ejercicio,
  // y se calculan algunos agregados (promedio de peso, total de repeticiones, total de series y promedio de RIR)
  const query = `
    SELECT d.date,
           e.name as exercise,
           AVG(w.weight) AS avgWeight,
           SUM(w.reps) AS totalReps,
           SUM(w.sets) AS totalSets,
           AVG(w.rir) AS avgRir
    FROM workouts w
    JOIN date d ON w.date_id = d.id
    JOIN exercise_names e ON w.exercise_id = e.id
    WHERE d.date BETWEEN ? AND ?
    GROUP BY d.date, w.exercise_id
    ORDER BY d.date ASC
  `;

  db.all(query, [startDate, endDate], (err, rows) => {
    if (err) {
      console.error("Error en la consulta de progreso:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


// Ruta raíz para servir el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware global para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal. Por favor, inténtalo más tarde.' });
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
