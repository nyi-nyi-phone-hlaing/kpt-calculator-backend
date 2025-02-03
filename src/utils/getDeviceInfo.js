const os = require("os");

const getDeviceInfo = () => ({
  hostname: os.hostname(),
  platform: os.platform(),
  architecture: os.arch(),
  cpuInfo: os.cpus()[0].model,
  totalMemory: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + " GB",
  freeMemory: (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + " GB",
  wifiMacAddress: os.networkInterfaces()["Wi-Fi"][0].mac,
  uptime: os.uptime(),
  release: os.release(),
  homedir: os.homedir(),
  version: os.version(),
});

module.exports = getDeviceInfo;
