// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

contract VolcanoCoin is Ownable, ERC20("Volcano Coin", "VC") {
    enum PaymentType { Unknown, Basic, Refund, Dividend, GroupPayment }
    struct Payment {
        uint256 amount;
        address recipient;

        uint256 payment_id;
        uint256 timestamp;
        PaymentType payment_type;
        string comment;
    }
    uint256 private n_payments = 0;
    mapping(address => Payment[]) records;
    address private administrator;

    constructor() {
        _mint(msg.sender, 10000);
        administrator = msg.sender;
    }

    /*
    modifier PaymentExists(address add, uint id)  {
        for (uint i = 0; i < records[add].length; i++) {
            if (records[sender][i].payment_id == id) {
                _;
            }
        }
    }
    */

    modifier onlyAdmin {
        require(msg.sender == administrator);
        _;
    }

    function addSupply() public onlyOwner() {
        _mint(owner(), totalSupply());
    }

    function getRecords(address add) public view returns(Payment[] memory) {
        return records[add];
    }

    function _afterTokenTransfer(address sender, address recipient, uint amount) internal override{
        Payment memory new_payment = Payment({
            amount: amount,
            recipient: recipient,
            timestamp: block.timestamp,
            payment_id: n_payments,
            payment_type: PaymentType.Unknown,
            comment: ""
        });
        n_payments += 1; // When testing out my code, the ID started from 1 rather than 0, I'm not too sure why
        records[sender].push(new_payment);
    }


    function getPaymentDetails(address sender, uint id) public view returns(Payment memory, int256) {
        for (uint i = 0; i < records[sender].length; i++) {
            if (records[sender][i].payment_id == id) {
                return (records[sender][i], int(i));
            }
        }
        Payment memory emptyPayment;
        return (emptyPayment, -1);
    }

    function updatePaymentDetails(uint id, PaymentType payment_type, string calldata comment) public returns(bool) {
        (, int256 i) = getPaymentDetails(msg.sender, id);
        if (i < 0) {
            return false;
        } else {
            records[msg.sender][uint(i)].payment_type = payment_type;
            records[msg.sender][uint(i)].comment = comment;
            return true;
        }

    }

    function updatePaymentDetails(address sender, uint id, PaymentType payment_type, string calldata comment) public onlyAdmin returns(bool) {
        (, int256 i) = getPaymentDetails(sender, id);
        if (i < 0) {
            return false;
        } else {
            records[sender][uint(i)].payment_type = payment_type;
            records[sender][uint(i)].comment = string(abi.encodePacked(comment," updated by ",Strings.toHexString(uint256(uint160(administrator)))));
            return true;
        }
    }


}
