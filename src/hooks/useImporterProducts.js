import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

// Reads the shared distribuidora-613 products table, filtering only rows the
// admin flagged with show_in_importer = true. Runs once on mount.
export function useImporterProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('id,name,category,image')
        .eq('show_in_importer', true)
        .order('name', { ascending: true })
      if (cancelled) return
      if (fetchError) setError(fetchError.message)
      else setProducts(data ?? [])
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { products, loading, error }
}
