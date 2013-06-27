/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 6/26/13
 * Time: 3:14 PM
 * To change this template use File | Settings | File Templates.
 */



var Child = function(balance, name, username, password, emailAddress, birthday, allowance) {
   this.balance = balance;
   this.name = name;
   this.username = username;
   this.password = password;
   this.emailAddress = emailAddress;
   this.birthday = birthday;
   this.allowance = allowance;
   this.products = [];
   this.tasks = [];

   this.addProduct = function(productId) {
      products.push(productId);
   };

   this.addTask = function(taskId) {
      tasks.push(taskId);
   };
};
