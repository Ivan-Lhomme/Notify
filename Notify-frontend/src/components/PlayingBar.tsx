import { useState } from "react";

export default function PlayingBar() {
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <div>
        <button>⏮️</button>
        <button>{playing ? "⏸️" : "▶️"}</button>
        <button>⏭️</button>
      </div>
      <div>
        <p>1:00</p>
        <div></div>
        <p>2:00</p>
      </div>
    </div>
  );
}
