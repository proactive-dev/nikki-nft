// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//uint256 constant RESOLUTION = 1000000000000000;
struct Coordinate {
    int256 lat;
    int256 long;
}

struct Draft {
    address account;
    uint[] title;
    uint256 timestamp;
    Coordinate location;
    uint256 issuedAt;
}

struct Certificate {
    uint256 id;
    address account;
    uint[] title;
    uint256 timestamp;
    Coordinate location;
    uint[] description;
    string fileHash;
    uint[] hashtag;
    uint256 issuedAt;
}

contract NikkiNFT is Ownable, ERC721Enumerable {
    using Counters for Counters.Counter;

    string private _baseTokenURI;

    uint private issueFee = 10 ether;

    Counters.Counter private idTracker;
    mapping (uint256 => Draft) drafts;
    mapping (address => uint256[]) draftIdsPerAccount;
    mapping (uint256 => Certificate) certificates;

    event SetIssueFee(uint256 fee);
    event SetDraft(uint256 id, address account, uint[] title, uint256 timestamp, Coordinate location);
    event Mint(uint256 id, address account, uint[] title, uint256 timestamp, Coordinate location, uint[] description, string fileHash, uint[] hashtag);

    constructor() ERC721("NikkiNFT","NKT") {
        _baseTokenURI = "https://ipfs.io/ipfs/";
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = certificates[_tokenId].fileHash;

        // If there is no base URI, return the token URI.
        if (bytes(_baseTokenURI).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(_baseTokenURI, _tokenURI));
        }

        // TODO: If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return _baseTokenURI;
    }

    function setIssueFee(uint _fee) external onlyOwner {
        issueFee = _fee;
        emit SetIssueFee(_fee);
    }

    function setDraft(uint[] memory _title, uint256 _timestamp, Coordinate memory _location) external {
        uint256 _id = idTracker.current();

        drafts[_id].account = msg.sender;
        drafts[_id].title = _title;
        drafts[_id].timestamp = _timestamp;
        drafts[_id].location = _location;
        drafts[_id].issuedAt = 0;
        draftIdsPerAccount[msg.sender].push(_id);

        idTracker.increment();
        emit SetDraft(_id, msg.sender, _title, _timestamp, _location);
    }

    function getDraft(uint256 _id) external view returns (Draft memory) {
        return drafts[_id];
    }

    function getDrafts() external view returns (uint256[] memory, Draft[] memory) {
        Draft[] memory _drafts = new Draft[](draftIdsPerAccount[msg.sender].length);
        for (uint i = 0; i < draftIdsPerAccount[msg.sender].length; i++) {
            _drafts[i] = drafts[draftIdsPerAccount[msg.sender][i]];
        }
        return (draftIdsPerAccount[msg.sender], _drafts);
    }

    function enforceCheckIssueFee() internal view {
        require(msg.value >= issueFee, "Must be larger than issue fee");
    }

    function mintFromDraft(uint256 _id, uint[] memory _description, string memory _fileHash, uint[] memory _hashtag) external payable {
        enforceCheckIssueFee();

        Draft memory _draft = drafts[_id];
        require(msg.sender == _draft.account, "Only user self can call this function");
        mint(_id, msg.sender, _draft.title, _draft.timestamp, _draft.location, _description, _fileHash, _hashtag);
        drafts[_id].issuedAt = block.timestamp;
    }

    function mintFromScratch(uint[] memory _title, uint256 _timestamp, Coordinate memory _location, uint[] memory _description, string memory _fileHash, uint[] memory _hashtag) external payable {
        enforceCheckIssueFee();

        uint256 _id = idTracker.current();
        mint(_id, msg.sender, _title, _timestamp, _location, _description, _fileHash, _hashtag);
        idTracker.increment();
    }

    function mint(uint256 _id, address _who, uint[] memory _title, uint256 _timestamp, Coordinate memory _location, uint[] memory _description, string memory _fileHash, uint[] memory _hashtag) internal {
        Certificate memory _certificate = Certificate({
            id: _id,
            account: _who,
            title: _title,
            timestamp: _timestamp,
            location: _location,
            description: _description,
            fileHash: _fileHash,
            hashtag: _hashtag,
            issuedAt: block.timestamp
        });
        certificates[_id] = _certificate;

        _safeMint(_who, _id);
        emit Mint(_id, _who, _title, _timestamp, _location, _description, _fileHash, _hashtag);
    }

    function getCertificate(uint256 _id) external view returns (Certificate memory){
        return certificates[_id];
    }

    function getCertificates() external view returns (uint256[] memory, Certificate[] memory) {
        uint256[] memory _ids = new uint256[](balanceOf(msg.sender));
        Certificate[] memory _certificates = new Certificate[](balanceOf(msg.sender));
        for (uint i = 0; i < balanceOf(msg.sender); i++) {
            uint256 _id = tokenOfOwnerByIndex(msg.sender, i);
            _ids[i] = _id;
            _certificates[i] = certificates[_id];
        }
        return (_ids, _certificates);
    }
}
