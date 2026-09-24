import React, { useState } from 'react';
import {
  Grid,
  Plus,
  Layers,
  Utensils,
  Receipt,
  Clock,
  CheckCircle2,
  Trash2,
  User,
  ExternalLink,
} from 'lucide-react';
import { Table, Order } from '../../types/restaurant';

interface TablesViewProps {
  tables: Table[];
  orders: Order[];
  onGenerateTablesCount: (count: number) => void;
  onAddManualTable: (tableNumber: number, capacity: number) => void;
  onDeleteTable: (tableNumber: number) => void;
  onOpenOrderForTable: (tableNumber: number) => void;
  onOpenCashierForTable: (tableNumber: number) => void;
}

export const TablesView: React.FC<TablesViewProps> = ({
  tables,
  orders,
  onGenerateTablesCount,
  onAddManualTable,
  onDeleteTable,
  onOpenOrderForTable,
  onOpenCashierForTable,
}) => {
  const [generateCountInput, setGenerateCountInput] = useState('12');
  const [manualNumberInput, setManualNumberInput] = useState('');
  const [manualCapacityInput, setManualCapacityInput] = useState('4');
  const [selectedTable, setSelectedTable] = useState<Table | null>(tables[0] || null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(generateCountInput);
    if (!isNaN(count) && count > 0 && count <= 50) {
      if (
        confirm(
          `هل تريد إعادة ضبط الطاولات وإنشاء ${count} طاولات مرقمة تلقائياً من 1 إلى ${count}؟`
        )
      ) {
        onGenerateTablesCount(count);
      }
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(manualNumberInput);
    const cap = parseInt(manualCapacityInput) || 4;
    if (isNaN(num) || num <= 0) {
      alert('يرجى إدخال رقم طاولة صحيح');
      return;
    }
    if (tables.some((t) => t.number === num)) {
      alert(`الطاولة رقم ${num} موجودة بالفعل.`);
      return;
    }
    onAddManualTable(num, cap);
    setManualNumberInput('');
  };

  const currentOrder = selectedTable
    ? orders.find((o) => o.tableNumber === selectedTable.number && o.paymentStatus === 'غير مدفوع')
    : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* الترويسة العلوية */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#ede7dd]">
        <div>
          <h1 className="text-2xl font-black text-[#11233e]">إدارة طاولات الصالة</h1>
          <p className="text-xs sm:text-sm text-[#64748b] mt-1">
            تهيئة عدد الطاولات، إضافة طاولات فردية، ومتابعة حالة الإشغال والطلبات الحالية.
          </p>
        </div>

        {/* إحصائيات سريعة للطاولات */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] px-3 py-1.5 rounded-xl">
            {tables.filter((t) => t.status === 'متاحة').length} متاحة
          </span>
          <span className="bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] px-3 py-1.5 rounded-xl">
            {tables.filter((t) => t.status !== 'متاحة').length} مشغولة
          </span>
          <span className="bg-[#f8fafc] text-[#475569] border border-[#e2e8f0] px-3 py-1.5 rounded-xl">
            الإجمالي: {tables.length} طاولة
          </span>
        </div>
      </div>

      {/* شريط الإعداد السريع: توليد حسب العدد أو إضافة يدوية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* التوليد التلقائي حسب العدد */}
        <form
          onSubmit={handleGenerate}
          className="bg-white p-4 rounded-2xl border border-[#ede7dd] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fff2e5] text-[#ea8a26] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-[#11233e] block">توليد الطاولات حسب العدد</span>
              <span className="text-[11px] text-[#64748b]">إنشاء طاولات متسلسلة (1 .. N)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="number"
              min="1"
              max="50"
              value={generateCountInput}
              onChange={(e) => setGenerateCountInput(e.target.value)}
              className="w-20 px-3 py-2 rounded-xl border border-[#e2e8f0] text-center font-bold focus:border-[#f8a368] outline-none"
            />
            <button
              type="submit"
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#11233e] hover:bg-[#ea8a26] text-white font-bold transition-all cursor-pointer"
            >
              توليد
            </button>
          </div>
        </form>

        {/* الإضافة اليدوية لطاولة واحدة */}
        <form
          onSubmit={handleManualAdd}
          className="bg-white p-4 rounded-2xl border border-[#ede7dd] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#e8f8f2] text-[#0d9488] flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <span className="font-bold text-[#11233e] block">إضافة طاولة يدوياً</span>
              <span className="text-[11px] text-[#64748b]">تحديد رقم الطاولة وسعة المقاعد</span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="number"
              min="1"
              placeholder="الرقم"
              value={manualNumberInput}
              onChange={(e) => setManualNumberInput(e.target.value)}
              className="w-16 px-2.5 py-2 rounded-xl border border-[#e2e8f0] text-center font-bold focus:border-[#f8a368] outline-none"
            />
            <input
              type="number"
              min="1"
              placeholder="المقاعد"
              value={manualCapacityInput}
              onChange={(e) => setManualCapacityInput(e.target.value)}
              className="w-16 px-2.5 py-2 rounded-xl border border-[#e2e8f0] text-center font-bold focus:border-[#f8a368] outline-none"
            />
            <button
              type="submit"
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#f8a368] hover:bg-[#ea8a26] text-white font-bold transition-all cursor-pointer"
            >
              إضافة
            </button>
          </div>
        </form>
      </div>

      {/* عرض شبكة الطاولات وتفاصيل الطاولة المحددة */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* شبكة الطاولات */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-[#ede7dd] shadow-xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#ede7dd]">
            <span className="font-bold text-sm text-[#11233e]">
              خريطة الصالة ({tables.length} طاولة)
            </span>
            <div className="flex items-center gap-3 text-xs text-[#64748b]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f8fafc] border border-gray-300"></span>
                متاحة
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f8a368]"></span>
                بالمطبخ
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]"></span>
                بانتظار الدفع
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">
            {tables.map((table) => {
              const isSelected = selectedTable?.number === table.number;
              const hasOrder = orders.some(
                (o) => o.tableNumber === table.number && o.paymentStatus === 'غير مدفوع'
              );

              return (
                <div
                  key={table.number}
                  onClick={() => setSelectedTable(table)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[120px] relative ${
                    isSelected
                      ? 'border-[#ea8a26] shadow-md ring-2 ring-[#ea8a26]/20'
                      : table.status === 'بانتظار المطبخ'
                      ? 'border-[#fed7aa] bg-[#fff7ed] hover:border-[#f8a368]'
                      : table.status === 'بانتظار الدفع'
                      ? 'border-[#fecaca] bg-[#fef2f2] hover:border-[#f87171]'
                      : table.status === 'مشغولة'
                      ? 'border-[#bfdbfe] bg-[#eff6ff] hover:border-[#60a5fa]'
                      : 'border-[#ede7dd] bg-[#fbf9f5] hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-[#11233e]">
                      طاولة {table.number}
                    </span>
                    <span className="text-[11px] text-[#64748b] font-bold">
                      {table.capacity} مقاعد
                    </span>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`inline-block text-[11px] font-black px-2.5 py-1 rounded-lg ${
                        table.status === 'بانتظار المطبخ'
                          ? 'bg-[#ea580c] text-white'
                          : table.status === 'بانتظار الدفع'
                          ? 'bg-[#dc2626] text-white'
                          : table.status === 'مشغولة'
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-[#e2e8f0] text-[#475569]'
                      }`}
                    >
                      {table.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* بطاقة تفاصيل الطاولة المحددة */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#ede7dd] shadow-xs space-y-4 sticky top-24">
          {selectedTable ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#ede7dd]">
                <div>
                  <h3 className="text-lg font-black text-[#11233e]">
                    تفاصيل طاولة {selectedTable.number}
                  </h3>
                  <p className="text-xs text-[#64748b]">
                    السعة: {selectedTable.capacity} أشخاص · الحالة:{' '}
                    <strong>{selectedTable.status}</strong>
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`حذف طاولة ${selectedTable.number} من النظام؟`)) {
                      onDeleteTable(selectedTable.number);
                      setSelectedTable(null);
                    }
                  }}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="حذف الطاولة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* إذا كان هناك طلب نشط على الطاولة */}
              {currentOrder ? (
                <div className="space-y-4 pt-3">
                  <div className="bg-[#fff9f4] p-3 rounded-xl border border-[#fbd4b6] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#11233e]">طلب #{currentOrder.orderNumber}</span>
                      <span className="font-black text-[#ea8a26] text-sm">{currentOrder.total} ₪</span>
                    </div>
                    <div className="text-[#64748b] flex items-center justify-between">
                      <span>القرصون: {currentOrder.waiterName}</span>
                      <span>{currentOrder.createdAt}</span>
                    </div>
                    <div className="pt-1.5 flex items-center justify-between text-[11px] font-bold">
                      <span>حالة المطبخ: {currentOrder.kitchenStatus}</span>
                      <span className="text-[#dc2626]">غير مدفوع</span>
                    </div>
                  </div>

                  {/* قائمة الأطباق */}
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-[#64748b] block">الأطباق الحالية:</span>
                    <div className="divide-y divide-[#f1ece3] max-h-48 overflow-y-auto border border-[#ede7dd] rounded-xl p-2 bg-[#fdfbf7]">
                      {currentOrder.items.map((it) => (
                        <div key={it.id} className="py-1.5 flex items-center justify-between">
                          <span>{it.qty} × {it.name}</span>
                          <span className="font-bold">{it.qty * it.price} ₪</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* الإجراءات */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => onOpenCashierForTable(selectedTable.number)}
                      className="w-full bg-[#11233e] hover:bg-[#ea8a26] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>عرض الفاتورة وتحصيل الحساب ({currentOrder.total} ₪)</span>
                    </button>
                    <button
                      onClick={() => onOpenOrderForTable(selectedTable.number)}
                      className="w-full bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#11233e] py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Utensils className="w-3.5 h-3.5 text-[#ea8a26]" />
                      <span>تعديل الطلب / إضافة وجبات أخرى</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#11233e]">الطاولة متاحة وفارغة</h4>
                    <p className="text-xs text-[#64748b] mt-1">
                      لا توجد طلبات جارية على هذه الطاولة حالياً.
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenOrderForTable(selectedTable.number)}
                    className="w-full bg-[#f8a368] hover:bg-[#ea8a26] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-xs"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>فتح طلب جديد بواسطة القرصون</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-[#94a3b8] text-xs">
              حدد طاولة لمعاينة تفاصيلها.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
