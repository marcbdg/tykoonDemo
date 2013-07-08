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
     $("#startTasks .taskCatalog .tasks, #startTasks .taskCatalog .popularTasks, #startTasks .productCatalog .products, #startTasks .productCatalog .popularProducts").css("height","483px");
   } else {  // BROWSER bars ipad landscape
     $("#startTasks .taskCatalog .tasks, #startTasks .taskCatalog .popularTasks, #startTasks .productCatalog .products, #startTasks .productCatalog .popularProducts").css("height","410px");
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

   // toggle alt product images
   $("#productDetailsPopup").on("click", ".altWrapper", function(e) {
     showAltProductImage(this);
   });
   
   $("#productDetailsPopup").on("click", ".timeToEarn", function(e) {
     toggleTimeToEarnTooltip();
   });
   $("#productDetailsPopup").on("click", ".addProductButton", function(e) {
     var productId = $(this).attr("data-productId");
     addProductToChild( productId );
     $("#productDetailsPopup").popup("close");
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
   
   $("#doneWithGoalsButton").on("click", function(e){ 
      transitionToReview(e);
   });

   $("#addTasksButton").on("click", function(e){ 
      showAddTasks(e);
   });
   $("#addGoalsButton").on("click", function(e){ 
      showAddGoals(e);
   });

   $('#configureTasksRepeats').on('change', function(e) {
      swapConfigureTasksRepeats(e);
   });

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
   
   // resize the productDetails popup before showing
   $( "#productDetailsPopup" ).on({
       popupbeforeposition: function() {
           $( "#productDetailsPopup" )
               .css( "width", $(window).width() * .8 )
               .css( "max-height", $(window).height() * .8 );
           $("#productDetailsPopup .details")
               .css("width", $("#productDetailsPopup .taskContent").width()-320);
       }
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
      no_results: '.productsNoResults'
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
      no_results: '.tasksNoResults'
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

function prettyDate(date) {
  var m_names = new Array("Jan", "Feb", "Mar", 
  "Apr", "May", "Jun", "Jul", "Aug", "Sep", 
  "Oct", "Nov", "Dec");

  var dow_names = new Array("Sunday", "Monday", "Tuesday", 
  "Wednesday", "Thursday", "Friday", "Saturday");

  var curr_date = date.getDate(),
      curr_dow = date.getDay(),
      curr_month = date.getMonth(), 
      curr_year = date.getFullYear();
  return dow_names[curr_dow] + ", " + m_names[curr_month]  + " " + curr_date + " " + curr_year;
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
   //Products
   if(e.currentTarget.id == 'addGoalFormGoalName') {

      $('span.productSearchTerm').text(e.currentTarget.value);
      if (e.currentTarget.value) {

         $('.productCatalog .title, .productCatalog .popularProducts').hide();
         $('.productCatalog .altTitle, .productCatalog .products').show();
         $(".createNewProduct").removeClass("ui-disabled");
      } else {
         $('.productCatalog .title, .productCatalog .popularProducts').show();
         $('.productCatalog .altTitle, .productCatalog .products').hide();
         $(".createNewProduct").addClass("ui-disabled");
      }
   } else {
      //tasks
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

var addProductToChild = function(productId) {
  var productTemplate = $("#startTasks .productCatalog .addProductTemplate .productItem")[0],
      newProduct = $(productTemplate).clone(),
      currentProduct = cannedProducts.products[productId];
      
  $(newProduct).attr( "data-productId", productId);
  $(newProduct).find(".productTitle").html( currentProduct.name);
  $(newProduct).find(".thumbnail").attr({src: currentProduct.imgURL, alt: currentProduct.name});
  
      
  currentChild.products.push(currentProduct);
  $(newProduct).prependTo("#startTasks .selectedProducts").slideDown();  
      
  // $(".selectedProducts").append(newProduct);  
};

var getTaskRecurrance = function(task) {
  if (task.repeatDays.length > 0) {   // repeating tasks
    return "↻ every " + task.repeatDays.join(", ");
  } else {    // non-repeating tasks
    if (task.dueDate != "") {
      return "<strong>By:</strong> " + prettyDate(task.dueDate);
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
  $('#startTasks .taskCatalog .tasks').append("<div class='bottomSpacer'></div>");

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

var transitionToReview = function(e) {
  $(".startGoalsFooter").fadeOut(200);  
  $(".cover").fadeOut("slow");
  $(".finishSetupFooter").delay(400).fadeIn(200);
  $( "#addTasksButton, #addGoalsButton" ).removeClass( "ui-disabled" );
};

var showAddTasks = function() {
  
};
var showAddGoals = function() {
  // $(".cover").show();
  // $(".addTaskContent").fadeOut(200);
  // $(".addGoalContent").delay(400).fadeIn(200);
  // $("#addGoalsButton").addClass("ui-disabled");
};

var populateProductsForChild = function(child) {

   //clean page and populate page with tasks from catalog
   $('#startTasks .productCatalog .goals').empty();
   var productTemplate = $("#startTasks .productCatalog .productTemplate .productItem")[0];
   var temp = 0;
   for(var i in cannedProducts.products) {

      var product = cannedProducts.products[i];
      if ((product.gender == "b" || product.gender == child.gender) && (child.getAge() >= product.ageRange.min && child.getAge() <= product.ageRange.max)) {

         var productItem = $(productTemplate).clone();
         $(productItem).attr("data-productId", product.id);
         $(productItem).find(".title").html(product.name);
         $(productItem).find(".numKids span").html(product.numPeople);
         $(productItem).find(".thumbnail").attr({src: product.imgURL, alt: product.name});
         $('#startTasks .productCatalog .popularProducts').append($(productItem));
      }
   }
   $('#startTasks .productCatalog .popularProducts').append("<div class='bottomSpacer'></div>");
};

var showProductDetails = function(e) {
  var productItem = $(e.currentTarget),
      productId = $(productItem).attr("data-productId"),
      product = cannedProducts.products[productId];

  // populate the popup disclosure and show it
  $('#productDetailsPopup .title').html(product.name);
  $('#productDetailsPopup .price').html(product.price);
  $('#productDetailsPopup .allowance').html($("#slider-fill").val());
  $("#productDetailsPopup .time").html( getTimeToEarn(product.price) );
  $('#productDetailsPopup .desc').html(product.desc).attr("data-productId",productId);
  $('#productDetailsPopup .numPeople').html(product.numPeople).attr("data-productId",productId);
  $('#productDetailsPopup .mainImage img').attr("src",product.imgURL).attr("data-productId",productId);
  $("#productDetailsPopup .addProductButton").attr("data-productId",productId);
  
  // Count the alt images and show selector for proper number
  $("#productDetailsPopup .altImages").empty();
  $("#productDetailsPopup .timeToEarnTooltip").hide();
  var altImgs = product.altIMG,
    totalImgs = 1;
  for (i in altImgs) {
    var imgSrc = altImgs[i];
    if (imgSrc != "") {
      ++totalImgs;
      $("#productDetailsPopup .altImages").append("<div class='altWrapper verticalWrapper'><div class='verticalMiddle'><img src='" + imgSrc + "' /></div></div>");
    }
  }
  if (totalImgs > 1) {
    $("#productDetailsPopup .altImages").addClass("populated").prepend("<div class='altWrapper verticalWrapper selected'><div class='verticalMiddle'><img src='" + product.imgURL + "' /></div></div>");
  } else {
    $("#productDetailsPopup .altImages").removeClass("populated");
  }
  if (totalImgs == 4) {
    $("#productDetailsPopup .altImages").addClass("fourAcross");
  } else {
    $("#productDetailsPopup .altImages").removeClass("fourAcross");
  }
  $("#productDetailsPopup").popup().popup("open", {transition: "pop"} );
};

var showAltProductImage = function(imgWrapper) {
  $("#productDetailsPopup .altWrapper").removeClass("selected");
  $(imgWrapper).addClass("selected");
  $("#productDetailsPopup .mainImage img").attr("src", $(imgWrapper).find("img").attr("src"));
};

var toggleTimeToEarnTooltip = function() {
  $("#productDetailsPopup .timeToEarnTooltip").toggle("fast");
};
var getTimeToEarn = function(price) {
  price = price.substring(1);
  var moneyPerWeek = $("#slider-fill").val() * 1,
      moneyPerDay = (moneyPerWeek) / 7;

  // console.log  (price + " :: " + moneyPerWeek + " :: " + moneyPerDay);
  
  // Time to earn in WEEKS and DAYS
  // if (price <= moneyPerWeek) {
//     var days = Math.ceil(price / moneyPerDay);
//     return (days == 7) ? "1 week" : days + " days";
//   } else {
//     var weeks = Math.floor(price / moneyPerWeek);
//     var remainder = price - weeks*moneyPerWeek;
//     var days = Math.ceil(remainder / moneyPerDay);
//     var daysText = (days == 1) ? "1 day" : days + " days";
//     var weeksText =  (weeks == 1) ? "1 week" : weeks + " weeks";
//     return (remainder > 0) ? weeksText + " and " + daysText : weeksText;
//   }
  
  // Time to earn in WEEKS only
  return ( moneyPerWeek >= price) ? "1 week" : Math.ceil(price / moneyPerWeek) + " weeks";
}

/* ======== TEST DATA, comment me out to run for real ===========  */

var testBdayString = '1998-10-29';
var testBirthday = new Date(parseInt(testBdayString.substring(0,4)), parseInt(testBdayString.substring(5,7))-1, parseInt(testBdayString.substring(8)));
currentChild = new Child(0, 'Kaiya', '', '', '', testBirthday, 0, 'f');
tykoonData.parent.children.push(currentChild);
populateTasksForChild(currentChild);
populateProductsForChild(currentChild);

/* ======== END TEST DATA  ============================ */
