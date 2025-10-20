# 99tech-test: Backend

## Prerequisites
- Docker and Docker Compose installed
- Node.js v18+
- npm v9+
- Run npm install to install dependencies `npm install`

## Setting up MongoDB for local development of Problem 5
- Create a `.env` file in the root directory following content from file `.env.example`:
- Run the MongoDB Docker container:
```bash
docker compose up -d
```
- To verify that MongoDB is running, you can use the following command:
```bash
docker compose ps
```
- To connect to MongoDB shell, you can use the following command:
```bash
docker exec -it 99tech_test_mongodb mongosh -u root -p example
```

## Problems
### Problem 4: Three ways to sum to n
Run the script `npm run p4` to see the result of problem 4.

### Problem 5: A Crud Server

### Problem 6: Architecture
