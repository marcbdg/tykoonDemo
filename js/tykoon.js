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

//---------------------------------------------------
// Section to handle startTask resizing
//---------------------------------------------------
var visualEnv = {orientation: '', fullscreen: true};

$('#startTasks').on('pageshow', function(e) {
   setOrientation();
});

$(window).on('orientationchange', function(e) {
   setOrientation();
});

function setOrientation() {
   //handles browser mode or fullscreen

   switch($(window).height()) {

      case 672: //Browser mode, landscape
         visualEnv.orientation = 'landscape';
         visualEnv.fullscreen = false;
         $("#nonOptimalSizeCover").hide();
         break;

      case 928: //Browser mode, portrait
         visualEnv.orientation = 'portrait';
         visualEnv.fullscreen = false;
         $("#nonOptimalSizeCover").fadeIn("fast");
         break;

      case 748:
      case 768: //Fullscreen, landscape
         visualEnv.orientation = 'landscape';
         visualEnv.fullscreen = true;
         $("#nonOptimalSizeCover").hide();
         break;

      default: //Fullscreen, portrait (1004)
         visualEnv.orientation = 'portrait';
         visualEnv.fullscreen = true;
         if ( navigator.userAgent.match(/iPad/i) != null ) {
            $("#nonOptimalSizeCover .nonIpad").hide();
            $("#nonOptimalSizeCover .ipad").show();
         } else {
            $("#nonOptimalSizeCover .nonIpad").show();
            $("#nonOptimalSizeCover .ipad").hide();
         }
         $("#nonOptimalSizeCover").fadeIn("fast");
   }
   // console.log('$(window).height(): ' + $(window).height() + ' visualEnv.orientation: ' + visualEnv.orientation + ' visualEnv.fullscreen:' + visualEnv.fullscreen);
}

$('#startTasks').resize(function(e) {
   forceStartTasksHeight();
});
$('#startTasks').on('pageshow', function(e) {
   forceStartTasksHeight();
});

function forceStartTasksHeight() {
   if(visualEnv.orientation == 'landscape' && visualEnv.fullscreen) {  // fullscreen
      $('#startTasks').height(686);
      $("#startTasks .taskCatalog .tasks, #startTasks .taskCatalog .popularTasks, #startTasks .productCatalog .products, #startTasks .productCatalog .popularProducts").height(498);
      $("#startTasks .selectedTasks").height(467);
   }
   if(visualEnv.orientation == 'landscape' && !visualEnv.fullscreen) {  // in browser, with toolbars
      $('#startTasks').height(610);
      $("#startTasks .taskCatalog .tasks, #startTasks .taskCatalog .popularTasks, #startTasks .productCatalog .products, #startTasks .productCatalog .popularProducts").height(425);
      $("#startTasks .selectedTasks").height(389);
    }

   //TODO Marc figure out size for portrait
   if(visualEnv.orientation == 'portrait' && visualEnv.fullscreen) {  // fullscreen
      //$('#startTasks').height(700);
   }
   if(visualEnv.orientation == 'portrait' && !visualEnv.fullscreen) {  // in browser, with toolbars
      //$('#startTasks').height(610);
   }

   return false;
}


//---------------------------------------------------
// End section to handle startTask resizing
//---------------------------------------------------

//clear the filter forms during the transition states
$(document).bind('pagebeforehide', function(){
   $('.backToPopularTasks, .backToPopularProducts').trigger('click');
});

// Show the body after the page has completed loading, to prevent FOUSC
// NOTE: must add any pages you wish to start from with a browser RELOAD to this list
$("#tour, #startTasks, #portraitCover").one("pageinit",function(){
    $("body").show();
    setOrientation();

    
});

function slideChange(args) {
	try {
		console.log('changed: ' + (args.currentSlideNumber - 1));
	} catch(err) {
	}
	$('.indicators .item').removeClass('selected');
	$('.indicators .item:eq(' + (args.currentSlideNumber - 1) + ')').addClass('selected');
}

