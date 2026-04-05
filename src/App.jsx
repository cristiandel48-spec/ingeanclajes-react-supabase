
import { useMemo, useState } from 'react'
import {
  Building2,
  CalendarDays,
  CreditCard,
  FileSpreadsheet,
  HardHat,
  Home,
  Landmark,
  Map,
  Plus,
  ReceiptText,
  ShieldCheck,
  Users,
} from 'lucide-react'

const currency = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const clientPlansSeed = [
  {
    id: 'PL-001',
    client: 'Constructora Alfa S.A.S',
    work: 'Torre Alfa Cartagena',
    address: 'Cartagena, Bolívar',
    googleMapsUrl: 'https://maps.google.com/?q=Cartagena+Bolivar',
    mapImageUrl: 'https://maps.googleapis.com/maps/api/staticmap?center=Cartagena,Bolivar&zoom=18&size=800x380&maptype=satellite',
    blueprintName: 'Planta Nivel 4-5 - Torre Alfa Cartagena - 1:100',
    points: [
      { id: 'P1', x: 18, y: 28, status: 'certificado', detail: 'Anclaje epóxico nacional', cost: 920000 },
      { id: 'P2', x: 42, y: 28, status: 'certificado', detail: 'Línea horizontal tramo 1', cost: 1180000 },
      { id: 'P3', x: 66, y: 28, status: 'pendiente', detail: 'Escotilla técnica', cost: 1450000 },
      { id: 'P4', x: 18, y: 56, status: 'certificado', detail: 'Anclaje importado', cost: 1230000 },
      { id: 'P5', x: 42, y: 56, status: 'certificado', detail: 'Línea horizontal tramo 2', cost: 1180000 },
      { id: 'P6', x: 66, y: 56, status: 'certificado', detail: 'Escalera vertical', cost: 2860000 },
      { id: 'P7', x: 42, y: 82, status: 'pendiente', detail: 'Conexión a cubierta', cost: 820000 },
    ],
    traces: [
      { from: [18, 28], to: [66, 28] },
      { from: [18, 56], to: [66, 56] },
      { from: [42, 28], to: [42, 82] },
    ],
  },
  {
    id: 'PL-002',
    client: 'Parque Industrial Mamonal',
    work: 'Mantenimiento Fachada Sur',
    address: 'Mamonal, Cartagena',
    googleMapsUrl: 'https://maps.google.com/?q=Mamonal+Cartagena',
    mapImageUrl: 'https://maps.googleapis.com/maps/api/staticmap?center=Mamonal,Cartagena&zoom=18&size=800x380&maptype=satellite',
    blueprintName: 'Fachada Sur - Zona Industrial',
    points: [
      { id: 'P1', x: 20, y: 34, status: 'pendiente', detail: 'Punto de anclaje importado', cost: 1320000 },
      { id: 'P2', x: 42, y: 34, status: 'pendiente', detail: 'Línea de vida vertical', cost: 980000 },
      { id: 'P3', x: 64, y: 34, status: 'pendiente', detail: 'Escalera metálica', cost: 2550000 },
      { id: 'P4', x: 64, y: 68, status: 'certificado', detail: 'Placa base metálica', cost: 1140000 },
    ],
    traces: [
      { from: [20, 34], to: [64, 34] },
      { from: [64, 34], to: [64, 68] },
    ],
  },
]

const worksSeed = [
  { id: 'OB-001', client: 'Constructora Alfa S.A.S', work: 'Torre Residencial - Cartagena', status: 'En Obra', progress: 65, total: 8841700, collected: 5000000, cost: 5270000, planId: 'PL-001' },
  { id: 'OB-002', client: 'Parque Industrial Mamonal', work: 'Mantenimiento Fachada Sur', status: 'Cotización', progress: 0, total: 3200000, collected: 0, cost: 2130000, planId: 'PL-002' },
  { id: 'OB-003', client: 'Hotel Caribe Hilton', work: 'Líneas de Vida + Certificación', status: 'Pagado', progress: 100, total: 12450000, collected: 12450000, cost: 7450000, planId: 'PL-001' },
  { id: 'OB-004', client: 'Cemex Colombia S.A.', work: 'Anclajes Epóxicos Planta', status: 'En Obra', progress: 30, total: 5670000, collected: 2835000, cost: 3480000, planId: 'PL-002' },
]

