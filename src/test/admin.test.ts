import { beforeEach, describe, expect, it } from 'vitest'
import { readPerfumes, writePerfumes } from '../store/catalogStore'
import { demoPerfumes } from '../data/perfumes'

describe('flujo administrativo demo',()=>{
  beforeEach(()=>localStorage.clear())
  it('persiste publicación y despublicación',()=>{
    const next=demoPerfumes.map((p,i)=>i===0?{...p,status:'borrador' as const}:p)
    writePerfumes(next)
    expect(readPerfumes()[0].status).toBe('borrador')
  })
  it('mantiene el catálogo base si no hay datos locales',()=>expect(readPerfumes().length).toBe(demoPerfumes.length))
})
