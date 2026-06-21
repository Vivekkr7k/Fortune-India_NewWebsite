'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getCategoryImageUrl, getSubcategoryImageUrl } from '@/lib/imageUrl'
import { toast } from 'sonner'
import { Plus, X, Upload, Loader2, FolderTree, FolderOpen, Pencil, Trash2, AlertTriangle } from 'lucide-react'

interface SubcategoryData {
  _id: string
  name: string
  slug?: string
  image?: string
}

interface CategoryData {
  _id: string
  name: string
  slug?: string
  image?: string
  subcategories: SubcategoryData[]
}

// ─── Confirm Delete Modal ──────────────────────────────────────────────────────
function ConfirmDeleteModal({
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none">
      <div onClick={onCancel} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 max-w-[400px] w-full mx-4 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E63946]/10 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-[#E63946]" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[16px] font-extrabold text-[var(--color-ink)] font-[var(--font-display)]">{title}</h3>
            <p className="text-[12.5px] text-[var(--color-muted)] mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-body)] text-[13px] font-bold hover:bg-[var(--color-surface-alt)] transition-all cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-full bg-[#E63946] hover:bg-[#D62839] text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Edit Category Modal ───────────────────────────────────────────────────────
function EditCategoryModal({
  category,
  onSave,
  onClose,
}: {
  category: CategoryData
  onSave: (id: string, data: { name: string; slug: string; image?: string }) => Promise<void>
  onClose: () => void
}) {
  const [name, setName] = useState(category.name)
  const [slug, setSlug] = useState(category.slug || '')
  const [image, setImage] = useState(category.image || '')
  const [previewUrl, setPreviewUrl] = useState(category.image ? getCategoryImageUrl(category.image) : '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setPreviewUrl(URL.createObjectURL(file))
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'categories')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const result = await res.json()
      setImage(result.filename)
      toast.success('Image uploaded!')
    } catch {
      toast.error('Upload failed.')
      setPreviewUrl(category.image ? getCategoryImageUrl(category.image) : '')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Name is required.'); return }
    setSaving(true)
    try {
      await onSave(category._id, { name: name.trim(), slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''), image: image || undefined })
      onClose()
    } catch {
      // handled inside onSave
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 max-w-[440px] w-full mx-4 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <h3 className="text-[16px] font-extrabold text-[var(--color-ink)] font-[var(--font-display)] flex items-center gap-2">
            <Pencil size={16} className="text-[var(--color-signal)]" />
            Edit Category
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-[var(--color-surface-alt)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-[13px]">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[var(--color-body)]">Category Name*</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[var(--color-body)]">URL Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] font-mono placeholder-[var(--color-placeholder)]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[var(--color-body)]">Category Image</label>
            {previewUrl ? (
              <div className="relative w-full h-24 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl overflow-hidden flex items-center justify-center p-1">
                <Image src={previewUrl} alt="Category preview" fill sizes="(max-width: 768px) 100vw, 440px" className="object-contain" />
                <button type="button" onClick={() => { setImage(''); setPreviewUrl(''); }} className="absolute right-2 top-2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer">
                  <X size={12} />
                </button>
                {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="animate-spin text-[var(--color-signal)]" size={18} /></div>}
              </div>
            ) : (
              <label className="w-full h-24 border border-dashed border-[var(--color-border)] hover:border-[var(--color-signal)] rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer bg-[var(--color-canvas)] text-[var(--color-muted)] hover:text-[var(--color-body)] transition-all">
                <Upload size={16} />
                <span className="text-[11.5px] font-semibold">Upload Image</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
          <button type="submit" disabled={saving || uploading} className="w-full py-3 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[13px] font-bold mt-1 shadow-lg shadow-[#FF5A1F]/10 hover:shadow-[#FF5A1F]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Edit Subcategory Modal ────────────────────────────────────────────────────
function EditSubcategoryModal({
  subcategory,
  onSave,
  onClose,
}: {
  subcategory: SubcategoryData
  onSave: (id: string, data: { name: string; slug: string; image?: string }) => Promise<void>
  onClose: () => void
}) {
  const [name, setName] = useState(subcategory.name)
  const [slug, setSlug] = useState(subcategory.slug || '')
  const [image, setImage] = useState(subcategory.image || '')
  const [previewUrl, setPreviewUrl] = useState(subcategory.image ? getSubcategoryImageUrl(subcategory.image) : '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setPreviewUrl(URL.createObjectURL(file))
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'subcategories')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const result = await res.json()
      setImage(result.filename)
      toast.success('Image uploaded!')
    } catch {
      toast.error('Upload failed.')
      setPreviewUrl(subcategory.image ? getSubcategoryImageUrl(subcategory.image) : '')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Name is required.'); return }
    setSaving(true)
    try {
      await onSave(subcategory._id, { name: name.trim(), slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''), image: image || undefined })
      onClose()
    } catch {
      // handled inside onSave
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 max-w-[440px] w-full mx-4 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <h3 className="text-[16px] font-extrabold text-[var(--color-ink)] font-[var(--font-display)] flex items-center gap-2">
            <Pencil size={16} className="text-[var(--color-signal)]" />
            Edit Subcategory
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-[var(--color-surface-alt)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-[13px]">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[var(--color-body)]">Subcategory Name*</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[var(--color-body)]">URL Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] font-mono placeholder-[var(--color-placeholder)]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[var(--color-body)]">Subcategory Image</label>
            {previewUrl ? (
              <div className="relative w-full h-24 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl overflow-hidden flex items-center justify-center p-1">
                <Image src={previewUrl} alt="Subcategory preview" fill sizes="(max-width: 768px) 100vw, 440px" className="object-contain" />
                <button type="button" onClick={() => { setImage(''); setPreviewUrl(''); }} className="absolute right-2 top-2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer">
                  <X size={12} />
                </button>
                {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="animate-spin text-[var(--color-signal)]" size={18} /></div>}
              </div>
            ) : (
              <label className="w-full h-24 border border-dashed border-[var(--color-border)] hover:border-[var(--color-signal)] rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer bg-[var(--color-canvas)] text-[var(--color-muted)] hover:text-[var(--color-body)] transition-all">
                <Upload size={16} />
                <span className="text-[11.5px] font-semibold">Upload Image</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
          <button type="submit" disabled={saving || uploading} className="w-full py-3 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[13px] font-bold mt-1 shadow-lg shadow-[#FF5A1F]/10 hover:shadow-[#FF5A1F]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function CategoriesPageClient({ initialCategories }: { initialCategories: CategoryData[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories)

  // Create Category Form States
  const [catName, setCatName] = useState('')
  const [catSlug, setCatSlug] = useState('')
  const [catUploading, setCatUploading] = useState(false)
  const [catImage, setCatImage] = useState('')
  const [catPreviewUrl, setCatPreviewUrl] = useState('')

  // Create Subcategory Form States
  const [subName, setSubName] = useState('')
  const [subSlug, setSubSlug] = useState('')
  const [parentCatId, setParentCatId] = useState('')
  const [subUploading, setSubUploading] = useState(false)
  const [subImage, setSubImage] = useState('')
  const [subPreviewUrl, setSubPreviewUrl] = useState('')

  // Loading submits
  const [submittingCat, setSubmittingCat] = useState(false)
  const [submittingSub, setSubmittingSub] = useState(false)

  // Edit / Delete states
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<SubcategoryData | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryData | null>(null)
  const [deletingSubcategory, setDeletingSubcategory] = useState<{ sub: SubcategoryData; catId: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ── Category Image Upload ──
  const handleCatImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCatUploading(true)
    setCatImage('')
    setCatPreviewUrl(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'categories')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Image upload failed')
      const result = await res.json()
      setCatImage(result.filename)
      toast.success('Category image uploaded!')
    } catch (err: any) {
      console.error(err)
      toast.error('Upload failed.')
      setCatPreviewUrl('')
    } finally {
      setCatUploading(false)
    }
  }

  // ── Subcategory Image Upload ──
  const handleSubImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSubUploading(true)
    setSubImage('')
    setSubPreviewUrl(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'subcategories')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('Image upload failed')
      const result = await res.json()
      setSubImage(result.filename)
      toast.success('Subcategory image uploaded!')
    } catch (err: any) {
      console.error(err)
      toast.error('Upload failed.')
      setSubPreviewUrl('')
    } finally {
      setSubUploading(false)
    }
  }

  // ── Add Category Submit ──
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!catName) {
      toast.error('Category name is required.')
      return
    }

    setSubmittingCat(true)
    const slug = catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: catName,
          slug,
          image: catImage || undefined
        })
      })

      if (!res.ok) throw new Error('Failed to create category')
      const newCat = await res.json()
      
      setCategories(prev => [...prev, { ...newCat, subcategories: [] }])
      toast.success('Category created successfully!')
      
      // Reset
      setCatName('')
      setCatSlug('')
      setCatImage('')
      setCatPreviewUrl('')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to create category.')
    } finally {
      setSubmittingCat(false)
    }
  }

  // ── Add Subcategory Submit ──
  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subName || !parentCatId) {
      toast.error('Subcategory name and parent category are required.')
      return
    }

    setSubmittingSub(true)
    const slug = subSlug.trim() || subName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    try {
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: subName,
          slug,
          category: parentCatId,
          image: subImage || undefined
        })
      })

      if (!res.ok) throw new Error('Failed to create subcategory')
      const newSub = await res.json()
      
      setCategories(prev => prev.map(cat => {
        if (cat._id === parentCatId) {
          return {
            ...cat,
            subcategories: [...cat.subcategories, newSub]
          }
        }
        return cat
      }))
      
      toast.success('Subcategory created successfully!')
      
      // Reset
      setSubName('')
      setSubSlug('')
      setParentCatId('')
      setSubImage('')
      setSubPreviewUrl('')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to create subcategory.')
    } finally {
      setSubmittingSub(false)
    }
  }

  // ── Edit Category Save ──
  const handleEditCategorySave = async (id: string, data: { name: string; slug: string; image?: string }) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { toast.error('Failed to update category.'); throw new Error('Update failed') }
    const updated = await res.json()
    setCategories(prev => prev.map(cat => cat._id === id ? { ...cat, ...updated } : cat))
    toast.success('Category updated successfully!')
    router.refresh()
  }

  // ── Edit Subcategory Save ──
  const handleEditSubcategorySave = async (id: string, data: { name: string; slug: string; image?: string }) => {
    const res = await fetch(`/api/subcategories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { toast.error('Failed to update subcategory.'); throw new Error('Update failed') }
    const updated = await res.json()
    setCategories(prev => prev.map(cat => ({
      ...cat,
      subcategories: cat.subcategories.map(sub => sub._id === id ? { ...sub, ...updated } : sub)
    })))
    toast.success('Subcategory updated successfully!')
    router.refresh()
  }

  // ── Delete Category ──
  const handleDeleteCategory = async () => {
    if (!deletingCategory) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/categories/${deletingCategory._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setCategories(prev => prev.filter(cat => cat._id !== deletingCategory._id))
      toast.success('Category deleted successfully!')
      setDeletingCategory(null)
      router.refresh()
    } catch {
      toast.error('Failed to delete category.')
    } finally {
      setDeleteLoading(false)
    }
  }

  // ── Delete Subcategory ──
  const handleDeleteSubcategory = async () => {
    if (!deletingSubcategory) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/subcategories/${deletingSubcategory.sub._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setCategories(prev => prev.map(cat => {
        if (cat._id === deletingSubcategory.catId) {
          return { ...cat, subcategories: cat.subcategories.filter(s => s._id !== deletingSubcategory.sub._id) }
        }
        return cat
      }))
      toast.success('Subcategory deleted successfully!')
      setDeletingSubcategory(null)
      router.refresh()
    } catch {
      toast.error('Failed to delete subcategory.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-[var(--color-body)] select-none">
      
      {/* Left Column: Categories List (55%) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <h2 className="text-[18px] font-extrabold text-[var(--color-ink)] border-b border-[var(--color-border)] pb-3 flex items-center gap-2 font-[var(--font-display)]">
          <FolderTree size={18} className="text-[var(--color-signal)]" />
          <span>Category Directory</span>
        </h2>

        <div className="flex flex-col gap-4">
          {categories.length === 0 ? (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-8 text-center text-[var(--color-muted)] text-[13.5px]">
              No categories configured yet.
            </div>
          ) : (
            categories.map((cat) => {
              const catImg = getCategoryImageUrl(cat.image)

              return (
                <div key={cat._id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-5 flex flex-col gap-4 shadow-sm hover:border-[var(--color-signal)]/20 transition-all">
                  
                  {/* Category Row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border)] overflow-hidden shrink-0 flex items-center justify-center">
                        {cat.image ? (
                          <Image
                            src={catImg}
                            alt={cat.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <FolderOpen size={18} className="text-[var(--color-signal)]/50" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[15px] font-extrabold text-[var(--color-ink)] leading-tight">
                          {cat.name}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--color-muted)] mt-0.5">
                          Slug: <strong className="text-[var(--color-body)]">{cat.slug}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--color-signal)] bg-[var(--color-signal-tint)] border border-[var(--color-signal)]/10 px-2.5 py-0.5 rounded-full">
                        {cat.subcategories.length} subcategories
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(cat)}
                        className="w-8 h-8 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border)] hover:border-[var(--color-signal)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-signal)] transition-all cursor-pointer"
                        title="Edit category"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCategory(cat)}
                        className="w-8 h-8 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border)] hover:border-[#E63946] flex items-center justify-center text-[var(--color-muted)] hover:text-[#E63946] transition-all cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories list */}
                  {cat.subcategories.length > 0 && (
                    <div className="border-t border-[var(--color-border)] pt-4 flex flex-col gap-2.5">
                      <span className="text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider font-bold">Subcategories:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {cat.subcategories.map((sub) => {
                          const subImg = getSubcategoryImageUrl(sub.image)

                          return (
                            <div key={sub._id} className="flex items-center gap-2.5 bg-[var(--color-canvas)] p-2.5 rounded-xl border border-[var(--color-border)]/50 group">
                              <div className="relative w-8 h-8 rounded bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden flex items-center justify-center shrink-0">
                                {sub.image ? (
                                  <Image
                                    src={subImg}
                                    alt={sub.name}
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <FolderOpen size={12} className="text-[var(--color-muted)]" />
                                )}
                              </div>
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className="text-[12.5px] font-bold text-[var(--color-ink)] leading-tight truncate">
                                  {sub.name}
                                </span>
                                <span className="text-[9.5px] font-mono text-[var(--color-muted)] truncate">
                                  {sub.slug}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setEditingSubcategory(sub)}
                                  className="w-6 h-6 rounded bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-signal)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-signal)] transition-all cursor-pointer"
                                  title="Edit subcategory"
                                >
                                  <Pencil size={10} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingSubcategory({ sub, catId: cat._id })}
                                  className="w-6 h-6 rounded bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[#E63946] flex items-center justify-center text-[var(--color-muted)] hover:text-[#E63946] transition-all cursor-pointer"
                                  title="Delete subcategory"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Right Column: Creation Forms (45%) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Section 1: Create Category */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-[15px] font-extrabold text-[var(--color-ink)] border-b border-[var(--color-border)] pb-3 flex items-center gap-2 font-[var(--font-display)]">
            <Plus size={16} className="text-[var(--color-signal)]" />
            <span>Create New Category</span>
          </h3>

          <form onSubmit={handleAddCategory} className="flex flex-col gap-4 text-[13px]">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Category Name*</label>
              <input
                type="text"
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Decals & Technical Labels"
                className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Category URL Slug</label>
              <input
                type="text"
                value={catSlug}
                onChange={(e) => setCatSlug(e.target.value)}
                placeholder="e.g. decals-labels (Optional)"
                className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] font-mono placeholder-[var(--color-placeholder)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Category Image</label>
              {catPreviewUrl ? (
                <div className="relative w-full h-24 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl overflow-hidden flex items-center justify-center p-1">
                  <Image
                    src={catPreviewUrl}
                    alt="Category preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 440px"
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => { setCatImage(''); setCatPreviewUrl(''); }}
                    className="absolute right-2 top-2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                  {catUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="animate-spin text-[var(--color-signal)]" size={18} />
                    </div>
                  )}
                </div>
              ) : (
                <label className="w-full h-24 border border-dashed border-[var(--color-border)] hover:border-[var(--color-signal)] rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer bg-[var(--color-canvas)] text-[var(--color-muted)] hover:text-[var(--color-body)] transition-all">
                  <Upload size={16} />
                  <span className="text-[11.5px] font-semibold">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCatImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={submittingCat || catUploading}
              className="w-full py-3 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[13px] font-bold mt-2 shadow-lg shadow-[#FF5A1F]/10 hover:shadow-[#FF5A1F]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submittingCat ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>

        {/* Section 2: Create Subcategory */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-[15px] font-extrabold text-[var(--color-ink)] border-b border-[var(--color-border)] pb-3 flex items-center gap-2 font-[var(--font-display)]">
            <Plus size={16} className="text-[var(--color-signal)]" />
            <span>Create New Subcategory</span>
          </h3>

          <form onSubmit={handleAddSubcategory} className="flex flex-col gap-4 text-[13px]">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Parent Category*</label>
              <select
                required
                value={parentCatId}
                onChange={(e) => setParentCatId(e.target.value)}
                className="w-full px-3 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id} className="text-black">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Subcategory Name*</label>
              <input
                type="text"
                required
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="e.g. Polycarbonate Labels"
                className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Subcategory URL Slug</label>
              <input
                type="text"
                value={subSlug}
                onChange={(e) => setSubSlug(e.target.value)}
                placeholder="e.g. polycarbonate (Optional)"
                className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] font-mono placeholder-[var(--color-placeholder)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Subcategory Image</label>
              {subPreviewUrl ? (
                <div className="relative w-full h-24 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl overflow-hidden flex items-center justify-center p-1">
                  <Image
                    src={subPreviewUrl}
                    alt="Subcategory preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 440px"
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => { setSubImage(''); setSubPreviewUrl(''); }}
                    className="absolute right-2 top-2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                  {subUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="animate-spin text-[var(--color-signal)]" size={18} />
                    </div>
                  )}
                </div>
              ) : (
                <label className="w-full h-24 border border-dashed border-[var(--color-border)] hover:border-[var(--color-signal)] rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer bg-[var(--color-canvas)] text-[var(--color-muted)] hover:text-[var(--color-body)] transition-all">
                  <Upload size={16} />
                  <span className="text-[11.5px] font-semibold">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSubImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={submittingSub || subUploading}
              className="w-full py-3 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[13px] font-bold mt-2 shadow-lg shadow-[#FF5A1F]/10 hover:shadow-[#FF5A1F]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submittingSub ? 'Creating...' : 'Create Subcategory'}
            </button>
          </form>
        </div>

      </div>

      {/* ── Modals ── */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onSave={handleEditCategorySave}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {editingSubcategory && (
        <EditSubcategoryModal
          subcategory={editingSubcategory}
          onSave={handleEditSubcategorySave}
          onClose={() => setEditingSubcategory(null)}
        />
      )}

      {deletingCategory && (
        <ConfirmDeleteModal
          title="Delete Category"
          message={`Are you sure you want to delete "${deletingCategory.name}" and all its ${deletingCategory.subcategories.length} subcategories? This action cannot be undone.`}
          onConfirm={handleDeleteCategory}
          onCancel={() => setDeletingCategory(null)}
          loading={deleteLoading}
        />
      )}

      {deletingSubcategory && (
        <ConfirmDeleteModal
          title="Delete Subcategory"
          message={`Are you sure you want to delete "${deletingSubcategory.sub.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteSubcategory}
          onCancel={() => setDeletingSubcategory(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}