const itemTemplates = [
  { category: 'Línea de vida', description: 'LINEA DE VIDA 1 21 ML', quantity: 21, unitValue: 280000, origin: '' },
  { category: 'Línea de vida', description: 'LINEA DE VIDA 2 27 ML', quantity: 27, unitValue: 280000, origin: '' },
  { category: 'Línea de vida', description: 'LINEA DE VIDA CONEXIÓN 26 ML', quantity: 26, unitValue: 280000, origin: '' },
  { category: 'Puntos de anclaje', description: 'PUNTO DE ANCLAJE NACIONAL', quantity: 1, unitValue: 180000, origin: 'Nacional' },
  { category: 'Puntos de anclaje', description: 'PUNTO DE ANCLAJE IMPORTADO', quantity: 1, unitValue: 260000, origin: 'Importado' },
  { category: 'Escotillas', description: 'ESCOTILLA', quantity: 1, unitValue: 1500000, origin: '' },
  { category: 'Escaleras', description: 'ESCALERA 11 METROS', quantity: 11, unitValue: 1200000, origin: '' },
  { category: 'Estructuras Metálicas', description: 'PÉRGOLA', quantity: 1, unitValue: 2500000, origin: '' },
]

const createItem = (template = itemTemplates[0]) => ({
  id: crypto.randomUUID ? crypto.randomUUID() : String(Math.random()),
  category: template.category,
  description: template.description,
  quantity: template.quantity,
  unitValue: template.unitValue,
  origin: template.origin || '',
  note: '',
})

const defaultQuote = {
  quoteNo: 'P-34154',
  issueDate: '2026-04-05',
  validDays: 30,
  cityLine: 'Envigado',
  client: 'SERGIO ZAPATA',
  work: 'BYCSA',
  phone: '3113372396',
  location: 'BARBOSA - ANTIOQUIA',
  googleMapsUrl: 'https://maps.google.com/?q=Barbosa+Antioquia',
  mapImageUrl: 'https://maps.googleapis.com/maps/api/staticmap?center=Barbosa,Antioquia&zoom=18&size=800x380&maptype=satellite',
  mapNote: 'Vista satelital de cubierta con trazos de líneas de vida y recorridos principales.',
  paymentTerms: '50% anticipo, 50% concluir labores',
  executionTime: '10 días (4 en fabricación, 6 días en instalación)',
  certification: 'Se entrega con el pago total',
  utilityPercent: 10,
  ivaPercent: 19,
  administration: 0,
  unforeseen: 0,
}

const employeesSeed = [
  ['EMP-001', 'Juan David Ríos', 'Coordinador SST', 'Constructora Alfa S.A.S', 3200000, 200000, '430000112', 'Ahorros'],
  ['EMP-002', 'Carlos Andrés Gómez', 'Técnico Anclajes', 'Constructora Alfa S.A.S', 2400000, 200000, '430000113', 'Ahorros'],
  ['EMP-003', 'Luis Fernando Mejía', 'Técnico Líneas de Vida', 'Constructora Alfa S.A.S', 2500000, 200000, '430000114', 'Ahorros'],
  ['EMP-004', 'Jhon Fredy Ocampo', 'Soldador', 'Parque Industrial Mamonal', 2600000, 200000, '430000115', 'Ahorros'],
  ['EMP-005', 'Andrés Felipe Ruiz', 'Armador Metálico', 'Parque Industrial Mamonal', 2300000, 200000, '430000116', 'Ahorros'],
  ['EMP-006', 'Miguel Ángel Peña', 'Supervisor de Obra', 'Hotel Caribe Hilton', 3400000, 200000, '430000117', 'Ahorros'],
  ['EMP-007', 'Sebastián Londoño', 'Instalador Alturas', 'Hotel Caribe Hilton', 2350000, 200000, '430000118', 'Ahorros'],
  ['EMP-008', 'Kevin Alejandro Soto', 'Instalador Alturas', 'Cemex Colombia S.A.', 2350000, 200000, '430000119', 'Ahorros'],
  ['EMP-009', 'Diana Marcela Torres', 'Aux. Administrativa', 'Administración', 2100000, 162000, '430000120', 'Ahorros'],
  ['EMP-010', 'Paula Andrea Sepúlveda', 'Directora Comercial', 'Administración', 4200000, 0, '430000121', 'Ahorros'],
  ['EMP-011', 'Camila López', 'Asesora Comercial', 'Administración', 2600000, 162000, '430000122', 'Ahorros'],
  ['EMP-012', 'Santiago Ramírez', 'Conductor / Logística', 'Cemex Colombia S.A.', 2200000, 200000, '430000123', 'Ahorros'],
].map(([id, name, role, work, basic, allowance, account, accountType]) => ({
  id, name, role, work, basic, allowance, account, accountType, bonus: 120000, deductions: 85000, bank: 'Bancolombia',
}))