$(document).ready(function() {
   // to initialize the tour carousel
   $('.iosSlider').iosSlider({
	snapToChildren: true,
      // infiniteSlider: true,
	desktopClickDrag: true,
	snapSlideCenter: true,
	onSlideChange: slideChange
   });

   // To hide the non-optimial viewport coverup
   $("#nonOptimalSizeCover .continueNonOptimized").on('click', function(e) {
      $('#nonOptimalSizeCover').fadeOut('fast').delay('1600', function() {
         $(this).remove();
      });
   });
  
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

   $("#birthdayLabel").on("click", function(e){
      $("#birthdayLabel").hide();
   });
   $("#getStartedFormChildBirthday").on("focus", function(e){
      $("#birthdayLabel").hide();
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
   
   $("#startTasks .createNewGoal").on("click", function(e) {
     // resetConfigureTaskPopup();
     restoreCustomProduct();
     $('#customGoalPopup #newGoalName').val( $("#addGoalFormGoalName").val() ).attr("data-goalId","-1");
   });

   $("#startTasks .selectedTasks").on("click", ".taskItem", function(e) {
      restoreConfigureTaskPopup( $(e.currentTarget) );
   });
   
   // Update any product time estimations when allowance slider is changed
   $('#startTasks').on('slidestop','#slider-fill', function() { 
     $(".timeToEarn .time").each( function() {
       var productPrice = $(this).attr("data-price");
       if (productPrice) {
         $(this).fadeOut(200, function() {
           $(this).html( getTimeToEarn(productPrice) );
         }).delay(400).fadeIn(400);
       }
     });
   });
   // initialize the slider to 1.5 times the child's age
   $('#startTasks').on('slidecreate','#slider-fill', function() { 
     $("#slider-fill").val( Math.round(currentChild.getAge() * 1.5) ).slider("refresh");
   });
   
   $("#doneWithTasksButton").on("click", function(e){ 
      transitionToStartGoals(e);
   });
   
   $("#doneWithGoalsButton, .returnToReviewButton").on("click", function(e){ 
      transitionToReview(e);
   });

   $("#addTasksButton").on("click", function(e){ 
      $("#startTasks .tasksPayGoals").removeClass("left");
      showAddTasks(e);
   });
   $("#addGoalsButton").on("click", function(e){ 
      showAddGoals(e);
   });
   $("#customGoalForm").submit( function(e) {
     $("#customGoalForm .error").hide();
     addCustomGoalToChild(e);
     return false;
   });

   $('#deleteCustomGoalButton').on('click', function(e) {
      deleteCustomProductFromChild(e);
   });

   $('#saveCustomGoalButton').on('click', function(e) {
      saveCustomProduct(e);
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
   $('#configureTasksDelete').on('click', function(e) {
      deleteTaskFromChild(e);
      return false;
   });

   $('.deleteProductButton').on('click', function(e) {
      deleteProductFromChild(e, function() {
         //toggle the buttons back to add product
         $('.addProductButtonBox, .deleteProductButtonBox').toggle();
      });
      return false;
   });

   $("#startTasks .selectedProducts").on("click", ".productItem", function(e) {
      if ($(e.currentTarget).attr('data-productid') == -1) {
         editCustomProduct(e);
      } else {
         showProductDetails(e);
      }
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
         $('.productCatalog .products').append('<div class="bottomSpacer"></div>');
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
         $('.taskCatalog .tasks').append('<div class="bottomSpacer"></div>');
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
     $("#noNameError").show();
     errors = true;
   }
   if (birthdayString == "") {
     $("#noBirthdayError").show();
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
   $('#configureTasks .taskTitle').html(taskName).attr({'data-taskId': taskId, 'data-taskTitle': taskName});
   // set due date of today or later
   $("#configureTasksDueDate").attr("min", dateToYMD(new Date()));
   
   resetConfigureTaskPopup();
   $("#configureTasks").popup().popup("open", {transition: "pop"});
};

var resetConfigureTaskPopup = function(e) {
   // reset the form before opening
   $("#configureTaskRepeatsYes, #configureRepeatPaymentAllow, #configureNonRepeatPaymentMoney" ).prop( "checked", true ).checkboxradio( "refresh" );
   $("#configureTaskRepeatsNo, #configureRepeatPaymentResp, #configureNonRepeatPaymentResp, #configureTasksWeeklyOn input[type='checkbox']" ).prop( "checked", false ).checkboxradio( "refresh" );
   $("#configureTasksHowMuch, #configureTasksDueDate").val("");
   $(".taskRepeatPaymentDetails .allow, .taskNonRepeatPaymentDetails .money, .configureTasksNewTask").show();
   $(".taskRepeatPaymentDetails .resp, .taskNonRepeatPaymentDetails .resp, .configureTasksEditTask").hide();
   swapConfigureTasksRepeats();
};
var restoreConfigureTaskPopup = function(taskUI) {
   resetConfigureTaskPopup();
   var taskId = $(taskUI).attr("data-taskId"),
       title = $(taskUI).find(".taskTitle").html();

   // find the fully configured task object matching the id and title of the task tapped
   var task = findChildTask(taskId, title);
   // populate the disclosure
   $("#configureTasks").find(".taskTitle").html(task.name).attr({'data-taskId': task.id, 'data-taskTitle': task.title});
     
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
       $("#configureTasksHowMuch").val( dollarize(task.payAmt) );
     }
     if (task.dueDate) {
       $("#configureTasksDueDate").val( dateToYMD(task.dueDate) );
     }
     swapConfigureNonRepeatPayment();
   }
   //swap out the "add" button for "delete" & "save" buttons
   $('.configureTasksNewTask, .configureTasksEditTask').toggle();

   $("#configureTasksRepeats input").checkboxradio("refresh");

   $("#configureTasks").popup().popup("open", {transition: "pop"} );
   swapConfigureTasksRepeats();
};


var deleteTaskFromChild = function(e) {
   var id = $("#configureTasks").find('.taskTitle').attr('data-taskId');
   var title = $("#configureTasks").find('.taskTitle').text();
   var task = findChildTask(id, title);
   var replaceTasks = [];

   //remove out of the array
   for (var i in currentChild.tasks) {
      if (!(currentChild.tasks[i].id == id && currentChild.tasks[i].name == title)) {
         replaceTasks.push(currentChild.tasks[i]);
      }
   }
   currentChild.tasks = replaceTasks;

   //remove out of the DOM
   $('.selectedTasks .taskItem[data-taskid="' + id + '"].taskItem[data-taskTitle="' + title + '"]').remove();

   //if it's from the catalog, add it back to the catalog
   if (id != -1) {
      $(".taskCatalog .taskItem[data-taskId='" + id + "']").show();
   }

   //close the popup
   $("#configureTasks").popup( "close" );
};

var deleteProductFromChild = function(e, callback) {
   var id = $('#productDetailsPopup').attr('data-productid');
   var name = $('#productDetailsPopup').attr('data-productname');
   var newProductsList = [];

   //remove from the array
   for (var i in currentChild.products) {
      if (currentChild.products.hasOwnProperty(i)) {
         if (! (currentChild.products[i].id == id && currentChild.products[i].name == name) ) {
            newProductsList.push(currentChild.products[i]);
         }
      }
   }
   currentChild.products = newProductsList;

   //remove from the DOM
   $('.selectedProducts .productItem[data-productid="' + id + '"].productItem[data-productname="' + name + '"]').remove();

   //if it's from the catalog, add it back to the catalog
   if (id != -1) {
      $(".productCatalog .productItem[data-productid='" + id + "']").show();
   }

   //close the popup
   $("#productDetailsPopup").popup( "close" );

   callback();
};

var deleteCustomProductFromChild = function(e) {
   var id = -1;
   var name = $('#customGoalPopup').attr('data-productname');
   var newProductsList = [];

   //remove from the array
   for (var i in currentChild.products) {
      if (currentChild.products.hasOwnProperty(i)) {
         if (currentChild.products[i].id == id && currentChild.products[i].name == name) {
            continue;
         }
         newProductsList.push(currentChild.products[i]);
      }
   }
   currentChild.products = newProductsList;

   //remove from the DOM
   $('.selectedProducts .productItem[data-productid="' + id + '"].productItem[data-productname="' + name + '"]').remove();

   //close the popup
   $("#customGoalPopup").popup( "close" );

   //reset the popup
   restoreCustomProduct();
};

var findChildTask = function(id, title) {
   var returnTask;
   for (i in currentChild.tasks) {
      if (currentChild.tasks[i].id == id && currentChild.tasks[i].name == title) {
         returnTask = currentChild.tasks[i];
         break;
      }
   }
   return returnTask;
};

function dollarize(payAmt) {
  var dotIndex = payAmt.indexOf(".");
  if ( dotIndex == -1) {
    return payAmt + ".00";
  } else {
    var cents = payAmt.substring(dotIndex+1);
    if (cents.length < 2) {
      return payAmt + "0";
    }
  }
  return payAmt;
}
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
         //show full product catalog and hide popular
         $('.productCatalog .title').hide();
         $('.productCatalog .popularProducts').addClass('offScreen');
         $('.productCatalog .altTitle').show();
         $('.productCatalog .products').removeClass('offScreen');
         $(".createNewGoal").removeClass("ui-disabled");
      } else {
         $('.productCatalog .title').show();
         $('.productCatalog .popularProducts').removeClass('offScreen');
         $('.productCatalog .altTitle').hide();
         $('.productCatalog .products').addClass('offScreen');
         $(".createNewGoal").addClass("ui-disabled");
      }
   } else {
      //tasks
      $('span.taskSearchTerm').text(e.currentTarget.value);
      if (e.currentTarget.value) {
         $('.taskCatalog .title').hide();
         $('.taskCatalog .popularTasks').addClass('offScreen');
         $('.taskCatalog .altTitle').show();
         $('.taskCatalog .tasks').removeClass('offScreen');
         $(".createNewTask").removeClass("ui-disabled");
      } else {
         $('.taskCatalog .title').show();
         $('.taskCatalog .popularTasks').removeClass('offScreen');
         $('.taskCatalog .altTitle').hide();
         $('.taskCatalog .tasks').addClass('offScreen');
         $(".createNewTask").addClass("ui-disabled");
      }
   }
};

var addCustomGoalToChild = function(e) {
   var newProduct = {};
   newProduct.id = -1;
   newProduct.name = $('#newGoalName').val();
   newProduct.price = '$' + dollarize($('#newGoalPrice').val());
   newProduct.desc = '';
   newProduct.type = $('input:radio[name="goalType"]:checked').val();
   newProduct.numPeople = '';
   newProduct.likes = '';
   newProduct.gender = '';
   newProduct.imgURL = $('#customGoalPreview').attr('src');

   currentChild.products.push(newProduct);
   console.dir(currentChild.products);
   appendProductToDOM(newProduct);

   $('.backToPopularProducts').trigger('click');
   $("#customGoalPopup").popup( "close" );
};

var appendProductToDOM = function(product) {
   var productTemplate = $("#startTasks .productCatalog .addProductTemplate .productItem")[0];
   var newProduct = $(productTemplate).clone();
   $(newProduct).attr({"data-productid": product.id, 'data-productname': product.name});
   $(newProduct).find(".productTitle").html( product.name);
   $(newProduct).find(".thumbnail").attr({src: product.imgURL, alt: product.name});
   $(newProduct).find(".price").html(product.price);
   $(newProduct).find(".time").html( getTimeToEarn(product.price) ).attr("data-price", product.price);
   $(newProduct).prependTo("#startTasks .selectedProducts").show();
};

var addConfiguredTaskToChild = function(e) {
  var taskId = $("#configureTasks .taskTitle").attr("data-taskId"),
      currentTask;
      
    if (taskId == -1) {
      var taskTitle = $("#configureTasks .taskTitle").html();
      // new Task(id, name, icon, repeatDays, payType, payAmt, dueDate);
      currentTask = new Task(taskId, taskTitle, 'iconGenericTask@2x.png', [], '', '', '');  
    } else {
      currentTask = cannedTasks.tasks[taskId];
      if (! currentTask.repeatDays) currentTask.repeatDays = [];
    }

  // If repeating task, collect repeatDays and paymentType
  var repeats = $("input:radio[name='configureTasksRepeats']:checked").val();
  currentTask.repeatDays = [];
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
      $("#pickADay").show();
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
        $("#enterTaskMoney").show();
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
   $(taskUI).css("display","none").attr({'data-taskId': currentTask.id, 'data-taskTitle': currentTask.name});
   $(taskUI).find(".taskTitle").html(currentTask.name);
   $(taskUI).find(".icon").attr("src","img/tasks/" +currentTask.icon);
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
    $(taskUI).prependTo("#startTasks .selectedTasks").show();  
    $(".taskCatalog .taskItem[data-taskId='" + currentTask.id + "']").hide();
  }
};


var addProductToChild = function(productId) {
   var currentProduct = cannedProducts.products[productId];
   currentChild.products.push(currentProduct);
   appendProductToDOM(currentProduct);

   //remove from popular and full catalogs (-1 is a user-configured item)
   if (productId != -1) {
      $('.productCatalog .productItem[data-productid="' + currentProduct.id + '"]').hide();
   }
};

var getTaskRecurrance = function(task) {
  if (task.repeatDays.length > 0) {   // repeating tasks
    return "↻ every " + task.repeatDays.join(", ");
  } else {    // non-repeating tasks
    if (task.dueDate) {
      return "<strong>By:</strong> " + prettyDate(task.dueDate);
    } else {
      return "one time";
    }
  }
};
var getTaskPay = function(task) {
  if (task.payType == "money") {
    return "<span class='money'>$" + dollarize(task.payAmt) + "</span>";
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
   if (child.gender == "f") {
     $(".userModule .avatar").attr("src", "img/accountGirl@2x.png");
   }

   //clean page and populate page with tasks from catalog
   $('#startTasks .taskCatalog .popularTasks').empty();
   var taskTemplate = $("#startTasks .taskCatalog .taskTemplate .taskItem")[0];



   for(var i in cannedTasks.tasks) {
      var task = cannedTasks.tasks[i];

      if ((task.gender == "b" || task.gender == child.gender) && (child.getAge() >= task.ageRange.min && child.getAge() <= task.ageRange.max)) {

         var taskItem = $(taskTemplate).clone();
         $(taskItem).attr({'data-taskId': task.id, 'data-taskTitle': task.name});
         $(taskItem).find(".title").html(task.name);
         $(taskItem).find(".icon").attr("src", "img/tasks/" + task.icon);
         $(taskItem).find(".numKids span").html(task.numPeople);

         $('#startTasks .taskCatalog .popularTasks').append($(taskItem));
      }
   }
   $('#startTasks .taskCatalog .tasks, #startTasks .taskCatalog .popularTasks').append("<div class='bottomSpacer'></div>");

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
  $(".addTaskContent, .startTasksFooter").fadeOut();
  
  // move the cover
  $("#startTasks .tasksPayGoals").addClass("left"); //.css("left","0");
  
  $(".addGoalContent, .startGoalsFooter").delay(400).fadeIn();
};

var transitionToReview = function(e) {
  if (! $("#startTasks .tasksPayGoals").hasClass("left")) {
    $("#startTasks .tasksPayGoals").addClass("left");
  }
  $(".footerBar").fadeOut(200);
  $(".cover").fadeOut("slow");
  $(".finishSetupFooter").delay(400).fadeIn(200);
  $( "#addTasksButton, #addGoalsButton" ).removeClass( "ui-disabled" );
};
var showAddTasks = function() {
  $(".footerBar").fadeOut(200);
  $(".addGoalContent").hide();
  $(".cover").show();
  $(".addTaskContent, .doneAddingTasks").delay(400).fadeIn(200);
  $("#addTasksButton").addClass("ui-disabled");
};
var showAddGoals = function() {
  $(".footerBar").fadeOut(200);
  $(".addTaskContent").hide();
  $(".cover").show();
  $(".addGoalContent, .doneAddingGoals").delay(400).fadeIn(200);
  $("#addGoalsButton").addClass("ui-disabled");
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
         $(productItem).attr({'data-productId': product.id, 'data-productname': product.name});
         $(productItem).find(".title").html(product.name);
         $(productItem).find(".price").html(product.price);
         $(productItem).find(".numKids span").html(product.numPeople);
         $(productItem).find(".thumbnail").attr({src: product.imgURL, alt: product.name});
         $('#startTasks .productCatalog .popularProducts').append($(productItem));
      }
   }
   $('#startTasks .productCatalog .popularProducts').append("<div class='bottomSpacer'></div>");
};

