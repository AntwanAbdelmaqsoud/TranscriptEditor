import transcript from "../types/transcript.type";
import { formatTime } from "../utils/utils";

const TranscriptViewer = ({
  newTrans,
  setisSelected,
  currentTime,
  isDeleted,
}: {
  newTrans: transcript[];
  isDeleted: boolean[];
  currentTime: number;
  setisSelected: React.Dispatch<React.SetStateAction<boolean[]>>;
}) => {
  const getWordClass = (st: number, et: number) => {
    return currentTime >= st && currentTime < et
      ? "text-blue-500 bg-blue-300"
      : "";
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-lg">
      {newTrans.map((item, index) => {
        if (!isDeleted[index] && item.word != " ")
          return (
            <div
              key={index}
              className={`flex items-center gap-1 p-1 rounded-lg ${getWordClass(
                item.st,
                item.et
              )}`}
              onClick={() =>
                setisSelected((prev) => {
                  const newArr = [...prev];
                  newArr[index] = !prev[index];
                  return newArr;
                })
              }
            >
              {/* Time Indicator */}
              <span className="text-xs text-gray-500">
                {formatTime(item.st)} - {formatTime(item.et)}
              </span>

              {/* Word */}
              <div className={`px-2 py-1 rounded text-blue-800`}>
                {item.word}
              </div>
            </div>
          );
      })}
    </div>
  );
};

export default TranscriptViewer;
