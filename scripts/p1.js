/*
  authors: Aarish Khan (A00424024)
  authors: Jawadur Rahman (A00434830)
  authors: Jeeva Murugesan (A00433568)
  authors: Nicholas Landers (A00420823)
  
  The purpose of this file is to provide the following behaviours:
  - initially draws and hides the Insulation Chapter (setup)
  - grab the values when sliders are moved and call the draw function (processInput)
  - draws the canvases using the input from the sliders (draw)
  - Shows the selected Chapter (chapChoice(value))
  - Changes the colour of the Opaque depending on the selection (pWallColor(num))
*/

// constant to represent the scale factor 
const SCL = 1.35;

// used so the pDraw funtion can grab the color of the wall and thickness
// Declare outside of method for universal use when needed 
let pCurrColor, pCurrThick, eWindow;

/* 
  places with degree days value variable (A), heat resistance variable (B), opaque thickness variable (C)
  all for calculations
*/
let dDaysNum, rInchNum, opqThickNum, opqTherResNum, doorTherResNum, winTherResNum, winAreaNum;
rInchNum = 0;
opqThickNum = 2;
winAreaNum = 0;
opqTherResNum = 0;
doorTherResNum = 2;
winTherResNum = 1;
dDaysNum = 0;
let eoTherResNum ;
/*
  The purpose of this function is to hide the Insulation Chapter
  when the page loads and draw the plan and elevation canvas in the Chapter.
  It also registers Opaque Thickness and Window Area Sliders.
*/
function setup() {
  // hides everything below the bottom row
  $(".hiddenInsulation").hide();

  let plan = document.getElementById("plan");
  let contextP = plan.getContext("2d");
  let elevation = document.getElementById("elevation");
  let contextE = elevation.getContext("2d");

  contextP.clearRect(0, 0, plan.width, plan.height);
  contextE.clearRect(0, 0, elevation.width, elevation.height);

  // background of the plan canvas
  contextP.fillStyle = "#d2cbcd";
  contextP.fillRect(0, 0, plan.width, plan.height);

  // exterior wall of the plan
  contextP.beginPath();
  contextP.lineWidth = "4";
  contextP.strokeStyle = "#3104fb";
  contextP.rect(1 * SCL, 1 * SCL, plan.width - 2 * SCL, plan.height - 37 * SCL - 2 * SCL);
  contextP.stroke();
  // solid line for the dotted line to go over (3 feet wide)
  contextP.beginPath();
  contextP.strokeStyle = "#d2cbcd";
  contextP.lineWidth = "5";
  contextP.moveTo(plan.width - 50 * SCL, plan.height - 38 * SCL);
  contextP.lineTo(plan.width - 86 * SCL, plan.height - 38 * SCL);
  contextP.stroke();
  // dotted straight door line (3 feet wide)
  contextP.beginPath();
  contextP.strokeStyle = "#000000";
  contextP.lineWidth = "1";
  contextP.setLineDash([3, 3]);
  contextP.moveTo(plan.width - 50 * SCL, plan.height - 37 * SCL);
  contextP.lineTo(plan.width - 86 * SCL, plan.height - 37 * SCL);
  contextP.stroke();
  contextP.setLineDash([]);
  // solid door line on plan
  contextP.beginPath();
  contextP.strokeStyle = "#000000";
  contextP.lineWidth = "2";
  contextP.moveTo(plan.width - 86 * SCL, plan.height - 35.5 * SCL);
  contextP.lineTo(plan.width - 86 * SCL, plan.height);
  contextP.stroke();
  // circle dotted line
  contextP.beginPath();
  contextP.setLineDash([3, 3]);
  contextP.arc(plan.width - 92.5 * SCL, plan.height - 38 * SCL, 40 * SCL, 0, Math.PI / 2);
  contextP.stroke();
  contextP.setLineDash([]);

  // ELEVATION ******************************************************************
  // light blue to give hint
  contextE.fillStyle = "#a3bcfd";
  contextE.fillRect(0, 0, elevation.width, elevation.height);
  //outer Door square (3 feet wide and 6 feet 8 inches tall)
  contextE.beginPath();
  contextE.strokeStyle = "#000000";
  contextE.rect(elevation.width - 80 * SCL, elevation.height - 85 * SCL, 36 * SCL, 80 * SCL - 2 * SCL);
  contextE.stroke();
  //inner door square
  contextE.beginPath();
  contextE.rect(elevation.width - 82 * SCL, elevation.height - 87 * SCL, 40 * SCL, 84 * SCL - 2 * SCL);
  contextE.stroke();
  //door knob circle
  contextE.beginPath();
  contextE.arc(elevation.width - 48 * SCL, elevation.height - 45 * SCL, 2 * SCL, 0, 2 * Math.PI);
  contextE.stroke();

  // register the slider for wall thickness
  $("#thicknessSld").on("change", function () {
    processInput();
  });
  // sets the opq thickness slider to 2 initially
  $("#thicknessSldOut").val(2);
  // Commented this out because we have the pWallColor function that is used when the construction is chnaged
  // $("#construction").on("change", function () {
  //   processInput();
  // });
  $("#doorTRSld").on("change", function () {
    processInput();
  });
  $("#windowTRSld").on("change", function () {
    processInput();
  });
  // register the window thickness slider
  $("#windowSld").on("change", function () {
    processInput();
  });
  //initialize door THERMAL RESISTANCE Slider
  $("#doorTRSldOut").val(2);
  //initialize Concepts output
  $('p').hide();

  // D: OPAQUE THERMAL RESISTANCE when slider changed
$(document).on('change', '#thicknessSld', function () {
  $('#opaqueTROut').val(2 + (opqThickNum - 2) * rInchNum);
});
// D: when construction select changed (Also part of H) NOW IN pWALLCOLOR
// $(document).on('change', '#construction', function () {
//   overallThermResitChange();
//   $('#opaqueTROut').val(2 + (opqThickNum - 2) * rInchNum);
// });
//E: when door THERMAL RESISTANCE slider changed
$(document).on('change', '#doorTRSld', function () {
  $('#doorTRSldOut').val($(this).val());
});
// H: EFFECTIVE OVERALL THERMAL RESISTANCE when slider changed
$(document).on('change', '#thicknessSld', function () {
  overallThermResitChange();//delete possibly


});
$(document).on('change', '#doorTRSld', function () {
  overallThermResitChange();
});
$(document).on('change', '#windowTRSld', function () {
  overallThermResitChange();
});
$(document).on('change', '#windowSld', function () {
  overallThermResitChange();
});

$(document).on('change', '#windowTRSld', function () {
  $('#windowTRSldOut').val($(this).val());
});
}


