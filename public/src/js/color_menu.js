$(function() {
    var $select = $('#select-groups').selectize({
	maxItems: null,
	valueField: 'id',
	labelField: 'title',
	searchField: 'title',
	options: [
	    {id: 'project', title: 'Data source'},
	    {id: 'tissue_general', title: 'General tissue'},
	    {id: 'tissue_detail', title: 'Detailed tissue'},
	    {id: 'extraction_kit', title: 'Extraction kit'},
	    {id: 'seq_platform', title: 'Sequencing platform'}
	],
	create: false
    });

    var control = $select[0].selectize;

    $('#color-button').on('click', function() {
	var vals = control.getValue();
	angular.element('#top').scope().buildTraces(angular.element('#top').scope().data,vals)
	    .then((result) => {
		angular.element('#top').scope().traces = result;
	    });
    });
});
