"use client"
import { useParams } from "next/navigation";
import { useState } from "react";
import ConceptsOverview from "./ConceptsOverview";
import QuizDemo from "./Quiz";

const Page = () => {
  const [gameMode, setGameMode] = useState("concepts-overview");
  const roomId = useParams().roomId;

  if (gameMode === "concepts-overview") {
    return <ConceptsOverview setGameMode={setGameMode} />;
  }
  if (gameMode === "quiz") {
    return <QuizDemo />;
  }
};

export default Page;
