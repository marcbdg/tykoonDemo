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
   // $('#tour').bind('resize', function(event) {
   //    $('#tour').css({'height': 768});
   //    $('#tour').css({'width': 1024});
   //    //alert('orientation change');
   // });
   
   // Adjust element sizes based on the window size
   if ($(window).height() > 672) {   // FULLSCREEN ipad landscape
     $("#startTasks .taskCatalog .tasks, #startTasks .productCatalog .products").css("height","483px");
   } else {  // BROWSER bars ipad landscape
     $("#startTasks .taskCatalog .tasks, #startTasks .productCatalog .products").css("height","410px");
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

   //matched pair of entering in field
   $('#addTasksFormTaskName, #addGoalFormGoalName').on('keyup', function(e) {
      watchUserFilterInput(e);
   });
   //and hitting clear button in the text input box
   $('#taskFilterContainer, #productFilterContainer').on('click', '.ui-icon-delete', function(e) {
      clearFilterTriggerPlugin(e);
   });
   // clicking the clear link in the header for results
   $('.backToPopularTasks, .backToPopularProducts').on('click', function(e) {
      clearFilterTriggerPlugin(e);
   });


   $("#startTasks .createNewTask").on("click", function(e) {
     resetConfigureTaskPopup();
     $('#configureTasks .taskTitle').html( $("#addTasksFormTaskName").val() ).attr("data-taskId","-1");
   });
   
   $("#startTasks .selectedTasks").on("click", ".taskItem", function(e) {
     restoreConfigureTaskPopup( $(e.currentTarget) );
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
      },
      no_results: '.tasksNoResults',
      ask_event: 'blah()'
   });


   $('#filterProductListContent').jplist({
      items_box: '.products',
      item_path: '.productItem',
      panel_path: '.filterProductPanel',
      cookies: true,
      redraw_callback: function() {
         // hook up the taps on productItems to configure them
         $("#startTasks .productCatalog .productItem").on("click", function(e){
            showProductDetails(e);
         });
      },
      no_results: '.productNoResults',
      ask_event: 'blah()'
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
   populateProductsForChild(child);

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
   
   resetConfigureTaskPopup();
   $("#configureTasks").popup().popup("open", {transition: "pop"} );
};

var resetConfigureTaskPopup = function(e) {
  // reset the form before opening
  $("#configureTaskRepeatsYes, #configureRepeatPaymentAllow, #configureNonRepeatPaymentMoney" ).prop( "checked", true ).checkboxradio( "refresh" );
  $("#configureTaskRepeatsNo, #configureRepeatPaymentResp, #configureNonRepeatPaymentResp, #configureTasksWeeklyOn input[type='checkbox']" ).prop( "checked", false ).checkboxradio( "refresh" );
  $("#configureTasksHowMuch, #configureTasksDueDate").val("");
  $(".taskRepeatPaymentDetails .allow, .taskNonRepeatPaymentDetails .money").show();
  $(".taskRepeatPaymentDetails .resp, .taskNonRepeatPaymentDetails .resp").hide();
  
  swapConfigureTasksRepeats();
};
var restoreConfigureTaskPopup = function(taskUI) {
  resetConfigureTaskPopup();
  var taskId = $(taskUI).attr("data-taskId"),
    title = $(taskUI).find(".taskTitle").html();

  // find the fully configured task object matching the id and title of the task tapped
 for (i in currentChild.tasks) {
   var task = currentChild.tasks[i];
   if (task.id == taskId && task.name == title) {
     
     // populate the disclosure
     $("#configureTasks").find(".taskTitle").html(task.name).attr("data-taskId",task.id);
     
      if ( task.repeatDays.length > 0) {
        $("#configureTasksRepeats input[value='1']").prop("checked",true);
        $("#configureRepeatPayment input[value='" + task.payType + "']").prop("checked",true);
        $("#configureRepeatPayment input").checkboxradio("refresh");
        for (j in task.repeatDays) {
          $("#configureTasksWeeklyOn input[value='" + task.repeatDays[j] + "']").prop("checked",true).checkboxradio("refresh");
        }
        swapConfigureRepeatPayment();
      } else {  // NON-repeating task
        $("#configureTasksRepeats input[value='0']").prop("checked",true);
        $("#configureNonRepeatPayment input[value='" + task.payType + "']").prop("checked",true);
        $("#configureNonRepeatPayment input").checkboxradio("refresh");
        if (task.payType == "money") {
          $("#configureTasksHowMuch").val(task.payAmt);
        }
        if (task.dueDate != "") {
          $("#configureTasksDueDate").val( dateToYMD(task.dueDate) );
        }
        swapConfigureNonRepeatPayment();
      }
      $("#configureTasksRepeats input").checkboxradio("refresh");
     
     $("#configureTasks").popup().popup("open", {transition: "pop"} );
     swapConfigureTasksRepeats();
     break;
   }
 }       
};

// function dateToMDY(date) {
//   var d = date.getDate();
//   var m = date.getMonth() + 1;
//   var y = date.getFullYear();
//   return '' + (m<=9 ? '0' + m : m) + '/' + (d <= 9 ? '0' + d : d) + '/' + y;
// }

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

var clearFilterTriggerPlugin = function(e) {
   if (e.currentTarget.parentElement.parentElement.parentElement.parentElement.id == 'productFilterContainer' ||
       e.currentTarget.parentElement.parentElement.parentElement.parentElement.id == 'filterProductListContent') {
      $('#addGoalFormGoalName').val('').trigger('keypress').trigger('keyup');
   } else {
      $('#addTasksFormTaskName').val('').trigger('keypress').trigger('keyup');
   }
};

var watchUserFilterInput = function(e) {
   if(e.currentTarget.id == 'addGoalFormGoalName') {
      $('span.productSearchTerm').text(e.currentTarget.value);
      if (e.currentTarget.value) {
         $('.productCatalog .title').hide();
         $('.productCatalog .altTitle').show();
         $(".createNewProduct").removeClass("ui-disabled");
      } else {
         $('.productCatalog .title').show();
         $('.productCatalog .altTitle').hide();
         $(".createNewProduct").addClass("ui-disabled");
      }
   } else {
      $('span.taskSearchTerm').text(e.currentTarget.value);
      if (e.currentTarget.value) {
         $('.taskCatalog .title').hide();
         $('.taskCatalog .altTitle').show();
         $(".createNewTask").removeClass("ui-disabled");
      } else {
         $('.taskCatalog .title').show();
         $('.taskCatalog .altTitle').hide();
         $(".createNewTask").addClass("ui-disabled");
      }
   }
};


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
  
  $("#configureTasks" ).popup( "close" );
  if ( $("#addTasksFormTaskName").val() != "" ) {
    clearFilterTriggerPlugin(e); 
  }

  // create a template selectedTask and populate it
  var taskUI = $($(".newTaskTemplate .taskItem")[0]).clone();
  $(taskUI).css("display","none").attr("data-taskId", currentTask.id);
  $(taskUI).find(".taskTitle").html(currentTask.name);
  $(taskUI).find(".recurrance").html(getTaskRecurrance(currentTask));
  $(taskUI).find(".payment").html(getTaskPay(currentTask));

  // IF the task already exists, update it
  var taskExists = false;
  for (i in currentChild.tasks) {
    var task = currentChild.tasks[i];
    if (task.id == currentTask.id && task.name == currentTask.name) {
      taskExists = true;
      currentChild.tasks[i] = currentTask;
      $(".selectedTasks [data-taskId='" + currentTask.id + "']").each( function(e) {
        if ( $(this).find(".taskTitle").html() == currentTask.name) {
          $(this).replaceWith( $(taskUI).show() );
        }
      });
      break;
    }
  }

  // IF the task doesn't exist, add it  
  if (!taskExists) {
    currentChild.tasks.push(currentTask);
    $(taskUI).prependTo("#startTasks .selectedTasks").slideDown();  
    $(".taskCatalog .taskItem[data-taskId='" + currentTask.id + "']").slideUp().delay(400);
  }
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

  // attach click events to freshly drawn tasks in the catalog
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


  $(".addTaskContent, .startTasksFooter").fadeOut(200);
  
  // move the cover
  $("#startTasks .tasksPayGoals").addClass("left"); //.css("left","0");
  
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
};

var showProductDetails = function(e) {
  var productItem = $(e.currentTarget),
      productId = $(productItem).attr("data-productId"),
      product = cannedProducts.products[productId];

  // populate the popup disclosure and show it
  $('#productDetailsPopup .title').html(product.name)
  $('#productDetailsPopup .desc').html(product.desc).attr("data-productId",productId);
  $('#productDetailsPopup .numPeople').html(product.numPeople).attr("data-productId",productId);
  $('#productDetailsPopup .mainImage img').attr("src",product.imgURL).attr("data-productId",productId);
  $("#productDetailsPopup .addProductButton").attr("data-productId",productId);
  $("#productDetailsPopup").popup().popup("open", {transition: "pop"} );
};



/* ======== TEST DATA, comment me out to run for real ===========  */

var testBdayString = '1998-10-29';
var testBirthday = new Date(parseInt(testBdayString.substring(0,4)), parseInt(testBdayString.substring(5,7))-1, parseInt(testBdayString.substring(8)));
currentChild = new Child(0, 'Kaiya', '', '', '', testBirthday, 0, 'f');
tykoonData.parent.children.push(currentChild);
populateTasksForChild(currentChild);
populateProductsForChild(currentChild);

/* ======== END TEST DATA  ============================ */
