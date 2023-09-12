// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
import "@openzeppelin/contracts/utils/Strings.sol";

contract CarbonFootprint {
    struct Emission {
        uint256 emissionData; // MT co2e 
        uint256 emissionOffsetData; // MT co2e
    }

    // year_scopeId_scopeType => month, emissiondata
    mapping(string => mapping(uint256 => Emission )) public monthlyEmissions;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
      require(msg.sender == owner);
      _;
    }

    function upsertReport(uint256 year, uint256 scopeId, uint256 scopeType, uint256 month,
         uint256 emissionData, uint256 emissionOffsetData) public onlyOwner {

        // Individual data
        monthlyEmissions[string.concat(Strings.toString(year), "_", Strings.toString(scopeId), "_", Strings.toString(scopeType))][month] = Emission(
            emissionData,
            emissionOffsetData
        );
    }
}