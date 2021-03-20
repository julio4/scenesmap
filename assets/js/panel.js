//Après chargement de la page
$(document).ready(function(){
  var pannel = $('#information');
  var close =  $('#cancel');

  close.click(()=>{
    pannel.removeClass('active')
  })
});