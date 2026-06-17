'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { getProductImageUrl } from '@/lib/imageUrl'
import { toast } from 'sonner'
import { Plus, X, Upload, Loader2, Package, Search, Star, Pencil, Trash2, AlertTriangle } from 'lucide-react'

interface CategoryData {
  _id: string
  name: string
  subcategories: {
    _id: string
    name: string
  }[]
}

interface ProductData {
  _id: string
  name: string
  code: string
  description?: string
  price: number
  originalPrice?: number
  shippingCharge: number
  image?: string
  stock: number
  featured: boolean
  active: boolean
  category: {
    _id: string
    name: string
  }
  subcategory?: {
    _id: string
    name: string
  }
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center select-none">
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

// ─── Edit Product Modal ────────────────────────────────────────────────────────
function EditProductModal({
  product,
  categories,
  onSave,
  onClose,
}: {
  product: ProductData
  categories: CategoryData[]
  onSave: (id: string, data: Record<string, unknown>) => Promise<void>
  onClose: () => void
}) {
  const [name, setName] = useState(product.name)
  const [code, setCode] = useState(product.code)
  const [price, setPrice] = useState(String(product.price))
  const [originalPrice, setOriginalPrice] = useState(product.originalPrice ? String(product.originalPrice) : '')
  const [shippingCharge, setShippingCharge] = useState(String(product.shippingCharge))
  const [stock, setStock] = useState(String(product.stock))
  const [description, setDescription] = useState(product.description || '')
  const [categoryId, setCategoryId] = useState(product.category?._id || '')
  const [subcategoryId, setSubcategoryId] = useState(product.subcategory?._id || '')
  const [featured, setFeatured] = useState(product.featured)
  const [active, setActive] = useState(product.active)
  const [uploading, setUploading] = useState(false)
  const [uploadedFilename, setUploadedFilename] = useState(product.image || '')
  const [previewUrl, setPreviewUrl] = useState(product.image ? getProductImageUrl(product.image) : '')
  const [saving, setSaving] = useState(false)

  const selectedCategory = categories.find((c) => c._id === categoryId)
  const availableSubcategories = selectedCategory?.subcategories || []

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setPreviewUrl(URL.createObjectURL(file))
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'products')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')
      const result = await res.json()
      setUploadedFilename(result.filename)
      toast.success('Image uploaded!')
    } catch {
      toast.error('Upload failed.')
      setPreviewUrl(product.image ? getProductImageUrl(product.image) : '')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price || !categoryId) {
      toast.error('Name, Price, and Category are required.')
      return
    }
    setSaving(true)
    try {
      await onSave(product._id, {
        name: name.trim(),
        code: code.trim(),
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        shippingCharge: parseFloat(shippingCharge),
        stock: parseInt(stock, 10) || 999,
        description,
        category: categoryId,
        subcategory: subcategoryId || undefined,
        image: uploadedFilename || undefined,
        featured,
        active,
      })
      onClose()
    } catch {
      // handled in onSave
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end select-none">
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="w-full max-w-[500px] bg-[var(--color-surface)] border-l border-[var(--color-border)] h-screen overflow-y-auto relative z-10 flex flex-col p-6 md:p-8 gap-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-2">
            <Pencil className="text-[var(--color-signal)]" size={20} />
            <h3 className="text-[18px] font-extrabold text-[var(--color-ink)] font-[var(--font-display)]">
              Edit Product
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[var(--color-surface-alt)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-[13.5px] pb-10">
          {/* Product Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[var(--color-body)]">Product Name*</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aluminium Engraved Nameplate" className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]" />
          </div>

          {/* Product Code */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[var(--color-body)]">Product Code / URL SKU</label>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] font-mono placeholder-[var(--color-placeholder)]" />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Category*</label>
              <select required value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setSubcategoryId(''); }} className="w-full px-3 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] cursor-pointer">
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id} className="text-black">{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Subcategory</label>
              <select disabled={!categoryId} value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} className="w-full px-3 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                <option value="">Select Subcategory</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub._id} value={sub._id} className="text-black">{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Selling Price (₹)*</label>
              <input type="number" required min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Original Price (₹)</label>
              <input type="number" min={0} step="0.01" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="Optional" className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]" />
            </div>
          </div>

          {/* Shipping & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Shipping Charge (₹)</label>
              <input type="number" min={0} step="0.01" value={shippingCharge} onChange={(e) => setShippingCharge(e.target.value)} className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[var(--color-body)]">Inventory Stock</label>
              <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]" />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[var(--color-body)]">Description</label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter detailed technical specs..." className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] resize-none placeholder-[var(--color-placeholder)]" />
          </div>

          {/* Image Uploader */}
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[var(--color-body)]">Product Image</label>
            {previewUrl ? (
              <div className="relative w-full h-40 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl overflow-hidden flex items-center justify-center group p-1">
                <Image src={previewUrl} alt="Product preview" fill className="object-contain" />
                <button type="button" onClick={() => { setUploadedFilename(''); setPreviewUrl(''); }} className="absolute right-3 top-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100">
                  <X size={15} />
                </button>
                {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="animate-spin text-[var(--color-signal)]" size={24} /></div>}
              </div>
            ) : (
              <label className="w-full h-32 border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-signal)] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-[var(--color-canvas)] text-[var(--color-muted)] hover:text-[var(--color-body)] transition-all">
                <Upload size={22} />
                <span className="text-[12.5px] font-semibold">Upload product image (JPG, PNG)</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 mt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-[var(--color-signal)] w-4 h-4 cursor-pointer" />
              <span className="font-semibold text-[var(--color-ink)]">Featured Product</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="accent-[var(--color-signal)] w-4 h-4 cursor-pointer" />
              <span className="font-semibold text-[var(--color-ink)]">Active (Visible in Shop)</span>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" disabled={saving || uploading} className="w-full py-3.5 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[14px] font-bold mt-4 shadow-lg shadow-[#FF5A1F]/10 hover:shadow-[#FF5A1F]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function ProductsPageClient({
  initialProducts,
  categories,
}: {
  initialProducts: ProductData[]
  categories: CategoryData[]
}) {
  const router = useRouter()
  const [products, setProducts] = useState<ProductData[]>(initialProducts)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // Form states
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [shippingCharge, setShippingCharge] = useState('0')
  const [stock, setStock] = useState('999')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [subcategoryId, setSubcategoryId] = useState('')
  const [featured, setFeatured] = useState(false)
  const [active, setActive] = useState(true)

  // Image Upload States
  const [uploading, setUploading] = useState(false)
  const [uploadedFilename, setUploadedFilename] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')

  // Edit / Delete states
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<ProductData | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadedFilename('')
    setPreviewUrl(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'products')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Image upload failed')
      }

      const result = await res.json()
      setUploadedFilename(result.filename)
      toast.success('Image uploaded successfully!')
    } catch (err: any) {
      console.error(err)
      toast.error('Image upload failed. Please try again.')
      setPreviewUrl('')
    } finally {
      setUploading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !price || !categoryId) {
      toast.error('Product Name, Price, and Category are required fields.')
      return
    }

    const payload = {
      name,
      code: code.trim() || undefined,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      shippingCharge: parseFloat(shippingCharge),
      stock: parseInt(stock, 10) || 999,
      description,
      category: categoryId,
      subcategory: subcategoryId || undefined,
      image: uploadedFilename || undefined,
      featured,
      active,
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error('Failed to create product')
      }

      const newProduct = await res.json()
      setProducts((prev) => [newProduct, ...prev])
      toast.success('Product created successfully!')
      
      // Close & reset
      setShowAddModal(false)
      resetForm()
      router.refresh()
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to create product.')
    }
  }

  const resetForm = () => {
    setName('')
    setCode('')
    setPrice('')
    setOriginalPrice('')
    setShippingCharge('0')
    setStock('999')
    setDescription('')
    setCategoryId('')
    setSubcategoryId('')
    setFeatured(false)
    setActive(true)
    setUploadedFilename('')
    setPreviewUrl('')
  }

  // ── Edit Product Save ──
  const handleEditProductSave = async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { toast.error('Failed to update product.'); throw new Error('Update failed') }
    const updated = await res.json()
    setProducts(prev => prev.map(p => p._id === id ? { ...p, ...updated } : p))
    toast.success('Product updated successfully!')
    router.refresh()
  }

  // ── Delete Product ──
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/products/${deletingProduct._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setProducts(prev => prev.filter(p => p._id !== deletingProduct._id))
      toast.success('Product deleted successfully!')
      setDeletingProduct(null)
      router.refresh()
    } catch {
      toast.error('Failed to delete product.')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Subcategories filtered based on selected Category
  const selectedCategory = categories.find((c) => c._id === categoryId)
  const availableSubcategories = selectedCategory?.subcategories || []

  // Filtered Products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const range = 1
    pages.push(1)
    const start = Math.max(2, currentPage - range)
    const end = Math.min(totalPages - 1, currentPage + range)
    if (currentPage - range > 2) {
      pages.push('...')
    }
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (currentPage + range < totalPages - 1) {
      pages.push('...')
    }
    if (totalPages > 1) {
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex flex-col gap-6 text-[var(--color-body)] relative">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-[20px] shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search products by name or code..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[13.5px] text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)] transition-all"
          />
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[13.5px] font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#FF5A1F]/10 hover:shadow-[#FF5A1F]/20 w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Table/List */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] overflow-hidden shadow-sm">
        {paginatedProducts.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-muted)] text-[14px]">
            No products found. Click &quot;Add Product&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px] text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] text-[var(--color-muted)] font-mono text-[10px] uppercase">
                  <th className="px-5 py-4 font-semibold w-16">Image</th>
                  <th className="px-5 py-4 font-semibold">Product info</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold text-center">Stock</th>
                  <th className="px-5 py-4 font-semibold text-right">Price</th>
                  <th className="px-5 py-4 font-semibold text-right">Shipping</th>
                  <th className="px-5 py-4 font-semibold text-center">Status</th>
                  <th className="px-5 py-4 font-semibold text-center w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {paginatedProducts.map((product) => {
                  const imageSrc = getProductImageUrl(product.image)

                  return (
                    <tr key={product._id} className="hover:bg-[var(--color-surface-alt)]/50 transition-colors">
                      {/* Image */}
                      <td className="px-5 py-4">
                        <div className="relative w-12 h-12 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border)] overflow-hidden">
                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-mono text-[7px] text-[var(--color-muted)]">
                              No Img
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Product details */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5 max-w-[280px]">
                          <span className="font-bold text-[var(--color-ink)] leading-snug truncate">
                            {product.name}
                          </span>
                          <span className="font-mono text-[10.5px] text-[var(--color-muted)]">
                            Code: <strong className="text-[var(--color-body)]">{product.code}</strong>
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[var(--color-ink)]">
                            {product.category?.name}
                          </span>
                          {product.subcategory && (
                            <span className="text-[11.5px] text-[var(--color-muted)]">
                              {product.subcategory.name}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4 text-center font-mono font-semibold text-[var(--color-body)]">
                        {product.stock}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 text-right font-bold text-[var(--color-ink)]">
                        {formatPrice(product.price)}
                        {product.originalPrice && (
                          <span className="block text-[11px] text-[var(--color-muted)] font-normal line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </td>

                      {/* Shipping */}
                      <td className="px-5 py-4 text-right font-semibold text-[var(--color-body)]">
                        {product.shippingCharge === 0 ? 'Free' : formatPrice(product.shippingCharge)}
                      </td>

                      {/* Status Badges */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {product.featured && (
                            <span className="inline-flex items-center gap-0.5 text-[9.5px] font-mono font-bold bg-[var(--color-signal-tint)] text-[var(--color-signal)] border border-[var(--color-signal)]/20 px-1.5 py-0.5 rounded-full uppercase">
                              <Star size={8} fill="currentColor" />
                              <span>Featured</span>
                            </span>
                          )}
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                            product.active 
                              ? 'bg-[#1A9E5C]/10 text-[#1A9E5C] border border-[#1A9E5C]/20' 
                              : 'bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/20'
                          }`}>
                            {product.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(product)}
                            className="w-8 h-8 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border)] hover:border-[var(--color-signal)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-signal)] transition-all cursor-pointer"
                            title="Edit product"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                            className="w-8 h-8 rounded-lg bg-[var(--color-canvas)] border border-[var(--color-border)] hover:border-[#E63946] flex items-center justify-center text-[var(--color-muted)] hover:text-[#E63946] transition-all cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2 pb-6">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-body)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-surface-alt)] font-semibold transition-all cursor-pointer text-[13px]"
          >
            Previous
          </button>
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`dots-${idx}`} className="px-2 text-[var(--color-muted)] font-bold">
                    ...
                  </span>
                )
              }
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(Number(page))}
                  className={`w-9 h-9 rounded-full font-mono text-[13px] font-bold flex items-center justify-center transition-all cursor-pointer border ${
                    currentPage === page
                      ? 'bg-[var(--color-signal)] border-[var(--color-signal)] text-white'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-body)] hover:bg-[var(--color-surface-alt)]'
                  }`}
                >
                  {page}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-body)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-surface-alt)] font-semibold transition-all cursor-pointer text-[13px]"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Product Modal Drawer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <div 
            onClick={() => { setShowAddModal(false); resetForm(); }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <div className="w-full max-w-[500px] bg-[var(--color-surface)] border-l border-[var(--color-border)] h-screen overflow-y-auto relative z-10 flex flex-col p-6 md:p-8 gap-6 shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-2">
                <Package className="text-[var(--color-signal)]" size={20} />
                <h3 className="text-[18px] font-extrabold text-[var(--color-ink)] font-[var(--font-display)]">
                  Add New Product
                </h3>
              </div>
              <button 
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="w-8 h-8 rounded-full hover:bg-[var(--color-surface-alt)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddProduct} className="flex flex-col gap-5 text-[13.5px] pb-10">
              {/* Product Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[var(--color-body)]">Product Name*</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aluminium Engraved Nameplate"
                  className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]"
                />
              </div>

              {/* Product Code */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[var(--color-body)]">Product Code / URL SKU</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. FI1 (Leave empty to auto-generate)"
                  className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] font-mono placeholder-[var(--color-placeholder)]"
                />
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[var(--color-body)]">Category*</label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value)
                      setSubcategoryId('')
                    }}
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
                  <label className="font-semibold text-[var(--color-body)]">Subcategory</label>
                  <select
                    disabled={!categoryId}
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Subcategory</option>
                    {availableSubcategories.map((sub) => (
                      <option key={sub._id} value={sub._id} className="text-black">
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[var(--color-body)]">Selling Price (₹)*</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1500.00"
                    className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[var(--color-body)]">Original Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="1800.00 (Optional)"
                    className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]"
                  />
                </div>
              </div>

              {/* Shipping & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[var(--color-body)]">Shipping Charge (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={shippingCharge}
                    onChange={(e) => setShippingCharge(e.target.value)}
                    placeholder="0.00 (Free)"
                    className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-[var(--color-body)]">Inventory Stock</label>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="999"
                    className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] placeholder-[var(--color-placeholder)]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[var(--color-body)]">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed technical specs, dimensions, thickness, and tolerances..."
                  className="w-full px-3.5 py-2.5 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-signal)] resize-none placeholder-[var(--color-placeholder)]"
                />
              </div>

              {/* Image Uploader */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-[var(--color-body)]">Product Image</label>
                
                {previewUrl ? (
                  <div className="relative w-full h-40 bg-[var(--color-canvas)] border border-[var(--color-border)] rounded-xl overflow-hidden flex items-center justify-center group p-1">
                    <Image
                      src={previewUrl}
                      alt="Uploaded image preview"
                      fill
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => { setUploadedFilename(''); setPreviewUrl(''); }}
                      className="absolute right-3 top-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <X size={15} />
                    </button>
                    {uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="animate-spin text-[var(--color-signal)]" size={24} />
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="w-full h-32 border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-signal)] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-[var(--color-canvas)] text-[var(--color-muted)] hover:text-[var(--color-body)] transition-all">
                    <Upload size={22} />
                    <span className="text-[12.5px] font-semibold">Upload product image (JPG, PNG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 mt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-[var(--color-signal)] w-4 h-4 cursor-pointer"
                  />
                  <span className="font-semibold text-[var(--color-ink)]">Featured Product</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-[var(--color-signal)] w-4 h-4 cursor-pointer"
                  />
                  <span className="font-semibold text-[var(--color-ink)]">Active (Visible in Shop)</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3.5 rounded-full bg-[var(--color-signal)] hover:bg-[var(--color-signal-hover)] text-white text-[14px] font-bold mt-4 shadow-lg shadow-[#FF5A1F]/10 hover:shadow-[#FF5A1F]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Create Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit & Delete Modals ── */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          onSave={handleEditProductSave}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {deletingProduct && (
        <ConfirmDeleteModal
          title="Delete Product"
          message={`Are you sure you want to delete "${deletingProduct.name}" (${deletingProduct.code})? This action cannot be undone.`}
          onConfirm={handleDeleteProduct}
          onCancel={() => setDeletingProduct(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}
