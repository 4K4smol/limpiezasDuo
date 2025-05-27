import React from "react";
import { Card } from "@/components/ui/card";

const SkeletonCard = () => (
  <div className="animate-pulse">
    <Card className="h-48" />
  </div>
);

export default SkeletonCard;
