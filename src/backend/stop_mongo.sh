#!/bin/bash

# Carregar variáveis de ambiente do arquivo .env
set -a
source <(grep -E '^[A-Z_][A-Z0-9_]*=.*$' .env)
set +a

# Verificar se as variáveis de ambiente necessárias estão definidas
if [ -z "$DB_NAME" ] || [ -z "$DB_PORT" ]; then
    echo "Erro: DB_NAME ou DB_PORT não estão definidos no arquivo .env"
    exit 1
fi

# Tentar parar o contêiner Docker 'mongo-${DB_NAME}' normalmente
docker stop mongo-${DB_NAME}

# Verificar se o comando foi bem-sucedido
if [ $? -eq 0 ]; then
  echo "Contêiner 'mongo-${DB_NAME}' parado com sucesso."
else
  echo "Falha ao parar o contêiner 'mongo-${DB_NAME}' normalmente. Tentando com sudo..."
  # Tentar parar o contêiner Docker 'mongo-${DB_NAME}' usando sudo
  sudo docker stop mongo-${DB_NAME}
  if [ $? -eq 0 ]; then
    echo "Contêiner 'mongo-${DB_NAME}' parado com sucesso usando sudo."
  else
    echo "Falha ao parar o contêiner 'mongo-${DB_NAME}' usando sudo."
  fi
fi