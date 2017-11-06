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

$('#fos_user_registration_form_zip_code').autocomplete({
	minlength : 3,
	source : function(requete, reponse){
		var input = $('#fos_user_registration_form_zip_code').val();
		$.ajax({
			type: 'GET',
			url: 'https://datanova.legroupe.laposte.fr/api/records/1.0/search/',
			datatype: 'json',
			data: {
				"dataset": "laposte_hexasmal",
				"q": input,
				"facet": [
				"nom_de_la_commune",
				"code_postal"
				],

			},
			success: function (res){
				console.log(res);
				reponse($.map(res.records, function(objet){
					return objet.nom_de_la_commune;
				}));
			}
		});
	}
});

$('#fos_user_registration_form_zip_code').keyup(function() {
	var input = $('#fos_user_registration_form_zip_code').val();
	if (input.length < 3) {
		console.log(input);
	} else {
		zipCaller(input);
	}
});

function zipCaller(input) {
	$.ajax({

		type: 'GET',

		url: 'https://datanova.legroupe.laposte.fr/api/records/1.0/search/',

		data: {

			"dataset": "laposte_hexasmal",

			"q": input,

			"facet": [

			"nom_de_la_commune",

			"code_postal"

			]
		},

		success: function(res) {
			console.log(res);
			var datas = res['records'];
			let city = [];
			for (var i = 0; i < datas.length; i++) {
				city.push({
					label: datas[i]['fields']['code_postal'],
					value: datas[i]['fields']['nom_de_la_commune']

				});
			}

			console.log(city);
			$('#fos_user_registration_form_zip_code').autocomplete({

				minLength: 3,
				source: city,
				focus: function(event, ui) {
					$("#fos_user_registration_form_zip_code").val(ui.item.label);
					return false;
				},
				select: function(event, ui) {
					$("#fos_user_registration_form_zip_code").val(ui.item.label);
					$("#fos_user_registration_form_city").val(ui.item.value);
					return false;
				}
			}).autocomplete("instance")._renderItem = function(ul, item) {
				return $("<li>")
				.append("<div>" + item.value + "</div>")
				.appendTo(ul);
			}
		}
	});
}