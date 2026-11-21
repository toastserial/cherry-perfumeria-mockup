import { describe, expect, it } from 'vitest'
import { demoPerfumes } from '../data/perfumes'
import { defaultFilters, filterPerfumes } from '../lib/catalog'

describe('filtros de catálogo',()=>{
  it('combina familia, género, precio y disponibilidad',()=>{
    const result=filterPerfumes(demoPerfumes,{...defaultFilters,family:['Floral'],gender:['Femenino'],max:2500,available:true})
    expect(result.map(x=>x.name)).toEqual(['Rubí de Seda','Petalia'])
  })
  it('busca coincidencias por nota y marca',()=>{
    expect(filterPerfumes(demoPerfumes,{...defaultFilters,q:'vainilla'}).length).toBeGreaterThan(0)
    expect(filterPerfumes(demoPerfumes,{...defaultFilters,q:'atelier minuit'}).every(x=>x.brand==='Atelier Minuit')).toBe(true)
  })
  it('respeta ofertas y orden de precio',()=>{
    const result=filterPerfumes(demoPerfumes,{...defaultFilters,offers:true,sort:'precio-asc'})
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Nube de Azúcar')
  })
})
