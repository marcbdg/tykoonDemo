/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 7/3/13
 * Time: 12:36 PM
 * To change this template use File | Settings | File Templates.
 */

fs = require('fs');

var makeArray = function(CSVData) {
   var rows = CSVData.split(/\n/);
   var cellData = [];

   for (var x in rows) {
      if (rows.hasOwnProperty(x)) {
         //console.log('x: ' + x + ' row: ' + rows[x]);
         cellData[x] = rows[x].split(/\t/);
      }
   }

   //cellData = cleanCellData(cellData);
   return cellData;
};

fs.readFile('products.tsv', 'utf8', function(err, data) {
   var cannedProducts = {
      products: []
   };
   var cellData = makeArray(data);
   for (var i in cellData) {
      if (cellData.hasOwnProperty(i)) {
         var DOMString = '';
         var row = cellData[i];

         //This must be kept in sync with the <div class="productTemplate"> in the index.html file
         DOMString += '<div class="productItem clearfix" data-productid="' + Number(i) + '" data-ageMin="' + Number(row[7]) + '"  data-ageMax="' + Number(row[8]) + '"  data-gender="' + row[9] + '">\n';
         DOMString += '   <div class="productImage verticalWrapper">\n';
         DOMString += '      <div class="verticalMiddle">\n';
         DOMString += '         <img class="thumbnail" src="' + row[10] + '" alt="' + row[0] + '">\n';
         DOMString += '      </div>\n';
         DOMString += '      <img class="productDetailsIcon" src="img/magnifyingGlass.png">\n';
         DOMString += '   </div>\n';
         DOMString += '   <div class="productDetails">\n';
         DOMString += '      <div class="title">' + row[0] + '</div>\n';
         DOMString += '      <div class="numKids"><span class="numPpl">' + Number(row[5]) + '</span> kids saving for this</div>\n';
         DOMString += '   </div>\n';
         DOMString += '</div>\n';

         console.log(DOMString);

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
   console.log('\n');
   console.log('\n');
   console.log(JSON.stringify(cannedProducts));
   console.log('\n');
   console.log('\n');

});

fs.readFile('tasks.tsv', 'utf8', function(err, data) {
   var cannedTasks = {
      tasks: []
   };

   var cellData = makeArray(data);

   for (var i in cellData) {
      if (cellData.hasOwnProperty(i)) {
         var DOMString = '';
         var row = cellData[i];

         DOMString += '<div class="taskItem clearfix" data-taskid="' + Number(i) + '">\n';
         DOMString += '   <div class="addButton">+</div>\n';
         DOMString += '   <img class="icon" src="img/tasks/' + row[1] + '"/>\n';
         DOMString += '   <div class="taskDetails">\n';
         DOMString += '      <div class="title">' + row[0] + '</div>\n';
         DOMString += '      <div class="numKids"><span>' + row[2] + '</span> kids are doing this</div>\n';
         DOMString += '   </div>\n';
         DOMString += '</div>\n';

         console.log(DOMString);

         var task = {
            id: Number(i),
            name: row[0],
            icon: row[1],
            ageRange: {
               min: Number(row[3]),
               max: Number(row[4])
            },
            gender: row[5],
            numPeople: Number(row[2])
         }
         cannedTasks.tasks.push(task);
      }
   }

   console.log('\n');
   console.log('\n');
   console.log(JSON.stringify(cannedTasks));

});
