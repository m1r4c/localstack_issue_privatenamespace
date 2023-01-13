#!/bin/bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Tearing down docker-compose stack${NC}"
cd "${SCRIPT_DIR}" || exit
docker-compose down -v || exit

echo -e "${GREEN}Pulling latest version of localstack${NC}"
docker-compose pull || exit

echo -e "${GREEN}Creating docker-compose stack${NC}"
export DEBUG=1 && docker-compose up -d || exit

echo -e "${GREEN}Updating dependencies${NC}"
npm install || exit

echo -e "${GREEN}Setting up bootstrap${NC}"
npm run cdklocal bootstrap || exit

echo -e "${GREEN}Running deployment${NC}"
npm run cdklocal deploy deployment || exit
