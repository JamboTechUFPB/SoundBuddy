#!/bin/bash

# Tentar parar o contêiner Docker 'mongo-soundbuddy' normalmente
docker stop mongo-soundbuddy

# Verificar se o comando foi bem-sucedido
if [ $? -eq 0 ]; then
  echo "Contêiner 'mongo-soundbuddy' parado com sucesso."
else
  echo "Falha ao parar o contêiner 'mongo-soundbuddy' normalmente. Tentando com sudo..."
  # Tentar parar o contêiner Docker 'mongo-soundbuddy' usando sudo
  sudo docker stop mongo-soundbuddy
  if [ $? -eq 0 ]; then
    echo "Contêiner 'mongo-soundbuddy' parado com sucesso usando sudo."
  else
    echo "Falha ao parar o contêiner 'mongo-soundbuddy' usando sudo."
  fi
fi