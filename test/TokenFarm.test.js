const { assert } = require('chai');

const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
  .use(require('chai-as-promised'))
  .should()

  function tokens(n){
      return web3.utils.toWei(n,'ether');
  }




    contract('TokenFarm', ([owner, investor])=>{
      let daiToken, dappToken, tokenFarm
 
      before(async()=>{
          // load contract
          daiToken = await DaiToken.new()
          dappToken = await DappToken.new()
          tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)
          //  transfer all Dapp token to farm (1 mill)
          await dappToken.transfer(tokenFarm.address, tokens('1000000'))
          // Send token to the investor
         // await daiToken.transfer(accounts[1], tokens('100'), {from : accounts[0]})
           await daiToken.transfer(investor, tokens('100'), {from : owner})      
        })



        // write tests here
       describe('Mock DAI deployment', async()=>{
           it('has a name', async()=>{
             let daiToken =await DaiToken.new()
             const name = await daiToken.name()
             assert.equal(name,'Mock DAI Token')
           })
       })
       
       describe('Dapp Token deployment', async () => {
        it('has a name', async () => {
          const name = await dappToken.name()
          assert.equal(name, 'DApp Token')
        })
      })

      describe('Token Farm deployment', async () => {
        it('has a name', async () => {
          const name = await tokenFarm.name()
          assert.equal(name, 'SCV Token Bank')
        })
    
        it('contract has tokens', async () => {
          let balance = await dappToken.balanceOf(tokenFarm.address)
          assert.equal(balance.toString(), tokens('1000000'))
        })
      })


    describe('Farming tokens', async ()=> {
        it('reward investor for staking mDai tokens', async () => {
           let result
           // check investor balance before staking
           result = await daiToken.balanceOf(investor)
           assert.equal(result.toString(), tokens('100'), 'investor Mock Dai wallet balance correct before staking')

                
            // Stake Mock DAI Tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
            await tokenFarm.stakeTokens(tokens('100'), { from: investor })

                    // Check staking result
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

            // Issue Tokens
            await tokenFarm.issueTokens({ from: owner })

            // Check balances after issuance
            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct affter issuance')

              // Ensure that only onwer can issue tokens
            await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

            // Unstake tokens
            await tokenFarm.unstakeTokens({ from: investor })

            // Check results after unstaking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', 'investor staking status correct after staking')

        })
    })


    })
