FROM  node:18 

WORKDIR  /usr/src/app 

COPY  package*.json ./ 

RUN  npm install\
 && npm install typescript -g 

COPY  . .

EXPOSE 3000

RUN tsc
 
CMD ["node", "dist/index.js"]