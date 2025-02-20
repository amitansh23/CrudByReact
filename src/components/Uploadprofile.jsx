import React, { useState } from "react";
import axios from "axios";

const Uploadprofile = () => {
  const [file, setFile] = useState(null);

  // File Selection handling
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Form Submit handling
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/api/uploadfile", formData, { 
        withCredentials: true
      });
    } catch (error) {
      console.error("Error uploading file");
    }
  };

  return (
    <>
      <div className="text-center text-primary">
        <h1 className="fw-bold" style={{ color: "#7e22ce" }}>
          Get Your Data Analysed
        </h1>
        <h3 className="fw-bold" style={{ color: "#7e22ce" }}>
          We Assure to Keep Your Data Safe and Secure..!!
        </h3>
      </div>

      {/* File Upload Form */}
      <form onSubmit={handleSubmit}>
        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-1 sm:pe-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Upload file
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                type="file"
                onChange={handleFileChange}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                CSV, PDF, Excel.
              </p>
            </div>
          </div>

          <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
            <textarea
              id="editor" rows="8" className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
              placeholder="Fill your Requirements and query here, ....."> 
            </textarea>
          </div>
        </div>
        <button
          type="submit" className="inline-flex items-center px-5 py-2.5 text-sm font-small text-center text-white bg-purple-700 rounded-lg hover:bg-purple-800">
          Upload
        </button>
      </form>
    </>
  );
};

export default Uploadprofile;