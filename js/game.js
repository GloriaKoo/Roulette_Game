var option;
var bet_info=[];
var value_a=[];
var number_a=[];

//下注 將下注號碼加入選單
$("#bet").click (function(){
    var number = $(".bet a.selected").text();
    console.log("number",number);
    if(number == "")
        alert("請選擇欲下注的號碼！");
    else{
        var value = $("#demo").html();
        console.log("value",value);

    var html="<option data-number="+number+" data-value="+value+">"+number+" 下注金額："+value+"</option>";
    $("#sel").append(html);
    }
    
})
//從選單中刪除
$("#del").click (function(){

    $("select option:selected").remove();

})
//開始遊玩
$("#start").click (async function(){
    
    //開始執行
    let x = document.getElementById("sel").options.length;
    if (x==0){
        alert("請選擇下注號碼")
    }
    else{
        var star = confirm('是否確定開始');
        //確定開始執行

        if (star==true){
            $("#bet_num").text("下注號碼：");
            $("#bet_amount").text("下注籌碼數：");
            $("#res_num").text("本局號碼：");
            $("#earning").text("本局賺賠：");

            var pl=[];
            //將選單資料處理成陣列
            $("#sel option").each(function(){
                var number = $(this).data("number");
                var value = $(this).data("value");
                number_a.push(number);
                value_a.push(parseInt(value));//轉成數字型態(要傳入合約中)
        
                console.log("bet-info",bet_info);
                console.log('value-a',value_a)
            })
            //將下注資訊轉成數字陣列(要傳入合約中)
            for (i=0;i<number_a.length;i++){
                if (number_a[i]=='Red'){
                    bet_info.push(38);}
                else if (number_a[i]=='Black'){
                    bet_info.push(39);}
                else if (number_a[i]=='ODD'){
                    bet_info.push(40);}
                else if (number_a[i]=='EVEN'){
                    bet_info.push(41);}
                else if (number_a[i]=='1TO18'){
                    bet_info.push(42);}
                 else if (number_a[i]=='19TO36'){
                    bet_info.push(43);}
                else if (number_a[i]=='1ST12'){
                    bet_info.push(44);}
                else if (number_a[i]=='2ND12'){
                    bet_info.push(45);}
                else if (number_a[i]=='3RD12'){
                    bet_info.push(46);}
                else if (number_a[i]=='col-3'){
                    bet_info.push(47);}
                else if (number_a[i]=='col-2'){
                    bet_info.push(48);}
                else if (number_a[i]=='col-1'){
                    bet_info.push(49);}
                else{
                    bet_info.push(parseInt(number_a[i]));}
                }
    

            console.log("N_A", number_a);
            console.log("V_A", value_a);
            //將籌碼轉給合約
            try{
                await tranBet(contract,accounts[0],value_a)
             //下移網頁轉轉盤
                $('html,body').animate({scrollTop:$('#rou').offset().top}, 400);
                $('.hand').on('click', clickHandler)
                $('.hand').click();
                $('.hand').off('click')
                console.log(result);

                //執行合約下注，紀錄賺賠
                try{
                    await Bet(contract,accounts[0],value_a,bet_info,parseInt(result));
                    pl=await getsinglePL(contract,accounts[0]);
                    console.log(pl);

                    $("#earning").text("本局賺賠："+pl[(pl.length-1)]);

                    updatelot();
                }catch (error){
                    alert(error);
                }
                //更新下注資訊
                $("#bet_num").text("下注號碼："+number_a);
                $("#bet_amount").text("下注籌碼數："+value_a);
                $("#res_num").text("本局號碼："+result);
                setTimeout("clear()",1600);
                //清空下注陣列
                bet_info=[];
                number_a=[];
                value_a=[];

            }catch (error){
                alert(error);
            }

        }
        else{
            console.log("cancel")
        }

    }
    
    

})

//當下注數字被點到，給數字增加selected狀態
$(function(){
    console.log("test");
    
    $(".bet a").click(function(){
        console.log($(this).text());
        $(".bet a").removeClass("selected");
        $(this).addClass("selected");
    })
        

})
function clear(){
//清除所有選擇資料
$("select option").remove();
number_a=[];
value_a=[];
$(".bet a").removeClass("selected");
}