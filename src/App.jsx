import { useMemo, useState } from 'react'
import {
  Plus,
  Trash2,
  Printer,
  FileText,
  Shield,
  Building2,
  Phone,
  MapPin,
  ClipboardList,
  BadgeDollarSign,
} from 'lucide-react'

const serviceTemplates = [
  { category: 'Línea de vida', description: 'LINEA DE VIDA 1 21 ML', quantity: 21, unitValue: 280000, origin: '', note: '' },
  { category: 'Línea de vida', description: 'LINEA DE VIDA 2 27 ML', quantity: 27, unitValue: 280000, origin: '', note: '' },
  { category: 'Línea de vida', description: 'LINEA DE VIDA CONEXIÓN 26 ML', quantity: 26, unitValue: 280000, origin: '', note: '' },
  { category: 'Línea de vida', description: 'LÍNEA DE VIDA HORIZONTAL', quantity: 1, unitValue: 280000, origin: '', note: '' },
  { category: 'Línea de vida', description: 'LÍNEA DE VIDA VERTICAL', quantity: 1, unitValue: 280000, origin: '', note: '' },
  { category: 'Puntos de anclaje', description: 'PUNTO DE ANCLAJE NACIONAL', quantity: 1, unitValue: 180000, origin: 'Nacional', note: '' },
  { category: 'Puntos de anclaje', description: 'PUNTO DE ANCLAJE IMPORTADO', quantity: 1, unitValue: 260000, origin: 'Importado', note: '' },
  { category: 'Escotillas', description: 'ESCOTILLA', quantity: 1, unitValue: 1500000, origin: '', note: '' },
  { category: 'Escaleras', description: 'ESCALERA 11 METROS', quantity: 11, unitValue: 1200000, origin: '', note: '' },
  { category: 'Estructuras Metálicas', description: 'PÉRGOLA', quantity: 1, unitValue: 2500000, origin: '', note: '' },
  { category: 'Estructuras Metálicas', description: 'ESTRUCTURA METÁLICA', quantity: 1, unitValue: 2200000, origin: '', note: '' },
]

const technicalRowsDefault = [
  {
    element: 'Soporte lateral e intermedio',
    characteristic:
      'Este elemento está diseñado para ser usado en sistemas de líneas de vida horizontales de tipo continuo. El componente soporta regularmente el cable de acero para que una sección libre de cable no supere la luz máxima permitida. Este soporte intermedio permite el uso de un carro deslizador para evitar el uso de eslinga en Y por parte del trabajador y evitar que el colaborador se desconecte.',
  },
  {
    element: 'Tensor',
    characteristic:
      'Este elemento está diseñado para ser usado en sistemas de líneas de vida horizontales. En sus extremos el tensor se asegura al cable de la línea de vida y a un absorbedor de energía respectivamente. Su función es tensionar la línea de vida para que, en el momento de una caída, la distancia de caída del trabajador sea mínima.',
  },
  {
    element: 'Empalme aluminio',
    characteristic:
      'Fabricados en aluminio. Resistentes a la corrosión y oxidación. Se utilizan para empalmar dos cables y fijar barandillas de cables.',
  },
  {
    element: 'Guardacabo',
    characteristic:
      'Fabricado en acero con acabado galvanizado resistente a la corrosión. Protege contra el desgaste y deformación del cable, alargando su vida útil.',
  },
  {
    element: 'Cable de acero',
    characteristic:
      'El cable de acero se fabrica bajo un diseño que permite que sea capaz de absorber el desgaste y los esfuerzos causados por el contacto con poleas, tambores y otras superficies, así como las tensiones estáticas y dinámicas del trabajo al que se someta. Además, su diseño ha sido ideado para que cada alambre tenga libertad de movimiento frente a los adyacentes.',
  },
]

