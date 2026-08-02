# Fila Online

Sistema de fila para rodar no navegador, publicado pelo GitHub Pages e conectado ao Supabase Realtime.

## O que ja funciona

- Cadastro de pessoa na fila.
- Visualizacao do nome, posicao, quantidade de pessoas na frente e espera estimada.
- Area administrativa com PIN inicial `1234`.
- Chamada do proximo atendimento.
- Destaque verde quando a pessoa e chamada.
- Som de chamada.
- Notificacao do navegador quando permitida.
- Controle de tempo medio por pessoa.
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

O arquivo `supabase-schema.sql` contem as tabelas, permissoes, RLS e publicacao Realtime.

## Observacao importante

Esta etapa usa PIN administrativo no navegador para velocidade de validacao. Para uso em producao, a proxima melhoria deve ser login administrativo com Supabase Auth.
