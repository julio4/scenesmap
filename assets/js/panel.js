
$(document).ready(function(){
  var pannel = $('#information');
  var close =  $('#cancel');

  close.click(()=>{
    pannel.removeClass('active')
  })
});