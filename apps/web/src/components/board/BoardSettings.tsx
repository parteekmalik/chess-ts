import type { ChessMoveType } from '@acme/lib';
import { Button } from '@acme/ui/button';
import type { Chess, Color, Square } from 'chess.js';
import _ from 'lodash';
import React from 'react';

interface BoardSettingsProps {
	setSelectedPiece: React.Dispatch<React.SetStateAction<Square | null>>;
	game: Chess;
	setGame: React.Dispatch<React.SetStateAction<Chess>>;
	movesUndone: ChessMoveType[];
	setMovesUndone: React.Dispatch<React.SetStateAction<ChessMoveType[]>>;
	setFlip: React.Dispatch<React.SetStateAction<Color>>
}

export function BoardSettings(props: BoardSettingsProps) {
	const { setSelectedPiece, game, setMovesUndone, setGame, movesUndone, setFlip } = props;
	return (
		<div className="flex w-full gap-1 p-2 px-0">
			<Button
				className="flex-1 text-xl text-foreground"
				onClick={() => {
					setSelectedPiece(null);
					if (game.history().length > 0) {
						const move = game.history()[game.history().length - 1]!;
						setMovesUndone((moves) => [...moves, move]);
						game.undo();
						setGame(_.cloneDeep(game));
					}
				}}
			>
				Back
			</Button>
			<Button
				className="flex-1 text-xl text-foreground"
				onClick={() => {
					setSelectedPiece(null);
					if (movesUndone.length) {
						const move = movesUndone.pop()!;
						game.move(move);
						setMovesUndone(movesUndone);
						setGame(_.cloneDeep(game));
					}
				}}
			>
				Next
			</Button>
			<Button
				className="text-xl text-foreground"
				onClick={() => {
					setFlip((flip) => (flip === "w" ? "b" : "w"));
				}}
			>
				Flip
			</Button>
		</div>
	)
}
