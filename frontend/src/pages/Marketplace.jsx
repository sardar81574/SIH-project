import React, { useState } from 'react';
import { 
  Sprout, 
  Pill, 
  ShoppingCart, 
  ShieldCheck, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  X,
  Search,
  MapPin,
  Phone,
  User,
  Languages,
  AlertCircle,
  Tag,
  ArrowRight
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

/* =========================================================================
   BILINGUAL CROP-WISE CATALOG (SEEDS & MEDICINES)
========================================================================= */
const marketplaceProducts = [
  // 🌾 WHEAT
  {
    id: 'w-seed-1',
    category: 'seeds',
    cropType: 'wheat',
    nameEn: 'Sharbati Wheat Seeds (C-306 / HI-1544)',
    nameHi: 'शरबती गेहूं बीज (C-306 / HI-1544)',
    targetEn: 'High Yield, Rust & Smut Resistant',
    targetHi: 'गेरुआ (रतुआ) व कंडुआ प्रतिरोधी',
    descEn: 'Golden bold grain with premium chapati quality and drought tolerance.',
    descHi: 'बड़ा सुनहरा दाना, उत्कृष्ट रोटी गुणवत्ता और कम पानी में बंपर पैदावार।',
    price: 3400,
    unitEn: 'per Quintal (100kg)',
    unitHi: 'प्रति क्विंटल (100 किग्रा)',
    rating: 4.9,
    reviews: 142,
    badgeEn: 'ICAR Certified',
    badgeHi: 'ICAR प्रमाणित',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'w-med-1',
    category: 'medicines',
    cropType: 'wheat',
    nameEn: 'Tebuconazole 25.9% EC (Folicur)',
    nameHi: 'टेबुकोनाजोल 25.9% EC (फॉलिक्यूर)',
    targetEn: 'Yellow & Brown Rust, Karnal Bunt',
    targetHi: 'पीला व भूरा रतुआ, करनाल बंट',
    descEn: 'Broad-spectrum systemic fungicide for foliage and ear protection.',
    descHi: 'गेहूं में पीला रतुआ और करनाल बंट का तेजी से निवारण करने वाला फफूंदनाशक।',
    doseEn: '1.5 - 2 ml per liter water (25ml per 15L pump)',
    doseHi: '1.5 से 2 मिली प्रति लीटर पानी (25 मिली प्रति 15L पंप)',
    price: 850,
    unitEn: '250ml Bottle',
    unitHi: '250 मिली बॉटल',
    rating: 4.9,
    reviews: 210,
    badgeEn: 'Specialist Cure',
    badgeHi: 'अचूक फफूंदनाशक',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
  },

  // 🌾 PADDY / RICE
  {
    id: 'p-seed-1',
    category: 'seeds',
    cropType: 'paddy',
    nameEn: 'Pusa Basmati 1509 Certified Seeds',
    nameHi: 'पूसा बासमती 1509 प्रमाणित बीज',
    targetEn: 'Tolerant to Bacterial Leaf Blight',
    targetHi: 'ब्लाइट व झुलसा रोग सहनशील',
    descEn: 'Matures in 115 days with extra long slender aromatic grains.',
    descHi: 'कम अवधि (115 दिन), लंबे व सुगंधित दाने, कम लागत में अधिक लाभ।',
    price: 4200,
    unitEn: 'per 50kg Bag',
    unitHi: 'प्रति 50 किग्रा बैग',
    rating: 4.8,
    reviews: 165,
    badgeEn: 'Export Grade',
    badgeHi: 'निर्यात गुणवत्ता',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-med-1',
    category: 'medicines',
    cropType: 'paddy',
    nameEn: 'Tricyclazole 75% WP (Beam)',
    nameHi: 'ट्राइसाइक्लाजोल 75% WP (बीम)',
    targetEn: 'Paddy Blast (Leaf, Neck & Node Blast)',
    targetHi: 'धान का गर्दन तोड़ (Neck Blast) व ब्लास्ट',
    descEn: 'Systemic curative fungicide targeted specifically at blast pathogens.',
    descHi: 'धान में गर्दन तोड़ व पत्ती झुलसा का अचूक रासायनिक निवारण।',
    doseEn: '18-20 grams per 15L water tank',
    doseHi: '18-20 ग्राम प्रति 15 लीटर पंप',
    price: 640,
    unitEn: '120g Pack',
    unitHi: '120 ग्राम पैक',
    rating: 4.9,
    reviews: 310,
    badgeEn: 'Blast Specialist',
    badgeHi: 'ब्लास्ट रक्षक',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80'
  },

  // 🌾 CHICKPEA / GRAM
  {
    id: 'c-seed-1',
    category: 'seeds',
    cropType: 'chickpea',
    nameEn: 'Kabuli Dollar Chana Seeds (JGK-1)',
    nameHi: 'काबुली डॉलर चना बीज (JGK-1)',
    targetEn: 'Resistant to Fusarium Wilt & Root Rot',
    targetHi: 'उकठा (विल्ट) व जड़ सड़न प्रतिरोधी',
    descEn: 'Export quality bold white chickpea with strong branching.',
    descHi: 'मोटा सफेद दाना, मंडियों में उच्चतम भाव, मजबूत वानस्पतिक बढ़वार।',
    price: 7200,
    unitEn: 'per Quintal (100kg)',
    unitHi: 'प्रति क्विंटल (100 किग्रा)',
    rating: 4.8,
    reviews: 89,
    badgeEn: 'High Yield',
    badgeHi: 'बंपर पैदावार',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c-med-1',
    category: 'medicines',
    cropType: 'chickpea',
    nameEn: 'Emamectin Benzoate 5% SG (Proclaim)',
    nameHi: 'इमामेक्टिन बेंजोएट 5% SG (प्रोक्लेम)',
    targetEn: 'Pod Borer & Helicoverpa Caterpillar',
    targetHi: 'चने की घेंटी छेदक इल्ली व सुंडी',
    descEn: 'Stomach poison larvicide providing rapid kill of caterpillars.',
    descHi: 'घेंटी में छेद करने वाली इल्लियों का तुरंत और संपूर्ण सफाया।',
    doseEn: '8-10 grams per 15L water tank',
    doseHi: '8-10 ग्राम प्रति 15 लीटर पंप',
    price: 480,
    unitEn: '100g Pack',
    unitHi: '100 ग्राम पैक',
    rating: 4.9,
    reviews: 420,
    badgeEn: 'Larvicide Leader',
    badgeHi: 'इल्ली नाशक',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80'
  },

  // 🌾 MAIZE
  {
    id: 'm-seed-1',
    category: 'seeds',
    cropType: 'maize',
    nameEn: 'Pioneer P3396 Hybrid Maize Seeds',
    nameHi: 'पायनियर P3396 हाइब्रिड मक्का बीज',
    targetEn: 'Tolerant to Turcicum Blight & Stem Rot',
    targetHi: 'तना सड़न व पत्ती झुलसा प्रतिरोधी',
    descEn: 'Sturdy stalk resistance with high-density grain filling up to cob tip.',
    descHi: 'ऊपर तक दानों से भरा ठोस भुट्टा, तेज हवा में न गिरने वाला मजबूत तना।',
    price: 2450,
    unitEn: '4kg Pack (1 Acre)',
    unitHi: '4 किग्रा पैक (1 एकड़)',
    rating: 4.7,
    reviews: 94,
    badgeEn: 'Heavy Cob',
    badgeHi: 'ठोस भुट्टा',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'm-med-1',
    category: 'medicines',
    cropType: 'maize',
    nameEn: 'Chlorantraniliprole 18.5% SC (Coragen)',
    nameHi: 'कोराजन कीटनाशक (Coragen FMC)',
    targetEn: 'Fall Armyworm (FAW) & Stem Borer',
    targetHi: 'मक्का का खतरनाक फाल आर्मीवर्म व तना छेदक',
    descEn: 'Long duration ovicidal and larvicidal protection for maize whorls.',
    descHi: 'मक्के की पोंगी में बैठे खतरनाक आर्मीवर्म कीट का 21 दिन तक संपूर्ण नियंत्रण।',
    doseEn: '7 ml per 15L water tank',
    doseHi: '7 मिली प्रति 15 लीटर पंप',
    price: 1850,
    unitEn: '150ml Bottle',
    unitHi: '150 मिली बॉटल',
    rating: 4.9,
    reviews: 512,
    badgeEn: 'Gold Standard',
    badgeHi: 'ओरिजिनल फॉर्मूला',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80'
  },

  // 🌾 SOYBEAN
  {
    id: 's-seed-1',
    category: 'seeds',
    cropType: 'soybean',
    nameEn: 'JS 20-34 Breeder Certified Seeds',
    nameHi: 'सोयाबीन बीज (JS 20-34 ब्रीडर)',
    targetEn: 'Resistant to Yellow Mosaic Virus (YMV)',
    targetHi: 'पीला मोज़ेक वायरस व चारकोल रॉट प्रतिरोधी',
    descEn: 'Early harvest variety (88-92 days) with 21% high oil content.',
    descHi: 'कम दिन में पकने वाली, पीला मोज़ेक बीमारी मुक्त, बंपर फलियां।',
    price: 4400,
    unitEn: 'per 30kg Bag',
    unitHi: 'प्रति 30 किग्रा बैग',
    rating: 4.8,
    reviews: 138,
    badgeEn: 'Virus Free',
    badgeHi: 'वायरस रोधी',
    image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 's-med-1',
    category: 'medicines',
    cropType: 'soybean',
    nameEn: 'Thiamethoxam + Lambda Cyhalothrin (Alika)',
    nameHi: 'थियामेथॉक्सम + लैम्ब्डा साइहलोथ्रिन (अलिकार)',
    targetEn: 'Stem Fly, Girdle Beetle, Whitefly',
    targetHi: 'सोयाबीन तना मक्खी, गर्डल बीटल व रस चूसक',
    descEn: 'Dual action systemic contact insecticide for complete shoot health.',
    descHi: 'गर्डल बीटल और तना छेदक के लिए एक स्प्रे में दोहरा सुरक्षा कवच।',
    doseEn: '80ml per acre (20ml per 15L pump)',
    doseHi: '80 मिली प्रति एकड़ (20 मिली प्रति 15L पंप)',
    price: 790,
    unitEn: '200ml Bottle',
    unitHi: '200 मिली बॉटल',
    rating: 4.8,
    reviews: 245,
    badgeEn: 'Dual Defense',
    badgeHi: 'दोहरा असर',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
  },

  // 🌾 SUGARCANE
  {
    id: 'g-seed-1',
    category: 'seeds',
    cropType: 'sugarcane',
    nameEn: 'Co-0238 Tissue Culture Seedling Sets',
    nameHi: 'गन्ना बीज कलिका (Co-0238 टिश्यू कल्चर)',
    targetEn: 'Tolerant to Wilt & Smut',
    targetHi: 'विल्ट व कंडुआ सहनशील',
    descEn: 'High sugar recovery rate (12.5%) with prolific tillering capacity.',
    descHi: 'उच्च मिठास व वजन, अधिक कल्ले, चीनी मिलों की पसंदीदा वैरायटी।',
    price: 1800,
    unitEn: 'per 1000 Seed Sets',
    unitHi: 'प्रति 1000 कलिकाएं',
    rating: 4.9,
    reviews: 74,
    badgeEn: 'High Sugar',
    badgeHi: 'वजनदार गन्ना',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'g-med-1',
    category: 'medicines',
    cropType: 'sugarcane',
    nameEn: 'Carbendazim 50% WP (Bavistin)',
    nameHi: 'कार्बेंडाजिम 50% WP (बाविस्टिन)',
    targetEn: 'Red Rot & Seed Sett Rot (लाल सड़न)',
    targetHi: 'गन्ने का लाल सड़न (Red Rot) व बीज उपचार',
    descEn: 'Standard fungicide for sett dipping prior to trench sowing.',
    descHi: 'गन्ना बीज बुवाई से पहले उपचारित करने और लाल सड़न रोग रोकने हेतु।',
    doseEn: '2 grams per liter water for sett treatment',
    doseHi: '2 ग्राम प्रति लीटर पानी बीज डुबोने हेतु',
    price: 590,
    unitEn: '500g Pack',
    unitHi: '500 ग्राम पैक',
    rating: 4.8,
    reviews: 182,
    badgeEn: 'Sett Disinfectant',
    badgeHi: 'बीज शोधक',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=600&auto=format&fit=crop&q=80'
  }
];

export default function Marketplace() {
  const [lang, setLang] = useState('hi'); // 'en' | 'hi'
  const [activeTab, setActiveTab] = useState('medicines'); // 'medicines' | 'seeds'
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cart & Checkout States
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: localStorage.getItem('farmerName') || '',
    phone: '',
    address: '',
    pincode: '',
    paymentMethod: 'online'
  });

  const cropCategories = [
    { id: 'all', en: 'All Crops', hi: 'सभी फसलें' },
    { id: 'wheat', en: 'Wheat', hi: 'गेहूं' },
    { id: 'paddy', en: 'Paddy / Rice', hi: 'धान' },
    { id: 'chickpea', en: 'Chickpea', hi: 'चना' },
    { id: 'maize', en: 'Maize', hi: 'मक्का' },
    { id: 'soybean', en: 'Soybean', hi: 'सोयाबीन' },
    { id: 'sugarcane', en: 'Sugarcane', hi: 'गन्ना' },
  ];

  // Filter Products
  const filteredProducts = marketplaceProducts.filter(item => {
    const matchTab = item.category === activeTab;
    const matchCrop = selectedCrop === 'all' || item.cropType === selectedCrop;
    const q = searchTerm.toLowerCase();
    const matchSearch = 
      item.nameEn.toLowerCase().includes(q) ||
      item.nameHi.includes(q) ||
      item.targetEn.toLowerCase().includes(q) ||
      item.targetHi.includes(q);

    return matchTab && matchCrop && matchSearch;
  });

  // Cart Handlers
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const next = item.qty + delta;
        return next > 0 ? { ...item, qty: next } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // Firestore Sync
  const saveOrderToDatabase = async (paymentRefId = 'COD_OR_LOCAL') => {
    try {
      setIsSubmitting(true);
      const payload = {
        customerName: formData.name,
        contactPhone: formData.phone,
        deliveryAddress: formData.address,
        pincode: formData.pincode,
        paymentType: formData.paymentMethod,
        paymentStatus: formData.paymentMethod === 'online' ? 'PAID' : 'PENDING_DELIVERY',
        transactionRef: paymentRefId,
        totalPayable: totalAmount,
        currency: 'INR',
        orderDate: serverTimestamp(),
        orderStatus: 'Confirmed',
        items: cart.map(item => ({
          productId: item.id,
          name: lang === 'hi' ? item.nameHi : item.nameEn,
          crop: item.cropType,
          category: item.category,
          unitPrice: item.price,
          qty: item.qty,
          subtotal: item.price * item.qty
        }))
      };






      await triggerNotification(
  "Agri Order Placed",
  `Order total ₹${totalAmount.toLocaleString('en-IN')} confirmed.`,
  "order",
  "/marketplace"
);

      const docRef = await addDoc(collection(db, 'orders'), payload);
      setPlacedOrderId(docRef.id);
      setOrderPlaced(true);
      setCart([]);
    } catch (err) {
      console.error(err);
      alert(lang === 'hi' ? 'ऑर्डर सेव करने में त्रुटि हुई।' : 'Error recording order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment Execution
  const handlePaymentExecution = () => {
    if (!window.Razorpay) {
      alert(lang === 'hi' ? 'पेमेंट गेटवे लोड नहीं हो सका।' : 'Payment gateway unavailable.');
      return;
    }

    const options = {
      key: "rzp_test_YOUR_KEY_HERE",
      amount: totalAmount * 100,
      currency: "INR",
      name: "AgriScan Marketplace",
      description: lang === 'hi' ? "बीज व कृषि दवाई भुगतान" : "Seeds & Agricultural Chemical Procurement",
      handler: function (response) {
        saveOrderToDatabase(response.razorpay_payment_id || 'ONLINE_TXN');
      },
      prefill: {
        name: formData.name,
        contact: formData.phone,
      },
      theme: { color: "#064e3b" }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => {
      alert(lang === 'hi' ? 'भुगतान असफल रहा।' : 'Payment failed.');
    });
    rzp.open();
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      alert(lang === 'hi' ? 'कृपया सभी जानकारी भरें।' : 'Please fill all details.');
      return;
    }

    if (formData.paymentMethod === 'online') {
      handlePaymentExecution();
    } else {
      saveOrderToDatabase('COD_ORDER');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfdfd] text-slate-900 font-sans pb-28">
      
      {/* 🌟 TOP NAVIGATION & CONTROL BAR */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          
          {/* Title and Subtitle */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {lang === 'hi' ? 'किसान कृषि बाज़ार' : 'Farmer Agri Marketplace'}
              </h1>
              <span className="text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                {lang === 'hi' ? 'सत्यापित स्टॉक' : 'Verified Stock'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {lang === 'hi' 
                ? 'फसल-वार प्रमाणित बीज और वैज्ञानिक कृषि दवाइयां' 
                : 'Scientific disease treatments & certified high-yield crop seeds'}
            </p>
          </div>

          {/* Controls: Search, Language Switcher, Cart Trigger */}
          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={lang === 'hi' ? "फसल, रोग या दवा खोजें..." : "Search crop, disease or cure..."}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-800 focus:bg-white transition"
              />
            </div>

            {/* Language Switch Button */}
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-black transition active:scale-95"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-800" />
              <span>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="relative flex items-center gap-1.5 bg-slate-900 hover:bg-emerald-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs transition active:scale-95 shrink-0"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'कार्ट' : 'Cart'} ({cart.reduce((a, b) => a + b.qty, 0)})</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>
          </div>

        </div>

        {/* 🌟 LEVEL 1: TAB SELECTOR (MEDICINES VS SEEDS) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
            <button
              onClick={() => setActiveTab('medicines')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition border ${
                activeTab === 'medicines'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Pill className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang === 'hi' ? 'कृषि दवाइयां (Medicines)' : 'Crop Medicines & Cures'}</span>
            </button>

            <button
              onClick={() => setActiveTab('seeds')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition border ${
                activeTab === 'seeds'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'hi' ? 'प्रमाणित बीज (Seeds)' : 'Certified Crop Seeds'}</span>
            </button>
          </div>
        </div>

        {/* 🌟 LEVEL 2: CROP CATEGORIES SELECTOR */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 overflow-x-auto scrollbar-none flex gap-1.5">
          {cropCategories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCrop(c.id)}
              className={`px-3.5 py-1 rounded-xl text-xs font-bold shrink-0 transition border ${
                selectedCrop === c.id
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {lang === 'hi' ? c.hi : c.en}
            </button>
          ))}
        </div>
      </div>

      {/* 🌟 PRODUCT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo & Rating */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.nameEn}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                    {lang === 'hi' ? product.badgeHi : product.badgeEn}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{product.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({product.reviews})</span>
                  </span>
                </div>

                {/* Product Meta */}
                <div className="p-4.5 space-y-2">
                  <div className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    <Tag className="w-2.5 h-2.5" />
                    <span>{product.cropType}</span>
                  </div>

                  <h3 className="font-black text-sm text-slate-900 leading-snug">
                    {lang === 'hi' ? product.nameHi : product.nameEn}
                  </h3>

                  {/* Target Disease / Resistance Specification */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      {lang === 'hi' ? 'लक्षित रोग / प्रतिरोधी क्षमता:' : 'Target Disease / Trait:'}
                    </span>
                    <p className="font-bold text-slate-800 text-[11px]">
                      {lang === 'hi' ? product.targetHi : product.targetEn}
                    </p>
                  </div>

                  {/* Dose Info if Medicine */}
                  {product.doseEn && (
                    <p className="text-[10px] font-medium text-slate-500 bg-slate-50/50 p-1.5 rounded-lg border border-slate-100">
                      <strong>{lang === 'hi' ? 'खुराक: ' : 'Dosage: '}</strong>
                      {lang === 'hi' ? product.doseHi : product.doseEn}
                    </p>
                  )}

                  <p className="text-xs text-slate-500 leading-relaxed font-normal pt-1">
                    {lang === 'hi' ? product.descHi : product.descEn}
                  </p>

                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 font-bold block">
                      {lang === 'hi' ? product.unitHi : product.unitEn}
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="p-4.5 pt-0">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-slate-900 hover:bg-emerald-800 text-white py-2.5 rounded-xl text-xs font-black transition active:scale-95 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'कार्ट में जोड़ें' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          🛒 CHECKOUT & ORDER MODAL (ONLINE VIA UPI/CARD + COD)
      ========================================================================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250">
            
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-slate-900" />
                  <h2 className="text-sm font-black text-slate-900">
                    {lang === 'hi' ? 'ऑर्डर सारांश व डिलीवरी पता' : 'Order Summary & Shipping'}
                  </h2>
                </div>
                <button onClick={() => setIsCheckoutOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-800">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Success View */}
              {orderPlaced ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    {lang === 'hi' ? 'ऑर्डर सफलतापूर्वक दर्ज!' : 'Order Placed Successfully!'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    {lang === 'hi' 
                      ? 'आपका ऑर्डर डेटाबेस में दर्ज हो गया है। डिलीवरी 2-3 दिनों में पहुंचेगी।' 
                      : 'Your consignment is confirmed. Delivery scheduled within 2-3 days.'}
                  </p>
                  {placedOrderId && (
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-[11px] font-mono text-slate-600">
                      Order ID: #{placedOrderId}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setOrderPlaced(false);
                      setIsCheckoutOpen(false);
                    }}
                    className="mt-3 bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-black shadow-xs"
                  >
                    {lang === 'hi' ? 'शॉपिंग जारी रखें' : 'Continue Shopping'}
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-500">
                    {lang === 'hi' ? 'आपका कार्ट खाली है।' : 'Your cart is empty.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 my-3.5">
                  {/* Item Rows */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-2.5">
                          <img src={item.image} alt={item.nameEn} className="w-10 h-10 object-cover rounded-lg" />
                          <div>
                            <h4 className="text-xs font-black text-slate-900 truncate max-w-[130px]">
                              {lang === 'hi' ? item.nameHi : item.nameEn}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-500">₹{item.price} x {item.qty}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 rounded bg-white border border-slate-200">
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-black px-1">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 rounded bg-white border border-slate-200">
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                          <button onClick={() => removeFromCart(item.id)} className="p-1 text-rose-500 ml-0.5">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Form */}
                  <form id="orderForm" onSubmit={handleOrderSubmit} className="space-y-3 pt-3 border-t border-slate-100">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      {lang === 'hi' ? 'डिलीवरी संपर्क विवरण' : 'Shipping Information'}
                    </h4>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        {lang === 'hi' ? 'किसान का नाम' : 'Farmer Name'}
                      </label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 rounded-xl">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full py-2 bg-transparent text-xs font-semibold outline-none"
                          placeholder={lang === 'hi' ? 'नाम दर्ज करें' : 'Full Name'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        {lang === 'hi' ? 'मोबाइल नंबर (10 अंक)' : 'Contact Phone (10 Digits)'}
                      </label>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 rounded-xl">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                          className="w-full py-2 bg-transparent text-xs font-semibold outline-none"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        {lang === 'hi' ? 'गाँव / खेत का पूरा पता' : 'Village / Farm Address'}
                      </label>
                      <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
                        <textarea
                          rows={2}
                          required
                          value={formData.address}
                          onChange={e => setFormData({ ...formData, address: e.target.value })}
                          className="w-full bg-transparent text-xs font-semibold outline-none resize-none"
                          placeholder={lang === 'hi' ? 'ग्राम, तहसील, जिला' : 'Village, Tehsil, District'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">
                        {lang === 'hi' ? 'पिनकोड' : 'Postal Pincode'}
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={formData.pincode}
                        onChange={e => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                        className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                        placeholder="482001"
                      />
                    </div>

                    {/* Clean Payment Options (Without 3rd-Party Gateway Branding) */}
                    <div className="pt-2">
                      <label className="block text-[10px] font-bold text-slate-600 mb-1.5">
                        {lang === 'hi' ? 'भुगतान विधि चुनें' : 'Select Payment Option'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Online Option */}
                        <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-black cursor-pointer transition ${formData.paymentMethod === 'online' ? 'bg-emerald-50 border-emerald-800 text-emerald-950' : 'bg-slate-50 border-slate-200'}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={formData.paymentMethod === 'online'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'online' })}
                          />
                          <CreditCard className="w-3.5 h-3.5 text-emerald-800" />
                          <div>
                            <span className="block">{lang === 'hi' ? 'ऑनलाइन भुगतान' : 'Pay Online'}</span>
                            <span className="text-[8px] text-slate-400 font-normal block">UPI / NetBanking</span>
                          </div>
                        </label>

                        {/* Cash on Delivery Option */}
                        <label className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-black cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'bg-emerald-50 border-emerald-800 text-emerald-950' : 'bg-slate-50 border-slate-200'}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                          />
                          <Truck className="w-3.5 h-3.5 text-emerald-800" />
                          <div>
                            <span className="block">{lang === 'hi' ? 'कैश ऑन डिलीवरी' : 'Pay on Delivery'}</span>
                            <span className="text-[8px] text-slate-400 font-normal block">{lang === 'hi' ? 'नकद भुगतान' : 'Cash at doorstep'}</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Bottom Total & Submission */}
            {!orderPlaced && cart.length > 0 && (
              <div className="pt-3.5 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-sm font-black text-slate-900">
                  <span>{lang === 'hi' ? 'कुल राशि:' : 'Total Payable:'}</span>
                  <span className="text-xl font-black text-emerald-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="submit"
                  form="orderForm"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-black disabled:opacity-50 text-white py-3 rounded-xl text-xs font-black shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isSubmitting 
                      ? (lang === 'hi' ? 'ऑर्डर प्रोसेस हो रहा है...' : 'Recording Order...') 
                      : (lang === 'hi' ? 'ऑर्डर कन्फर्म करें' : 'Confirm Order')}
                  </span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}