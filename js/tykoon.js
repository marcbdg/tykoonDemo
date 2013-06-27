/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 6/26/13
 * Time: 1:33 PM
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
   $('#tour').bind('resize', function(event) {
      $('#tour').css({'min-height': 768});
      $('#tour').css({'min-width': 1024});
      //alert('orientation change');

   });

   $("#getStartedFormSubmit").on("click", function(e){
      transitionToStartTasks(e);
   });
});

var tykoonData = {
   parent: {
      children: []
   }
};

var transitionToStartTasks = function(e) {

   // populate main data object
   var name = $('#getStartedFormChildFirstName').val();
   var birthdayString = $('#getStartedFormChildBirthday').val();
   // -1 on month, apparently 0-based for months
   var birthday = new Date(parseInt(birthdayString.substring(0,4)), parseInt(birthdayString.substring(5,7))-1, parseInt(birthdayString.substring(8)));
   var gender = $('#getStartedFormChildGender').val();
   var child = new Child(0, name, '', '', '', birthday, 0, gender);
   tykoonData.parent.children.push(child);

   //populate page with child data
   $(".childFirstName").html(child.name);
   $(".childAge").html(child.age());
   $(".childGender").html(child.genderNoun());

   //populate page with tasks from catalog
   for(var i in cannedTasks.tasks) {
      if (cannedTasks.tasks.hasOwnProperty(i)) {
         var task = cannedTasks.tasks(i);

         alert('task.gender: ' + task.gender);
         alert('task.age.min: ' + task.ageRange.min);
         alert('task.age.max: ' + task.ageRange.max);

         if ((task.gender == b || task.gender == child.gender) && (child.age >= task.ageRange.min && child.age <= task.ageRange.max)) {
            var html = '<div class="taskItem"><h4>' + task.name + '</h4><p>' + task.numPeople + ' kids are doing this</p></div>';
            $('#startTasks .taskCatalog').append(html);
         }
      }
   }
};
