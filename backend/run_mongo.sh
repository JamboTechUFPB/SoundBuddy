#!/bin/bash

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

# Verificar se o contêiner 'mongo-${DB_NAME}' existe
if [ "$(docker ps -a -q --filter name=^/mongo-${DB_NAME}$)" ]; then
  echo "Contêiner 'mongo-${DB_NAME}' já existe. Tentando iniciar..."

  # Tentar iniciar o contêiner Docker 'mongo-${DB_NAME}' normalmente
  docker start mongo-${DB_NAME}

  # Verificar se o comando foi bem-sucedido
  if [ $? -eq 0 ]; then
    echo "Contêiner 'mongo-${DB_NAME}' iniciado com sucesso."
  else
    echo "Falha ao iniciar o contêiner 'mongo-${DB_NAME}' normalmente. Tentando com sudo..."
    # Tentar iniciar o contêiner Docker 'mongo-${DB_NAME}' usando sudo
    sudo docker start mongo-${DB_NAME}
    if [ $? -eq 0 ]; then
      echo "Contêiner 'mongo-${DB_NAME}' iniciado com sucesso usando sudo."
    else
      echo "Falha ao iniciar o contêiner 'mongo-${DB_NAME}' usando sudo."
    fi
  fi
else
  echo "Contêiner 'mongo-${DB_NAME}' não existe. Criando e iniciando..."

  # Executar o contêiner MongoDB
  docker run -d \
    --name mongo-${DB_NAME} \
    -p ${DB_PORT}:27017 \
    -v $(pwd)/mongo-data:/data/db \
    mongo \
    mongod --logpath /dev/null --logappend --quiet

  # Verificar se o contêiner foi iniciado com sucesso
  if [ $? -eq 0 ]; then
    echo "Contêiner MongoDB iniciado com sucesso na porta ${DB_PORT}."
  else
    echo "Falha ao iniciar o contêiner MongoDB."
    # Executar o contêiner MongoDB usando sudo
    sudo docker run -d \
      --name mongo-${DB_NAME} \
      -p ${DB_PORT}:27017 \
      -v $(pwd)/mongo-data:/data/db \
      mongo \
      mongod --logpath /dev/null --logappend --quiet
    if [ $? -eq 0 ]; then
      echo "Contêiner MongoDB iniciado com sucesso na porta ${DB_PORT} usando sudo."
    else
      echo "Falha ao iniciar o contêiner MongoDB usando sudo."
    fi
  fi
fi