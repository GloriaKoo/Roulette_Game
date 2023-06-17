var web3;
var contract = null;
var contract_address = '0xA5082d0C0612aCc78CF24A887bcded7f2986D919';
var accounts;
$(async function () {
    console.log("ethereum", window.ethereum);
    if (typeof window.ethereum !== "undefined") {
        //檢查瀏覽器是否已安裝MetaMask
        try {
            accounts = await ethereum.request({
                method: "eth_requestAccounts", //MetaMask請求用戶授權, 連結會登入到MetaMask
            });
            console.log("accounts", accounts);
            $("#acc").text("帳戶：" + accounts[0]);
            $("#account_address").val(accounts[0]);
            web3 = new Web3(window.ethereum); //web3初始化

            updateWeb3Information();
            updateWeb3Account(accounts[0]);
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert("未安裝 MetaMask!");
    }

    //連結合約
    console.log("contract_address", contract_address);
    if (contract_address) {
        contract = createContract(contract_address);
    }
});

//錢包連結區塊鏈
ethereum.on("connect", async function (connectInfo) {
    console.log("connect", connectInfo);
});

//錢包切換網路
ethereum.on("chainChanged", function (chainId) {
    console.log("chain id", chainId);
    window.location.reload();
});

//錢包切換帳戶
ethereum.on("accountsChanged", function (accounts) {
    console.log("accountsChanged", accounts);
    updateWeb3Account(accounts[0]);
});

//網頁重整時
async function updateWeb3Information() {
    $("#web3_version").html(web3.version);
    console.log("providers", web3.providers);
    console.log("given provider", web3.givenProvider);

    var block_number = await web3.eth.getBlockNumber(); //查詢目前的區塊編號
    console.log("Block Number", block_number);
}

//設定web3使用的帳戶
async function updateWeb3Account(account) {
    web3.eth.defaultAccount = account; //設定web3使用的帳戶

    $("#contract_address").val(contract_address);
    var contract_balance = await web3.eth.getBalance(contract_address);
    $('#contract_eth_balance').val(web3.utils.fromWei(contract_balance, 'ether'));
    var total_supply = await getTotalSupply(contract);
    $("#contract_lot_balance").val(total_supply);

    var balance = await web3.eth.getBalance(web3.eth.defaultAccount); //查詢帳戶的以太幣餘額
    console.log("balance", balance);
    $('#account_eth_balance').val(web3.utils.fromWei(balance, 'ether'));
    updateHistory();
}

//建立智能合約實體
function createContract(address) {
    contract = new web3.eth.Contract(con_ABI, address);
    console.log("contract", contract);
    if (contract) {
        try {
            get10token(contract, accounts[0]);
        } catch (error) {
            alert(error);
        }
        updatelot();
        updateHistory();
    }
    return contract;

}

//更新帳戶遊戲幣餘額
async function updatelot() {
    if (contract) {
        var lot = await balance(contract, accounts[0], accounts[0]);
        console.log("lot=", lot);
        $("#account_lot_balance").val(lot);
    }

}

//更新購買籌碼(1:1)
async function UpdateBuyLot() {
    $("#buy_lot").val("");
    try {
        var eth = $("#buy_eth").val();
        var lot = eth;
        $("#buy_lot").val(lot);
    } catch (error) {
        alert(error);
    }
}

//更新歷史資料
async function updateHistory() {
    $("#History").empty();
    var history = {};
    var bet_history = []; //下注紀錄
    var lot_history = []; //下注籌碼數
    var random_num = []; //開獎號碼
    var pl_history; //歷史累積損益
    

    try {
        history = await getHistory(contract, accounts[0]);
    } catch (error) {
        alert(error);
    }
    console.log("HIstory: ", history);
    bet_history = history[3];
    lot_history = history[4];
    random_num = history[0];
    pl_history = history[1];
    single_PL = history[2];  //單局損益
    /*console.log("bet_history", bet_history);
    console.log("lot_history", lot_history);
    console.log("random_num", random_num);
    console.log("pl_history", pl_history);*/

    for (i = 0; i < bet_history.length; i++) {

        /*
        if(bet_history[i]=='38'){
            bet_history[i]=="Red";
        }
        */
        var item = "<tr>";
        item += "<td>" + (i + 1) + "</td>";
        var b_h=[];
        for (j = 0; j < bet_history[i].length; j++) {
                tmp_bh = bet_history[i];
                if( parseInt(tmp_bh[j]) > 37 ){
                    if ( tmp_bh[j] == "38"){
                        b_h.push("Red");
                    }
                    else if( tmp_bh[j] == "39"){
                        b_h.push("Black");
                    }
                    else if( tmp_bh[j] == "40"){
                        b_h.push("ODD") ;
                    }
                    else if( tmp_bh[j] == "41"){
                        b_h.push("EVEN");
                    }
                    else if( tmp_bh[j] == "42"){
                        b_h.push("1TO18");
                    }
                    else if( tmp_bh[j] == "43"){
                        b_h.push("19TO36");
                    }
                    else if( tmp_bh[j] == "44"){
                        b_h.push("1ST12");
                    }
                    else if( tmp_bh[j] == "45"){
                        b_h.push("2ND12");
                    }
                    else if( tmp_bh[j] == "46"){
                        b_h.push("3RD12");
                    }
                    else if( tmp_bh[j] == "47"){
                        b_h.push("col-3");
                    }
                    else if( tmp_bh[j] == "48"){
                        b_h.push("col-2");
                    }
                    else if( tmp_bh[j] == "49"){
                        b_h.push("col-1") ;
                    }
                }
                else{
                    b_h.push(tmp_bh[j]) ;
                }
            }item += "<td>" + b_h + "</td>";
            
        item += "<td>" + lot_history[i] + "</td>";
        item += "<td>" + random_num[i] + "</td>";
        item += "<td>" + single_PL[i] + "</td>";
        item += "</tr>";
        $("#History").append(item);
    }
    var item = "<tr>";
    item += "<td colspan=4>" + "累積盈虧 " + "</td>";
    if (pl_history < 0) {
        item += "<td style=color:red>" + pl_history + "</td>";
    }
    else {

        item += "<td style=color:blue>" + pl_history + "</td>";
    }
    item += "</tr>";
    $("#History").append(item);


}

