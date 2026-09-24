export type KitchenStatus = 'جديد' | 'قيد الطهي' | 'جاهز للتقديم' | 'تم التقديم';
export type PaymentStatus = 'غير مدفوع' | 'مدفوع';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  qty: number;
  notes?: string;
}

export interface OrderChangeRequest {
  id: string;
  requestedAt: string;
  waiterName: string;
  reason: string;
  addedItems: OrderItem[];
  removedItemIds: string[];
  status: 'بانتظار الموافقة' | 'تمت الموافقة' | 'مرفوض';
}

export interface Order {
  id: string;
  orderNumber: number;
  tableNumber: number;
  waiterName: string;
  createdAt: string;
  items: OrderItem[];
  kitchenStatus: KitchenStatus;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  total: number;
  changeRequest?: OrderChangeRequest;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
}

export interface Table {
  number: number;
  capacity: number;
  status: 'متاحة' | 'مشغولة' | 'بانتظار المطبخ' | 'بانتظار الدفع';
  currentOrderId?: string;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  phone: string;
  address: string;
  currency: string;
  openingHours: string;
  branchName: string;
  subscriptionPlan: string;
  subscriptionPrice: number;
  sharedMenuSlug: string;
}

export type DashboardTab =
  | 'الرئيسية'
  | 'الطلبات والحسابات'
  | 'المنيو والوجبات'
  | 'الطاولات'
  | 'المطبخ'
  | 'روابط الوصول'
  | 'التقارير'
  | 'إعدادات المطعم';
