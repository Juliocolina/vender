// components/AuthModal.tsx
"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  defaultTab = 'signup' 
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(defaultTab);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative p-6 bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        
        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 text-center font-medium ${activeTab === 'signup' ? 'text-vender-blue border-b-2 border-vender-blue' : 'text-gray-500'}`}
          >
            Registrarse
          </button>
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-2 text-center font-medium ${activeTab === 'signin' ? 'text-vender-blue border-b-2 border-vender-blue' : 'text-gray-500'}`}
          >
            Iniciar Sesión
          </button>
        </div>
        
        {/* Contenido del modal */}
        {activeTab === 'signup' ? (
          <SignUp 
            routing="hash" 
            forceRedirectUrl="/onboarding"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                formButtonPrimary: "bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-black",
              }
            }}
          />
        ) : (
          <SignIn 
            routing="hash" 
            forceRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                formButtonPrimary: "bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-black",
              }
            }}
          />
        )}
      </div>
    </div>
  );
}