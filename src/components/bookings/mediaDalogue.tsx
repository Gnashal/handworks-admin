"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BookingMediaDialogProps {
  photos: string[];
}

export function BookingMediaDialog({ photos }: BookingMediaDialogProps) {
  const [index, setIndex] = useState(0);
  const hasPhotos = photos && photos.length > 0;

  if (!hasPhotos) {
    return null;
  }

  const prev = () => {
    setIndex((curr) => (curr === 0 ? photos.length - 1 : curr - 1));
  };

  const next = () => {
    setIndex((curr) => (curr === photos.length - 1 ? 0 : curr + 1));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Show media uploads
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Media uploads</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={photos[index]}
              alt={`Booking photo ${index + 1}`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 640px, 100vw"
            />
          </div>
          {photos.length > 1 && (
            <div className="flex items-center justify-between gap-3">
              <Button variant="outline" size="icon" onClick={prev}>
                <ArrowLeft />
              </Button>
              <div className="flex flex-1 justify-center gap-2 overflow-x-auto">
                {photos.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setIndex(idx)}
                    className={`relative h-14 w-20 flex-none overflow-hidden rounded-md border ${
                      idx === index ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
              <Button variant="outline" size="icon" onClick={next}>
                <ArrowRight />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
