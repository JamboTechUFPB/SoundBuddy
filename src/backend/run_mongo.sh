#!/bin/bash

#!/bin/bash

# Carregar variáveis de ambiente do arquivo .env
set -a
source <(grep -E '^[A-Z_][A-Z0-9_]*=.*$' .env)
set +a

# Verificar se o contêiner 'mongo-soundbuddy' existe
if [ "$(docker ps -a -q --filter name=^/mongo-soundbuddy$)" ]; then
  echo "Contêiner 'mongo-soundbuddy' já existe. Tentando iniciar..."

  # Tentar iniciar o contêiner Docker 'mongo-soundbuddy' normalmente
  docker start mongo-soundbuddy

  # Verificar se o comando foi bem-sucedido
  if [ $? -eq 0 ]; then
    echo "Contêiner 'mongo-soundbuddy' iniciado com sucesso."
  else
    echo "Falha ao iniciar o contêiner 'mongo-soundbuddy' normalmente. Tentando com sudo..."
    # Tentar iniciar o contêiner Docker 'mongo-soundbuddy' usando sudo
    sudo docker start mongo-soundbuddy
    if [ $? -eq 0 ]; then
      echo "Contêiner 'mongo-soundbuddy' iniciado com sucesso usando sudo."
    else
      echo "Falha ao iniciar o contêiner 'mongo-soundbuddy' usando sudo."
    fi
  fi
else
  echo "Contêiner 'mongo-soundbuddy' não existe. Criando e iniciando..."

  # Executar o contêiner MongoDB
  docker run -d \
    --name mongo-soundbuddy \
    -p 27020:27017 \
    -v $(pwd)/mongo-data:/data/db \
    mongo \
    mongod --logpath /dev/null --logappend --quiet

  # Verificar se o contêiner foi iniciado com sucesso
  if [ $? -eq 0 ]; then
    echo "Contêiner MongoDB iniciado com sucesso na porta 27020."
  else
    echo "Falha ao iniciar o contêiner MongoDB."
    # Executar o contêiner MongoDB usando sudo
    sudo docker run -d \
      --name mongo-soundbuddy \
      -p 27020:27017 \
      -v $(pwd)/mongo-data:/data/db \
      mongo \
      mongod --logpath /dev/null --logappend --quiet
    if [ $? -eq 0 ]; then
      echo "Contêiner MongoDB iniciado com sucesso na porta 27020 usando sudo."
    else
      echo "Falha ao iniciar o contêiner MongoDB usando sudo."
    fi
  fi
fi