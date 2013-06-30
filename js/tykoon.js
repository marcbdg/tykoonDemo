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

   $("#doneWithTasksButton").on("click", function(e){ 
      transitionToStartGoals(e);
   });
   
   $('#configureTasksRepeats').on('change', function(e) {
      swapConfigureTasksRepeats(e);
   })

   $('#configureRepeatPayment').on('change', function(e) {
      swapConfigureRepeatPayment(e);
   })
   $('#configureNonRepeatPayment').on('change', function(e) {
      swapConfigureNonRepeatPayment(e);
   })
   
});

var tykoonData = {
   parent: {
      children: []
   },
   currentChildIndex : 0
};
var currentChild;

var transitionToStartTasks = function(e) {

   // populate main data object
   var name = $('#getStartedFormChildFirstName').val();
   var birthdayString = $('#getStartedFormChildBirthday').val();
   // -1 on month, apparently 0-based for months
   var birthday = new Date(parseInt(birthdayString.substring(0,4)), parseInt(birthdayString.substring(5,7))-1, parseInt(birthdayString.substring(8)));
   var gender = $("input:radio[name='getStartedFormChildGender']:checked").val();
   var child = new Child(0, name, '', '', '', birthday, 0, gender);
   tykoonData.parent.children.push(child);
   
   currentChild = child;
   populateTasksForChild(child);
      
};

var configureTasks = function(e) {
   // FInd the task clicked on and collect it's data
   var taskltem = $(e.currentTarget),
      taskName = $(taskltem).find(".title").text();

   var task = new Task(0, taskName, '', '', '', '');  // new Task(id, name, repeatDays, payType, payAmt, dueDate);

   // populate the popup disclosure and show it
   $('#configureTasks .taskTitle').html(task.name);
   $("#configureTasks").popup().popup("open", {transition: "pop"} );
};

var populateTasksForChild = function(child) {
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
  
  // hook up the taps on taskItems to configure them
  $("#startTasks .taskCatalog .taskItem").on("click", function(e){
     configureTasks(e);
  });
};

var swapConfigureTasksRepeats = function(e) {
   if ($("input:radio[name='configureTasksRepeats']:checked").val() == 1) {
      $('#configureTasks .hideNonRepeat').hide();
      $('#configureTasks .hideRepeat').show();
   } else {
      $('#configureTasks .hideNonRepeat').show();
      $('#configureTasks .hideRepeat').hide();
   }
};

var swapConfigureRepeatPayment = function(e) {
   if ($("input:radio[name='configureRepeatPayment']:checked").val() == 'allowance') {
      $('#configureTasks .taskRepeatPaymentDetails .resp').hide();
      $('#configureTasks .taskRepeatPaymentDetails .allow').show();
   } else {
     $('#configureTasks .taskRepeatPaymentDetails .resp').show();
     $('#configureTasks .taskRepeatPaymentDetails .allow').hide();
   }
};
var swapConfigureNonRepeatPayment = function(e) {
   if ($("input:radio[name='configureNonRepeatPayment']:checked").val() == 'money') {
      $('#configureTasks .taskNonRepeatPaymentDetails .resp').hide();
      $('#configureTasks .taskNonRepeatPaymentDetails .money').show();
   } else {
     $('#configureTasks .taskNonRepeatPaymentDetails .resp').show();
     $('#configureTasks .taskNonRepeatPaymentDetails .money').hide();
   }
};


/* ADD GOALS section */

var transitionToStartGoals = function(e) {
  
  populateProductsForChild(currentChild);
  $(".addTaskContent, .startTasksFooter").fadeOut(200);
  
  // move the cover
  $(".cover").addClass("leftCover").css("left","0");
  
  $(".addGoalContent, .startGoalsFooter").delay(200).fadeIn(200);
}

var populateProductsForChild = function(child) {

  //clean page and populate page with tasks from catalog
 $('#startTasks .productCatalog .goals').empty();
 var productTemplate = $("#startTasks .productCatalog .productTemplate .productItem")[0];
  for(var i in cannedProducts.products) {
    var product = cannedProducts.products[i];
    if ((product.gender == "b" || product.gender == child.gender) && (child.getAge() >= product.ageRange.min && child.getAge() <= product.ageRange.max)) {
      var productItem = $(productTemplate).clone();
      $(productItem).find(".title").html(product.name);
      $(productItem).find(".numKids span").html(product.numPeople);
      $('#startTasks .productCatalog .products').append($(productItem));
    }
  }
  
  // hook up the taps on productItems to configure them
  $("#startTasks .productCatalog .productItem").on("click", function(e){
     showProductDetails(e);
  });
};

var showProductDetails = function(e) {
  var productItem = $(e.currentTarget),
      productName = $(productltem).find(".title").text();
  alert("tapped on: " + productName);
}



/* ======== TEST DATA, comment me out to run for real ===========  */

var testBdayString = '2006-10-29';
var testBirthday = new Date(parseInt(testBdayString.substring(0,4)), parseInt(testBdayString.substring(5,7))-1, parseInt(testBdayString.substring(8)));
currentChild = new Child(0, 'Kaiya', '', '', '', testBirthday, 0, 'f');
tykoonData.parent.children.push(currentChild);
populateTasksForChild(currentChild);

/* ======== END TEST DATA  ============================ */
