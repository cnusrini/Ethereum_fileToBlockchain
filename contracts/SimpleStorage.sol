pragma solidity ^0.5.0;

contract SimpleStorage {
  string ipfshashRef;
  uint public uploadTime;

  function set(string memory x) public {
    ipfshashRef = x;
    uploadTime = now;
  }

  function get() public view returns (string memory) {
    return ipfshashRef;
  }

  
}
