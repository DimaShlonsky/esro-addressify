(function(options){
	var addressFormat = options.addressFormat;
	$(options.targetField).append(
		$("<input>", {type:"text", id:"addresifyInput"}).autocomplete({
			source: function(req, callback){
				var params = {"addr1":req.term}
				var countryField = $("#fldCountry");
				if (countryField.val()!=""){
					if (countryField.find("option:selected").text().trim().toLowerCase()!="australia"){
						return;
					}
					params.countryId = countryField.val();
				}
				var stateId = $("#fldState").val();
				if (stateId!=""){
					params.stateId = stateId;
				}
				$.ajax($eSRO.siteBasePath +"qas.ashx?op=search&"+ $.fn.location("serializeParams", params))
					.done(function(data, status, xhr){
						callback(
							$.map(data, function(e,i){
								return {
									label: addressFormat.formatObject({
										address1: e.addr1 || undefined, 
										address2: e.addr2 || undefined,
										address3: e.addr3 || undefined,
										city:e.city.name || undefined,
										state:e.state.name || undefined,
										zip:e.zip || undefined,
										country: e.country && e.country.name || undefined
									}),
									value: e
								};
							})
						);
					})
			},
			focus: function(event, ui){
				$(this).val(ui.item.label);
				event.preventDefault();
			},
			select: function(event, ui){
				$(this).val(ui.item.label);
				event.preventDefault();
				var address = ui.item.value;
				//console.log(address);
				$("#fldAddress").val(address.addr1);
				$("#fldAddress2").val(address.addr2);
				$("#fldAddress3").val(address.addr3);
				$("#fldCity").val(address.city.name);
				$("#fldState").val(address.state.id);
				$("#fldZipCode").val(address.zip);
				if (address.country){
					$("#fldCountry").val(address.country.id);
				}
			}
		})
	);
})({
	targetField : $(".fieldCaption[data-for=AddressCaption]"),
	addressFormat: "{address1} {address2} {address3}, {city} {zip}, {state}"
})