const { printTicket } = require('./printer');
printTicket({
  header: 'PRUEBA LOCAL',
  subHeader: 'Sin socket',
  ticketNumber: 'LOCAL-001',
  name: 'Test',
  service: 'Demo',
  footer: 'FIN'
});