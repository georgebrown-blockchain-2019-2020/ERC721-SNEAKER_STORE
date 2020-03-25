const SneakerFactory = artifacts.require("SneakerFactory");
const truffleAssert= require("truffle-assertions");
const ethers = require("ethers");
contract("SneakerFactory", async (accounts)=> {
    let tokenId;
    let price;
    beforeEach(() => {
        //generating random tokenid and price
        tokenId= Math.floor(new Date().valueOf() * Math.random());
        price= Math.floor(Math.random()*10);
    });
    it('should update balanceOf rightly (balanceOf)', async()=>{
        const instance = await SneakerFactory.deployed({from : accounts[0]});
        const tokenBalance = await instance.balanceOf.call(accounts[0]);
        assert.equal(tokenBalance.toString(),"0", "balance should be empty when initiating");
        const mintTx = await instance.storingNewSneaker.sendTransaction(tokenId,{from: accounts[0]});
        const UpdatedTokenBalance = await instance.balanceOf.call(accounts[0]);
        assert.equal(UpdatedTokenBalance.toString(),"1", "balance did not update after minting");
    })
    it('ownerOf should return correct owner (ownerOf)', async()=>{
        const instance = await SneakerFactory.deployed({from : accounts[0]});
        const _owner = accounts[0];
        const mintTx = await instance.storingNewSneaker.sendTransaction(tokenId,{from: accounts[0]});
        const owner = await instance.ownerOf.call(tokenId);
        assert.equal(owner, _owner, "not correct owner");
    })
    it("should approve right person (approve() and getApproved())", async ()=>{
        const instance = await SneakerFactory.deployed({from : accounts[0]});
        const owner = accounts[0];
        const spender = accounts[1];
        const mintTx = await instance.storingNewSneaker.sendTransaction(tokenId,{from: accounts[0]});
        const approveTx = await instance.approve.sendTransaction(spender,tokenId,{from:accounts[0]});
        truffleAssert.eventEmitted(approveTx,"Approval",(ev)=>{
            return ev["_owner"].toString()==owner.toString()&& 
            ev["_approved"].toString() == spender.toString()
            && ev["_tokenId"].toString() == tokenId.toString()
        },"Event has to be fired")
        const approved = await instance.getApproved.call(tokenId);
        assert.equal(approved, spender, "did not approve right person");
    })
    it("approvedAll person should be able to transfer (function setApprovalForAll() and function getApproved())",async()=>{
        const instance = await SneakerFactory.deployed({from : accounts[0]});
        const owner = accounts[0];
        const spender = accounts[1];
        const recipient = accounts[2];
        const tokenId1= 1;
        const mintTx = await instance.storingNewSneaker.sendTransaction(tokenId,{from: accounts[0]});
        const mintTx1 = await instance.storingNewSneaker.sendTransaction(tokenId1,{from: accounts[0]});
        const approveAllTx = await instance.setApprovalForAll(spender,true,{from:accounts[0]})
        truffleAssert.eventEmitted(approveAllTx,"ApprovalForAll",(ev)=>{
            return ev["_owner"].toString()==owner.toString()&& 
            ev["_operator"].toString() == spender.toString()
            && ev["_approved"] == true
        },"Event has to be fired")
        const isApprovedAll = await instance.isApprovedForAll.call(owner,spender);
        assert.equal(isApprovedAll, true, "did not assign true for operator");
        const safeTransferFromTx = await instance.safeTransferFrom.sendTransaction(owner,recipient,tokenId, {from:accounts[1]})
        const safeTransferFromTx1 = await instance.safeTransferFrom.sendTransaction(owner,recipient,tokenId1, {from:accounts[1]})
        truffleAssert.eventEmitted(safeTransferFromTx,"Transfer", (ev)=>{
            return ev["_from"].toString()===owner.toString()&& 
            ev["_to"].toString() === recipient.toString()
            && ev["_tokenId"].toString() === tokenId.toString()},"Wrong transfer")
        truffleAssert.eventEmitted(safeTransferFromTx1,"Transfer", (ev)=>{
            return ev["_from"].toString()===owner.toString()&& 
            ev["_to"].toString() === recipient.toString()
            && ev["_tokenId"].toString() === tokenId1.toString()},"Wrong transfer")
    })
    it("safeTransferFrom() should transfer from sender account to destination account (safeTransferFrom and tranfer event)",async()=>{
        const instance = await SneakerFactory.deployed({from : accounts[0]});
        const owner = accounts[0];
        const spender = accounts[1];
        const recipient = accounts[2];
        const mintTx = await instance.storingNewSneaker.sendTransaction(tokenId,{from: accounts[0]});
        const approveTx = await instance.approve.sendTransaction(spender,tokenId,{from:accounts[0]});
        truffleAssert.eventEmitted(approveTx,"Approval",(ev)=>{
            return ev["_owner"].toString()==owner.toString()&& 
            ev["_approved"].toString() == spender.toString()
            && ev["_tokenId"].toString() == tokenId.toString()
        },"Unexpected event")
        const approved = await instance.getApproved.call(tokenId);
        assert.equal(approved, spender, "did not approve right person");
        const safeTransferFromTx = await instance.safeTransferFrom.sendTransaction(owner,recipient,tokenId, {from:accounts[1]})
        truffleAssert.eventEmitted(safeTransferFromTx,"Transfer", (ev)=>{
            return ev["_from"].toString()===owner.toString()&& 
            ev["_to"].toString() === recipient.toString()
            && ev["_tokenId"].toString() === tokenId.toString()},"Wrong transfer")
        const tokenOwner = await instance.ownerOf.call(tokenId);
        assert.equal(tokenOwner, recipient, "did not transfer to right person");
    })
    it("safeTranferFrom(data) should transfer from sender account to destination account", async()=>{
        const instance = await SneakerFactory.deployed({from : accounts[0]});
        const owner = accounts[0];
        const spender = accounts[1];
        const recipient = accounts[2];
        const data = ethers.utils.formatBytes32String('message');
        const mintTx = await instance.storingNewSneaker.sendTransaction(tokenId,{from: accounts[0]});
        const approveTx = await instance.approve.sendTransaction(spender,tokenId,{from:accounts[0]});
        truffleAssert.eventEmitted(approveTx,"Approval",(ev)=>{
            return ev["_owner"].toString()==owner.toString()&& 
            ev["_approved"].toString() == spender.toString()
            && ev["_tokenId"].toString() == tokenId.toString()
        },"Unexpected event")
        const approved = await instance.getApproved.call(tokenId);
        assert.equal(approved, spender, "did not approve right person");
        const safeTransferFromTx = await instance.safeDataTransferFrom.sendTransaction(owner,recipient,tokenId,data,{from:accounts[1]})
        truffleAssert.eventEmitted(safeTransferFromTx,"Transfer", (ev)=>{
            return ev["_from"].toString()===owner.toString()&& 
            ev["_to"].toString() === recipient.toString()
            && ev["_tokenId"].toString() === tokenId.toString()},"Wrong transfer")
        const tokenOwner = await instance.ownerOf.call(tokenId);
        assert.equal(tokenOwner, recipient, "did not transfer to right person");
    })
    it("supportsInterface should return false if receving invalid interface id",async()=>{
        const instance = await SneakerFactory.deployed({from : accounts[0]});
        // bytes4 constant _INTERFACE_ID_ERC721 = 0x80ac58ce;
        const isValidInterface = await instance.supportsInterface.call("0x80ac58ce");
        assert.equal(isValidInterface, false, "did not update interface id");
    })
    it("tranferFrom() should transfer from sender account to destination account", async()=>{
        const instance = await SneakerFactory.deployed({from : accounts[0]});
        const owner = accounts[0];
        const spender = accounts[1];
        const recipient = accounts[2];
        const mintTx = await instance.storingNewSneaker.sendTransaction(tokenId,{from: accounts[0]});
        const approveTx = await instance.approve.sendTransaction(spender,tokenId,{from:accounts[0]});
        truffleAssert.eventEmitted(approveTx,"Approval",(ev)=>{
            return ev["_owner"].toString()==owner.toString()&& 
            ev["_approved"].toString() == spender.toString()
            && ev["_tokenId"].toString() == tokenId.toString()
        },"Unexpected event")
        const approved = await instance.getApproved.call(tokenId);
        assert.equal(approved, spender, "did not approve right person");
        const safeTransferFromTx = await instance.transferFrom.sendTransaction(owner,recipient,tokenId, {from:accounts[1]})
        truffleAssert.eventEmitted(safeTransferFromTx,"Transfer", (ev)=>{
            return ev["_from"].toString()===owner.toString()&& 
            ev["_to"].toString() === recipient.toString()
            && ev["_tokenId"].toString() === tokenId.toString()},"Wrong transfer")
        const tokenOwner = await instance.ownerOf.call(tokenId);
        assert.equal(tokenOwner, recipient, "did not transfer to right person");
    })
})