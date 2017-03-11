/**
 * Created by jewel on 2016/12/11.
 */
module.exports.checkValid = function(board){
    // console.log(board)
    let boxs = [[],[],[],[],[],[],[],[],[]];
    for (let i = 0;i < 9 ; i++){
        let cRow = []

        if(!validRepeat(board[i])){
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