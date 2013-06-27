/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 6/26/13
 * Time: 3:14 PM
 * To change this template use File | Settings | File Templates.
 */



var Child = function(balance, name, username, password, emailAddress, birthday, allowance, gender) {
   this.balance = balance;
   this.name = name;
   this.username = username;
   this.password = password;
   this.emailAddress = emailAddress;
   this.birthday = birthday;
   this.allowance = allowance;
   this.products = [];
   this.tasks = [];
   this.gender = gender;

   this.addProduct = function(productId) {
      products.push(productId);
   };

   this.addTask = function(taskId) {
      tasks.push(taskId);
   };

   this.age = function() {
      var calcAge = 0;
      var now = new Date();

      // in a month that is after the birthday month
      if (now.getMonth > this.birthday.getMonth()) {
         calcAge = now.getFullYear() - this.birthday.getFullYear() + 1;
      } else {
         //in a month before birthday month
         if (now.getMonth < this.birthday.getMonth()) {
            calcAge = now.getFullYear() - this.birthday.getFullYear();
         } else {
            //in the same month as the birthday month
            //after (or same) birthday day
            if (now.getDay >= this.birthday.getDay()) {
               calcAge = now.getFullYear() - this.birthday.getFullYear() + 1;
            } else {
               //before birthday day
               calcAge = now.getFullYear() - this.birthday.getFullYear();
            }
         }
      }
      return calcAge;
   }
};