const weeklySchedules = [
  { employee: 'Juan David Ríos', work: 'Torre Alfa Cartagena', mon: '07:00-17:00', tue: '07:00-17:00', wed: '07:00-17:00', thu: '07:00-17:00', fri: '07:00-17:00', sat: '07:00-12:00' },
  { employee: 'Carlos Andrés Gómez', work: 'Torre Alfa Cartagena', mon: '07:00-17:00', tue: '07:00-17:00', wed: '07:00-17:00', thu: '07:00-17:00', fri: '07:00-17:00', sat: '07:00-12:00' },
  { employee: 'Luis Fernando Mejía', work: 'Torre Alfa Cartagena', mon: '07:00-17:00', tue: '07:00-17:00', wed: '07:00-17:00', thu: '07:00-17:00', fri: '07:00-17:00', sat: 'Descanso' },
  { employee: 'Jhon Fredy Ocampo', work: 'Mantenimiento Fachada Sur', mon: '08:00-18:00', tue: '08:00-18:00', wed: '08:00-18:00', thu: '08:00-18:00', fri: '08:00-18:00', sat: '08:00-13:00' },
  { employee: 'Andrés Felipe Ruiz', work: 'Mantenimiento Fachada Sur', mon: '08:00-18:00', tue: '08:00-18:00', wed: '08:00-18:00', thu: '08:00-18:00', fri: '08:00-18:00', sat: '08:00-13:00' },
  { employee: 'Miguel Ángel Peña', work: 'Hotel Caribe Hilton', mon: '07:00-16:00', tue: '07:00-16:00', wed: '07:00-16:00', thu: '07:00-16:00', fri: '07:00-16:00', sat: 'Descanso' },
  { employee: 'Sebastián Londoño', work: 'Hotel Caribe Hilton', mon: '07:00-16:00', tue: '07:00-16:00', wed: '07:00-16:00', thu: '07:00-16:00', fri: '07:00-16:00', sat: '07:00-12:00' },
  { employee: 'Kevin Alejandro Soto', work: 'Cemex Colombia S.A.', mon: '06:00-15:00', tue: '06:00-15:00', wed: '06:00-15:00', thu: '06:00-15:00', fri: '06:00-15:00', sat: '06:00-11:00' },
  { employee: 'Diana Marcela Torres', work: 'Administración', mon: '08:00-17:00', tue: '08:00-17:00', wed: '08:00-17:00', thu: '08:00-17:00', fri: '08:00-17:00', sat: 'Descanso' },
  { employee: 'Paula Andrea Sepúlveda', work: 'Administración', mon: '08:00-17:00', tue: '08:00-17:00', wed: '08:00-17:00', thu: '08:00-17:00', fri: '08:00-17:00', sat: 'Descanso' },
  { employee: 'Camila López', work: 'Administración', mon: '08:00-17:00', tue: '08:00-17:00', wed: '08:00-17:00', thu: '08:00-17:00', fri: '08:00-17:00', sat: 'Descanso' },
  { employee: 'Santiago Ramírez', work: 'Cemex Colombia S.A.', mon: '06:00-16:00', tue: '06:00-16:00', wed: '06:00-16:00', thu: '06:00-16:00', fri: '06:00-16:00', sat: '06:00-12:00' },
]

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function slug(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
}