/* 
  The purpose of this function is to unhide the rest of the website 
  when proper value is selected and is setup for future use when 
  new modules are added 
*/
function chapChoice(value) {
  switch (value) {
    case "insulation":
      $(".hiddenInsulation").show();
      break;

    // reloads website so that the changes will reset when module is opened again
    case "vChapter":
      location.reload();
      break;

  }
}

/*
  The purpose of this function is to grab the values 
  when sliders are moved and call the draw function using those values.
*/
function processInput() {
  pCurrThick = $("#thicknessSld").val() / 2 * 1.18;
  opqThickNum = $("#thicknessSld").val() / 2;
  if (opqThickNum >= 4) {
    opqThickNum = $("#thicknessSld").val() / 2;
    $("#thicknessSldOut").val(opqThickNum);
  }
  else if (opqThickNum < 4) {
    opqThickNum = 4;
  }

  eWindow = $("#windowSld").val() / 2;
  draw();
  opqTherResNum = $("#opaqueTROut").val();
  $("#opaqueTROut").val(opqTherResNum);
  doorTherResNum = $("#doorTRSld").val();
  $("#doorTRSldOut").val(doorTherResNum);
  winTherResNum = $("#windowTRSld").val();
  $("#windowTRSldOut").val(winTherResNum);
  winAreaNum = $("#windowSld").val();

  winAreaNum = (winAreaNum / 12) * (((winAreaNum / 12) * 3) / 4);
  $('#windowSldOut').val(toOneDecimal(winAreaNum));

  //$("#windowSldOut").val(winAreaNum);
  
  //Changes H when select is changed Fixes Lag problem for Construction
  var myVar = setInterval(function(){ 
  opqTherResNum = $('#opaqueTROut').val();
  overallThermResitChange();
  console.log("H: ", $('#planSldOut').val());//DELETE LINE after testing
  
  }, 1);
  setTimeout(function(){ clearInterval(myVar); }, 100);

}


