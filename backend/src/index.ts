import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';

const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT || 3306);
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const database = process.env.DB_DATABASE;

async function main() {
    try {
        const connection = await mysql.createConnection({
            host, port, user, password, database
        });

        connection.query("CREATE TABLE IF NOT EXISTS todo (id INT NOT NULL AUTO_INCREMENT, description varchar(250) NOT NULL default '', done BOOLEAN NOT NULL default false, PRIMARY KEY (id))");

        const app = express();
        app.use(cors());

        app.get("/api/todo", async (req, res) => {
            try {
                const result = await connection.query('SELECT * FROM todo');
                const todos = result[0];
                res.json(todos);
            } catch (err) {
                res.status(500).send();
            }
        });

        app.put('/api/todo/:id/done', async (req, res) => {
            try {
                await connection.execute('UPDATE todo SET done=1 WHERE id=?', [req.params.id]);
                res.status(200).send();
            } catch (err) {
                res.status(500).send();
            }
        });

        app.post('/api/todo', async (req, res) => {
            try {
                await connection.execute('INSERT INTO todo (description) VALUES (?)', [req.query.description]);
                res.status(200).send();
            } catch (err) {
                res.status(400).send();
            }
        });

        app.listen(3000, () => console.log("Listening on port 3000 ..."));
    } catch (err) {
        console.error('Can not start server, error:', err);
    }
}

main();