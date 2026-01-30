"use client"

import React from "react";
import { motion } from "framer-motion";
import { cn } from "./utils";

type CardProps = {
  className?: string;
  children: string | React.ReactNode;
  flip?: false | true;
  front?: React.ReactNode;
  back?: React.ReactNode;
};

const Card = ({ className, children, flip, front, back, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-(--bg-surface) border border-(--border-muted)/30 px-6 py-4 rounded-2xl shadow-md backdrop-blur-md",
        className
      )}
      {...props}
    >
      {
        flip ? 
          <div className={cn("relative h-60 perspective-1000", className)}>
            <motion.div
              className="relative w-full h-full"
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden">
                {front}
              </div>

              {/* Back */}
              <div className="absolute inset-0 rotate-y-180 backface-hidden">
                {back}
              </div>
            </motion.div>
          </div>
        : children
      }
    </div>
  );
};

export default Card;