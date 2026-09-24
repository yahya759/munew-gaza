import React, { useState } from 'react';
import {
  QrCode,
  ChefHat,
  UtensilsCrossed,
  Copy,
  Check,
  Download,
  ExternalLink,
  Info,
  Smartphone,
  Monitor,
  Sparkles,
} from 'lucide-react';
import { RestaurantSettings, DashboardTab } from '../../types/restaurant';
import { QrCodeSvg } from '../common/QrCodeSvg';

interface AccessLinksViewProps {
  settings: RestaurantSettings;
  onOpenWaiterView: () => void;
  onOpenKitchenView: () => void;
  onOpenGuestMenuView: () => void;
}

export const AccessLinksView: React.FC<AccessLinksViewProps> = ({
  settings,
  onOpenWaiterView,
  onOpenKitchenView,
  onOpenGuestMenuView,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWaiter, setCopiedWaiter] = useState(false);
  const [copiedKitchen, setCopiedKitchen] = useState(false);

  const guestMenuUrl = settings.sharedMenuSlug || 'https://restosync.app/menu/orvieto';
  const waiterUrl = 'https://restosync.app/waiter/live';
  const kitchenUrl = 'https://restosync.app/kitchen/screen';

  const handleCopy = (text: string, type: 'guest' | 'waiter' | 'kitchen') => {
    navigator.clipboard?.writeText(text);
    if (type === 'guest') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else if (type === 'waiter') {
      setCopiedWaiter(true);
      setTimeout(() => setCopiedWaiter(false), 2000);
    } else {
      setCopiedKitchen(true);
      setTimeout(() => setCopiedKitchen(false), 2000);
    }
  };

  const handleDownloadQr = () => {
    alert(
      'تم إعداد كود QR بجودة عالية جاهز للطباعة على طاولات المطعم وستاندات الاستقبال.'
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* الترويسة العلوية */}
      <div className="pb-3 border-b border-[#ede7dd]">
        <h1 className="text-2xl font-black text-[#11233e]">روابط الوصول ورموز QR</h1>
        <p className="text-xs sm:text-sm text-[#64748b] mt-1">
          روابط منفصلة لكل دور: منيو الزبائن للعرض فقط، شاشة المطبخ، وواجهة القرصون.
        </p>
      </div>

      {/* تنبيه قاعدة المنتج الهامة: رمز QR موحد للمطعم */}
      <div className="bg-[#fff9f4] border border-[#fbd4b6] p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm">
        <Info className="w-5 h-5 text-[#ea8a26] shrink-0 mt-0.5" />
        <div className="text-[#9a3412] leading-relaxed">
          <strong>ملاحظة هامة حول نظام المنيو:</strong> يعتمد النظام على <strong>رابط ورمز QR واحد مشترك وموحد للمطعم</strong> يوضع على كافة الطاولات. المنيو مخصص <strong>للعرض فقط</strong> لتصفح الأطباق والأسعار؛ ولا يقوم الزبون بإرسال الطلبات من هاتفه، بل يقوم القرصون بتسجيل الطلب وتحديد رقم الطاولة.
        </div>
      </div>

      {/* البطاقات الثلاث الرئيسية لأدوار الوصول */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. منيو الزبائن QR */}
        <div className="bg-white rounded-3xl border-2 border-[#ede7dd] p-6 shadow-xs flex flex-col justify-between hover:border-[#ea8a26] transition-all group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#fff2e5] text-[#ea8a26] flex items-center justify-center">
              <QrCode className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#11233e]">منيو الزبائن الرقمي</h3>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#fee2e2] text-[#ef4444]">
                  للعرض فقط
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                رابط موحد يفتحه الزبون لمشاهدة صور الأطباق، التوصيفات الدقيقة، والأسعار بالشيكل.
              </p>
            </div>

            {/* معاينة مصغرة لرمز QR */}
            <div className="pt-2 flex justify-center">
              <QrCodeSvg value={guestMenuUrl} size={130} subText="امسح لتصفح المنيو" />
            </div>
          </div>

          <div className="pt-5 space-y-2 border-t border-[#f1ece3] mt-4">
            <button
              onClick={onOpenGuestMenuView}
              className="w-full bg-[#11233e] hover:bg-[#ea8a26] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>معاينة واجهة الزبائن الحية</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(guestMenuUrl, 'guest')}
                className="flex-1 bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#11233e] py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ رابط المنيو'}</span>
              </button>
              <button
                onClick={handleDownloadQr}
                className="bg-[#fff2e5] hover:bg-[#fbd4b6] text-[#ea8a26] px-3 py-2 rounded-xl font-bold text-xs flex items-center justify-center cursor-pointer"
                title="تحميل كود QR للطباعة"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. واجهة القرصون */}
        <div className="bg-white rounded-3xl border-2 border-[#ede7dd] p-6 shadow-xs flex flex-col justify-between hover:border-[#f8a368] transition-all group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#e8f8f2] text-[#0d9488] flex items-center justify-center">
              <Smartphone className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#11233e]">واجهة القرصون</h3>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#e8f8f2] text-[#0d9488]">
                  تسجيل الطلبات
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                واجهة سريعة وخفيفة على هاتف القرصون لاختيار الطاولة وتسجيل وجبات الزبائن وإرسالها فورياً.
              </p>
            </div>

            <div className="bg-[#fbf9f5] p-3.5 rounded-2xl border border-[#f1ece3] text-xs space-y-1.5 text-[#64748b]">
              <div className="font-bold text-[#11233e]">مميزات القرصون:</div>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>اختيار الطاولة وإضافة الكميات بلمسة واحدة</li>
                <li>تعديل مباشر للطلب ما دام المطبخ لم يبدأ الطهي</li>
                <li>إرسال طلب موافقة للكاشير إذا بدأ الطهي بالفعل</li>
              </ul>
            </div>
          </div>

          <div className="pt-5 space-y-2 border-t border-[#f1ece3] mt-4">
            <button
              onClick={onOpenWaiterView}
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>فتح شاشة القرصون</span>
            </button>
            <button
              onClick={() => handleCopy(waiterUrl, 'waiter')}
              className="w-full bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#11233e] py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedWaiter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWaiter ? 'تم نسخ الرابط!' : 'نسخ رابط القرصون للموظفين'}</span>
            </button>
          </div>
        </div>

        {/* 3. شاشة المطبخ (KDS) */}
        <div className="bg-white rounded-3xl border-2 border-[#ede7dd] p-6 shadow-xs flex flex-col justify-between hover:border-[#f87171] transition-all group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#fee2e2] text-[#ef4444] flex items-center justify-center">
              <ChefHat className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#11233e]">شاشة وتحديثات المطبخ</h3>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#fff2e5] text-[#ea580c]">
                  شاشة الطهاة
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                تعمل على الشاشات أو أجهزة التابلت داخل المطبخ لعرض الطلبات وتحديث مراحل الطهي لحظة بلحظة.
              </p>
            </div>

            <div className="bg-[#fbf9f5] p-3.5 rounded-2xl border border-[#f1ece3] text-xs space-y-1.5 text-[#64748b]">
              <div className="font-bold text-[#11233e]">مميزات المطبخ:</div>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>استقبال متزامن فوري بالتوازي مع الكاشير</li>
                <li>تحديث الحالة: جديد ➜ قيد الطهي ➜ جاهز ➜ تم التقديم</li>
                <li>إشعار بالطلبات المعدلة الصادرة عن الإدارة</li>
              </ul>
            </div>
          </div>

          <div className="pt-5 space-y-2 border-t border-[#f1ece3] mt-4">
            <button
              onClick={onOpenKitchenView}
              className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>فتح شاشة المطبخ</span>
            </button>
            <button
              onClick={() => handleCopy(kitchenUrl, 'kitchen')}
              className="w-full bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#11233e] py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedKitchen ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKitchen ? 'تم نسخ الرابط!' : 'نسخ رابط شاشة المطبخ'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
