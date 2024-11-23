import moment from 'moment';
import { prisma } from './Utils';

const types = [
  [60000 * 10, 0],
  [60000 * 5, 0],
];
console.log('matchMakingServer Running');

const main = () => {
  types.map(async (payload) => {
    try {
      let players = await prisma.watingplayer.findMany({
        where: {
          baseTime: payload[0],
          incrementTime: payload[1],
          matchId: -1,
        },
      });

      // console.info('select playerswaiting ->', players);

      for (let i = 0; i < Math.floor(players.length / 2) * 2; i += 2) {
        console.log('i -> ', i);
        const time = moment().toDate();
        console.info(players[i].isGuest, players[i + 1].isGuest, players[i].isGuest !== players[i + 1].isGuest);
        if (players[i].isGuest !== players[i + 1].isGuest) continue;

        let res = await prisma.match.create({
          data: {
            startedAt: time,
            whiteId: players[i].userId,
            blackId: players[i + 1].userId,
            baseTime: payload[0],
            incrementTime: payload[1],
            moves: [''],
            time: [time],
          },
        });
        console.info('inserted new math -> ', res);

        await prisma.watingplayer.update({
          where: {
            userId: res.whiteId,
          },
          data: {
            matchId: res.matchId,
          },
        });
        await prisma.watingplayer.update({
          where: {
            userId: res.blackId,
          },
          data: {
            matchId: res.matchId,
          },
        });

        // console.info('watingplayer update with live_match -> ', res.rows);
      }
    } catch (err) {
      console.info(err);
    }
  });
};

setInterval(main, 2000);
// test();
