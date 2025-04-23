import Image from "next/image";
import Link from "next/link";

import { db } from "@acme/db";

const text = {
  hero: {
    title: "Play Chess",
    subtitle: "Online",
    tagline: "on the #1 Site!",
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
  return (
    <main className="m-auto flex grow flex-col items-center justify-center px-4 text-foreground">
      <div className="flex flex-col items-center justify-center lg:m-10 lg:flex-row">
        <Image className="m-4 hidden lg:m-10 lg:block" src="/images/board_img.png" alt="chess_board" width={400} height={400} />
        <div className="m-4 flex max-h-full min-w-[50%] grow flex-col items-center justify-center lg:m-10">
          <p className="mb-4 flex flex-col gap-2 text-center decoration-solid">
            <span className="text-4xl font-bold">{text.hero.title}</span>
            <span className="text-3xl">{text.hero.subtitle}</span>
            <span className="text-2xl">{text.hero.tagline}</span>
          </p>
          <div className="my-4 flex justify-center text-base sm:text-lg">
            <div className="ml-5 mr-5">{gamesToday} Games Today</div>
            <div className="ml-5 mr-5">{playingNow} Playing Now</div>
          </div>
          <div className="flex w-full flex-col gap-4 lg:gap-8">
            <Link href="/play/live" className="bg-success-200 flex cursor-pointer items-center rounded-2xl p-4 text-foreground">
              <Image
                className="mx-4 h-auto w-8 text-xs lg:mx-10 lg:w-12"
                src="https://www.chess.com/bundles/web/images/color-icons/playwhite.cea685ba.svg"
                alt="chess_comp_img"
                width={48}
                height={48}
              />
              <div className="text-background-foreground grow">
                <p className="mb-2 text-2xl font-bold">{text.playOnline.title}</p>
                <div className="mt-1 text-sm">{text.playOnline.description}</div>
              </div>
            </Link>
            <Link href="/play/computer" className="bg-background-500 flex cursor-pointer items-center rounded-2xl p-4">
              <Image
                className="mx-4 h-auto w-8 text-xs lg:mx-10 lg:w-12"
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

      <div className="flex flex-col items-center justify-center gap-4 lg:m-10 lg:flex-row lg:gap-10">
        <div className="flex flex-col items-center justify-center">
          <p className="mt-10 text-base sm:text-lg lg:mt-20 lg:text-lg">{text.lessons.title}</p>
          <Link href="/lessons" className="bg-background-500 text-background-foreground m-auto rounded-2xl p-4 text-base sm:text-lg">
            <p>{text.lessons.cta}</p>
          </Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row lg:gap-10">
            <Image
              className="aspect-square rounded-xl"
              src="https://www.chess.com/bundles/web/images/faces/hikaru-nakamura.e1ca9267.jpg"
              alt="hikaru_staring"
              width={237}
              height={237}
            />
            <div className="flex flex-col justify-center">
              <p className="mb-3 text-base">{text.testimonials.hikaru.quote}</p>
              <div className="text-lg">{text.testimonials.hikaru.author}</div>
            </div>
          </div>
        </div>
        <Image className="hidden lg:block" src="/images/board_img.png" alt="sample_puzzle_img" width={400} height={400} />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 lg:m-10 lg:flex-row lg:gap-10">
        <Image className="hidden lg:block" src="/images/board_img.png" alt="sample_puzzle_img" width={400} height={400} />
        <div className="flex flex-col items-center justify-center">
          <p className="mt-10 text-base sm:text-lg lg:mt-20 lg:text-lg">{text.lessons.title}</p>
          <Link href="/lessons" className="bg-background-500 text-background-foreground m-auto rounded-2xl p-4 text-base sm:text-lg">
            <p>{text.lessons.cta}</p>
          </Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row lg:gap-10">
            <Image
              className="aspect-square rounded-xl"
              src="https://www.chess.com/bundles/web/images/faces/anna-rudolf.193d08a5.jpg"
              alt="anna_Rudolf"
              width={237}
              height={237}
            />
            <div className="flex flex-col justify-center">
              <p className="mb-3 text-base">{text.testimonials.anna.quote}</p>
              <div className="text-lg">{text.testimonials.anna.author}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
