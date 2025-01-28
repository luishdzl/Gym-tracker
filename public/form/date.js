app.post('/api/date', (req, res) => {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'La fecha es obligatoria' });
    }
  
    db.get('SELECT id FROM date WHERE date = ?', [date], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
  
      if (row) {
        // La fecha ya existe, devolver el ID
        return res.json({ id: row.id });
      } else {
        // Insertar la nueva fecha
        db.run(
          'INSERT INTO date (date) VALUES (?)',
          [date],
          function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
          }
        );
      }
    });
  });
  