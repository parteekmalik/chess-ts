const fs = require("fs");
const csvParser = require("csv-parser");
const path = require("path");

import { Pool } from "pg";
import { createQuerry, poolConfg } from "./Utils";

const pool = new Pool(poolConfg);
const Fdata: any[] = [];
console.log("data running -> ");
// pool.query("DROP TABLE puzzles;");
fs.createReadStream(path.join(__dirname, "../database/data.csv"))
    .pipe(csvParser())
    .on("data", async (data: any) => {
        var key,keys = Object.keys(data); //prettier-ignore
        var n = keys.length;
        var newdata: any = {};
        while (n--) {
            key = keys[n];
            if (["GameUrl", "NbPlays", "Popularity", "PuzzleId"].includes(key)) continue;
            let count = 0;
            function capitalizeFirstLetter(str: string): string {
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
            function toSnakeCase(str: string): string {
                const camelCase = str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
                return camelCase.charAt(0) === "_" ? camelCase.slice(1) : camelCase;
            }
            let newkey: string = toSnakeCase(capitalizeFirstLetter(key));
            if (key === "FEN") newkey = "fen";
            newdata[newkey] = data[key];
        }
        Fdata.push(newdata);
    })
    .on("end", async () => {
        console.log("done", Fdata.length);
        const n = Fdata.length;
        const batch = 10;
        for (let i = batch - 1; i >= 0; i--) {
            await find(n, (n * i) / batch, Fdata);
            console.log("completed -> ", i);
        }
    });
const find = async (n: number, to: number, Fdata: any[]) => {
    for (let i = n - 1; i > -1; i--) {
        const newdata = Fdata[i];
        // console.log(newdata);
        await pool.query(
            createQuerry("INSERT", "puzzles", newdata, undefined, false),
            Object.values(newdata).map((d) => {
                return d as string;
            })
        );
        Fdata.pop();
    }
};
