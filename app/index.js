const express = require('express');
const Firebird = require('node-firebird');
const dbConfig = require('../app/database/dbConfig');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  Firebird.attach(dbConfig, (err, db) => {
    if (err) {
      res.status(500).send('Erro ao conectar ao banco de dados: ' + err.message);
      return;
    }
    db.query(`select
    p.codigo,
    p.codigo_barra,
    p.descricao
    from produto p`, (err, result) => {
      if (err) {
        res.status(500).send('Erro ao executar consulta: ' + err.message);
      } else {
        res.json(result);
      }
      db.detach();
    });
  });
});


app.get('/produto/:id', (req, res) => {
    const produtoId = req.params.id; // Obtém o ID da URL
  
    Firebird.attach(dbConfig, (err, db) => {
      if (err) {
        res.status(500).send('Erro ao conectar ao banco de dados: ' + err.message);
        return;
      }

      db.query( `
        select
        p.codigo,
        p.codigo_barra,
        p.descricao,
        ep.estoque,
        pp.preco_venda
        from produto p
        left join estoque_produto ep on ep.codigo_produto = p.codigo
        left join produto_parametros pp on pp.codigo_produto = p.codigo
        where ep.codigo_produto = ${produtoId}`, (err, result) => {
        if (err) {
          res.status(500).send('Erro ao executar consulta: ' + err.message);
        } else {
          res.json(result);
        }
        db.detach();
      });
    });
  });

 


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});
