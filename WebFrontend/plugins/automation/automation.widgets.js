(function ()
{
	function HexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
	function HexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
	function HexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
	function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
	
	function sendPathedJson(fullPath, value)
	{
		var datasourceRegex = new RegExp('"(.*?)"', 'g');
		var matches = datasourceRegex.exec(fullPath);
		var url = freeboard.getDatasourceSettings(matches[1]).url;
		
		var path = [];
		while (matches = datasourceRegex.exec(fullPath))
		{
			path.push(matches[1]);
		}
		
		var root = {};
		var last = root;
		for (var i=0; i<path.length-1; i++)
		{
			var child = {};
			last[path[i]] = child;
			last = child;
		}
		
		last[path[path.length-1]] = value;

		var json = JSON.stringify(root);
		sendJson(url, json);
	}
	
	function sendJson(target, json)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('PUT', target);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.send(json);
	}

	function sendColor(target, r, g, b)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('PUT', 'http://bypass.legone.name:8080');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			if (xhr.status === 200) {
				var userInfo = JSON.parse(xhr.responseText);
			}
		};
		xhr.send('{"Wohnzimmer":{"Beleuchtung":{"Schrank":{"1":'+g+',"2":'+r+',"3":'+b+'}}}}');
	}

	function hexFromRGB(r, g, b)
	{
		var hex =
		[
			r.toString( 16 ),
			g.toString( 16 ),
			b.toString( 16 )
		];

		$.each( hex, function( nr, val )
		{
			if (val.length === 1)
			{
				hex[ nr ] = "0" + val;
			}
		});
		
		return hex.join( "" ).toUpperCase();
	}

    var ledWidget = function (settings)
	{
        var self = this;

        var currentSettings = settings;
		var displayElement = $('<div class="tw-display"></div>');
		var titleElement = $('<h2 class="section-title tw-title tw-td"></h2>');
		
		var colormap = $('<div style="padding: 32px;"></div>');

        var sliderRed = $('<div class="sliderRed"></div>');
		var sliderGreen = $('<div class="sliderGreen"></div>');
		var sliderBlue = $('<div class="sliderBlue"></div>');
		var swatch = $('<div class="ui-widget-content ui-corner-all swatch"></div>');


		function refreshSwatch(that)
		{
			var div = $(that).parent();
			
			var red = div.find(".sliderRed").slider("value");
			var green = div.find(".sliderGreen").slider("value");
			var blue = div.find(".sliderBlue").slider("value");
			
			var hex = hexFromRGB(red, green, blue);
			div.find(".swatch").css("background-color", "#" + hex);
		}
		
        this.render = function (element)
		{
			$(element).empty();

			$(displayElement)
				.append($('<div class="tw-tr"></div>').append(titleElement))
				.append($('<div class="tw-tr"></div>').append($('<div class="tw-value-wrapper tw-td"></div>')));

			if (currentSettings.method == 'colormap')
			{
				$(colormap).colorpicker({defaultPalette:'web', hideButton: true, displayIndicator: false, transparentColor: true})
				.on("change.color", function(event, color)
				{
					var r, g, b;
					if (color.substr(0,1) == "#")
					{
						color = color.substr(1);
					}
					color = color.replace(/;/g, "");
					r = HexToR(color);
					g = HexToG(color);
					b = HexToB(color);
					
					sendPathedJson(currentSettings.LEDColorRed, r);
					sendPathedJson(currentSettings.LEDColorGreen, g);
					sendPathedJson(currentSettings.LEDColorBlue, b);
				});

				$(displayElement).append(colormap);

				//$(displayElement).append('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="435 240 355 345" enable-background="new 448.1 251.5 329.2 323.8" xml:space="preserve" id="color-picker" class="color-picker"><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#000000" points="728.4,279.4 744.9,289 744.9,308.1 728.4,317.7 711.8,308.1 711.8,289 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#000055" points="629.2,451.6 645.7,461.2 645.7,480.3 629.2,489.9 612.7,480.3 612.7,461.2 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#0000AA" points="596.2,451.6 612.7,461.2 612.7,480.3 596.2,489.9 579.7,480.3 579.7,461.2 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#0000FF" points="579.7,480.3 596.2,489.9 596.2,509 579.7,518.6 563.1,509 563.1,489.9 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#005500" points="579.7,365.5 596.2,375.1 596.2,394.2 579.7,403.8 563.1,394.2 563.1,375.1 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#005555" points="596.2,394.2 612.7,403.8 612.7,422.9 596.2,432.5 579.7,422.9 579.7,403.8 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#0055AA" points="579.7,422.9 596.2,432.5 596.2,451.6 579.7,461.2 563.1,451.6 563.1,432.5 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#0055FF" points="563.1,509 579.7,518.6 579.7,537.7 563.1,547.3 546.6,537.7 546.6,518.6 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#00AA00" points="530.1,336.9 546.6,346.4 546.6,365.5 530.1,375.1 513.6,365.6 513.6,346.4 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#00AA55" points="513.6,365.6 530.1,375.1 530.1,394.2 513.6,403.8 497,394.3 497,375.1 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#00AAAA" points="530.1,394.2 546.6,403.8 546.6,422.9 530.1,432.5 513.6,422.9 513.6,403.8 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#00AAFF" points="563.1,451.6 579.7,461.2 579.7,480.3 563.1,489.9 546.6,480.3 546.6,461.2 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#00FF00" points="513.6,308.2 530.1,317.7 530.1,336.9 513.6,346.4 497,336.9 497,317.7 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#00FF55" points="497,336.9 513.6,346.4 513.6,365.6 497,375.1 480.5,365.6 480.5,346.4 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#00FFAA" points="497,394.3 513.6,403.8 513.6,422.9 497,432.5 480.5,423 480.5,403.8 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#00FFFF" points="513.6,422.9 530.1,432.5 530.1,451.6 513.6,461.2 497,451.6 497,432.5 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#550000" points="678.8,422.9 695.3,432.5 695.3,451.6 678.8,461.2 662.3,451.6 662.3,432.5 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#550055" points="662.3,451.6 678.8,461.2 678.8,480.3 662.3,489.9 645.7,480.3 645.7,461.2 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#5500AA" points="645.7,480.3 662.3,489.9 662.3,509 645.7,518.6 629.2,509 629.2,489.9 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#5500FF" points="612.7,480.3 629.2,489.9 629.2,509 612.7,518.6 596.2,509 596.2,489.9 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#555500" points="612.7,365.5 629.2,375.1 629.2,394.2 612.7,403.8 596.2,394.2 596.2,375.1 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#555555" points="761.4,279.4 777.9,289 777.9,308.1 761.4,317.7 744.9,308.1 744.9,289 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#5555AA" points="629.2,509 645.7,518.6 645.7,537.7 629.2,547.2 612.7,537.7 612.7,518.6 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#5555FF" points="596.2,509 612.7,518.6 612.7,537.7 596.2,547.3 579.7,537.7 579.7,518.6 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#55AA00" points="563.1,336.9 579.7,346.4 579.7,365.5 563.1,375.1 546.6,365.6 546.6,346.4 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#55AA55" points="546.6,365.5 563.1,375.1 563.1,394.2 546.6,403.8 530.1,394.2 530.1,375.1 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#55AAAA" points="563.1,394.2 579.7,403.8 579.7,422.9 563.1,432.5 546.6,422.9 546.6,403.8 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#55AAFF" points="546.6,480.3 563.1,489.9 563.1,509 546.6,518.6 530.1,509 530.1,489.9 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#55FF00" points="530.1,279.5 546.6,289 546.6,308.2 530.1,317.7 513.6,308.2 513.6,289 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#55FF55" points="480.5,308.2 497,317.7 497,336.9 480.5,346.4 464,336.9 464,317.7 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#55FFAA" points="480.5,365.6 497,375.1 497,394.3 480.5,403.8 464,394.3 464,375.1 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#55FFFF" points="480.5,423 497,432.5 497,451.6 480.5,461.2 464,451.7 464,432.5 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AA0000" points="711.8,422.9 728.4,432.5 728.4,451.6 711.8,461.2 695.3,451.6 695.3,432.5 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AA0055" points="695.3,451.6 711.8,461.2 711.8,480.3 695.3,489.9 678.8,480.3 678.8,461.2 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AA00AA" points="678.8,480.3 695.3,489.9 695.3,509 678.8,518.6 662.3,509 662.3,489.9 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AA00FF" points="662.3,509 678.8,518.5 678.8,537.7 662.3,547.2 645.7,537.7 645.7,518.5 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AA5500" points="678.8,365.5 695.3,375.1 695.3,394.2 678.8,403.8 662.3,394.2 662.3,375.1 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AA5555" points="695.3,394.2 711.8,403.8 711.8,422.9 695.3,432.5 678.8,422.9 678.8,403.8 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AA55AA" points="695.3,509 711.8,518.5 711.8,537.6 695.3,547.2 678.8,537.7 678.8,518.5 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AA55FF" points="678.8,537.7 695.3,547.2 695.3,566.4 678.8,575.9 662.3,566.4 662.3,547.2 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AAAA00" points="629.2,336.8 645.7,346.4 645.7,365.5 629.2,375.1 612.7,365.5 612.7,346.4 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AAAA55" points="596.2,336.9 612.7,346.4 612.7,365.5 596.2,375.1 579.7,365.6 579.7,346.4 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AAAAAA" points="711.8,250.7 728.4,260.3 728.4,279.4 711.8,289 695.3,279.4 695.3,260.3 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FFFFFF" points="744.9,250.7 761.4,260.3 761.4,279.4 744.9,289 728.4,279.4 728.4,260.3 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AAAAFF" points="612.7,537.7 629.2,547.3 629.2,566.4 612.7,575.9 596.2,566.4 596.2,547.3 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AAFF00" points="563.1,279.5 579.7,289 579.7,308.1 563.1,317.7 546.6,308.2 546.6,289 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AAFF55" points="546.6,250.8 563.1,260.3 563.1,279.5 546.6,289 530.1,279.5 530.1,260.3 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AAFFAA" points="464,279.5 480.5,289 480.5,308.2 464,317.7 447.5,308.2 447.5,289 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#AAFFFF" points="464,451.7 480.5,461.2 480.5,480.4 464,489.9 447.5,480.4 447.5,461.2 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FF0000" points="711.8,365.5 728.4,375.1 728.4,394.2 711.8,403.8 695.3,394.2 695.3,375.1 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FF0055" points="728.4,394.2 744.9,403.8 744.9,422.9 728.4,432.4 711.8,422.9 711.8,403.8 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FF00AA" points="728.4,451.6 744.9,461.2 744.9,480.3 728.4,489.9 711.8,480.3 711.8,461.2 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FF00FF" points="711.8,480.3 728.4,489.9 728.4,509 711.8,518.5 695.3,509 695.3,489.9 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FF5500" points="695.3,336.8 711.8,346.4 711.8,365.5 695.3,375.1 678.8,365.5 678.8,346.4 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FF5555" points="744.9,365.5 761.4,375.1 761.4,394.2 744.9,403.7 728.4,394.2 728.4,375.1 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FF55AA" points="744.9,480.3 761.4,489.8 761.4,509 744.9,518.5 728.4,509 728.4,489.8 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FF55FF" points="728.4,509 744.9,518.6 744.9,537.7 728.4,547.2 711.8,537.7 711.8,518.6 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FFAA00" points="662.3,336.8 678.8,346.4 678.8,365.5 662.3,375.1 645.7,365.5 645.7,346.4 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FFAA55" points="678.8,308.1 695.3,317.7 695.3,336.8 678.8,346.4 662.3,336.8 662.3,317.7 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FFAAAA" points="761.4,336.8 777.9,346.4 777.9,365.5 761.4,375.1 744.9,365.5 744.9,346.4 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FFAAFF" points="761.4,509 777.9,518.5 777.9,537.6 761.4,547.2 744.9,537.7 744.9,518.5 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FFFF00" points="645.7,308.1 662.3,317.7 662.3,336.8 645.7,346.4 629.2,336.8 629.2,317.7 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FFFF55" points="662.3,279.4 678.8,289 678.8,308.1 662.3,317.7 645.7,308.1 645.7,289 	"/><polygon stroke="#FFFFFF" stroke-width="1.5" fill="#FFFFAA" points="645.7,250.7 662.3,260.3 662.3,279.4 645.7,289 629.2,279.4 629.2,260.3 	"/></svg>');
			}
			else
			{				
				$(sliderRed).slider({orientation: "vertical", max: 255, change: function(event, ui) { if (event.originalEvent) { refreshSwatch(this); sendPathedJson(currentSettings.LEDColorRed, ui.value); } }});
				$(sliderGreen).slider({orientation: "vertical", max: 255, change: function(event, ui) { if (event.originalEvent) { refreshSwatch(this); sendPathedJson(currentSettings.LEDColorGreen, ui.value); } }});
				$(sliderBlue).slider({orientation: "vertical", max: 255, change: function(event, ui) { if (event.originalEvent) { refreshSwatch(this); sendPathedJson(currentSettings.LEDColorBlue, ui.value); } }});

				$(displayElement)
					.append(sliderRed)
					.append(sliderGreen)
					.append(sliderBlue)
					.append(swatch);
			}

			$(element).append(displayElement);
        }

		this.onCalculatedValueChanged = function (settingName, newValue)
		{
			if (currentSettings.method != 'colormap')
			{
				if (settingName == 'LEDColorRed')
				{
					sliderRed.slider({'value': newValue});
				}
				else if (settingName == 'LEDColorGreen')
				{
					sliderGreen.slider({'value': newValue});
				}
				else if (settingName == 'LEDColorBlue')
				{
					sliderBlue.slider({'value': newValue});
				}
				
				refreshSwatch(sliderBlue);
			}
        }
		
        this.onSettingsChanged = function (newSettings)
		{
            currentSettings = newSettings;

			var shouldDisplayTitle = (!_.isUndefined(newSettings.title) && newSettings.title != "");

			if(shouldDisplayTitle)
			{
				titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
				titleElement.attr("style", null);
			}
			else
			{
				titleElement.empty();
				titleElement.hide();
			}
        }
		
		this.getHeight = function()
		{
			if (currentSettings.method == 'colormap')
			{
				return 5;
			}
			else
			{
				return 4;
			}
		}
		
        this.onDispose = function()
		{

        }

        this.onSettingsChanged(settings);
    };

	freeboard.loadWidgetPlugin(
	{
        type_name: "led_widget",
        display_name: "LED-Color",
        "external_scripts":
		[
			"plugins/automation/extern/colorpicker/js/evol.colorpicker.js"
        ],
        settings:
		[
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
            {
                name: "method",
                display_name: "Method",
                type: "option",
                options: [
                    {
                        name: "Colormap",
                        value: "colormap"
                    },
                    {
                        name: "Sliders",
                        value: "sliders"
                    }
                ]
            },
            {
                name: "LEDColorRed",
                display_name: "LEDColorRed",
                type: "calculated"
            },
            {
                name: "LEDColorGreen",
                display_name: "LEDColorGreen",
                type: "calculated"
            },
            {
                name: "LEDColorBlue",
                display_name: "LEDColorBlue",
                type: "calculated"
            }
        ],
        newInstance: function (settings, newInstanceCallback)
		{
            newInstanceCallback(new ledWidget(settings));
        }
    });

	// PAR12LEDWidget
	
    var PAR12LEDWidget = function (settings)
	{
        var self = this;

        var currentSettings = settings;
		var displayElement = $('<div class="tw-display"></div>');
		var titleElement = $('<h2 class="section-title tw-title tw-td"></h2>');
		
		var optionFunction = $('<select class="optionFunction"><option value="0">No Function</option><option value="25">Static Color</option><option value="75">Jump</option><option value="125">Gradual</option><option value="175">Sound Activate</option><option value="255">Strobe</option></select>');
		var optionColor = $('<select class="optionColor"><option value="0">All Color</option><option value="45">Red</option><option value="55">Green</option><option value="65">Blue</option><option value="75">Yellow</option><option value="85">Cyan</option><option value="95">Purple</option><option value="105">White</option><option value="115">Red+Green</option><option value="125">Red+Blue</option><option value="135">Red+White</option><option value="145">Green+Blue</option><option value="155">Green+White</option><option value="165">Blue+White</option><option value="175">Red+Green+White</option><option value="185">Red+Blue+White</option><option value="195">Green+Blue+White</option><option value="205">Red+Green+Blue</option><option value="255">Red+Green+Blue+White</option></select>');
        var sliderSpeed = $('<div class="sliderMaster"></div>');
        var sliderMaster = $('<div class="sliderMaster"></div>');
        var sliderRed = $('<div class="sliderRed"></div>');
		var sliderGreen = $('<div class="sliderGreen"></div>');
		var sliderBlue = $('<div class="sliderBlue"></div>');
		var sliderWhite = $('<div class="sliderWhite"></div>');

        this.render = function (element)
		{
			$(element).empty();

			$(displayElement)
				.append($('<div class="tw-tr"></div>').append(titleElement))
				.append($('<div class="tw-tr"></div>').append($('<div class="tw-value-wrapper tw-td"></div>')));

			$(optionFunction).change(function() { sendPathedJson(currentSettings.LEDFunction, $(this).val()); });
			$(optionColor).change(function() { sendPathedJson(currentSettings.LEDColor, $(this).val()); });
			$(sliderSpeed).slider({ orientation: "vertical", max: 255, change: function(event, ui) { if (event.originalEvent) { sendPathedJson(currentSettings.LEDSpeed, ui.value); } }});
			$(sliderMaster).slider({ orientation: "vertical", max: 255, change: function(event, ui) { if (event.originalEvent) { sendPathedJson(currentSettings.LEDMaster, ui.value); } }});
			$(sliderRed).slider({ orientation: "vertical", max: 255, change: function(event, ui) { if (event.originalEvent) { sendPathedJson(currentSettings.LEDRed, ui.value); } }});
			$(sliderGreen).slider({ orientation: "vertical", max: 255, change: function(event, ui) { if (event.originalEvent) { sendPathedJson(currentSettings.LEDGreen, ui.value); } }});
			$(sliderBlue).slider({ orientation: "vertical", max: 255, change: function(event, ui) { if (event.originalEvent) { sendPathedJson(currentSettings.LEDBlue, ui.value); } }});
			$(sliderWhite).slider({ orientation: "vertical", max: 255, change: function(event, ui) { if (event.originalEvent) { sendPathedJson(currentSettings.LEDWhite, ui.value); } }});

			$(displayElement)
				.append(optionFunction)
				.append(optionColor)
				.append(sliderSpeed)
				.append(sliderMaster)
				.append(sliderRed)
				.append(sliderGreen)
				.append(sliderBlue)
				.append(sliderWhite);

			$(element).append(displayElement);
        }

		this.onCalculatedValueChanged = function (settingName, newValue)
		{
            if (settingName == 'LEDSpeed')
			{
				sliderSpeed.slider({'value': newValue});
            }
            else if (settingName == 'LEDMaster')
			{
				sliderMaster.slider({'value': newValue});
            }
            else if (settingName == 'LEDRed')
			{
				sliderRed.slider({'value': newValue});
            }
			else if (settingName == 'LEDGreen')
			{
				sliderGreen.slider({'value': newValue});
			}
			else if (settingName == 'LEDBlue')
			{
				sliderBlue.slider({'value': newValue});
			}
			else if (settingName == 'LEDWhite')
			{
				sliderWhite.slider({'value': newValue});
			}
        }
		
        this.onSettingsChanged = function (newSettings)
		{
            currentSettings = newSettings;

			var shouldDisplayTitle = (!_.isUndefined(newSettings.title) && newSettings.title != "");

			if (shouldDisplayTitle)
			{
				titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
				titleElement.attr("style", null);
			}
			else
			{
				titleElement.empty();
				titleElement.hide();
			}
        }
		
		this.getHeight = function()
		{
			return 4.5;
		}
		
        this.onDispose = function()
		{

        }

        this.onSettingsChanged(settings);
    };

	freeboard.loadWidgetPlugin(
	{
        type_name: "par12led_widget",
        display_name: "PAR12 LED",
        settings:
		[
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
            {
                name: "LEDFunction",
                display_name: "LEDFunction",
                type: "calculated"
            },
            {
                name: "LEDColor",
                display_name: "LEDColor",
                type: "calculated"
            },
            {
                name: "LEDSpeed",
                display_name: "LEDSpeed",
                type: "calculated"
            },
            {
                name: "LEDMaster",
                display_name: "LEDMaster",
                type: "calculated"
            },
            {
                name: "LEDRed",
                display_name: "LEDRed",
                type: "calculated"
            },
            {
                name: "LEDGreen",
                display_name: "LEDGreen",
                type: "calculated"
            },
            {
                name: "LEDBlue",
                display_name: "LEDBlue",
                type: "calculated"
            },
            {
                name: "LEDWhite",
                display_name: "LEDWhite",
                type: "calculated"
            }
        ],
        newInstance: function (settings, newInstanceCallback)
		{
            newInstanceCallback(new PAR12LEDWidget(settings));
        }
    });

	freeboard.addStyle('.relay-light', "border-radius:50%;width:22px;height:22px;border:2px solid #c6f291;margin-top:5px;float:left;background-color:#222;margin-right:10px;");
	freeboard.addStyle('.relay-light.on', "background-color:#b8ec79;box-shadow: 0px 0px 15px #9fda58;border-color:#f1fbe5;");
	freeboard.addStyle('.relay-button', "float:right;height:34px;");
    var relayWidget = function (settings)
	{
        var self = this;
        var titleElement = $('<h2 class="section-title"></h2>');
        var stateElement = $('<button class="relay-button" href="#"></button>');
        var relayElement = $('<div class="relay-light"></div>');
        var currentSettings = settings;
        var isOn = false;

        function updateState()
		{
            relayElement.toggleClass("on", isOn);

            if (isOn)
			{
                stateElement.text('Deactivate');
            }
            else
			{
                stateElement.text('Activate');
            }
        }

		this.render = function (element)
		{
			$(stateElement).button().on("click", function()
			{
				sendPathedJson(currentSettings.value, isOn ? 0 : 1);
			});
			
            $(element).append(titleElement).append(relayElement).append(stateElement);
        }

        this.onSettingsChanged = function (newSettings)
		{
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
            updateState();
        }

        this.onCalculatedValueChanged = function (settingName, newValue)
		{
            if (settingName == "value")
			{
                isOn = Boolean(newValue);
            }

            updateState();
        }

        this.onDispose = function ()
		{
        }

        this.getHeight = function ()
		{
            return 1;
        }

        this.onSettingsChanged(settings);
    };

    freeboard.loadWidgetPlugin(
	{
        type_name: "relay",
        display_name: "Relay",
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text"
            },
            {
                name: "value",
                display_name: "Value",
                type: "calculated"
            },
        ],
        newInstance: function (settings, newInstanceCallback)
		{
            newInstanceCallback(new relayWidget(settings));
        }
    });
}());
