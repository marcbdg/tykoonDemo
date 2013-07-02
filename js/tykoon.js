/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 6/26/13
 * Time: 1:33 PM
 * To change this template use File | Settings | File Templates.
 */

//http://stackoverflow.com/questions/5937339/ipad-safari-make-keyboard-disappear
var hideKeyboard = function() {
   document.activeElement.blur();
   $("input").blur();
};

$(document).ready(function() {
   $('#tour').bind('resize', function(event) {
      $('#tour').css({'height': 768});
      $('#tour').css({'width': 1024});
      //alert('orientation change');
   });
   
   // Adjust element sizes based on the window size
   if ($(window).height() > 672) {   // FULLSCREEN ipad landscape
     $("#startTasks .taskCatalog .tasks").css("height","483px");
   } else {  // BROWSER bars ipad landscape
     $("#startTasks .taskCatalog .tasks").css("height","410px");
   }
   
   // Set so birthday can't be past today
   $("#getStartedFormChildBirthday").attr("max", dateToYMD(new Date()));

   $('#getStartedFormChildBirthday').on('click', function(e) {
      hideKeyboard();
      $('#getStartedFormChildBirthday').focus();
   });

   $("#getStartedForm").submit(function(e){
     $("#getStartedForm .error").hide();
      transitionToStartTasks(e);
      return false;
   });

   $("#doneWithTasksButton").on("click", function(e){ 
      transitionToStartGoals(e);
   });
   
   $('#configureTasksRepeats').on('change', function(e) {
      swapConfigureTasksRepeats(e);
   })

   $('#configureRepeatPayment').on('change', function(e) {
      swapConfigureRepeatPayment(e);
   });
   $('#configureNonRepeatPayment').on('change', function(e) {
      swapConfigureNonRepeatPayment(e);
   });
   $("#configureTaskForm").submit( function(e) {
     $("#configureTaskForm .error").hide();
     addConfiguredTaskToChild(e);
     return false;
   });

   $('#filterListContent').jplist({
      items_box: '.tasks',
      item_path: '.taskItem',
      panel_path: '.filterPanel',
      cookies: true,
      redraw_callback: function() {
         $("#startTasks .taskCatalog .taskItem").on("click", function(e){
            configureTasks(e);
         });
      }
   });

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
   var errors = false;

   if (name == "") {
     $("#noNameError").show("fast");
     errors = true;
   }
   if (birthdayString == "") {
     $("#noBirthdayError").show("fast");
     errors = true;
   }
   if (errors) {
     return false;
   }
   
   // -1 on month, apparently 0-based for months
   var birthday = new Date(parseInt(birthdayString.substring(0,4)), parseInt(birthdayString.substring(5,7))-1, parseInt(birthdayString.substring(8)));
   var gender = $("input:radio[name='getStartedFormChildGender']:checked").val();
   var child = new Child(0, name, '', '', '', birthday, 0, gender);
   tykoonData.parent.children.push(child);
   
   currentChild = child;
   populateTasksForChild(child);

   $.mobile.navigate( "#startTasks" );
};

var configureTasks = function(e) {
   // FInd the task clicked on and collect it's data
   var taskltem = $(e.currentTarget),
      taskName = $(taskltem).find(".title").text(),
      taskId = $(taskltem).attr("data-taskId");

   // populate the popup disclosure and show it
   $('#configureTasks .taskTitle').html(taskName).attr("data-taskId",taskId);
   // set due date of today or later
   $("#configureTasksDueDate").attr("min", dateToYMD(new Date()));
   
   $("#configureTasks").popup().popup("open", {transition: "pop"} );
   
   // reset the form before opening
   $("#configureTaskRepeatsYes, #configureRepeatPaymentAllow, #configureNonRepeatPaymentMoney" ).prop( "checked", true ).checkboxradio( "refresh" );
   $("#configureTaskRepeatsNo, #configureRepeatPaymentResp, #configureNonRepeatPaymentResp, #configureTasksWeeklyOn input[type='checkbox']" ).prop( "checked", false ).checkboxradio( "refresh" );
   $("#configureTasksHowMuch, #configureTasksDueDate").val("");
   swapConfigureTasksRepeats();
};

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

var addConfiguredTaskToChild = function(e) {
  var taskTitle = $("#configureTasks .taskTitle").html(),
    taskId = $("#configureTasks .taskTitle").attr("data-taskId"),
    currentTask = new Task(taskId, taskTitle, [], '', '', '');  // new Task(id, name, repeatDays, payType, payAmt, dueDate);
  
  // If repeating task, collect repeatDays and paymentType
  var repeats = $("input:radio[name='configureTasksRepeats']:checked").val();
  if ( repeats == "1") {
    
    // add to 'repeatDays' array the days it repeats
    var weekDays = $("#configureTasksWeeklyOn input[type='checkbox']");
    for (i in weekDays) {
      var day = weekDays[i];
      if (day.hasOwnProperty('type') && day.checked) {
        currentTask.repeatDays.push($(day).val());
      }
    }
    // check for length of repeatDays
    if  (!currentTask.repeatDays.length) {
      $("#pickADay").show("fast");
      return false;
    }
    
    var paymentType = $("input:radio[name='configureRepeatPayment']:checked").val();
    currentTask.payType = paymentType;
    
  // Otherwise just collect payment type/amount and optional due date
  } else {
    var paymentType = $("input:radio[name='configureNonRepeatPayment']:checked").val();
    currentTask.payType = paymentType;
    if (paymentType == "money") {
      var moneyAmount = $("#configureTasksHowMuch").val();
      if (moneyAmount == "" || moneyAmount == "0") {
        $("#enterTaskMoney").show("fast");
        return false;
      }
      currentTask.payAmt = moneyAmount;
    }
    
    // due date
    var dueDateString = $('#configureTasksDueDate').val();
    if (dueDateString != "") {
      var dueDate = new Date(parseInt(dueDateString.substring(0,4)), parseInt(dueDateString.substring(5,7))-1, parseInt(dueDateString.substring(8)));
      currentTask.dueDate = dueDate;
    }
  }
  
  currentChild.tasks.push(currentTask);
  $("#configureTasks" ).popup( "close" );
  
  // move and update the task
  var taskUI = $(".taskItem[data-taskId = '" + taskId + "']")
  $(taskUI).appendTo("#startTasks .selectedTasks");
  $(taskUI).find(".numKids").addClass("taskSettings").removeClass("numKids").html("<span class='recurrance'>" + getTaskRecurrance(currentTask) + "</span> <span class='payment'>" + getTaskPay(currentTask) + "</span>");
  $(taskUI).find(".addButton").remove();
};

var getTaskRecurrance = function(task) {
  if (task.repeatDays.length > 0) {   // repeating tasks
    return "↻ every " + task.repeatDays.join(", ");
  } else {    // non-repeating tasks
    if (task.dueDate != "") {
      return "<strong>By:</strong> " + task.dueDate;
    } else {
      return "one time";
    }
  }
};
var getTaskPay = function(task) {
  if (task.payType == "money") {
    return "<span class='money'>$" + task.payAmt + "</span>";
  } else {
    return "<span class='" + task.payType + "'>" + task.payType + "</span>";
  }
};

var populateTasksForChild = function(child) {
  //populate page with child data
  $(".childFirstName").html(child.name);
  $(".childAge").html(child.getAge());
  $(".childGender").html(child.getGenderNoun());
  $(".childPossesivePronoun").html(child.getPossesivePronoun());

  //clean page and populate page with tasks from catalog
 $('#startTasks .taskCatalog .tasks').empty();
 var taskTemplate = $("#startTasks .taskCatalog .taskTemplate .taskItem")[0];
  for(var i in cannedTasks.tasks) {
    var task = cannedTasks.tasks[i];
    if ((task.gender == "b" || task.gender == child.gender) && (child.getAge() >= task.ageRange.min && child.getAge() <= task.ageRange.max)) {
      var taskItem = $(taskTemplate).clone();
      $(taskItem).attr("data-taskId", task.id);
      $(taskItem).find(".title").html(task.name);
      $(taskItem).find(".numKids span").html(task.numPeople);
      $('#startTasks .taskCatalog .tasks').append($(taskItem));
    }
  }
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
  $(".cover").addClass("leftCover"); //.css("left","0");
  
  $(".addGoalContent, .startGoalsFooter").delay(400).fadeIn(200);
};

var populateProductsForChild = function(child) {

  //clean page and populate page with tasks from catalog
 $('#startTasks .productCatalog .goals').empty();
 var productTemplate = $("#startTasks .productCatalog .productTemplate .productItem")[0];
  for(var i in cannedProducts.products) {
    var product = cannedProducts.products[i];
    if ((product.gender == "b" || product.gender == child.gender) && (child.getAge() >= product.ageRange.min && child.getAge() <= product.ageRange.max)) {
      var productItem = $(productTemplate).clone();
      $(productItem).attr("data-productId", product.id);
      $(productItem).find(".title").html(product.name);
      $(productItem).find(".numKids span").html(product.numPeople);
      $(productItem).find(".thumbnail").attr({src: product.imgURL, alt: product.name});
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
      productName = $(productItem).find(".title").text();
  alert("tapped on: " + productName);
};



/* ======== TEST DATA, comment me out to run for real ===========  */

var testBdayString = '2006-10-29';
var testBirthday = new Date(parseInt(testBdayString.substring(0,4)), parseInt(testBdayString.substring(5,7))-1, parseInt(testBdayString.substring(8)));
currentChild = new Child(0, 'Kaiya', '', '', '', testBirthday, 0, 'f');
tykoonData.parent.children.push(currentChild);
populateTasksForChild(currentChild);

/* ======== END TEST DATA  ============================ */
