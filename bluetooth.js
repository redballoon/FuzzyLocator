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



////////////////////////////
// Device Manager
////////////////////////////
/*
- register device
---- pass event fn to run when device fails to report

- register event fn for when all devices fail to report

*/

////////////////////////////
// Single Device
////////////////////////////
var opts = {
	debug : true,
	// uuid for peripheral
	uuids : [
		'67890d8f4b1c4d0ea42a40afe493d6fb',
		'8044679a368b4caba5b1285cd9b7d8b7'
	],
	uuid : '8044679a368b4caba5b1285cd9b7d8b7',
	tx_power : 81.2,
	counters : {
		idle : 0
	},
	// must be discovered constantly within 2 minutes
	time_timeout : 300000,// 5 mins
	time_sampler : 42000,// 42 secs
	timers : {
		timeout : null,
		//
		sampler : null,
		// track time device is off
		idle : null
	},
	status : 'idle'//active, idle, paused
};
var data = {
	micro_track : [],
	track : [],
	rssi : 0,
	distance : 0
};
var methods = {
	add_data : function (dataset) {
		if (dataset.type === 'active') {
			data.track.push(dataset);
			
			// is it enough to set getting closer/getting farther
			
			
		} else if (dataset.type === 'idle') {
		
		}
	},
	calculate_accuracy : function (tx_power, rssi) {
		if (rssi === 0) {
			return -1.0; // if we cannot determine accuracy, return -1.
		}
		var open_space_constant = 1.0;// maybe not equal to open space
		var ratio = rssi * open_space_constant / tx_power;
		if (ratio < 1.0) {
			return Math.pow(ratio, 10);
		}
		
		return (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
	},
	average_rssi : function () {
		// if there is micro data to average out, use that
		// to replace rssi
		// purge micro data
		if (!data.micro_track.length) return 0;
		
		if (data.micro_track.length < 3) {
			return data.micro_track.pop();
		}
		
		if (opts.debug) console.log('average_rssi: length', data.micro_track.length);
		
		var sum = 0;
		var average = 0;
		for (var i = 0; i < data.micro_track.length; i++) {
			sum += data.micro_track[i];
		}
		average = sum / data.micro_track.length;
		
		data.micro_track.length = 0;
		
		return average;
	},
	sample : function () {
		if (opts.debug) console.log('sample:');
		
		//if (data.micro_track.length < 5) {
			//return;
		//}
		
		data.rssi = methods.average_rssi();
		data.distance = methods.calculate_accuracy(opts.tx_power, data.rssi);
		
		if (opts.debug) console.log('sample: rssi', data.rssi);
		if (opts.debug) console.log('sample: distance', data.distance);
		
		// send to another method
		// that will add data set using 'type' to
		// appropriate stack
		// and deal with history/db 
		methods.add_data({ 'type' : 'active', 'rssi' : data.rssi, 'distance' : data.distance });
		
	},
	timeout : function () {
		if (opts.debug) console.log('timeout: device failed to report itself');
		
		opts.status = 'idle';
		
		if (opts.timers.sampler !== null) {
			clearInterval(opts.timers.sampler);
			opts.timers.sampler = null;
		}
		
		opts.timers.idle = setInterval(function () {
			opts.counters.idle++;
		}, 1000);
		
		
		// assume person left house
		// unbind discover method
		// update db and set time out on dev manag when to turn on discover back on
	},
	enable : function () {
		if (opts.debug) console.log('enable:');
		
		opts.status = 'active';
		
		// kill idle counter
		if (opts.timers.idle !== null) {
			clearInterval(opts.timers.idle);
			opts.timers.idle = null;
			
			methods.add_data({ 'type' : 'idle', 'duration' : opts.counters.idle });
		}
		
		// reset counters
		opts.counters.idle = 0;
		
		// reset data
		data.micro_track.length = 0;
		data.track.length = 0;
		data.rssi = 0;
		data.distance = 0;
		
		
		// start sampler timer
		opts.timers.sampler = setInterval(methods.sample, opts.time_sampler);
	},
	update : function (device) {
		if (opts.debug) console.log('update:', device.advertisement.localName);
		
		// reset device timeout
		if (opts.timers.timeout !== null) {
			clearTimeout(opts.timers.timeout);
		}
		opts.timers.timeout = setTimeout(methods.timeout, opts.time_timeout);
		
		
		if (opts.status === 'idle') {
			methods.enable();
		}
		
		data.micro_track.push(device.rssi);
	}
};

Cylon.robot({
  connections: {
    //bluetooth: { adaptor: 'ble', uuid: '8044679a368b4caba5b1285cd9b7d8b7' }
    bluetooth: { adaptor: 'central', module: __dirname + '/node_modules/cylon-ble' }//__dirname
  },
  //devices: {//deviceInfo: { driver: 'ble-device-information' }},

  work: function(my) {
    
    // add device and kickoff tick if it hasn't been started yet
    my.connections.bluetooth.on('discover', function (peripheral) {
		//peripheral.advertisement.localName,
		//peripheral.uuid,
		//peripheral.rssi
    	
    	// device discovered
    	if (opts.uuids.indexOf(peripheral.uuid) !== -1) {
    		methods.update(peripheral);
    	}
    });
    
    /*
    //getModelNumber, getSystemId, getHardwareRevision, getFirmwareRevision, getPnPId
    my.deviceInfo.getManufacturerName(function(err, data) {
		if (!!err) {
		  console.log('Error: ', err);
		  return;
		}
		
		console.log('Data: ', data);
	});
	*/
  }
}).start();