import fs from "fs";
import { Chess } from "chess.js";
import csv from "csv-parser";

interface CsvRow {
  fen: string;
  moves: string[];
  rating: number;
  ratingDeviation: number;
  themes: string[];
  openingTags: string[];
}

const parseCsvFile = async (filePath: string): Promise<Map<number, CsvRow>> => {
  const resultsMap = new Map<number, CsvRow>();
  let count = 0;
  const rows: CsvRow[] = [];

  // First read all rows into memory
  await new Promise((resolveRead, rejectRead) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: Record<string, unknown>) => {
        const newData = Object.entries(data).reduce((acc, [key, value]) => {
          if (key === "FEN") acc.fen = value as string;
          if (key === "OpeningTags") acc.openingTags = (value as string).split(" ");
          if (key === "Themes") acc.themes = (value as string).split(" ");
          if (key === "Moves") acc.moves = (value as string).split(" ");
          if (key === "Rating") acc.rating = Number(value);
          if (key === "RatingDeviation") acc.ratingDeviation = Number(value);

          return acc;
        }, {} as CsvRow);
        rows.push(newData);
        count++;
        if (count % 10000 === 0) {
          console.log(`Processed puzzle ${count} of ${rows.length}`);
        }
      })
      .on("end", resolveRead)
      .on("error", rejectRead);
  });
  count = 0;
  console.log(`Loaded ${rows.length} rows, now processing...`);

  // Process rows in parallel using Promise.all
  const processRow = (data: CsvRow, index: number) => {
    // Skip if rating already exists in map
    if (resultsMap.has(data.rating)) {
      return;
    }

    const game = new Chess(data.fen);
    data.moves.map((move: string) => {
      const payload = {
        from: move.substring(0, 2),
        to: move.substring(2, 4),
        promotion: move[4],
      };
      game.move(payload);
    });

    const res = {
      ...data,
      moves: game.history(),
    };

    if (index % 1000 === 0) {
      console.log(`Processed puzzle ${index} of ${rows.length} with rating ${res.rating} and map size ${resultsMap.size}`);
    }

    resultsMap.set(data.rating, res);
  };

  const batchSize = 1000;
  const batchPromises: unknown[] = [];
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
  fs.writeFileSync("puzzles.json", JSON.stringify(resultsObject, null, 2));
  console.log("Data written to puzzles.json");
  return resultsMap;
};

export const getData = async (csvFilePath: string): Promise<Map<number, CsvRow>> => {
  try {
    const data = await parseCsvFile(csvFilePath);
    return data;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    throw error;
  }
};

void getData("/home/hello/Public/project/chess-ts/chess-next/public/lichess_db_puzzle.csv");

// download using url  https://database.lichess.org/lichess_db_puzzle.csv.zst
// and then run this file
