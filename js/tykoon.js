/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 6/26/13
 * Time: 1:33 PM
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
   $("#getStartedFormSubmit").on("click", function(e){
      var name = $('#getStartedFormChildFirstName').val();
      var birthday = $('#getStartedFormChildBirthday').val();
      var child = new Child(0, name, '', '', birthday, 0);
      tykoonData.parent.children.push(child);
      
      $(".childFirstName").html(child.name);
   });
});

var tykoonData = {
   parent: {
      children: []
   }
};
