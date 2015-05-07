/*var Insight = require('bitcore-explorers').Insight;
var insight = new Insight();

insight.getUnspentUtxos('1CS7JE3nxxn93h5AouGLCiKD9xAwnk31ht', function(err, utxos) {
  if (err) {
    // Handle errors...
  } else {
    console.log(utxos);
  }
});
*/


var bitcore = require('bitcore');
var networks = bitcore.Networks;

var Peer = require('bitcore-p2p').Peer;

var testnetPeer = new Peer({host: '192.168.1.7', network: networks.testnet});


// handle events
testnetPeer.on('inv', function(message) {
  // message.inventory[]
  console.log("inv");
  console.log(message.inventory);
});

testnetPeer.on('tx', function(message) {
  // message.transaction
  console.log("tx");
  console.log(message.transaction);
});

testnetPeer.connect();