const initialForm = {
  cityLine: 'Envigado',
  dateLine: '10 de marzo de 2026',
  quotationNo: 'P-34153',
  senor: 'SERGIO ZAPATA',
  obra: 'BYCSA',
  telefono: '3113372396',
  ubicacion: 'BARBOSA - ANTIOQUIA',
  saludo: 'Cordial saludo',
  intro:
    'Presentamos la cotización para suministro e instalación de los sistemas de protección anti caída (líneas de vida horizontales sobre cubierta y escaleras).',
  trabajoAltura:
    'Trabajo en altura: Se considera toda actividad, labor o trabajo que se deba realizar a una altura física igual o superior a 1,50 metros medios desde el piso.',
  puntosAnclaje:
    'Puntos de anclaje: Son componentes en acero anclado con un epóxico químico marca PURE 110 de POWER FASTENERS o equivalente, con perno de 5/8 a una profundidad de 15 cm o más según el caso a estructuras en concreto, con capacidad de resistir una fuerza de caída de más de 5000 Lbs.',
  lineaVida:
    'Línea de vida: Son componentes de un sistema/equipo de protección de caídas, consistentes en una cuerda de nylon o cable de acero instalada en forma horizontal y vertical, tensionada y sujeta en tres o dos puntos de anclaje para otorgar movilidad al personal que trabaja en áreas elevadas.',
  lineBullet1:
    'La línea de vida permite la fijación o enganche en forma directa o indirecta al arnés completo para el cuerpo o a un dispositivo de impacto o amortiguador.',
  lineBullet2: 'Las líneas de vida estarán constituidas por un solo cable continuo.',
  lineBullet3:
    'Los anclajes a los cuales se fijarán las líneas de vida deben resistir al menos 5.000 libras por cada persona asegurada.',
  alcance:
    'Tenemos el agrado de presentar nuestra cotización para la instalación de líneas de vida sobre cubierta: línea de vida horizontal de 27 metros, línea de vida horizontal de 21 metros, conexión de 26 metros y escalera de 11 metros (10 metros más gato).',
  proposalTitle: 'PROPUESTA ECONOMICA LINEA DE VIDA EN ACERO GALVANIZADO Y ESCALERA',
  administration: 0,
  unforeseen: 0,
  utilityPercent: 10,
  ivaPercent: 19,
  ivaNote: 'EL IVA ES EL 19 % DE LAS UTILIDADES',
  formaPago: '50% ANTICIPO, 50% CONCLUIR LABORES',
  tiempoEjecucion: '10 DIAS (4 EN FABRICACION, 6 DIAS EN INSTALACION)',
  validez: '30 DIAS A PARTIR DE LA FECHA DE ENTREGA DE ESTA COTIZACIÓN',
  certificacion: 'SE ENTREGA CON EL PAGO TOTAL',
  technicalTitle: 'SISTEMA NO CONTINUO EN ACERO GALVANIZADO',
  escaleraNorma: 'Cumple con la Resolución 4272 del ministerio de trabajo de Colombia y EN 795: 2012',
  escaleraDescripcion:
    'Escalera fabricada en tubería redonda de diámetro de 2” y peldaños en tubería redonda de 1 ½”. Estos peldaños se instalan cada 30 cm y con un ancho de 40 cm de acuerdo a la norma existente. Acero estructural 1040.',
  escaleraSuperior: 'Soporte superior con absorbedor de energía',
  escaleraCable: 'Cable de acero con alma de acero; SAE 316',
  escaleraInferior: 'Soporte inferior y tensor de línea de vida',
  incluyeItems: [
    'Tuercas y arandelas en acero galvanizado y/o inoxidable certificado.',
    'Los elementos utilizados en la instalación son certificados de fábrica los cuales se adjuntan en la entrega de documentación de certificados.',
    'Transporte de materiales y de personal hasta el sitio de trabajo.',
    'Se entregan todos los certificados de acuerdo a la resolución 4272 de trabajo seguro en alturas.',
    'Recertificación sin costo al año siguiente de la instalación.',
    'Esta propuesta incluye el coordinador para trabajo seguro en alturas de tiempo completo en la obra.',
  ],
  personalSeguridad:
    'Todo el personal que labora en la empresa, se encuentra afiliado a ARL, Salud, y Pensiones. Llevamos todos los elementos personales de seguridad necesarios para efectuar dicho trabajo. Realizamos todas las reparaciones de los daños que puedan surgir durante la ejecución de dicho trabajo y se entregan todas las pólizas exigidas por el contratante.',
  sgsst:
    'Nuestra empresa INGEANCLAJES S.A.S, se encuentra comprometida con el cumplimiento de las directrices generales para la aplicación de la resolución 4272 de 2021 garantizando la implementación del Sistema de Gestión de Seguridad y Salud en el Trabajo y teniendo coherencia con la estrategia organizacional de la empresa redundando en el mejoramiento de las condiciones de trabajo y calidad de vida de todas las personas al evitar y minimizar los accidentes de trabajo, enfermedades laborales y fomentar una cultura preventiva y del auto cuidado en los diferentes frentes de trabajo.',
  firmaNombre: 'PAULA ANDREA SEPULVEDA L',
  firmaCargo: 'DIRECTORA COMERCIAL',
  firmaTelefono: '3152889541',
}

