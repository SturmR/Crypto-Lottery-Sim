const {
  getSelectors,
  FacetCutAction,
  removeSelectors,
  findAddressPositionInFacets
} = require('../scripts/libraries/diamond.js')

const { deployDiamond } = require('../scripts/deploy.js')

const { ethers } = require("hardhat");

const { expect } = require("chai");

const path = require("path");

// require("@nomicfoundation/hardhat-chai-matchers");

describe("MyContract", function () {
  let   provider ; 
  let   myContract ; 
  let   owner ; 
  let   otherAccount ;
  let   diamondAddress ;
  let   diamondCutFacet ;
  let   diamondLoupeFacet ;
  let   ownershipFacet ;
  let   tx ;
  let   receipt ; 
  let   result ;
  const addresses = [] ; 

  beforeEach(async function () {
    provider = ethers.provider ;
    [owner, otherAccount] = await ethers.getSigners() ;
    diamondAddress = await deployDiamond("nolog") ; 

    // Load ABIs from compiled contract JSON files
    const abi1 = require(path.resolve(__dirname, 
                      "../artifacts/contracts/MyContractFacet.sol/MyContractFacet.json")).abi;
    const abi2 = require(path.resolve(__dirname, 
                      "../artifacts/contracts/diamond/facets/DiamondCutFacet.sol/DiamondCutFacet.json")).abi;
    const abi3 = require(path.resolve(__dirname, 
                      "../artifacts/contracts/diamond/facets/DiamondLoupeFacet.sol/DiamondLoupeFacet.json")).abi;
    const abi4 = require(path.resolve(__dirname, 
                      "../artifacts/contracts/diamond/facets/OwnershipFacet.sol/OwnershipFacet.json")).abi;

    // Combine the ABIs (no need to check for duplicates)
    const combinedAbi = [...abi1, ...abi2, ...abi3, ...abi4] ;

    myContract = await ethers.getContractAt(combinedAbi, diamondAddress) ;
    diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddress) ;
    diamondLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', diamondAddress) ;
    ownershipFacet = await ethers.getContractAt('OwnershipFacet', diamondAddress) ;
  });

  it("should set the owner correctly during deployment", async function () {
    expect(await myContract.owner()).to.equal(owner.address);
  });

  it("should allow the owner to enter coordinates", async function () {
    await myContract.enterCoords(1, 2, 3);

    // Check if the arrays are updated correctly
    expect(await myContract.getXArrElement(0)).to.equal(1);
    expect(await myContract.getYArrElement(0)).to.equal(2);
    expect(await myContract.getZArrElement(0)).to.equal(3);

    // Check if the sums are updated correctly
    const [xSum, ySum, zSum] = await myContract.getSums();
    expect(xSum).to.equal(1);
    expect(ySum).to.equal(2);
    expect(zSum).to.equal(3);
  });

  it("should update the sums correctly when multiple coordinates are entered", async function () {
    await myContract.enterCoords(1, 2, 3);
    await myContract.enterCoords(4, 5, 6);

    // Check sums
    const [xSum, ySum, zSum] = await myContract.getSums();
    expect(xSum).to.equal(5); // 1 + 4
    expect(ySum).to.equal(7); // 2 + 5
    expect(zSum).to.equal(9); // 3 + 6
  });

  it("should return the correct length of arrays", async function () {
    await myContract.enterCoords(1, 2, 3);
    await myContract.enterCoords(4, 5, 6);

    const length = await myContract.getArrLength();
    expect(length).to.equal(2);
  });

  it("should revert if a non-owner tries to enter coordinates", async function () {
    await expect(
        myContract.connect(otherAccount).enterCoords(1, 2, 3)
    ).to.be.revertedWith("LibDiamond: Must be contract owner");
  });

  it("should correctly handle empty state", async function () {
    const length = await myContract.getArrLength();
    expect(length).to.equal(0);

    const [xSum, ySum, zSum] = await myContract.getSums();
    expect(xSum).to.equal(0);
    expect(ySum).to.equal(0);
    expect(zSum).to.equal(0);
  });

});
