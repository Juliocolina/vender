"use client";

import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-vender-blue">Mi Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold text-vender-blue mb-4">¡Bienvenido a VENDER!</h2>
          <p className="text-gray-600 mb-6">
            Tu panel de control estará disponible pronto. Aquí podrás gestionar tu tienda, 
            ver ventas, manejar inventario y recibir reportes automáticos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-vender-blue/5 p-6 rounded-xl border border-vender-blue/10">
              <h3 className="font-bold text-vender-blue mb-2">Ventas del Día</h3>
              <p className="text-3xl font-black text-vender-gold">$0</p>
              <p className="text-sm text-gray-500 mt-2">Próximamente</p>
            </div>
            
            <div className="bg-vender-blue/5 p-6 rounded-xl border border-vender-blue/10">
              <h3 className="font-bold text-vender-blue mb-2">Productos</h3>
              <p className="text-3xl font-black text-vender-gold">0</p>
              <p className="text-sm text-gray-500 mt-2">Próximamente</p>
            </div>
            
            <div className="bg-vender-blue/5 p-6 rounded-xl border border-vender-blue/10">
              <h3 className="font-bold text-vender-blue mb-2">Pedidos Pendientes</h3>
              <p className="text-3xl font-black text-vender-gold">0</p>
              <p className="text-sm text-gray-500 mt-2">Próximamente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
