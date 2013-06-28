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

   this.getAge = function() {
      var calcAge = 0;
      var now = new Date();

      var birthday = this.birthday;

      if (now.getMonth() < birthday.getMonth()) {
         calcAge = now.getFullYear() - birthday.getFullYear() - 1;
      } else {
         if (now.getMonth() > birthday.getMonth()) {
            calcAge = now.getFullYear() - birthday.getFullYear();
         } else {
            if (now.getMonth() == this.birthday.getMonth() && now.getDay() < this.birthday.getDay()) {
               calcAge = now.getFullYear() - birthday.getFullYear() - 1;
            } else {
               calcAge = now.getFullYear() - birthday.getFullYear();
            }
         }
      }
      return calcAge;
   }
   
   this.getGenderNoun = function() {
     return (this.gender == "m") ? "boy" : "girl";
   }
};
