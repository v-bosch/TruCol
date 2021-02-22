var urllib = require('urllib');

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
	const repo_name_hunter = "sponsor_example"
	const repo_name_sponsor = "sponsor_example"
	const branch_hunter = "main"
	const branch_sponsor = "main"
		
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
	const passed_test = 2
	const failed_test = 1
	
	// hardcode the expected test results based on which repository is tested.
	// the taskwarrior-installation has a passed build status, whereas the 
	// shell_unit_testing_template has a failed build status, both should be
	// correctly identified by the contract.
	var expected_contract_output = passed_test
	
	// specify travis api command that gets the build status and stores its result in an output file
	var output_filename = "output.txt"
	var hunter_filelist_filename = "hunter.txt"
	var sponsor_filelist_filename = "sponsor.txt"
	
	// get the list of files per repo	
	file_list_hunter_repo = "echo $(curl -X GET https://api.github.com/repos/"+github_username_hunter+"/"+repo_name_hunter+"/git/trees/"+branch_hunter+"?recursive=1) | grep -Po \x27\x22path\x22:.*?[^\\\\]\x22,\x27"
	
	file_list_sponsor_repo = "echo $(curl -X GET https://api.github.com/repos/"+github_username_sponsor+"/"+repo_name_sponsor+"/git/trees/"+branch_sponsor+"?recursive=1) | grep -Po \x27\x22path\x22:.*?[^\\\\]\x22,\x27"
	
	// Define command per line/file of repo
	// TODO: First check if the line starts with:> "path": 
	// Then remove the:"> "path": " part (without the outside double qoutation marks
	//var git_filepath = "${line:9:-2}" // bad substitution in shell
	//var git_filepath = "{line:9:-2}"
	var git_filepath = "$line"
	
	
	var curl_hunter_files = "curl \x22https://raw.githubusercontent.com/"+github_username_hunter+"/"+repo_name_hunter+"/"+branch_hunter+"/"+git_filepath+"\x22"
	var curl_sponsor_files = "curl \x22https://raw.githubusercontent.com/"+github_username_sponsor+"/"+repo_name_sponsor+"/"+branch_sponsor+"/"+git_filepath+"\x22"
	// YIELDS VALID COMMAND: 
	//var command_per_line = "diff <("+curl_hunter_files+") <("+curl_sponsor_files+") > "+output_filename
	var command_per_line = curl_hunter_files+" > hunter_temp_content.txt"+" && "+curl_sponsor_files+" > sponsor_temp_content.txt && diff hunter_temp_content.txt sponsor_temp_content.txt > "+output_filename
	//var command_per_line = "diff <("+curl_hunter_files+") <("+curl_sponsor_files+") > "+output_filename
	console.log("COMMAND PER LINE=")
	console.log(command_per_line)
	
	// Then prepend the github repository curl command to the path that remains
	var command = "while read line; do "+command_per_line+"; done < sponsor.txt"
	console.log("cOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOommand=")
	console.log(command)
	// WOrks
	//while read line; do diff <(curl https://raw.githubusercontent.com/a-t-0/sponsor_example/main/${line:9:-2}) <(curl https://raw.githubusercontent.com/a-t-0/sponsor_example/attack_unit_test/${line:9:-2}); done < sponsor.txt
	//while read line; do diff <(curl "https://raw.githubusercontent.com/a-t-0/sponsor_example/main/${line:9:-2}") <(curl "https://raw.githubusercontent.com/a-t-0/sponsor_example/attack_unit_test/${line:9:-2}") > output.txt; done < sponsor.txt
	//while read line; do diff <(curl "https://raw.githubusercontent.com/a-t-0/sponsor_example/main/${line:9:-2}") <(curl "https://raw.githubusercontent.com/a-t-0/sponsor_example/attack_unit_test/${line:9:-2}") > output.txt; done < sponsor.txt
	
	// New approach
	// while read line; do curl "https://raw.githubusercontent.com/a-t-0/sponsor_example/main/${line:9:-2}" > hunter_temp_content.txt && curl "https://raw.githubusercontent.com/a-t-0/sponsor_example/attack_unit_test/${line:9:-2}" > sponsor_temp_content.txt && diff hunter_temp_content.txt sponsor_temp_content.txt > output.txt; done < sponsor.txt
	
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
	
	// remove artifacts from file lists from repos
	var remove_artifacts_hunter = "sed -i 's/\x22,//g' hunter.txt && sed -i 's/\x22path\x22: \x22//g' hunter.txt"
	var remove_artifacts_sponsor = "sed -i 's/\x22,//g' sponsor.txt && sed -i 's/\x22path\x22: \x22//g' sponsor.txt"
	
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
	
	// curl the files from the 
	os.execCommand(export_sponsor_files).then(res=> {
		console.log("Getting list of files in repository of sponsor, please wait 10 seconds.", res);
	}).catch(err=> {
		console.log("Getting list of files in repository of sponsor, please wait 10 seconds.", err);
	})
	
	// manually get some file
	var request = require('request');
	request.get('https://raw.githubusercontent.com/a-t-0/sponsor_example/main/test_sqrt.py', function (error, response, body) {
		if (!error && response.statusCode == 200) {
		    var csv = body;
		    // Continue with your processing here.
		    console.log("csv")
		    console.log(csv)
		    return csv
		}
	});
	//console.log("request")
	//console.log(request)
	
	// retry getting some file
	function doCall(urlToCall, callback) {
		urllib.request(urlToCall, { wd: 'nodejs' }, function (err, data, response) {                              
		    return callback(data);
		});
	}	
	
	var urlToCall = "https://raw.githubusercontent.com/a-t-0/sponsor_example/main/test_sqrt.py";
	doCall(urlToCall, function(response){
		// Here you have access to your variable
		console.log("AATTEMPT 2")
		console.log(response.toString());
		return response.toString()
	})

	// wait till file is read (it takes a while)
	// TODO: do not hardcode the build time, but make it dependend on completion of the os_func function. 
	await new Promise(resolve => setTimeout(resolve, 10000));

	// remove artifacts
	os.execCommand(remove_artifacts_hunter).then(res=> {
		console.log("Getting list of files in repository of bounty hunter, please wait 10 seconds.", res);
	}).catch(err=> {
		console.log("Getting list of files in repository of bounty hunter, please wait 10 seconds.", err);
	})
	os.execCommand(remove_artifacts_sponsor).then(res=> {
		console.log("Getting list of files in repository of bounty hunter, please wait 10 seconds.", res);
	}).catch(err=> {
		console.log("Getting list of files in repository of bounty hunter, please wait 10 seconds.", err);
	})

	
	// compare differences in file content
	os.execCommand(command).then(res=> {
		console.log("Computing the difference between the list of files in the repos of the sponsor and bounty hunter, please wait 10 seconds.", res);
	}).catch(err=> {
		console.log("Computing the difference between the list of files in the repos of the sponsor and bounty hunter, please wait 10 seconds.", err);
	})
	
	
	// Retry bash command
	console.log("REEEEEEEEETRY")
	// Source: https://stackoverflow.com/questions/37732331/execute-bash-command-in-node-js-and-get-exit-code
	dir = exec(command, function(err, stdout, stderr) {
	  if (err) {
		// should have err.code here?  
	  }
	  console.log(stdout);
	});

	dir.on('exit', function (code) {
	  // exit code is code
	});
	

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
	assert.equal(retrievedVal.toString(), expected_contract_output);
  });
});
