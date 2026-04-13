import React, { useState, useEffect, useRef } from 'react';

// --- البيانات (يمكنك نقلها لملف JSON لاحقاً) ---
const brands = ["BMW", "Mercedes", "Toyota", "Nissan", "Cadillac"];
const categories = [
  { id: 'mech', name: 'ميكانيك', sub: 'فلاتر + ناقل حركة', icon: '🔧' },
  { id: 'body', name: 'بدي خارجي', sub: 'جنوط', icon: '🚗' },
  { id: 'light', name: 'إضاءة', sub: '', icon: '💡' },
  { id: 'int', name: 'داخلية', sub: 'اكسسوارات', icon: '🪑' },
  { id: 'elec', name: 'كهرباء', sub: '', icon: '🔌' },
];

const initialProducts = [
  { 
    id: 1, 
    name: "فلتر زيت أصلي BMW", 
    brand: "BMW", 
    category: "mech", 
    price: 150, 
    images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=500", "https://images.unsplash.com/photo-1552650272-b8a34e21bc4b?q=80&w=500"], 
    desc: "فلتر زيت عالي الجودة متوافق مع محركات BMW الفئة الخامسة والسابعة، يضمن أداء مثالي للمحرك وحماية من الشوائب." 
  },
  { 
    id: 2, 
    name: "جنوط مرسيدس AMG 19", 
    brand: "Mercedes", 
    category: "body", 
    price: 4500, 
    images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=500"], 
    desc: "طقم جنوط ألمنيوم أصلي بتصميم رياضي جذاب، خفيف الوزن ويزيد من ثبات السيارة على السرعات العالية." 
  },
];

