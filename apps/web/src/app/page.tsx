import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";

import { db } from "@acme/db";
import { Card, CardContent } from "@acme/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@acme/ui/table";

import { UserCard } from "~/components/userCard";

const text = {
  hero: {
    title: "Play Chess Online on the #1 Site!",
  },
  playOnline: {
    title: "Play Online",
    description: "Play with someone with your Level",
  },
  playComputer: {
    title: "Play Computer",
    description: "Play vs Stockfish",
  },
  lessons: {
    title: "Take Chess Lessons",
    cta: "Start Lessons",
  },
  testimonials: {
    hikaru: {
      quote: "Puzzles are the best way to improve pattern recognition, and no site does it better.",
      author: "Hikaru Nakamura",
    },
    anna: {
      quote: "Chess.com lessons make it easy to learn to play, then challenge you to continue growing.",
      author: "Anna Rudolf",
    },
  },
};

export default async function Home() {
  const gamesToday = await db.match.count({ where: { startedAt: { gte: new Date(new Date().setDate(new Date().getDate() - 1)) } } });
  const playingNow = await db.matchResult.count({ where: { winner: "PLAYING" } });
  const matchesPlayed = await db.match.findMany({ take: 10, orderBy: { startedAt: "desc" }, include: { stats: true } });
  return (
    <main className="m-auto flex grow flex-col items-center justify-center space-y-10 px-1 dark:text-white">
      <div className="flex flex-col items-center justify-center lg:flex-row">
        <Image className="m-4 hidden lg:m-10 lg:block" src="/images/board_img.png" alt="chess_board" width={400} height={400} />
        <div className="m-4 flex max-h-full min-w-[50%] grow flex-col items-center justify-center lg:m-10">
          <p className="mb-4 text-center text-5xl font-bold decoration-solid">{text.hero.title}</p>
          <div className="my-4 flex justify-center text-base sm:text-lg">
            <div className="ml-5 mr-5">{gamesToday} Games Today</div>
            <div className="ml-5 mr-5">{playingNow} Playing Now</div>
          </div>
          <div className="flex w-full flex-col gap-4 lg:gap-8">
            <Link
              href="/play/live"
              className="mx-auto flex w-fit min-w-[400px] cursor-pointer items-center rounded-2xl bg-primary/80 p-4 px-0 text-foreground"
            >
              <Image
                className="mx-6 h-auto w-8 text-xs lg:w-12"
                src="https://www.chess.com/bundles/web/images/color-icons/playwhite.cea685ba.svg"
                alt="chess_comp_img"
                width={48}
                height={48}
              />
              <div className="grow text-white">
                <p className="mb-2 text-2xl font-bold">{text.playOnline.title}</p>
                <div className="mt-1 text-sm">{text.playOnline.description}</div>
              </div>
            </Link>
            <Link
              href="/play/computer"
              className="mx-auto flex w-fit min-w-[400px] cursor-pointer items-center rounded-2xl bg-foreground/10 p-4 px-0 dark:bg-white/10"
            >
              <Image
                className="mx-6 h-auto w-8 text-xs lg:w-12"
                src="https://www.chess.com/bundles/web/images/color-icons/cute-bot.32735490.svg"
                alt="chess_comp_img"
                width={48}
                height={48}
              />
              <div className="text-background-foreground grow">
                <p className="mb-2 text-2xl font-bold">{text.playComputer.title}</p>
                <div className="mt-1 text-sm">{text.playComputer.description}</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="flex lg:grid lg:grid-cols-2">
          <div className="flex h-full flex-col items-center">
            <div className="flex flex-1 flex-col justify-center gap-5">
              <p className="text-xl lg:text-4xl">{text.lessons.title}</p>
              <Link
                href="/lessons"
                className="text-background-foreground rounded-2xl bg-foreground/10 p-4 text-center text-base dark:bg-white/10 sm:text-lg"
              >
                <p>{text.lessons.cta}</p>
              </Link>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row lg:gap-10">
              <Image
                className="mx-auto aspect-square rounded-xl"
                src="https://www.chess.com/bundles/web/images/faces/hikaru-nakamura.e1ca9267.jpg"
                alt="hikaru_staring"
                width={237}
                height={237}
              />
              <div className="flex flex-col justify-center">
                <p className="mb-3 max-w-[500px] text-base">{text.testimonials.hikaru.quote}</p>
                <div className="text-lg">{text.testimonials.hikaru.author}</div>
              </div>
            </div>
          </div>
          <Image className="ml-auto hidden lg:block" src="/images/board_img.png" alt="sample_puzzle_img" width={400} height={400} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex lg:grid lg:grid-cols-2">
          <Image className="hidden lg:block" src="/images/board_img.png" alt="sample_puzzle_img" width={400} height={400} />
          <div className="flex h-full flex-col items-center">
            <div className="flex flex-1 flex-col justify-center gap-5">
              <p className="text-xl lg:text-4xl">{text.lessons.title}</p>
              <Link
                href="/lessons"
                className="text-background-foreground rounded-2xl bg-foreground/10 p-4 text-center text-base dark:bg-white/10 sm:text-lg"
              >
                <p>{text.lessons.cta}</p>
              </Link>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row lg:gap-10">
              <Image
                className="mx-auto aspect-square rounded-xl"
                src="https://www.chess.com/bundles/web/images/faces/anna-rudolf.193d08a5.jpg"
                alt="anna_Rudolf"
                width={237}
                height={237}
              />
              <div className="flex flex-col justify-center">
                <p className="mb-3 max-w-[500px] text-base">{text.testimonials.anna.quote}</p>
                <div className="text-lg">{text.testimonials.anna.author}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center gap-4 lg:flex-row lg:gap-10">
          <Table className="grow">
            <TableHeader>
              <TableRow>
                <TableHead>Started At</TableHead>
                <TableHead>White Player</TableHead>
                <TableHead>Black Player</TableHead>
                <TableHead>Winner</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchesPlayed.map((match) => {
                const { id, startedAt, whitePlayerId, blackPlayerId, stats } = match;

                return (
                  <TableRow key={id}>
                    <TableCell>
                      {formatDistance(new Date(startedAt), new Date(), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <UserCard minimal userId={whitePlayerId} />
                    </TableCell>
                    <TableCell>
                      <UserCard minimal userId={blackPlayerId} />
                    </TableCell>
                    <TableCell>{stats?.winner}</TableCell>
                    <TableCell>
                      <Link href={`/play/live/${id}`} className="text-sm font-medium underline">
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
