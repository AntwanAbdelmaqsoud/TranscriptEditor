import { useEffect, useState } from "react";
import transcript from "../types/transcript.type";

export default function TranscriptEditor({
  newTrans,
  isSelected,
  isDeleted,
  isCopied,
  setisSelected,
}: {
  newTrans: transcript[];
  isSelected: boolean[];
  isDeleted: boolean[];
  isCopied: boolean[];
  setisSelected: React.Dispatch<React.SetStateAction<boolean[]>>;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (idx: number) => {
    setIsDragging(true);
    toggleSelection(idx);
  };

  const handleMouseEnter = (idx: number) => {
    if (isDragging) {
      toggleSelection(idx);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const toggleSelection = (idx: number) => {
    setisSelected((prev) => {
      const newArr = [...prev];
      newArr[idx] = !prev[idx];
      return newArr;
    });
  };
  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  return (
    <p className="max-w-3xl text-lg border-r border-gray-300">
      {newTrans.map((transObj, idx) => {
        return (
          <span
            className={`${isSelected[idx] ? "bg-blue-200" : ""} ${
              isDeleted[idx] ? "line-through" : ""
            } ${isCopied[idx] ? " bg-blue-400" : ""} hover:bg-gray-300 `}
            onMouseDown={() => handleMouseDown(idx)}
            onMouseEnter={() => handleMouseEnter(idx)}
          >
            {transObj.word}
          </span>
        );
      })}
    </p>
  );
}
