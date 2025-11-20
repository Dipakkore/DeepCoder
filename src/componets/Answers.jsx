import React, { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStarts } from "./hepler";

function Answers({ ans, i, totalResult }) {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeadingStarts(ans));
    }
  }, [ans]);

  return (
    <div>
      {i === 0 && totalResult > 1 ? (
        <span className="text-xl font-semibold text-amber-400">{answer}</span>
      ) : heading ? (
        <span className="font-bold">{answer}</span>
      ) : (
        <span>{answer}</span>
      )}
    </div>
  );
}

export default Answers;
