import React from "react";

function QuistionAnswer({ result, Answers }) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
      {result.map((item, i) =>
        item.type === "q" ? (
          <div key={`q-${i}`} className="flex justify-end">
            <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-br-none shadow-md max-w-[80%] text-lg font-medium">
              <Answers ans={item.text} totalResult={1} i={i} />
            </div>
          </div>
        ) : Array.isArray(item.text) ? (
          item.text.map((ansItem, ansIndex) => (
            <div key={`a-${i}-${ansIndex}`} className="flex justify-start ml-3">
              <div className="bg-zinc-800 text-white px-5 py-3 rounded-2xl rounded-bl-none shadow-md max-w-[75%]">
                <Answers
                  ans={ansItem}
                  totalResult={item.text.length}
                  i={ansIndex}
                />
              </div>
            </div>
          ))
        ) : (
          <div key={`a-${i}`} className="flex justify-start ml-3">
            <div className="bg-zinc-800 text-white px-5 py-3 rounded-2xl rounded-bl-none shadow-md max-w-[75%]">
              <Answers ans={item.text} totalResult={1} i={i} />
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default QuistionAnswer;
