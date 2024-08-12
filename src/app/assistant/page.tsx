"use client";

import { useState, useRef, useId } from 'react';
import { useChat } from 'ai/react';

const models = [
  { id: 'openai', name: 'OpenAI GPT-3.5' },
  { id: 'anthropic', name: 'Anthropic Claude' },
  { id: 'gemini', name: 'Google Gemini' },
];

const languages = [
  { id: 'english', name: 'English' },
  { id: 'spanish', name: 'Spanish' },
  { id: 'hindi', name: 'Hindi' },
];

const diseases = [
  { id: 'heart', name: 'Heart Disease' },
  { id: 'diabetes', name: 'Diabetes' },
  { id: 'breast_cancer', name: 'Breast Cancer' },
];

export default function Assistant() {
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].id);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null) as any;
  const selectModelId = useId();
  const selectLanguageId = useId();
  const selectDiseaseId = useId();

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: { model: selectedModel, language: selectedLanguage, disease: selectedDisease },
  });

  const handleImageUpload = (e:any) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e:any) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    fileInputRef.current.value = '';
  };

  const isSubmitDisabled = !selectedDisease;

  return (
    <div className="flex flex-col h-screen bg-bg-100">
      <main className="flex-grow p-4 overflow-auto">
        <h1 className="text-2xl font-bold text-accent-200 mb-4">AI Assistant</h1>
        <div className="mb-4 space-y-4">
          <div>
            <label htmlFor={selectModelId} className="block text-sm font-medium text-text-200 mb-2">
              Select Model:
            </label>
            <select
              id={selectModelId}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-200"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={selectLanguageId} className="block text-sm font-medium text-text-200 mb-2">
              Select Language:
            </label>
            <select
              id={selectLanguageId}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-200"
            >
              {languages.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={selectDiseaseId} className="block text-sm font-medium text-text-200 mb-2">
              Select Disease:
            </label>
            <select
              id={selectDiseaseId}
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-200"
            >
              <option value="">Select a disease</option>
              {diseases.map((disease) => (
                <option key={disease.id} value={disease.id}>
                  {disease.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg ${m.role === 'user' ? 'bg-accent-100 text-text-100' : 'bg-primary-100 text-text-200'} max-w-[70%]`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>
      </main>
      <div className="p-4 border-t border-bg-300">
        {image && (
          <div className="mb-4 relative">
            <img src={image} alt="Uploaded preview" className="max-h-32 rounded-lg" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
          />
          <button
            type="button"
            onClick={handleImageClick}
            className="px-3 py-2 bg-primary-200 text-text-100 rounded-lg hover:bg-primary-300 transition-colors"
            aria-label="Upload image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <input
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-200"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
          />
          <button 
            type="submit" 
            className={`px-4 py-2 bg-accent-200 text-bg-100 rounded-lg transition-colors ${
              isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-100'
            }`}
            disabled={isSubmitDisabled}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}