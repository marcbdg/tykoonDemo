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
var currentChild;

var transitionToStartTasks = function(e) {

   // populate main data object
   var name = $('#getStartedFormChildFirstName').val();
   var birthdayString = $('#getStartedFormChildBirthday').val();
   // -1 on month, apparently 0-based for months
   var birthday = new Date(parseInt(birthdayString.substring(0,4)), parseInt(birthdayString.substring(5,7))-1, parseInt(birthdayString.substring(8)));
   var gender = $('#getStartedFormChildGender').val();
   var child = new Child(0, name, '', '', '', birthday, 0, gender);
   tykoonData.parent.children.push(child);
   
   currentChild = child;
   populateTasksWithChild(child);
};

var populateTasksWithChild = function(child) {
  //populate page with child data
  $(".childFirstName").html(child.name);
  $(".childAge").html(child.getAge());
  $(".childGender").html(child.getGenderNoun());

  //clean page and populate page with tasks from catalog
 $('#startTasks .taskCatalog .tasks').empty();
 var taskTemplate = $("#startTasks .taskCatalog .taskTemplate .taskItem")[0];
  for(var i in cannedTasks.tasks) {
    var task = cannedTasks.tasks[i];
    if ((task.gender == "b" || task.gender == child.gender) && (child.getAge() >= task.ageRange.min && child.getAge() <= task.ageRange.max)) {
      var taskItem = $(taskTemplate).clone()
      $(taskItem).find(".title").html(task.name);
      $(taskItem).find(".numKids span").html(task.numPeople);
      // var html = '<div class="taskItem"><div class="title">' + task.name + '</div><div class="numKids">' + task.numPeople + ' kids are doing this</div></div>';
      $('#startTasks .taskCatalog .tasks').append($(taskItem));
    }
  }
};

/* ======== TEST DATA, comment me out to run for real =========== 

var testBdayString = '2006-10-29';
var testBirthday = new Date(parseInt(testBdayString.substring(0,4)), parseInt(testBdayString.substring(5,7))-1, parseInt(testBdayString.substring(8)));
currentChild = new Child(0, 'Kaiya', '', '', '', testBirthday, 0, 'f');
tykoonData.parent.children.push(currentChild);
populateTasksWithChild(currentChild);

/* ======== END TEST DATA  ============================ */
