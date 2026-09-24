import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Clock,
  Utensils,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  QrCode,
  ChefHat,
  Receipt,
  Plus,
} from 'lucide-react';
import { Order, Table, DashboardTab } from '../../types/restaurant';

interface OverviewViewProps {
  orders: Order[];
  tables: Table[];
  onNavigateTab: (tab: DashboardTab) => void;
  onSelectOrder: (order: Order) => void;
  onOpenNewOrder: () => void;
  onTogglePayment: (orderId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  orders,
  tables,
  onNavigateTab,
  onSelectOrder,
  onOpenNewOrder,
  onTogglePayment,
}) => {
  // Calculations based strictly on requirements:
  // "Count sales and meals sold from paid bills. Show unpaid bills and orders separately so totals are clear."
  const paidOrders = orders.filter((o) => o.paymentStatus === 'مدفوع');
  const unpaidOrders = orders.filter((o) => o.paymentStatus === 'غير مدفوع');

  const totalSalesPaid = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalMealsSold = paidOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, it) => s + it.qty, 0),
    0
  );

  const unpaidBillsTotal = unpaidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;

  const ordersWaitingKitchen = orders.filter(
    (o) => o.kitchenStatus === 'جديد' || o.kitchenStatus === 'قيد الطهي'
  ).length;

  const activeTablesCount = tables.filter((t) => t.status !== 'متاحة').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* الترويسة العلوية لصفحة الرئيسية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#ede7dd]/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#11233e] tracking-tight">
            نشاط المطعم اليوم
          </h1>
          <p className="text-sm text-[#64748b] font-medium mt-1">
            متابعة فورية للمبيعات الفعلية، الطاولات المفتوحة، وحالة طلبات الصالة والمطبخ.
          </p>
        </div>

        {/* أزرار الوصول السريع */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-2 bg-[#f8a368] hover:bg-[#ea8a26] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>طلب طاولة جديد</span>
          </button>
          <button
            onClick={() => onNavigateTab('المطبخ')}
            className="flex items-center gap-2 bg-[#fffdfa] hover:bg-[#fff7ee] border border-[#ede7dd] text-[#11233e] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <ChefHat className="w-4 h-4 text-[#ea8a26]" />
            <span>شاشة المطبخ</span>
            {ordersWaitingKitchen > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#f8726e] text-white text-[11px] font-black flex items-center justify-center">
                {ordersWaitingKitchen}
              </span>
            )}
          </button>
          <button
            onClick={() => onNavigateTab('روابط الوصول')}
            className="flex items-center gap-2 bg-[#eef8f5] hover:bg-[#dff3ec] text-[#0d9488] border border-[#9ee4cf]/60 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>QR المنيو</span>
          </button>
        </div>
      </div>

      {/* بطاقات الإحصائيات الست المباشرة لليوم */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* المبيعات (من الفواتير المدفوعة فقط) */}
        <div className="bg-white rounded-2xl p-5 border border-[#ede7dd] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#f8a368] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b]">المبيعات المحصلة</span>
            <div className="w-9 h-9 rounded-xl bg-[#e8f8f2] text-[#0d9488] flex items-center justify-center">
              <DollarSign className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#11233e] flex items-baseline gap-1">
              <span>{totalSalesPaid.toLocaleString()}</span>
              <span className="text-xs font-bold text-[#64748b]">₪</span>
            </div>
            <p className="text-[11px] text-[#0d9488] font-semibold mt-1">
              من {paidOrders.length} فواتير مدفوعة
            </p>
          </div>
        </div>

        {/* الوجبات المباعة (من الفواتير المدفوعة) */}
        <div className="bg-white rounded-2xl p-5 border border-[#ede7dd] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#f8a368] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b]">الوجبات المباعة</span>
            <div className="w-9 h-9 rounded-xl bg-[#fff2e5] text-[#ea8a26] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#11233e] flex items-baseline gap-1">
              <span>{totalMealsSold}</span>
              <span className="text-xs font-bold text-[#64748b]">وجبة</span>
            </div>
            <p className="text-[11px] text-[#ea8a26] font-semibold mt-1">
              تم تحصيل حسابها بالكامل
            </p>
          </div>
        </div>

        {/* إجمالي عدد الطلبات اليوم */}
        <div className="bg-white rounded-2xl p-5 border border-[#ede7dd] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#f8a368] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b]">إجمالي الطلبات</span>
            <div className="w-9 h-9 rounded-xl bg-[#f1f5f9] text-[#334155] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#11233e] flex items-baseline gap-1">
              <span>{totalOrdersCount}</span>
              <span className="text-xs font-bold text-[#64748b]">طلب</span>
            </div>
            <p className="text-[11px] text-[#64748b] font-semibold mt-1">
              {paidOrders.length} منتهٍ · {unpaidOrders.length} نشط
            </p>
          </div>
        </div>

        {/* الحسابات غير المدفوعة (منفصلة تماماً بوضوح) */}
        <div className="bg-[#fff9f9] rounded-2xl p-5 border border-[#fecaca] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#f8726e] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#991b1b]">حسابات غير مدفوعة</span>
            <div className="w-9 h-9 rounded-xl bg-[#fee2e2] text-[#ef4444] flex items-center justify-center">
              <Receipt className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#dc2626] flex items-baseline gap-1">
              <span>{unpaidBillsTotal.toLocaleString()}</span>
              <span className="text-xs font-bold text-[#dc2626]">₪</span>
            </div>
            <p className="text-[11px] text-[#991b1b] font-bold mt-1">
              {unpaidOrders.length} طاولات تنتظر التحصيل
            </p>
          </div>
        </div>

        {/* طلبات تنتظر المطبخ */}
        <div className="bg-white rounded-2xl p-5 border border-[#ede7dd] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#f8a368] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b]">تنتظر المطبخ</span>
            <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#b45309] flex items-center justify-center">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#11233e] flex items-baseline gap-1">
              <span>{ordersWaitingKitchen}</span>
              <span className="text-xs font-bold text-[#64748b]">طلب</span>
            </div>
            <p className="text-[11px] text-[#b45309] font-semibold mt-1">
              جديد أو قيد الطهي الآن
            </p>
          </div>
        </div>

        {/* حالة الطاولات النشطة */}
        <div className="bg-white rounded-2xl p-5 border border-[#ede7dd] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-[#f8a368] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b]">طاولات مشغولة</span>
            <div className="w-9 h-9 rounded-xl bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center">
              <Utensils className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-[#11233e] flex items-baseline gap-1">
              <span>{activeTablesCount}</span>
              <span className="text-xs font-bold text-[#64748b]">/ {tables.length}</span>
            </div>
            <p className="text-[11px] text-[#16a34a] font-semibold mt-1">
              {tables.length - activeTablesCount} طاولة متاحة للزبائن
            </p>
          </div>
        </div>
      </div>

      {/* قسم الطاولات السريعة + الطلبات الأخيرة */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* العمود الأيمن: قائمة الطلبات الأخيرة */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#ede7dd] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#f1ece3]">
            <div>
              <h2 className="text-lg font-bold text-[#11233e]">الطلبات الحالية والحديثة</h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                متابعة رقم الطلب، الطاولة، المجموع، وحالة الدفع والمطبخ.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('الطلبات والحسابات')}
              className="text-xs font-bold text-[#ea8a26] hover:text-[#d97706] flex items-center gap-1 cursor-pointer"
            >
              <span>عرض جميع الطلبات</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#ede7dd] text-[#64748b] font-bold">
                  <th className="pb-3 pr-2">رقم الطلب</th>
                  <th className="pb-3 px-3">الطاولة</th>
                  <th className="pb-3 px-3">الوقت والقرصون</th>
                  <th className="pb-3 px-3">حالة المطبخ</th>
                  <th className="pb-3 px-3">حالة الحساب</th>
                  <th className="pb-3 px-3">المجموع</th>
                  <th className="pb-3 pl-2 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f1ea]">
                {orders.slice(0, 6).map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#fffbf7] transition-colors cursor-pointer group"
                    onClick={() => onSelectOrder(order)}
                  >
                    <td className="py-3.5 pr-2 font-black text-[#11233e]">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[#11233e] bg-[#f8fafc] px-2.5 py-1 rounded-lg border border-[#e2e8f0]">
                        طاولة {order.tableNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[#64748b]">
                      <div className="font-semibold text-[#11233e]">{order.waiterName}</div>
                      <div className="text-[11px] text-[#94a3b8]">{order.createdAt}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          order.kitchenStatus === 'جديد'
                            ? 'bg-[#fee2e2] text-[#ef4444] border-red-200'
                            : order.kitchenStatus === 'قيد الطهي'
                            ? 'bg-[#fef3c7] text-[#b45309] border-amber-200'
                            : order.kitchenStatus === 'جاهز للتقديم'
                            ? 'bg-[#e0f2fe] text-[#0284c7] border-sky-200'
                            : 'bg-[#e8f8f2] text-[#0d9488] border-teal-200'
                        }`}
                      >
                        {order.kitchenStatus === 'جديد' && <AlertCircle className="w-3 h-3" />}
                        {order.kitchenStatus === 'جاهز للتقديم' && <CheckCircle2 className="w-3 h-3" />}
                        {order.kitchenStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          order.paymentStatus === 'مدفوع'
                            ? 'bg-[#dcfce7] text-[#15803d]'
                            : 'bg-[#fee2e2] text-[#dc2626]'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-black text-[#11233e]">
                      {order.total} ₪
                    </td>
                    <td className="py-3.5 pl-2 text-center" onClick={(e) => e.stopPropagation()}>
                      {order.paymentStatus === 'غير مدفوع' ? (
                        <button
                          onClick={() => onTogglePayment(order.id)}
                          className="bg-[#11233e] hover:bg-[#ea8a26] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
                        >
                          تحصيل ₪
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#15803d] font-bold bg-[#f0fdf4] px-2.5 py-1 rounded-lg">
                          تم الدفع ✓
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* العمود الأيسر: خريطة الطاولات السريعة */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#ede7dd] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1ece3]">
            <div>
              <h2 className="text-base font-bold text-[#11233e]">الطاولات النشطة</h2>
              <p className="text-xs text-[#64748b]">حالة الصالة اللحظية</p>
            </div>
            <button
              onClick={() => onNavigateTab('الطاولات')}
              className="text-xs font-bold text-[#ea8a26] hover:text-[#d97706] flex items-center gap-1 cursor-pointer"
            >
              <span>إدارة الطاولات</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {tables.map((table) => {
              const isOccupied = table.status !== 'متاحة';
              const hasOrderWaiting = table.status === 'بانتظار المطبخ';
              const isWaitingBill = table.status === 'بانتظار الدفع';

              return (
                <div
                  key={table.number}
                  onClick={() => onNavigateTab('الطاولات')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    hasOrderWaiting
                      ? 'bg-[#fff7ed] border-[#f8a368] text-[#c2410c]'
                      : isWaitingBill
                      ? 'bg-[#fef2f2] border-[#fca5a5] text-[#b91c1c]'
                      : isOccupied
                      ? 'bg-[#eff6ff] border-[#bfdbfe] text-[#1d4ed8]'
                      : 'bg-[#f8fafc] border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]'
                  }`}
                >
                  <span className="block text-xs font-black">طاولة {table.number}</span>
                  <span className="text-[10px] font-bold block mt-1">
                    {table.status}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#f1ece3] flex flex-wrap items-center justify-between text-[11px] text-[#64748b] gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f8fafc] border border-gray-300"></span>
              <span>متاحة</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f8a368]"></span>
              <span>بالمطبخ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]"></span>
              <span>بانتظار الدفع</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
