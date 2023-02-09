# Application docker image build

FROM --platform=linux/amd64 node:lts-alpine as baseStage

WORKDIR /app

FROM baseStage as installDependenciesStage
COPY package.json .
COPY package-lock.json .
RUN npm install-clean --legacy-peer-deps
COPY . .

FROM installDependenciesStage as testStage
RUN [ "npm", "run", "test" ]

FROM testStage as buildStage
RUN npm run build && \
    rm -rf src && \    
    npm prune --production --legacy-peer-deps
EXPOSE 3000
CMD [ "node", "dist/main.js" ]