function Sidebar({ current, onChange }) {
  const items = [
    ['dashboard', 'Dashboard', Home],
    ['quote', 'Nueva Cotización', ReceiptText],
    ['plans', 'Planos & Obra', Map],
    ['payments', 'Pagos Bancolombia', Landmark],
    ['works', 'Mis Obras', HardHat],
    ['payroll', 'Nómina', Users],
    ['schedule', 'Horarios', CalendarDays],
  ]
  return (
    <aside className="sidebar">
      <div className="brand-card">
        <div className="brand-icon"><ShieldCheck size={26} /></div>
        <div><h1>INGEANCLAJES</h1><p>Sistema v2.0</p></div>
      </div>
      <nav className="menu">
        {items.map(([key, label, Icon]) => (
          <button key={key} className={`menu-item ${current === key ? 'active' : ''}`} onClick={() => onChange(key)}>
            <Icon size={22} /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="profile-card">
        <div className="profile-badge">PS</div>
        <div><strong>Paula Sepúlveda</strong><p>Directora Comercial</p></div>
      </div>
    </aside>
  )
}

function PageHeader({ title, subtitle }) {
  return <header className="page-header"><h2>{title}</h2><p>{subtitle}</p></header>
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>
}

function DashboardPage({ works, employees, plans }) {
  const totalRevenue = works.reduce((s, w) => s + w.total, 0)
  const totalCollected = works.reduce((s, w) => s + w.collected, 0)
  const totalPending = totalRevenue - totalCollected
  const totalPayroll = employees.reduce((s, e) => s + e.basic + e.allowance + e.bonus - e.deductions, 0)
  const cards = [
    ['Ingresos proyectados', currency(totalRevenue)],
    ['Cobrado', currency(totalCollected)],
    ['Pendiente por cobrar', currency(totalPending)],
    ['Nómina del periodo', currency(totalPayroll)],
  ]
  return (
    <div className="page-shell">
      <PageHeader title="Dashboard" subtitle="Resumen ejecutivo de cotizaciones, obras, nómina y pagos." />
      <div className="stats-grid">
        {cards.map(([label, value]) => <div className="metric-card" key={label}><p>{label}</p><strong>{value}</strong></div>)}
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-title-row"><h3>Estado rápido de obras</h3></div>
          {works.map((work) => <div key={work.id} className="work-list-row"><div><small>{work.id}</small><h4>{work.client}</h4><p>{work.work}</p></div><div className="work-mini-meta"><span>{work.status}</span><strong>{currency(work.total - work.collected)}</strong></div></div>)}
        </section>
        <section className="panel">
          <div className="panel-title-row"><h3>Planos cargados</h3></div>
          {plans.map((plan) => <div key={plan.id} className="plan-list-row"><div><small>{plan.id}</small><h4>{plan.client}</h4><p>{plan.blueprintName}</p></div><a href={plan.googleMapsUrl} target="_blank" rel="noreferrer" className="text-link">Maps</a></div>)}
        </section>
      </div>
    </div>
  )
}

function QuotePage({ quote, setQuote }) {
  const [step, setStep] = useState(1)
  const [items, setItems] = useState([createItem(itemTemplates[0]), createItem(itemTemplates[1]), createItem(itemTemplates[2]), createItem(itemTemplates[6])])
  const [selectedTemplate, setSelectedTemplate] = useState(itemTemplates[0].description)

  const totals = useMemo(() => {
    const rows = items.map((item) => ({ ...item, subtotal: Number(item.quantity || 0) * Number(item.unitValue || 0) }))
    const subtotal = rows.reduce((sum, row) => sum + row.subtotal, 0)
    const utility = Math.round(((subtotal + Number(quote.administration || 0) + Number(quote.unforeseen || 0)) * Number(quote.utilityPercent || 0)) / 100)
    const iva = Math.round((utility * Number(quote.ivaPercent || 0)) / 100)
    const total = subtotal + Number(quote.administration || 0) + Number(quote.unforeseen || 0) + utility + iva
    return { rows, subtotal, utility, iva, total }
  }, [items, quote])

  const updateItem = (id, key, value) => setItems((prev) => prev.map((item) => item.id === id ? { ...item, [key]: key === 'quantity' || key === 'unitValue' ? Number(value) : value } : item))
  const addItem = () => {
    const template = itemTemplates.find((t) => t.description === selectedTemplate) || itemTemplates[0]
    setItems((prev) => [...prev, createItem(template)])
  }
  const removeItem = (id) => setItems((prev) => prev.filter((item) => item.id !== id))

  return (
    <div className="page-shell">
      <PageHeader title="Nueva Cotización" subtitle="Genera una cotización profesional para el cliente." />
      <div className="step-tabs">
        {[1, 2, 3].map((n) => <button key={n} className={`step-tab ${step === n ? 'active' : ''}`} onClick={() => setStep(n)}>{n}. {n === 1 ? 'Datos & Ítems' : n === 2 ? 'Condiciones' : 'Vista Previa'}</button>)}
      </div>
      {step === 1 && <>
        <section className="panel">
          <h3 className="section-label">IDENTIFICACIÓN DE LA COTIZACIÓN</h3>
          <div className="form-grid three">
            <Field label="Número de cotización"><input value={quote.quoteNo} onChange={(e) => setQuote({ ...quote, quoteNo: e.target.value })} /></Field>
            <Field label="Fecha de emisión"><input type="date" value={quote.issueDate} onChange={(e) => setQuote({ ...quote, issueDate: e.target.value })} /></Field>
            <Field label="Válida (días)"><input type="number" value={quote.validDays} onChange={(e) => setQuote({ ...quote, validDays: Number(e.target.value) })} /></Field>
            <Field label="Señor / Cliente"><input value={quote.client} onChange={(e) => setQuote({ ...quote, client: e.target.value })} /></Field>
            <Field label="Obra"><input value={quote.work} onChange={(e) => setQuote({ ...quote, work: e.target.value })} /></Field>
            <Field label="Teléfono"><input value={quote.phone} onChange={(e) => setQuote({ ...quote, phone: e.target.value })} /></Field>
            <Field label="Ubicación"><input value={quote.location} onChange={(e) => setQuote({ ...quote, location: e.target.value })} /></Field>
            <Field label="Google Maps URL"><input value={quote.googleMapsUrl} onChange={(e) => setQuote({ ...quote, googleMapsUrl: e.target.value })} /></Field>
            <Field label="Imagen mapa / satélite"><input value={quote.mapImageUrl} onChange={(e) => setQuote({ ...quote, mapImageUrl: e.target.value })} /></Field>
          </div>
          <Field label="Nota del mapa"><textarea rows="3" value={quote.mapNote} onChange={(e) => setQuote({ ...quote, mapNote: e.target.value })} /></Field>
        </section>
        <section className="panel">
          <div className="panel-title-row"><h3>Ítems de cotización</h3><button className="secondary-btn" onClick={addItem}><Plus size={14} /> Agregar ítem</button></div>
          <div className="template-toolbar"><label>Plantilla rápida</label><select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>{itemTemplates.map((t) => <option key={t.description} value={t.description}>{t.category} · {t.description}</option>)}</select></div>
          <div className="quote-items-list">
            {items.map((item) => <div className="item-card" key={item.id}>
              <div className="item-head"><strong>{item.description}</strong><button className="icon-pill" onClick={() => removeItem(item.id)}>Quitar</button></div>
              <div className="form-grid four">
                <Field label="Categoría"><input value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)} /></Field>
                <Field label="Origen"><input value={item.origin} onChange={(e) => updateItem(item.id, 'origin', e.target.value)} /></Field>
                <Field label="Cantidad"><input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} /></Field>
                <Field label="Valor unitario"><input type="number" value={item.unitValue} onChange={(e) => updateItem(item.id, 'unitValue', e.target.value)} /></Field>
              </div>
              <Field label="Descripción"><input value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} /></Field>
              <Field label="Observación"><input value={item.note} onChange={(e) => updateItem(item.id, 'note', e.target.value)} /></Field>
            </div>)}
          </div>
        </section>
      </>}
      {step === 2 && <section className="panel"><div className="panel-title-row"><h3>Condiciones y cálculo</h3></div><div className="form-grid two">
        <Field label="Forma de pago"><input value={quote.paymentTerms} onChange={(e) => setQuote({ ...quote, paymentTerms: e.target.value })} /></Field>
        <Field label="Tiempo de ejecución"><input value={quote.executionTime} onChange={(e) => setQuote({ ...quote, executionTime: e.target.value })} /></Field>
        <Field label="Certificación"><input value={quote.certification} onChange={(e) => setQuote({ ...quote, certification: e.target.value })} /></Field>
        <Field label="Administración"><input type="number" value={quote.administration} onChange={(e) => setQuote({ ...quote, administration: Number(e.target.value) })} /></Field>
        <Field label="Imprevistos"><input type="number" value={quote.unforeseen} onChange={(e) => setQuote({ ...quote, unforeseen: Number(e.target.value) })} /></Field>
        <Field label="Utilidad %"><input type="number" value={quote.utilityPercent} onChange={(e) => setQuote({ ...quote, utilityPercent: Number(e.target.value) })} /></Field>
        <Field label="IVA % utilidades"><input type="number" value={quote.ivaPercent} onChange={(e) => setQuote({ ...quote, ivaPercent: Number(e.target.value) })} /></Field>
      </div></section>}
      {step === 3 && <section className="panel preview-quote-panel"><div className="preview-page">
        <div className="preview-brand"><div className="brand-mark" /><div><strong>INGEANCLAJES</strong><p>ESPECIALISTAS EN ANCLAJES</p></div></div>
        <div className="preview-top-grid"><span>{quote.cityLine}, {quote.issueDate}</span><span><strong>COTIZACIÓN No.</strong> {quote.quoteNo}</span></div>
        <div className="preview-info"><p><strong>SEÑOR:</strong> {quote.client}</p><p><strong>OBRA:</strong> {quote.work}</p><p><strong>TELÉFONO:</strong> {quote.phone}</p><p>{quote.location}</p></div>
        {quote.mapImageUrl ? <div className="quote-map-block"><div className="quote-map-title">Vista satelital / Google Maps</div><img src={quote.mapImageUrl} alt="Mapa de obra" className="quote-map-image" /><p className="quote-map-note">{quote.mapNote}</p></div> : null}
        <table className="proposal-table"><thead><tr><th>DESCRIPCIÓN</th><th>CANTIDAD</th><th>VALOR</th><th>SUBTOTAL</th></tr></thead><tbody>
          {totals.rows.map((row) => <tr key={row.id}><td>{row.description}{row.origin ? ` (${row.origin})` : ''}{row.note ? ` - ${row.note}` : ''}</td><td>{row.quantity}</td><td>{currency(row.unitValue)}</td><td>{currency(row.subtotal)}</td></tr>)}
          <tr className="summary-row"><td>SUBTOTAL</td><td></td><td></td><td>{currency(totals.subtotal)}</td></tr>
          <tr className="summary-row"><td>ADMINISTRACIÓN</td><td></td><td></td><td>{quote.administration ? currency(quote.administration) : '$  - -'}</td></tr>
          <tr className="summary-row"><td>IMPREVISTOS</td><td></td><td></td><td>{quote.unforeseen ? currency(quote.unforeseen) : '$  - -'}</td></tr>
          <tr className="summary-row"><td>UTILIDADES</td><td></td><td></td><td>{currency(totals.utility)}</td></tr>
          <tr className="summary-row"><td>IVA</td><td></td><td></td><td>{currency(totals.iva)}</td></tr>
          <tr className="total-row"><td>TOTAL</td><td></td><td></td><td>{currency(totals.total)}</td></tr>
        </tbody></table>
        <div className="conditions"><h4>CONDICIONES COMERCIALES</h4><div className="condition-row"><strong>FORMA DE PAGO</strong><span>: {quote.paymentTerms}</span></div><div className="condition-row"><strong>TIEMPO DE EJECUCIÓN</strong><span>: {quote.executionTime}</span></div><div className="condition-row"><strong>CERTIFICACIÓN</strong><span>: {quote.certification}</span></div></div>
      </div></section>}
    </div>
  )
}

