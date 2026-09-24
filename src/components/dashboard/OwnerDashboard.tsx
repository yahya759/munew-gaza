import React, { useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  UtensilsCrossed,
  Grid,
  ChefHat,
  QrCode,
  TrendingUp,
  Settings,
  ArrowRight,
  LogOut,
  ExternalLink,
  Smartphone,
  Bell,
  Menu as MenuIcon,
  X,
  ChevronDown,
} from 'lucide-react';
import {
  DashboardTab,
  MenuItem,
  Table,
  Order,
  RestaurantSettings,
  KitchenStatus,
  OrderItem,
} from '../../types/restaurant';
import { OverviewView } from './OverviewView';
import { OrdersCashierView } from './OrdersCashierView';
import { MenuManagementView } from './MenuManagementView';
import { TablesView } from './TablesView';
import { KitchenView } from './KitchenView';
import { AccessLinksView } from './AccessLinksView';
import { ReportsView } from './ReportsView';
import { SettingsView } from './SettingsView';
import { WaiterView } from './WaiterView';
import { GuestMenuView } from './GuestMenuView';

interface OwnerDashboardProps {
  onBackToLanding: () => void;
  initialTab?: DashboardTab;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  settings: RestaurantSettings;
  setSettings: React.Dispatch<React.SetStateAction<RestaurantSettings>>;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  onBackToLanding,
  initialTab = 'الرئيسية',
  menuItems,
  setMenuItems,
  tables,
  setTables,
  orders,
  setOrders,
  settings,
  setSettings,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Standalone full-screen modal overlays for Waiter and Guest Menu
  const [activeFullscreenView, setActiveFullscreenView] = useState<
    'none' | 'waiter' | 'kitchen' | 'guest_menu'
  >('none');
  const [waiterPreselectedTable, setWaiterPreselectedTable] = useState<number | null>(null);

  // Counters for navigation badges
  const unpaidCount = orders.filter((o) => o.paymentStatus === 'غير مدفوع').length;
  const kitchenPendingCount = orders.filter(
    (o) => o.kitchenStatus === 'جديد' || o.kitchenStatus === 'قيد الطهي'
  ).length;
  const occupiedTablesCount = tables.filter((t) => t.status !== 'متاحة').length;

