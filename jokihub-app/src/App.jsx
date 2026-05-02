import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Check,
  Star,
  ShoppingCart,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  Send,
  AlertCircle,
  Loader2,
  Menu,
  X,
  Calculator,
  BookOpen,
  GraduationCap,
  Copy,
  FileText,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Zap,
} from "lucide-react";

/* ==========================================================================
   🛠️ UTILITIES, GSAP ENGINE & LOGIC DATA
   ========================================================================== */

const useGSAP = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.gsap && window.ScrollTrigger) {
      setIsLoaded(true);
      return;
    }

    const loadScript = (src) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
      });

    loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
    ).then(() => {
      loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js",
      ).then(() => {
        window.gsap.registerPlugin(window.ScrollTrigger);
        setIsLoaded(true);
      });
    });
  }, []);

  return isLoaded ? window.gsap : null;
};

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

const WA_NUMBER = "6285856618965";
const SERVICES = [
  {
    id: "sma",
    title: "Tugas SMA/SMK",
    icon: BookOpen,
    basePrice: 20000,
    color: "bg-[#FF90E8]",
  },
  {
    id: "skripsi",
    title: "Skripsi Bab 1-5",
    icon: GraduationCap,
    basePrice: 500000,
    color: "bg-[#A6FAFF]",
  },
  {
    id: "parafrase",
    title: "Parafrase/Turnitin",
    icon: Copy,
    basePrice: 8000,
    color: "bg-[#FFDF00]",
  },
  {
    id: "sitasi",
    title: "Sitasi & Daftar Pustaka",
    icon: FileText,
    basePrice: 10000,
    color: "bg-[#90EE90]",
  },
];

const MOCK_ORDERS = [
  {
    id: "ORD-001",
    client: "Budi Santoso",
    wa: "628123456789",
    service: "Skripsi Bab 1-5",
    amount: 1500000,
    status: "process",
    date: "2026-05-01",
  },
  {
    id: "ORD-002",
    client: "Siti Aminah",
    wa: "628987654321",
    service: "Parafrase",
    amount: 150000,
    status: "pending",
    date: "2026-05-02",
  },
];

const getOrders = () => {
  const saved = localStorage.getItem("jokihub_orders");
  return saved ? JSON.parse(saved) : MOCK_ORDERS;
};

const saveOrder = (order) => {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem("jokihub_orders", JSON.stringify(orders));
};

const updateOrderStatus = (id, status) => {
  const orders = getOrders();
  const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
  localStorage.setItem("jokihub_orders", JSON.stringify(updated));
  return updated;
};

// --- PENGATURAN GLOBAL ---
const getSettings = () => {
  const saved = localStorage.getItem("jokihub_settings");
  return saved
    ? JSON.parse(saved)
    : {
        waNumber: "6285856618965",
        acceptingOrders: true,
        paymentMethod: "whatsapp",
      }; // Default ke WA jika Pakkasir sedang down
};

const saveSettings = (newSettings) => {
  localStorage.setItem("jokihub_settings", JSON.stringify(newSettings));
};

/* ==========================================================================
   ✨ CRAZY UI EXPERIENCES (Cursor, Background, Bootloader)
   ========================================================================== */

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (!window.gsap || window.innerWidth < 768) return;

    const xTo = window.gsap.quickTo(cursorRef.current, "x", {
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
    });
    const yTo = window.gsap.quickTo(cursorRef.current, "y", {
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
    });
    const xDotTo = window.gsap.quickTo(dotRef.current, "x", {
      duration: 0.1,
      ease: "power3",
    });
    const yDotTo = window.gsap.quickTo(dotRef.current, "y", {
      duration: 0.1,
      ease: "power3",
    });

    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xDotTo(e.clientX);
      yDotTo(e.clientY);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="hidden md:block fixed top-0 left-0 w-8 h-8 border-2 border-black rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      <div
        ref={dotRef}
        className="hidden md:block fixed top-0 left-0 w-2 h-2 bg-[#FFDF00] rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
    </>
  );
};

const AnimatedBackground = () => {
  const gsap = useGSAP();
  const shape1Ref = useRef(null);
  const shape2Ref = useRef(null);

  useEffect(() => {
    if (!gsap || !window.ScrollTrigger) return;

    gsap.to(shape1Ref.current, {
      yPercent: 100,
      rotation: 90,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    gsap.to(shape2Ref.current, {
      yPercent: -100,
      xPercent: -50,
      rotation: -45,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom top",
        scrub: 2,
      },
    });
  }, [gsap]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#f4f4f0]">
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: "radial-gradient(black 2px, transparent 2px)",
          backgroundSize: "30px 30px",
          animation: "panGrid 20s linear infinite",
        }}
      />
      <div
        ref={shape1Ref}
        className="absolute top-20 right-10 text-[10rem] font-black text-[#A6FAFF] opacity-30 select-none leading-none"
      >
        *
      </div>
      <div
        ref={shape2Ref}
        className="absolute bottom-[-10%] left-[10%] w-64 h-64 border-[20px] border-[#FF90E8] opacity-20 rounded-full"
      />
      <style>{`
        @keyframes panGrid { 0% { background-position: 0 0; } 100% { background-position: -30px 30px; } }
      `}</style>
    </div>
  );
};

