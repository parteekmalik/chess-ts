const pieceSize: number = 50;

interface ChessBoardProps {
  BoardLayout: string[][];
}
 const ChessBoard: React.FC<ChessBoardProps> = props => {
  const {
    BoardLayout
  } = props;
  const pieces: JSX.Element[] = [];
  BoardLayout.forEach((row, rowIndex) => row.forEach((piece, colIndex) => {
    const position = `${rowIndex},${colIndex}`;
    const pieceStyle = {
      transform: `translate(${colIndex * pieceSize}px, ${rowIndex * pieceSize}px)`
    };

    if (piece !== "") {
      pieces.push(<div key={position} className={`piece ${piece}`} id={position} style={pieceStyle}></div>);
    }
  }));
  return <>{pieces}</>;
};
export default ChessBoard;