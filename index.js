const express = require('express')
const app = express()


const getFileData = () => {
    if (typeof require !== 'undefined') XLSX = require('xlsx');
    var workbook = XLSX.readFile('./inputs/test.xlsx');

    var first_sheet_name = workbook.SheetNames[0];
    var address_of_amount = 'N';
    var address_of_text = 'A';

    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];
    var amount = [];
    var text = [];
    var uniqueArray  = []
    var copy  = [];
    Object.keys(worksheet).forEach((pos) => {
        if (pos.search(address_of_amount) == 0) {
            var desired_cell = worksheet[pos];
            var desired_value = (desired_cell ? desired_cell.v : undefined);
            amount.push(desired_value)
        } else if (pos.search(address_of_text) == 0) {
            var desired_cell = worksheet[pos];
            var desired_value = (desired_cell ? desired_cell.v : undefined);
            text.push(desired_value)
        }
    })
    // return {
    //     "montant2" : amount ,
    //     "texte" : text
    // } 
    copy = amount
    copy.forEach((elem,pos)=>{
        if(!isDuplicates(amount,elem)){
            uniqueArray.push(elem); 
         }else
            console.log("<--", elem)
    })
    console.log("Worked: ", uniqueArray.length,  "/ " , amount.length  , )
    return uniqueArray;
}

const ec = (r, c) => {
    return XLSX.utils.encode_cell({
        r: r,
        c: c
    })
}

const isDuplicates = (data  , nb)=>{
    
    let count = 0;
    for(i=0;i<data.length;i++){
        if(data[i] + nb === 0){
            count ++
            console.log(data[i] , "---", nb,  "---->", count)
        }
    }
    if(count == 2 && count%2 == 0){
        return true;
    }
    return false;
}

const delete_row = (ws, row_index) => {
    let range = XLSX.utils.decode_range(ws["!ref"])
    for (var R = row_index; R < range.e.r; ++R) {
        for (var C = range.s.c; C <= range.e.c; ++C) {
            ws[ec(R, C)] = ws[ec(R + 1, C)]
        }
    }
    range.e.r--
    ws['!ref'] = XLSX.utils.encode_range(range.s, range.e)
}


const getAbs = (number) => {
    return Math.abs(number)
}




app.get('/', function (req, res) {
    res.json(((getFileData())))
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})