import "./coordinates.css";
const Coordinates: React.FC = () => {
  return (
    <svg viewBox="0 0 100 100" className="coordinates">
      <text x="0.75" y="3.5" font-size="2.8" className="coordinate-light">
        1
      </text>
      <text x="0.75" y="15.75" font-size="2.8" className="coordinate-dark">
        2
      </text>
      <text x="0.75" y="28.25" font-size="2.8" className="coordinate-light">
        3
      </text>
      <text x="0.75" y="40.75" font-size="2.8" className="coordinate-dark">
        4
      </text>
      <text x="0.75" y="53.25" font-size="2.8" className="coordinate-light">
        5
      </text>
      <text x="0.75" y="65.75" font-size="2.8" className="coordinate-dark">
        6
      </text>
      <text x="0.75" y="78.25" font-size="2.8" className="coordinate-light">
        7
      </text>
      <text x="0.75" y="90.75" font-size="2.8" className="coordinate-dark">
        8
      </text>
      <text x="10" y="99" font-size="2.8" className="coordinate-dark">
        h
      </text>
      <text x="22.5" y="99" font-size="2.8" className="coordinate-light">
        g
      </text>
      <text x="35" y="99" font-size="2.8" className="coordinate-dark">
        f
      </text>
      <text x="47.5" y="99" font-size="2.8" className="coordinate-light">
        e
      </text>
      <text x="60" y="99" font-size="2.8" className="coordinate-dark">
        d
      </text>
      <text x="72.5" y="99" font-size="2.8" className="coordinate-light">
        c
      </text>
      <text x="85" y="99" font-size="2.8" className="coordinate-dark">
        b
      </text>
      <text x="97.5" y="99" font-size="2.8" className="coordinate-light">
        a
      </text>
    </svg>
  );
};

export default Coordinates;
