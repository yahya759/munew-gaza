import React, { useState } from 'react';
import {
  Search,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  DollarSign,
  Printer,
  ChevronDown,
  User,
  ArrowRight,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { Order, OrderItem, OrderChangeRequest } from '../../types/restaurant';

interface OrdersCashierViewProps {
  orders: Order[];
  onTogglePayment: (orderId: string) => void;
  onUpdateKitchenStatus: (orderId: string, status: Order['kitchenStatus']) => void;
  onApproveChangeRequest: (orderId: string, approve: boolean) => void;
}

export const OrdersCashierView: React.FC<OrdersCashierViewProps> = ({
  orders,
  onTogglePayment,
  onUpdateKitchenStatus,
  onApproveChangeRequest,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState<'الكل' | 'غير مدفوع' | 'مدفوع'>('الكل');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.tableNumber.toString().includes(searchTerm) ||
      order.orderNumber.toString().includes(searchTerm) ||
      order.waiterName.includes(searchTerm);

    const matchesPayment =
      filterPayment === 'الكل' || order.paymentStatus === filterPayment;

    return matchesSearch && matchesPayment;
  });

  const unpaidCount = orders.filter((o) => o.paymentStatus === 'غير مدفوع').length;
  const unpaidTotal = orders
    .filter((o) => o.paymentStatus === 'غير مدفوع')
    .reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* الترويسة وأشرطة البحث السريعة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#ede7dd]">
        <div>
          <h1 className="text-2xl font-black text-[#11233e]">
            إدارة الطلبات والحسابات (الكاشير)
          </h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1">
            البحث برقم الطاولة أو الطلب، مراجعة الفاتورة التفصيلية، وتحصيل المدفوعات.
          </p>
        </div>

        {/* مؤشر الحسابات غير المدفوعة العاجلة */}
        <div className="flex items-center gap-3 bg-[#fff5f5] border border-[#fecaca] px-4 py-2.5 rounded-2xl">
          <Receipt className="w-5 h-5 text-[#ef4444]" />
          <div>
            <span className="text-[11px] text-[#991b1b] font-bold block">
              غير محصل ({unpaidCount} طلبات):
            </span>
            <span className="text-sm font-black text-[#dc2626]">
              {unpaidTotal.toLocaleString()} ₪
            </span>
          </div>
        </div>
      </div>

      {/* شريط التصفية والبحث */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#ede7dd]">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#94a3b8] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث برقم الطاولة (مثلاً 4)، رقم الطلب، أو اسم القرصون..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-xs sm:text-sm rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] focus:ring-1 focus:ring-[#f8a368] outline-none"
          />
        </div>

        {/* فلترة حالة الدفع */}
        <div className="flex items-center gap-1.5 bg-[#f8fafc] p-1 rounded-xl border border-[#e2e8f0]">
          {(['الكل', 'غير مدفوع', 'مدفوع'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterPayment(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterPayment === tab
                  ? 'bg-white text-[#11233e] shadow-xs'
                  : 'text-[#64748b] hover:text-[#11233e]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* طلبات التعديل المعلقة التي تتطلب موافقة الكاشير / المدير */}
      {orders.some((o) => o.changeRequest && o.changeRequest.status === 'بانتظار الموافقة') && (
        <div className="bg-[#fffbeb] border border-[#fde68a] p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>طلب تعديل بعد بدء طهي الطلب (يتطلب موافقة المدير/الكاشير):</span>
          </div>
          {orders
            .filter((o) => o.changeRequest && o.changeRequest.status === 'بانتظار الموافقة')
            .map((order) => (
              <div
                key={order.id}
                className="bg-white p-3.5 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-black text-[#11233e]">
                    طاولة {order.tableNumber} (طلب #{order.orderNumber})
                  </span>
                  <span className="text-[#64748b] mr-2">
                    القرصون: {order.changeRequest?.waiterName} · سبب التعديل: {order.changeRequest?.reason}
                  </span>
                  <div className="mt-1 font-semibold text-amber-800">
                    الإضافة المطلوبة: {order.changeRequest?.addedItems.map((i) => `${i.qty}× ${i.name}`).join('، ')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onApproveChangeRequest(order.id, true)}
                    className="bg-[#10b981] hover:bg-[#059669] text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>موافقة وتحديث المطبخ</span>
                  </button>
                  <button
                    onClick={() => onApproveChangeRequest(order.id, false)}
                    className="bg-[#f1f5f9] hover:bg-[#fee2e2] text-[#ef4444] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>رفض التعديل</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* الشاشة المقسمة: قائمة الطلبات يميناً + تفاصيل الفاتورة والحساب يساراً */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* قائمة الطلبات */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#ede7dd] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#ede7dd] flex items-center justify-between">
            <span className="font-bold text-sm text-[#11233e]">
              قائمة الفواتير ({filteredOrders.length})
            </span>
            <span className="text-xs text-[#64748b]">اختر طلباً لعرض تفاصيل الحساب</span>
          </div>

          <div className="divide-y divide-[#f5f1ea] max-h-[600px] overflow-y-auto">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-[#94a3b8] text-xs sm:text-sm">
                لا توجد طلبات مطابقة لمعايير البحث الحالية.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#fff8f2] border-r-4 border-r-[#ea8a26]'
                        : 'hover:bg-[#faf8f5]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#11233e]">
                          طاولة {order.tableNumber}
                        </span>
                        <span className="text-xs font-semibold text-[#64748b]">
                          #{order.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            order.paymentStatus === 'مدفوع'
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : 'bg-[#fee2e2] text-[#dc2626]'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748b]">
                        القرصون: {order.waiterName} · {order.createdAt}
                      </div>
                    </div>

                    <div className="text-left flex flex-col items-end gap-1.5">
                      <span className="text-base font-black text-[#11233e]">
                        {order.total} ₪
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                          order.kitchenStatus === 'جديد'
                            ? 'bg-[#fee2e2] text-[#ef4444] border-red-200'
                            : order.kitchenStatus === 'قيد الطهي'
                            ? 'bg-[#fef3c7] text-[#b45309] border-amber-200'
                            : order.kitchenStatus === 'جاهز للتقديم'
                            ? 'bg-[#e0f2fe] text-[#0284c7] border-sky-200'
                            : 'bg-[#e8f8f2] text-[#0d9488] border-teal-200'
                        }`}
                      >
                        المطبخ: {order.kitchenStatus}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* تفاصيل الفاتورة والمحاسبة (الكاشير) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#ede7dd] p-5 shadow-xs sticky top-24">
          {selectedOrder ? (
            <div className="space-y-5">
              {/* ترويسة الفاتورة */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#ede7dd]">
                <div>
                  <span className="text-xs text-[#64748b]">فاتورة الحساب</span>
                  <h3 className="text-lg font-black text-[#11233e]">
                    طاولة {selectedOrder.tableNumber} · طلب #{selectedOrder.orderNumber}
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    selectedOrder.paymentStatus === 'مدفوع'
                      ? 'bg-[#dcfce7] text-[#15803d]'
                      : 'bg-[#fee2e2] text-[#dc2626]'
                  }`}
                >
                  {selectedOrder.paymentStatus}
                </span>
              </div>

              {/* بيانات النادل والوقت */}
              <div className="flex items-center justify-between text-xs text-[#64748b] bg-[#fbf9f5] p-2.5 rounded-xl border border-[#f1ece3]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#11233e]" />
                  <span>القرصون: <strong className="text-[#11233e]">{selectedOrder.waiterName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedOrder.createdAt}</span>
                </div>
              </div>

              {/* جدول الأصناف التفصيلية */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#64748b] block">الأطباق المطلوبة:</span>
                <div className="divide-y divide-[#f5f1ea] border border-[#f1ece3] rounded-xl overflow-hidden text-xs">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 flex items-center justify-between bg-white hover:bg-[#fffbf7]"
                    >
                      <div>
                        <span className="font-bold text-[#11233e] block">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#64748b]">
                          {item.qty} × {item.price} ₪
                        </span>
                      </div>
                      <span className="font-black text-[#11233e]">
                        {item.qty * item.price} ₪
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* مجموع الفاتورة الصافي */}
              <div className="pt-3 border-t border-[#ede7dd] space-y-2">
                <div className="flex items-center justify-between text-xs text-[#64748b]">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold text-[#11233e]">{selectedOrder.total} ₪</span>
                </div>
                <div className="flex items-center justify-between text-base font-black text-[#11233e] bg-[#fff2e5] p-3 rounded-xl border border-[#fbd4b6]">
                  <span>إجمالي الحساب للدفع</span>
                  <span className="text-xl text-[#ea8a26]">{selectedOrder.total} ₪</span>
                </div>
              </div>

              {/* إجراءات الكاشير: تحصيل المبلغ، تبديل الحالة، وطباعة */}
              <div className="space-y-2.5 pt-2">
                {selectedOrder.paymentStatus === 'غير مدفوع' ? (
                  <button
                    onClick={() => onTogglePayment(selectedOrder.id)}
                    className="w-full bg-[#10b981] hover:bg-[#059669] text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>تحصيل الحساب كاش / بطاقة ({selectedOrder.total} ₪)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onTogglePayment(selectedOrder.id)}
                    className="w-full bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#64748b] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>إعادة الفاتورة كـ (غير مدفوعة) للتعديل</span>
                  </button>
                )}

                {/* تحديث حالة المطبخ يدوياً من الكاشير عند الحاجة */}
                <div className="pt-2 border-t border-[#ede7dd] flex items-center justify-between text-xs">
                  <span className="text-[#64748b]">حالة تجهيز المطبخ:</span>
                  <div className="flex items-center gap-1">
                    {(['جديد', 'قيد الطهي', 'جاهز للتقديم', 'تم التقديم'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateKitchenStatus(selectedOrder.id, st)}
                        className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                          selectedOrder.kitchenStatus === st
                            ? 'bg-[#11233e] text-white'
                            : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#94a3b8] text-xs">
              الرجاء تحديد طلب من القائمة لمعاينة الفاتورة.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