export default function AutoPartsApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [filter, setFilter] = useState({ brand: 'all', cat: 'all' });
  const [priceRange, setPriceRange] = useState(5000);
  const [viewingProduct, setViewingProduct] = useState(null); // لصفحة تفاصيل المنتج
  const [isZoomed, setIsZoomed] = useState(false); // لتكبير الصورة

  const sidebarRef = useRef();

  // إغلاق الشريط الجانبي عند الضغط خارجه
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // وظيفة المشاركة
  const handleShare = async (product) => {
    const shareData = {
      title: product.name,
      text: `شوف هذا المنتج في قطع غيار أوتو: ${product.name}`,
      url: window.location.href + `?product=${product.id}`
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("تم نسخ رابط المنتج بنجاح!");
      }
    } catch (err) { console.log(err) }
  };

  const filteredProducts = initialProducts.filter(p => 
    (filter.brand === 'all' || p.brand === filter.brand) &&
    (filter.cat === 'all' || p.category === filter.cat) &&
    p.price <= priceRange
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-right" dir="rtl">
      
      {/* --- HEADER --- */}
      <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-40">
        <button onClick={() => setSidebarOpen(true)} className="text-2xl p-2">☰</button>
        <h1 className="font-bold text-xl text-blue-900 tracking-tighter">AUTO PARTS</h1>
        <div className="w-10"></div>
      </header>

      {/* --- SIDEBAR (المهمة 1) --- */}
      <div className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <aside ref={sidebarRef} className={`fixed top-0 right-0 h-full w-80 bg-white transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl overflow-y-auto`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-black text-xl">التصنيفات</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-3xl text-gray-400 hover:text-red-500 transition-colors">✕</button>
            </div>

            <button 
              onClick={() => {setFilter({brand:'all', cat:'all'}); setSidebarOpen(false)}} 
              className="w-full text-right p-4 bg-blue-600 text-white rounded-xl font-bold mb-6 shadow-lg shadow-blue-100"
            >
              📦 عرض كل المنتجات
            </button>

            <div className="mb-8 p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm font-bold mb-3">💰 فلتر السعر: {priceRange} ريال</label>
              <input type="range" min="0" max="5000" value={priceRange} onChange={(e)=>setPriceRange(e.target.value)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            </div>

            <h3 className="font-bold text-gray-400 mb-4 px-2">اختر الماركة</h3>
            {brands.map(brand => (
              <div key={brand} className="mb-2">
                <button 
                  onClick={() => setSelectedBrand(selectedBrand === brand ? null : brand)} 
                  className={`w-full flex justify-between items-center py-3 px-4 rounded-xl transition-all ${selectedBrand === brand ? 'bg-gray-100 font-bold text-blue-700' : 'hover:bg-gray-50'}`}
                >
                  <span>{brand}</span>
                  <span className="text-xs transition-transform">{selectedBrand === brand ? '▲' : '▼'}</span>
                </button>
                {selectedBrand === brand && (
                  <div className="mr-6 mt-2 space-y-2 border-r-2 border-gray-100 pr-4">
                    {categories.map(cat => (
                      <button 
                        key={cat.id} 
                        onClick={() => {setFilter({brand, cat: cat.id}); setSidebarOpen(false)}} 
                        className="w-full text-right py-2 text-sm text-gray-600 hover:text-blue-600 block transition-colors"
                      >
                        {cat.icon} {cat.name} <span className="text-[10px] text-gray-400 block">{cat.sub}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* --- قائمة المنتجات --- */}
      {!viewingProduct && (
        <main className="p-4 grid grid-cols-2 gap-4 animate-fadeIn">
          {filteredProducts.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-95 transition-transform" onClick={() => setViewingProduct(p)}>
              <div className="relative">
                <img src={p.images[0]} className="w-full h-36 object-cover" alt={p.name} />
                <button 
                  onClick={(e) => {e.stopPropagation(); handleShare(p)}} 
                  className="absolute top-2 left-2 bg-white/90 p-2 rounded-full shadow-md text-xs"
                >
                  📤
                </button>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm h-10 overflow-hidden line-clamp-2">{p.name}</h3>
                <p className="text-blue-600 font-black mt-1">{p.price} ريال</p>
              </div>
            </div>
          ))}
        </main>
      )}

      {/* --- صفحة المنتج المخصصة (المهمة 2) --- */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-white z-[60] overflow-y-auto pb-24 animate-slideUp">
          <div className="relative">
            {/* زر الرجوع */}
            <button onClick={() => setViewingProduct(null)} className="absolute top-4 right-4 bg-black/40 text-white w-10 h-10 rounded-full z-10 flex items-center justify-center backdrop-blur-sm">✕</button>
            
            {/* معرض الصور مع التكبير */}
            <div className={`relative h-[40vh] bg-gray-100 overflow-hidden transition-all duration-300 ${isZoomed ? 'h-[60vh]' : 'h-[40vh]'}`}>
              <img 
                src={viewingProduct.images[0]} 
                className={`w-full h-full object-contain transition-transform duration-500 ${isZoomed ? 'scale-150' : 'scale-100'}`} 
                onClick={() => setIsZoomed(!isZoomed)}
                alt="Product"
              />
              <div className="absolute bottom-4 right-4 bg-black/20 px-3 py-1 rounded-full text-white text-xs">اضغط للتكبير 🔍</div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">{viewingProduct.name}</h2>
                  <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{viewingProduct.brand}</span>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-green-600">{viewingProduct.price}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">ريال سعودي</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl mb-8">
                <h3 className="font-bold text-gray-900 mb-2">الوصف الكامل:</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{viewingProduct.desc}</p>
              </div>

              {/* أزرار الأكشن */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 active:scale-95 transition-transform flex items-center justify-center gap-3">
                   أضف إلى السلة 🛒
                </button>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleShare(viewingProduct)}
                    className="flex-1 bg-gray-100 text-gray-800 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    مشاركة 📤
                  </button>
                  <button 
                    onClick={() => window.open(`https://wa.me/905XXXXXXX?text=استفسار بخصوص: ${viewingProduct.name}`)}
                    className="flex-1 bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    واتساب 💬
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
