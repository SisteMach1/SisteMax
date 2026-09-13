import React, { useState, useEffect, useMemo } from "react";
import logo from "container:///mnt/data/src/assets/b230ae39f968b098-sistemax_logo.png";

// ==================== EDITÁ TODO ACÁ ====================
const CONFIG = {
  whatsappNumero: "5493734525075",
  whatsappVisible: "+54 9 3734 52-5075",
  aliasMP: "mateo.tomas2026",
  email: "contacto@sistemax.com.ar",
  nombreTienda: "SisteMax",
  slogan: "Sistemas que venden por vos",
  descripcionHero: "Sistemas de gestión para negocios que quieren vender más",
  claveAdmin: "todocasero.2020"
};

const PRODUCTOS = [
  { id: 1, nombre: "SisteMax POS Pro", precio: 129999, foto: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop", descripcionCorta: "Punto de venta completo", descripcionLarga: "Sistema completo con control de stock, ventas, reportes. Edita esta descripcion.", caracteristicas: ["Control de stock", "Ventas rápidas", "Reportes"], categoria: "Punto de Venta", badge: "Más vendido" },
  { id: 2, nombre: "SisteMax ERP PyME", precio: 249999, foto: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop", descripcionCorta: "Gestión total de tu empresa", descripcionLarga: "Descripción editable...", caracteristicas: ["Ventas", "Compras", "Contabilidad"], categoria: "Gestión", badge: "Nuevo" },
  { id: 3, nombre: "SisteMax Gastro", precio: 99999, foto: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", descripcionCorta: "Para bares y restaurantes", descripcionLarga: "Descripción...", caracteristicas: ["Comandas", "Mozos", "Delivery"], categoria: "Gastronomía", badge: "" },
  { id: 4, nombre: "SisteMax Facturación Pro", precio: 59999, foto: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop", descripcionCorta: "Facturación electrónica homologada", descripcionLarga: "Facturación pro para tu negocio. Sin mencionar AFIP.", caracteristicas: ["Facturas A/B/C", "Automático", "PDF"], categoria: "Facturación", badge: "Oferta" },
  { id: 5, nombre: "SisteMax CRM", precio: 79999, foto: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop", descripcionCorta: "Clientes y ventas", descripcionLarga: "Descripción...", caracteristicas: ["Clientes", "Seguimiento", "WhatsApp"], categoria: "Gestión", badge: "" },
  { id: 6, nombre: "SisteMax Stock Master", precio: 69999, foto: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop", descripcionCorta: "Control de inventario", descripcionLarga: "Descripción...", caracteristicas: ["Stock", "Alertas", "Depósitos"], categoria: "Stock", badge: "" },
  { id: 7, nombre: "SisteMax Shop Online", precio: 149999, foto: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=400&h=300&fit=crop", descripcionCorta: "Tu e-commerce integrado", descripcionLarga: "Descripción...", caracteristicas: ["Tienda online", "MercadoPago", "Envíos"], categoria: "E-commerce", badge: "" },
  { id: 8, nombre: "SisteMax Gym & Beauty", precio: 89999, foto: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop", descripcionCorta: "Turnos y membresías", descripcionLarga: "Descripción...", caracteristicas: ["Turnos", "Membresías", "Caja"], categoria: "Turnos", badge: "" },
  { id: 9, nombre: "SisteMax Delivery", precio: 74999, foto: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&h=300&fit=crop", descripcionCorta: "Pedidos y repartidores", descripcionLarga: "Descripción...", caracteristicas: ["Pedidos", "Reparto", "Mapa"], categoria: "Delivery", badge: "" },
  { id: 10, nombre: "SisteMax Inventario Móvil", precio: 49999, foto: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop", descripcionCorta: "App escáner QR", descripcionLarga: "Descripción...", caracteristicas: ["Escáner", "Android", "Offline"], categoria: "Stock", badge: "" },
];
// ==================== FIN ZONA EDITABLE ====================

type Producto = typeof PRODUCTOS[0];
type CartItem = Producto & { qty: number };

export default function App() {
  const [productos, setProductos] = useState<Producto[]>(PRODUCTOS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState<string>("Todos");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sistemax_productos_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setProductos(parsed);
      }
    } catch {}
  }, []);

  // save when admin edits
  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem("sistemax_productos_v3", JSON.stringify(productos));
    }
  }, [productos, isAdmin]);

  // secret shortcut Ctrl+Shift+A
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        pedirClave();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const pedirClave = () => {
    const clave = prompt("🔐 Clave Admin:");
    if (clave === null) return;
    if (clave === CONFIG.claveAdmin) {
      setIsAdmin(true);
      setShowAdminPanel(true);
    } else {
      alert("Clave incorrecta");
    }
  };

  const categorias = useMemo(() => {
    const cats = Array.from(new Set(productos.map(p => p.categoria)));
    return ["Todos", ...cats];
  }, [productos]);

  const filtrados = useMemo(() => {
    if (categoriaActiva === "Todos") return productos;
    return productos.filter(p => p.categoria === categoriaActiva);
  }, [productos, categoriaActiva]);

  const total = cart.reduce((s, i) => s + i.precio * i.qty, 0);
  const totalTransferencia = Math.round(total * 0.85);

  const addToCart = (p: Producto) => {
    setCart(prev => {
      const ex = prev.find(x => x.id === p.id);
      if (ex) return prev.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...p, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));

  const handleWhatsAppProd = (p: Producto) => {
    const msg = `Hola! Me interesa ${p.nombre} - $${p.precio.toLocaleString("es-AR")} - ${CONFIG.nombreTienda}`;
    window.open(`https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const updateProducto = (id: number, field: string, value: any) => {
    setProductos(prev => prev.map(p => p.id === id ? { ...p, [field]: value } as Producto : p));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // limit 4MB to avoid localStorage overflow
    if (file.size > 4 * 1024 * 1024) {
      alert("La imagen es muy grande (máx 4MB). Probá con una más chica.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        setProductos(prev => prev.map(p => p.id === id ? { ...p, foto: dataUrl } as Producto : p));
      }
    };
    reader.readAsDataURL(file);
    // reset input to allow same file again
    e.target.value = "";
  };

  const formatARS = (n: number) => `$${n.toLocaleString("es-AR")}`;

  return (
    <div className="min-h-screen text-white selection:bg-[#0ea5e9]/30 overflow-x-hidden" style={{ background: "#080a12" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500&display=swap');
        *{font-family:'Inter',sans-serif}
        .mono{font-family:'JetBrains Mono',monospace}
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-thumb{background:#23263a;border-radius:999px}
      `}</style>

      {/* ADMIN BANNER */}
      {isAdmin && (
        <div className="sticky top-0 z-[60] bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[13px] font-bold tracking-wide px-4 py-2 flex items-center justify-between">
          <span>🔧 MODO ADMIN ACTIVO — Solo vos lo ves — Productos editables y guardados localmente</span>
          <div className="flex gap-2">
            <button onClick={() => setShowAdminPanel(true)} className="bg-black text-white px-3 py-1 rounded-full text-xs">✏️ EDITAR PRODUCTOS</button>
            <button onClick={() => { setIsAdmin(false); setShowAdminPanel(false); }} className="bg-white/90 px-3 py-1 rounded-full text-xs">Salir</button>
          </div>
        </div>
      )}

      {/* HEADER con LOGO GRANDE VISIBLE */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: "rgba(8,10,18,0.85)", borderColor: "#23263a" }}>
        <div className="max-w-[1320px] mx-auto px-5 lg:px-8 h-[84px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* LOGO REAL VISIBLE CON BRILLO */}
            <div className="relative shrink-0">
              <div className="absolute -inset-3 bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] blur-[18px] opacity-60 rounded-[20px]" />
              <img src={logo} alt="SisteMax logo" className="relative w-12 h-12 object-contain rounded-xl shadow-[0_0_24px_rgba(14,165,233,0.45)] bg-[#13151f] border border-white/10" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h1 className="text-[26px] font-black tracking-[-0.03em] leading-none bg-gradient-to-r from-[#0ea5e9] via-[#38bdf8] to-[#8b5cf6] bg-clip-text text-transparent">SisteMax</h1>
              <p className="text-[10px] tracking-[0.22em] font-bold text-white/50 uppercase leading-none">{CONFIG.slogan}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button onClick={() => setShowAdminPanel(true)} className="hidden md:flex h-10 px-4 rounded-full bg-white text-black text-sm font-bold items-center gap-2">✏️ EDITAR</button>
            )}
            <a href={`https://wa.me/${CONFIG.whatsappNumero}`} target="_blank" rel="noopener" className="hidden md:flex h-10 px-4 rounded-full border text-sm font-semibold items-center gap-2" style={{ borderColor: "#23263a", background: "#13151f" }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> {CONFIG.whatsappVisible}
            </a>
            <button onClick={() => setCartOpen(true)} className="relative h-10 px-5 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] text-sm font-bold shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center gap-2">
              🛒 Carrito {cart.length > 0 && <span className="bg-white text-black text-[11px] font-black px-2 py-0.5 rounded-full">{cart.reduce((s,i)=>s+i.qty,0)}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-8 pt-10 pb-8">
        <div className="relative overflow-hidden rounded-[28px] border" style={{ background: "linear-gradient(135deg,#11131f 0%,#0f1220 50%,#14172a 100%)", borderColor: "#23263a" }}>
          <div className="absolute inset-0">
            <div className="absolute -top-24 -right-24 w-[420px] h-[420px] bg-[#0ea5e9]/20 blur-[80px] rounded-full" />
            <div className="absolute -bottom-32 -left-32 w-[520px] h-[520px] bg-[#8b5cf6]/20 blur-[90px] rounded-full" />
          </div>
          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-8 p-8 md:p-10 lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border" style={{ borderColor: "#23263a", background: "#080a12" }}>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> PREMIUM · 100% EDITABLE · SOPORTE REAL
              </div>
              <h2 className="mt-5 text-[36px] md:text-[48px] font-black leading-[0.9] tracking-[-0.04em]">
                Sistemas que <span className="bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] bg-clip-text text-transparent">venden por vos.</span>
              </h2>
              <p className="mt-4 text-[16px] leading-6 text-white/60 max-w-[560px]">{CONFIG.descripcionHero}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Instalación remota", "Licencia de por vida", "Soporte por WhatsApp", "Actualizaciones"].map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-full text-xs font-medium border bg-[#080a12]" style={{ borderColor: "#23263a" }}>{t}</span>
                ))}
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={() => document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" })} className="h-12 px-6 rounded-full bg-white text-black font-bold text-sm">Ver sistemas →</button>
                <a href={`https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent("Hola SisteMax! Quiero info")}`} target="_blank" rel="noopener" className="h-12 px-6 rounded-full border font-semibold text-sm flex items-center" style={{ borderColor: "#23263a", background: "#13151f" }}>Hablar por WhatsApp</a>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 max-w-[420px]">
                {[
                  { k: "+2.500", v: "Negocios activos" },
                  { k: "24/7", v: "Soporte real" },
                  { k: "15% OFF", v: "Por transferencia" },
                ].map(s => (
                  <div key={s.k} className="rounded-2xl p-3 border" style={{ background: "#080a12", borderColor: "#23263a" }}>
                    <div className="text-lg font-black">{s.k}</div>
                    <div className="text-[11px] text-white/50 -mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[20px] overflow-hidden border p-3" style={{ background: "#0a0c16", borderColor: "#23263a" }}>
                <div className="rounded-[14px] overflow-hidden aspect-[4/3] bg-[#13151f] relative">
                  <img src={productos[0]?.foto || PRODUCTOS[0].foto} alt="" className="w-full h-full object-cover opacity-90" onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = logo; }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <div className="max-w-[1320px] mx-auto px-5 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categorias.map(cat => (
            <button key={cat} onClick={() => setCategoriaActiva(cat)} className={`whitespace-nowrap h-9 px-4 rounded-full text-[13px] font-semibold border transition ${categoriaActiva === cat ? "bg-white text-black border-white" : "bg-[#13151f] border-[#23263a] text-white/70 hover:text-white"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID PRODUCTOS */}
      <section id="productos" className="max-w-[1320px] mx-auto px-5 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtrados.map(p => (
          <article key={p.id} className="group rounded-[22px] overflow-hidden border flex flex-col hover:border-white/20 transition" style={{ background: "#13151f", borderColor: "#23263a" }}>
            <div className="relative h-[190px] overflow-hidden bg-[#0a0c16]">
              <img src={p.foto} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = logo; }} />
              <div className="absolute top-3 left-3 flex gap-2">
                {p.badge && <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-white text-black">{p.badge}</span>}
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur border border-white/10">{p.categoria}</span>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur border border-white/10 flex items-center justify-center">
                <img src={logo} alt="S" className="w-5 h-5 object-contain opacity-80" />
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-[15px] leading-tight">{p.nombre}</h3>
              <p className="mt-1 text-[12.5px] text-white/55 line-clamp-2">{p.descripcionCorta}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.caracteristicas.slice(0,3).map(c => (
                  <span key={c} className="px-2 py-1 rounded-full bg-[#080a12] border text-[10px] font-medium text-white/60" style={{ borderColor: "#23263a" }}>{c}</span>
                ))}
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wide font-bold">Precio</div>
                  <div className="mono text-[18px] font-bold">{formatARS(p.precio)}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">15% OFF transf. {formatARS(Math.round(p.precio*0.85))}</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => addToCart(p)} className="h-8 px-3 rounded-full bg-white text-black text-xs font-bold">Agregar</button>
                  <button onClick={() => handleWhatsAppProd(p)} className="h-8 px-3 rounded-full border text-xs font-semibold" style={{ borderColor: "#23263a", background: "#0a0c16" }}>WhatsApp</button>
                </div>
              </div>
              {isAdmin && (
                <button onClick={() => { setEditingId(p.id); setShowAdminPanel(true); }} className="mt-3 h-8 rounded-full bg-amber-500 text-black text-xs font-bold">✏️ Editar rápido</button>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* INFO TRANSFERENCIA */}
      <section className="max-w-[1320px] mx-auto px-5 lg:px-8 pb-10">
        <div className="rounded-[20px] border p-5 md:p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between" style={{ background: "#13151f", borderColor: "#23263a" }}>
          <div>
            <div className="text-sm font-bold">💸 Transferencia con 15% OFF — Solo alias</div>
            <div className="text-[13px] text-white/60 mt-1">Pagá al alias <span className="mono font-bold text-white bg-[#080a12] border px-2 py-0.5 rounded" style={{ borderColor: "#23263a" }}>{CONFIG.aliasMP}</span> y enviá comprobante por WhatsApp.</div>
          </div>
          <a href={`https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent("Hola! Quiero pagar por transferencia al alias "+CONFIG.aliasMP)}`} target="_blank" rel="noopener" className="h-10 px-5 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] text-sm font-bold flex items-center">Enviar comprobante →</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t mt-6" style={{ borderColor: "#23263a", background: "#0a0c16" }}>
        <div className="max-w-[1320px] mx-auto px-5 lg:px-8 py-10 grid md:grid-cols-3 gap-8">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-[12px] bg-gradient-to-br from-[#0ea5e9]/30 to-[#8b5cf6]/30 border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.25)]">
              <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="font-black text-lg leading-none">{CONFIG.nombreTienda}</div>
              <div className="text-[12px] text-white/50 mt-1">{CONFIG.slogan}</div>
              <div className="text-[12px] text-white/40 mt-2 max-w-[300px]">Sistemas de gestión para negocios que quieren vender más</div>
            </div>
          </div>
          <div className="text-sm text-white/60">
            <div className="font-bold text-white mb-2">Contacto directo</div>
            <div>📱 WhatsApp: {CONFIG.whatsappVisible}</div>
          </div>
          <div className="text-[11px] text-white/40 leading-5 flex flex-col justify-center md:items-end">
            <div className="text-[13px] text-white/60 font-medium">© 2026 SisteMax — Todos los derechos reservados</div>
            <div className="mt-2 text-[12px] text-white/30">Soporte real • Instalación remota • Licencia de por vida</div>
          </div>
        </div>
        <div className="text-center text-[11px] text-white/25 py-4 border-t" style={{ borderColor: "#23263a" }}>© 2026 {CONFIG.nombreTienda} — Todos los derechos reservados</div>
      </footer>

      {/* CARRITO LATERAL */}
      <div className={`fixed inset-0 z-[80] transition ${cartOpen ? "visible" : "invisible"}`}>
        <div onClick={() => setCartOpen(false)} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition ${cartOpen ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute right-0 top-0 h-full w-full max-w-[420px] border-l flex flex-col transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`} style={{ background: "#0a0c16", borderColor: "#23263a" }}>
          <div className="h-[72px] flex items-center justify-between px-5 border-b" style={{ borderColor: "#23263a" }}>
            <div className="font-black text-lg">🛒 Tu carrito</div>
            <button onClick={() => setCartOpen(false)} className="w-9 h-9 rounded-full border flex items-center justify-center" style={{ borderColor: "#23263a", background: "#13151f" }}>✕</button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {cart.length === 0 && <div className="text-center text-white/40 text-sm mt-20">Tu carrito está vacío.<br />Agregá algún sistema.</div>}
            {cart.map(item => (
              <div key={item.id} className="rounded-2xl border p-3 flex gap-3" style={{ background: "#13151f", borderColor: "#23263a" }}>
                <img src={item.foto} alt="" className="w-16 h-16 rounded-xl object-cover" onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = logo; }} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{item.nombre}</div>
                  <div className="mono text-xs text-white/60">{formatARS(item.precio)} c/u</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full bg-[#080a12] border flex items-center justify-center" style={{ borderColor: "#23263a" }}>−</button>
                    <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full bg-[#080a12] border flex items-center justify-center" style={{ borderColor: "#23263a" }}>+</button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-auto text-[11px] text-white/40 hover:text-white">Quitar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div className="p-5 border-t space-y-3" style={{ borderColor: "#23263a", background: "#13151f" }}>
              <div className="flex justify-between text-sm"><span className="text-white/60">Subtotal</span><span className="mono font-bold">{formatARS(total)}</span></div>
              <div className="flex justify-between text-sm text-emerald-400"><span>Con 15% OFF transferencia</span><span className="mono font-black">{formatARS(totalTransferencia)}</span></div>
              <button onClick={() => setCheckoutOpen(true)} className="w-full h-12 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] font-bold text-sm">Finalizar compra →</button>
              <a href={`https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(`Hola ${CONFIG.nombreTienda}! Mi carrito: ${cart.map(c=>`${c.nombre} x${c.qty}`).join(", ")} - Total ${formatARS(total)} - OFF ${formatARS(totalTransferencia)}`)}`} target="_blank" rel="noopener" className="w-full h-11 rounded-full border flex items-center justify-center text-sm font-semibold" style={{ borderColor: "#23263a", background: "#080a12" }}>Consultar por WhatsApp</a>
            </div>
          )}
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div onClick={() => setCheckoutOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-[520px] rounded-[24px] border overflow-hidden" style={{ background: "#13151f", borderColor: "#23263a" }}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black">Finalizar compra</h3>
                  <p className="text-[13px] text-white/60 mt-1">Transferí al alias y enviá comprobante.</p>
                </div>
                <button onClick={() => setCheckoutOpen(false)} className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: "#23263a" }}>✕</button>
              </div>

              <div className="mt-5 rounded-2xl border p-4" style={{ background: "#080a12", borderColor: "#23263a" }}>
                <div className="text-[11px] tracking-widest font-bold text-white/40">ALIAS PARA TRANSFERIR</div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="mono text-[20px] font-black tracking-tight">{CONFIG.aliasMP}</div>
                  <button onClick={() => { navigator.clipboard.writeText(CONFIG.aliasMP); alert("Alias copiado: "+CONFIG.aliasMP); }} className="h-9 px-4 rounded-full bg-white text-black text-xs font-bold">Copiar alias</button>
                </div>
                <div className="mt-3 text-[12px] text-white/50">Solo alias. Sin CBU ni titular. Después enviás el comprobante por WhatsApp y activamos tu sistema en el momento.</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3" style={{ background: "#080a12", borderColor: "#23263a" }}>
                  <div className="text-[11px] text-white/40">Total lista</div>
                  <div className="mono font-bold">{formatARS(total)}</div>
                </div>
                <div className="rounded-xl border p-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/10" style={{ borderColor: "#065f46" }}>
                  <div className="text-[11px] text-emerald-300">Con 15% OFF</div>
                  <div className="mono font-black text-emerald-300">{formatARS(totalTransferencia)}</div>
                </div>
              </div>

              <div className="mt-4 text-[12px] text-white/50 leading-5 rounded-xl border p-3" style={{ background: "#0a0c16", borderColor: "#23263a" }}>
                Productos: {cart.map(c=>`${c.nombre} x${c.qty}`).join(" • ")}
              </div>

              <div className="mt-5 flex gap-2">
                <a href={`https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(`Hola! Ya transferí ${formatARS(totalTransferencia)} al alias ${CONFIG.aliasMP}. Mi pedido: ${cart.map(c=>`${c.nombre} x${c.qty}`).join(", ")}.`)}`} target="_blank" rel="noopener" className="flex-1 h-12 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center font-bold text-sm">Ya transferí, enviar comprobante</a>
              </div>
              <div className="mt-3 text-center text-[11px] text-white/30">Soporte real por WhatsApp {CONFIG.whatsappVisible}</div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN PANEL LATERAL */}
      <div className={`fixed inset-0 z-[70] transition ${showAdminPanel && isAdmin ? "visible" : "invisible"}`}>
        <div onClick={() => setShowAdminPanel(false)} className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition ${showAdminPanel ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute left-0 top-0 h-full w-full max-w-[460px] border-r overflow-auto transition-transform duration-300 ${showAdminPanel && isAdmin ? "translate-x-0" : "-translate-x-full"}`} style={{ background: "#0a0c16", borderColor: "#23263a" }}>
          <div className="sticky top-0 z-10 p-5 border-b flex items-center justify-between" style={{ background: "#0a0c16", borderColor: "#23263a" }}>
            <div>
              <div className="font-black">✏️ Edición Premium</div>
              <div className="text-[11px] text-white/50">Editá nombre, precio, foto URL y descripción. Se guarda en localStorage.</div>
            </div>
            <button onClick={() => setShowAdminPanel(false)} className="w-9 h-9 rounded-full border flex items-center justify-center" style={{ borderColor: "#23263a", background: "#13151f" }}>✕</button>
          </div>
          <div className="p-4 space-y-4 pb-10">
            {productos.map(p => (
              <div key={p.id} className="rounded-2xl border p-4" style={{ background: "#13151f", borderColor: editingId === p.id ? "#0ea5e9" : "#23263a" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-sm">#{p.id} — {p.nombre}</div>
                  <button onClick={() => setEditingId(editingId === p.id ? null : p.id)} className={`h-7 px-3 rounded-full text-xs font-bold ${editingId === p.id ? "bg-white text-black" : "bg-[#080a12] border text-white/70"}`} style={{ borderColor: "#23263a" }}>{editingId === p.id ? "Cerrar" : "Editar"}</button>
                </div>
                {editingId === p.id && (
                  <div className="space-y-3">
                    <label className="block"><span className="text-[11px] text-white/50">Nombre</span><input value={p.nombre} onChange={e=>updateProducto(p.id,"nombre",e.target.value)} className="mt-1 w-full h-9 rounded-xl bg-[#080a12] border px-3 text-sm outline-none focus:border-[#0ea5e9]" style={{ borderColor: "#23263a" }} /></label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block"><span className="text-[11px] text-white/50">Precio ARS</span><input type="number" value={p.precio} onChange={e=>updateProducto(p.id,"precio",Number(e.target.value)||0)} className="mt-1 w-full h-9 rounded-xl bg-[#080a12] border px-3 text-sm outline-none" style={{ borderColor: "#23263a" }} /></label>
                      <label className="block"><span className="text-[11px] text-white/50">Badge</span><input value={p.badge} onChange={e=>updateProducto(p.id,"badge",e.target.value)} className="mt-1 w-full h-9 rounded-xl bg-[#080a12] border px-3 text-sm outline-none" style={{ borderColor: "#23263a" }} placeholder="Más vendido / Oferta" /></label>
                    </div>
                    {/* FOTO - NUEVO SISTEMA ARCHIVO LOCAL */}
                    <div className="rounded-xl border p-3 space-y-3" style={{ background: "#080a12", borderColor: "#23263a" }}>
                      <div className="flex gap-3 items-start">
                        <img src={p.foto} alt="preview" className="w-[80px] h-[60px] rounded-lg object-cover border shrink-0" style={{ borderColor: "#23263a" }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] font-bold text-white/80 flex items-center gap-1.5">
                            Foto actual
                            {p.foto?.startsWith("data:") && <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] border border-emerald-500/30">LOCAL</span>}
                          </div>
                          <div className="text-[11px] text-white/40 leading-3 mt-1 truncate">{p.foto?.startsWith("data:") ? `Foto subida desde PC/celular (${Math.round(p.foto.length/1024)} KB)` : p.foto.slice(0,48)}</div>
                          <div className="mt-2 flex gap-2">
                            <label htmlFor={`file-${p.id}`} className="h-8 px-3 rounded-full bg-white text-black text-[11px] font-bold flex items-center justify-center cursor-pointer hover:bg-white/90 transition">
                              📁 Cambiar foto
                            </label>
                            <input id={`file-${p.id}`} type="file" accept="image/*" className="hidden" onChange={(e)=>handleFileChange(e, p.id)} />
                            {p.foto?.startsWith("data:") && (
                              <button onClick={()=>{ if(confirm("¿Quitar foto local?")) updateProducto(p.id,"foto", PRODUCTOS.find(orig=>orig.id===p.id)?.foto || "") }} className="h-8 px-3 rounded-full border text-[11px] font-semibold text-white/60 hover:text-white" style={{ borderColor: "#23263a", background: "#13151f" }}>Quitar</button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-[11px] font-bold text-white/70">
                          <span className="w-5 h-5 rounded-full bg-[#13151f] border flex items-center justify-center text-[12px]" style={{ borderColor: "#23263a" }}>📁</span>
                          Subir foto desde PC/Celular
                        </label>
                        <label htmlFor={`file2-${p.id}`} className="group relative w-full h-[46px] rounded-xl border border-dashed flex items-center justify-center gap-2 cursor-pointer hover:border-[#0ea5e9]/60 hover:bg-[#0ea5e9]/5 transition" style={{ borderColor: "#2a2d44", background: "#0a0c16" }}>
                          <span className="text-sm">📸</span>
                          <span className="text-[12px] font-semibold text-white/70 group-hover:text-white">Tocar para elegir foto</span>
                          <span className="text-[10px] text-white/30 ml-1 hidden sm:inline">(JPG, PNG, WEBP)</span>
                        </label>
                        <input id={`file2-${p.id}`} type="file" accept="image/*" className="hidden" onChange={(e)=>handleFileChange(e, p.id)} />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] text-white/40">O pegá link (opcional) — fallback si no subís archivo</span>
                        <input value={p.foto.startsWith("data:") ? "" : p.foto} onChange={e=>{ const v=e.target.value.trim(); if(v) updateProducto(p.id,"foto",v); }} placeholder="https://..." className="w-full h-9 rounded-xl bg-[#13151f] border px-3 text-[12px] outline-none placeholder:text-white/20" style={{ borderColor: "#23263a" }} />
                        <div className="text-[10px] text-white/30 leading-3">Si subís archivo, se guarda como base64 y persiste en localStorage. La URL es solo alternativa.</div>
                      </div>
                    </div>

                    <label className="block"><span className="text-[11px] text-white/50">Categoría</span><input value={p.categoria} onChange={e=>updateProducto(p.id,"categoria",e.target.value)} className="mt-1 w-full h-9 rounded-xl bg-[#080a12] border px-3 text-sm outline-none" style={{ borderColor: "#23263a" }} /></label>
                    <label className="block"><span className="text-[11px] text-white/50">Descripción corta</span><input value={p.descripcionCorta} onChange={e=>updateProducto(p.id,"descripcionCorta",e.target.value)} className="mt-1 w-full h-9 rounded-xl bg-[#080a12] border px-3 text-sm outline-none" style={{ borderColor: "#23263a" }} /></label>
                    <label className="block"><span className="text-[11px] text-white/50">Descripción larga</span><textarea value={p.descripcionLarga} onChange={e=>updateProducto(p.id,"descripcionLarga",e.target.value)} rows={3} className="mt-1 w-full rounded-xl bg-[#080a12] border p-3 text-sm outline-none resize-none" style={{ borderColor: "#23263a" }} /></label>
                    <label className="block"><span className="text-[11px] text-white/50">Características (separadas por coma)</span><input value={p.caracteristicas.join(", ")} onChange={e=>updateProducto(p.id,"caracteristicas",e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} className="mt-1 w-full h-9 rounded-xl bg-[#080a12] border px-3 text-sm outline-none" style={{ borderColor: "#23263a" }} /></label>
                  </div>
                )}
              </div>
            ))}
            <div className="rounded-2xl border p-4 text-[11px] text-white/40 leading-4" style={{ background: "#080a12", borderColor: "#23263a" }}>
              Tips: Podés cambiar nombres, precios y fotos al instante. Los cambios quedan en este navegador (localStorage). Para volver a los originales, borrá la clave <span className="mono text-white/70">sistemax_productos_v3</span> del localStorage.
              <div className="mt-3 flex gap-2">
                <button onClick={() => { if(confirm("¿Borrar edición y volver a productos originales?")){ localStorage.removeItem("sistemax_productos_v3"); setProductos(PRODUCTOS); } }} className="h-8 px-3 rounded-full border text-[11px] font-bold" style={{ borderColor: "#23263a" }}>Restaurar originales</button>
                <button onClick={() => setShowAdminPanel(false)} className="h-8 px-3 rounded-full bg-white text-black text-[11px] font-bold">Listo</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PUNTO INVISIBLE ADMIN — 10x10 fixed bottom:4px left:4px */}
      <div
        onClick={pedirClave}
        title="admin"
        style={{
          position: "fixed",
          bottom: "4px",
          left: "4px",
          width: "10px",
          height: "10px",
          background: "#0a0c16",
          opacity: 0.08,
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 9999,
        }}
      />

    </div>
  );
}
