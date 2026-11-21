import type { Perfume } from '../types'
import { lowestPrice } from './format'

export interface CatalogFilters { q: string; brand: string[]; family: string[]; gender: string[]; concentration: string[]; min: number; max: number; available: boolean; news: boolean; offers: boolean; collection: string; sort: string }
export const defaultFilters: CatalogFilters = { q:'',brand:[],family:[],gender:[],concentration:[],min:0,max:10000,available:false,news:false,offers:false,collection:'',sort:'relevancia' }
export function filterPerfumes(items: Perfume[], f: CatalogFilters) {
  const q = f.q.trim().toLocaleLowerCase('es')
  const result = items.filter(p => p.status === 'publicado' && (!q || [p.name,p.brand,p.family,...p.notes].join(' ').toLocaleLowerCase('es').includes(q)) && (!f.brand.length || f.brand.includes(p.brand)) && (!f.family.length || f.family.includes(p.family)) && (!f.gender.length || f.gender.includes(p.gender)) && (!f.concentration.length || f.concentration.includes(p.concentration)) && lowestPrice(p.variants) >= f.min && lowestPrice(p.variants) <= f.max && (!f.available || p.variants.some(v => v.stock > 0)) && (!f.news || p.isNew) && (!f.offers || p.variants.some(v => v.salePrice)) && (!f.collection || p.collection === f.collection))
  return result.sort((a,b) => f.sort === 'precio-asc' ? lowestPrice(a.variants)-lowestPrice(b.variants) : f.sort === 'precio-desc' ? lowestPrice(b.variants)-lowestPrice(a.variants) : f.sort === 'alfabetico' ? a.name.localeCompare(b.name) : f.sort === 'recientes' ? Number(Boolean(b.isNew))-Number(Boolean(a.isNew)) : Number(Boolean(b.featured))-Number(Boolean(a.featured)))
}
