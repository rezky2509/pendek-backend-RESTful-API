<!-- Step 1: TO create as one excetuble file -->
bun build --target=bun --production --outdir=dist ./src/index.ts


<!-- To build as single excetubale file -->
bun build --compile

<!-- 2. create the docker file  -->
FROM oven/bun:1.1-distorless

WORKDIR /app

# Copy the bundled file (distribution file (single file ))
COPY ./dist/index.js .

USER bun
# use the default 3000 port 
EXPOSE 3000

# the run bundle ()
ENTRYPOINT [ "bun","run","index.js" ]


<!-- 3. login to docker from CLI  -->
docker login
