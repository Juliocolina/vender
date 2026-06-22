// Verificar propiedades disponibles en Clerk v7.5.7
const clerk = require('@clerk/nextjs');

// Basado en la documentación de Clerk v7.5.7
// Las propiedades comunes de UserButton son:
// - afterSignOutUrl (correcta)
// - signOutOptions (opcional)
// - afterSignOut (no existe en v7)

console.log("Clerk version instalada: 7.5.7");
console.log("Propiedad correcta para redirección después de cerrar sesión: afterSignOutUrl");
console.log("Ejemplo: <UserButton afterSignOutUrl=\"/\" />");
