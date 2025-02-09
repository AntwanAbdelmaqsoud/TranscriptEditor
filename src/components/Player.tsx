import { useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/utils";
import transcript from "../types/transcript.type";

const createSentences = (transNew: transcript[]) => {
  const sentencesArr: transcript[] = [];
  let currWord = "";
  let wordCount = 0,
    st = 0,
    et = 0;
  for (let index = 0; index < transNew.length; index++) {
    if (
      transNew[index].word.endsWith(".") ||
      transNew[index].word.endsWith(",") ||
      wordCount == 5 ||
      index == transNew.length - 1
    ) {
      currWord += transNew[index].word;
      et += transNew[index].et - transNew[index].st;
      sentencesArr.push({
        st,
        et,
        word: currWord,
      });
      st = et;
      currWord = "";
      wordCount = 0;
    } else {
      et += transNew[index].et - transNew[index].st;
      if (transNew[index].word !== " " && transNew[index].word !== "•") {
        wordCount++;
      }
      currWord += transNew[index].word;
    }
  }
  return sentencesArr;
};

export default function Player({
  totalTime,
  transNewTimes,
  currentTime,
  setcurrentTime,
}: {
  totalTime: number;
  transNewTimes: transcript[];
  currentTime: number;
  setcurrentTime: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sentences, setSentences] = useState(createSentences(transNewTimes));
  const intervalRef = useRef<null | number>(null);

  useEffect(() => {
    setSentences(createSentences(transNewTimes));
  }, [transNewTimes]);

  const handlePlayPause = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current!);
    } else {
      intervalRef.current = setInterval(() => {
        setcurrentTime((prev) => Math.min(prev + 100, totalTime)); // Increase time by 0.1s
      }, 100);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col w-full items-center p-2">
      <div>
        {
          sentences.find(
            (item) => currentTime >= item.st && currentTime < item.et
          )?.word
        }
      </div>
      <div className="bg-gray-200 flex items-center w-fit p-2 rounded-lg gap-3">
        {formatTime(currentTime)}
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        {formatTime(totalTime)}
      </div>
    </div>
  );
}
