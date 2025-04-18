const express = require('express');
const { Client } = require('pg');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para ler JSON
app.use(express.json());

// Servir HTML e arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com PostgreSQL
const client = new Client({
  connectionString: 'postgresql://postgres:progtec@2012@db.jqdtdzcfecawhctswctb.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL!'))
  .catch(err => console.error('Erro ao conectar:', err));

// 📋 Listar produtos
app.get('/produtos', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM estoque ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Erro ao listar produtos');
  }
});

// ➕ Inserir produto
app.post('/produtos', async (req, res) => {
  const { id, produto, valor, qtd } = req.body;
  const total = valor * qtd;
  try {
    await client.query(
      'INSERT INTO estoque (id, produto, valor, qtd, total) VALUES ($1, $2, $3, $4, $5)',
      [id, produto, valor, qtd, total]
    );
    res.send('Produto inserido!');
  } catch (err) {
    res.status(500).send('Erro ao inserir produto');
  }
});

// ✏️ Atualizar produto
app.put('/produtos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { produto, valor, qtd } = req.body;
  const total = valor * qtd;
  try {
    await client.query(
      'UPDATE estoque SET produto = $1, valor = $2, qtd = $3, total = $4 WHERE id = $5',
      [produto, valor, qtd, total, id]
    );
    res.send('Produto atualizado!');
  } catch (err) {
    res.status(500).send('Erro ao atualizar produto');
  }
});

// 🗑️ Deletar produto
app.delete('/produtos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await client.query('DELETE FROM estoque WHERE id = $1', [id]);
    res.send('Produto deletado!');
  } catch (err) {
    res.status(500).send('Erro ao deletar produto');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