/*
  The purpose of this function is to redraw the canvases   
  using the input from the sliders/buttons.
*/
function draw() {
  let plan = document.getElementById("plan");
  let contextP = plan.getContext("2d");
  let elevation = document.getElementById("elevation");
  let contextE = elevation.getContext("2d");

  contextP.clearRect(0, 0, plan.width, plan.height);
  contextE.clearRect(0, 0, elevation.width, elevation.height);


  // background of the plan canvas
  contextP.fillStyle = "#d2cbcd";
  contextP.fillRect(0, 0, plan.width, plan.height);

  // exterior wall of the plan
  contextP.beginPath();
  contextP.strokeStyle = "#3104fb";
  contextP.rect(1, 1, plan.width - 2, plan.height - 37 * SCL);
  contextP.stroke();

  // Colored rectangle for the colored insulation
  contextP.beginPath();
  contextP.fillStyle = pCurrColor;
  contextP.fillRect(2 * 1.35, 2 * 1.35, plan.width - 4 * 1.35, plan.height - 41 * SCL);
  contextP.stroke();
  // interior wall of the plan (2 inches thick from exterior) shrinking based on wall thickness slider
  contextP.beginPath();
  contextP.fillStyle = "#d2cbcd";
  contextP.fillRect(pCurrThick * SCL, pCurrThick * SCL, (plan.width - .5 * SCL) -
    (pCurrThick * 2 * SCL), (plan.height - 37 * SCL) - (pCurrThick * 2 * SCL));
  contextP.stroke();
  // interior wall blue edge cover 
  contextP.beginPath();
  contextP.strokeStyle = "#3104fb";
  contextP.rect(pCurrThick * SCL, pCurrThick * SCL, (plan.width - .5 * SCL) -
    (pCurrThick * 2 * SCL), (plan.height - 37 * SCL) - (pCurrThick * 2 * SCL));
  contextP.stroke();

  // line over the expanding wall so that the door is still clear with different insulation
  contextP.fillStyle = "#d2cbcd"; // glass
  contextP.fillRect(
    plan.width - 86 * SCL,
    plan.height - 35 * SCL - pCurrThick * SCL - 2 * SCL,
    plan.width - 203 * SCL,
    pCurrThick - 1 * SCL + Number(4 * SCL)
  );
  // solid door line on plan (Exterior)
  contextP.beginPath();
  contextP.strokeStyle = "#000000";
  contextP.lineWidth = "2";
  contextP.moveTo(plan.width - 86 * SCL, plan.height - 38 * SCL);
  contextP.lineTo(plan.width - 86 * SCL, plan.height);
  contextP.stroke();
  // dotted straight door line (3 feet wide) (interior)
  contextP.beginPath();
  contextP.strokeStyle = "#000000";
  contextP.lineWidth = "1";
  contextP.setLineDash([3, 3]);
  contextP.moveTo(plan.width - 50 * SCL, (plan.height - 37 * SCL) - (pCurrThick * 1 * SCL));
  contextP.lineTo(plan.width - 86 * SCL, (plan.height - 37 * SCL) - (pCurrThick * 1 * SCL));
  contextP.stroke();
  contextP.setLineDash([]);

  // dotted straight door line (3 feet wide) (exterior)
  contextP.beginPath();
  contextP.strokeStyle = "#000000";
  contextP.lineWidth = "1";
  contextP.setLineDash([3, 3]);
  contextP.moveTo(plan.width - 50 * SCL, plan.height - 37 * SCL);
  contextP.lineTo(plan.width - 86 * SCL, plan.height - 37 * SCL);
  contextP.stroke();
  contextP.setLineDash([]);

  // circle dotted line
  contextP.beginPath();
  contextP.setLineDash([3, 3]);
  contextP.arc(plan.width - 92.5 * SCL, plan.height - 38 * SCL, 40 * SCL, 0, Math.PI / 2);
  contextP.stroke();
  contextP.setLineDash([]);

  // used as window would not disappear from plan
  if (eWindow >= 4) {
    // plan window
    contextP.fillStyle = "#07ebf8"; // glass
    contextP.fillRect(
      100 * SCL - eWindow * SCL - 20 * SCL,
      plan.height - 35 * SCL - pCurrThick * SCL - 2 * SCL,
      2 * eWindow * SCL + 7 * SCL,
      pCurrThick - 1 * SCL + Number(4 * SCL)
    );

    // plan window inner threshold
    contextP.beginPath();
    contextP.setLineDash([4, 3]);
    contextP.moveTo(
      100 * SCL - eWindow * SCL - 20 * SCL,
      plan.height - 36 * SCL - pCurrThick * SCL - 2 * SCL
    );
    contextP.lineTo(
      100 * SCL + Number(eWindow * SCL) - 8 * SCL - 5 * SCL,
      plan.height - 36 * SCL - pCurrThick * SCL - 2 * SCL
    );
    contextP.stroke();
    contextP.setLineDash([]);
    // plan window outer threshold
    contextP.beginPath();
    contextP.setLineDash([4, 3]);
    contextP.moveTo(100 * SCL - eWindow * SCL - 20 * SCL, plan.height - 37 * SCL);
    contextP.lineTo(100 * SCL + Number(eWindow * SCL) - 8 * SCL - 5 * SCL, plan.height - 37 * SCL);
    contextP.stroke();
    contextP.setLineDash([]);

  }
  // ELEVATION ******************************************************************
  // light blue to give hint
  contextE.fillStyle = "#a3bcfd";
  contextE.fillRect(0, 0, elevation.width, elevation.height);
  //outer Door square (3 feet wide and 6 feet 8 inches tall)
  contextE.beginPath();
  contextE.strokeStyle = "#000000";
  contextE.rect(elevation.width - 80 * SCL, elevation.height - 85 * SCL, 36 * SCL, 80 * SCL - 2 * SCL);
  contextE.stroke();
  //inner door square
  contextE.beginPath();
  contextE.rect(elevation.width - 82 * SCL, elevation.height - 87 * SCL, 40 * SCL, 84 * SCL - 2 * SCL);
  contextE.stroke();
  //door knob circle
  contextE.beginPath();
  contextE.arc(elevation.width - 48 * SCL, elevation.height - 45 * SCL, 2 * SCL, 0, 2 * Math.PI);
  contextE.stroke();

  // used as window would not disappear from plan
  if (eWindow >= 4) {
    // elevation window 4 x 3 aspect ratio
    // elevation window frame
    // black
    contextE.fillStyle = "#000000";
    contextE.fillRect(
      95 * SCL - eWindow * SCL - 10 * SCL,
      25 * SCL + 2 * SCL,
      2 * eWindow * SCL + Number(6),
      Number(((3.3 * eWindow) / 2) * SCL) + Number(4) - 10 * SCL
    );
    // blue
    contextE.fillStyle = "#a3bcfd";
    contextE.fillRect(
      96 * SCL - eWindow * SCL - 10 * SCL,
      26 * SCL + 2 * SCL,
      2 * eWindow * SCL + Number(3),
      Number(((3.3 * eWindow) / 2) * SCL) + Number(1) - 10 * SCL
    );
    // elevation window
    // black
    contextE.fillStyle = "#000000";
    contextE.fillRect(
      97 * SCL - eWindow * SCL - 10 * SCL,
      27 * SCL + 2 * SCL,
      2 * eWindow * SCL,
      Number(((3.3 * eWindow) / 2) * SCL) - 2 - 10 * SCL
    );
    // blue
    contextE.fillStyle = "#a3bcfd";
    contextE.fillRect(
      98 * SCL - eWindow * SCL - 10 * SCL,
      28 * SCL + 2 * SCL,
      2 * eWindow * SCL - 2,
      Number(((3.3 * eWindow) / 2) * SCL) - 4 - 10 * SCL
    );
  }
}

