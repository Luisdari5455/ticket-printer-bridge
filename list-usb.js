const USB = require('@node-escpos/usb-adapter');
const devices = USB.getDeviceList ? USB.getDeviceList() : [];
console.log(devices.map(d => ({
  vendorId: '0x' + (d.deviceDescriptor?.idVendor || 0).toString(16),
  productId: '0x' + (d.deviceDescriptor?.idProduct || 0).toString(16),
  manufacturer: d.deviceDescriptor?.iManufacturer,
  product: d.deviceDescriptor?.iProduct
})));
