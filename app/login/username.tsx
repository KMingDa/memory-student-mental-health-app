// 3rd or 4th page, asking for username
import Image from "next/image";
import React, { useState } from "react";

// adjust your imports
import mainBg from "../../assets/images/mainbg.png";
import personSprite from "../../assets/images/person.png"; // your pixel person

export default function PixelPage() {
  const [name, setName] = useState("");

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background */}
      <Image
        src={mainBg}
        alt="Main Background"
        fill
        className="object-cover"
        priority
      />

      {/* Character + Bubble */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center">
        {/* Character Sprite */}
        <Image
          src={personSprite}
          alt="Pixel Character"
          width={120}
          height={120}
          className="pixelated"
        />

        {/* Speech Bubble */}
        <div className="mt-3 max-w-[200px] rounded-lg border-4 border-black bg-white px-4 py-2 text-center font-bold shadow-md">
          My name is {name ? name : "________"} !
        </div>
      </div>

      {/* Input (Keyboard at bottom) */}
      <div className="absolute bottom-0 w-full bg-gray-100 p-3">
        <input
          type="text"
          placeholder="Type your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border-2 border-gray-400 px-3 py-2 text-black focus:border-black focus:outline-none"
        />
      </div>
    </div>
  );
}
