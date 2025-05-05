"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Highlight utility component
export const Highlight = ({ children, className = "" }) => {
  return (
    <span
      className={`font-bold bg-[rgb(238,73,73)] text-white px-1 py-0.5 ${className}`}
    >
      {children}
    </span>
  );
};

// Main CardStack component
export const CardStack = ({ items, offset = 10, scaleFactor = 0.06 }) => {
  const [cards, setCards] = useState(items);

  useEffect(() => {
    // Auto-flip cards every 5 seconds
    const interval = setInterval(() => {
      setCards((prevCards) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()); // move the last element to the front
        return newArray;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-12 m-auto relative h-52 w-[90%] md:h-52 md:w-[90%]">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute bg-gradient-to-b from-[#262626] to-[#0a0a0a]  h-52  w-full md:h-60 md:w-full rounded-3xl p-4 shadow-xl border border-[rgba(238,73,73,0.68)] flex flex-col justify-between "
          style={{
            transformOrigin: "top center",
          }}
          animate={{
            top: index * -offset,
            scale: 1 - index * scaleFactor,
            zIndex: cards.length - index,
          }}
        >
          <div className="font-normal text-[#f5f5f5] text-right">{card.content}</div>
          <div>
            <p className="text-neutral-500 font-medium">{card.name}</p>
            <p className="text-neutral-400 font-normal">{card.designation}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
