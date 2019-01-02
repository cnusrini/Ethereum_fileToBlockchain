pragma solidity ^0.5.0;

contract SimpleStorage {
  string ipfshashRef;

  function set(string memory x) public {
    ipfshashRef = x;
  }

  function get() public view returns (string memory) {
    return ipfshashRef;
  }
}
