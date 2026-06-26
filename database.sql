CREATE TABLE IF NOT EXISTS livres (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    annee_publication INTEGER,
    disponible BOOLEAN DEFAULT TRUE
);

-- Quelques données de test pour vérifier le bon fonctionnement
INSERT INTO livres (titre, auteur, categorie, annee_publication, disponible) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupéry', 'Jeunesse', 1943, true),
('1984', 'George Orwell', 'Romans', 1949, true),
('Sapiens', 'Yuval Noah Harari', 'Histoire', 2011, false),
('Clean Code', 'Robert C. Martin', 'Informatique', 2008, true);
