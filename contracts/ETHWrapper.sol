// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./WETH.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ETHWrapper {
    WETH public WETHToken;
    using Strings for string;

    event LogETHWrapped(address sender, uint256 amount);
    event LogETHUnwrapped(address sender, uint256 amount);
    event LogEthWrappedFromSignedMessage(address receiver, address caller, uint256 amount);

    constructor() {
        WETHToken = new WETH();
    }

    function wrap() public payable {
        require(msg.value > 0, "We need to wrap at least 1 wei");
        WETHToken.mint(msg.sender, msg.value);
        emit LogETHWrapped(msg.sender, msg.value);
    }

    function unwrap(uint256 value) public {
        require(value > 0, "We need to unwrap at least 1 wei");
        WETHToken.transferFrom(msg.sender, address(this), value);
        WETHToken.burn(value);
        payable(msg.sender).transfer(value);
        emit LogETHUnwrapped(msg.sender, value);
    }

    function isSigned(address _address, bytes32 messageHash, uint8 v, bytes32 r, bytes32 s) internal pure returns (bool) {
        return _isSigned(_address, messageHash, v, r, s) || _isSignedPrefixed(_address, messageHash, v, r, s);
    }

    /// @dev Checks unprefixed signatures.
    function _isSigned(address _address, bytes32 messageHash, uint8 v, bytes32 r, bytes32 s)
        internal pure returns (bool)
    {
        return ecrecover(messageHash, v, r, s) == _address;
    }

    /// @dev Checks prefixed signatures.
    function _isSignedPrefixed(address _address, bytes32 messageHash, uint8 v, bytes32 r, bytes32 s)
        internal pure returns (bool)
    {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        return _isSigned(_address, keccak256(abi.encodePacked(prefix, messageHash)), v, r, s);
    }

    function wrapWithSignature(bytes32 hashedMessage, uint8 v, bytes32 r, bytes32 s, address receiver) public payable {
        require(msg.value > 0, "We need to wrap at least 1 wei");
        
        require(isSigned(receiver, hashedMessage, v, r, s), "Receiver has not signed the message");
                
        WETHToken.mint(receiver, msg.value);
        emit LogEthWrappedFromSignedMessage(receiver, msg.sender, msg.value);
    }

    receive() external payable {
        wrap();
    }

    fallback() external payable {
        wrap();
    } 
}
