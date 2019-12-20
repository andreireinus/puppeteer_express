FROM buildkite/puppeteer

WORKDIR /code
COPY . .

RUN ls -la && npm install 
ENTRYPOINT [ "node", "server.js" ]