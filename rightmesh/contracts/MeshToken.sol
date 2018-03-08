pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20/CappedToken.sol';
import 'zeppelin-solidity/contracts/token/ERC20/PausableToken.sol';

/**
 * CappedToken token is Mintable token with a max cap on totalSupply that can ever be minted.
 * PausableToken overrides all transfers methods and adds a modifier to check if paused is set to false.
 */
contract MeshToken is CappedToken, PausableToken {
  string public name = "RIGHTMESH TOKEN";
  string public symbol = "RMESH";
  uint256 public decimals = 18;
  uint256 public cap = 129498559 ether;

  /**
   * @dev variable to keep track of what addresses are allowed to call transfer functions when token is paused.
   */
  mapping (address => bool) public allowedTransfers;

  /*------------------------------------constructor------------------------------------*/
  /**
   * @dev constructor for mesh token
   */
  function MeshToken() CappedToken(cap) public {
    paused = true;
  }

  /*------------------------------------overridden methods------------------------------------*/
  /**
   * @dev Overridder modifier to allow exceptions for pausing for a given address
   * This modifier is added to all transfer methods by PausableToken and only allows if paused is set to false.
   * With this override the function allows either if paused is set to false or msg.sender is allowedTransfers during the pause as well.
   */
  modifier whenNotPaused() {
    require(!paused || allowedTransfers[msg.sender]);
    _;
  }

  /**
   * @dev overriding Pausable#pause method to do nothing
   * Paused is set to true in the constructor itself, making the token non-transferrable on deploy.
   * once unpaused the contract cannot be paused again.
   * adding this to limit owner's ability to pause the token in future.
   */
  function pause() onlyOwner whenNotPaused public {}

  /**
   * @dev modifier created to prevent short address attack problems.
   * solution based on this blog post https://blog.coinfabrik.com/smart-contract-short-address-attack-mitigation-failure
   */
  modifier onlyPayloadSize(uint size) {
    assert(msg.data.length >= size + 4);
    _;
  }

  /**
   * @dev overriding transfer method to include the onlyPayloadSize check modifier
   */
  function transfer(address _to, uint256 _value) onlyPayloadSize(2 * 32) public returns (bool) {
    return super.transfer(_to, _value);
  }

  /*------------------------------------new methods------------------------------------*/

  /**
   * @dev method to updated allowedTransfers for an address
   * @param _address that needs to be updated
   * @param _allowedTransfers indicating if transfers are allowed or not
   * @return boolean indicating function success.
   */
  function updateAllowedTransfers(address _address, bool _allowedTransfers)
  external
  onlyOwner
  returns (bool)
  {
    // don't allow owner to change this for themselves
    // otherwise whenNotPaused will not work as expected for owner,
    // therefore prohibiting them from calling pause/unpause.
    require(_address != owner);

    allowedTransfers[_address] = _allowedTransfers;
    return true;
  }
}
