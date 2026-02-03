"use client";
import React from "react";

const Loader = () => {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full border-blue-400 mx-auto animate-spin animation-duration-[2.5s]" />
        <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Fetching data</p>
      </div>
    </div>
  );
};

export default Loader;
