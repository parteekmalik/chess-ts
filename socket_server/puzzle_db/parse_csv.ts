import { Chess } from "chess.js";
import csv from "csv-parser";
import * as fs from "fs";

type CsvRow = {
    fen: string;
    moves: string[];
    rating: number;
    ratingDeviation: number;
    themes: string;
    openingTags: string;
};

const parseCsvFile = (filePath: string): Promise<Map<number, CsvRow>> => {
    return new Promise(async (resolve, reject) => {
        const resultsMap = new Map<number, CsvRow>();
        let count = 0;
        const rows: any[] = [];

        // First read all rows into memory
        await new Promise((resolveRead, rejectRead) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (data: any) => {
                    rows.push(data);
                    count++;
                    if (count % 10000 === 0) {
                        console.log(
                            `Processed puzzle ${count} of ${rows.length}`
                        );
                    }
                })
                .on("end", resolveRead)
                .on("error", rejectRead);
        });
        count = 0;
        console.log(`Loaded ${rows.length} rows, now processing...`);

        // Process rows in parallel using Promise.all
        const processRow = async (data: any, index: number) => {
            const rating = Number(data.Rating);
            
            // Skip if rating already exists in map
            if (resultsMap.has(rating)) {
                return;
            }

            const game = new Chess(data.FEN);
            data.Moves.split(" ").map((move: string) => {
                const payload = {
                    from: move.substring(0, 2),
                    to: move.substring(2, 4),
                    promotion: move[4],
                };
                game.move(payload);
            });

            const res = {
                moves: game.history(),
                fen: data.FEN,
                openingTags: data.OpeningTags.split(" "),
                themes: data.Themes.split(" "),
                rating: rating,
                ratingDeviation: Number(data.RatingDeviation),
            };

            if (index % 1000 === 0) {
                console.log(
                    `Processed puzzle ${index} of ${rows.length} with rating ${res.rating} and map size ${resultsMap.size}`
                );
            }

            resultsMap.set(rating, res);
        };

        const batchSize = 1000;
        const batchPromises = [];
        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            const batchPromise = Promise.all(batch.map((data, index) => processRow(data, i + index)));
            batchPromises.push(batchPromise);
        }
        await Promise.all(batchPromises);

        console.log("Final results map:", resultsMap);
        // Convert Map to object for JSON serialization
        const resultsObject = Object.fromEntries(resultsMap);
        // Write to JSON file
        fs.writeFileSync(
            "puzzles.json",
            JSON.stringify(resultsObject, null, 2)
        );
        console.log("Data written to puzzles.json");
        resolve(resultsMap);
    });
};

export const getData = async (
    csvFilePath: string
): Promise<Map<number, CsvRow>> => {
    try {
        const data = await parseCsvFile(csvFilePath);
        return data;
    } catch (error) {
        console.error("Error parsing CSV:", error);
        throw error;
    }
};

getData(
    "/home/hello/Public/project/chess-ts/chess-next/public/lichess_db_puzzle.csv"
);

// download using url  https://database.lichess.org/lichess_db_puzzle.csv.zst
// and then run this file
