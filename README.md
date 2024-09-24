
# Job Search Log

A simple application that helped me track my job hunt progress

**Technologies:** `TypeScript`, `Next.JS`, `React.JS`, `Prisma`, `Puppeteer`, `MUI`

Application has a list view with main info about jobs, and a simple filter:

![Table view](/assets/table.jpg)


Creating a job is implemented with a simple form where you can enter data manually, or autofill the fields with data fetched from the provided link (scraping link data with puppeteer):

![Create new entry](/assets/add.jpg)

When job is created, you can add comments to id and change its status:

![Create new entry](/assets/details.jpg)

## Running in development

### .env file

```
DATABASE_URL=<database url for prisma>
```

First, run the development server:

```bash
npm i

npm run prisma:generate

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker

Project contains `.Dockerfile` and `docker-compose.yml` and can be run inside docker via 

```
docker-compose up
```