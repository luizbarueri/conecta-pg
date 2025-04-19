const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:progtec@2012@db.jqdtdzcfecawhctswctb.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

client.connect();

module.exports = async (req, res) => {
  const method = req.method;

  if (method === 'GET') {
    try {
      const result = await client.query('SELECT * FROM estoque ORDER BY id');
      return res.status(200).json(result.rows);
    } catch (err) {
      return res.status(500).send('Erro ao listar produtos');
    }
  }

  if (method === 'POST') {
    const { id, produto, valor, qtd } = req.body;
    const total = valor * qtd;
    try {
      await client.query(
        'INSERT INTO estoque (id, produto, valor, qtd, total) VALUES ($1, $2, $3, $4, $5)',
        [id, produto, valor, qtd, total]
      );
      return res.status(201).send('Produto inserido!');
    } catch (err) {
      return res.status(500).send('Erro ao inserir produto');
    }
  }

  if (method === 'PUT') {
    const { id, produto, valor, qtd } = req.body;
    const total = valor * qtd;
    try {
      await client.query(
        'UPDATE estoque SET produto = $1, valor = $2, qtd = $3, total = $4 WHERE id = $5',
        [produto, valor, qtd, total, id]
      );
      return res.send('Produto atualizado!');
    } catch (err) {
      return res.status(500).send('Erro ao atualizar produto');
    }
  }

  if (method === 'DELETE') {
    const id = parseInt(req.query.id);
    try {
      await client.query('DELETE FROM estoque WHERE id = $1', [id]);
      return res.send('Produto deletado!');
    } catch (err) {
      return res.status(500).send('Erro ao deletar produto');
    }
  }

  res.status(405).send('Método não permitido');
};