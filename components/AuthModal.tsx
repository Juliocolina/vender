// components/AuthModal.tsx
"use client";

import { signInWithGoogle } from "@/lib/supabase/auth";
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
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // El redireccionamiento se maneja automáticamente por Supabase
    } catch (error) {
      console.error("Error durante la autenticación:", error);
      setIsLoading(false);
    }
  };

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
        <div className="text-center">
          <h3 className="text-xl font-bold text-vender-blue mb-2">
            {activeTab === 'signup' ? 'Únete a VENDER' : 'Bienvenido de vuelta'}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'signup' 
              ? 'Regístrate para crear tu tienda virtual' 
              : 'Accede a tu panel de control'}
          </p>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-vender-gold hover:bg-[#b8962e] text-vender-blue font-black py-3 px-4 rounded-xl text-sm tracking-widest transition-all shadow-lg active:scale-95 uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-vender-blue"></div>
                Cargando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {activeTab === 'signup' ? 'Registrarse con Google' : 'Iniciar sesión con Google'}
              </>
            )}
          </button>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              {activeTab === 'signup' 
                ? 'Al registrarte, aceptas nuestros términos y condiciones.'
                : '¿No tienes cuenta? Haz clic en "Registrarse" para crear una.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}