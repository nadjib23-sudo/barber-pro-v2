import React, { useState, useMemo } from 'react';
import { 
  Scissors, Home, Zap, Users, ShoppingBag, DollarSign, 
  Plus, Trash2, Calendar, LayoutDashboard, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface Service { id: string; name: string; price: number; category: string; }
interface Sale { id: string; total: number; timestamp: number; items: any[]; }

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sales, setSales] = useState<Sale[]>([]);
  
  // بيانات تجريبية للخدمات
  const services: Service[] = [
    { id: '1', name: 'حلاقة شعر كلاسيك', price: 500, category: 'شعر' },
    { id: '2', name: 'حلاقة ذقن', price: 300, category: 'ذقن' },
    { id: '3', name: 'تنظيف بشرة', price: 1000, category: 'عناية' },
  ];

  const totalRevenue = useMemo(() => sales.reduce((acc, s) => acc + s.total, 0), [sales]);

  const addSale = (service: Service) => {
    const newSale = { id: Date.now().toString(), total: service.price, timestamp: Date.now(), items: [service] };
    setSales([newSale, ...sales]);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-right" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col shadow-2xl">
        <div className="p-8 flex items-center gap-4 border-b border-slate-800">
          <div className="bg-indigo-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Scissors size={24} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tight">صالون برو</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-3 mt-4">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20}/>} label="لوحة التحكم" />
          <NavItem active={activeTab === 'pos'} onClick={() => setActiveTab('pos')} icon={<Zap size={20}/>} label="نقطة البيع" />
          <NavItem active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} icon={<DollarSign size={20}/>} label="التقارير" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between shadow-sm">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide">
            {activeTab === 'dashboard' ? 'الاحصائيات العامة' : activeTab === 'pos' ? 'نظام الدفع السريع' : 'سجل المبيعات'}
          </h2>
          <div className="flex items-center gap-4">
             <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">التاريخ اليوم</p>
                <p className="text-sm font-black text-slate-700">{new Date().toLocaleDateString('ar-DZ')}</p>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard label="إجمالي الدخل" value={`${totalRevenue} DA`} icon={<DollarSign/>} color="emerald" />
                <StatCard label="عمليات اليوم" value={sales.length.toString()} icon={<ShoppingBag/>} color="indigo" />
                <StatCard label="العملاء" value="0" icon={<Users/>} color="orange" />
              </motion.div>
            )}

            {activeTab === 'pos' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-500 text-sm mb-6 uppercase tracking-widest">قائمة الخدمات المتوفرة</h3>
                  {services.map(s => (
                    <button key={s.id} onClick={() => addSale(s)} className="w-full flex items-center justify-between p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group text-right">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors text-slate-400 group-hover:text-indigo-600">
                           <Scissors size={20}/>
                        </div>
                        <div>
                          <p className="font-black text-slate-800">{s.name}</p>
                          <p className="text-xs font-bold text-slate-400">{s.category}</p>
                        </div>
                      </div>
                      <div className="text-lg font-black text-indigo-600">{s.price} DA</div>
                    </button>
                  ))}
                </div>
                
                <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
                   <div className="relative z-10">
                      <h3 className="text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-8">آخر الفواتير المستخرجة</h3>
                      <div className="space-y-4">
                        {sales.length === 0 ? (
                          <p className="text-slate-500 text-center py-10 italic">لا توجد مبيعات حالياً</p>
                        ) : (
                          sales.slice(0, 5).map(sale => (
                            <div key={sale.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                              <div>
                                <p className="font-bold text-sm">عملية #{sale.id.slice(-4)}</p>
                                <p className="text-[10px] text-slate-400">{new Date(sale.timestamp).toLocaleTimeString('ar-DZ')}</p>
                              </div>
                              <span className="font-black text-indigo-400">+{sale.total} DA</span>
                            </div>
                          ))
                        )}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Helpers ---
function NavItem({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}

function StatCard({ label, value, icon, color }: any) {
  const colors: any = { indigo: 'bg-indigo-50 text-indigo-600', emerald: 'bg-emerald-50 text-emerald-600', orange: 'bg-orange-50 text-orange-600' };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${colors[color]}`}>{icon}</div>
       <div className="text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
       <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{label}</div>
    </div>
  );
}

