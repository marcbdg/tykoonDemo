/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 7/3/13
 * Time: 12:36 PM
 * To change this template use File | Settings | File Templates.
 */

fs = require('fs');


fs.readFile('products.tsv', 'utf8', function(err, data) {
   var cannedProducts = {
      products: []
   };

   var makeArray = function(CSVData) {
      var rows = CSVData.split(/\n/);
      var cellData = [];

      for (var x in rows) {
         if (rows.hasOwnProperty(x)) {
            cellData[x] = rows[x].split(/\t/);
         }
      }

      //cellData = cleanCellData(cellData);
      return cellData;
   };

   var cellData = makeArray(data);

   for (var i in cellData) {
      if (cellData.hasOwnProperty(i)) {
         var row = cellData[i];
         var product = {
            id: Number(i),
            name: row[0],
            price: row[2],
            desc: row[3],
            type: row[4],
            numPeople: Number(row[5]),
            likes: Number(row[6]),
            ageRange: {
               min: Number(row[7]),
               max: Number(row[8])
            },
            gender: row[9],
            imgURL: row[10],
            altIMG: [row[11], row[12], row[13]]
         }
         cannedProducts.products.push(product);
      }
   }

   console.log(JSON.stringify(cannedProducts));
});
