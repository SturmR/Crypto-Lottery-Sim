pragma solidity ^0.8.0;

// SPDX-License-Identifier: UNLICENSED

import './diamond/Diamond.sol';

library LibMyContractStorage {
    bytes32 constant MYCONTRACT_STORAGE_POSITION =
        keccak256('diamond.storage.MyContractStorage.v1');

    struct MyContractData {
       uint[] xarr  ; 
       uint[] yarr  ; 
       uint[] zarr  ; 
       uint xsum    ; 
       uint ysum    ; 
       uint zsum    ; 
    }

    function mycontractStorage() internal pure returns (MyContractData storage md)  {

        bytes32 position = MYCONTRACT_STORAGE_POSITION ;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            md.slot := position
        }
    }

}

contract MyContractFacet {

    function initialize() public {
      LibMyContractStorage.MyContractData
            storage mycontractdata = LibMyContractStorage.mycontractStorage();
      mycontractdata.xsum = 0 ; 
      mycontractdata.ysum = 0 ;
      mycontractdata.zsum = 0 ; 
    }

    function enterCoords(uint _x,uint _y,uint _z) public {

      LibDiamond.enforceIsContractOwner();

      LibMyContractStorage.MyContractData
            storage mycontractdata = LibMyContractStorage.mycontractStorage();

      mycontractdata.xarr.push(_x) ; 
      mycontractdata.yarr.push(_y) ; 
      mycontractdata.zarr.push(_z) ; 

      mycontractdata.xsum += _x ; 
      mycontractdata.ysum += _y ; 
      mycontractdata.zsum += _z ; 

    }

    function getXArrElement(uint i) public view returns(uint) {
      LibMyContractStorage.MyContractData
            storage mycontractdata = LibMyContractStorage.mycontractStorage();
      require(i < mycontractdata.xarr.length, "Invalid index") ; 
      return(mycontractdata.xarr[i]) ; 
    }

    function getYArrElement(uint i) public view returns(uint) {
      LibMyContractStorage.MyContractData
            storage mycontractdata = LibMyContractStorage.mycontractStorage();
      require(i < mycontractdata.yarr.length, "Invalid index") ; 
      return(mycontractdata.yarr[i]) ; 
    }

    function getZArrElement(uint i) public view returns(uint) {
      LibMyContractStorage.MyContractData
            storage mycontractdata = LibMyContractStorage.mycontractStorage();
      require(i < mycontractdata.zarr.length, "Invalid index") ; 
      return(mycontractdata.zarr[i]) ; 
    }

    function getArrLength() public view returns(uint) {
      LibMyContractStorage.MyContractData
            storage mycontractdata = LibMyContractStorage.mycontractStorage();
      return(mycontractdata.xarr.length) ; 
    }

    function getSums() public view returns(uint,uint,uint) {
      LibMyContractStorage.MyContractData
            storage mycontractdata = LibMyContractStorage.mycontractStorage();
      return(mycontractdata.xsum,mycontractdata.ysum,mycontractdata.zsum) ; 
    }

}
