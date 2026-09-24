import React, { useState } from 'react';
import {
  Building2,
  Phone,
  MapPin,
  Clock,
  QrCode,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { RestaurantSettings } from '../../types/restaurant';
import { QrCodeSvg } from '../common/QrCodeSvg';

interface SettingsViewProps {
  settings: RestaurantSettings;
  onUpdateSettings: (newSettings: RestaurantSettings) => void;
  onOpenGuestMenu: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onOpenGuestMenu,
}) => {
  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [openingHours, setOpeningHours] = useState(settings.openingHours);
  const [branchName, setBranchName] = useState(settings.branchName);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      name: name.trim(),
      tagline: tagline.trim(),
      phone: phone.trim(),
      address: address.trim(),
      openingHours: openingHours.trim(),
      branchName: branchName.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(settings.sharedMenuSlug);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* الترويسة العلوية */}
      <div className="pb-3 border-b border-[#ede7dd]">
        <h1 className="text-2xl font-black text-[#11233e]">إعدادات المطعم والحساب</h1>
        <p className="text-xs sm:text-sm text-[#64748b] mt-1">
          إدارة بيانات الفرع، معلومات الاتصال، رابط منيو الزبائن، والاشتراك الشهري.
        </p>
      </div>

      {savedSuccess && (
        <div className="bg-[#e8f8f2] border border-[#9ee4cf] text-[#0d9488] p-4 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#0d9488]" />
          <span>تم حفظ إعدادات المطعم بنجاح وتحديث كافة الواجهات.</span>
        </div>
      )}

      {/* تنبيه قاعدة المنتج: فرع واحد لكل حساب */}
      <div className="bg-[#fff9f4] border border-[#fbd4b6] p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm">
        <AlertCircle className="w-5 h-5 text-[#ea8a26] shrink-0 mt-0.5" />
        <div className="text-[#9a3412] leading-relaxed">
          <strong>قاعدة إدارة الفروع:</strong> يدير كل حساب مالك <strong>مطعماً واحداً (فرعاً واحداً)</strong> لضمان استقلالية الطلبات والمطبخ وحسابات الطاولات. في حال رغبتكم في تشغيل فرع ثانٍ، يتم إنشاء حساب مستقل منفصل لكل فرع بنفس سعر الاشتراك المعتمد (99 ₪ / شهر).
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* نموذج الإعدادات الأساسية */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#ede7dd] shadow-xs space-y-5"
        >
          <h2 className="text-base font-bold text-[#11233e] pb-2 border-b border-[#ede7dd]">
            البيانات العامة للفرع
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* اسم المطعم */}
            <div>
              <label className="block font-bold text-[#11233e] mb-1">اسم المطعم</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none"
                required
              />
            </div>

            {/* اسم الفرع */}
            <div>
              <label className="block font-bold text-[#11233e] mb-1">اسم الفرع الحالي</label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none"
                required
              />
            </div>

            {/* الوصف التعريفي */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#11233e] mb-1">
                الوصف التعريفي للمطعم (يظهر للزبائن في أعلى المنيو)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none"
              />
            </div>

            {/* رقم الهاتف */}
            <div>
              <label className="block font-bold text-[#11233e] mb-1">رقم الهاتف للتواصل</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none"
                required
              />
            </div>

            {/* ساعات العمل */}
            <div>
              <label className="block font-bold text-[#11233e] mb-1">ساعات العمل اليومية</label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none"
              />
            </div>

            {/* العنوان */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#11233e] mb-1">العنوان الجغرافي</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] focus:border-[#f8a368] outline-none"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#ede7dd] flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#f8a368] hover:bg-[#ea8a26] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>
          </div>
        </form>

        {/* العمود الأيسر: بطاقة الاشتراك + رمز QR المشترك */}
        <div className="lg:col-span-4 space-y-5">
          {/* بطاقة الاشتراك الشهري المؤكدة: 99 ₪ / شهر */}
          <div className="bg-white p-5 rounded-3xl border border-[#ede7dd] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#ede7dd]">
              <span className="text-xs font-bold text-[#64748b]">خطة الاشتراك</span>
              <span className="bg-[#e8f8f2] text-[#0d9488] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                نشط
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#11233e]">
                  {settings.subscriptionPrice}
                </span>
                <span className="text-sm font-bold text-[#64748b]">₪ / شهرياً</span>
              </div>
              <p className="text-xs text-[#64748b] mt-1 font-medium">
                يشمل تشغيل حساب الفرع بكافة واجهاته الأربع دون أي رسوم مخفية.
              </p>
            </div>

            <div className="pt-2 text-[11px] text-[#64748b] space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>إدارة كاملة للطاولات والمطبخ والكاشير</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>منيو QR موحد للزبائن غير محدود الزيارات</span>
              </div>
            </div>
          </div>

          {/* بطاقة QR المشترك الموحد */}
          <div className="bg-white p-5 rounded-3xl border border-[#ede7dd] shadow-xs text-center space-y-3">
            <h3 className="font-bold text-sm text-[#11233e]">رمز QR الموحد للمنيو</h3>
            <p className="text-xs text-[#64748b]">
              اطبع هذا الرمز على كافة طاولات المطعم وستاندات الصالة.
            </p>

            <div className="flex justify-center pt-1">
              <QrCodeSvg value={settings.sharedMenuSlug} size={140} />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#11233e] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
              </button>
              <button
                type="button"
                onClick={onOpenGuestMenu}
                className="bg-[#11233e] hover:bg-[#ea8a26] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="فتح المنيو"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