// NEED COMMENTS, Moved to setup as well
/////////////////////////////////////////////////////////////////////////////
// $(document).on('change', '#windowTRSld', function () {
//   $('#windowTRSldOut').val($(this).val());
// });
/////////////////////////////////////////////////////////////////////////////
// DELETE if Window Area ok  
// $(document).on("change", '#windowSld', function () {
//   $('#windowSldOut').val(toOneDecimal($(this).val() / 12));
// });

function toOneDecimal(num) {
  return Math.trunc((num * 10)) / 10;
}

/* 
  The purpose of this function is to change the colour of the insulation 
  depending on the selection. Also assigns the heat resistance value to
  the variable. Also deals with part of D and H
*/
function pWallColor(num) {
  switch (num) {
    case "1":
      pCurrColor = "#d2cbcd";
      rInchNum = 0;
      break;
    case "2":
      pCurrColor = "#d2cbcd";
      rInchNum = 0;
      break;
    case "3c":
      pCurrColor = "#e8e5e4";
      rInchNum = 3;
      break;
    case "3f":
      pCurrColor = "#fec7d4";
      rInchNum = 3;
      break;
    case "6":
      pCurrColor = "#fdfaaa";
      rInchNum = 6;
      break;
  }
  // makes sure that color does not change before slider is used
  if ($("#thicknessSld").val() > 2) {
    draw();
  }

  processInput();
  $('#opaqueTROut').val(2 + (opqThickNum - 2) * rInchNum);
  overallThermResitChange(); ///possibly delete
  
  


}

