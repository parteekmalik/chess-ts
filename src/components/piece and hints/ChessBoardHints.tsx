const squareSize: number = 50;

interface ChessBoardProps {
  Hints: { isShowHint: boolean; hints: { row: number; col: number }[] };
}
const ChessBoardHints: React.FC<ChessBoardProps> = (props) => {
  const { Hints } = props;
  const { hints} = Hints;
  const squares: JSX.Element[] = [];
  hints.forEach((square) => {
    const rowIndex = square.row;
    const colIndex = square.col;
    const position = `${rowIndex},${colIndex}`;
    const Style = {
      transform: `translate(${colIndex * squareSize}px, ${rowIndex * squareSize}px)`,
    };

    squares.push(<div key={position} className={`piece hint`} id={position} style={Style}></div>);
  });

  return <>{squares}</>;
};
export default ChessBoardHints;
