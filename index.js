require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const router = express.Router();
const port = process.env.PORT || 3001;
const adminRoutes = require('./routes/adminRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const diplomaRoutes = require('./routes/diplomaRoutes');
const professorRoutes = require('./routes/professorRoutes');
const materialEUtensilioRoutes = require('./routes/materialEUtensilio');
const turnoRoutes = require('./routes/turnoRoutes');
const authRoutes = require('./routes/authRoutes');
const regsitroAcademicoRoutes = require('./routes/registroAcademicoRoutes');
const transacaoFinanceiraRoutes = require('./routes/transacaoFinanceiraRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const contaRoutes = require('./routes/contaRoutes');
const cors = require('cors');
const path = require('path');
const db = require("./db/db");

// Configuração do Supabase
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

const handler = app;

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

// Rotas
app.use('/api/admins', adminRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/diplomas', diplomaRoutes);
app.use('/api/professores', professorRoutes);
app.use('/api/materialeutensilios', materialEUtensilioRoutes);
app.use('/api/turnos', turnoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/registroacademico', regsitroAcademicoRoutes);
app.use('/api/financeiro', transacaoFinanceiraRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/contas', contaRoutes);

// Rota de teste
router.get('/', (req, res) => {
  res.send('API está funcionando corretamente');
});

// Sincronização do banco de dados
db.sync()
  .then(() => {
    console.log('Banco de dados sincronizado com sucesso');
    
    // Inicia o servidor apenas em desenvolvimento local
    if (process.env.NODE_ENV !== 'production') {
      app.listen(port, () => {
        console.log(`Servidor rodando localmente na porta ${port}`);
      });
    }
  })
  .catch(err => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });

// Exporta o app para a Vercel
module.exports = {
  handler,
  supabase
};