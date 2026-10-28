const base = 'https://cdn.jsdelivr.net/gh/DiegoG1117/zona-paintball-fotos@main/';

const catalogo = {
  imagenes: {
    'entrada-adulto': { url: base + 'entrada-adulto.jpg', caption: 'Entrada adulto, paintball de alto impacto. Kit básico $48.000: traje completo + 100 bolas.' },
    'entrada-ninos': { url: base + 'entrada-ninos.jpg', caption: 'Entrada niños, paintball de bajo impacto. Kit niños $49.000: traje completo + 100 bolas.' },
    'entrada-hidrogel': { url: base + 'entrada-hidrogel.jpg', caption: 'Entrada hidrogel $47.000: traje completo + bolas, bajo impacto.' },
    recarga: { url: base + 'recarga.jpg', caption: 'Recarga de 100 bolas: $26.000.' },
    'tardes-de-picnic': { url: base + 'tardes-de-picnic.jpg', caption: 'Tardes de picnic en Zona Paintball Cali.' },
    'picnic-decorado': { url: base + 'picnic-decorado.jpg', caption: 'Picnic decorado.' },
    'picnic-carpas': { url: base + 'picnic-carpas.jpg', caption: 'Picnic con carpas.' },
    'picnic-mesa': { url: base + 'picnic-mesa.jpg', caption: 'Mesa de picnic.' },
    'colores-picnic': { url: base + 'colores-picnic.jpg', caption: 'Colores de manteles para el picnic.' },
    'finca-casa': { url: base + 'finca-casa.jpg', caption: 'La finca: casa y zona de mesas.' },
    'finca-aerea': { url: base + 'finca-aerea.jpg', caption: 'Vista aérea de los campos.' },
    'aviso-no-alimentos': { url: base + 'aviso-no-alimentos.jpg', caption: 'No se permite el ingreso de líquidos y alimentos.' },
  },
  videos: {},
  formularios: {
    reserva: {
      url: 'https://zona-paintball-caja.web.app/reservar',
      titulo: 'Reservar',
      texto: 'Puedes realizar tu reserva desde este enlace',
    },
  },
};

const accion = String($json.accion || 'listar');
const id = String($json.id || '').trim();
const to = String($json.to || '').replace(/\D/g, '');

function listado() {
  return {
    ok: true,
    imagenes: Object.keys(catalogo.imagenes),
    videos: Object.keys(catalogo.videos),
    formularios: Object.keys(catalogo.formularios),
  };
}

if (accion === 'listar') {
  return [{ json: { enviar: false, resultado: listado() } }];
}

const grupo = accion === 'imagen' ? catalogo.imagenes : accion === 'video' ? catalogo.videos : accion === 'formulario' ? catalogo.formularios : null;
const recurso = grupo && grupo[id];
if (!recurso || !recurso.url) {
  return [{ json: { enviar: false, resultado: { ok: false, error: 'Ese recurso no esta en el catalogo. No inventes un enlace.', disponibles: listado() } } }];
}
if (!to) {
  return [{ json: { enviar: false, resultado: { ok: false, error: 'Falta el numero del cliente' } } }];
}

let payload;
if (accion === 'imagen') {
  payload = { messaging_product: 'whatsapp', to, type: 'image', image: { link: recurso.url } };
  if (recurso.caption) payload.image.caption = recurso.caption;
} else if (accion === 'video') {
  payload = { messaging_product: 'whatsapp', to, type: 'video', video: { link: recurso.url } };
  if (recurso.caption) payload.video.caption = recurso.caption;
} else {
  const linea = (recurso.texto || recurso.titulo || 'Formulario') + '\n' + recurso.url;
  payload = { messaging_product: 'whatsapp', to, type: 'text', text: { body: linea } };
}
return [{ json: { enviar: true, payload, resultado: { ok: true, accion, id } } }];
