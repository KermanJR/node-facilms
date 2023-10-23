const express = require('express');
const Firebird = require('node-firebird');
const dbConfig = require('../app/database/dbConfig');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/produtos', (req, res) => {
  Firebird.attach(dbConfig, (err, db) => {
    if (err) {
      res.status(500).send('Erro ao conectar ao banco de dados: ' + err.message);
      return;
    }
    db.query(`select
    p.codigo,
    p.codigo_barra,
    p.descricao,
    ep.estoque,
    pp.preco_venda
    from produto p
    left join estoque_produto ep on ep.codigo_produto = p.codigo
    left join produto_parametros pp on pp.codigo_produto = p.codigo
    group by p.codigo,
    p.codigo_barra,
    p.descricao,
    ep.estoque,
    pp.preco_venda`, (err, result) => {
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
    const parametro = req.params.id;

  
    Firebird.attach(dbConfig, (err, db) => {
      if (err) {
        res.status(500).send('Erro ao conectar ao banco de dados: ' + err.message);
        return;
      }
  
      let query;
   
    query = `
      select
      p.codigo,
      p.codigo_barra,
      p.descricao,
      ep.estoque,
      pp.preco_venda
      from produto p
      left join estoque_produto ep on ep.codigo_produto = p.codigo
      left join produto_parametros pp on pp.codigo_produto = p.codigo
      where p.codigo_barra  = '${parametro}'
      group by p.codigo,
      p.codigo_barra,
      p.descricao,
      ep.estoque,
      pp.preco_venda`;

      console.log(query)
      db.query(query, (err, result) => {
        if (err) {
          res.status(500).send('Erro ao executar consulta: ' + err.message);
        } else {
          res.json(result);
        }
        db.detach();
      });
    });
  });

  app.get('/produto/buscar/:query', (req, res) => {
    let consulta = req.params.query;
    consulta = consulta.toUpperCase()

      let query = `
        select
        p.codigo,
        p.codigo_barra,
        p.descricao,
        ep.estoque,
        p.descricao,
        pp.preco_venda
        from produto p
        left join estoque_produto ep on ep.codigo_produto = p.codigo 
        left join produto_parametros pp on pp.codigo_produto = p.codigo
        where 
          p.descricao LIKE '%${consulta}%' 
        group by p.codigo,
        p.codigo_barra,
        p.descricao,
        ep.estoque,
        pp.preco_venda`;
    
        console.log(query)
    Firebird.attach(dbConfig, (err, db) => {
      if (err) {
        res.status(500).send('Erro ao conectar ao banco de dados: ' + err.message);
        return;
      }
  
      db.query(query, (err, result) => {
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
