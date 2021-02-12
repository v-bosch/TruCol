const SampleUsingTellor = artifacts.require("./SampleUsingTellor.sol");
const Tellor = artifacts.require("TellorPlayground.sol");

//Helper function that submits and value and returns a timestamp for easy retrieval
const submitTellorValue = async (tellorOracle, requestId, amount) => {
  //Get the amount of values for that timestamp
  let count = await tellorOracle.getNewValueCountbyRequestId();
  await tellorOracle.submitValue(requestId, amount);
  let time = await getTimestampbyRequestIDandIndex(requestId, count.toString());
  return time.toNumber();
};

contract("UsingTellor Tests", function (accounts) {
  let sampleUsingTellor;
  let tellorOracle;

  beforeEach("Setup contract for each test", async function () {
    tellorOracle = await Tellor.new();
    sampleUsingTellor = await SampleUsingTellor.new(tellorOracle.address);
  });

  it("Update Price", async function () {
    const requestId = 1; // assumes the first ID of the list of tellor variable contains what we return, e.g. usd/BTC (in our case, checkflag text)
    
	// uint256 returned by sponsor contract to show the contract understands the result from the Tellor oracles.
	// 1 means the contract knows the Travis CI repo of the build failed, 2 means passed build.
	const expected_passed_check_flag = "sometext";
	
	// -----------------------------------------Simulate API Call of Tellor Oracles ----------------------------
	// Read github repo content
	const github_username = "jfrog"
	const github_repository_name = "jfrog-docker-repo-simple-example"
	const github_branch_name = "main"
	
	// curl data
	// Source: https://stackoverflow.com/questions/692196/post-request-javascript
	var url = "https://raw.githubusercontent.com/jfrog/jfrog-docker-repo-simple-example/master/Dockerfile";
	const http = require('https'); // or 'https' for https:// URLs
	const fs = require('fs');

	const file = fs.createWriteStream("file.txt");
	const request = http.get(url, function(response) {
		response.pipe(file);

		response.on('end', function () {
			console.log('Finished');
			completeTest();
		});
	});

	// https://stackoverflow.com/questions/11944932/how-to-download-a-file-with-node-js-without-using-third-party-libraries
	// var http = require('https');
	// var fs = require('fs');

	// var download = function(url, dest, cb) {
	  // var file = fs.createWriteStream(dest);
	  // var request = http.get(url, function(response) {
		// response.pipe(file);
		// file.on('finish', function() {
		  // file.close(cb);  // close() is async, call cb after close completes.
		// });
	  // }).on('error', function(err) { // Handle errors
		// fs.unlink(dest); // Delete the file async. (But we don't check the result)
		// if (cb) cb(err.message);
	  // });
	// };


	// Source: http://www.rosettacode.org/wiki/Read_entire_file#JavaScript
	// var fso=new ActiveXObject("Scripting.FileSystemObject");
	// var f=fso.OpenTextFile("file.txt",1);
	// var s=f.ReadAll();
	// f.Close();
	//try{alert(s)}catch(e){WScript.Echo(s)}
	
	
	
	// var request = require('request');
	// request.get(url, function (error, response, body) {
		// if (!error && response.statusCode == 200) {
			// var csv = body;
			// // Continue with your processing here.
			// return csv
		// }
	// });

	
	// read out downloaded data
	// Source: https://stackoverflow.com/questions/6456864/why-does-node-js-fs-readfile-return-a-buffer-instead-of-string
	var content = fs.readFileSync('file.txt', 'utf8');
	//var content = fs.readFileSync(url, 'utf8');
	
	const unit_test_file_content = content;
	//const unit_test_file_content = download(url,"file.txt");
 
	
	// Source: https://stackoverflow.com/questions/14346829/is-there-a-way-to-convert-a-string-to-a-base-10-number-for-encryption
	function encode(string) {
		var number = "0x";
		var length = string.length;
		for (var i = 0; i < length; i++)
			number += string.charCodeAt(i).toString(16);
		return number;
	}
	//const expected_passed_check_flag = encode("build:errored")

	async function completeTest()	{
	
	// compute output of Tellor oracles
	const mockValue = encode(unit_test_file_content);
	
	// -----------------------------------------Verify the contract returns the correct retrieved value ----------------------------
    await tellorOracle.submitValue(requestId, mockValue);
    let retrievedVal = await sampleUsingTellor.readTellorValue(requestId);

	assert.equal(retrievedVal.toString(), expected_passed_check_flag);
	}
  });
});
