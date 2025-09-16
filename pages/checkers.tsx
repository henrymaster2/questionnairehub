import React, { useState } from "react";
import { motion } from "framer-motion";

type Player = "BLACK" | "WHITE";
type Piece = { id: string; color: Player; king: boolean };
type Square = { r: number; c: number; piece?: Piece | null };

const isDark = (r: number, c: number) => (r + c) % 2 === 1;

function initialBoard(): Square[][] {
  const board: Square[][] = [];
  for (let r = 0; r < 8; r++) {
    const row: Square[] = [];
    for (let c = 0; c < 8; c++) row.push({ r, c, piece: null });
    board.push(row);
  }
  let id = 0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1)
        board[r][c].piece = { id: `W${id++}`, color: "WHITE", king: false };
    }
  }
  id = 0;
  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1)
        board[r][c].piece = { id: `B${id++}`, color: "BLACK", king: false };
    }
  }
  return board;
}

export default function ClassicCheckers() {
  const [board] = useState<Square[][]>(initialBoard());

  function pieceStyle(color: Player): React.CSSProperties {
    const base = color === "BLACK" ? "#222" : "#eee";
    const inner = color === "BLACK" ? "#444" : "#ddd";
    return {
      background: base,
      borderRadius: "50%",
      border: `2px solid ${inner}`,
      boxShadow: "0 3px 6px rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    };
  }

  // concentric rings effect using ::before overlay
  function RingOverlay() {
    return (
      <div className="absolute inset-0 rounded-full flex items-center justify-center">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: `${90 - i * 20}%`,
              height: `${90 - i * 20}%`,
              borderColor: "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[rgb(90,60,40)]">
      <div className="grid grid-cols-8 grid-rows-8 shadow-2xl border-8 border-[rgb(60,40,20)]">
        {board.map((row, r) =>
          row.map((sq, c) => {
            const dark = isDark(r, c);
            return (
              <div
                key={`${r}-${c}`}
                className={`relative w-20 h-20 flex items-center justify-center ${
                  dark ? "bg-[rgb(120,76,46)]" : "bg-[rgb(230,206,174)]"
                }`}
              >
                {sq.piece && (
                  <motion.div
                    layoutId={sq.piece.id}
                    className="w-[70%] h-[70%] relative"
                    style={pieceStyle(sq.piece.color)}
                  >
                    <RingOverlay />
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
