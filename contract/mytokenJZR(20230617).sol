// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract  mytokenJZR {
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint private _totalSupply;
    address public ContractOwner;

    //定義name, symbol, decimals, totalSupply 等變數

    mapping(address => uint256) public balances;

    mapping(address => mapping(address => uint256)) public allowances;
    //[使用者 A 的 address][使用者 B 的 address] -> 使用者 A 給 B 多少枚代幣
    address[] private usedAddresses;
    mapping(address => bool) private addressExists; //紀錄哪個地址玩過遊戲
    mapping(address => bool) private get10eligble; //紀錄哪個地址拿過10個代幣
    mapping(address => InfoHistory) public AccountInfo;
    
    struct InfoHistory {
        uint8[] WinningNums;//開獎的號碼
        int256 PL;//總損益
        int256[] singlePL; //單次損益
        uint8[][] PredictionHistory;//下注標的歷史
        uint256[][] BetHistory;//下注金額歷史
    }


    event Transfer(address indexed from, address indexed to, uint256 value);
    //轉帳時會觸發
    event Approval(address indexed owner, address indexed spender, uint256 value);
    //使用approve時會觸發

    // This is the event that will be emitted when a bet is placed
    event BetPlaced(address indexed user, uint256 amount);
    
    // This is the event that will be emitted when a bet is won
    event BetCompleted(address indexed user, uint256 winnings,uint Number,uint256[] bet, uint8[] prediction);

    //event PrizeNumber(uint Number);
    
    constructor() {
        _name = "Joey zzz token";
        _symbol = "JZT";
        _decimals = 16;
        _totalSupply = 10000000000000000000000000000000;
        ContractOwner = msg.sender;
        balances[ContractOwner] = _totalSupply;
        
    }
    //設定代幣名稱為JZR,代號為zzero,小數點位數為5位,總量有100000枚,先把代幣給發布合約的地址

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256 balance) {
        return balances[account];
    }

    function transfer(address recipient, uint256 amount) public returns (bool) {
        require(balances[msg.sender] >= amount, "Not enough amount"); //確認 msg.sender 中有足夠代幣

        balances[msg.sender] -= amount; //扣除 msg.sender 中的代幣
        balances[recipient] += amount; // 在 recipient 中增加代幣

        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
    //發送數量為 amount 的 token 到位址 recipient ，並觸發 Transfer 事件


    function approve(address spender , uint256 value) public returns (bool){

        allowances[msg.sender][spender] = value; //顯示
        emit Approval(msg.sender, spender, value);

        return true;
    }    //授權spender可花費 value 枚JZR,並觸發 Approval ,完成回傳 true

    function transferFrom(address sender, address recipient, uint amount) public returns (bool) {
        uint allowancess = allowances[sender][msg.sender]; //確認 msg.sender 有給 sender 代幣
        uint leftAllowance  = allowancess - amount;
        require(leftAllowance >= 0 , "Not enough allowance"); 

        require(balances[sender] >= amount , "Not enough amount"); //確認 sender 中有足夠代幣

        balances[sender] -= amount;
        balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);

        return true;
    }
    //從位址 sender 發送數量為 amount 的 token 到位址 recipient ，觸發 Transfer 事件

    function allowance(address owner, address spender) public view returns(uint256 remaining){
        return allowances[owner][spender];
    } 

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    

    function markAddressAsUsed(address account) internal {
        if (!addressExists[account]) {
            usedAddresses.push(account);
            addressExists[account] = true;
        }
    }
    function getUsedAddresses() public view returns (address[] memory) {
        return usedAddresses;
    }

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    //賣幣函數
    function sell(uint256 amount) public {

        uint256 total = amount;
        require(address(this).balance >= total);		//檢查合約是否有足夠的以太幣
		uint256 totel_value = _totalSupply + balances[msg.sender]; //計算轉出帳戶和轉入帳戶的抽獎幣總額
		_totalSupply += amount;				//代幣總量-10000
		balances[msg.sender] -= amount;		//購買人的帳戶的抽獎幣增加100000
		assert(totel_value == _totalSupply + balances[msg.sender]); //檢查轉出帳戶和轉入帳戶的抽獎幣總額

        require(address(this).balance > amount, "Contract has no ether balance"); // 確保合約內有足夠的以太幣
        payable(msg.sender).transfer(amount); // 將合約的以太幣轉移到 msg.sender

        emit Sold(amount);       //合約轉帳以太幣給用戶，前面的動作都正確才執行
    }

    //買幣函數
    function buyTokens(uint256 amountBuy) public payable {
    //uint256 amountBuy = msg.value;
    require(amountBuy > 0, "You need to send some ether");
    require(amountBuy <= balances[ContractOwner], "Not enough tokens in the reserve");
    balances[msg.sender] += amountBuy;
    balances[ContractOwner] -= amountBuy;
    emit Bought(amountBuy);
    }
    
    //直接轉帳給合約也可以買幣
    receive() external payable {
        uint256 amountbuy = msg.value;
        require(amountbuy > 0, "You need to send some ether");
        require(amountbuy <= balances[ContractOwner], "Not enough tokens in the reserve");
        balances[msg.sender] += amountbuy;
        balances[ContractOwner] -= amountbuy;
        emit Bought(amountbuy);
    }
    function getAlluserInfo(address account) public view returns(InfoHistory memory){
        return AccountInfo[account];
    }
    function getInfoByAccount(address account) public view returns(InfoHistory memory){
        return AccountInfo[account];
    }
    function getWinningNums(address account) public view returns(uint8[] memory){
        return AccountInfo[account].WinningNums;
    }
    function getPL(address account) public view returns(int256){
        return AccountInfo[account].PL;
    }
    function getsinglePL(address account) public view returns(int256[] memory){
        return AccountInfo[account].singlePL;
    }
    function getPredictionHistory(address account,uint index) public view returns(uint8[] memory){
        return AccountInfo[account].PredictionHistory[index];
    }
    function getBetHistory(address account,uint index) public view returns(uint256[] memory){
        return AccountInfo[account].BetHistory[index];
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////
    function get10token() public{ //每個地址都可以獲的時10個代幣
        require(get10eligble[msg.sender] == false ,"You are not eligible");
        balances[ContractOwner] -= 10;
        balances[msg.sender] += 10;
        get10eligble[msg.sender] = true;
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////
    //轉出下注資金
    function tranBet(uint256[] memory _bet) public{
        uint256 totalBet;
        for (uint256 i = 0;i < _bet.length; i++){
            totalBet += _bet[i];
        }
        require(totalBet > 0, "Bet can't be 0");
        require(balances[msg.sender] >= totalBet, "Not enough tokens to place bet");
        transfer(ContractOwner,totalBet);

        emit BetPlaced(msg.sender,totalBet);
    }


    //下注
    function Bet(uint256[] memory _bet, uint8[] memory _prediction,uint8 random) public{
        uint256 totalBet;
        uint256 award;
        for (uint256 i = 0;i < _bet.length; i++){
            totalBet += _bet[i];
        }
        /*
        require(totalBet > 0, "Bet can't be 0");
        require(balances[msg.sender] >= totalBet, "Not enough tokens to place bet");
        transfer(ContractOwner,totalBet);*/


        for (uint i = 0;i < _prediction.length; i++){
            if(_prediction[i] < 38){
                if(_prediction[i] == random){
                award += _bet[i]*36;
                }
            }
            else if(random == 0 || random == 37){}

            else if(_prediction[i] == 38){ //猜紅色
                if(random == 1 || random == 3 || random == 5 || random == 7 || random == 9 || random == 12 || 
                random == 14 || random == 16 || random == 18 || random == 21 || random == 23 || random == 25 ||
                random == 27 || random == 28 || random == 30 || random == 32 || random == 34 || random == 36){     
                    award += _bet[i]*2;
                }
            }
            else if(_prediction[i] == 39){ //猜黑色
                if(random == 2 || random == 4 || random == 6 || random == 8 || random == 10 || random == 10 ||
                random == 13 || random == 15 || random == 17 || random == 19 || random == 20 || random == 22 || 
                random == 24 || random == 26 || random == 29 || random == 31 || random == 33 || random == 35){     
                    award += _bet[i]*2;
                }
            }
            else if(_prediction[i] == 40){ //猜單號
                if(random % 2 == 1){
                    award += _bet[i]*2;
                }
            }
            else if(_prediction[i] == 41){ //猜雙號
                if(random % 2 == 0){
                    award += _bet[i]*2;
                }
            }
            else if(_prediction[i] == 42){ //猜小
                if(random < 19){
                    award += _bet[i]*2;
                }
            }
            else if(_prediction[i] == 43){ //猜大
                if(random > 18){
                    award += _bet[i]*2;
                }
            }

            else if(_prediction[i] == 44){ //猜前
                if(random < 13){
                    award += _bet[i]*3;
                }
            }
            else if(_prediction[i] == 45){ //猜中
                if(random > 12 && random < 25){
                    award += _bet[i]*3;
                }
            }
            else if(_prediction[i] == 46){ //猜後
                if(random > 24){
                    award += _bet[i]*3;
                }
            }
            else{
                uint8 num = uint8(random % 3);
                if(num == 1 && _prediction[i] == 47){ //直行(1,4,7,…)
                    award += _bet[i]*3;
                }
                if(num == 2 && _prediction[i] == 48){ //直行(2,5,8,…)
                    award += _bet[i]*3;
                }
                if(num == 0 && _prediction[i] == 49){ //直行(3,6,9,…)
                    award += _bet[i]*3;
                }
            }
        }
       
        balances[ContractOwner] -= award;
        balances[msg.sender] += award;
        
        AccountInfo[msg.sender].PL += int256(award) - int256(totalBet);
        AccountInfo[msg.sender].singlePL.push(int256(award) - int256(totalBet));
        AccountInfo[msg.sender].WinningNums.push(random); 
        AccountInfo[msg.sender].PredictionHistory.push(_prediction);
        AccountInfo[msg.sender].BetHistory.push(_bet);
        markAddressAsUsed(msg.sender);
        emit BetCompleted(msg.sender, award, random, _bet, _prediction);
    }
}