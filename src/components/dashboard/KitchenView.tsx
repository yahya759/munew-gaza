import React, { useState } from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  BellRing,
  Filter,
  Sparkles,
} from 'lucide-react';
import { Order, KitchenStatus } from '../../types/restaurant';

interface KitchenViewProps {
  orders: Order[];
  onUpdateKitchenStatus: (orderId: string, status: KitchenStatus) => void;
}

export const KitchenView: React.FC<KitchenViewProps> = ({
  orders,
  onUpdateKitchenStatus,
}) => {
  const [filterMode, setFilterMode] = useState<'نشط' | 'الكل'>('نشط');

  // Filter orders
  const activeOrders = orders.filter((o) => {
    if (filterMode === 'نشط') {
      return o.kitchenStatus !== 'تم التقديم';
    }
    return true;
  });

  const newOrdersCount = orders.filter((o) => o.kitchenStatus === 'جديد').length;
  const cookingOrdersCount = orders.filter((o) => o.kitchenStatus === 'قيد الطهي').length;
  const readyOrdersCount = orders.filter((o) => o.kitchenStatus === 'جاهز للتقديم').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* الترويسة العلوية لشاشة المطبخ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#ede7dd]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#11233e]">شاشة وتحديثات المطبخ (KDS)</h1>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1">
            استقبال فوري للطلبات مع وصولها من القرصون، وتحديث مراحل التحضير خطوة بخطوة.
          </p>
        </div>

        {/* مؤشرات الحالة في المطبخ */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#fef2f2] border border-[#fecaca] px-3 py-1.5 rounded-xl text-xs font-bold text-[#b91c1c]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>{newOrdersCount} جديد</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#fff7ed] border border-[#fed7aa] px-3 py-1.5 rounded-xl text-xs font-bold text-[#c2410c]">
            <Flame className="w-3.5 h-3.5" />
            <span>{cookingOrdersCount} قيد الطهي</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#f0fdf4] border border-[#bbf7d0] px-3 py-1.5 rounded-xl text-xs font-bold text-[#15803d]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{readyOrdersCount} جاهز</span>
          </div>
        </div>
      </div>

      {/* شريط الفلترة */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#ede7dd]">
        <span className="text-xs text-[#64748b] font-bold">
          عرض التذاكر: {activeOrders.length} تذكرة طهي
        </span>
        <div className="flex items-center gap-1 bg-[#f8fafc] p-1 rounded-xl border border-[#e2e8f0] text-xs">
          <button
            onClick={() => setFilterMode('نشط')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterMode === 'نشط'
                ? 'bg-[#11233e] text-white'
                : 'text-[#64748b] hover:text-[#11233e]'
            }`}
          >
            الطلبات النشطة فقط
          </button>
          <button
            onClick={() => setFilterMode('الكل')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterMode === 'الكل'
                ? 'bg-[#11233e] text-white'
                : 'text-[#64748b] hover:text-[#11233e]'
            }`}
          >
            كافة التذاكر (بما فيها المنتهية)
          </button>
        </div>
      </div>

      {/* شبكة تذاكر المطبخ المتجاوبة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {activeOrders.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-[#ede7dd] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#11233e]">لا توجد طلبات معلقة في المطبخ</h3>
            <p className="text-xs text-[#64748b]">
              جميع الطلبات تم تقديمها للزبائن بنجاح.
            </p>
          </div>
        ) : (
          activeOrders.map((order) => {
            const isNew = order.kitchenStatus === 'جديد';
            const isCooking = order.kitchenStatus === 'قيد الطهي';
            const isReady = order.kitchenStatus === 'جاهز للتقديم';
            const isServed = order.kitchenStatus === 'تم التقديم';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border-2 flex flex-col justify-between overflow-hidden shadow-xs transition-all ${
                  isNew
                    ? 'border-red-400 ring-2 ring-red-100'
                    : isCooking
                    ? 'border-[#f8a368]'
                    : isReady
                    ? 'border-sky-400 bg-sky-50/20'
                    : 'border-[#ede7dd] opacity-70'
                }`}
              >
                <div>
                  {/* ترويسة التذكرة */}
                  <div
                    className={`p-3.5 flex items-center justify-between border-b ${
                      isNew
                        ? 'bg-[#fee2e2] border-red-200'
                        : isCooking
                        ? 'bg-[#fff2e5] border-[#fbd4b6]'
                        : isReady
                        ? 'bg-[#e0f2fe] border-sky-200'
                        : 'bg-[#f8fafc] border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#11233e] text-white flex items-center justify-center font-black text-sm">
                        ط {order.tableNumber}
                      </div>
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-[#11233e]">
                          طاولة {order.tableNumber}
                        </h4>
                        <span className="text-[10px] text-[#64748b] block">
                          طلب #{order.orderNumber} · {order.waiterName}
                        </span>
                      </div>
                    </div>

                    <div className="text-left">
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          isNew
                            ? 'bg-red-500 text-white animate-pulse'
                            : isCooking
                            ? 'bg-[#ea580c] text-white'
                            : isReady
                            ? 'bg-[#0284c7] text-white'
                            : 'bg-gray-400 text-white'
                        }`}
                      >
                        {order.kitchenStatus}
                      </span>
                      <span className="block text-[10px] text-[#64748b] mt-0.5">
                        {order.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* تنبيه إذا تم تحديث الطلب أو تعديله من قبل الكاشير */}
                  {order.changeRequest?.status === 'تمت الموافقة' && (
                    <div className="bg-[#ecfdf5] border-b border-emerald-200 p-2 text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تحديث جديد معتمد من الإدارة لهذا الطلب!</span>
                    </div>
                  )}

                  {/* قائمة الأطباق المطلوب تحضيرها */}
                  <div className="p-4 space-y-2.5">
                    {order.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex items-start justify-between pb-2 border-b border-[#f5f1ea] last:border-none last:pb-0"
                      >
                        <div className="flex items-start gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#11233e]/5 text-[#11233e] font-black text-xs flex items-center justify-center shrink-0">
                            {item.qty}×
                          </span>
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-[#11233e] block leading-snug">
                              {item.name}
                            </span>
                            {item.notes && (
                              <span className="text-[11px] text-[#ea580c] font-semibold block mt-0.5">
                                ملاحظة: {item.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* أزرار تقدم مراحل الطهي اللمسية للمطبخ */}
                <div className="p-3 bg-[#fbf9f5] border-t border-[#f1ece3] space-y-1.5">
                  {isNew && (
                    <button
                      onClick={() => onUpdateKitchenStatus(order.id, 'قيد الطهي')}
                      className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98 cursor-pointer"
                    >
                      <Flame className="w-4 h-4" />
                      <span>بدء تحضير الطلب</span>
                    </button>
                  )}

                  {isCooking && (
                    <button
                      onClick={() => onUpdateKitchenStatus(order.id, 'جاهز للتقديم')}
                      className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98 cursor-pointer"
                    >
                      <BellRing className="w-4 h-4" />
                      <span>جاهز للتقديم (إشعار القرصون)</span>
                    </button>
                  )}

                  {isReady && (
                    <button
                      onClick={() => onUpdateKitchenStatus(order.id, 'تم التقديم')}
                      className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تم تسليم الطلب للطاولة</span>
                    </button>
                  )}

                  {isServed && (
                    <button
                      onClick={() => onUpdateKitchenStatus(order.id, 'قيد الطهي')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-[#64748b] py-1.5 rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      إعادة إلى قيد الطهي
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
