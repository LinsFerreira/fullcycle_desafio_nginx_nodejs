const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

const config = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'nodedb'
};

// Nomes aleatórios para inserir a cada refresh
const sampleNames = ['Wescley', 'Luiz', 'Ana', 'Bruno', 'Carlos', 'Diana', 'Eduardo'];

async function initDB() {
  let connection;
  // Loop para esperar o MySQL estar pronto
  while (!connection) {
    try {
      connection = await mysql.createConnection(config);
    } catch (err) {
      console.log('Aguardando o banco de dados iniciar...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Cria a tabela se não existir
  await connection.query(`
    CREATE TABLE IF NOT EXISTS people (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
    );
  `);
  
  await connection.end();
  console.log('Banco de dados inicializado com sucesso.');
}

app.get('/', async (req, res) => {
  const connection = await mysql.createConnection(config);
  
  // 1. Insere um nome aleatório na tabela
  const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
  await connection.query('INSERT INTO people(name) VALUES(?)', [randomName]);

  // 2. Consulta todos os nomes cadastrados
  const [rows] = await connection.query('SELECT name FROM people');
  await connection.end();

  // 3. Monta a resposta HTML
  let html = '<h1>Full Cycle Rocks!</h1>\n<ul>';
  for (const person of rows) {
    html += `<li>- ${person.name}</li>\n`;
  }
  html += '</ul>';

  res.send(html);
});

// Inicializa o banco e depois roda o servidor
initDB().then(() => {
  app.listen(port, () => {
    console.log(`Aplicação rodando na porta ${port}`);
  });
});

