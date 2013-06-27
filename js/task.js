/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 6/26/13
 * Time: 4:04 PM
 * To change this template use File | Settings | File Templates.
 */

var Task = function(id, name, repeatDays, payType, payAmt, dueDate) {
  this.id = id;
  this.name = name;
  this.repeatDays = repeatDays;
  this.payType = payType;
  this.payAmt = payAmt;
  this.dueDate = dueDate;
};
