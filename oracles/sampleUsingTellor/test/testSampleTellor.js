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
    const mockValue = "1000"; // original value that was expected
	const assert_error_val = "404" // throw an error
	
	//const mockValue = "build:passed" // modified to associated text of Travis CI checkflag
	// checkflag taken from: https://travis-ci.com/github/v-bosch/TruCol/builds/216834098
	// checkflag data taken from: Firefox>open url>rmb on image>View image info>Associated Text
	//const mockValue = "build:errored" // modified to associated text of Travis CI checkflag
	
    await tellorOracle.submitValue(requestId, mockValue);
    let retrievedVal = await sampleUsingTellor.readTellorValue(requestId);
    //assert.equal(retrievedVal.toString(), mockValue); // original test
	assert.equal(retrievedVal.toString(), assert_error_val);
  });
});