const BootSequence = ({ onComplete }) => {
  const [text, setText] = useState("INITIALIZING...");

  useEffect(() => {
    const sequences = [
      "LOADING GSAP MODULES",
      "BYPASSING TURNITIN",
      "COMPILING THESIS",
      "SYSTEM READY_",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setText(sequences[i]);
      i++;
      if (i >= sequences.length) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-black text-[#FFDF00] flex flex-col items-center justify-center font-mono animate-[slideUp_0.8s_ease-in-out_2s_forwards] px-4 text-center">
      <div className="text-3xl md:text-5xl font-black mb-6 animate-pulse">
        JOKIHUB.EXE
      </div>
      <div className="text-base md:text-xl">{text}</div>
      <div className="w-full max-w-xs md:w-48 h-3 border-2 border-[#FFDF00] mt-6 p-1">
        <div className="h-full bg-[#FFDF00] animate-[fillBar_1.8s_ease-out_forwards]" />
      </div>
      <style>{`
        @keyframes slideUp { to { transform: translateY(-100%); display: none; } }
        @keyframes fillBar { 0% { width: 0%; } 50% { width: 40%; } 80% { width: 90%; } 100% { width: 100%; } }
      `}</style>
    </div>
  );
};

/* ==========================================================================
   🎨 ADVANCED NEOBRUTALISM COMPONENTS
   ========================================================================== */

const NeoCard = ({ children, className = "", color = "bg-white", onClick }) => {
  const cardRef = useRef(null);
  const gsap = useGSAP();

  const handleMouseMove = (e) => {
    if (!cardRef.current || !gsap || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;

    gsap.to(cardRef.current, {
      rotationY: xPct * 10,
      rotationX: -yPct * 10,
      transformPerspective: 1000,
      ease: "power2.out",
      duration: 0.4,
      boxShadow: `${-xPct * 10 + 4}px ${yPct * 10 + 4}px 0px 0px rgba(0,0,0,1)`,
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !gsap) return;
    gsap.to(cardRef.current, {
      rotationY: 0,
      rotationX: 0,
      boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
      ease: "elastic.out(1, 0.3)",
      duration: 1,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`
        border-2 md:border-4 border-black ${color} p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
        transition-colors duration-200
        ${onClick ? "cursor-pointer" : ""} ${className}
      `}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </div>
  );
};

const NeoButton = ({
  children,
  onClick,
  className = "",
  color = "bg-[#FFDF00]",
  icon: Icon,
  disabled = false,
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`
      group relative inline-flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-3 
      text-sm md:text-base font-black uppercase tracking-wider text-black overflow-hidden
      border-2 md:border-4 border-black ${color} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
      transition-all duration-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
      hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
  >
    <span className="absolute inset-0 bg-[#A6FAFF] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0" />
    <span className="absolute inset-0 bg-[#FF90E8] translate-y-full group-hover:-translate-y-full transition-transform duration-500 ease-in-out delay-75 z-0" />

    <span className="relative z-10 flex items-center gap-2">
      {children}
      {Icon && (
        <Icon className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 group-hover:rotate-12 group-hover:text-[#FFDF00]" />
      )}
    </span>
  </button>
);

const NeoInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  options = [],
  className = "",
}) => (
  <div className={`flex flex-col gap-1 md:gap-2 ${className} group`}>
    {label && (
      <label className="font-black uppercase text-xs md:text-sm tracking-wider transition-colors group-focus-within:text-[#3b82f6]">
        {label}
      </label>
    )}
    {type === "select" ? (
      <select
        value={value}
        onChange={onChange}
        className="w-full border-2 md:border-4 border-black bg-white p-2 md:p-3 text-sm md:text-base font-bold focus:outline-none focus:bg-[#A6FAFF] focus:-translate-y-1 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-2 md:border-4 border-black bg-white p-2 md:p-3 text-sm md:text-base font-bold focus:outline-none focus:bg-[#A6FAFF] focus:-translate-y-1 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[80px] md:min-h-[100px] resize-none"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-2 md:border-4 border-black bg-white p-2 md:p-3 text-sm md:text-base font-bold focus:outline-none focus:bg-[#A6FAFF] focus:-translate-y-1 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      />
    )}
  </div>
);

const NeoBadge = ({ children, color = "bg-[#FF90E8]", className = "" }) => (
  <span
    className={`px-2 py-1 md:px-3 md:py-1 text-[10px] md:text-xs font-black uppercase border-2 border-black ${color} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-default ${className}`}
  >
    {children}
  </span>
);

/* ==========================================================================
   ✨ GSAP ANIMATED COMPONENTS
   ========================================================================== */

const SplitTextReveal = ({ text, className = "", triggerRef }) => {
  const containerRef = useRef(null);
  const gsap = useGSAP();

  useEffect(() => {
    if (!gsap || !containerRef.current || !window.ScrollTrigger) return;
    const chars = containerRef.current.querySelectorAll(".char");

    gsap.fromTo(
      chars,
      { y: 50, opacity: 0, rotate: 15, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        rotate: 0,
        scale: 1,
        stagger: 0.03,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: triggerRef ? triggerRef.current : containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }, [gsap, text, triggerRef]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden flex flex-wrap ${className}`}
    >
      {text.split(" ").map((word, i) => (
        <div key={i} className="inline-flex mr-[0.25em] overflow-hidden p-1">
          {word.split("").map((char, j) => (
            <span key={j} className="char inline-block">
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

const ScrollStagger = ({ children, className = "" }) => {
  const containerRef = useRef();
  const gsap = useGSAP();

  useEffect(() => {
    if (!gsap || !window.ScrollTrigger) return;
    const elements = containerRef.current.children;
    gsap.fromTo(
      elements,
      { y: 50, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.2)",
        scrollTrigger: { trigger: containerRef.current, start: "top 85%" },
      },
    );
  }, [gsap]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

const Marquee = ({ text }) => (
  <div className="w-full overflow-hidden border-y-2 md:border-y-4 border-black bg-[#FFDF00] py-2 md:py-3 flex items-center relative z-10 shadow-[0_4px_0_0_rgba(0,0,0,1)] md:shadow-[0_6px_0_0_rgba(0,0,0,1)]">
    <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="mx-4 md:mx-6 text-sm md:text-lg font-black uppercase tracking-widest flex items-center gap-4 hover:text-white transition-colors duration-300"
        >
          {text}{" "}
          <Zap className="w-4 h-4 md:w-6 md:h-6 fill-black hover:fill-white transition-colors" />
        </span>
      ))}
    </div>
    <style>{`
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    `}</style>
  </div>
);

// Toast System
const ToastContext = React.createContext();
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };
  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
            pointer-events-auto flex items-center gap-3 p-3 md:p-4 border-2 md:border-4 border-black 
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-[slideInToast_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]
            ${t.type === "success" ? "bg-[#90EE90]" : "bg-[#FF90E8]"}
            hover:scale-105 transition-transform max-w-xs md:max-w-sm
          `}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
            )}
            <span className="font-black text-xs md:text-sm">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-auto bg-white border-2 border-black p-0.5 hover:bg-black hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideInToast { 
          from { transform: translateX(120%) rotate(5deg); opacity: 0; } 
          to { transform: translateX(0) rotate(0); opacity: 1; } 
        }
      `}</style>
    </ToastContext.Provider>
  );
};
const useToast = () => React.useContext(ToastContext);

/* ==========================================================================
   📱 CLIENT VIEWS & ORDER CALCULATOR
   ========================================================================== */

const OrderCalculator = () => {
  const [service, setService] = useState("sma");
  const [pages, setPages] = useState(1);
  const [urgency, setUrgency] = useState("santai");
  const [notes, setNotes] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientWa, setClientWa] = useState("");
  const [currentPlagiasi, setCurrentPlagiasi] = useState("");
  const [targetPlagiasi, setTargetPlagiasi] = useState("");
  const toast = useToast();
  const calcRef = useRef(null);
  const settings = getSettings(); // <-- Ambil pengaturan real-time

  const calculatePrice = () => {
    const base = SERVICES.find((s) => s.id === service)?.basePrice || 0;
    let total = base;

    if (service === "sitasi") total = base * pages;
    if (service === "skripsi") total = base * (pages / 5);
    if (service === "parafrase") {
      const diff = Math.max(
        0,
        (Number(currentPlagiasi) || 0) - (Number(targetPlagiasi) || 0),
      );
      total = diff * 8000;
    }

    const urgencyMultiplier = { santai: 1, normal: 1.5, ngebut: 2 };
    return total * urgencyMultiplier[urgency];
  };

  const handleOrder = () => {
    if (!settings.acceptingOrders)
      return toast(
        "Mohon maaf, JokiHub sedang tutup sementara/penuh!",
        "error",
      );
    if (!service) return toast("Pilih layanan terlebih dahulu!", "error");
    if (!clientName || !clientWa)
      return toast("Nama dan No. WhatsApp wajib diisi!", "error");
    if (
      service === "parafrase" &&
      (Number(currentPlagiasi) <= Number(targetPlagiasi) ||
        currentPlagiasi === "" ||
        targetPlagiasi === "")
    ) {
      return toast(
        "Persentase plagiasi awal harus lebih besar dari target!",
        "error",
      );
    }

    const price = calculatePrice();
    const baseServiceName = SERVICES.find((s) => s.id === service)?.title;
    const serviceDetail =
      service === "parafrase"
        ? ` (${currentPlagiasi}% ke ${targetPlagiasi}%)`
        : service === "skripsi"
          ? ` (${pages} Bab)`
          : service === "sitasi"
            ? ` (${pages} Hal)`
            : "";
    const finalServiceName = baseServiceName + serviceDetail;

    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);

    const newOrder = {
      id: orderId,
      client: clientName,
      wa: clientWa.replace(/[^0-9]/g, ""),
      service: finalServiceName,
      amount: price,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      notes: notes,
    };
    saveOrder(newOrder);

    toast(`Pesanan Dibuat! ID: ${orderId}`, "success");

    // PERBAIKAN DI SINI:
    // 1. Pastikan nomor WA admin bersih dari karakter non-angka
    const cleanWaNumber = (settings.waNumber || WA_NUMBER).replace(/[^0-9]/g, "");
    
    // 2. Susun pesan dengan template literal yang bersih
    const text = `Halo Admin JokiHub! 👋\n\nSaya ingin memesan layanan:\n*ID Pesanan:* ${orderId}\n*Layanan:* ${finalServiceName}\n*Nama:* ${clientName}\n*Urgensi:* ${urgency.toUpperCase()}\n*Total Tagihan:* ${formatRupiah(price)}\n\n*Catatan:*\n${notes || "-"}\n\nMohon instruksi pembayarannya. Terima kasih!`;
    
    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodedText}`;

    // 3. Eksekusi pengalihan (PENTING UNTUK MOBILE)
    // Gunakan durasi sedikit lebih cepat agar tidak dianggap 'pop-up' oleh browser
    setTimeout(() => {
      if (settings.paymentMethod === "pakkasir") {
        const slug = "joki-tugas";
        const apiKey = "CfgUuwb3visuOFeLtWOYGFfgJX2BcDJb";
        const pakkasirUrl = `https://pakkasir.com/pay/${slug}?apikey=${apiKey}&amount=${price}&order_id=${orderId}&customer_wa=${newOrder.wa}`;
        window.location.href = pakkasirUrl; // Pakai location.href lebih aman di HP
      } else {
        // Redirect langsung ke WhatsApp
        // Deteksi jika mobile, gunakan window.location.href, jika desktop boleh window.open
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
          window.location.href = waUrl;
        } else {
          window.open(waUrl, "_blank");
        }
      }

      // Reset form
      setClientName("");
      setClientWa("");
      setNotes("");
    }, 800); // Dipersingkat dari 1500ms ke 800ms
  };

  return (
    <section
      id="kalkulator"
      className="py-16 md:py-24 px-4 md:px-8 bg-[#3b82f6] text-white border-y-4 md:border-y-8 border-black relative overflow-hidden"
      ref={calcRef}
    >
      <div className="absolute top-[-20px] right-[-20px] w-48 h-48 border-[20px] border-[#A6FAFF] rounded-full opacity-20 pointer-events-none animate-spin-slow"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-start relative z-10">
        <div className="space-y-6 md:space-y-8">
          <SplitTextReveal
            text="KALKULATOR SAKTI"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FFDF00] drop-shadow-[4px_4px_0_rgba(0,0,0,1)]"
            triggerRef={calcRef}
          />
          <p className="text-base md:text-lg font-bold border-l-4 md:border-l-8 border-black pl-4 md:pl-5 bg-black/20 p-4 md:p-5 backdrop-blur-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            Hitung biaya secara instan. Tanpa drama, tanpa biaya tersembunyi.
          </p>
          <div className="hidden lg:block relative mt-8 group cursor-default max-w-sm">
            <div className="absolute inset-0 bg-[#FF90E8] border-4 border-black translate-x-3 translate-y-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></div>
            <div className="relative z-10 border-4 border-black bg-white text-black p-6 transform transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1">
              <h3 className="font-black text-xl uppercase mb-4 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#3b82f6]" /> Jaminan Mutu
              </h3>
              <ul className="space-y-3 font-bold text-sm">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />{" "}
                  Bebas Plagiasi & Lolos Turnitin
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />{" "}
                  Garansi Revisi Sampai ACC
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />{" "}
                  Privasi Data Klien 100% Aman
                </li>
              </ul>
            </div>
          </div>
        </div>

        <NeoCard color="bg-[#f4f4f0]" className="text-black">
          <div className="space-y-4 md:space-y-5">
            <div className="bg-black text-white p-3 border-2 md:border-4 border-black font-black uppercase text-center text-sm md:text-base shadow-[3px_3px_0px_0px_#FFDF00]">
              Form Pemesanan
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <NeoInput
                label="Nama Lengkap"
                type="text"
                placeholder="Budi Santoso"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <NeoInput
                label="No WhatsApp"
                type="text"
                placeholder="0812345..."
                value={clientWa}
                onChange={(e) => setClientWa(e.target.value)}
              />
            </div>

            <NeoInput
              label="Pilih Layanan"
              type="select"
              value={service}
              onChange={(e) => setService(e.target.value)}
              options={SERVICES.map((s) => ({ value: s.id, label: s.title }))}
            />

            {service === "sitasi" && (
              <NeoInput
                label="Jumlah Halaman"
                type="number"
                value={pages}
                onChange={(e) => setPages(Math.max(1, e.target.value))}
              />
            )}

            {service === "parafrase" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 bg-[#FFDF00] p-3 md:p-4 border-2 md:border-4 border-black">
                <NeoInput
                  label="Plagiasi Awal (%)"
                  type="number"
                  placeholder="45"
                  value={currentPlagiasi}
                  onChange={(e) =>
                    setCurrentPlagiasi(
                      Math.max(0, Math.min(100, e.target.value)),
                    )
                  }
                />
                <NeoInput
                  label="Target Plagiasi (%)"
                  type="number"
                  placeholder="25"
                  value={targetPlagiasi}
                  onChange={(e) =>
                    setTargetPlagiasi(
                      Math.max(0, Math.min(100, e.target.value)),
                    )
                  }
                />
              </div>
            )}

            {service === "skripsi" && (
              <NeoInput
                label="Berapa Bab?"
                type="select"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                options={[
                  { value: 1, label: "1 Bab (Proposal)" },
                  { value: 3, label: "Bab 1-3" },
                  { value: 5, label: "Full Bab 1-5" },
                ]}
              />
            )}

            <div className="space-y-2">
              <label className="font-black uppercase text-xs md:text-sm tracking-wider">
                Tingkat Urgensi
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                {["santai", "normal", "ngebut"].map((u) => (
                  <div
                    key={u}
                    onClick={() => setUrgency(u)}
                    className={`
                      border-2 md:border-4 border-black py-2 text-center font-black text-xs md:text-sm uppercase cursor-pointer transition-all duration-300
                      ${urgency === u ? "bg-[#FF90E8] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-y-0 scale-100" : "bg-white hover:bg-gray-200 shadow-none sm:translate-y-0.5"}
                    `}
                  >
                    {u}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black text-white p-5 border-2 md:border-4 border-black -mx-4 -mb-4 md:-mx-6 md:-mb-6 mt-6 md:mt-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFDF00] rounded-full blur-2xl opacity-20"></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
                <div className="w-full md:w-auto">
                  <span className="font-bold uppercase tracking-wider text-[#A6FAFF] block mb-1 text-xs md:text-sm">
                    Total Estimasi:
                  </span>
                  <span className="text-2xl md:text-3xl font-black text-white drop-shadow-[2px_2px_0_#3b82f6] break-words">
                    {formatRupiah(calculatePrice())}
                  </span>
                </div>
                {settings.acceptingOrders ? (
                  <NeoButton
                    onClick={handleOrder}
                    icon={ShoppingCart}
                    color="bg-[#FF90E8]"
                    className="w-full md:w-auto text-sm md:text-base !px-5 !py-3 hover:rotate-2"
                  >
                    CHECKOUT
                  </NeoButton>
                ) : (
                  <div className="bg-red-500 text-white font-black px-5 py-3 border-2 md:border-4 border-black rotate-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center text-sm md:text-base w-full md:w-auto cursor-not-allowed">
                    TUTUP SEMENTARA
                  </div>
                )}
              </div>
            </div>
          </div>
        </NeoCard>
      </div>
    </section>
  );
};

const OrderTracker = () => {
  const [trackId, setTrackId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const trackRef = useRef();

  const handleTrack = () => {
    if (!trackId) return;
    setHasSearched(true);
    const orders = getOrders();
    const order = orders.find((o) => o.id === trackId.trim().toUpperCase());
    setTrackedOrder(order || null);
  };

  const getStatusInfo = (status) => {
    const map = {
      pending: {
        text: "MENUNGGU PEMBAYARAN",
        color: "bg-[#FFDF00]",
        icon: Clock,
      },
      process: {
        text: "SEDANG DIKERJAKAN",
        color: "bg-[#A6FAFF]",
        icon: Settings,
      },
      done: { text: "SELESAI!", color: "bg-[#90EE90]", icon: CheckCircle2 },
    };
    return (
      map[status] || {
        text: "TIDAK DIKETAHUI",
        color: "bg-gray-200",
        icon: AlertCircle,
      }
    );
  };

  return (
    <section
      id="lacak"
      className="py-16 md:py-24 px-4 md:px-8 max-w-4xl mx-auto relative"
      ref={trackRef}
    >
      <div className="text-center mb-10 md:mb-12">
        <SplitTextReveal
          text="LACAK PESANAN"
          className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase mb-4 justify-center"
          triggerRef={trackRef}
        />
        <p className="text-sm md:text-lg font-bold bg-[#FFDF00] border-2 md:border-4 border-black inline-block px-4 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          Pantau tugasmu secara Real-Time.
        </p>
      </div>

      <NeoCard
        color="bg-white"
        className="flex flex-col sm:flex-row gap-3 md:gap-4 items-end mb-8 transform -rotate-1 hover:rotate-0 transition-transform"
      >
        <div className="flex-1 w-full">
          <NeoInput
            label="ID Pesanan (Contoh: ORD-1234)"
            type="text"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            placeholder="Ketik ID Pesanan di sini..."
            className="text-base"
          />
        </div>
        <NeoButton
          onClick={handleTrack}
          color="bg-[#FF90E8]"
          className="w-full sm:w-auto !py-2.5 md:!py-3 text-sm md:text-base"
          icon={Activity}
        >
          CARI
        </NeoButton>
      </NeoCard>

      {hasSearched && (
        <div className="animate-[slideIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]">
          {trackedOrder ? (
            <NeoCard
              color="bg-black"
              className="text-white transform rotate-1 hover:rotate-0 p-5 md:p-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-gray-700 pb-5 mb-5 gap-4">
                <div>
                  <p className="font-bold uppercase text-[#FF90E8] mb-1 text-xs tracking-widest">
                    Detail Pesanan Ditemukan
                  </p>
                  <h3 className="text-2xl md:text-3xl font-black text-[#A6FAFF]">
                    {trackedOrder.id}
                  </h3>
                </div>
                {(() => {
                  const Info = getStatusInfo(trackedOrder.status);
                  return (
                    <div
                      className={`flex items-center gap-2 border-2 md:border-4 border-black ${Info.color} text-black p-2 md:p-3 shadow-[3px_3px_0px_0px_#FFDF00]`}
                    >
                      <Info.icon className="w-5 h-5 md:w-6 md:h-6" />
                      <span className="font-black text-sm md:text-base uppercase">
                        {Info.text}
                      </span>
                    </div>
                  );
                })()}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 font-bold text-sm md:text-base">
                <div className="bg-gray-900 p-4 border-l-4 border-[#FFDF00]">
                  <p className="text-gray-400 uppercase text-xs mb-1">
                    Layanan
                  </p>
                  <p>{trackedOrder.service}</p>
                </div>
                <div className="bg-gray-900 p-4 border-l-4 border-[#A6FAFF]">
                  <p className="text-gray-400 uppercase text-xs mb-1">
                    Pemesan
                  </p>
                  <p>{trackedOrder.client}</p>
                </div>
                <div className="bg-gray-900 p-4 border-l-4 border-[#FF90E8]">
                  <p className="text-gray-400 uppercase text-xs mb-1">
                    Tanggal Order
                  </p>
                  <p>{trackedOrder.date}</p>
                </div>
                <div className="bg-gray-900 p-4 border-l-4 border-[#90EE90]">
                  <p className="text-gray-400 uppercase text-xs mb-1">
                    Total Pembayaran
                  </p>
                  <p className="text-xl md:text-2xl font-black">
                    {formatRupiah(trackedOrder.amount)}
                  </p>
                </div>
              </div>
            </NeoCard>
          ) : (
            <NeoCard
              color="bg-[#FFDF00]"
              className="text-center py-10 animate-bounce"
            >
              <AlertCircle className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-black uppercase mb-2">
                WADUH, TIDAK KETEMU!
              </h3>
              <p className="font-bold text-sm md:text-base">
                Pastikan ID Pesanan diketik dengan benar (Contoh: ORD-1234).
              </p>
            </NeoCard>
          )}
        </div>
      )}
    </section>
  );
};

const ClientLanding = ({ navigate }) => {
  const heroRef = useRef();
  const [clickCount, setClickCount] = useState(0);
  const clickTimeout = useRef(null);

  const handleLogoClick = () => {
    window.scrollTo(0, 0);
    setClickCount((prev) => prev + 1);

    // Reset klik jika terlalu lama (1 detik)
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => setClickCount(0), 1000);
  };

  useEffect(() => {
    // EASTER EGG TRIGGER: 5x Klik Cepat
    if (clickCount >= 5) {
      setClickCount(0);
      navigate("login");
    }
  }, [clickCount, navigate]);

  return (
    <div className="min-h-screen text-black font-sans selection:bg-[#FFDF00] selection:text-black overflow-x-hidden relative">
      <CustomCursor />
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer group select-none"
            onClick={handleLogoClick}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#FFDF00] border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center group-hover:-translate-y-1 transition-transform">
              <span className="font-black text-lg md:text-xl">J</span>
            </div>
            <span className="font-black text-lg md:text-2xl tracking-tighter">
              JOKIHUB.
            </span>
          </div>
          <div className="hidden md:flex gap-6 font-black uppercase text-xs md:text-sm tracking-widest">
            <a
              href="#layanan"
              className="hover:text-[#FF90E8] hover:-translate-y-0.5 transition-all"
            >
              Layanan
            </a>
            <a
              href="#kalkulator"
              className="hover:text-[#3b82f6] hover:-translate-y-0.5 transition-all"
            >
              Order
            </a>
            <a
              href="#lacak"
              className="hover:text-[#90EE90] hover:-translate-y-0.5 transition-all"
            >
              Lacak
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-8 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 md:gap-12 relative"
      >
        <div className="flex-1 space-y-5 md:space-y-6 z-10 mt-8 md:mt-0">
          <NeoBadge
            color="bg-[#A6FAFF]"
            className="text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rotate-2 inline-block"
          >
            🚀 SERVER ONLINE: SIAP KERJA
          </NeoBadge>
          <SplitTextReveal
            text="TUGAS KELAR, HATI AMBYAR (EH, TENANG!)."
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] uppercase"
          />
          <p className="text-base md:text-lg lg:text-xl font-bold border-l-4 md:border-l-8 border-black pl-3 md:pl-5 py-2 bg-white/80 md:bg-white/50 backdrop-blur-sm max-w-xl">
            Solusi brutal untuk tugas akhirmu. Skripsi, parafrase, tugas harian.
            Serahkan ke ahlinya, kamu tinggal tidur.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
            <NeoButton
              onClick={() =>
                document
                  .getElementById("kalkulator")
                  .scrollIntoView({ behavior: "smooth" })
              }
              icon={ArrowRight}
              color="bg-[#FF90E8]"
              className="text-sm md:text-base w-full sm:w-auto"
            >
              HAJAR TUGAS SEKARANG
            </NeoButton>
          </div>
        </div>

        <div className="flex-1 relative w-full aspect-square max-w-sm lg:max-w-md group">
          <div className="absolute inset-0 bg-[#FFDF00] border-4 md:border-8 border-black translate-x-4 translate-y-4 md:translate-x-6 md:translate-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:translate-x-8 group-hover:translate-y-8 duration-500"></div>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Students"
            className="relative z-10 border-4 md:border-8 border-black w-full h-full object-cover grayscale contrast-150 transform transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2 duration-500"
          />
          <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 z-20 animate-spin-slow">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#A6FAFF] border-4 md:border-8 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-black text-center text-sm md:text-base leading-tight">
                100%
                <br />
                PRO
              </span>
            </div>
          </div>
        </div>
      </section>

      <Marquee text="KERAHASIAAN TERJAMIN • REVISI SEPUASNYA • HARGA MAHASISWA • ANTI PLAGIASI • PENGERJAAN CEPAT" />

      {/* Services Section */}
      <section
        id="layanan"
        className="py-16 md:py-24 px-4 md:px-8 max-w-6xl mx-auto relative z-10"
      >
        <div className="text-center mb-12 md:mb-16">
          <SplitTextReveal
            text="LAYANAN BRUTAL KAMI"
            className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase justify-center"
          />
          <div className="w-20 md:w-24 h-4 md:h-6 bg-[#FF90E8] border-2 md:border-4 border-black mx-auto mt-4 shadow-[3px_3px_0_0_rgba(0,0,0,1)] -rotate-3"></div>
        </div>

        <ScrollStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {SERVICES.map((service, index) => (
            <NeoCard
              key={index}
              color={service.color}
              className="flex flex-col h-full !p-5 md:!p-6"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white border-2 md:border-4 border-black flex items-center justify-center mb-5 md:mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-3 hover:rotate-3 transition-transform">
                <service.icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg md:text-xl font-black uppercase mb-3 leading-tight">
                {service.title}
              </h3>
              <p className="font-bold text-sm md:text-base mb-5 md:mb-6 flex-grow">
                Mulai <br />
                <span className="text-lg md:text-xl font-black bg-white px-2 mt-1 inline-block border-2 border-black">
                  {formatRupiah(service.basePrice)}
                </span>
              </p>
              <NeoButton
                color="bg-white"
                className="w-full !py-2 md:!py-2.5 text-sm md:text-base group-hover:bg-black group-hover:text-white"
                onClick={() =>
                  document
                    .getElementById("kalkulator")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                GAS PILIH
              </NeoButton>
            </NeoCard>
          ))}
        </ScrollStagger>
      </section>

      <OrderCalculator />
      <OrderTracker />

      {/* Footer */}
      <footer className="bg-black text-white py-10 md:py-12 border-t-[8px] md:border-t-[12px] border-[#FFDF00] relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
              JOKIHUB.
            </h2>
            <p className="font-bold text-sm md:text-base text-gray-400 max-w-sm mb-3">
              Menyelesaikan masalah akademis Anda dengan gaya sejak 2026.
            </p>
            {/* Link Admin Dihapus, diganti dengan easter egg klik logo J 5x */}
          </div>
          <div className="flex gap-4">
            <div className="bg-white text-black font-black uppercase text-xs md:text-sm tracking-widest border-2 md:border-4 border-black p-2 md:p-3 rotate-3 hover:-rotate-3 transition-transform cursor-default">
              Made in 🇮🇩
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ==========================================================================
   ⚙️ ADMIN PANEL VIEWS
   ========================================================================== */

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminSettings, setAdminSettings] = useState({
    waNumber: "",
    acceptingOrders: true,
    paymentMethod: "whatsapp",
  });
  const toast = useToast();

  useEffect(() => {
    setOrders(getOrders());
    setAdminSettings(getSettings());
  }, []);

  const handleStatusChange = (id, newStatus) => {
    const updated = updateOrderStatus(id, newStatus);
    setOrders(updated);
    toast(`Status ${id} diperbarui menjadi ${newStatus}`);
  };

  const handleDeleteOrder = (id) => {
    const updated = orders.filter((o) => o.id !== id);
    setOrders(updated);
    localStorage.setItem("jokihub_orders", JSON.stringify(updated));
    toast(`Pesanan ${id} berhasil dimusnahkan.`, "success");
  };

  const handleContactCustomer = (order) => {
    let text = `Halo Kak ${order.client}! 👋\n\nTerkait pesanan JokiHub Anda:\nID: *${order.id}*\nLayanan: *${order.service}*\nStatus: *${order.status === "done" ? "SUDAH SELESAI 🎉" : "Sedang Diproses ⏳"}*\n\n`;
    if (order.status === "done") {
      text += `Pesanan Anda telah selesai kami kerjakan. Silakan cek hasilnya ya! Terima kasih sudah mempercayakan tugasnya kepada kami. 🔥`;
    } else {
      text += `Ada yang bisa kami bantu atau diskusikan terkait pesanan ini?`;
    }
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${order.wa}?text=${encodedText}`, "_blank");
  };

  const handleSaveSettings = () => {
    saveSettings(adminSettings);
    toast("Konfigurasi sistem berhasil disimpan!", "success");
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: "Menunggu", color: "bg-[#FFDF00]" },
      process: { label: "Dikerjakan", color: "bg-[#A6FAFF]" },
      done: { label: "Selesai", color: "bg-[#90EE90]" },
    };
    return (
      <NeoBadge
        color={map[status].color}
        className="text-xs px-2 py-1 md:px-3 md:py-1.5"
      >
        {map[status].label}
      </NeoBadge>
    );
  };

  const Sidebar = () => (
    <div
      className={`
      fixed inset-y-0 left-0 z-[150] w-64 md:w-64 bg-white border-r-4 md:border-r-8 border-black transform transition-transform duration-300 ease-in-out flex flex-col
      ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative
    `}
    >
      <div className="p-5 md:p-6 border-b-4 md:border-b-8 border-black flex justify-between items-center bg-[#FFDF00]">
        <h1 className="font-black text-xl md:text-2xl uppercase tracking-tighter">
          Admin.
        </h1>
        <button
          className="md:hidden bg-white border-2 border-black p-1"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="w-5 h-5 font-black" />
        </button>
      </div>
      <div className="p-4 md:p-5 flex-grow flex flex-col gap-3">
        {[
          { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
          { id: "orders", icon: ShoppingCart, label: "Pesanan" },
          { id: "settings", icon: Settings, label: "Pengaturan" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 font-black uppercase text-sm md:text-base transition-all border-2 md:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
              ${activeTab === item.id ? "bg-[#FF90E8] translate-x-1 md:translate-x-2" : "bg-white hover:bg-gray-100 hover:-translate-y-0.5"}
            `}
          >
            <item.icon className="w-4 h-4 md:w-5 md:h-5" /> {item.label}
          </button>
        ))}
      </div>
      <div className="p-4 md:p-5 border-t-4 md:border-t-8 border-black bg-black">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 font-black uppercase py-2.5 md:py-3 bg-white border-2 md:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all text-sm md:text-base"
        >
          <LogOut className="w-4 h-4 md:w-5 md:h-5" /> Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f0] flex relative overflow-hidden font-sans selection:bg-[#A6FAFF] selection:text-black">
      <CustomCursor />
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 md:h-20 bg-white border-b-4 md:border-b-8 border-black flex items-center justify-between px-4 md:px-8 shrink-0 z-10 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 bg-[#FFDF00] border-2 md:border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <h2 className="text-lg md:text-xl font-black uppercase hidden md:block tracking-widest">
              {activeTab}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-black text-xs md:text-sm hidden sm:block bg-[#FFDF00] border-2 border-black px-3 py-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              ADMIN UTAMA
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8 relative z-0">
          {activeTab === "dashboard" && (
            <div className="space-y-6 md:space-y-8 animate-[slideIn_0.4s_ease-out] max-w-6xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <NeoCard
                  color="bg-[#A6FAFF]"
                  className="!p-5 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black uppercase text-xs md:text-sm mb-1">
                        Total Pendapatan
                      </p>
                      <p className="text-2xl md:text-3xl font-black drop-shadow-[1px_1px_0_#fff]">
                        {formatRupiah(
                          orders
                            .filter((o) => o.status === "done")
                            .reduce((acc, curr) => acc + curr.amount, 0),
                        )}
                      </p>
                    </div>
                  </div>
                </NeoCard>
                <NeoCard
                  color="bg-[#FFDF00]"
                  className="!p-5 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black uppercase text-xs md:text-sm mb-1">
                        Pesanan Aktif
                      </p>
                      <p className="text-2xl md:text-3xl font-black drop-shadow-[1px_1px_0_#fff]">
                        {orders.filter((o) => o.status !== "done").length}
                      </p>
                    </div>
                  </div>
                </NeoCard>
                <NeoCard
                  color="bg-[#90EE90]"
                  className="!p-5 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black uppercase text-xs md:text-sm mb-1">
                        Selesai Total
                      </p>
                      <p className="text-2xl md:text-3xl font-black drop-shadow-[1px_1px_0_#fff]">
                        {orders.filter((o) => o.status === "done").length}
                      </p>
                    </div>
                  </div>
                </NeoCard>
              </div>

              <div className="border-4 md:border-8 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="p-4 md:p-6 border-b-4 md:border-b-8 border-black bg-[#FF90E8] flex justify-between items-center">
                  <h3 className="text-xl md:text-2xl font-black uppercase">
                    Pesanan Terbaru
                  </h3>
                  <NeoButton
                    onClick={() => setActiveTab("orders")}
                    className="!py-1 md:!py-2 !px-3 md:!px-4 text-[10px] md:text-sm"
                    color="bg-white"
                  >
                    Lihat Semua
                  </NeoButton>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-black text-white uppercase text-xs md:text-sm font-black tracking-widest">
                        <th className="p-3 md:p-4 border-r-2 md:border-r-4 border-gray-700">
                          ID
                        </th>
                        <th className="p-3 md:p-4 border-r-2 md:border-r-4 border-gray-700">
                          Klien
                        </th>
                        <th className="p-3 md:p-4 border-r-2 md:border-r-4 border-gray-700">
                          Layanan
                        </th>
                        <th className="p-3 md:p-4 border-r-2 md:border-r-4 border-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order, i) => (
                        <tr
                          key={order.id}
                          className={`font-bold text-xs md:text-sm border-b-2 md:border-b-4 border-black transition-colors ${i % 2 === 0 ? "bg-white hover:bg-gray-100" : "bg-[#f4f4f0] hover:bg-gray-200"}`}
                        >
                          <td className="p-3 md:p-4 border-r-2 md:border-r-4 border-black font-black">
                            {order.id}
                          </td>
                          <td className="p-3 md:p-4 border-r-2 md:border-r-4 border-black">
                            {order.client}
                          </td>
                          <td className="p-3 md:p-4 border-r-2 md:border-r-4 border-black">
                            {order.service}
                          </td>
                          <td className="p-3 md:p-4 border-r-2 md:border-r-4 border-black">
                            {getStatusBadge(order.status)}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td
                            colSpan="4"
                            className="p-6 text-center text-gray-500 font-bold uppercase"
                          >
                            Kosong melompong
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6 md:space-y-8 animate-[slideIn_0.4s_ease-out] max-w-6xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-black uppercase">
                  Manajemen Pesanan
                </h2>
                <input
                  type="text"
                  placeholder="Cari ID, Nama, Layanan..."
                  className="w-full sm:w-72 border-2 md:border-4 border-black p-2 md:p-3 font-bold text-sm md:text-base focus:outline-none focus:bg-[#A6FAFF] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="border-4 md:border-8 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-black text-white uppercase text-xs md:text-sm font-black tracking-widest">
                        <th className="p-3 md:p-4 border-r-2 md:border-r-4 border-gray-700">
                          ID & Tgl
                        </th>
                        <th className="p-3 md:p-4 border-r-2 md:border-r-4 border-gray-700">
                          Klien & WA
                        </th>
                        <th className="p-3 md:p-4 border-r-2 md:border-r-4 border-gray-700">
                          Layanan & Catatan
                        </th>
                        <th className="p-3 md:p-4 border-r-2 md:border-r-4 border-gray-700">
                          Total
                        </th>
                        <th className="p-3 md:p-4 border-r-2 md:border-r-4 border-gray-700">
                          Status
                        </th>
                        <th className="p-3 md:p-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter(
                          (o) =>
                            o.id
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            o.client
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            o.service
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                        )
                        .map((order, i) => (
                          <tr
                            key={order.id}
                            className={`font-bold text-xs md:text-sm border-b-2 md:border-b-4 border-black transition-colors ${i % 2 === 0 ? "bg-white hover:bg-gray-100" : "bg-[#f4f4f0] hover:bg-gray-200"}`}
                          >
                            <td className="p-3 md:p-4 border-r-2 md:border-r-4 border-black">
                              <span className="font-black text-[#3b82f6]">
                                {order.id}
                              </span>
                              <br />
                              <span className="text-gray-500 text-[10px] md:text-xs">
                                {order.date}
                              </span>
                            </td>
                            <td className="p-3 md:p-4 border-r-2 md:border-r-4 border-black">
                              {order.client}
                              <br />
                              <a
                                href={`https://wa.me/${order.wa}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-[10px] md:text-xs flex items-center mt-1"
                              >
                                WA: {order.wa}
                              </a>
                            </td>
                            <td className="p-3 md:p-4 border-r-2 md:border-r-4 border-black">
                              {order.service}
                              <br />
                              {order.notes && (
                                <span className="text-gray-500 italic text-[10px] md:text-xs block mt-1">
                                  "{order.notes}"
                                </span>
                              )}
                            </td>
                            <td className="p-3 md:p-4 border-r-2 md:border-r-4 border-black">
                              {formatRupiah(order.amount)}
                            </td>
                            <td className="p-3 md:p-4 border-r-2 md:border-r-4 border-black">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="p-3 md:p-4">
                              <div className="flex items-center justify-center gap-2">
                                <select
                                  className="border-2 border-black bg-[#A6FAFF] p-1 md:p-1.5 text-[10px] md:text-xs font-black focus:outline-none focus:bg-[#FFDF00] cursor-pointer"
                                  value={order.status}
                                  onChange={(e) =>
                                    handleStatusChange(order.id, e.target.value)
                                  }
                                >
                                  <option value="pending">PENDING</option>
                                  <option value="process">PROSES</option>
                                  <option value="done">SELESAI</option>
                                </select>
                                <button
                                  onClick={() => handleContactCustomer(order)}
                                  className="bg-[#90EE90] text-black p-1.5 md:p-2 border-2 border-black hover:bg-green-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                                  title="Hubungi via WA"
                                >
                                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="bg-red-500 text-white p-1.5 md:p-2 border-2 border-black hover:bg-red-600 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                                  title="Hapus Pesanan"
                                >
                                  <X className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {orders.length === 0 && (
                        <tr>
                          <td
                            colSpan="6"
                            className="p-8 text-center text-gray-500 font-black uppercase text-lg"
                          >
                            Belum ada pesanan / Tidak ditemukan
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6 md:space-y-8 animate-[slideIn_0.4s_ease-out] max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-black uppercase mb-6">
                Pengaturan Sistem
              </h2>

              <NeoCard color="bg-white">
                <div className="space-y-6">
                  <div className="bg-[#FFDF00] p-4 border-2 md:border-4 border-black -mx-4 -mt-4 md:-mx-6 md:-mt-6 mb-6 font-black uppercase text-base md:text-lg border-b-2 md:border-b-4">
                    Konfigurasi Utama
                  </div>

                  <NeoInput
                    label="Nomor WhatsApp Admin (Utama)"
                    type="text"
                    value={adminSettings.waNumber}
                    onChange={(e) =>
                      setAdminSettings({
                        ...adminSettings,
                        waNumber: e.target.value,
                      })
                    }
                    placeholder="Contoh: 628123456789"
                  />

                  <div className="flex items-center justify-between p-4 border-2 md:border-4 border-black bg-[#f4f4f0]">
                    <div>
                      <h4 className="font-black uppercase text-sm md:text-base">
                        Terima Pesanan Baru
                      </h4>
                      <p className="text-xs md:text-sm font-bold text-gray-600 mt-1">
                        Matikan saklar ini jika Admin sedang libur atau slot
                        penuh.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setAdminSettings({
                          ...adminSettings,
                          acceptingOrders: !adminSettings.acceptingOrders,
                        })
                      }
                      className={`w-14 md:w-16 h-7 md:h-8 border-2 md:border-4 border-black rounded-full relative transition-colors shrink-0 ${adminSettings.acceptingOrders ? "bg-[#90EE90]" : "bg-red-400"}`}
                    >
                      <div
                        className={`w-5 md:w-6 h-5 md:h-6 border-2 md:border-4 border-black bg-white rounded-full absolute top-[2px] transition-transform ${adminSettings.acceptingOrders ? "translate-x-[26px] md:translate-x-[30px]" : "translate-x-[2px]"}`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-2 md:border-4 border-black bg-[#f4f4f0] gap-4">
                    <div>
                      <h4 className="font-black uppercase text-sm md:text-base">
                        Metode Pembayaran (Checkout)
                      </h4>
                      <p className="text-xs md:text-sm font-bold text-gray-600 mt-1">
                        Ubah ke WhatsApp jika Pakkasir sedang gangguan.
                      </p>
                    </div>
                    <select
                      value={adminSettings.paymentMethod}
                      onChange={(e) =>
                        setAdminSettings({
                          ...adminSettings,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="border-2 md:border-4 border-black bg-white p-2 text-xs md:text-sm font-black focus:outline-none focus:bg-[#A6FAFF] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-full sm:w-auto"
                    >
                      <option value="whatsapp">
                        Direct Invoice (WhatsApp)
                      </option>
                      <option value="pakkasir">Via Gateway (Pakkasir)</option>
                    </select>
                  </div>

                  <NeoButton
                    onClick={handleSaveSettings}
                    color="bg-[#A6FAFF]"
                    icon={Check}
                    className="w-full mt-4 !py-3 md:!py-4"
                  >
                    SIMPAN PENGATURAN
                  </NeoButton>
                </div>
              </NeoCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

/* ==========================================================================
   🔐 AUTH ROUTER
   ========================================================================== */

const AdminLogin = ({ onLogin, onBack }) => {
  const [pwd, setPwd] = useState("");
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwd === "admin123") {
      toast("Akses Diberikan. Selamat Datang!", "success");
      onLogin();
    } else {
      toast("Akses Ditolak! Sandi Salah.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#FFDF00] selection:text-black">
      <CustomCursor />

      <div
        className="absolute inset-0 bg-[#FF90E8] opacity-20"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 10%, 0 20%)",
          animation: "scanline 4s linear infinite",
        }}
      ></div>
      <div
        className="absolute inset-0 bg-[#A6FAFF] opacity-20"
        style={{
          clipPath: "polygon(0 80%, 100% 90%, 100% 100%, 0 100%)",
          animation: "scanline 3s linear infinite reverse",
        }}
      ></div>

      <div className="relative w-full max-w-sm md:max-w-md z-10 group perspective-1000">
        <div className="absolute inset-0 bg-[#FFDF00] border-4 md:border-8 border-black translate-x-4 translate-y-4 shadow-[8px_8px_0px_0px_#A6FAFF] transition-transform duration-300"></div>
        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white border-4 md:border-8 border-black p-6 md:p-10 space-y-6 transform transition-transform duration-300"
        >
          <div className="text-center mb-6 md:mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-black border-2 md:border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 shadow-[6px_6px_0px_0px_#FF90E8]">
              <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
              Login Admin
            </h2>
          </div>
          <NeoInput
            label="KATA SANDI RAHASIA"
            type="password"
            placeholder="••••••••"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="text-base md:text-lg"
          />
          <NeoButton
            className="w-full text-base md:text-lg py-3 md:py-4"
            type="submit"
            color="bg-[#A6FAFF]"
          >
            MASUK SISTEM
          </NeoButton>
          <button
            type="button"
            onClick={onBack}
            className="w-full text-center font-bold text-sm md:text-base hover:underline mt-4 hover:text-[#3b82f6]"
          >
            ← Kembali ke Jalan Benar
          </button>
        </form>
      </div>

      <style>{`
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(1000%); } }
      `}</style>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState("landing");
  const [booting, setBooting] = useState(true);

  return (
    <ToastProvider>
      {booting && <BootSequence onComplete={() => setBooting(false)} />}

      {!booting && (
        <>
          {view === "landing" && <ClientLanding navigate={setView} />}
          {view === "login" && (
            <AdminLogin
              onLogin={() => setView("admin")}
              onBack={() => setView("landing")}
            />
          )}
          {view === "admin" && (
            <AdminDashboard onLogout={() => setView("landing")} />
          )}
        </>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap');
        body { font-family: 'Space Grotesk', sans-serif; -webkit-font-smoothing: antialiased; cursor: none; }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @media (max-width: 768px) { body { cursor: auto; } } 
      `,
        }}
      />
    </ToastProvider>
  );
}
