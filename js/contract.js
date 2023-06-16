//讀取合約的以太幣餘額
async function contract_getContractBalance(contract)
{
    try {
        var data = await contract.methods.getContractBalance().call();
        return data;
    } catch (error) {
        console.log(error);
        alert("執行getContractBalance失敗");
    }
}

//讀取帳號歷史賺賠
async function get_PL(contract,address){
    try{
        var data = await contract.methods.getPL(address).call();
        return data;
    } catch (error){
        alert("fail to get PL");
    }
}

//下注(確認是否有籌碼下注)
async function tranBet(contract,account,amount){
    try{
        var data = await contract.methods.tranBet(amount).send({from:account});
    } catch (error){
        alert("fail to bet!");
    }
}

//下注（判斷有沒有中獎，和發幣）//(contract,acc,下注金額陣列,下注號碼陣列,開獎號碼)
async function Bet(contract,account,amount,number,random){
    try{
        await contract.methods.Bet(amount,number,random).send({from:account});
    } catch (error){
        alert("error to bet");
    }
}

//讀取帳戶遊戲幣餘額
async function balance(contract,account,address)
{
    try {
        var data= await contract.methods.balanceOf(address).call({from:account});
        return data;
    } catch (error) {
        console.log(error);
        alert("balanceof失敗");
    }
}

//新連線的帳戶得10遊戲代幣
async function get10token(contract,account){
    try{
       var data= await contract.methods.get10token().send({from:account});
    } catch(error){
        console.log(error)
        alert(error);
    }
}

//用乙太幣買遊戲代幣
async function buyTokens(contract,account,amount){
    try{
        var data=  await contract.methods.buyTokens(amount).send({from:account});
    }catch(error){
        console.log(error);
        alert('fail to buy');
    }
}

//合約代幣總發行量
async function getTotalSupply(contract)
{
    try {
        var data= await contract.methods.balanceOf("0xcCB6eF06Aa0435d7998C65f806318Bd0f9098CE2").call({from:"0xcCB6eF06Aa0435d7998C65f806318Bd0f9098CE2"});
        return data;
    } catch (error) {
        console.log(error);
        alert("getTotalSupply 失敗");
    }
}

//查詢個人歷史資料
async function getHistory(contract, account)
{
    try{
        var data = {};
        data = await contract.methods.getInfoByAccount(account).call({from: account});
        console.log("getHistory", data);
        return data;
    }catch(error)
    {
        console.log(error);
        alert("getInfoByAccount失敗");
    }
}
//抓單局損益
async function getsinglePL(contract,account){
    try{
        var data = await contract.methods.getsinglePL(account).call();
        return data;
    }catch(error){
        alert(error);
    }
}