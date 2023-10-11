const ping = require('ping');
const cron = require('node-cron');

const targetIPs = ['1.1.1.1', '8.8.8.8'];

const ipStatus = {}; // Objek untuk menyimpan status IP

cron.schedule('*/3 * * * * *', () => {
  targetIPs.forEach((targetIP) => {
    ping.sys.probe(targetIP, (isAlive) => {
      const currentStatus = isAlive ? 'UP ⬆️' : 'RTO ⬇️';
      
      // Simpan status dalam objek ipStatus
      if (!ipStatus[targetIP]) {
        ipStatus[targetIP] = {
          previousStatus: '',
          currentStatus: currentStatus,
          previousTime: 0,
          currentTime: Date.now(),
          timeGap: 0
        };
      } else {
        // Jika IP telah ada dalam objek ipStatus, simpan status sebelumnya
        ipStatus[targetIP].previousStatus = ipStatus[targetIP].currentStatus;
        ipStatus[targetIP].currentStatus = currentStatus;
        ipStatus[targetIP].previousTime = ipStatus[targetIP].currentTime;
        ipStatus[targetIP].currentTime = Date.now();
        ipStatus[targetIP].timeGap = (Date.now() - ipStatus[targetIP].previousTime);
      }

    });
  });

  // Anda dapat mengakses status IP dengan menggunakan objek ipStatus
  let status = '';
  targetIPs.forEach((targetIPx) => {
    if (ipStatus[targetIPx].currentStatus !== ipStatus[targetIPx].previousStatus) {

      if (ipStatus[targetIPx].previousStatus !== '') {
        status += '              IP MONITORING\n';
        status += '              IP              : '+targetIPx+'\n';
        status += '              Previous Status : '+ipStatus[targetIPx].previousStatus+'\n';
        status += '              Current Status  : '+ipStatus[targetIPx].currentStatus+'\n';
        status += '              Time GAP        : '+ipStatus[targetIPx].timeGap+'\n';
        status += '              ------------------------------\n';
      }
    }
  });

  if (status !== '') {
    console.log(status);
  }

});


// //nambah
// const rawData = fs.readFileSync('ipStatus.json');
// const parsedData = JSON.parse(rawData);
// console.log(parsedData);
