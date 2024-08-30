

> [!NOTE]
> Diagrama ER: 
![mydb - development](https://github.com/user-attachments/assets/5bed29d3-89df-47dc-8729-69d4f87aa0d7)


## Installation

```bash
$ npm i
```

---------------

Precisa criar o arquivo no diretorio raiz => .env

```bash
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/mydb?schema=development"
```
---------------

> [!NOTE]
Como instalar o docker no windows:
https://github.com/wellysonlourenco/acadflow/blob/2f862d54d0379e34b54375d0c9798724cd7fa8dd/backend/instala%C3%A7%C3%A3o-docker-windows.txt

### Docker 
```bash
docker-compose up -d
```



### Init Prisma Orm
```java
$ npx prisma migrate dev
```


```bash
# development
$ npm run start

# watch mode
$ npm run dev

# production mode
$ npm run start:prod
```

> [!CAUTION]
> Running the app PORT 3333


Ferramentas utilizadas:
<div style = "display: inline">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg" width="50px"/>          
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-plain-wordmark.svg" width="50px"/> 
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" width="50px"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original-wordmark.svg" width="50px" />     
</div>
