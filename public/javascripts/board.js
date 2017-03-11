/**
 * Created by jewel on 2016/12/8.
 */
//控制输入只能是1-9数字
// $('.editable').attr("onkeyup", function(){
//     this.value=this.value.replace(/\D/g,'');
//     if(this.value > 9){
//         this.value = 9;
//     }
// })
function checkInput(input) {
    input.value = input.value.replace(/\D/g,'');
    if(input.value > 9){
        input.value = 9;
    }
}
function getboard(){
    let board = new Array(9);
    for (let i  = 0; i < 9;i++){
        let boardLine = [0,0,0,0,0,0,0,0,0];
        board[i] = boardLine
    }
    let rows = $(".row")
    for(let i = 0;i < 9;i++){
        let cells = $(rows[i]).children('.s1')
        for(let j = 0;j < 9; j++){
            let isEditable = $(cells[j]).hasClass('editable')
            let value = 0
            if (isEditable){
                console.log($(cells[j]).val())
                if($(cells[j]).val()){
                    value = $(cells[j]).val()
                }
                else {
                    value = '.'
                }
            }
            else value = $(cells[j]).html()
            board[i][j] = value;
        }
    }

    return board;
}
function checkBoard(board) {
    console.log('come into model')
    console.log(board)
    let boxs = [[],[],[],[],[],[],[],[],[]];
    for (let i = 0;i < 9 ; i++){
        let cRow = []

        if(!validRepeat(board[i])){
            console.log(board[i] + "isRepeat")
            return false
        }

        for (let j = 0;j < 9;j++){
            cRow.push(board[j][i])

            let boxId = 3 * parseInt(i / 3) + parseInt(j / 3);
            boxs[boxId].push(board[i][j])
        }

        if(!validRepeat(cRow)){
            console.log(board[i] + " crow isRepeat")
            return false
        }
    }
    for(let k = 0 ; k < 9 ; k++){
        if(!validRepeat(boxs[k])){
            console.log(boxs[k] + k + " box isRepeat")

            return false
        }
    }
    return true
}

function validRepeat(array){
    let map = [];
    for(let i = 0; i < 9 ; i++){
        if(array[i] == ".") return false;
        if(map.indexOf(array[i]) == -1){
            map.push(array[i]);
        } else {
            return false;
        }
    }
    return true;
}



$(document).ready(function () {
    //计时器
    let c = 0
    let t

    function timedCount()
    {
        $('.timePicker').html(c)
        c=c+1
        t=setTimeout(()=>{timedCount()},1000)
    }

    timedCount()

    let board = getboard()
    // let boardInfo = {
    //     "board0": board[0],
    //     "board1": board[1],
    //     "board2": board[2],
    //     "board3": board[3],
    //     "board4": board[4],
    //     "board5": board[5],
    //     "board6": board[6],
    //     "board7": board[7],
    //     "board8": board[8]
    // };

    $(".submitResult").click(function () {
        let time = $('.timePicker').html()
        let name = $('#name').val()
        console.log(name)
        let level = $('.level').html()
        if (name != "") {
            let boardInfo = {
                "board": getboard(),
                'username': name,
                'level': level,
                "time": time
            }
            console.log(boardInfo)
            $.ajax({
                type: 'POST',
                url: '/game/result',
                data: boardInfo,
                traditional: true,
                success: function (data) {
                    console.log(data.msg)
                    location.href = '/game/result'
                },
                error: function (data) {
                    console.log("网络访问出错，提交失败")
                }
            })

        }
        else{
            alert('请填写你的姓名')
        }
    })
    $(".checkResult").click(()=>{
        let board = getboard()
        console.log(board)
        if(checkBoard(board)){
            alert('正确')
        }else{
            alert("答案有错，请修改后提交")
        }
    })

})