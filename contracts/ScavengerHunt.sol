// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";

interface otherContract {
    function callMe() external;
}

contract ScavengerHunt is ChainlinkClient, ERC721, Ownable {
    using Chainlink for Chainlink.Request;

    address private s_oracle;
    bytes32 private s_jobId;
    uint256 private s_fee;
    address public s_dao;
    string public s_passwordtwo;

    uint256 public s_variable;

    mapping(bytes32 => address) public requestIdToAttemptee;
    mapping(uint256 => bool) public tokenIdTaken;
    mapping(uint256 => string) public tokenIdToImageURI;
    event attemptedPassword(bytes32 indexed requestId, string indexed password);

    constructor(
        address oracle,
        bytes32 jobId,
        uint256 fee,
        address linkToken
    ) ERC721("ScavengerHunt", "SH") {
        if (linkToken == address(0)) {
            setPublicChainlinkToken();
        } else {
            setChainlinkToken(linkToken);
        }
        s_oracle = oracle;
        s_jobId = jobId;
        s_fee = fee;
        s_variable = 2;
        tokenIdToImageURI[0] = "ipfs://QmcL4nCrEZBpsHD9NSHSqauQjL1kuaWTe77oZVbo8zUFgU";
        tokenIdToImageURI[1] = "ipfs://QmS94ghjmWKaKPVUxdQvU4YjTaeck2RLdYWJbMjaFMJAKf";
        tokenIdToImageURI[2] = "ipfs://QmU2YpvcdeXZQy7i3a5peKVFWb3twgphd6PbJTx4SEjXxT";
        tokenIdToImageURI[3] = "ipfs://QmVANqwgoqDFSDmJD8UnxgopGNugv2xMVhmJkng1RMDP3d";
        tokenIdToImageURI[4] = "ipfs://QmbGW9p6oPcz2hPR3Fv5wBHL2CoG7eU1EoWz43WoUnhcW5";
    }

    function attemptPassword(string memory password) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(s_jobId, address(this), this.fulfill.selector);
        req.add("password", password);
        requestId = sendChainlinkRequestTo(s_oracle, req, s_fee);
        requestIdToAttemptee[requestId] = msg.sender;
        emit attemptedPassword(requestId, password);
    }

    /**
     * Receive the response in the form of uint256
     */
    function fulfill(bytes32 requestId, uint256 data) public recordChainlinkFulfillment(requestId) {
        require(tokenIdTaken[data] == false, "This token is taken!");
        tokenIdTaken[data] = true;
        _safeMint(requestIdToAttemptee[requestId], data);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory imageURI = tokenIdToImageURI[tokenId];
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "Chainlink Hackathon Scavenger Hunt NFT", ',
                                '"description":"Nice Find!", "image":"',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function setDAO(address dao) public onlyOwner {
        s_dao = dao;
    }

    function setPasswordTwo(string memory password) public onlyOwner {
        s_passwordtwo = password;
    }

    modifier onlyDAO() {
        require(msg.sender == s_dao, "Only the DAO can do this");
        _;
    }

    function challengeThree(address winner) public onlyDAO {
        require(tokenIdTaken[3] == false, "This token is taken!");
        tokenIdTaken[3] = true;
        _safeMint(winner, 3);
    }

    function callengeFour(address calledContract, address winner) public {
        require(tokenIdTaken[4] == false, "This token is taken!");
        s_variable = s_variable - 1;
        otherContract(calledContract).callMe();
        if (s_variable == 0) {
            tokenIdTaken[4] = true;
            _safeMint(winner, 4);
        }
        s_variable = 2;
    }
}
