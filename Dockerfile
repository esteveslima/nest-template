# Application docker image build

FROM node:lts-alpine as nodeBuilderStage

WORKDIR /app

# Install all dependencies(skipped if package.json doesn't change)
COPY package.json .
RUN npm install 
    
# Copy remaining files and build project
COPY . .
RUN npm run build 

# # Remove unnecessary files and dependencies(disabled to simplify pipeline)
# RUN rm -rf src && \
#     npm uninstall --save-dev

EXPOSE 3000
CMD [ "npm", "start" ]