"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import logo from "../../public/favicon.png";

export default function Header() {
  return (
    <>
      <header className="w-full py-5 x:py-1 text-accent border-b border-border">
        <div className="px-4 xl:px-8 flex justify-between items-center w-full">
          {/* Logo + Title */}
          <Link href="/auth" className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={logo.src} />
              <AvatarFallback>HW</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl xl:text-4xl text-black/50 font-semibold">
              Handworks Cleaning Admin
            </h1>
          </Link>
        </div>
      </header>
    </>
  );
}
