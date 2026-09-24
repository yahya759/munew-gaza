import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Minus,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  Search,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { MenuItem, Table, Order, OrderItem } from '../../types/restaurant';

interface WaiterViewProps {
  menuItems: MenuItem[];
  tables: Table[];
  orders: Order[];
  preselectedTableNumber?: number | null;
  onSubmitNewOrder: (tableNumber: number, waiterName: string, items: OrderItem[]) => void;
  onRequestOrderChange: (
    orderId: string,
    waiterName: string,
    reason: string,
    addedItems: OrderItem[]
  ) => void;
  onDirectEditOrder: (orderId: string, items: OrderItem[]) => void;
  onBackToDashboard: () => void;
}

export const WaiterView: React.FC<WaiterViewProps> = ({
  menuItems,
  tables,
  orders,
  preselectedTableNumber,
  onSubmitNewOrder,
  onRequestOrderChange,
  onDirectEditOrder,
  onBackToDashboard,
}) => {
  const [selectedTableNum, setSelectedTableNum] = useState<number>(
    preselectedTableNumber || tables[0]?.number || 1
  );
  const [waiterName, setWaiterName] = useState('عمر س.');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart for new order
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [itemNotes, setItemNotes] = useState<{ [itemId: string]: string }>({});

  // Change request state for existing in-progress order
  const [changeReason, setChangeReason] = useState('');
  const [showChangeModal, setShowChangeModal] = useState(false);

  // Check if current table has an active unpaid order
  const activeOrderOnTable = orders.find(
    (o) => o.tableNumber === selectedTableNum && o.paymentStatus === 'غير مدفوع'
  );

  const availableItems = menuItems.filter((i) => i.isAvailable);
  const categories = ['الكل', ...new Set(availableItems.map((i) => i.category))];

  const filteredItems = availableItems.filter((i) => {
    const matchCat = selectedCategory === 'الكل' || i.category === selectedCategory;
    const matchSearch = i.name.includes(searchQuery) || i.description.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const addToCart = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const cur = prev[itemId] || 0;
      if (cur <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: cur - 1 };
    });
  };

  const clearItemFromCart = (itemId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const cartList: OrderItem[] = Object.keys(cart).map((itemId) => {
    const item = menuItems.find((i) => i.id === itemId)!;
    return {
      id: `cart-${itemId}`,
      menuItemId: itemId,
      name: item.name,
      price: item.price,
      qty: cart[itemId],
      notes: itemNotes[itemId],
    };
  });

  const cartTotal = cartList.reduce((sum, it) => sum + it.qty * it.price, 0);

  const handleSubmit = () => {
    if (cartList.length === 0) {
      alert('يرجى اختيار صنف واحد على الأقل قبل إرسال الطلب.');
      return;
    }

    // If table already has an active order:
    if (activeOrderOnTable) {
      // Rule check:
      // "A waiter can edit a submitted order while the kitchen has not started preparing it.
      // Once preparation has started, route requested changes for manager/cashier approval and show the updated order to the kitchen."
      if (activeOrderOnTable.kitchenStatus === 'جديد') {
        // Direct edit allowed!
        const mergedItems = [...activeOrderOnTable.items, ...cartList];
        onDirectEditOrder(activeOrderOnTable.id, mergedItems);
        setCart({});
        alert(`تمت إضافة الأطباق بنجاح مباشرة إلى طلب طاولة ${selectedTableNum} نظراً لأن المطبخ لم يبدأ الطهي بعد.`);
      } else {
        // Preparation started! Route for approval
        setShowChangeModal(true);
      }
      return;
    }

    // Brand new order:
    onSubmitNewOrder(selectedTableNum, waiterName, cartList);
    setCart({});
    setItemNotes({});
    alert(`تم إرسال طلب طاولة ${selectedTableNum} فورياً إلى شاشة المطبخ والكاشير.`);
  };

  const handleConfirmChangeRequest = () => {
    if (!activeOrderOnTable) return;
    if (!changeReason.trim()) {
      alert('يرجى ذكر سبب تعديل الطلب للإدارة.');
      return;
    }
    onRequestOrderChange(activeOrderOnTable.id, waiterName, changeReason, cartList);
    setCart({});
    setShowChangeModal(false);
    setChangeReason('');
    alert(
      `تم إرسال طلب التعديل إلى الكاشير والمدير للموافقة، نظراً لأن المطبخ في مرحلة "${activeOrderOnTable.kitchenStatus}".`
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* الترويسة وأزرار التحكم */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#ede7dd]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-2xl font-black text-[#11233e]">واجهة القرصون (تسجيل الطلبات)</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1">
            اختر الطاولة، أضف الأطباق، وسيتم إرسال الطلب فورياً للكاشير والمطبخ معاً.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-[#ede7dd] px-3 py-1.5 rounded-xl text-xs">
            <span className="text-[#64748b]">القرصون:</span>
            <input
              type="text"
              value={waiterName}
              onChange={(e) => setWaiterName(e.target.value)}
              className="font-bold text-[#11233e] w-24 outline-none border-b border-dashed border-[#ea8a26]"
            />
          </div>
          <button
            onClick={onBackToDashboard}
            className="text-xs font-bold text-[#ea8a26] hover:bg-[#fff2e5] px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            العودة للوحة التحكم
          </button>
        </div>
      </div>

      {/* شريط اختيار الطاولة السريع */}
      <div className="bg-white p-4 rounded-2xl border border-[#ede7dd] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#11233e]">اختر رقم الطاولة لتسجيل الطلب:</span>
          {activeOrderOnTable && (
            <span className="text-[11px] font-bold text-[#b45309] bg-[#fef3c7] px-2.5 py-0.5 rounded-full">
              يوجد طلب نشط #{activeOrderOnTable.orderNumber} (المطبخ: {activeOrderOnTable.kitchenStatus})
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tables.map((t) => {
            const isSelected = selectedTableNum === t.number;
            const hasOrder = orders.some(
              (o) => o.tableNumber === t.number && o.paymentStatus === 'غير مدفوع'
            );

            return (
              <button
                key={t.number}
                onClick={() => setSelectedTableNum(t.number)}
                className={`px-4 py-2 rounded-xl font-black text-xs shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#11233e] text-white shadow-sm ring-2 ring-[#ea8a26]'
                    : hasOrder
                    ? 'bg-[#fff2e5] border border-[#fbd4b6] text-[#ea580c]'
                    : 'bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9]'
                }`}
              >
                طاولة {t.number}
              </button>
            );
          })}
        </div>
      </div>

      {/* الشاشة المقسمة: قائمة المنيو يميناً + سلة طاولة القرصون يساراً */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* أصناف المنيو */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* تصنيفات وبحث */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#ede7dd]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94a3b8] absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث عن طبق بالاسم أو المكونات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-1.5 text-xs rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#ea8a26] text-white'
                      : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* شبكة الأطباق */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const inCartQty = cart[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#ede7dd] overflow-hidden shadow-xs hover:border-[#f8a368] transition-all flex flex-col justify-between"
                >
                  <div className="p-3 flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-gray-100"
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-[#11233e] leading-snug line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#64748b] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <span className="font-black text-xs text-[#ea8a26] block">
                        {item.price} ₪
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fbf9f5] border-t border-[#f1ece3] flex items-center justify-between">
                    {inCartQty > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#e2e8f0] text-[#11233e] font-black flex items-center justify-center cursor-pointer hover:bg-red-50 hover:text-red-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-black text-sm text-[#11233e] px-1">
                          {inCartQty}
                        </span>
                        <button
                          onClick={() => addToCart(item.id)}
                          className="w-7 h-7 rounded-lg bg-[#ea8a26] text-white font-black flex items-center justify-center cursor-pointer hover:bg-[#d97706]"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#94a3b8]">غير محدد</span>
                    )}

                    <button
                      onClick={() => addToCart(item.id)}
                      className="bg-[#11233e] hover:bg-[#ea8a26] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                      <span>إضافة</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* سلة طاولة القرصون */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl border border-[#ede7dd] p-5 shadow-xs sticky top-24 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ede7dd]">
            <div>
              <span className="text-xs text-[#64748b] block">طلب الطاولة الحالي</span>
              <h3 className="text-lg font-black text-[#11233e]">طاولة {selectedTableNum}</h3>
            </div>
            <span className="bg-[#fff2e5] text-[#ea8a26] border border-[#fbd4b6] px-3 py-1 rounded-full text-xs font-bold">
              {cartList.length} أصناف جديدة
            </span>
          </div>

          {/* تنبيه إذا كانت الطاولة قيد التحضير في المطبخ بالفعل */}
          {activeOrderOnTable && (
            <div className="bg-[#fffbeb] border border-[#fde68a] p-3 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>حالة المطبخ الحالية: ({activeOrderOnTable.kitchenStatus})</span>
              </div>
              <p className="text-[11px] text-amber-800">
                {activeOrderOnTable.kitchenStatus === 'جديد'
                  ? 'المطبخ لم يبدأ الطهي بعد؛ يمكنك إضافة الأطباق مباشرة دون انتظار موافقة.'
                  : 'بدأ المطبخ بالطهي بالفعل؛ سيتم إرسال أي إضافات جديدة لاعتماد المدير/الكاشير أولاً.'}
              </p>
            </div>
          )}

          {/* قائمة الأطباق المحددة في السلة */}
          <div className="space-y-2">
            {cartList.length === 0 ? (
              <div className="p-8 text-center text-[#94a3b8] text-xs space-y-2 bg-[#fbf9f5] rounded-2xl border border-dashed border-[#ede7dd]">
                <UtensilsCrossed className="w-8 h-8 mx-auto text-[#cbd5e1]" />
                <p>السلة فارغة. انقر على "إضافة" بجانب أي طبق في القائمة لإدراجه للطاولة.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#f5f1ea] border border-[#ede7dd] rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                {cartList.map((item) => (
                  <div key={item.id} className="p-3 bg-white space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#11233e]">{item.name}</span>
                      <span className="font-black text-xs text-[#11233e]">
                        {item.qty * item.price} ₪
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.menuItemId)}
                          className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-black text-xs">{item.qty}</span>
                        <button
                          onClick={() => addToCart(item.menuItemId)}
                          className="w-6 h-6 rounded bg-[#ea8a26] text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => clearItemFromCart(item.menuItemId)}
                        className="text-red-500 hover:text-red-700 text-[11px] font-bold"
                      >
                        حذف
                      </button>
                    </div>

                    {/* ملاحظات خاصة للطبق (مثلاً: بدون بصل) */}
                    <input
                      type="text"
                      placeholder="ملاحظة للمطبخ (اختياري)..."
                      value={itemNotes[item.menuItemId] || ''}
                      onChange={(e) =>
                        setItemNotes((prev) => ({
                          ...prev,
                          [item.menuItemId]: e.target.value,
                        }))
                      }
                      className="w-full text-[11px] px-2.5 py-1 rounded-lg border border-[#e2e8f0] outline-none text-[#64748b] bg-[#faf8f5]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* إجمالي السلة */}
          <div className="pt-3 border-t border-[#ede7dd] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#64748b]">
              <span>مجموع الإضافة الجديدة</span>
              <span className="font-black text-[#11233e] text-base">{cartTotal} ₪</span>
            </div>

            {activeOrderOnTable && (
              <div className="flex items-center justify-between text-[11px] text-[#64748b] bg-[#f8fafc] p-2 rounded-xl">
                <span>الحساب السابق غير المدفوع:</span>
                <span className="font-bold text-[#11233e]">{activeOrderOnTable.total} ₪</span>
              </div>
            )}
          </div>

          {/* زر إرسال الطلب */}
          <button
            onClick={handleSubmit}
            disabled={cartList.length === 0}
            className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98 ${
              cartList.length > 0
                ? 'bg-[#f8a368] hover:bg-[#ea8a26] text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {activeOrderOnTable
                ? activeOrderOnTable.kitchenStatus === 'جديد'
                  ? `تحديث طلب طاولة ${selectedTableNum} مباشرة`
                  : `طلب اعتماد الإضافة لطاولة ${selectedTableNum}`
                : `إرسال طلب طاولة ${selectedTableNum} للمطبخ والكاشير`}
            </span>
          </button>
        </div>
      </div>

      {/* نافذة طلب الاعتماد لتعديل طلب بدأ طهيه */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#ede7dd] space-y-4">
            <div className="flex items-center gap-2 text-amber-900 font-black text-base">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>اعتماد تعديل طلب قيد التحضير بالمطبخ</span>
            </div>
            <p className="text-xs text-[#64748b] leading-relaxed">
              بدأ المطبخ بالفعل في طهي طلب طاولة {selectedTableNum} (الحالة: {activeOrderOnTable?.kitchenStatus}).
              لتجنب هدر الطعام، يرجى كتابة سبب التعديل ليتم إرساله للكاشير/المدير للموافقة وتحديث شاشة المطبخ.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#11233e] mb-1">
                سبب التعديل أو طلب الزبون <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="مثال: طلب الزبون إضافة طبقين آخرين بعد استلام الوجبة الأولى..."
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowChangeModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-[#e2e8f0] text-[#64748b] cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmChangeRequest}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#ea580c] hover:bg-[#c2410c] text-white cursor-pointer shadow-sm"
              >
                إرسال للاعتماد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
