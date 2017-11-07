$('.show-register-form').on('click', function(){
	if( ! $(this).hasClass('active') ) {
		$('.show-login-form').removeClass('active');
		$(this).addClass('active');
		$('.login-form').fadeOut('fast', function(){
			$('.register-form').fadeIn('fast');
		});
	}
});
$('.show-login-form').on('click', function(){
	if( ! $(this).hasClass('active') ) {
		$('.show-register-form').removeClass('active');
		$(this).addClass('active');
		$('.register-form').fadeOut('fast', function(){
			$('.login-form').fadeIn('fast');
		});
	}
});

var registerStep = 0;

$('.register-submit').on('click', function(event){
	if (registerStep == 0) {
		$('.step-0').fadeOut('fast', function(){
			$('.step-1').fadeIn('fast');
		});
	}
	if (registerStep == 1) {
		$('.step-1').fadeOut('fast', function(){
			$('.step-2').fadeIn('fast');
		});
	}
	if (registerStep == 2) {
		$(".fos_user_registration_register").submit();
	}
	registerStep++;
});
$('#fos_user_registration_form_adress').keyup(function() {
	var input = $('#fos_user_registration_form_adress').val();
	if (input.length > 3){
		zipCaller(input);
	}
});

function zipCaller(input) {
	$.ajax({

		type: 'GET',
			url: 'https://api-adresse.data.gouv.fr/search',
			datatype: 'json',
			data: {
				"q": input
			},
		success: function(res) {
			var datas = res.features;
			let adress = [];
			for (var i = 0; i < datas.length; i++) {
				adress.push({
					name: datas[i].properties.label,
					label: datas[i].properties.name,
					zipCode: datas[i].properties.postcode,
					city: datas[i].properties.city,
					area: datas[i].properties.context.split(',')[2]
				});
			}
			console.log(adress);
			$('#fos_user_registration_form_adress').autocomplete({
				source: adress,
			
				select: function (event, ui){
					$('#fos_user_registration_form_adress').val(ui.item.label);
					$('#fos_user_registration_form_region').val(ui.item.area);
					$('#fos_user_registration_form_zip_code').val(ui.item.zipCode);
					$('#fos_user_registration_form_city').val(ui.item.city);
				}
			}).autocomplete( "instance" )._renderItem = function( ul, item ) {
				return $( "<li>" )
					.append( "<div>" + item.name + "</div>" )
					.appendTo( ul );
				};
			
		}
	});
}