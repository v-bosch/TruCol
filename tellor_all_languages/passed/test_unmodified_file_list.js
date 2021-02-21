const CompareFileListsInRepo = artifacts.require("./CompareFileListsInRepo.sol");
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
	let compareFileListsInRepo;
	let tellorOracle;

	beforeEach("Setup contract for each test", async function () {
	tellorOracle = await Tellor.new();
	compareFileListsInRepo = await CompareFileListsInRepo.new(tellorOracle.address);
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
	const github_username_hunter = "a-t-0"
	const github_username_sponsor = "a-t-0"
	const repo_name_hunter = "taskwarrior-installation"
	const repo_name_sponsor = "taskwarrior-installation"
	const branch_hunter = "master"
	const branch_sponsor = "master"
		
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
	if (repo_name_sponsor == "taskwarrior-installation") {
		var expected_passed_check_flag = passed_checkflag_encoded;
	}
	if (repo_name_sponsor == "shell_unit_testing_template") {
		var expected_passed_check_flag = failed_checkflag_encoded;
	}
	
	// specify travis api command that gets the build status and stores its result in an output file
	var output_filename = "output.txt"
	var hunter_filelist_filename = "hunter.txt"
	var sponsor_filelist_filename = "sponsor.txt"
	
		
	file_list_hunter_repo = "echo $(curl -X GET https://api.github.com/repos/"+github_username_hunter+"/"+repo_name_hunter+"/git/trees/"+branch_hunter+"?recursive=1) | grep -Po \x27\x22path\x22:.*?[^\\\\]\x22,\x27"
	
	file_list_sponsor_repo = "echo $(curl -X GET https://api.github.com/repos/"+github_username_sponsor+"/"+repo_name_sponsor+"/git/trees/"+branch_sponsor+"?recursive=1) | grep -Po \x27\x22path\x22:.*?[^\\\\]\x22,\x27"
	
	
	
	
	//var difference = "diff "+file_list_sponsor_repo+" "+file_list_hunter_repo
	var difference = "diff "+hunter_filelist_filename+" "+sponsor_filelist_filename
	var command = difference +" > "+output_filename
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
	
	// create commands to get hunter and sponsor repo file lists
	var export_hunter_files = file_list_hunter_repo  +" > hunter.txt"
	var export_sponsor_files = file_list_sponsor_repo  +" > sponsor.txt"
	
	// export hunter repo file list
	os.execCommand(export_hunter_files).then(res=> {
		console.log("Getting list of files in repository of bounty hunter, please wait 10 seconds.", res);
	}).catch(err=> {
		console.log("Getting list of files in repository of bounty hunter, please wait 10 seconds.", err);
	})
	
	// export sponsor repo file list
	os.execCommand(export_sponsor_files).then(res=> {
		console.log("Getting list of files in repository of sponsor, please wait 10 seconds.", res);
	}).catch(err=> {
		console.log("Getting list of files in repository of sponsor, please wait 10 seconds.", err);
	})
	
	// wait till file is read (it takes a while)
	// TODO: do not hardcode the build time, but make it dependend on completion of the os_func function. 
	await new Promise(resolve => setTimeout(resolve, 10000));
	
	os.execCommand(command).then(res=> {
		console.log("Computing the difference between the list of files in the repos of the sponsor and bounty hunter, please wait 10 seconds.", res);
	}).catch(err=> {
		console.log("Computing the difference between the list of files in the repos of the sponsor and bounty hunter, please wait 10 seconds.", err);
	})

	// wait till file is read (it takes a while)
	// TODO: do not hardcode the build time, but make it dependend on completion of the os_func function. 
	await new Promise(resolve => setTimeout(resolve, 10000));
	
	// read out the pass/fail status of the repository build from file
	var fs = require('fs');
	var difference_in_file_lists = fs.readFileSync(output_filename);
	var string_difference_in_file_lists = difference_in_file_lists.toString();
	console.log("The list of different files between sponsor repo and bounty hunter repo is:")
	console.log(string_difference_in_file_lists)
	console.log("That was it")
	
	// encode build checkflag
	const encoded_difference_in_file_lists = encode(string_difference_in_file_lists+"offset");
	console.log("The numerically encoded list of different files between sponsor repo and bounty hunter repo is (including an offset):")
	console.log(encoded_difference_in_file_lists)
	console.log("That was it")
		
	// specify the mock value that is fed by the Tellor oracles into the contract:
	const mockValue = encoded_difference_in_file_lists;
	
	// -----------------------------------------Verify the contract returns the correct retrieved value ----------------------------
    await tellorOracle.submitValue(requestId, mockValue);
    let retrievedVal = await compareFileListsInRepo.readTellorValue(requestId);
	assert.equal(retrievedVal.toString(), expected_passed_check_flag);
  });
});
