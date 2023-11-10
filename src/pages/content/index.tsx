import React, { useState } from "react";
import { createRoot } from "react-dom/client";
const useLocalStorage = <T,>(key: string, initialVal?: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialVal;
    } catch (err) {
      console.log(err);
      return initialVal;
    }
  });
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.log(err);
    }
  };
  return [storedValue, setValue] as const;
};
function Content() {
  const [resume, setResume] = useLocalStorage<string>("resume");
  const [apiKey, setApiKey] = useLocalStorage<string>("apiKey");

  const handleResumeChange = (e) => {
    const value = e.target.value;
    setResume(value);
    localStorage.setItem("resume", value);
  };

  const handleApiKeyChange = (e) => {
    const value = e.target.value;
    setApiKey(value);
    localStorage.setItem("apiKey", value);
  };

  const checkJobCompatibility = async () => {
    const jobDescription = document.querySelector(".job-description").innerText;
    // Use Langchain JS to get a score
    const score = await getScoreFromLangchain(resume, jobDescription, apiKey);
    alert(`Your compatibility score for this job is: ${score}`);
  };

  return (
    <div className="App">
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Paste your resume:
          </label>
          <textarea
            className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={resume}
            onChange={handleResumeChange}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            API Key for Langchain:
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={checkJobCompatibility}
        >
          Check Job Compatibility
        </button>
      </div>
    </div>
  );
}

const getScoreFromLangchain = async (resume, jobDescription, apiKey) => {
  // Use Langchain JS to get a score based on the resume and job description
  // This is a mock function, you'll need to implement the actual logic using Langchain JS
  return Math.floor(Math.random() * 11); // Returns a random score between 0 to 10
};

function init() {
  const rootContainer = document.body;
  if (!rootContainer) throw new Error("Can't find Content root element");
  const root = createRoot(rootContainer);
  root.render(<Content />);
}

document.addEventListener("DOMContentLoaded", init);
