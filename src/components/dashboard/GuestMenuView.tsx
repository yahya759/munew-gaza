import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Search,
  Info,
  Clock,
  MapPin,
  Phone,
  QrCode,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { MenuItem, RestaurantSettings } from '../../types/restaurant';

interface GuestMenuViewProps {
  menuItems: MenuItem[];
  settings: RestaurantSettings;
  onBackToDashboard: () => void;
}

export const GuestMenuView: React.FC<GuestMenuViewProps> = ({
  menuItems,
  settings,
  onBackToDashboard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  // Guest menu displays ONLY available dishes
  const availableItems = menuItems.filter((i) => i.isAvailable);
  const categories = ['الكل', ...new Set(availableItems.map((i) => i.category))];

  const filteredItems = availableItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesSearch =
      item.name.includes(searchQuery) || item.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#11233e] font-['Cairo',sans-serif] pb-16">
      {/* شريط الإشعار العلوي الثابت الصريح: للعرض فقط */}
      <div className="bg-[#11233e] text-white px-4 py-2.5 text-center text-xs font-bold flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 mx-auto">
          <Info className="w-4 h-4 text-[#f8a368] shrink-0" />
          <span>
            قائمة طعام رقمية <strong>للعرض فقط</strong> · يرجى الطلب مباشرة عبر القرصون عند طاولتك
          </span>
        </div>
        <button
          onClick={onBackToDashboard}
          className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          لوحة المالك
        </button>
      </div>

      {/* ترويسة المطعم والتعريف */}
      <div className="relative bg-gradient-to-b from-[#fff2e5]/80 to-transparent px-5 pt-8 pb-6 border-b border-[#ede7dd]/60">
        <div className="max-w-2xl mx-auto text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-[#f8a368] text-white flex items-center justify-center mx-auto shadow-sm">
            <UtensilsCrossed className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#11233e]">
            {settings.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] font-medium">
            {settings.tagline}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#64748b] pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#f87171]" />
              {settings.address}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#0d9488]" />
              {settings.phone}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#ea8a26]" />
              {settings.openingHours}
            </span>
          </div>
        </div>
      </div>

      {/* محتوى المنيو */}
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {/* شريط البحث وتصنيفات المنيو */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94a3b8] absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث في قائمة الطعام..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-white text-xs sm:text-sm rounded-2xl border border-[#ede7dd] shadow-xs focus:border-[#f8a368] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#11233e] text-white shadow-xs'
                    : 'bg-white border border-[#ede7dd] text-[#64748b] hover:bg-[#fff9f4]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* تنبيه شفاف إضافي */}
        <div className="bg-[#fff9f2] border border-[#fbd4b6] p-3 rounded-2xl flex items-center gap-2.5 text-xs text-[#9a3412]">
          <ShieldCheck className="w-4 h-4 text-[#ea8a26] shrink-0" />
          <span>
            الأسعار المعروضة بالشيكل (₪) وتشمل التقديم في الصالة. القرصون سيسعد بتسجيل طلبك عند الطاولة.
          </span>
        </div>

        {/* شبكة الأطباق للزبائن */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#ede7dd] p-3 sm:p-4 shadow-xs flex flex-row items-center gap-4 hover:border-[#f8a368] transition-all"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 bg-gray-100"
              />
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#11233e] leading-snug">
                    {item.name}
                  </h3>
                  <span className="text-base sm:text-lg font-black text-[#ea8a26] shrink-0">
                    {item.price} ₪
                  </span>
                </div>
                <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="pt-1">
                  <span className="inline-block text-[10px] font-bold bg-[#f1f5f9] text-[#475569] px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="p-12 text-center text-[#94a3b8] text-xs">
              لا توجد وجبات متوفرة مطابقة للبحث حالياً.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
