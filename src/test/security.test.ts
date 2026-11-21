import { describe, expect, it } from 'vitest'
import fs from 'node:fs'

describe('permisos Supabase',()=>{
  const sql=fs.readFileSync('supabase/migrations/202611200001_initial_schema.sql','utf8')
  it('activa RLS y protege operaciones administrativas',()=>{
    expect(sql).toContain('enable row level security')
    expect(sql).toContain('public.is_admin()')
    expect(sql).toContain('admin perfumes')
    expect(sql).toContain('own wishlist')
  })
})
