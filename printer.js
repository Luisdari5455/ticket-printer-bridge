// printer.js — @node-escpos/core + @node-escpos/usb-adapter (Windows, USB)
const escpos = require('@node-escpos/core');
const USB = require('@node-escpos/usb-adapter');
const { LOG_LEVEL, PRINTER_ENCODING } = require('./config');

function log(level, ...args) {
  const order = ['debug', 'info', 'warn', 'error'];
  if (order.indexOf(level) >= order.indexOf(LOG_LEVEL)) {
    console[level === 'debug' ? 'log' : level](...args);
  }
}

// Registrar el adaptador USB
escpos.USB = USB;

// VID/PID de tu impresora (Xprinter / AON PR-100 rebrand)
const VENDOR_ID  = 0x0483; // <-- VID (ojo con el cero: 0x0483)
const PRODUCT_ID = 0x070B; // <-- PID (ojo con el cero: 0x070B)

// Encodificación por defecto (puedes cambiar a 'CP858' o 'GB18030')
const ENCODING = (PRINTER_ENCODING || 'CP437').toUpperCase();

/**
 * Abre la impresora y ejecuta la función de impresión.
 * Se asegura de pasar 'options' al Printer (requerido por @node-escpos/core).
 */
function withPrinter(run) {
  let device;
  try {
    device = new USB(VENDOR_ID, PRODUCT_ID);
  } catch (e) {
    log('error', '[printer] No se pudo crear USB adapter:', e.message || e);
    return;
  }

  const options = { encoding: ENCODING }; // <-- ¡IMPORTANTE!

  const printer = new escpos.Printer(device, options);

  device.open((err) => {
    if (err) {
      log('error', '[printer] Error al abrir USB:', err.message || err);
      return;
    }
    try {
      run(printer, () => {
        try { printer.close(); } catch {}
      });
    } catch (e) {
      log('error', '[printer] Error en impresión:', e.message || e);
      try { printer.close(); } catch {}
    }
  });
}

/**
 * Imprime ticket simple (sin QR por ahora).
 */
function printTicket(payload = {}) {
  const p = payload || {};
  withPrinter((printer, done) => {
    printer
      .hardware('init')
      .align('ct').style('b').size(1, 1).text(p.header || 'SISTEMA DE TURNOS')
      .style('normal').text(p.subHeader || '').drawLine()
      .size(2, 2).text(p.ticketNumber || '---')
      .size(1, 1)
      .text(`Nombre: ${p.name || ''}`)
      .text(`DPI: ${p.dpi || ''}`)
      .text(`Servicio: ${p.service || ''}`)
      .drawLine();

    if (p.footer) printer.text(p.footer);
    printer.cut();
    done();
  });
}

module.exports = { printTicket };
