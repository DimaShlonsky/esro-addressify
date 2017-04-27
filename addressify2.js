/* Dima, 24/03/2017 */
define(['js/res!custom/addressify2.res'], function(res){
    (function(options){
		var addressFormat = options.addressFormat;
        if ($(options.userDataTargetField).length){
            init($("body"), $(options.userDataTargetField));
        }else{
            $(document).on("dialogopen", ".loginOrRegisterDlg", function(e, ui){
                var container;
                $(options.loginOrRegisterDialogTarget).before(
                    $("<tr>", {"class":"row Addressify"}).append(
                        $("<td>", {"class":"label", text:res.Captions.Custom_1133341})
                    ).append(
                        container = $("<td>", {"class":"field"})
                    )
                );
                init($(e.target), container);
            });
        }

	    function init(container, targetField){
		    var input;
		    $(targetField).append(
			    input = $("<input>", {type:"text", id:"addresifyInput"})
			        .autocomplete({
				        source: function(req, callback){
					        var params = {"addr1":req.term}
					        var countryField = $("#fldCountryIdOrName", container);
					        var countryId = params.countryId = countryField.val() ||
						            countryField.attr("value"); //workaround for when the <option> is missing
						    var countryOption;
					        if (countryId!=""){
					            countryOption = countryField.find("option[value='"+countryId+"']");
						        if (countryOption.length && countryOption.text().trim().toLowerCase()!="australia"){
							        return;
						        }
					        }
					        //var stateId = $("#fldStateIdOrName", container).val();
					        //if (stateId!=""){
						    //    params.stateId = stateId;
					        //}
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
					        $("#fldAddress", container).val(address.addr1);
					        $("#fldAddress2", container).val(address.addr2);
					        $("#fldAddress3", container).val(address.addr3);
					        setAutoCompleteControlValue(
					            $("#fldCityIdOrName", container), address.city.id, address.city.name 
					        );
							setAutoCompleteControlValue(
					        	$("#fldStateIdOrName", container), address.state.id, address.state.name
							);
					        $("#fldZipCode", container).val(address.zip);
					        if (address.country){
					            setAutoCompleteControlValue(
					                $("#fldCountryIdOrName", container), address.country.id, address.country.name
					            );
					        }
				        }
			        })
		    );
		    input.autocomplete("widget").css("z-index","110") //has to be >= the dialog's z-index
	    }
    	
	    function setAutoCompleteControlValue(control, id, name){
	        if (control.is("select"))
	        {
	            if (!id) return;
	            if (control.find("option").filter(function(i,e){
	                return $(this).attr("value")==id;
	            }).length==0)
	            {
	                control.append($("<option>", {value:id, text: name})); 
	            }
    	        
	            control.val(id); 
    	        
	            if ($("+.ui-combobox", control).length){
	                $("+.ui-combobox .ui-autocomplete-input", control).val(name);
	            }
	        }else{
	            control.val(name);
	        }
	    }
    })({
	    userDataTargetField : ".fieldCaption[tix\\:for=AddressCaption]",
	    loginOrRegisterDialogTarget: ".row.Address",
		addressFormat: "{address1} {address2} {address3}, {city} {zip}, {state} {country}"
    })
});