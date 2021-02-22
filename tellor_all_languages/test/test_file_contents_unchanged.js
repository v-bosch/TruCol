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
    	
    	
	// -----------------------------------------Helper Functions ----------------------------
	// Encode a string to a number 
	// Source: https://stackoverflow.com/questions/14346829/is-there-a-way-to-convert-a-string-to-a-base-10-number-for-encryption
	function encode(string) {
		var number = "0x";
		var length = string.length;
		for (var i = 0; i < length; i++)
			number += string.charCodeAt(i).toString(16);
		return number;
	}    	
    	
    // Function that runs some incoming shell command (not bash)
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
	
	// retry getting some file
	function doCall(urlToCall, callback) {
		urllib.request(urlToCall, { wd: 'nodejs' }, function (err, data, response) {                              
		    return callback(data);
		});
	}
    
   	function create_output_dir(dir) {	
		var fs = require('fs');

		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
			console.log("created directory")
			console.log(dir)
		}
	}

	// -----------------------------------------Specify Tellor Oracles Data Sources ----------------------------
	// specify the repository commits of the sponsor and bounty hunter
	const github_username_hunter = "a-t-0"	
	const repo_name_hunter = "sponsor_example"
	// TODO: copy to test_file_contents_changed.js once the remainder TODO's are processed
	//const branch_hunter = "attack_unit_test"
	//const commit_hunter = "ede9a66a551b105f83e73f4274a3f9dbea7df6ff"
	const branch_hunter = "no_attack_in_filecontent"
	const commit_hunter = "0225ac36b43b0158c6cd95668b4622dbb73ebd3e"
	
	const github_username_sponsor = "a-t-0"
	const repo_name_sponsor = "sponsor_example"
	const branch_sponsor = "main"
	const commit_sponsor = "c90dcd4a428bdc22286e351f95bf6cbe5323cc80"
	
	
	// -----------------------------------------Specify Temporary input and output (files)------------------------
	// Show the contract contains the logic to identify a correct build fail/pass. 
	// If the build passes, a uint256 of value 2 is expected 
	// from the contract. Otherwise a uint of value 1 is expected.
	const expected_sponsor_contract_output = 2
	
	// Specify local output location of curled data
	var test_output_folder = "curled_test_data"
	var test_type = "file_contents"
	var test_case = "unchanged"
	
	// Empty test output folder before using it
	//fs.rmdirSync(test_output_folder, { recursive: true });
	var rimraf = require("rimraf"); //npm install rimraf
	rimraf(test_output_folder, function () { console.log("done"); });
	
	// TODO: do not hardcode the folder deletion time
	await new Promise(resolve => setTimeout(resolve, 2000));
	
	// Create temporary test output folder for curled data
	create_output_dir(test_output_folder)
	create_output_dir(test_output_folder+"/"+test_type)
	create_output_dir(test_output_folder+"/"+test_type+"/"+test_case)
	
	// specify the output directory and filename of the file that contains the differences
	var differences_filename =test_output_folder+"/"+test_type+"/"+test_case+"/"+test_type+"_"+test_case+".txt"
	
	// Specify output location of repository file lists
	// TODO: get single file list from unmutable filelist file in repo of sponsor
	var hunter_filelist_filepath = test_output_folder+"/"+test_type+"/"+test_case+"/hunter_filelist.txt"
	var sponsor_filelist_filepath = test_output_folder+"/"+test_type+"/"+test_case+"/sponsor_filelist.txt"
	var hunter_filecontent_path = test_output_folder+"/"+test_type+"/"+test_case+"/hunter_temp_filecontent.txt"
	var sponsor_filecontent_path = test_output_folder+"/"+test_type+"/"+test_case+"/sponsor_temp_filecontent.txt"
	
	
	// -----------------------------------------Specify Curl Commands That Get API Data---------------------------
	// Create command that gets the list of files in the bounty hunter repository
	// TODO: change this to reading from a single file in the sponsor repo that specifies the unmutable file list
	file_list_hunter_repo = "echo $(curl -X GET https://api.github.com/repos/"+github_username_hunter+"/"+repo_name_hunter+"/git/trees/"+branch_hunter+"?recursive=1) | grep -Po \x27\x22path\x22:.*?[^\\\\]\x22,\x27"
	
	// Create command that gets the list of files in the sponsor repository
	file_list_sponsor_repo = "echo $(curl -X GET https://api.github.com/repos/"+github_username_sponsor+"/"+repo_name_sponsor+"/git/trees/"+branch_sponsor+"?recursive=1) | grep -Po \x27\x22path\x22:.*?[^\\\\]\x22,\x27"
	console.log("file_list_sponsor_repo")
	console.log(file_list_sponsor_repo)
	
	// create command that curls the hunter files (based on the filename that is inside the shell variable $line)
	var curl_hunter_files = "curl \x22https://raw.githubusercontent.com/"+github_username_hunter+"/"+repo_name_hunter+"/"+commit_hunter+"/$line\x22"
	
	// create command that curls the sponsor files (based on the filename that is inside the shell variable $line)
	var curl_sponsor_files = "curl \x22https://raw.githubusercontent.com/"+github_username_sponsor+"/"+repo_name_sponsor+"/"+commit_sponsor+"/$line\x22"
	
	// combine the commands that curl a file from the hunter and bounter repository commits respectively, and export the difference
	// in their file content
	// TODO: APPEND the differences for each file pair
	var command_per_line = curl_hunter_files+" > "+hunter_filecontent_path+" && "+curl_sponsor_files+" > "+sponsor_filecontent_path+" && diff "+hunter_filecontent_path+" "+sponsor_filecontent_path+" > "+differences_filename
	
	// Print the final command that outputs the differences
	console.log("COMMAND PER LINE=")
	console.log(command_per_line)
	
	// Substitute the difference checking command into 
	var command = "while read line; do "+command_per_line+"; done < "+sponsor_filelist_filepath
	console.log("cOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOommand=")
	console.log(command)	
	
	// create commands to get hunter and sponsor repo file lists
	var export_hunter_files = file_list_hunter_repo  +" > "+hunter_filelist_filepath
	var export_sponsor_files = file_list_sponsor_repo  +" > "+sponsor_filelist_filepath
	
	// remove artifacts from file lists from repos
	// TODO: specify in var name that it is a command
	var remove_artifacts_hunter = "sed -i -e 's/\x22,//g' "+hunter_filelist_filepath+" && sed -i -e 's/\x22path\x22: \x22//g' "+hunter_filelist_filepath
	var remove_artifacts_sponsor = "sed -i -e 's/\x22,//g' "+sponsor_filelist_filepath+" && sed -i -e 's/\x22path\x22: \x22//g' "+sponsor_filelist_filepath
	
	
	// -----------------------------------------Get The Tellor Oracles Data With Shell --------------------------
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

	// remove artifacts of hunter repository file list
	os.execCommand(remove_artifacts_hunter).then(res=> {
		console.log("Removing string artifacts in file list of bounty hunter, please wait 10 seconds.", res);
	}).catch(err=> {
		console.log("Removing string artifacts in file list of bounty hunter, please wait 10 seconds.", err);
	})
	
	// remove artifacts of sponsor repository file list
	os.execCommand(remove_artifacts_sponsor).then(res=> {
		console.log("Removing string artifacts in file list of bounty hunter, please wait 10 seconds.", res);
	}).catch(err=> {
		console.log("Removing string artifacts in file list of bounty hunter, please wait 10 seconds.", err);
	})

	// wait till file is read (it takes a while)
	// TODO: do not hardcode the build time, but make it dependend on completion of the os_func function. 
	await new Promise(resolve => setTimeout(resolve, 10000));

	// compare differences in file content
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
	var difference_in_file_lists = fs.readFileSync(differences_filename);
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
	assert.equal(retrievedVal.toString(), expected_sponsor_contract_output);
  });
});