var editCustomProduct = function(e) {
   var productItem = $(e.currentTarget),
      productId = $(productItem).attr("data-productId"),
      productName = $(productItem).attr("data-productname"),
      product = {};

   for (var i in currentChild.products) {
      if (currentChild.products.hasOwnProperty(i)) {
         if (currentChild.products[i].id == productId && currentChild.products[i].name == productName) {
            product = currentChild.products[i];
         }
      }
   }

   $('#newGoalName').val(product.name);
   $('#newGoalPrice').val(Number(product.price.substring(1)));
   $("#goalType input").prop("checked",false).checkboxradio("refresh");
   $("#goalType input[value='" + product.type + "']").prop("checked",true).checkboxradio("refresh");
   $('#customGoalPreview').attr({'src': product.imgURL});

   $('#customGoalPopup').attr({'data-productid': productId, 'data-productname': productName});

   $('#customGoalPopup .editCustomGoalButtonBox').show();
   $('#customGoalPopup .addCustomGoalButtonBox').hide();

   $('#customGoalPopup').popup().popup("open", {transition: "pop"} );
};

var saveCustomProduct = function(e) {
   var newName = $('#newGoalName').val(),
         newPrice = '$' + $('#newGoalPrice').val(),
         newType = $('input:radio[name="goalType"]:checked').val(),
         newImg = '',
         previousName = $('#customGoalPopup').attr('data-productname');

   // find and update "old" product
   for (var i in currentChild.products) {
      if(currentChild.products.hasOwnProperty(i)){
         if((currentChild.products[i].name == previousName && currentChild.products[i].id == -1)){
            var oldProduct = currentChild.products[i];
            oldProduct.name = newName;
            oldProduct.price = newPrice;
            oldProduct.type = newType;
            oldProduct.imgURL = newImg;
            break;
         }
      }
   }

   // update the product in the DOM
   var productDom = $('.selectedProducts .productItem[data-productid="-1"].productItem[data-productname="' + previousName + '"]')[0];
   $(productDom).attr("data-productname",newName);
   $(productDom).find(".productTitle").html(newName);
   $(productDom).find(".price").html(dollarize(newPrice));
   $(productDom).find(".productImage .thumbnail").attr({ src : newImg, alt : newName});
   $(productDom).find(".timeToEarn .time").html(getTimeToEarn(newPrice));

   //close the popup
   $("#customGoalPopup").popup( "close" );

   //reset the popup
   restoreCustomProduct();
};

