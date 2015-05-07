// config options
var confirmaciones=3;
// end of config options

var Promise = require("bluebird");
var bitcoin = require('bitcoin');
var fs = require('fs');
var _ = require('lodash');

var client = new bitcoin.Client({
  host: '192.168.1.7',
  port: 18332,
  user: 'usuariorpc',
  pass: 'RPCRPCRPC',
  timeout: 30000
});

Promise.promisifyAll(client);



var proceso = require('./lastblock.json')
console.log(proceso.ultimoBloque)

//UltimoBloqueProcesado=334145;


client.getBlockCountAsync().spread(function(blockCount) {
	Promise.all(_.range(proceso.ultimoBloque, blockCount-confirmaciones+1)).map(function(blockIndex) {
		return client.getBlockHashAsync(blockIndex);
	}).map(function(blockHash) {
		return client.getBlockAsync(blockHash[0]);
	}).map(function(block) {
		return block[0].tx;
	}).then(_.flatten).map(function(txHash) {
		return client.getRawTransactionAsync(txHash);
	}).map(function(rawtx) {
		return client.decodeRawTransactionAsync(rawtx[0]);
	}).map(function(decodedtx) {
		return decodedtx[0].vout;
	}).then(_.flatten).map(function(vout) {
		console.log("Salida: "+vout.value+" -> "+vout.scriptPubKey.addresses);
	}).then(function()
	{
		proceso.ultimoBloque=blockCount-confirmaciones+1
		var data = JSON.stringify(proceso);
		fs.writeFile('./lastblock.json', data, function (err) {
		  if (err) {
		    console.log('Error grabando el dato del ultimo bloque procesado.');
		    console.log(err.message);
		    return;
		  }
		  console.log('Dato de ultimo bloque procesado actualizado.')
		});
	})
})


