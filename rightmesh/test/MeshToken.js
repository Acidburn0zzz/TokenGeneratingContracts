const MeshToken = artifacts.require("MeshToken");

contract('MeshToken', (accounts) => {
  describe('constructor', () => {
    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     */
    it('should deploy', () => {
      return MeshToken.new().then(meshToken => {
        assert.isOk(meshToken.address, "Should have a valid address");
      });
    });
  });

  describe('updateAllowedTransfers', () => {
    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. For any address default value for allowedTransfers is set to false.
     */
    it('should be false by default', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.allowedTransfers(accounts[0]).then(allowedTransfers => {
          assert.equal(allowedTransfers, false, "should not be allowed transfers by default");
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner tries to change the value of allowedTransfers for an address setting it to true.
     */
    it('should allow setting allowedTransfers to true by owner', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.updateAllowedTransfers(accounts[1], true).then(() => {
          return meshToken.allowedTransfers(accounts[1]).then(allowedTransfers => {
            assert.equal(allowedTransfers, true, "should not be allowed transfers by default");
          });
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner tries to change the value of allowedTransfers for owner address.
     * 3. Should not be allowed.
     */
    it('should not allow setting allowedTransfers to true for owner address', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.updateAllowedTransfers(accounts[0], true).then(() => {
          return meshToken.allowedTransfers(accounts[0]).then(allowedTransfers => {
            assert.equal(allowedTransfers, false, "should not be allowed transfers by default");
          });
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner tries to change the value of allowedTransfers for an address setting it to false.
     */
    it('should allow setting allowedTransfers to false by owner', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.updateAllowedTransfers(accounts[0], true).then(() => {
          return meshToken.updateAllowedTransfers(accounts[0], false).then(() => {
            return meshToken.allowedTransfers(accounts[0]).then(allowedTransfers => {
              assert.equal(allowedTransfers, false, "should not be allowed transfers by default");
            });
          });
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Non-owner tries to call the method to change the value of allowedTransfers for an address.
     */
   it('should not allow setting allowedTransfers by non-owner', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.allowedTransfers(accounts[0]).then(originalAllowedTransfers => {
          assert.equal(originalAllowedTransfers, false, "should be false by default.");
          return meshToken.updateAllowedTransfers(accounts[0], true, { from: accounts[1]}).then(() => {
            return meshToken.allowedTransfers(accounts[0]).then(allowedTransfers => {
              assert.equal(allowedTransfers, originalAllowedTransfers, "should still be set to what it was before.");
            });
          })
        });
      });
    });
  });

  describe('pause/unpause token transfers', () => {
    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. By default paused is set to true for the token.
     */
    it('should be paused by default', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.paused().then(paused => {
          assert.equal(paused, true, "should be paused by default");
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner calls unpause on the contract.
     */
    it('should allow owner to unpause', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.unpause().then(() => {
          return meshToken.paused().then(paused => {
            assert.equal(paused, false, "should be unpaused by now");
          });
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner calls unpause on the token.
     * 3. Owner calls pause on the contract.
     */
    it('should not do anything on pause', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.unpause().then(() => {
          return meshToken.pause().then(() => {
            return meshToken.paused().then(paused => {
              assert.equal(paused, false, "should be unpaused by now");
            });
          });
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Non-owner tries to call unpause on the contract.
     */
    it('should not allow non-owner to unpause the token', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.unpause({ from: accounts[1]}).then(() => {
          return meshToken.paused().then(paused => {
            assert.equal(paused, true, "should not be unpaused");
          });
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner calls unpause on the token.
     * 3. Owner tries to call unpause on already unpaused token.
     */
    it('should only allow owner to unpause when paused', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.unpause().then(() => {
          return meshToken.unpause().then(() => {
            return meshToken.paused().then(paused => {
              assert.equal(paused, false, "should be unpaused already");
            });
          });
        });
      });
    });
  });

  describe('transfer', () => {

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner mints the token
     * 3. Transfer token from one account to another should not work.
     */
    it('should not allow transfers by default', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.mint(accounts[0], 1000).then(() => {
          return meshToken.transfer(accounts[1], 1000).then(() => {
            return Promise.all([
              meshToken.balanceOf(accounts[0]),
              meshToken.balanceOf(accounts[1])
            ]).then(results => {
              assert.equal(results[0], 1000, 'sender account should still have its original balance');
              assert.equal(results[1], 0, 'receiver account should still be at 0');
            });
          });
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner mints the tokens.
     * 3. Owner unpaused token transfers.
     * 4. Transfer tokens from one account to another should not work.
     */
    it('should allow transfers when unpaused', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.mint(accounts[0], 1000).then(() => {
          return meshToken.unpause().then(() => {
            return meshToken.transfer(accounts[1], 1000).then(() => {
              return Promise.all([
                meshToken.balanceOf(accounts[0]),
                meshToken.balanceOf(accounts[1])
              ]).then(results => {
                assert.equal(results[0], 0, 'sender account should have a balance of 0 now');
                assert.equal(results[1], 1000, 'receiver account should have a balance of 1000 now');
              });
            });
          });
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner mints the tokens.
     * 3. Owner updates allowedTransfers for an address to true.
     * 4. Transfer tokens from that address to another should work.
     */
    it('should allow transfers when paused for an address that is allowedTransfers', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.mint(accounts[1], 1000).then(() => {
          return meshToken.updateAllowedTransfers(accounts[1], true).then(() => {
            return meshToken.transfer(accounts[0], 1000, { from: accounts[1] }).then(() => {
              return Promise.all([
                meshToken.balanceOf(accounts[0]),
                meshToken.balanceOf(accounts[1]),
              ]).then(results => {
                assert.equal(results[0], 1000, 'should have the balance of 1000 tokens by now');
                assert.equal(results[1], 0, 'should have the balance of 0 tokens by now');
              });
            });
          });
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner mints the tokens.
     * 3. Owner updates allowedTransfers for an address to true.
     * 4. Owner updates allowedTransfers for the same address to false.
     * 5. Transfer tokens from that address to another should not work.
     */
    it('should not allow transfers when paused for an address that is not allowedTransfers', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.mint(accounts[1], 1000).then(() => {
          return meshToken.updateAllowedTransfers(accounts[1], true).then(() => {
            return meshToken.updateAllowedTransfers(accounts[1], false).then(() => {
              return meshToken.transfer(accounts[0], 1000, { from: accounts[1] }).then(() => {
                return Promise.all([
                  meshToken.balanceOf(accounts[0]),
                  meshToken.balanceOf(accounts[1]),
                ]).then(results => {
                  assert.equal(results[0], 0, 'should have the balance of 0 tokens still');
                  assert.equal(results[1], 1000, 'should have the balance of 1000 tokens still');
                });
              });
            });
          });
        });
      });
    });
  });

  describe('mint', () => {
    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner mints the tokens.
     * 3. Minting should succeed by default.
     */
    it('should allow minting by default', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.mint(accounts[0], 1000).then(() => {
          return meshToken.balanceOf(accounts[0]).then(balance => {
            assert.equal(balance, 1000, 'should have the balance of 1000 tokens by now');
          });
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner paused the tokens.
     * 3. Owner mints the tokens.
     * 4. Minting should still work.
     */
    it('should allow minting when paused', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.pause().then(() => {
          return meshToken.mint(accounts[0], 1000).then(() => {
            return meshToken.balanceOf(accounts[0]).then(balance => {
              assert.equal(balance, 1000, 'should have the balance of 1000 tokens by now');
            });
          });
        });
      });
    });

    /**
     * Scenario:
     * 1. Token contract is deployed successfully.
     * 2. Owner paused the tokens.
     * 3. Owner unpaused the tokens.
     * 4. Owner mints the tokens.
     * 5. Minting should still work.
     */
    it('should allow minting when unpaused', () => {
      return MeshToken.new().then(meshToken => {
        return meshToken.pause().then(() => {
          return meshToken.unpause().then(() => {
            return meshToken.mint(accounts[0], 1000).then(() => {
              return meshToken.balanceOf(accounts[0]).then(balance => {
                assert.equal(balance, 1000, 'should have the balance of 1000 tokens by now');
              });
            });
          });
        });
      });
    });

  });
});
