require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
// Middleware pour parser le JSON dans le corps des requêtes
app.use(express.json());

// Configuration de la connexion à la base de données PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bibliotech',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Route de bienvenue
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API BiblioTech !');
});

// ==========================================
// 1. Ajouter un livre (POST /livres)
// ==========================================
app.post('/livres', async (req, res) => {
  const { titre, auteur, categorie, annee_publication, disponible } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO livres (titre, auteur, categorie, annee_publication, disponible) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titre, auteur, categorie, annee_publication, disponible !== undefined ? disponible : true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du livre.' });
  }
});

// ==========================================
// 2. Afficher tous les livres (GET /livres)
// ==========================================
app.get('/livres', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM livres ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des livres.' });
  }
});

// ==========================================
// 3. Afficher un livre par ID (GET /livres/:id)
// ==========================================
app.get('/livres/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM livres WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Livre non trouvé.' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération du livre.' });
  }
});

// ==========================================
// 4. Modifier un livre (PUT /livres/:id)
// ==========================================
app.put('/livres/:id', async (req, res) => {
  const { id } = req.params;
  const { titre, auteur, categorie, annee_publication, disponible } = req.body;

  try {
    const result = await pool.query(
      `UPDATE livres 
       SET titre = $1, auteur = $2, categorie = $3, annee_publication = $4, disponible = $5 
       WHERE id = $6 RETURNING *`,
      [titre, auteur, categorie, annee_publication, disponible, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Livre non trouvé.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la modification du livre.' });
  }
});

// ==========================================
// 5. Supprimer un livre (DELETE /livres/:id)
// ==========================================
app.delete('/livres/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM livres WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Livre non trouvé.' });
    }

    res.json({ message: 'Livre supprimé avec succès.', livre_supprime: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression du livre.' });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur BiblioTech démarré avec succès sur http://localhost:${PORT}`);
});