function PlansPage({ plans, onUpdatePlan }) {
  const [selectedId, setSelectedId] = useState(plans[0]?.id || '')
  const plan = plans.find((p) => p.id === selectedId) || plans[0]
  const selectedPoint = plan.points[0]
  const totalPlan = plan.points.reduce((s, p) => s + p.cost, 0)
  const certified = plan.points.filter((p) => p.status === 'certificado').length
  const pending = plan.points.filter((p) => p.status === 'pendiente').length
  const totalLifeLineMl = plan.traces.reduce((sum, t) => sum + Math.hypot(t.to[0] - t.from[0], t.to[1] - t.from[1]), 0)

  return (
    <div className="page-shell">
      <PageHeader title="Planos & Obra" subtitle="Visualiza y gestiona los puntos de intervención sobre el plano, con cliente, ubicación de Google Maps y trazos de líneas de vida." />
      <div className="panel two-col-plans">
        <div>
          <div className="panel-title-row"><h3>{plan.blueprintName}</h3><div className="status-inline"><span><span className="dot green"></span> Certificado</span><span><span className="dot orange"></span> Pendiente</span></div></div>
          <div className="plan-selector">{plans.map((p) => <button key={p.id} className={`plan-chip ${p.id === selectedId ? 'active' : ''}`} onClick={() => setSelectedId(p.id)}>{p.client}</button>)}</div>
          <div className="blueprint-shell">
            <svg viewBox="0 0 100 100" className="blueprint-svg">
              <rect x="8" y="8" width="78" height="72" rx="1.2" className="bp-outline" />
              <line x1="8" y1="28" x2="86" y2="28" className="bp-grid" />
              <line x1="8" y1="56" x2="86" y2="56" className="bp-grid" />
              <line x1="40" y1="8" x2="40" y2="80" className="bp-grid" />
              {plan.traces.map((trace, index) => <line key={index} x1={trace.from[0]} y1={trace.from[1]} x2={trace.to[0]} y2={trace.to[1]} className="bp-trace" />)}
              {plan.points.map((point) => <g key={point.id}><circle cx={point.x} cy={point.y} r="2.4" className={`bp-point ${point.status}`} /><circle cx={point.x} cy={point.y} r="4" className={`bp-point-ring ${point.status}`} /></g>)}
              <text x="18" y="38" className="bp-label">Oficina A</text>
              <text x="57" y="38" className="bp-label">Oficina B</text>
              <text x="16" y="70" className="bp-label">Sala Común</text>
              <text x="56" y="70" className="bp-label">Sala Conf.</text>
            </svg>
          </div>
          <div className="mini-stats">
            <div className="mini-card"><strong>{plan.points.length}</strong><span>Total anclajes</span></div>
            <div className="mini-card"><strong className="green-text">{certified}</strong><span>Certificados</span></div>
            <div className="mini-card"><strong className="orange-text">{pending}</strong><span>Pendientes</span></div>
            <div className="mini-card"><strong className="violet-text">{Math.round(totalLifeLineMl)}</strong><span>LV Horizontal (ml)</span></div>
          </div>
        </div>
        <div className="side-stack">
          <section className="side-card">
            <h4>Detalle del Plano</h4>
            <p><strong>Cliente:</strong> {plan.client}</p>
            <p><strong>Obra:</strong> {plan.work}</p>
            <p><strong>Dirección:</strong> {plan.address}</p>
            <Field label="Google Maps URL"><input value={plan.googleMapsUrl} onChange={(e) => onUpdatePlan(plan.id, { googleMapsUrl: e.target.value })} /></Field>
            <Field label="Imagen Maps / satélite"><input value={plan.mapImageUrl} onChange={(e) => onUpdatePlan(plan.id, { mapImageUrl: e.target.value })} /></Field>
            <a className="text-link" href={plan.googleMapsUrl} target="_blank" rel="noreferrer">Abrir Google Maps</a>
          </section>
          <section className="side-card">
            <h4>Detalle del Punto</h4>
            <p><strong>{selectedPoint.id}</strong></p>
            <p>{selectedPoint.detail}</p>
            <p><strong>Estado:</strong> {selectedPoint.status}</p>
            <p><strong>Costo:</strong> {currency(selectedPoint.cost)}</p>
          </section>
          <section className="side-card">
            <h4>Costo Estimado</h4>
            {plan.points.slice(0, 3).map((p) => <div key={p.id} className="cost-line"><span>{p.detail}</span><strong>{currency(p.cost)}</strong></div>)}
            <div className="cost-total"><span>Total plano</span><strong>{currency(totalPlan)}</strong></div>
          </section>
        </div>
      </div>
    </div>
  )
}

