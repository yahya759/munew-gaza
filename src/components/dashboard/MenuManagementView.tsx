import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Check,
  X,
  Search,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { MenuItem } from '../../types/restaurant';

interface MenuManagementViewProps {
  menuItems: MenuItem[];
  onAddItem: (item: Omit<MenuItem, 'id'>) => void;
  onUpdateItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

const CATEGORIES = [
  'الكل',
  'أطباق رئيسية',
  'بيتزا وباستا',
  'مقبلات وسلطات',
  'مشروبات',
  'حلويات',
];

export const MenuManagementView: React.FC<MenuManagementViewProps> = ({
  menuItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleAvailability,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('أطباق رئيسية');
  const [formImage, setFormImage] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormDescription('');
    setFormPrice('');
    setFormCategory('أطباق رئيسية');
    setFormImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');
    setFormAvailable(true);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDescription(item.description);
    setFormPrice(item.price.toString());
    setFormCategory(item.category);
    setFormImage(item.image);
    setFormAvailable(item.isAvailable);
    setFormErrors({});
    setModalOpen(true);
  };

  const validateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formName.trim()) {
      errors.name = 'اسم الوجبة مطلوب';
    }
    if (!formDescription.trim()) {
      errors.description = 'وصف الوجبة مطلوب';
    }
    const numPrice = parseFloat(formPrice);
    if (isNaN(numPrice) || numPrice <= 0) {
      errors.price = 'يرجى إدخال سعر صحيح أكبر من صفر';
    }
    if (!formCategory) {
      errors.category = 'التصنيف مطلوب';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      name: formName.trim(),
      description: formDescription.trim(),
      price: numPrice,
      category: formCategory,
      image: formImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      isAvailable: formAvailable,
    };

    if (editingItem) {
      onUpdateItem({ ...payload, id: editingItem.id });
    } else {
      onAddItem(payload);
    }

    setModalOpen(false);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesSearch =
      item.name.includes(searchQuery) || item.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* الترويسة العلوية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#ede7dd]">
        <div>
          <h1 className="text-2xl font-black text-[#11233e]">إدارة المنيو والوجبات</h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1">
            إضافة وجبات جديدة، تعديل الأسعار، إخفاء الأطباق غير المتوفرة، وحذفها.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-[#f8a368] hover:bg-[#ea8a26] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة وجبة جديدة</span>
        </button>
      </div>

      {/* شريط البحث وتصنيفات المنيو */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#ede7dd]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#94a3b8] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث عن وجبة أو مكوّن..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-xs sm:text-sm rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] focus:ring-1 focus:ring-[#f8a368] outline-none"
          />
        </div>

        {/* تصنيفات */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#11233e] text-white'
                  : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* شبكة بطاقات الوجبات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border overflow-hidden shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
              item.isAvailable ? 'border-[#ede7dd]' : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            <div>
              {/* صورة الوجبة مع بادج الحالة والتصنيف */}
              <div className="relative h-44 w-full bg-[#f1f5f9] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#11233e] shadow-xs">
                  {item.category}
                </div>
                <div className="absolute bottom-2.5 left-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shadow-xs ${
                      item.isAvailable
                        ? 'bg-[#e8f8f2] text-[#0d9488]'
                        : 'bg-[#fee2e2] text-[#ef4444]'
                    }`}
                  >
                    {item.isAvailable ? 'متاحة للطلب' : 'غير متاحة حالياً'}
                  </span>
                </div>
              </div>

              {/* بيانات الوجبة */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#11233e] leading-snug line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="text-base font-black text-[#ea8a26] shrink-0">
                    {item.price} ₪
                  </span>
                </div>
                <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="p-3 bg-[#fbf9f5] border-t border-[#f1ece3] flex items-center justify-between text-xs">
              <button
                onClick={() => onToggleAvailability(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  item.isAvailable
                    ? 'text-[#0d9488] hover:bg-[#e8f8f2]'
                    : 'text-[#ef4444] hover:bg-[#fee2e2]'
                }`}
                title={item.isAvailable ? 'إخفاء الوجبة من المنيو' : 'إتاحة الوجبة للزبائن'}
              >
                {item.isAvailable ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>إخفاء</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>إظهار</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 text-[#3b82f6] hover:bg-[#eff6ff] rounded-lg transition-colors cursor-pointer"
                  title="تعديل الوجبة"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`هل أنت متأكد من حذف وجبة "${item.name}"؟`)) {
                      onDeleteItem(item.id);
                    }
                  }}
                  className="p-1.5 text-[#ef4444] hover:bg-[#fee2e2] rounded-lg transition-colors cursor-pointer"
                  title="حذف الوجبة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* نافذة إضافة / تعديل الوجبة */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#ede7dd] space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#ede7dd]">
              <h3 className="text-lg font-black text-[#11233e]">
                {editingItem ? 'تعديل بيانات الوجبة' : 'إضافة وجبة جديدة للمنيو'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={validateAndSave} className="space-y-4 text-xs sm:text-sm">
              {/* اسم الوجبة */}
              <div>
                <label className="block font-bold text-[#11233e] mb-1">
                  اسم الوجبة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: بيتزا مارغريتا كلاسيكية"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* وصف الوجبة */}
              <div>
                <label className="block font-bold text-[#11233e] mb-1">
                  وصف الوجبة والمكونات <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="مثال: صلصة طماطم إيطالية مع جبن الموزاريلا وأوراق الريحان الطازجة وزيت الزيتون..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none resize-none"
                />
                {formErrors.description && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* السعر والتصنيف */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#11233e] mb-1">
                    السعر بالشيكل (₪) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    placeholder="مثال: 45"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none"
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-[#11233e] mb-1">
                    التصنيف <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none bg-white cursor-pointer"
                  >
                    <option value="أطباق رئيسية">أطباق رئيسية</option>
                    <option value="بيتزا وباستا">بيتزا وباستا</option>
                    <option value="مقبلات وسلطات">مقبلات وسلطات</option>
                    <option value="مشروبات">مشروبات</option>
                    <option value="حلويات">حلويات</option>
                  </select>
                </div>
              </div>

              {/* رابط الصورة مع المعاينة الحية */}
              <div>
                <label className="block font-bold text-[#11233e] mb-1">
                  رابط صورة الوجبة (أو المعاينة)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none"
                  />
                </div>
                {/* معاينة الصورة */}
                {formImage && (
                  <div className="mt-2 relative h-32 w-full rounded-xl overflow-hidden border border-[#ede7dd] bg-[#f8fafc]">
                    <img
                      src={formImage}
                      alt="معاينة"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md">
                      معاينة الصورة
                    </span>
                  </div>
                )}
              </div>

              {/* مفتاح الإتاحة للطلب */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#fbf9f5] border border-[#f1ece3]">
                <div>
                  <span className="font-bold text-[#11233e] block">حالة التوفر</span>
                  <span className="text-xs text-[#64748b]">
                    هل ترغب في ظهور هذه الوجبة في منيو الزبائن وللقرصون؟
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormAvailable(!formAvailable)}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                    formAvailable ? 'bg-[#10b981]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      formAvailable ? 'left-1' : 'left-7'
                    }`}
                  />
                </button>
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#ede7dd]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9] font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#f8a368] hover:bg-[#ea8a26] text-white font-bold shadow-sm transition-all cursor-pointer"
                >
                  {editingItem ? 'حفظ التعديلات' : 'إضافة الوجبة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
