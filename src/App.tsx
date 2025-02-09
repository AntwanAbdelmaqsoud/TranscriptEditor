import { useEffect, useState } from "react";
import transFromFile from "../transcription";
import TranscriptViewer from "./components/TranscriptViewer";
import TranscriptEditor from "./components/TranscriptEditor";
import Player from "./components/Player";
import transcript from "./types/transcript.type";

function App() {
  const [currentTime, setcurrentTime] = useState(0);
  const [newTrans, setnewTrans] = useState(transFromFile); //transcript with deleted words and with times (st & end) for playback
  const [transNewTimes, setTransNewTimes] = useState(transFromFile); //transcript without deleted words and with times (st & end) for captions
  const [totalTime, setTotalTime] = useState(
    transFromFile.reduce((sum, item) => sum + (item.et - item.st), 0)
  );
  const [isDeleted, setisDeleted] = useState<boolean[]>(
    Array(newTrans.length).fill(false)
  );
  const [isSelected, setisSelected] = useState<boolean[]>(
    Array(newTrans.length).fill(false)
  );
  const [isCopied, setisCopied] = useState<boolean[]>(
    Array(newTrans.length).fill(false)
  );

  useEffect(() => {
    setTotalTime(() =>
      newTrans.reduce((sum, item, index) => {
        if (isDeleted[index]) return sum;
        return sum + (item.et - item.st);
      }, 0)
    );
    setTransNewTimes(() => {
      const newArr: transcript[] = [];
      let time = 0;
      for (let index = 0; index < newTrans.length; index++) {
        if (!isDeleted[index]) {
          newArr.push({
            st: time,
            et: time + (newTrans[index].et - newTrans[index].st),
            word: newTrans[index].word,
          });
          time += newTrans[index].et - newTrans[index].st;
        }
      }
      return newArr;
    });
  }, [isDeleted, newTrans]);
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <main className="bg-white shadow-lg rounded-lg p-6">
        <header className="border-b border-gray-300 mb-4 p-2">
          <h1 className="text-2xl font-bold mb-4">Transcript</h1>
          <div className="flex items-center justify-between m-2">
            <div className="flex gap-2">
              <button
                className="bg-red-800 p-2 rounded-2xl text-white font-semibold border border-black hover:bg-red-700 cursor-pointer"
                onClick={() => {
                  setisDeleted((prev) => {
                    const newDeletedArr = Array(newTrans.length);
                    for (let index = 0; index < newTrans.length; index++) {
                      newDeletedArr[index] = isSelected[index] || prev[index];
                    }
                    return newDeletedArr;
                  });
                  setisSelected(Array(newTrans.length).fill(false));
                }}
              >
                Delete Selected
              </button>
              <button
                className="bg-green-800 p-2 rounded-2xl text-white font-semibold border border-black hover:bg-green-700 cursor-pointer"
                onClick={() => {
                  setisDeleted((prev) => {
                    const newDeletedArr = Array(newTrans.length);
                    for (let index = 0; index < newTrans.length; index++) {
                      newDeletedArr[index] = prev[index];
                      if (isSelected[index] && prev[index])
                        newDeletedArr[index] = false;
                    }
                    return newDeletedArr;
                  });
                  setisSelected(Array(newTrans.length).fill(false));
                }}
              >
                Restore deleted selected
              </button>
              <button
                className="bg-blue-800 p-2 rounded-2xl text-white font-semibold border border-black hover:bg-blue-700 cursor-pointer"
                onClick={() => {
                  setisCopied(() => {
                    const newCopied = Array(newTrans.length).fill(false);
                    for (let index = 0; index < newTrans.length; index++) {
                      if (isSelected[index] && !isDeleted[index])
                        newCopied[index] = true;
                    }
                    return newCopied;
                  });
                  setisSelected(Array(newTrans.length).fill(false));
                }}
              >
                Copy Selected
              </button>
              <button
                className="bg-yellow-800 p-2 rounded-2xl text-white font-semibold border border-black hover:bg-yellow-700 cursor-pointer"
                onClick={() => {
                  const index = isSelected.findIndex((item) => item === true);
                  const copiedIndices: number[] = [];
                  for (let index = 0; index < isCopied.length; index++) {
                    if (isCopied[index]) copiedIndices.push(index);
                  }
                  const copiedElements = copiedIndices.map((index) => {
                    return newTrans[index];
                  });
                  setnewTrans((prev) => {
                    const newArr = [...prev];
                    newArr.splice(index + 1, 0, ...copiedElements);
                    return newArr;
                  });
                  setisDeleted((prev) => {
                    const newArr = [...prev];
                    const filler = Array(copiedElements.length).fill(false);
                    newArr.splice(index + 1, 0, ...filler);
                    return newArr;
                  });
                  setisSelected(() => {
                    return Array(
                      copiedElements.length + isSelected.length
                    ).fill(false);
                  });
                  setisCopied(() => {
                    return Array(copiedElements.length + isCopied.length).fill(
                      false
                    );
                  });
                }}
              >
                Paste After First Selected
              </button>
            </div>
          </div>
        </header>
        <section className="flex border-b border-gray-300 pb-4">
          <TranscriptEditor
            isCopied={isCopied}
            isDeleted={isDeleted}
            isSelected={isSelected}
            setisSelected={setisSelected}
            newTrans={newTrans}
          />

          <Player
            totalTime={totalTime}
            transNewTimes={transNewTimes}
            currentTime={currentTime}
            setcurrentTime={setcurrentTime}
          />
        </section>
        <TranscriptViewer
          newTrans={transNewTimes}
          currentTime={currentTime}
          isDeleted={isDeleted}
          setisSelected={setisSelected}
        />
      </main>
    </div>
  );
}

export default App;