function PaymentsPage({ works }) {
  const rows = works.map((work) => ({ ...work, due: work.total - work.collected, margin: work.total - work.cost }))
  const exportWorkCsv = (work) => {
    downloadCsv(`bancolombia-plan-${work.id}.csv`, [['Cliente','Obra','Estado','Total','Cobrado','Pendiente','Costo','Margen'], [work.client,work.work,work.status,work.total,work.collected,work.total-work.collected,work.cost,work.total-work.cost]])
  }
  return (
    <div className="page-shell">
      <PageHeader title="Pagos Bancolombia" subtitle="Controla costos y pagos por cliente y por obra, y genera un plano de pago exportable." />
      <section className="panel">
        <div className="panel-title-row"><h3>Pagos por cliente y obra</h3><button className="secondary-btn" onClick={() => downloadCsv('pagos-clientes-bancolombia.csv', [['ID','Cliente','Obra','Estado','Total','Cobrado','Pendiente','Costo','Margen'], ...rows.map((r)=>[r.id,r.client,r.work,r.status,r.total,r.collected,r.due,r.cost,r.margin])])}><FileSpreadsheet size={14} /> Exportar general</button></div>
        <div className="table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Cliente</th><th>Obra</th><th>Estado</th><th>Total</th><th>Costo</th><th>Cobrado</th><th>Pendiente</th><th>Margen</th><th>Plano Bancolombia</th></tr></thead><tbody>
          {rows.map((work) => <tr key={work.id}><td>{work.id}</td><td>{work.client}</td><td>{work.work}</td><td><span className={`status-badge ${slug(work.status)}`}>{work.status}</span></td><td>{currency(work.total)}</td><td>{currency(work.cost)}</td><td className="green-text">{currency(work.collected)}</td><td className="orange-text">{currency(work.due)}</td><td>{currency(work.margin)}</td><td><button className="table-action" onClick={() => exportWorkCsv(work)}>Generar CSV</button></td></tr>)}
        </tbody></table></div>
      </section>
    </div>
  )
}

