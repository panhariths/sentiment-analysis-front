"use client";

import FormBox from "@/components/form-box";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface SentimentResult {
  percentage: number;
  index: number;
}

const SENTIMENT_MAP = ["Negative", "Neutral", "Positive"];

export default function Home() {
  const [result, setResult] = useState<SentimentResult[] | undefined>();
  const [progressBarValues, setProgressBarValues] = useState<SentimentResult[]>([]);

  // Reupdate state of the progress bar
  useEffect(() => {
    if (!result) {
      setProgressBarValues([]);
      return;
    }

    setTimeout(() => {
      setProgressBarValues(result);
    }, 100);
  }, [result]);

  // Retrieve and sort result based on value
  const updateResult = (array: number[] | undefined) => {
    if (!array) {
      setResult(array);
      return;
    }

    const data = array.map((percentage, index) => ({ index, percentage }));
    data.sort((a, b) => b.percentage - a.percentage);
    setResult(data);
  };

  return (
    <main className="h-screen w-screen flex justify-center items-center bg-gradient-to-r from-indigo-500 from-10% to-sky-500 to-90% opacity-90">
      <div className="bg-white w-1/3 rounded-md p-10">
        <h4 className="text-lg font-medium mb-6">Khmer Sentiment Analysis</h4>
        <FormBox updateResult={updateResult} />
        {result && (
          <div className="flex flex-col space-y-6 mt-8">
            <hr />
            <h4 className="font-medium text-gray-800 text-sm">Result</h4>
            {result.map((res, idx) => {
              return (
                <div key={res.percentage.toString()}>
                  <div className="flex justify-between text-xs mb-1">
                    <p>{SENTIMENT_MAP[res.index]}</p>
                    <p className="font-medium">{(res.percentage * 100).toFixed(2)}%</p>
                  </div>
                  <Progress
                    className="bg-gray-100 h-2 transition-all"
                    value={progressBarValues[idx]?.percentage * 100}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
