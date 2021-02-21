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
	// TODO: change the requestId to two strings: 
	// 0. the bounty hunter github name
	// 1. The repository name belonging to the sponsor contract
    	
	// -----------------------------------------Simulate API Call of Tellor Oracles ----------------------------
	// Read whether a travis build has failed or passed
	// v-bosch/sponsor_example - no build yet for v-bosch/sponsor_example
	// a-t-0/taskwarrior-installation - failed
	// a-t-0/shell_unit_testing_template - passed
	const github_username = "a-t-0"
	//const github_repository_name = "sponsor_example"	
	const github_repository_name = "taskwarrior-installation"
	//const github_repository_name = "shell_unit_testing_template"
	const github_branch_name = "main"
		
	// Encode a string such as "passed" to a number 
	// Source: https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
	// Source: https://stackoverflow.com/questions/14346829/is-there-a-way-to-convert-a-string-to-a-base-10-number-for-encryption
	function encode(string) {
		var number = "0x";
		var length = string.length;
		for (var i = 0; i < length; i++)
			number += string.charCodeAt(i).toString(16);
		return number;
	}

	// Show the contract contains the logic to identify a correct
	// build fail/pass. If the build passes, a 2 is expected from the contract.
	// Otherwise a 1 is expected.
	const passed_checkflag_encoded = 2
	const failed_checkflag_encoded = 1
	
	// hardcode the expected test results based on which repository is tested.
	// the taskwarrior-installation has a passed build status, whereas the 
	// shell_unit_testing_template has a failed build status, both should be
	// correctly identified by the contract.
	if (github_repository_name == "taskwarrior-installation") {
		var expected_passed_check_flag = passed_checkflag_encoded;
	}
	if (github_repository_name == "shell_unit_testing_template") {
		var expected_passed_check_flag = failed_checkflag_encoded;
	}
	
	// specify travis api command that gets the build status and stores its result in an output file
	var output_filename = "output.txt"
	var command ="travis status -r "+github_username+"/"+github_repository_name+" > "+output_filename
	console.log("command=")
	console.log(command)
	
	// run some bash command
	const exec = require('child_process').exec;

	function os_func() {
		this.execCommand = function (cmd) {
		    return new Promise((resolve, reject)=> {
		       exec(cmd, (error, stdout, stderr) => {
		         if (error) {
		            reject(error);
		            return;
		        }
		        resolve(stdout)
		       });
		   })
	   }
	}
	var os = new os_func();

	os.execCommand(command).then(res=> {
		console.log("Exporting output of travis api call to output file, please wait 10 seconds.", res);
	}).catch(err=> {
		console.log("Exporting output of travis api call to output file, please wait 10 seconds.", err);
	})
	
	// wait till file is read (it takes a while)
	// TODO: do not hardcode the build time, but make it dependend on completion of the os_func function. 
	await new Promise(resolve => setTimeout(resolve, 10000));
	
	// read out the pass/fail status of the repository build from file
	var fs = require('fs');
	var pass_fail_flag = fs.readFileSync(output_filename);
	var string_pass_fail_flag = pass_fail_flag.toString();
	console.log("The build status of the bounty hunter repository is:")
	console.log(string_pass_fail_flag)
	
	// encode build checkflag
	const encoded_checkflag = encode(string_pass_fail_flag);
		
	// specify the mock value that is fed by the Tellor oracles into the contract:
	const mockValue = encoded_checkflag;
	
	// -----------------------------------------Verify the contract returns the correct retrieved value ----------------------------
    await tellorOracle.submitValue(requestId, mockValue);
    let retrievedVal = await sampleUsingTellor.readTellorValue(requestId);
	assert.equal(retrievedVal.toString(), expected_passed_check_flag);
  });
});
