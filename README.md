#ERC721- SNEAKER
## INTRODUCTION
This Project is about building sneaker store platform based on ERC721;
## SMART CONTRACT
Contract SneakerFactory :
* storingNewSneaker: create store new sneaker with unique Id;
* sendingSneakerToSale: sending sneaker to contract sellSneaker (which represent for sneaker store).
* setStore: should set store after deploying contract in order to implement sendingSneakerToSale().
* sellSneaker: sneakerOwner can transfer their sneaker to others.

Contract SellSneaker :
* onERC721Reveiced: after receiving tokenId, mark this tokenId as available in store.
* setPrice: set price for sneaker to sell.
* checkPrice: customers use this function to check price
* buySneaker: customers use this function to buy sneakers. 
## INSTALLATION
Install package
```
npm install
```
Compile
```
npm run compile
```
Test
```
npm run test
```