function WorksPage({ works }) {
  return (
    <div className="page-shell">
      <PageHeader title="Mis Obras" subtitle="Seguimiento de ejecuciones, planos y saldo pendiente por obra." />
      <div className="works-grid">
        {works.map((work) => {
          const due = work.total - work.collected
          return <div className="work-card" key={work.id}>
            <div className="work-card-top"><div><small>{work.id}</small><h3>{work.client}</h3><p>{work.work}</p></div><span className={`status-badge ${slug(work.status)}`}>{work.status}</span></div>
            <div className="progress-row"><span>Avance de obra</span><span>{work.progress}%</span></div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${work.progress}%` }} /></div>
            <div className="money-grid">
              <div className="money-card"><span>Total obra</span><strong>{currency(work.total)}</strong></div>
              <div className="money-card"><span>Cobrado</span><strong className="green-text">{currency(work.collected)}</strong></div>
              <div className="money-card"><span>Debe cliente</span><strong className="orange-text">{currency(due)}</strong></div>
            </div>
            <div className="actions-row"><button className="outline-btn">Ver Plano</button><button className="outline-btn accent">Cobrar</button></div>
          </div>
        })}
      </div>
    </div>
  )
}

function PayrollPage({ employees }) {
  const rows = employees.map((e) => ({ ...e, net: e.basic + e.allowance + e.bonus - e.deductions }))
  const totalPayroll = rows.reduce((sum, row) => sum + row.net, 0)
  const exportPayrollCsv = () => downloadCsv('nomina-bancolombia.csv', [['Empleado','Banco','Tipo','Cuenta','Obra','Valor Neto'], ...rows.map((r) => [r.name, r.bank, r.accountType, r.account, r.work, r.net])])
  return (
    <div className="page-shell">
      <PageHeader title="Nómina" subtitle="Gestiona empleados y genera un plano de pago Bancolombia. Incluye ejemplo con 12 empleados." />
      <section className="panel">
        <div className="panel-title-row"><h3>Plan de nómina</h3><button className="secondary-btn" onClick={exportPayrollCsv}><CreditCard size={14} /> Generar plano Bancolombia</button></div>
        <div className="stats-grid compact"><div className="metric-card"><p>Empleados</p><strong>{rows.length}</strong></div><div className="metric-card"><p>Total nómina</p><strong>{currency(totalPayroll)}</strong></div></div>
        <div className="table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Empleado</th><th>Cargo</th><th>Obra</th><th>Básico</th><th>Auxilio</th><th>Bono</th><th>Deducciones</th><th>Neto</th><th>Banco</th><th>Cuenta</th></tr></thead><tbody>
          {rows.map((employee) => <tr key={employee.id}><td>{employee.id}</td><td>{employee.name}</td><td>{employee.role}</td><td>{employee.work}</td><td>{currency(employee.basic)}</td><td>{currency(employee.allowance)}</td><td>{currency(employee.bonus)}</td><td>{currency(employee.deductions)}</td><td className="green-text">{currency(employee.net)}</td><td>{employee.bank}</td><td>{employee.account}</td></tr>)}
        </tbody></table></div>
      </section>
    </div>
  )
}

function SchedulePage({ schedules }) {
  return (
    <div className="page-shell">
      <PageHeader title="Horarios por obra y empleado" subtitle="Planeación semanal operativa por obra y por colaborador." />
      <section className="panel">
        <div className="panel-title-row"><h3>Ejemplo con 12 empleados</h3></div>
        <div className="table-wrap"><table className="admin-table"><thead><tr><th>Empleado</th><th>Obra</th><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th></tr></thead><tbody>
          {schedules.map((row) => <tr key={row.employee}><td>{row.employee}</td><td>{row.work}</td><td>{row.mon}</td><td>{row.tue}</td><td>{row.wed}</td><td>{row.thu}</td><td>{row.fri}</td><td>{row.sat}</td></tr>)}
        </tbody></table></div>
      </section>
    </div>
  )
}

export default function App() {
  const [current, setCurrent] = useState('quote')
  const [quote, setQuote] = useState(defaultQuote)
  const [plans, setPlans] = useState(clientPlansSeed)
  const updatePlan = (id, patch) => setPlans((prev) => prev.map((plan) => plan.id === id ? { ...plan, ...patch } : plan))

  return (
    <div className="app">
      <Sidebar current={current} onChange={setCurrent} />
      <main className="content">
        {current === 'dashboard' && <DashboardPage works={worksSeed} employees={employeesSeed} plans={plans} />}
        {current === 'quote' && <QuotePage quote={quote} setQuote={setQuote} />}
        {current === 'plans' && <PlansPage plans={plans} onUpdatePlan={updatePlan} />}
        {current === 'payments' && <PaymentsPage works={worksSeed} />}
        {current === 'works' && <WorksPage works={worksSeed} />}
        {current === 'payroll' && <PayrollPage employees={employeesSeed} />}
        {current === 'schedule' && <SchedulePage schedules={weeklySchedules} />}
      </main>
    </div>
  )
}