// all of this was moved to the setup function
///////////////////////////////////////////////////////////////////////////////////////////////////////
// D: OPAQUE THERMAL RESISTANCE when slider changed
// $(document).on('change', '#thicknessSld', function () {
//   $('#opaqueTROut').val(2 + (opqThickNum - 2) * rInchNum);
// });
// D: when construction select changed (Also part of H) NOW IN pWALLCOLOR
// $(document).on('change', '#construction', function () {
//   overallThermResitChange();
//   $('#opaqueTROut').val(2 + (opqThickNum - 2) * rInchNum);
// });
//E: when door THERMAL RESISTANCE slider changed
// $(document).on('change', '#doorTRSld', function () {
//   $('#doorTRSldOut').val($(this).val());
// });
// // H: EFFECTIVE OVERALL THERMAL RESISTANCE when slider changed
// $(document).on('change', '#thicknessSld', function () {
//   overallThermResitChange();
// });
// $(document).on('change', '#doorTRSld', function () {
//   overallThermResitChange();
// });
// $(document).on('change', '#windowTRSld', function () {
//   overallThermResitChange();
// });
// $(document).on('change', '#windowSld', function () {
//   overallThermResitChange();
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////

// $(document).on('change', '#construction', function () {
//   $('#planSldOut').val(1 / (((800 - winAreaNum) / opqTherResNum + winAreaNum / winTherResNum + 20 / doorTherResNum) / 820));
//   eoTherResNum = $('#planSldOut').val();
//   $('#AEplanSldOut').val((820*dDaysNum*1.8*24/eoTherResNum)/3412+dDaysNum*1.8*24*65/3412+3000);
// });

function overallThermResitChange() {
  //gets the tructuated windowArea outputed to use in calculations
  winAreaNum = $('#windowSldOut').val();

  $('#planSldOut').val(1 / (((800 - winAreaNum) / opqTherResNum + winAreaNum / winTherResNum + 20 / doorTherResNum) / 820));
  eoTherResNum = $('#planSldOut').val();
  $('#AEplanSldOut').val((820*dDaysNum*1.8*24/eoTherResNum)/3412+dDaysNum*1.8*24*65/3412+3000);
}

///////////////////////////////hCalculation function maybe use, toOneDecimal function would be better for this
// function hCalculation() {
//   let x = 1/(((800 - winAreaNum)/opqTherResNum + winAreaNum/winTherResNum  + 20/doorTherResNum)/820);
//   return Math.round((x * 10)) / 10;
// }

// Degree Days Choice variable assignment
function dDaysChoice(value) {
  dDaysNum = value;
  $('#AEplanSldOut').val((820*dDaysNum*1.8*24/eoTherResNum)/3412+dDaysNum*1.8*24*65/3412+3000);
}

// I: ANNUAL ENERGY, used dDaysChoice instead
// $(document).on('change', '#degreeDays', function () {
//   $('#AEplanSldOut').val((820*dDaysNum*1.8*24/eoTherResNum)/3412+dDaysNum*1.8*24*65/3412+3000);
// });
// $(document).on('change', '#planSldOut', function () {
//   $('#AEplanSldOut').val((820*dDaysNum*1.8*24/eoTherResNum)/3412+dDaysNum*1.8*24*65/3412+3000);
//   //console.log($('#AEplanSldOut').val());
//});

// shows different readouts depenign on the selection 
function showConcepts() {
  $(".textChange").change(function () {
    $('p').hide();
    var a = $(this).val();
    $("#" + a).show();
  });
}



