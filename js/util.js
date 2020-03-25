function update_snow_qm_task_data(data) {
  //container = document.getElementById('snow-qm_'+data.graph+"_"+data.task);
  container = $('div.snow-qm-task[source="snow-qm:'+data.collection+":"+data.task+'"]');
  console.log(data);
  console.log(container);
  $(container).find('span[class="question_view"]').html(data.html); 
  form = $(container).find('form');
  $(form).append($(document.createElement('input')).attr('name','collection').attr('type','hidden').val(data.collection));
  $(form).append($(document.createElement('input')).attr('name','task').attr('type','hidden').val(data.task));
  //$(container).find('input[name="collection"]').val(data.collection);
  //$(container).find('input[name="task"]').val(data.task);
  $(container).find('input[type="text"]').after('<span class="answer_marker"></span>');
  $(form).submit(function (e) {
    socket.emit('form_submit', data=getFormData( $(this) ));
    e.preventDefault(); // block the traditional submission of the form.
  });
}