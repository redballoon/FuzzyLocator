var Cylon = require('cylon');
// scan for device
// sudo node_modules/cylon-ble/bin/blescan.js
/*
Peripheral discovered!
  Name: undefined
  UUID: 6e4527971dfb4c85ac4278dcfe2b24cf
  rssi: -81
Peripheral discovered!
  Name: undefined
  UUID: cc82410cdb614af6bcbec875f57f6847
  rssi: -90
Peripheral discovered!
  Name: undefined
  UUID: b1626b12d7c5467687da42da5e94e275
  rssi: -88
*/
/* second scan
Peripheral discovered!
  Name: Shine
  UUID: 8044679a368b4caba5b1285cd9b7d8b7
  rssi: -74
*/

// fetch info on device using its uuid
// sudo node_modules/cylon-ble/bin/bleinfo.js 6e4527971dfb4c85ac4278dcfe2b24cf
/*
peripheral with UUID 6e4527971dfb4c85ac4278dcfe2b24cf found
  Manufacturer Data = 4c0009060335c0a80003
  Service Data      = 

services and characteristics:
*/
// sudo node_modules/cylon-ble/bin/bleinfo.js cc82410cdb614af6bcbec875f57f6847
/*
peripheral with UUID cc82410cdb614af6bcbec875f57f6847 found
  Manufacturer Data = 4c000906034ac0a80104
  Service Data      = 

services and characteristics:
*/
// sudo node_modules/cylon-ble/bin/bleinfo.js b1626b12d7c5467687da42da5e94e275
/*
peripheral with UUID b1626b12d7c5467687da42da5e94e275 found
  Manufacturer Data = 4c0009060362c0a80208
  Service Data      = 

services and characteristics:
1800 (Generic Access)
  2a00 (Device Name)
    properties  read
    value       4170706c65205456 | 'Apple TV'
  2a01 (Appearance)
    properties  read
    value       8002 | ''
1801 (Generic Attribute)
  2a05 (Service Changed)
    properties  indicate
d0611e78bbb44591a5f8487910ae4366
  8667556c9a374c9184ed54ee27d90049
    properties  write, notify, extendedProperties
*/
// sudo node_modules/cylon-ble/bin/bleinfo.js 8044679a368b4caba5b1285cd9b7d8b7
/*
peripheral with UUID 8044679a368b4caba5b1285cd9b7d8b7 found
  Local Name        = Shine
  Manufacturer Data = df00463030415a3035334d39
  Service Data      = 
  Service UUIDs     = 

services and characteristics:
1800 (Generic Access)
  2a00 (Device Name)
    properties  read, write
    value       5368696e65 | 'Shine'
  2a01 (Appearance)
    properties  read
    value       0000 | ''
  2a04 (Peripheral Preferred Connection Parameters)
    properties  read
    value       ffffffff0000ffff | ''
1801 (Generic Attribute)
3dda0001957f7d4a34a674696673696d
  3dda0002957f7d4a34a674696673696d
    properties  write, notify
  3dda0003957f7d4a34a674696673696d
    properties  writeWithoutResponse, notify
  3dda0004957f7d4a34a674696673696d
    properties  writeWithoutResponse, notify
  3dda0005957f7d4a34a674696673696d
    properties  write, notify
180a (Device Information)
  2a24 (Model Number String)
    properties  read
    value       464c2e322e30 | 'FL.2.0'
  2a25 (Serial Number String)
    properties  read
    value       463030415a3035334d39 | 'F00AZ053M9'
  2a27 (Hardware Revision String)
    properties  read
    value       464c2e42332e4139 | 'FL.B3.A9'
  2a26 (Firmware Revision String)
    properties  read
    value       464c322e312e3872 | 'FL2.1.8r'
*/


Cylon.robot({
  connections: {
    bluetooth: { adaptor: 'ble', uuid: '8044679a368b4caba5b1285cd9b7d8b7' }
  },

  devices: {
    battery: { driver: 'ble-battery-service' }
    //deviceInfo: { driver: 'ble-device-information' }
  },

  work: function(my) {
    
    my.battery.getBatteryLevel(function(err, data) {
      if (!!err) {
        console.log("Error: ", err);
        return;
      }

      console.log("Data: ", data);
    });
    
    
    /*
    //getModelNumber, getSystemId, getHardwareRevision, getFirmwareRevision, getPnPId
    my.deviceInfo.getManufacturerName(function(err, data) {
		if (!!err) {
		  console.log("Error: ", err);
		  return;
		}
		
		console.log("Data: ", data);
	});
	*/
  }
}).start();