  // --- Order State Handlers ---
  const handleTogglePayment = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const nextPayment = o.paymentStatus === 'غير مدفوع' ? 'مدفوع' : 'غير مدفوع';
        return {
          ...o,
          paymentStatus: nextPayment,
          paidAt: nextPayment === 'مدفوع' ? 'الآن' : undefined,
        };
      })
    );

    // Also update table status
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      setTables((prev) =>
        prev.map((t) => {
          if (t.number !== targetOrder.tableNumber) return t;
          // If marked paid, table becomes free (متاحة) unless new order exists
          const isMarkedPaid = targetOrder.paymentStatus === 'غير مدفوع';
          return {
            ...t,
            status: isMarkedPaid ? 'متاحة' : 'بانتظار الدفع',
            currentOrderId: isMarkedPaid ? undefined : orderId,
          };
        })
      );
    }
  };

  const handleUpdateKitchenStatus = (orderId: string, status: KitchenStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return { ...o, kitchenStatus: status };
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      setTables((prev) =>
        prev.map((t) => {
          if (t.number !== targetOrder.tableNumber) return t;
          if (status === 'جاهز للتقديم' || status === 'تم التقديم') {
            return { ...t, status: 'بانتظار الدفع' };
          } else {
            return { ...t, status: 'بانتظار المطبخ' };
          }
        })
      );
    }
  };

  const handleSubmitNewOrder = (
    tableNumber: number,
    waiterName: string,
    items: OrderItem[]
  ) => {
    const total = items.reduce((s, it) => s + it.qty * it.price, 0);
    const newOrderNumber =
      orders.length > 0 ? Math.max(...orders.map((o) => o.orderNumber)) + 1 : 101;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      tableNumber,
      waiterName,
      createdAt: 'الآن',
      kitchenStatus: 'جديد',
      paymentStatus: 'غير مدفوع',
      items,
      total,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update table status to waiting kitchen
    setTables((prev) =>
      prev.map((t) => {
        if (t.number !== tableNumber) return t;
        return {
          ...t,
          status: 'بانتظار المطبخ',
          currentOrderId: newOrder.id,
        };
      })
    );

    setActiveFullscreenView('none');
  };

  const handleDirectEditOrder = (orderId: string, newItems: OrderItem[]) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const total = newItems.reduce((s, it) => s + it.qty * it.price, 0);
        return {
          ...o,
          items: newItems,
          total,
          createdAt: 'تم التحديث الآن',
        };
      })
    );
    setActiveFullscreenView('none');
  };

  const handleRequestOrderChange = (
    orderId: string,
    waiterName: string,
    reason: string,
    addedItems: OrderItem[]
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          changeRequest: {
            id: `cr-${Date.now()}`,
            requestedAt: 'الآن',
            waiterName,
            reason,
            addedItems,
            removedItemIds: [],
            status: 'بانتظار الموافقة',
          },
        };
      })
    );
    setActiveFullscreenView('none');
  };

  const handleApproveChangeRequest = (orderId: string, approve: boolean) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId || !o.changeRequest) return o;
        if (approve) {
          const merged = [...o.items, ...o.changeRequest.addedItems];
          const total = merged.reduce((s, it) => s + it.qty * it.price, 0);
          return {
            ...o,
            items: merged,
            total,
            changeRequest: { ...o.changeRequest, status: 'تمت الموافقة' },
          };
        } else {
          return {
            ...o,
            changeRequest: { ...o.changeRequest, status: 'مرفوض' },
          };
        }
      })
    );
  };

  // --- Menu Management Handlers ---
  const handleAddMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleMenuAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  // --- Table Handlers ---
  const handleGenerateTablesCount = (count: number) => {
    const newTables: Table[] = [];
    for (let i = 1; i <= count; i++) {
      newTables.push({
        number: i,
        capacity: i % 4 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
        status: 'متاحة',
      });
    }
    setTables(newTables);
  };

  const handleAddManualTable = (tableNumber: number, capacity: number) => {
    const newTable: Table = {
      number: tableNumber,
      capacity,
      status: 'متاحة',
    };
    setTables((prev) => [...prev, newTable].sort((a, b) => a.number - b.number));
  };

  const handleDeleteTable = (tableNumber: number) => {
    setTables((prev) => prev.filter((t) => t.number !== tableNumber));
  };

  // Quick navigation helpers
  const openWaiterForTable = (tableNumber: number) => {
    setWaiterPreselectedTable(tableNumber);
    setActiveFullscreenView('waiter');
  };

  const openCashierForTable = (tableNumber: number) => {
    setActiveTab('الطلبات والحسابات');
  };

  // Navigation Items list
  const NAV_ITEMS: { name: DashboardTab; icon: React.ReactNode; badge?: number }[] = [
    { name: 'الرئيسية', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      name: 'الطلبات والحسابات',
      icon: <Receipt className="w-4 h-4" />,
      badge: unpaidCount > 0 ? unpaidCount : undefined,
    },
    { name: 'المنيو والوجبات', icon: <UtensilsCrossed className="w-4 h-4" /> },
    {
      name: 'الطاولات',
      icon: <Grid className="w-4 h-4" />,
      badge: occupiedTablesCount > 0 ? occupiedTablesCount : undefined,
    },
    {
      name: 'المطبخ',
      icon: <ChefHat className="w-4 h-4" />,
      badge: kitchenPendingCount > 0 ? kitchenPendingCount : undefined,
    },
    { name: 'روابط الوصول', icon: <QrCode className="w-4 h-4" /> },
    { name: 'التقارير', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'إعدادات المطعم', icon: <Settings className="w-4 h-4" /> },
  ];

  // Fullscreen view overrides
  if (activeFullscreenView === 'guest_menu') {
    return (
      <GuestMenuView
        menuItems={menuItems}
        settings={settings}
        onBackToDashboard={() => setActiveFullscreenView('none')}
      />
    );
  }

  if (activeFullscreenView === 'waiter') {
    return (
      <div className="min-h-screen bg-[#fffdfa] p-4 sm:p-6 lg:p-8 w-full">
        <WaiterView
          menuItems={menuItems}
          tables={tables}
          orders={orders}
          preselectedTableNumber={waiterPreselectedTable}
          onSubmitNewOrder={handleSubmitNewOrder}
          onDirectEditOrder={handleDirectEditOrder}
          onRequestOrderChange={handleRequestOrderChange}
          onBackToDashboard={() => setActiveFullscreenView('none')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#11233e] flex flex-col font-['Cairo',sans-serif] w-full">
      {/* 1. الشريط العلوي للمالك */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ede7dd] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs w-full">
        {/* الشعار وبيانات الفرع الحالي */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#11233e] hover:bg-[#f8fafc] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#f8a368] text-white flex items-center justify-center font-black shadow-xs">
              ر
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base text-[#11233e]">
                  {settings.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fff2e5] text-[#ea8a26] border border-[#fbd4b6]">
                  {settings.branchName}
                </span>
              </div>
              <p className="text-[11px] text-[#64748b]">لوحة تحكم المالك والإدارة</p>
            </div>
          </div>
        </div>

        {/* أزرار الانتقال السريع بين الأدوار + العودة للموقع التعريفي */}
        <div className="flex items-center gap-2">
          {/* الانتقال لواجهة القرصون */}
          <button
            onClick={() => {
              setWaiterPreselectedTable(null);
              setActiveFullscreenView('waiter');
            }}
            className="hidden lg:flex items-center gap-1.5 bg-[#f0fdfa] hover:bg-[#ccfbf1] text-[#0f766e] border border-[#99f6e4] px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="فتح واجهة القرصون في نافذة كاملة"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>واجهة القرصون</span>
          </button>

          {/* الانتقال لشاشة المطبخ */}
          <button
            onClick={() => setActiveTab('المطبخ')}
            className="hidden sm:flex items-center gap-1.5 bg-[#fff7ed] hover:bg-[#ffedd5] text-[#c2410c] border border-[#fed7aa] px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="فتح شاشة المطبخ"
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>المطبخ</span>
            {kitchenPendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#f87171] text-white text-[10px] font-bold flex items-center justify-center">
                {kitchenPendingCount}
              </span>
            )}
          </button>

          {/* الانتقال لمنيو الزبائن */}
          <button
            onClick={() => setActiveFullscreenView('guest_menu')}
            className="hidden sm:flex items-center gap-1.5 bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#11233e] border border-[#e2e8f0] px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            title="معاينة منيو الزبائن للعرض فقط"
          >
            <QrCode className="w-3.5 h-3.5 text-[#ea8a26]" />
            <span>منيو الزبائن QR</span>
          </button>

          {/* العودة للموقع التعريفي (Landing Page) */}
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 bg-[#11233e] hover:bg-[#ea8a26] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span>الموقع التعريفي</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. جسم لوحة التحكم: السايدبار + المحتوى المتمدد على كامل الشاشة */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* القائمة الجانبية (Sidebar) */}
        <aside
          className={`w-full lg:w-64 xl:w-72 shrink-0 bg-white rounded-3xl border border-[#ede7dd] p-4 shadow-xs space-y-1.5 lg:sticky lg:top-20 ${
            mobileMenuOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="pb-3 px-3 text-xs font-bold text-[#64748b] border-b border-[#f1ece3] flex items-center justify-between">
            <span>أقسام الإدارة</span>
            <span className="text-[10px] text-[#ea8a26] font-bold">99 ₪ / شهر</span>
          </div>

          <nav className="space-y-1 pt-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#11233e] text-white shadow-xs'
                      : 'text-[#475569] hover:bg-[#fff9f4] hover:text-[#ea8a26]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#f8a368]' : 'text-[#64748b]'}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#f8a368] text-white'
                          : 'bg-[#fee2e2] text-[#ef4444]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* بطاقة روابط الوصول السريعة في أسفل القائمة */}
          <div className="pt-4 mt-4 border-t border-[#f1ece3] space-y-2">
            <span className="text-[11px] font-bold text-[#64748b] px-3 block">
              الواجهات المستقلة
            </span>
            <button
              onClick={() => {
                setWaiterPreselectedTable(null);
                setActiveFullscreenView('waiter');
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#0d9488] bg-[#f0fdfa] hover:bg-[#ccfbf1] transition-colors cursor-pointer"
            >
              <span>فتح شاشة القرصون</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveFullscreenView('guest_menu')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#ea580c] bg-[#fff7ed] hover:bg-[#ffedd5] transition-colors cursor-pointer"
            >
              <span>فتح منيو الزبائن (QR)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* مساحة المحتوى الرئيسية للتاب النشط المتمدد */}
        <main className="flex-1 min-w-0 w-full">
          {activeTab === 'الرئيسية' && (
            <OverviewView
              orders={orders}
              tables={tables}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectOrder={() => setActiveTab('الطلبات والحسابات')}
              onOpenNewOrder={() => {
                setWaiterPreselectedTable(null);
                setActiveFullscreenView('waiter');
              }}
              onTogglePayment={handleTogglePayment}
            />
          )}

          {activeTab === 'الطلبات والحسابات' && (
            <OrdersCashierView
              orders={orders}
              onTogglePayment={handleTogglePayment}
              onUpdateKitchenStatus={handleUpdateKitchenStatus}
              onApproveChangeRequest={handleApproveChangeRequest}
            />
          )}

          {activeTab === 'المنيو والوجبات' && (
            <MenuManagementView
              menuItems={menuItems}
              onAddItem={handleAddMenuItem}
              onUpdateItem={handleUpdateMenuItem}
              onDeleteItem={handleDeleteMenuItem}
              onToggleAvailability={handleToggleMenuAvailability}
            />
          )}

          {activeTab === 'الطاولات' && (
            <TablesView
              tables={tables}
              orders={orders}
              onGenerateTablesCount={handleGenerateTablesCount}
              onAddManualTable={handleAddManualTable}
              onDeleteTable={handleDeleteTable}
              onOpenOrderForTable={openWaiterForTable}
              onOpenCashierForTable={openCashierForTable}
            />
          )}

          {activeTab === 'المطبخ' && (
            <KitchenView
              orders={orders}
              onUpdateKitchenStatus={handleUpdateKitchenStatus}
            />
          )}

          {activeTab === 'روابط الوصول' && (
            <AccessLinksView
              settings={settings}
              onOpenWaiterView={() => {
                setWaiterPreselectedTable(null);
                setActiveFullscreenView('waiter');
              }}
              onOpenKitchenView={() => setActiveTab('المطبخ')}
              onOpenGuestMenuView={() => setActiveFullscreenView('guest_menu')}
            />
          )}

          {activeTab === 'التقارير' && <ReportsView orders={orders} />}

          {activeTab === 'إعدادات المطعم' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(newSettings) => setSettings(newSettings)}
              onOpenGuestMenu={() => setActiveFullscreenView('guest_menu')}
            />
          )}
        </main>
      </div>
    </div>
  );
};
