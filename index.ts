import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();

import { connectDatabase } from "./config/database";
import { routesApi } from "./routes/client/index.route";

connectDatabase();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json());

routesApi(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})