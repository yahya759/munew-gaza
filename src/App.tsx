/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import heroMenuImg from './assets/images/menu_transparent.png';
import {
  UtensilsCrossed,
  QrCode,
  ChefHat,
  Receipt,
  Users,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Eye,
  Coffee,
  Bell,
  Smartphone,
  Check,
  Search,
  Plus,
  RefreshCw,
  X,
  CreditCard,
  DollarSign,
  LayoutDashboard,
} from 'lucide-react';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_TABLES as INITIAL_TABLES_DATA,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
} from './data/initialData';
import {
  MenuItem,
  Table,
  Order,
  RestaurantSettings,
  DashboardTab,
} from './types/restaurant';

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface TableOrder {
  tableNumber: number;
  waiterName: string;
  time: string;
  items: OrderItem[];
  kitchenStatus: 'جديد' | 'قيد الطهي' | 'جاهز للتقديم';
  paymentStatus: 'غير مدفوع' | 'مدفوع';
}

const INITIAL_TABLES: TableOrder[] = [
  {
    tableNumber: 4,
    waiterName: 'عمر س.',
    time: 'منذ 4 دقائق',
    kitchenStatus: 'قيد الطهي',
    paymentStatus: 'غير مدفوع',
    items: [
      { name: 'بيتزا الكمأة الإيطالية بالفرن', qty: 1, price: 68 },
      { name: 'سلطة البوراتا الكابريزي', qty: 1, price: 42 },
      { name: 'عصير ليموناضة طازج بالنعناع', qty: 2, price: 36 },
    ],
  },
  {
    tableNumber: 7,
    waiterName: 'مايا ك.',
    time: 'منذ 12 دقيقة',
    kitchenStatus: 'جاهز للتقديم',
    paymentStatus: 'غير مدفوع',
    items: [
      { name: 'ستيك ريب آي مشوي 300غ', qty: 2, price: 190 },
      { name: 'بطاطس مقرمشة بالبارميزان', qty: 1, price: 34 },
      { name: 'مياه معدنية طبيعية كبيرة', qty: 1, price: 18 },
    ],
  },
  {
    tableNumber: 2,
    waiterName: 'عمر س.',
    time: 'منذ 18 دقيقة',
    kitchenStatus: 'جاهز للتقديم',
    paymentStatus: 'مدفوع',
    items: [
      { name: 'كالاماري مقلي مقرمش', qty: 1, price: 48 },
      { name: 'باستا الفطر البري الإيطالية', qty: 1, price: 62 },
      { name: 'إسبريسو مزدوج', qty: 2, price: 24 },
    ],
  },
  {
    tableNumber: 11,
    waiterName: 'دينا ر.',
    time: 'الآن',
    kitchenStatus: 'جديد',
    paymentStatus: 'غير مدفوع',
    items: [
      { name: 'برغر سماش كلاسيك مع جبن شيدر', qty: 2, price: 96 },
      { name: 'بطاطا حلوة مقلية', qty: 1, price: 28 },
      { name: 'مشروب غازي مثلج', qty: 2, price: 24 },
    ],
  },
];

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('الرئيسية');

  // Live state for the restaurant dashboard & interactive views
  const [dashboardMenuItems, setDashboardMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [dashboardTables, setDashboardTables] = useState<Table[]>(INITIAL_TABLES_DATA);
  const [dashboardOrders, setDashboardOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [dashboardSettings, setDashboardSettings] = useState<RestaurantSettings>(INITIAL_SETTINGS);

  const [activeNav, setActiveNav] = useState('الرئيسية');
  const [selectedTableNum, setSelectedTableNum] = useState<number>(4);
  const [tables, setTables] = useState<TableOrder[]>(INITIAL_TABLES);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const openDashboardTab = (tab: DashboardTab = 'الرئيسية') => {
    setDashboardTab(tab);
    setViewMode('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedTable = tables.find((t) => t.tableNumber === selectedTableNum) || tables[0];
  const tableTotal = selectedTable.items.reduce((sum, item) => sum + item.qty * item.price, 0);

  const toggleKitchenStatus = (tableNum: number) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.tableNumber !== tableNum) return t;
        const nextStatus: 'جديد' | 'قيد الطهي' | 'جاهز للتقديم' =
          t.kitchenStatus === 'جديد' ? 'قيد الطهي' : t.kitchenStatus === 'قيد الطهي' ? 'جاهز للتقديم' : 'جديد';
        return { ...t, kitchenStatus: nextStatus };
      })
    );
  };

  const togglePaymentStatus = (tableNum: number) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.tableNumber !== tableNum) return t;
        return { ...t, paymentStatus: t.paymentStatus === 'غير مدفوع' ? 'مدفوع' : 'غير مدفوع' };
      })
    );
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // عرض لوحة تحكم المالك عند التبديل
  if (viewMode === 'dashboard') {
    return (
      <OwnerDashboard
        onBackToLanding={() => {
          setViewMode('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        initialTab={dashboardTab}
        menuItems={dashboardMenuItems}
        setMenuItems={setDashboardMenuItems}
        tables={dashboardTables}
        setTables={setDashboardTables}
        orders={dashboardOrders}
        setOrders={setDashboardOrders}
        settings={dashboardSettings}
        setSettings={setDashboardSettings}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fffdfa] relative overflow-x-hidden flex flex-col font-['Cairo',sans-serif] selection:bg-[#f8a368]/20 text-[#11233e]">
      
      {/* التوهجات الخلفية اللطيفة */}
      <div 
        className="absolute -top-32 -right-32 w-[620px] h-[620px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(254, 236, 214, 0.85) 0%, rgba(255, 248, 240, 0.35) 55%, transparent 75%)',
        }}
      />
      <div 
        className="absolute top-[800px] -left-32 w-[650px] h-[650px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 65% 65%, rgba(220, 248, 238, 0.75) 0%, rgba(235, 252, 246, 0.25) 55%, transparent 75%)',
        }}
      />
      <div 
        className="absolute top-[2200px] -right-28 w-[580px] h-[580px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(254, 236, 214, 0.7) 0%, transparent 70%)',
        }}
      />

      {/* شريط التنقل العلوي */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#fffdfa]/90 border-b border-[#ede7dd]/60 px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28 py-4 flex items-center justify-between transition-all">
        {/* الشعار */}
        <div 
          onClick={() => scrollToSection('hero')} 
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="relative flex items-center justify-center">
            <svg width="34" height="26" viewBox="0 0 34 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="7" y="0" width="4.5" height="26" rx="1.5" fill="#F8A368" />
              <rect x="0" y="2" width="28" height="4.5" rx="1.5" fill="#F8A368" />
              <rect x="0" y="11" width="24" height="4.5" rx="1.5" fill="#F8A368" />
            </svg>
          </div>
          <div className="flex items-center text-[24px] tracking-tight">
            <span className="font-bold text-[#11233e]">ريستو</span>
            <span className="font-bold text-[#f8786f]">سنك</span>
          </div>
        </div>

        {/* روابط التنقل */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-10">
          {[
            { name: 'كيف يعمل', id: 'how-it-works' },
            { name: 'الواجهات الأربع', id: 'four-views' },
            { name: 'معاينة حية', id: 'preview' },
            { name: 'المميزات', id: 'benefits' },
            { name: 'الأسعار', id: 'pricing' },
            { name: 'الأسئلة الشائعة', id: 'faq' },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveNav(item.name);
                scrollToSection(item.id);
              }}
              className={`text-[15px] font-semibold transition-colors cursor-pointer ${
                activeNav === item.name
                  ? 'text-[#ea8a26] font-bold'
                  : 'text-[#374151] hover:text-[#11233e]'
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* أزرار الإجراء في الهيدر */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => openDashboardTab('الرئيسية')}
            className="flex items-center gap-1.5 bg-[#11233e] hover:bg-[#ea8a26] text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer shadow-xs active:scale-95"
          >
            <LayoutDashboard className="w-4 h-4 text-[#f8a368]" />
            <span>لوحة تحكم المالك</span>
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="hidden sm:inline-flex border border-[#f8a268] text-[#ea8a26] hover:bg-[#fff8f2] hover:border-[#f39045] active:scale-95 px-5 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer shadow-xs"
          >
            ابدأ الآن · 99 ₪
          </button>
        </div>
      </header>

      {/* -------------------- قسم الهيرو الرئيسي -------------------- */}
      <section id="hero" className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28 pt-10 sm:pt-14 pb-16 lg:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* العمود الأيمن: العنوان والنصوص والأزرار */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center max-w-[580px]">
          
          {/* النص التمهيدي الصغير */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-[13px] font-extrabold tracking-wider text-[#ea8a26] uppercase">
              إدارة المطاعم، بكل بساطة
            </span>
          </div>

          {/* العنوان الرئيسي */}
          <h1 className="text-[40px] sm:text-[46px] lg:text-[50px] xl:text-[54px] font-black text-[#11233e] leading-[1.25] tracking-tight">
            أدِر مطعمك<br />
            <span className="text-[#f8726e]">بسلاسة تامة</span>
          </h1>

          {/* النص التوضيحي */}
          <p className="mt-5 text-[16px] sm:text-[18px] leading-[1.8] text-[#334155] max-w-[490px] font-medium">
            تحكم بالطاولات، والطلبات، وتحديثات المطبخ، والمدفوعات من منصة واحدة بسيطة.
          </p>

          {/* الأزرار الرئيسية */}
          <div className="mt-9 flex flex-wrap items-center gap-5 sm:gap-6">
            {/* الزر الرئيسي: دخول لوحة المالك الحية */}
            <button 
              onClick={() => openDashboardTab('الرئيسية')}
              className="group inline-flex items-center gap-2.5 bg-[#f89e55] hover:bg-[#ea8a26] active:scale-98 text-white px-7 sm:px-8 py-3.5 rounded-full text-[15px] sm:text-[16px] font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>دخول لوحة تحكم المالك</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </button>

            {/* الزر الثانوي */}
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="inline-flex items-center gap-3 text-[#7b8e9f] hover:text-[#334155] transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#f89e55] group-hover:bg-[#f28e3e] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <svg className="w-3.5 h-3.5 fill-current -translate-x-0.5" viewBox="0 0 24 24">
                  <polygon points="19 3 5 12 19 21 19 3" />
                </svg>
              </div>
              <span className="text-[15px] font-bold">شاهد كيف يعمل</span>
            </button>
          </div>

          {/* مميزات سريعة تحت العنوان */}
          <div className="mt-10 pt-7 border-t border-[#ede7dd]/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-black text-[#ea8a26] uppercase tracking-wider">فقط 99 ₪ شهرياً</p>
              <p className="text-[13px] text-[#475569] font-medium mt-0.5">يشمل جميع الواجهات الأربع</p>
            </div>
            <div>
              <p className="text-xs font-black text-[#f8726e] uppercase tracking-wider">بدون شراء أجهزة</p>
              <p className="text-[13px] text-[#475569] font-medium mt-0.5">يعمل على أي متصفح هاتف أو حاسوب</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs font-black text-[#0d9488] uppercase tracking-wider">منيو QR للعرض فقط</p>
              <p className="text-[13px] text-[#475569] font-medium mt-0.5">النوادل هم من يدخلون الطلبات</p>
            </div>
          </div>
        </div>

        {/* العمود الأيسر: الصورة التوضيحية للمنيو ونظام الطلبات */}
        <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center relative">
          <div className="relative w-full max-w-[560px] flex flex-col items-center justify-center select-none group">
            
            {/* التوهجات الخلفية المتناسقة مع ألوان التصميم */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#f8a368]/20 via-[#9ee4cf]/20 to-transparent rounded-[36px] blur-2xl -z-10 pointer-events-none" />
            
            {/* التموجات الزخرفية الناعمة المتطابقة مع الهوية */}
            <div className="absolute -top-4 -right-4 pointer-events-none opacity-60 z-0 hidden sm:block">
              <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
                <path d="M 4 10 Q 18 2 32 10 T 60 10 T 88 10" stroke="#fbd4b6" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 4 20 Q 18 12 32 20 T 60 20 T 88 20" stroke="#9ee4cf" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* عرض الصورة الشفافة مباشرة بدون أي إطار أو خلفية */}
            <div className="relative w-full flex items-center justify-center">
              <img 
                src={heroMenuImg} 
                alt="قائمة الطعام الرقمية ونظام إدارة الطاولات والمطبخ - ريستوسنك"
                className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(20,35,60,0.12)] transition-transform duration-500 hover:scale-[1.01]"
              />

              {/* بادج عائم ناعم يؤكد المزامنة الفورية */}
              <div className="absolute -bottom-3 -right-2 sm:-right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#9ee4cf] shadow-lg shadow-teal-950/10 flex items-center gap-2 text-xs font-bold text-[#11233e]">
                <div className="w-5 h-5 rounded-full bg-[#e8f8f2] text-[#0d9488] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span>منيو QR للعرض · تزامن مباشر مع المطبخ</span>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* -------------------- القسم 1: كيف يعمل النظام -------------------- */}
      <section id="how-it-works" className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28 py-16 lg:py-24 bg-[#faf8f4]/60 border-y border-[#ede7dd]/70">
        <div className="max-w-[1240px] mx-auto">
          
          {/* عنوان القسم */}
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <span className="text-xs font-black tracking-widest text-[#ea8a26] uppercase">
              آلية العمل المتكاملة
            </span>
            <h2 className="mt-2 text-[32px] sm:text-[38px] font-black text-[#11233e] tracking-tight">
              كيف يعمل النظام؟
            </h2>
            <p className="mt-3 text-[16px] text-[#475569] leading-relaxed font-medium">
              دورة طلبات منسقة وبسيطة تربط بين الزبائن، طاقم الخدمة، المطبخ، وصندوق المحاسبة بدون أي أخطاء.
            </p>
          </div>

          {/* الخطوات الثلاث */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* الخطوة 1 */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#ede7dd] shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff2e5] text-[#ea8a26] flex items-center justify-center font-black text-xl mb-5 border border-[#fbd4b6]">
                  1
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#f1f5f9] text-[#475569] mb-3">
                  <QrCode className="w-3.5 h-3.5 text-[#ea8a26]" />
                  <span>تجربة الزبون</span>
                </div>
                <h3 className="text-xl font-bold text-[#11233e] tracking-tight">
                  الزبائن يتصفحون المنيو عبر مسح رمز QR
                </h3>
                <p className="mt-3 text-[14px] text-[#475569] leading-relaxed">
                  يقوم الضيف بمسح رمز QR الموضوع على طاولته ليتصفح الأطباق، الصور، والتفاصيل والأسعار مباشرة. <strong className="text-[#11233e]">للعرض فقط</strong> — لا يمكن للزبون إرسال الطلب بنفسه، مما يحفظ جودة الضيافة والتواصل البشري.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f1ece3] flex items-center gap-2 text-xs font-bold text-[#0d9488]">
                <CheckCircle2 className="w-4 h-4 text-[#0d9488]" />
                <span>يعمل فوراً دون تنزيل أي تطبيق</span>
              </div>
            </div>

            {/* الخطوة 2 */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#ede7dd] shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#e8f8f2] text-[#0d9488] flex items-center justify-center font-black text-xl mb-5 border border-[#9ee4cf]">
                  2
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#f1f5f9] text-[#475569] mb-3">
                  <Smartphone className="w-3.5 h-3.5 text-[#0d9488]" />
                  <span>واجهة النادل</span>
                </div>
                <h3 className="text-xl font-bold text-[#11233e] tracking-tight">
                  النوادل يحددون الطاولة ويرسلون الطلب
                </h3>
                <p className="mt-3 text-[14px] text-[#475569] leading-relaxed">
                  يفتح النادل رابطه الخاص على هاتفه المحمول، يحدد رقم طاولة الزبون، يختار الأطباق والمشروبات المطلوبة، ثم يضغط زر الإرسال. دقيق، سريع، ومقترن برقم الطاولة مباشرة.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f1ece3] flex items-center gap-2 text-xs font-bold text-[#ea8a26]">
                <CheckCircle2 className="w-4 h-4 text-[#ea8a26]" />
                <span>إرسال فوري بلمسة واحدة</span>
              </div>
            </div>

            {/* الخطوة 3 */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#ede7dd] shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#fee2e2] text-[#f87171] flex items-center justify-center font-black text-xl mb-5 border border-[#fca5a5]">
                  3
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#f1f5f9] text-[#475569] mb-3">
                  <ChefHat className="w-3.5 h-3.5 text-[#f87171]" />
                  <span>تزامن لحظي</span>
                </div>
                <h3 className="text-xl font-bold text-[#11233e] tracking-tight">
                  الكاشير والمطبخ يستقبلان الطلب معاً
                </h3>
                <p className="mt-3 text-[14px] text-[#475569] leading-relaxed">
                  في نفس الثانية التي يرسل فيها النادل الطلب، يظهر تيكت الطلب في شاشة المطبخ ليبدأ الطهاة بالتحضير، وفي الوقت ذاته يُفتح حساب الطاولة عند الكاشير جاهزاً للدفع.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f1ece3] flex items-center gap-2 text-xs font-bold text-[#f87171]">
                <CheckCircle2 className="w-4 h-4 text-[#f87171]" />
                <span>لا انتظار ولا تأخير بين الصالة والمطبخ</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------- القسم 2: منصة واحدة، أربع واجهات -------------------- */}
      <section id="four-views" className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28 py-16 lg:py-24">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="text-center max-w-[700px] mx-auto mb-14">
            <span className="text-xs font-black tracking-widest text-[#ea8a26] uppercase">
              صلاحيات مخصصة لكل دور
            </span>
            <h2 className="mt-2 text-[32px] sm:text-[38px] font-black text-[#11233e] tracking-tight">
              منصة واحدة، بأربع واجهات مخصصة
            </h2>
            <p className="mt-3 text-[16px] text-[#475569] leading-relaxed font-medium">
              يحصل كل فرد في فريق العمل على واجهة مصممة خصيصاً لوظيفته عبر رابط ويب آمن ومستقل، دون أي تعقيد.
            </p>
          </div>

          {/* شبكة البطاقات الأربع */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            
            {/* واجهة 1: المالك والكاشير */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#ede7dd] shadow-sm hover:border-[#f8a368]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#fff2e5] border border-[#fbd4b6] flex items-center justify-center text-[#ea8a26]">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f1f5f9] text-[#334155]">
                    الرابط 1: الإدارة والمحاسبة
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#11233e] tracking-tight">
                  واجهة المالك والكاشير
                </h3>
                <p className="mt-2 text-[15px] font-bold text-[#ea8a26]">
                  إدارة القائمة، الطاولات، الطلبات، الفواتير، والمدفوعات.
                </p>
                <p className="mt-3 text-[14px] text-[#475569] leading-relaxed">
                  تحكم شامل بكل ما يحدث في الصالة. يستطيع الكاشير رؤية جميع الطاولات النشطة فوراً، والاطلاع على الفاتورة المفصلة لأي طاولة، وحساب الحساب، وتحصيل الدفع وتأكيده بلمسة زر.
                </p>
              </div>

              {/* لقطة معاينة مصغرة */}
              <div className="mt-6 bg-[#faf8f4] border border-[#f0eae0] rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#64748b] pb-2 border-b border-[#ece5da]">
                  <span>الطاولات النشطة (4 مفتوحة)</span>
                  <span className="text-[#0d9488]">المجموع الإجمالي: 448 ₪</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-xs font-bold">
                  <span className="text-[#11233e]">طاولة 04 · عمر س.</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309]">146 ₪ · غير مدفوع</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs font-bold">
                  <span className="text-[#11233e]">طاولة 07 · مايا ك.</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309]">242 ₪ · غير مدفوع</span>
                </div>
                <button
                  onClick={() => openDashboardTab('الطلبات والحسابات')}
                  className="mt-3.5 w-full bg-[#11233e] hover:bg-[#ea8a26] text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Receipt className="w-3.5 h-3.5 text-[#f8a368]" />
                  <span>فتح واجهة المالك والكاشير الحية</span>
                </button>
              </div>
            </div>

            {/* واجهة 2: النادل */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#ede7dd] shadow-sm hover:border-[#f8a368]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#e8f8f2] border border-[#9ee4cf] flex items-center justify-center text-[#0d9488]">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f1f5f9] text-[#334155]">
                    الرابط 2: طاقم الضيافة
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#11233e] tracking-tight">
                  واجهة النادل
                </h3>
                <p className="mt-2 text-[15px] font-bold text-[#0d9488]">
                  اختيار الطاولة، إضافة الأصناف، وإرسال الطلبات.
                </p>
                <p className="mt-3 text-[14px] text-[#475569] leading-relaxed">
                  مصممة لتكون فائقة السرعة على شاشات الهواتف. يختار النادل رقم الطاولة، ويضيف المقبلات والأطباق الرئيسية والمشروبات بتصنيفات مرتبة، ثم يضغط زر الإرسال مباشرة.
                </p>
              </div>

              {/* لقطة معاينة مصغرة */}
              <div className="mt-6 bg-[#faf8f4] border border-[#f0eae0] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#11233e]">المحدد حالياً: طاولة 04</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e8f8f2] text-[#0d9488] font-bold">الطابق 1</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1 bg-white border border-[#e5dfd4] rounded-lg p-2 text-center font-bold text-[#11233e]">
                    + بيتزا الكمأة (68 ₪)
                  </div>
                  <button 
                    onClick={() => openDashboardTab('روابط الوصول')}
                    className="bg-[#f89e55] hover:bg-[#ea8a26] text-white font-bold px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    إرسال الطلب ←
                  </button>
                </div>
                <button
                  onClick={() => openDashboardTab('روابط الوصول')}
                  className="mt-3.5 w-full bg-[#0d9488] hover:bg-[#0f766e] text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>تجربة واجهة القرصون الحية</span>
                </button>
              </div>
            </div>

            {/* واجهة 3: شاشة المطبخ */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#ede7dd] shadow-sm hover:border-[#f8a368]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#fee2e2] border border-[#fca5a5] flex items-center justify-center text-[#f87171]">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f1f5f9] text-[#334155]">
                    الرابط 3: شاشة تحضير المطبخ
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#11233e] tracking-tight">
                  واجهة المطبخ (KDS)
                </h3>
                <p className="mt-2 text-[15px] font-bold text-[#f87171]">
                  متابعة الطلبات الواردة وتحديث حالة التجهيز.
                </p>
                <p className="mt-3 text-[14px] text-[#475569] leading-relaxed">
                  تعمل على أي جهاز لوحي (تابلت) أو شاشة في المطبخ. تظهر تذاكر الطلبات مع رقم الطاولة وتوقيت الإرسال بدقة، ويمكن للطاهي تغيير الحالة بلمسة واحدة: <strong className="text-[#11233e]">جديد</strong> ← <strong className="text-[#11233e]">قيد الطهي</strong> ← <strong className="text-[#11233e]">جاهز للتقديم</strong>.
                </p>
              </div>

              {/* لقطة معاينة مصغرة */}
              <div className="mt-6 bg-[#faf8f4] border border-[#f0eae0] rounded-2xl p-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#ece5da]">
                  <span className="text-xs font-bold text-[#11233e]">طلب #104 · طاولة 04</span>
                  <span className="text-[11px] font-bold text-[#ea8a26]">منذ 3 دقائق</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs font-medium text-[#475569]">
                  <span>1× بيتزا الكمأة · 1× سلطة البوراتا</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#e8f8f2] text-[#0d9488] font-bold">قيد الطهي</span>
                </div>
                <button
                  onClick={() => openDashboardTab('المطبخ')}
                  className="mt-3.5 w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>فتح شاشة تحضير المطبخ (KDS)</span>
                </button>
              </div>
            </div>

            {/* واجهة 4: منيو الزبائن */}
            <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#ede7dd] shadow-sm hover:border-[#f8a368]/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] border border-[#ddd6fe] flex items-center justify-center text-[#7c3aed]">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f1f5f9] text-[#334155]">
                    الرابط 4: منيو الزبائن الرقمي
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#11233e] tracking-tight">
                  قائمة الزبائن (رمز QR)
                </h3>
                <p className="mt-2 text-[15px] font-bold text-[#7c3aed]">
                  تصفح الأطباق، الأوصاف، والأسعار؛ للعرض فقط.
                </p>
                <p className="mt-3 text-[14px] text-[#475569] leading-relaxed">
                  ضع ملصقات QR أنيقة على الطاولات. يمسحها الزبون بكاميرا هاتفه للاطلاع على صور الأطباق والأسعار وتفاصيل المكونات. <strong className="text-[#11233e]">للعرض فقط بشكل كامل</strong> — لا يستطيع الزبائن إرسال الطلبات مباشرة من هواتفهم.
                </p>
              </div>

              {/* لقطة معاينة مصغرة */}
              <div className="mt-6 bg-[#faf8f4] border border-[#f0eae0] rounded-2xl p-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#ece5da]">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-[#7c3aed]" />
                    <span className="text-xs font-bold text-[#11233e]">قائمة رقمية · للعرض فقط</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#ef4444] font-bold">لا يوجد طلب ذاتي</span>
                </div>
                <div className="mt-2 text-xs text-[#475569] flex items-center justify-between font-bold">
                  <span>كالاماري مقلي بصلصة الثوم والأعشاب</span>
                  <span className="text-[#11233e]">48 ₪</span>
                </div>
                <button
                  onClick={() => openDashboardTab('روابط الوصول')}
                  className="mt-3.5 w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>معاينة منيو الزبائن للعرض فقط</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------- القسم 3: معاينة حية وتجربة تفاعلية للمنتج -------------------- */}
      <section id="preview" className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28 py-16 lg:py-24 bg-[#faf8f4]/60 border-y border-[#ede7dd]/70">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="text-center max-w-[720px] mx-auto mb-12">
            <span className="text-xs font-black tracking-widest text-[#ea8a26] uppercase">
              تجربة حية تفاعلية
            </span>
            <h2 className="mt-2 text-[32px] sm:text-[38px] font-black text-[#11233e] tracking-tight">
              معاينة المنتج: الطلبات مقترنة بأرقام الطاولات
            </h2>
            <p className="mt-3 text-[16px] text-[#475569] leading-relaxed font-medium">
              كل طلب مرتبط بدقة برقم الطاولة المخصصة له. جرّب النقر على الطاولات المختلفة أدناه لتشاهد تفاصيل الفواتير، تحديثات المطبخ، وحالة الدفع مباشرة.
            </p>
          </div>

          {/* لوحة تحكم تفاعلية متكاملة */}
          <div className="bg-white rounded-3xl border border-[#ede7dd] shadow-xl overflow-hidden">
            
            {/* شريط اللوحة العلوي */}
            <div className="bg-[#fffdfa] border-b border-[#ede7dd] px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#fff2e5] text-[#ea8a26] flex items-center justify-center font-bold text-sm">
                  RS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#11233e]">نظام تشغيل وإدارة الصالة والكاشير</h4>
                  <p className="text-[11px] text-[#64748b]">متصل حالياً: شاشة المطبخ و 4 نوادل في الصالة</p>
                </div>
              </div>

              {/* مؤشر المزامنة وزر فتح اللوحة الكاملة */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
                  </span>
                  <span className="text-xs font-bold text-[#0d9488]">المزامنة الفورية نشطة</span>
                </div>
                <button
                  onClick={() => openDashboardTab('الطلبات والحسابات')}
                  className="bg-[#11233e] hover:bg-[#ea8a26] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#f8a368]" />
                  <span>فتح اللوحة الكاملة</span>
                </button>
              </div>
            </div>

            {/* محتوى اللوحة التفاعلية */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* العمود الأيمن: محدد الطاولات */}
              <div className="lg:col-span-4 border-l-0 lg:border-l border-[#f1ece3] lg:pl-6">
                <h5 className="text-xs font-black uppercase tracking-wider text-[#64748b] mb-3">
                  اختر طاولة لعرض تفاصيل طلبها:
                </h5>

                <div className="grid grid-cols-2 gap-3">
                  {tables.map((table) => {
                    const isSelected = table.tableNumber === selectedTableNum;
                    const itemsCount = table.items.reduce((acc, i) => acc + i.qty, 0);
                    const total = table.items.reduce((acc, i) => acc + i.qty * i.price, 0);

                    return (
                      <button
                        key={table.tableNumber}
                        onClick={() => setSelectedTableNum(table.tableNumber)}
                        className={`text-right p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#fff2e5] border-[#f8a368] shadow-sm ring-2 ring-[#f8a368]/30'
                            : 'bg-[#faf8f5] hover:bg-white border-[#ede7dd]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[15px] font-black text-[#11233e]">
                            طاولة {table.tableNumber < 10 ? `0${table.tableNumber}` : table.tableNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              table.kitchenStatus === 'جاهز للتقديم'
                                ? 'bg-[#e8f8f2] text-[#0d9488]'
                                : table.kitchenStatus === 'قيد الطهي'
                                ? 'bg-[#fff2e5] text-[#ea8a26]'
                                : 'bg-[#f1f5f9] text-[#64748b]'
                            }`}
                          >
                            {table.kitchenStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748b] font-medium">{itemsCount} أصناف · {total} ₪</p>
                        <div className="mt-2 flex items-center justify-between text-[11px] font-bold">
                          <span className="text-[#475569]">{table.waiterName}</span>
                          <span className={table.paymentStatus === 'مدفوع' ? 'text-[#0d9488]' : 'text-[#ea8a26]'}>
                            {table.paymentStatus}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 p-3.5 rounded-2xl bg-[#faf8f4] border border-[#ede7dd] text-xs text-[#475569]">
                  <p className="font-bold text-[#11233e] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#ea8a26]" />
                    ضمان دقة الطاولات
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    لا يمكن إدخال أي طلب في النظام بدون ربطه برقم طاولة محدد، مما يمنع ضياع الفواتير نهائياً.
                  </p>
                </div>
              </div>

              {/* العمود الأوسط: تفاصيل طلب الطاولة المختارة */}
              <div className="lg:col-span-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="text-lg font-bold text-[#11233e]">
                      تفاصيل طاولة {selectedTable.tableNumber < 10 ? `0${selectedTable.tableNumber}` : selectedTable.tableNumber}
                    </h5>
                    <p className="text-xs text-[#64748b] font-medium">
                      خدمة: {selectedTable.waiterName} · وقت إرسال الطلب: {selectedTable.time}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f1f5f9] text-[#334155]">
                    {selectedTable.items.length} أطباق مختلفة
                  </span>
                </div>

                {/* قائمة الأطباق في الطاولة */}
                <div className="space-y-2.5">
                  {selectedTable.items.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-[#ede7dd]/70 text-xs font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-white border border-[#e5dfd4] font-black text-[#11233e] flex items-center justify-center">
                          {item.qty}
                        </span>
                        <span className="text-[#11233e]">{item.name}</span>
                      </div>
                      <span className="text-[#475569]">{item.price * item.qty} ₪</span>
                    </div>
                  ))}
                </div>

                {/* تفصيل الحساب الإجمالي */}
                <div className="mt-5 p-4 rounded-2xl bg-[#faf8f4] border border-[#ede7dd]">
                  <div className="flex items-center justify-between text-xs text-[#64748b] font-medium">
                    <span>المجموع الفرعي</span>
                    <span>{tableTotal} ₪</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#64748b] font-medium mt-1.5">
                    <span>ضريبة القيمة المضافة (مشمولة)</span>
                    <span>{(tableTotal * 0.17).toFixed(1)} ₪</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-black text-[#11233e] mt-2.5 pt-2.5 border-t border-[#ede7dd]">
                    <span>إجمالي الحساب المطلوب</span>
                    <span className="text-[#ea8a26] text-lg font-black">{tableTotal} ₪</span>
                  </div>
                </div>
              </div>

              {/* العمود الأيسر: إجراءات تشغيلية مباشرة (المطبخ والكاشير) */}
              <div className="lg:col-span-3 flex flex-col justify-between bg-[#faf8f5] p-5 rounded-2xl border border-[#ede7dd]">
                <div>
                  <h6 className="text-xs font-black uppercase tracking-wider text-[#64748b] mb-4">
                    إجراءات تشغيلية تفاعلية
                  </h6>

                  {/* تغيير حالة المطبخ */}
                  <div className="mb-5">
                    <label className="text-xs font-bold text-[#11233e] block mb-1.5">
                      حالة إعداد الطلب في المطبخ:
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        selectedTable.kitchenStatus === 'جاهز للتقديم'
                          ? 'bg-[#e8f8f2] text-[#0d9488]'
                          : selectedTable.kitchenStatus === 'قيد الطهي'
                          ? 'bg-[#fff2e5] text-[#ea8a26]'
                          : 'bg-[#fee2e2] text-[#f87171]'
                      }`}>
                        {selectedTable.kitchenStatus}
                      </span>
                      <span className="text-[11px] text-[#64748b] font-medium">
                        {selectedTable.kitchenStatus === 'جاهز للتقديم' ? 'الأطباق جاهزة للخروج' : 'في مرحلة التحضير'}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleKitchenStatus(selectedTable.tableNumber)}
                      className="w-full py-2.5 px-3 rounded-xl bg-white border border-[#e5dfd4] hover:bg-[#fffdfa] text-xs font-bold text-[#11233e] flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#ea8a26]" />
                      <span>تغيير مرحلة المطبخ التالية</span>
                    </button>
                  </div>

                  {/* تغيير حالة دفع الكاشير */}
                  <div className="mb-4">
                    <label className="text-xs font-bold text-[#11233e] block mb-1.5">
                      حالة الدفع عند الكاشير:
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        selectedTable.paymentStatus === 'مدفوع'
                          ? 'bg-[#e8f8f2] text-[#0d9488]'
                          : 'bg-[#fff2e5] text-[#ea8a26]'
                      }`}>
                        {selectedTable.paymentStatus}
                      </span>
                      <span className="text-[11px] text-[#64748b] font-medium">
                        {selectedTable.paymentStatus === 'مدفوع' ? 'تم استلام المبلغ بالكامل' : 'الحساب مفتوح'}
                      </span>
                    </div>
                    <button
                      onClick={() => togglePaymentStatus(selectedTable.tableNumber)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedTable.paymentStatus === 'مدفوع'
                          ? 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                          : 'bg-[#f89e55] hover:bg-[#ea8a26] text-white shadow-sm'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>{selectedTable.paymentStatus === 'مدفوع' ? 'إعادة فتح الفاتورة' : `تحصيل ${tableTotal} ₪ الآن`}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ece5da] text-[11px] text-[#64748b] font-medium leading-relaxed">
                  تنعكس أي حركة هنا على شاشات النادل والكاشير والمطبخ بالتزامن الفوري.
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* -------------------- القسم 4: المميزات والفوائد -------------------- */}
      <section id="benefits" className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28 py-16 lg:py-24">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="text-center max-w-[700px] mx-auto mb-14">
            <span className="text-xs font-black tracking-widest text-[#ea8a26] uppercase">
              فوائد ملموسة لصالة طعامك
            </span>
            <h2 className="mt-2 text-[32px] sm:text-[38px] font-black text-[#11233e] tracking-tight">
              صُمم لإنهاء الفوضى المعتادة في أوقات الذروة
            </h2>
            <p className="mt-3 text-[16px] text-[#475569] leading-relaxed font-medium">
              حلول عملية مخصصة للمطاعم المزدحمة لضمان خدمة أسرع وتدوير طاولات أعلى.
            </p>
          </div>

          {/* المميزات الأربع الأساسية */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* ميزة 1 */}
            <div className="bg-white rounded-3xl p-7 border border-[#ede7dd] shadow-sm hover:border-[#f8a368]/60 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#fff2e5] border border-[#fbd4b6] flex items-center justify-center text-[#ea8a26] mb-5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#11233e] tracking-tight">
                  تقليل الطلبات المفقودة
                </h3>
                <p className="mt-3 text-[14px] text-[#475569] leading-relaxed">
                  يدخل النادل الطلب مباشرة عبر هاتفه مقترناً برقم الطاولة. لن تفقد أي ورقة ولن تحدث أخطاء بسبب خط اليد غير الواضح.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#f1ece3] text-xs font-bold text-[#ea8a26]">
                دقة 100% لكل طاولة
              </div>
            </div>

            {/* ميزة 2 */}
            <div className="bg-white rounded-3xl p-7 border border-[#ede7dd] shadow-sm hover:border-[#9ee4cf]/80 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#e8f8f2] border border-[#9ee4cf] flex items-center justify-center text-[#0d9488] mb-5">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#11233e] tracking-tight">
                  تواصل أوضح مع المطبخ
                </h3>
                <p className="mt-3 text-[14px] text-[#475569] leading-relaxed">
                  تزامن رقمي فوري بين طاقم الصالة والطهاة في المطبخ بدون صراخ أو ركض بين الطاولات والشيف.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#f1ece3] text-xs font-bold text-[#0d9488]">
                هدوء وتنظيم كامل في الصالة
              </div>
            </div>

            {/* ميزة 3 */}
            <div className="bg-white rounded-3xl p-7 border border-[#ede7dd] shadow-sm hover:border-[#fca5a5]/80 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#fee2e2] border border-[#fca5a5] flex items-center justify-center text-[#f87171] mb-5">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#11233e] tracking-tight">
                  حساب الفواتير بسرعة فائقة
                </h3>
                <p className="mt-3 text-[14px] text-[#475569] leading-relaxed">
                  عندما يطلب الزبون الحساب، يفتح الكاشير رقم الطاولة في ثانية واحدة ليجد الحساب جاهزاً ومجمعاً بدقة دون انتظار.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#f1ece3] text-xs font-bold text-[#f87171]">
                تسريع خروج وتدوير الطاولات
              </div>
            </div>

            {/* ميزة 4 */}
            <div className="bg-white rounded-3xl p-7 border border-[#ede7dd] shadow-sm hover:border-[#ddd6fe]/80 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#ede9fe] border border-[#ddd6fe] flex items-center justify-center text-[#7c3aed] mb-5">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#11233e] tracking-tight">
                  قائمة طعام رقمية سهلة القراءة
                </h3>
                <p className="mt-3 text-[14px] text-[#475569] leading-relaxed">
                  يتصفح الزبائن من هواتفهم قائمة طعام عصرية بالصور والأسعار المحدثة، بينما يتولى النادل أخذ وتسجيل الطلب باحترافية.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#f1ece3] text-xs font-bold text-[#7c3aed]">
                قائمة محدثة دون تكاليف طباعة
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------- القسم 5: الأسعار الواضحة -------------------- */}
      <section id="pricing" className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28 py-16 lg:py-24 bg-[#faf8f4]/60 border-y border-[#ede7dd]/70">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="text-center max-w-[650px] mx-auto mb-12">
            <span className="text-xs font-black tracking-widest text-[#ea8a26] uppercase">
              أسعار واضحة ومباشرة
            </span>
            <h2 className="mt-2 text-[32px] sm:text-[38px] font-black text-[#11233e] tracking-tight">
              خطة واحدة شاملة لكل خدمات مطعمك
            </h2>
            <p className="mt-3 text-[16px] text-[#475569] leading-relaxed font-medium">
              لا رسوم خفية، ولا عمولات على الطلبات، ولا إلزام بشراء أجهزة خاصة.
            </p>
          </div>

          {/* بطاقة السعر */}
          <div className="max-w-[640px] mx-auto bg-white rounded-3xl p-8 sm:p-11 border border-[#f8a368] shadow-xl relative overflow-hidden">
            
            {/* شريط الإتاحة الكاملة */}
            <div className="absolute top-0 left-0 bg-[#f89e55] text-white text-[11px] font-black uppercase tracking-widest py-1.5 px-6 rounded-br-2xl shadow-xs">
              الاشتراك الكامل
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-[#f1ece3]">
              <div>
                <h3 className="text-2xl font-bold text-[#11233e] tracking-tight">الاشتراك الشهري</h3>
                <p className="text-sm text-[#64748b] mt-1 font-medium">كل ما تحتاجه لإدارة طاولاتك ومطبخك</p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-[#11233e]">99 ₪</span>
                <span className="text-sm font-bold text-[#64748b]">/ شهرياً</span>
              </div>
            </div>

            {/* الميزات المؤكدة المتضمنة */}
            <div className="mt-8 space-y-4">
              <h4 className="text-xs font-black tracking-wider uppercase text-[#ea8a26]">
                القدرات المؤكدة المتضمنة في المنصة:
              </h4>

              {[
                'رابط ويب مخصص ومستقل لإدارة المالك والكاشير',
                'رابط ويب مخصص للنوادل: اختيار الطاولة، إضافة الأصناف وإرسال الطلبات',
                'رابط ويب مخصص لشاشة المطبخ لتحديث حالات الطهي والجاهزية',
                'رابط قائمة طعام رقمية QR للزبائن: استعراض الأصناف والأسعار (للعرض فقط)',
                'مزامنة فورية للطلبات بين الصالة والمطبخ والكاشير في نفس اللحظة',
                'احتساب فواتير الطاولات وتتبع حالة السداد لكل طاولة على حدة',
                'دعم عدد غير محدود من الطاولات وعدد غير محدود من أطباق القائمة',
                'يعمل على المتصفحات في الهواتف الذكية والأجهزة اللوحية والحواسيب دون شراء معدات',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#e8f8f2] text-[#0d9488] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-[#334155]">{feat}</span>
                </div>
              ))}
            </div>

            {/* زر التفعيل داخل بطاقة السعر */}
            <div className="mt-9 pt-7 border-t border-[#f1ece3] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[#11233e]">جاهز لتطوير مطعمك؟</p>
                <p className="text-xs text-[#64748b] font-medium">احصل على روابط مطعمك اليوم بكل سهولة أو جرّب اللوحة الآن.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => openDashboardTab('الرئيسية')}
                  className="w-full sm:w-auto bg-[#11233e] hover:bg-[#ea8a26] active:scale-98 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#f8a368]" />
                  <span>دخول لوحة المالك</span>
                </button>
                <button 
                  onClick={() => setContactModalOpen(true)}
                  className="w-full sm:w-auto bg-[#f89e55] hover:bg-[#ea8a26] active:scale-98 text-white px-7 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer text-center"
                >
                  اشترك الآن · 99 ₪ / شهر
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* -------------------- القسم 6: الأسعار والأسئلة الشائعة -------------------- */}
      <section id="faq" className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28 py-16 lg:py-24">
        <div className="max-w-[940px] mx-auto">
          
          <div className="text-center max-w-[650px] mx-auto mb-14">
            <span className="text-xs font-black tracking-widest text-[#ea8a26] uppercase">
              الأسئلة الشائعة
            </span>
            <h2 className="mt-2 text-[32px] sm:text-[38px] font-black text-[#11233e] tracking-tight">
              إجابات واضحة ومباشرة
            </h2>
            <p className="mt-3 text-[16px] text-[#475569] leading-relaxed font-medium">
              تعرف على كيفية انتقال الطلبات بين الزبون، النادل، المطبخ، والكاشير بكل دقة.
            </p>
          </div>

          {/* عناصر الأكورديون */}
          <div className="space-y-4">
            {[
              {
                q: 'هل يمكن للزبائن إرسال الطلبات مباشرة من هواتفهم؟',
                a: 'كلا، قائمة الزبائن عبر رمز QR مخصصة فقط للعرض. يمسح الزبون الرمز ليطلع على الأطباق والصور والأسعار، في حين يقوم النادل بفتح واجهته الخاصة على هاتفه، وتحديد رقم الطاولة، وإدخال الطلب بنفسه وإرساله للمطبخ.',
              },
              {
                q: 'كيف يرسل النوادل الطلبات للمطبخ؟',
                a: 'يفتح النادل الرابط المخصص له على أي هاتف ذكي، ويضغط على رقم طاولة الزبون، ثم يختار الأصناف المطلوبة ويضغط زر إرسال الطلب. يُرسل الطلب فوراً وموسوماً برقم الطاولة المحددة.',
              },
              {
                q: 'كيف يستقبل المطبخ الطلبات الواردة؟',
                a: 'في اللحظة التي يرسل فيها النادل الطلب، يظهر تيكت الطلب مباشرة على شاشة المطبخ موضحاً رقم الطاولة والأصناف وتوقيت الطلب. يمكن للمطبخ تحديث مرحلة الإعداد من (جديد) إلى (قيد الطهي) ثم (جاهز للتقديم) بلمسة واحدة.',
              },
              {
                q: 'كيف يجد الكاشير فاتورة الطاولة ويحصّل الدفع؟',
                a: 'تعرض شاشة الكاشير جميع الطاولات المفتوحة بالتزامن المباشر. يضغط الكاشير على رقم الطاولة ليرى الفاتورة المفصلة، ويقوم باحتساب الحساب وتأكيد استلام المبلغ وإغلاق الطاولة.',
              },
              {
                q: 'ما الذي يوفره اشتراك الـ 99 ₪ شهرياً؟',
                a: 'الاشتراك الشهري بمبلغ 99 ₪ يشمل الوصول الكامل لجميع الواجهات الأربع: واجهة الإدارة والكاشير، واجهة النوادل، شاشة المطبخ، وقائمة رمز QR للزبائن لعدد غير محدود من الطاولات.',
              },
            ].map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#ede7dd] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 font-bold text-[17px] text-[#11233e] hover:text-[#ea8a26] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#ea8a26] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-[15px] text-[#475569] leading-relaxed border-t border-[#f4efe8] font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* البانر الختامي للدعوة للإجراء */}
          <div className="mt-16 bg-gradient-to-l from-[#fff4e8] via-[#fffbf7] to-[#eaf8f3] rounded-3xl p-8 sm:p-12 border border-[#fbd4b6] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-[520px]">
              <span className="text-xs font-black uppercase tracking-widest text-[#ea8a26]">
                ابدأ رحلتك اليوم
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-black text-[#11233e] tracking-tight">
                جاهز لتشغيل مطعمك بسلاسة كاملة؟
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#475569] leading-relaxed font-medium">
                اربط طاولاتك، ونوادلك، ومطبخك، وصندوق الدفع مقابل 99 ₪ فقط في الشهر.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => setContactModalOpen(true)}
                className="w-full sm:w-auto bg-[#f89e55] hover:bg-[#ea8a26] active:scale-98 text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer text-center"
              >
                اشترك الآن · 99 ₪ / شهر
              </button>
              <button
                onClick={() => setContactModalOpen(true)}
                className="w-full sm:w-auto border border-[#f8a268] text-[#ea8a26] hover:bg-white active:scale-98 px-6 py-3.5 rounded-full text-sm font-bold transition-all cursor-pointer text-center"
              >
                تواصل مع الفريق
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* التذييل (Footer) */}
      <footer className="w-full px-6 sm:px-10 md:px-14 lg:px-20 xl:px-28 py-8 border-t border-[#ede7dd] bg-[#fffdfa] text-xs text-[#64748b] flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
        <div className="flex items-center gap-2">
          <div className="flex items-center text-[17px] tracking-tight font-black">
            <span className="text-[#11233e]">ريستو</span>
            <span className="text-[#f8786f]">سنك</span>
          </div>
          <span className="text-[#94a3b8]">·</span>
          <span>منصة إدارة المطاعم الموحدة</span>
        </div>

        <p>© 2026 ريستوسنك. تشمل كافة الواجهات الأربع مقابل 99 ₪ شهرياً.</p>
      </footer>

      {/* نافذة الاشتراك والتواصل (Modal) */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-[500px] w-full p-7 sm:p-8 border border-[#ede7dd] shadow-2xl relative">
            <button
              onClick={() => {
                setContactModalOpen(false);
                setContactSubmitted(false);
              }}
              className="absolute top-6 left-6 text-[#94a3b8] hover:text-[#11233e] p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!contactSubmitted ? (
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#ea8a26]">
                  تفعيل حساب المطعم
                </span>
                <h3 className="text-2xl font-black text-[#11233e] mt-1.5">
                  احصل على روابط مطعمك الآن
                </h3>
                <p className="text-sm text-[#475569] mt-2 font-medium">
                  أدخل بيانات مطعمك لتجهيز الروابط الأربعة المخصصة لك مقابل 99 ₪ شهرياً.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#11233e] mb-1">اسم المطعم</label>
                    <input
                      required
                      type="text"
                      placeholder="مثال: مطعم بيتزا نابولي"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ede7dd] text-sm focus:outline-none focus:border-[#f8a368] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#11233e] mb-1">اسم المسؤول</label>
                    <input
                      required
                      type="text"
                      placeholder="مثال: أحمد خليل"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ede7dd] text-sm focus:outline-none focus:border-[#f8a368] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#11233e] mb-1">البريد الإلكتروني</label>
                    <input
                      required
                      type="email"
                      placeholder="manager@restaurant.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ede7dd] text-sm focus:outline-none focus:border-[#f8a368] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#11233e] mb-1">عدد الطاولات</label>
                    <input
                      required
                      type="number"
                      defaultValue={12}
                      min={1}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ede7dd] text-sm focus:outline-none focus:border-[#f8a368] font-medium"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#f89e55] hover:bg-[#ea8a26] text-white font-bold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
                    >
                      إرسال وتفعيل الروابط (99 ₪ / شهر)
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-[#e8f8f2] text-[#0d9488] flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                <h4 className="text-xl font-black text-[#11233e]">تم استلام طلبك بنجاح!</h4>
                <p className="text-sm text-[#475569] mt-2 leading-relaxed font-medium">
                  جاري تجهيز روابط مطعمك الأربعة (المدير/الكاشير، النادل، المطبخ، ومنيو QR) مقابل 99 ₪ شهرياً. سيتواصل معك فريقنا خلال دقائق لإرسال روابط الدخول.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setContactModalOpen(false);
                      setContactSubmitted(false);
                      openDashboardTab('الرئيسية');
                    }}
                    className="px-6 py-2.5 bg-[#11233e] hover:bg-[#ea8a26] text-white font-bold rounded-full text-xs cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#f8a368]" />
                    <span>جرّب لوحة التحكم الآن</span>
                  </button>
                  <button
                    onClick={() => {
                      setContactModalOpen(false);
                      setContactSubmitted(false);
                    }}
                    className="px-5 py-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] font-bold rounded-full text-xs cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
