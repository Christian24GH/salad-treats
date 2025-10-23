import './bootstrap';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { CartProvider } from "@/context/CartContext"

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./src/pages/**/*.jsx', { eager: true })
    return pages[`./src/pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(
       <CartProvider>
         <App {...props} />
       </CartProvider>
    )
  },
})