import { demoPerfumes } from '../data/perfumes'
import type { Perfume } from '../types'
const KEY = 'cherry-demo-perfumes'
export const readPerfumes = (): Perfume[] => { try { const v=localStorage.getItem(KEY); return v ? JSON.parse(v) : demoPerfumes } catch { return demoPerfumes } }
export const writePerfumes = (items: Perfume[]) => localStorage.setItem(KEY, JSON.stringify(items))
