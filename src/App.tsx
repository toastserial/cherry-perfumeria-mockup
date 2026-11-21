import { Route, Routes, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { PublicLayout } from './components/PublicLayout'

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })))
const CatalogPage = lazy(() => import('./pages/CatalogPage').then(module => ({ default: module.CatalogPage })))
const PerfumePage = lazy(() => import('./pages/PerfumePage').then(module => ({ default: module.PerfumePage })))
const CollectionsPage = lazy(() => import('./pages/CollectionsPage').then(module => ({ default: module.CollectionsPage })))
const AdminPage = lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })))
const SimplePage = lazy(() => import('./pages/SimplePage').then(module => ({ default: module.SimplePage })))

function ScrollTop(){ const {pathname}=useLocation(); useEffect(()=>{ window.scrollTo({top:0}) },[pathname]); return null }
export default function App(){ return <Suspense fallback={<div className="page-loader"><span/><p>Cargando</p></div>}><ScrollTop/><Routes>
  <Route element={<PublicLayout/>}>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/catalogo" element={<CatalogPage/>}/>
    <Route path="/perfumes/:slug" element={<PerfumePage/>}/>
    <Route path="/colecciones" element={<CollectionsPage/>}/>
    <Route path="/marcas" element={<SimplePage title="Marcas" text="Casas seleccionadas por su carácter, calidad y capacidad de emocionar."/>}/>
    <Route path="/ofertas" element={<CatalogPage preset="offers"/>}/>
    <Route path="/favoritos" element={<SimplePage title="Tus favoritos" text="Guarda aquí las fragancias que quieras volver a sentir."/>}/>
    <Route path="/contacto" element={<SimplePage title="Hablemos de perfumes" text="Cuéntanos qué te gusta y te ayudaremos a encontrar una esencia memorable."/>}/>
  </Route>
  <Route path="/admin/*" element={<AdminPage/>}/>
  <Route path="*" element={<SimplePage title="Página no encontrada" text="La ruta que buscas no está disponible."/>}/>
</Routes></Suspense> }
