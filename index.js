require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const path = require('path');
const db = require("./db/db");

// Configuração do Supabase (mantido apenas para referência local)
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

// Middlewares
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configurado para ambiente de produção e desenvolvimento
app.use(cors({ 
  credentials: true, 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000' 
}));

// Serve arquivos estáticos se necessário
app.use(express.static(path.join(__dirname, 'public')));

// Importação de rotas
const routes = [
  { path: '/api/admins', file: './routes/adminRoutes' },
  { path: '/api/alunos', file: './routes/alunoRoutes' },
  { path: '/api/cursos', file: './routes/cursoRoutes' },
  { path: '/api/disciplinas', file: './routes/disciplinaRoutes' },
  { path: '/api/diplomas', file: './routes/diplomaRoutes' },
  { path: '/api/professores', file: './routes/professorRoutes' },
  { path: '/api/materialeutensilios', file: './routes/materialEUtensilio' },
  { path: '/api/turnos', file: './routes/turnoRoutes' },
  { path: '/api/auth', file: './routes/authRoutes' },
  { path: '/api/registroacademico', file: './routes/registroAcademicoRoutes' },
  { path: '/api/financeiro', file: './routes/transacaoFinanceiraRoutes' },
  { path: '/api/pagamentos', file: './routes/pagamentoRoutes' },
  { path: '/api/contas', file: './routes/contaRoutes' }
];

// Carregamento dinâmico de rotas com tratamento de erro
routes.forEach(route => {
  try {
    app.use(route.path, require(route.file));
  } catch (err) {
    console.error(`Erro ao carregar rota ${route.path}:`, err);
  }
});

// Rota de health check
app.get('/api', (req, res) => {
  res.json({ 
    status: 'API funcionando',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Inicialização do servidor apenas em ambiente local
if (require.main === module) {
  db.sync()
    .then(() => {
      app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
      });
    })
    .catch(err => {
      console.error('Erro ao sincronizar banco de dados:', err);
    });
}

// Exportação para Vercel (formato correto)
module.exports = app;