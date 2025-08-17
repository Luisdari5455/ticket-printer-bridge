const usb = require('usb');

function getStr(dev, idx) {
  return new Promise((resolve) => {
    if (!idx) return resolve('');
    dev.open();
    dev.getStringDescriptor(idx, (err, data) => {
      try { dev.close(); } catch {}
      resolve(err ? '' : data);
    });
  });
}

(async () => {
  const list = usb.getDeviceList();
  for (const d of list) {
    const { idVendor, idProduct, iManufacturer, iProduct } = d.deviceDescriptor;
    const vid = '0x' + idVendor.toString(16);
    const pid = '0x' + idProduct.toString(16);
    let man = '', prod = '';
    try { man = await getStr(d, iManufacturer); } catch {}
    try { prod = await getStr(d, iProduct); } catch {}
    console.log({ vid, pid, manufacturer: man, product: prod });
  }
})();
