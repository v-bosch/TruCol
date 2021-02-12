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
    
	// numerical js encoding of "build:passed" to be done by oracles when calling html content
	const expected_passed_check_flag = "30471473131337998138141271451"; // computed manually with encode function
	
	// -----------------------------------------Simulate API Call of Tellor Oracles ----------------------------
	// checkflag taken from: https://travis-ci.com/github/v-bosch/TruCol/builds/216834098
	// via Firefox>open url>rmb on image>View image info>Associated Text
	const check_flag_passed= "build:passed" // modified to associated text of Travis CI checkflag
	//const mockValue = "build:errored" // modified to associated text of Travis CI checkflag
	
	// Source: https://stackoverflow.com/questions/14346829/is-there-a-way-to-convert-a-string-to-a-base-10-number-for-encryption
	function encode(string) {
		var number = "0x";
		var length = string.length;
		for (var i = 0; i < length; i++)
			number += string.charCodeAt(i).toString(16);
		return number;
	}
	
	// compute output of Tellor oracles
	const mockValue = encode(check_flag_passed)
	
	// -----------------------------------------Verify the contract returns the correct retrieved value ----------------------------
    await tellorOracle.submitValue(requestId, mockValue);
    let retrievedVal = await sampleUsingTellor.readTellorValue(requestId);
	assert.equal(retrievedVal.toString(), expected_passed_check_flag);
  });
});
