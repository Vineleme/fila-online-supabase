# Fila Online

Sistema de fila para rodar no navegador, publicado pelo GitHub Pages e conectado ao Supabase Realtime.

## O que já funciona

- Cadastro de pessoa na fila.
- Visualização do nome, posição, quantidade de pessoas na frente e espera estimada.
- Área administrativa com PIN inicial `1234`.
- Chamada do próximo atendimento.
- Destaque verde quando a pessoa é chamada.
- Som de chamada.
- Notificação do navegador quando permitida.
- Controle de tempo médio por pessoa.
- Finalizar, remover e limpar fila.
- Dados compartilhados entre celulares/computadores pelo Supabase.

## Como testar

Abra `index.html` no navegador ou rode um servidor local dentro desta pasta:

```bash
python -m http.server 5173
```

Depois acesse `http://localhost:5173`.

## Supabase

O banco usa o projeto Supabase `fila-online-supabase`.

O arquivo `supabase-schema.sql` contém as tabelas, permissões, RLS e publicação Realtime.

## Observação importante

Esta etapa usa PIN administrativo no navegador para velocidade de validação. Para uso em produção, a próxima melhoria deve ser login administrativo com Supabase Auth.
