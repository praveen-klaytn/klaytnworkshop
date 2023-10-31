// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract CertificateMgmt {

    address owner;

    // storage variables
    struct Certificate {
        string certifiedTo;
        string rollNumber;
        uint score;
        string certifiedBy;
        string certificateHash;
        bool isValid;
    }

    mapping(string => Certificate) certificates;

    // constructor
    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Authorized");
        _;
    }

    // registerCertificate
    function registerCertificate(string memory certifiedTo, string memory rollNumber, uint score, 
        string memory certifiedBy, string memory certificateHash, bool isValid) public onlyOwner {
            certificates[certificateHash] = Certificate(
                certifiedTo,
                rollNumber,
                score,
                certifiedBy,
                certificateHash,
                isValid
            );
    }

    // verifyCertificate
    function verifyCertificate(string memory certificateHash) public view returns(string memory certifiedTo, string memory rollNumber, 
        uint score, string memory certifiedBy, bool isValid){
        return (certificates[certificateHash].certifiedTo,
            certificates[certificateHash].rollNumber,
            certificates[certificateHash].score,
            certificates[certificateHash].certifiedBy,
            certificates[certificateHash].isValid);
    }
}