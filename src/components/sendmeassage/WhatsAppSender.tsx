"use client";

import React, { useState } from "react";
import axios from "axios";

function WhatsAppSender() {
  const [to, setTo] = useState("");
  const [variables, setVariables] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const convertToJSON = (input) => {
    try {
      return JSON.parse(input);
    } catch {
      return { text: input };
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    setError("");
    setMediaFile(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload file to your server endpoint
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      console.log("the upload file:",uploadResponse)
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const data = await uploadResponse.json();
      
      // Store the complete URL for the uploaded file
      const fullUrl = `${window.location.origin}${data.url}`;
      setMediaUrl(fullUrl);
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
      setMediaFile(null);
      setMediaUrl("");
      setIsUploading(false);
    }
  };

  const sendMessage = async () => {
    try {
      if (!to) {
        setError("Please enter the recipient's WhatsApp number.");
        return;
      }

      setError("");
      
      // Prepare the request body
      const messageData = {
        to,
        variables: convertToJSON(variables),
        ...(mediaUrl && { mediaUrl }) // Only include mediaUrl if it exists
      };

      // Send the message
      const response = await fetch("/api/users/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Message sent successfully!");
        // Clear form after successful send
        setMediaFile(null);
        setMediaUrl("");
        setVariables("");
        setTo("");
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "An error occurred while sending the message.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Send WhatsApp Message
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="to"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Recipient's WhatsApp Number
          </label>
          <input
            id="to"
            type="text"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="e.g., +923001234567"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="variables"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Template Variables (Enter Text or JSON)
          </label>
          <textarea
            id="variables"
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            placeholder='Enter text or JSON, e.g., {"1": "value1", "2": "value2"}'
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="media"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Media File (Optional, max 10MB)
          </label>
          <input
            id="media"
            type="file"
            accept="image/*,video/*,application/pdf"
            className="w-full text-sm"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {mediaFile && (
            <p className="mt-2 text-sm text-gray-600">
              {isUploading ? (
                <span className="text-blue-600">Uploading...</span>
              ) : (
                `File selected: ${mediaFile.name}`
              )}
            </p>
          )}
          {mediaUrl && (
            <p className="mt-1 text-sm text-green-600">
              File uploaded successfully ✓
            </p>
          )}
        </div>

        <button
          onClick={sendMessage}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={!to || isUploading}
        >
          {isUploading ? "Uploading..." : "Send Message"}
        </button>
      </div>
    </div>
  );
}

export default WhatsAppSender;