import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import callAPI from "../actions/callAPI";

const Inference: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref to the file input element
  const [image, setImage] = useState<Blob | MediaSource | null>(null); // Image to be uploaded
  const [apiResult, setApiResult] = useState<string | undefined>(undefined); // Result from the API

  function handleClick() {
    navigate("/");
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  }

  function handleUndo() {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  }

  async function handleSendToApi() {
    if (fileInputRef.current && fileInputRef.current.files) {
      const file = fileInputRef.current.files[0];
      const result = await callAPI(file);
      setApiResult(result.data);
    }
  }
  return (
    <div className="bg-gray-200 w-screen h-screen flex flex-col justify-center items-center overflow-hidden">
      <Button onClick={handleClick} className="absolute top-4 left-4">
        Voltar
      </Button>
      <div className="max-w-6xl sm:w-[800px] sm:h-[600px] w-screen h-screen p-8 bg-white border-2 rounded-md border-gray-500 flex flex-col justify-center">
        <h1 className="text-4xl font-bold self-center mb-auto h-1/6">
          Inference
        </h1>

        <div className="relative flex flex-row justify-center align-middle self-center w-full h-3/6 ">
          <div className="relative flex flex-col justify-center w-5/6 border-2 border-gray-600 rounded-md">
            {image && (
              <>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="border-1 border-gray-200 rounded-md"
                />
                <Button className="absolute bottom-0 z-40" onClick={handleUndo}>
                  Back
                </Button>
              </>
            )}
          <label
            className="absolute top-0 right-0 rounded-md font-bold text-center text-black w-full h-full self-center flex flex-col justify-center cursor-pointer z-30"
            htmlFor="fileUpload"
          >
            <div className="-z-10 bg-opacity-30 bg-white backdrop-blur-sm">
              {image ? "Change Image" : "Upload Image"}
            </div>

            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              ref={fileInputRef}
            />
          </label>
          </div>

        </div>

        <br></br>

        <div className="w-full h-1/6 flex flex-row justify-center">
          {image && (
            <Button
              onClick={handleSendToApi}
            >
              Send to API
            </Button>
          )}
        </div>

        <br></br>
        <div className="self-center font-bold h-1/6">
          {apiResult && (
            <>
              API Result:<br></br>
              {apiResult}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inference;