var restoreCustomProduct = function() {
   $('#newGoalName').val('');
   $('#newGoalPrice').val(null);
   $("#goalType input").prop("checked",false).checkboxradio("refresh");
   $("#goalType input[value='p']").prop("checked",true).checkboxradio("refresh");
   $('#customGoalPreview').attr({'src': '#'}).hide();

   $('#customGoalPopup .editCustomGoalButtonBox').hide();
   $('#customGoalPopup .addCustomGoalButtonBox').show();
};

var showProductDetails = function(e) {
   var productItem = $(e.currentTarget),
       productId = $(productItem).attr("data-productId"),
       productName = $(productItem).attr("data-productname"),
       product = cannedProducts.products[productId];

   //show delete button
   if (e.currentTarget.parentElement.classList[0] == 'selectedProducts') {
      $('.addProductButtonBox, .deleteProductButtonBox').toggle();
   }

  // populate the popup disclosure and show it
  $('#productDetailsPopup').attr({'data-productid': productId, 'data-productname': product.name});
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
  var moneyPerWeek = Number($("#slider-fill").val()),
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
};

/* ---------------- Custom product image upload --------------------------*/

function readURL(input) {

   if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
         $('#customGoalPreview').attr('src', e.target.result).show();
      };

      reader.readAsDataURL(input.files[0]);
   }
}

$("#newGoalPhotoUpload").change(function(){
   readURL(this);
});

/* ---------------- End Custom product image upload --------------------------*/




/* ======== TEST DATA, comment me out to run for real =========== */

var testBdayString = '1998-10-29';
var testBirthday = new Date(parseInt(testBdayString.substring(0,4)), parseInt(testBdayString.substring(5,7))-1, parseInt(testBdayString.substring(8)));
currentChild = new Child(0, 'Kaiyb', '', '', '', testBirthday, 0, 'm');
tykoonData.parent.children.push(currentChild);
populateTasksForChild(currentChild);
populateProductsForChild(currentChild);

 /* ======== END TEST DATA  ============================ */