function createItem(template = serviceTemplates[0]) {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
  return {
    id,
    category: template.category,
    description: template.description,
    quantity: template.quantity,
    unitValue: template.unitValue,
    origin: template.origin,
    note: template.note,
  }
}

const initialItems = [
  createItem(serviceTemplates[0]),
  createItem(serviceTemplates[1]),
  createItem(serviceTemplates[2]),
  createItem(serviceTemplates[8]),
]

function currency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function PageFoot() {
  return (
    <div className="page-foot">
      <div className="separator" />
      <p>Calle 38 sur # 36 – 48, Envigado PBX 448 26 86 Cel 3152889541</p>
      <p>Nit. 900193965-4. comercial1ingeanclajes@gmail.com</p>
      <p>www.ingeanclajes.com</p>
    </div>
  )
}

function Field({ label, children, icon }) {
  return (
    <label className="field">
      <span>{icon}{label}</span>
      {children}
    </label>
  )
}

export default function App() {
  const [form, setForm] = useState(initialForm)
  const [items, setItems] = useState(initialItems)
  const [technicalRows, setTechnicalRows] = useState(technicalRowsDefault)
  const [selectedTemplate, setSelectedTemplate] = useState(serviceTemplates[0].description)

  const totals = useMemo(() => {
    const rows = items.map((item) => ({
      ...item,
      subtotal: Number(item.quantity || 0) * Number(item.unitValue || 0),
    }))
    const subtotal = rows.reduce((sum, row) => sum + row.subtotal, 0)
    const administration = Number(form.administration || 0)
    const unforeseen = Number(form.unforeseen || 0)
    const utility = Math.round(((subtotal + administration + unforeseen) * Number(form.utilityPercent || 0)) / 100)
    const iva = Math.round((utility * Number(form.ivaPercent || 0)) / 100)
    const total = subtotal + administration + unforeseen + utility + iva
    return { rows, subtotal, administration, unforeseen, utility, iva, total }
  }, [items, form.administration, form.unforeseen, form.utilityPercent, form.ivaPercent])

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const updateItem = (id, key, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [key]: key === 'quantity' || key === 'unitValue' ? Number(value) : value }
          : item,
      ),
    )
  }

  const addItem = () => {
    const template = serviceTemplates.find((t) => t.description === selectedTemplate) || serviceTemplates[0]
    setItems((prev) => [...prev, createItem(template)])
  }

  const removeItem = (id) => setItems((prev) => prev.filter((item) => item.id !== id))

  const updateTechnicalRow = (index, key, value) => {
    setTechnicalRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)))
  }

  const addTechnicalRow = () => {
    setTechnicalRows((prev) => [...prev, { element: 'Nuevo elemento', characteristic: 'Nueva característica técnica.' }])
  }

  const removeTechnicalRow = (index) => setTechnicalRows((prev) => prev.filter((_, i) => i !== index))

  const updateIncludeItem = (index, value) => {
    setForm((prev) => ({
      ...prev,
      incluyeItems: prev.incluyeItems.map((item, i) => (i === index ? value : item)),
    }))
  }

  const addIncludeItem = () => {
    setForm((prev) => ({
      ...prev,
      incluyeItems: [...prev.incluyeItems, 'Nuevo ítem incluido.'],
    }))
  }

  const removeIncludeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      incluyeItems: prev.incluyeItems.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="app-shell">
      <aside className="editor-panel">
        <div className="editor-sticky">
          <div className="hero-editor">
            <div>
              <p className="eyebrow">Ingeanclajes · Premium</p>
              <h1>Cotización estilo PDF</h1>
              <p className="muted">Diseño premium, tabla más elegante, pie de página corregido y estructura fiel al formato comercial.</p>
            </div>
            <button className="primary-btn" onClick={() => window.print()}>
              <Printer size={16} />
              Imprimir / Exportar PDF
            </button>
          </div>

          <section className="editor-card">
            <div className="section-title">
              <FileText size={16} />
              <h2>Encabezado</h2>
            </div>
            <div className="grid two">
              <Field label="Ciudad">
                <input value={form.cityLine} onChange={(e) => updateForm('cityLine', e.target.value)} />
              </Field>
              <Field label="Fecha">
                <input value={form.dateLine} onChange={(e) => updateForm('dateLine', e.target.value)} />
              </Field>
              <Field label="Cotización No.">
                <input value={form.quotationNo} onChange={(e) => updateForm('quotationNo', e.target.value)} />
              </Field>
              <Field label="Señor">
                <input value={form.senor} onChange={(e) => updateForm('senor', e.target.value)} />
              </Field>
              <Field label="Obra">
                <input value={form.obra} onChange={(e) => updateForm('obra', e.target.value)} />
              </Field>
              <Field label="Teléfono">
                <input value={form.telefono} onChange={(e) => updateForm('telefono', e.target.value)} />
              </Field>
            </div>
            <Field label="Ciudad / ubicación">
              <input value={form.ubicacion} onChange={(e) => updateForm('ubicacion', e.target.value)} />
            </Field>
          </section>

          <section className="editor-card">
            <div className="section-title">
              <ClipboardList size={16} />
              <h2>Texto técnico</h2>
            </div>
            <Field label="Saludo"><input value={form.saludo} onChange={(e) => updateForm('saludo', e.target.value)} /></Field>
            <Field label="Introducción"><textarea rows="3" value={form.intro} onChange={(e) => updateForm('intro', e.target.value)} /></Field>
            <Field label="Trabajo en altura"><textarea rows="3" value={form.trabajoAltura} onChange={(e) => updateForm('trabajoAltura', e.target.value)} /></Field>
            <Field label="Puntos de anclaje"><textarea rows="4" value={form.puntosAnclaje} onChange={(e) => updateForm('puntosAnclaje', e.target.value)} /></Field>
            <Field label="Línea de vida"><textarea rows="4" value={form.lineaVida} onChange={(e) => updateForm('lineaVida', e.target.value)} /></Field>
            <Field label="Viñeta 1"><textarea rows="2" value={form.lineBullet1} onChange={(e) => updateForm('lineBullet1', e.target.value)} /></Field>
            <Field label="Viñeta 2"><textarea rows="2" value={form.lineBullet2} onChange={(e) => updateForm('lineBullet2', e.target.value)} /></Field>
            <Field label="Viñeta 3"><textarea rows="2" value={form.lineBullet3} onChange={(e) => updateForm('lineBullet3', e.target.value)} /></Field>
            <Field label="Alcance de la obra"><textarea rows="4" value={form.alcance} onChange={(e) => updateForm('alcance', e.target.value)} /></Field>
          </section>

          <section className="editor-card">
            <div className="section-title spread">
              <div className="section-title">
                <BadgeDollarSign size={16} />
                <h2>Ítems de propuesta</h2>
              </div>
              <button className="secondary-btn" onClick={addItem}>
                <Plus size={14} />
                Agregar ítem
              </button>
            </div>

            <div className="template-pick">
              <label>Plantilla rápida</label>
              <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
                {serviceTemplates.map((template) => (
                  <option key={template.description} value={template.description}>
                    {template.category} · {template.description}
                  </option>
                ))}
              </select>
            </div>

            {items.map((item) => (
              <div key={item.id} className="item-card">
                <div className="item-top">
                  <strong>{item.description}</strong>
                  <button className="icon-btn" onClick={() => removeItem(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid two">
                  <Field label="Categoría">
                    <input value={item.category} onChange={(e) => updateItem(item.id, 'category', e.target.value)} />
                  </Field>
                  <Field label="Origen">
                    <input value={item.origin} onChange={(e) => updateItem(item.id, 'origin', e.target.value)} placeholder="Nacional / Importado" />
                  </Field>
                </div>
                <Field label="Descripción">
                  <input value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
                </Field>
                <div className="grid two">
                  <Field label="Cantidad">
                    <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} />
                  </Field>
                  <Field label="Valor unitario">
                    <input type="number" value={item.unitValue} onChange={(e) => updateItem(item.id, 'unitValue', e.target.value)} />
                  </Field>
                </div>
                <Field label="Observación">
                  <input value={item.note} onChange={(e) => updateItem(item.id, 'note', e.target.value)} />
                </Field>
              </div>
            ))}
          </section>

          <section className="editor-card">
            <div className="section-title">
              <Building2 size={16} />
              <h2>Totales y condiciones</h2>
            </div>
            <div className="grid two">
              <Field label="Administración">
                <input type="number" value={form.administration} onChange={(e) => updateForm('administration', e.target.value)} />
              </Field>
              <Field label="Imprevistos">
                <input type="number" value={form.unforeseen} onChange={(e) => updateForm('unforeseen', e.target.value)} />
              </Field>
              <Field label="Utilidades %">
                <input type="number" value={form.utilityPercent} onChange={(e) => updateForm('utilityPercent', e.target.value)} />
              </Field>
              <Field label="IVA % sobre utilidades">
                <input type="number" value={form.ivaPercent} onChange={(e) => updateForm('ivaPercent', e.target.value)} />
              </Field>
            </div>
            <Field label="Nota IVA"><input value={form.ivaNote} onChange={(e) => updateForm('ivaNote', e.target.value)} /></Field>
            <Field label="Forma de pago"><input value={form.formaPago} onChange={(e) => updateForm('formaPago', e.target.value)} /></Field>
            <Field label="Tiempo de ejecución"><input value={form.tiempoEjecucion} onChange={(e) => updateForm('tiempoEjecucion', e.target.value)} /></Field>
            <Field label="Validez de la oferta"><input value={form.validez} onChange={(e) => updateForm('validez', e.target.value)} /></Field>
            <Field label="Certificación"><input value={form.certificacion} onChange={(e) => updateForm('certificacion', e.target.value)} /></Field>
          </section>

          <section className="editor-card">
            <div className="section-title spread">
              <div className="section-title">
                <Shield size={16} />
                <h2>Página técnica</h2>
              </div>
              <button className="secondary-btn" onClick={addTechnicalRow}>
                <Plus size={14} />
                Agregar fila
              </button>
            </div>
            <Field label="Título técnico"><input value={form.technicalTitle} onChange={(e) => updateForm('technicalTitle', e.target.value)} /></Field>
            {technicalRows.map((row, index) => (
              <div key={index} className="item-card">
                <div className="item-top">
                  <strong>Fila {index + 1}</strong>
                  <button className="icon-btn" onClick={() => removeTechnicalRow(index)}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <Field label="Elemento"><input value={row.element} onChange={(e) => updateTechnicalRow(index, 'element', e.target.value)} /></Field>
                <Field label="Característica"><textarea rows="4" value={row.characteristic} onChange={(e) => updateTechnicalRow(index, 'characteristic', e.target.value)} /></Field>
              </div>
            ))}
          </section>

          <section className="editor-card">
            <div className="section-title">
              <Phone size={16} />
              <h2>Página de escalera</h2>
            </div>
            <Field label="Normatividad"><textarea rows="3" value={form.escaleraNorma} onChange={(e) => updateForm('escaleraNorma', e.target.value)} /></Field>
            <Field label="Descripción escalera"><textarea rows="4" value={form.escaleraDescripcion} onChange={(e) => updateForm('escaleraDescripcion', e.target.value)} /></Field>
            <Field label="Texto superior"><input value={form.escaleraSuperior} onChange={(e) => updateForm('escaleraSuperior', e.target.value)} /></Field>
            <Field label="Texto cable"><input value={form.escaleraCable} onChange={(e) => updateForm('escaleraCable', e.target.value)} /></Field>
            <Field label="Texto inferior"><input value={form.escaleraInferior} onChange={(e) => updateForm('escaleraInferior', e.target.value)} /></Field>
          </section>

          <section className="editor-card">
            <div className="section-title spread">
              <div className="section-title">
                <MapPin size={16} />
                <h2>Cierre</h2>
              </div>
              <button className="secondary-btn" onClick={addIncludeItem}>
                <Plus size={14} />
                Agregar incluido
              </button>
            </div>
            {form.incluyeItems.map((item, index) => (
              <div key={index} className="include-row">
                <textarea rows="2" value={item} onChange={(e) => updateIncludeItem(index, e.target.value)} />
                <button className="icon-btn" onClick={() => removeIncludeItem(index)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <Field label="Texto personal y pólizas"><textarea rows="4" value={form.personalSeguridad} onChange={(e) => updateForm('personalSeguridad', e.target.value)} /></Field>
            <Field label="Texto SG-SST"><textarea rows="6" value={form.sgsst} onChange={(e) => updateForm('sgsst', e.target.value)} /></Field>
            <div className="grid two">
              <Field label="Nombre firma"><input value={form.firmaNombre} onChange={(e) => updateForm('firmaNombre', e.target.value)} /></Field>
              <Field label="Cargo"><input value={form.firmaCargo} onChange={(e) => updateForm('firmaCargo', e.target.value)} /></Field>
            </div>
            <Field label="Teléfono firma"><input value={form.firmaTelefono} onChange={(e) => updateForm('firmaTelefono', e.target.value)} /></Field>
          </section>
        </div>
      </aside>

      <main className="preview-panel">
        <div className="page">
          <div className="brand-lockup">
            <div className="brand-mark" />
            <div>
              <div className="brand-name">INGEANCLAJES</div>
              <div className="brand-sub">ESPECIALISTAS EN ANCLAJES</div>
            </div>
          </div>

          <div className="top-meta">
            <span>{form.cityLine}, {form.dateLine}</span>
            <span><strong>COTIZACION No.</strong> {form.quotationNo}</span>
          </div>

          <div className="key-block">
            <p><strong>SEÑOR:</strong></p>
            <p>{form.senor}</p>
            <p><strong>OBRA:</strong> {form.obra}</p>
            <p><strong>TELEFONO:</strong> {form.telefono}</p>
            <p>{form.ubicacion}</p>
          </div>

          <p>{form.saludo}</p>
          <p>{form.intro}</p>
          <p>{form.trabajoAltura}</p>
          <p>{form.puntosAnclaje}</p>
          <p>{form.lineaVida}</p>

          <ul className="pdf-list">
            <li>{form.lineBullet1}</li>
            <li>{form.lineBullet2}</li>
            <li>{form.lineBullet3}</li>
          </ul>

          <p>{form.alcance}</p>

          <div className="proposal-heading">{form.proposalTitle}</div>
          <table className="proposal-table">
            <thead>
              <tr>
                <th>DESCRIPCION</th>
                <th>CANTIDAD</th>
                <th>VALOR</th>
                <th>SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {totals.rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="item-desc">{row.description}</div>
                    {row.origin || row.note ? (
                      <div className="item-meta">
                        {row.origin ? <span className="tag">{row.origin}</span> : null}
                        {row.note ? <span className="soft-note">{row.note}</span> : null}
                      </div>
                    ) : null}
                  </td>
                  <td>{row.quantity}</td>
                  <td>{currency(row.unitValue)}</td>
                  <td>{currency(row.subtotal)}</td>
                </tr>
              ))}
              <tr className="summary-row">
                <td>SUBTOTAL</td><td></td><td></td><td>{currency(totals.subtotal)}</td>
              </tr>
              <tr className="summary-row">
                <td>ADMINISTRACION</td><td></td><td></td><td>{totals.administration ? currency(totals.administration) : '$  - -'}</td>
              </tr>
              <tr className="summary-row">
                <td>IMPREVISTOS</td><td></td><td></td><td>{totals.unforeseen ? currency(totals.unforeseen) : '$  - -'}</td>
              </tr>
              <tr className="summary-row">
                <td>UTILIDADES ({form.utilityPercent} % VALOR DE LA OBRA)</td><td></td><td></td><td>{currency(totals.utility)}</td>
              </tr>
              <tr className="summary-row">
                <td>IVA ({form.ivaPercent} % VALOR DE LAS UTILIDADES)</td><td></td><td></td><td>{currency(totals.iva)}</td>
              </tr>
              <tr className="total-row">
                <td>TOTAL</td><td></td><td></td><td>{currency(totals.total)}</td>
              </tr>
            </tbody>
          </table>

          <p className="iva-note">{form.ivaNote}</p>

          <div className="conditions">
            <h3>CONDICIONES COMERCIALES</h3>
            <div className="condition-row"><strong>FORMA DE PAGO</strong><span>: {form.formaPago}</span></div>
            <div className="condition-row"><strong>TIEMPO DE EJECUCIÓN</strong><span>: {form.tiempoEjecucion}</span></div>
            <div className="condition-row"><strong>VALIDEZ DE LA OFERTA</strong><span>: {form.validez}</span></div>
            <div className="condition-row"><strong>CERTIFICACIÓN</strong><span>: {form.certificacion}</span></div>
          </div>

          <PageFoot />
        </div>

        <div className="page">
          <div className="brand-centered">
            <div className="brand-mark" />
            <div className="brand-name">INGEANCLAJES</div>
          </div>
          <div className="brand-sub centered">ESPECIALISTAS EN ANCLAJES</div>

          <div className="technical-heading">{form.technicalTitle}</div>
          <table className="technical-table">
            <thead>
              <tr>
                <th>ELEMENTO</th>
                <th>CARACTERISTICA</th>
              </tr>
            </thead>
            <tbody>
              {technicalRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.element}</td>
                  <td>{row.characteristic}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <PageFoot />
        </div>

        <div className="page">
          <div className="brand-centered">
            <div className="brand-mark" />
            <div className="brand-name">INGEANCLAJES</div>
          </div>
          <div className="brand-sub centered">ESPECIALISTAS EN ANCLAJES</div>

          <div className="ladder-layout">
            <div className="ladder-copy">
              <div className="norma-badge">ARTICO SAFE-WORK</div>
              <h4>Normatividad:</h4>
              <p>{form.escaleraNorma}</p>
              <div className="info-box">{form.escaleraDescripcion}</div>
            </div>

            <div className="ladder-drawing">
              <div className="ladder-rail left" />
              <div className="ladder-rail right" />
              {[0, 1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="ladder-step" style={{ top: 120 + step * 72 }} />
              ))}
              <div className="ladder-cable" />
            </div>

            <div className="ladder-notes">
              <div className="callout">{form.escaleraSuperior}</div>
              <div className="callout">{form.escaleraCable}</div>
              <div className="callout bottom">{form.escaleraInferior}</div>
            </div>
          </div>

          <PageFoot />
        </div>

        <div className="page">
          <div className="brand-lockup compact">
            <div className="brand-mark" />
            <div>
              <div className="brand-name">INGEANCLAJES</div>
              <div className="brand-sub">ESPECIALISTAS EN ANCLAJES</div>
            </div>
          </div>

          <div className="closing-block">
            <h3>ESTA COTIZACIÓN INCLUYE:</h3>
            <ul className="pdf-list">
              {form.incluyeItems.map((item, index) => <li key={index}>{item}</li>)}
            </ul>

            <p>{form.personalSeguridad}</p>

            <h3>SISTEMA DE GESTION DE SEGURIDAD Y SALUD EN EL TRABAJO</h3>
            <p>{form.sgsst}</p>

            <div className="signature">
              <p>Cordialmente</p>
              <p><strong>{form.firmaNombre}</strong></p>
              <p>{form.firmaCargo}</p>
              <p>TELEFONO: {form.firmaTelefono}</p>
            </div>
          </div>

          <PageFoot />
        </div>
      </main>
    </div>
  )
}
