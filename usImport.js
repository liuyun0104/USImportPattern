// JavaScript Document
(function() {
	//load data
	d3.csv('totalImport.csv', function(dataset) {
		var svg = d3.select("svg");		
		var dataSet = dataset;
		var colorSet = {"total":"#E08E79", "oil":"#FD491C", "dairy":"#E0172B", "grains":"#970027", "meat": "#520218", 
						"seafood":"#68C089", "sugar":"#3A71AA", "spices":"#110B79","cocoa":"#48258E",
						"tea":"#F2F91C", "coffee":"#CCE70B", "vegetables":"#80C41C", "fruits":"#12491D"
						};
						
		var foodChosen = new Array(); // a global variable to store the food types that have been checked. 
		var year = 1998;
		var foodPresentList = new Array();
		var drawing = false;
		
		//draw the bar chart
		var bar = svg.append("g").attr("id","barChart");
		var xBar = 18, yBar = 400; 
		var hBar;
		var textyear=1998;
		var title=bar.append("text")
					.attr("x",xBar+260)
					.attr("y",yBar-60)
					.attr("text-anchor", "middle")
					.attr("opacity",1)
					.text("Imports of Total Food (Million US$)")
					.attr("fill","#999");
		for (var j=1; j<11; j++){
			var y = d3.keys(dataset[0]);
			y = y[j];
			var total=Number(dataset[0][y]);
			
						 
			//using scale to create actually height of the bars. 
			var hScale = d3.scale.linear().domain([0,80000]).range([0,50]);
			hBar = hScale(total);
			var yBar2;
			yBar2=yBar-hBar;
			bar.append("rect")
				.attr("x",xBar)
				.attr("y",yBar)
				.attr("width", 10)
				.attr("fill","#7BB1BA")
				.attr("height",0)
				.transition().duration(1000)
				.attr("height",hBar)
				.transition().duration(1000)
				.attr("y",yBar2);
						 
			var textTotal = bar.append("text")
						 		.attr("x",xBar)
								.attr("y",yBar2-10)
								.attr("text-anchor", "middle")
								.attr("opacity",1)
								.text(total)
								.attr("fill","#764F38");
								
			var textYear = bar.append("text")
							  .attr("x",xBar)
							  .attr("y",410)
							  .attr("text-anchor", "middle")
							  .attr("opacity",1)
							  .text(textyear)
							  .attr("fill","#999");
			textyear++;					 
			xBar +=61;
					  
		}
		
		//draw the slider UI
		
		$( ".slider" ).slider({
          	   animate: true,
               range: "min",
               value: 1998,
               min: 1998,
               max: 2007,
               step: 1,
 
               //this gets a live reading of the value and prints it on the page
               slide: function( event, ui ) {
                   $( "#slider-result" ).html( ui.value );
               },
 
               //this updates the hidden form field so we can submit the data using a form
               change: function(event, ui) {
					year = ui.value;
					$('#hidden').attr('value', ui.value);
					foodChosen = getFoodType();
					//alert("72 year="+year+"foodChosen="+foodChosen);
					addCircles(year, foodChosen);
               }
 
          });
          
        //initialize the animation
        
        foodChosen = getFoodType();
		//alert("line78 year="+year+" foodChosen="+foodChosen);
		addCircles(year,foodChosen);
		
		d3.selectAll("#foodChoices td").on("mouseover",function(){
			//d3.selectAll("#foodChoices td").classed('highlight', true);
			d3.select(this).classed('highlight', true);
			//alert("here88");
			var id=d3.select(this).attr("id");
			var checkbox = "#foodChoices input#"+id;
			var isChecked = d3.select(checkbox).property("checked");
			var circleFade = "#countries g";
			//var circleUnfade="#countries #"+id+" g circle";
			var circleUnfade2="#countries #"+id+" g";
			var circleUnfade1="#countries #"+id;
			//alert(circleUnfade);
			//alert(checkbox+" checked= "+isChecked);
			if(isChecked){
				d3.selectAll(circleFade).classed('fade',true);
				d3.selectAll(circleUnfade1).classed('fade',false);
				d3.selectAll(circleUnfade2).classed('fade',false);
			}
		})
		.on("mouseout",function(){
			d3.select(this).classed('highlight', false);
			var id=d3.select(this).attr("id");			
			var circleFade = "#countries g";
			var circleUnfade="#countries #"+id;
			d3.selectAll(circleFade).classed('fade',false);
		});
		
		d3.selectAll("#foodChoices input").on("click", function(){
			foodChosen = getFoodType();
			/*for (var i=0; i<foodChosen.length; i++){
					var foodType = foodChosen[i];					
					addCircles(year,foodType);
					}*/
			//alert("foodchosen"+foodChosen);
			addCircles(year, foodChosen);
			
			
		});
		
		/*added code*/
		d3.selectAll("#foodChoices td").on("mouseover", function(){
			//foodChosen = getFoodType();
			foodChosen[0] = $(this).attr('id');
			addCircles(year, foodChosen);
			
			
		});
		

		
		function getFoodType(){
			var foodChosenIn = new Array();
			foodChosenIn = [];
			$('#foodChoices input:checked').each(function() {
				foodChosenIn.push($(this).attr('id'));
			});
			return(foodChosenIn);
		}
		
		function getPresentFoodType(){
			var foodList=new Array();
			foodList = [];
			//get the id list of current food circles
			$("#countries>g").each(function(index){
				
				var newId = $(this).attr('id');
				
				foodList.push(newId);
			});
			
			return(foodList);
		}
		
		function addCircles(year, foodChosen){
			if(foodChosen.length>0){
				foodPresentList = getPresentFoodType();
				////alert("exist foodlist="+foodPresentList);
				
				var foodTypeLoc;
				var circleColor;
				//alert("125 year="+year+"foodChosen="+foodChosen);
				for(var i=0; i<foodChosen.length; i++){
					var result = jQuery.inArray(foodChosen[i], foodPresentList);
					
					if (result <0){ //Circle of certain foodtype doesn't exist before, then create new circle
						//alert("129 result= "+result);
						
						//get the location of the element
						for (var j=0; j<dataset.length; j++){
							if (dataset[j].Type == foodChosen[i]){
								////alert("134");
								foodTypeLoc=j+1;//escape the first total element. 
								break;	
							}
						}
						//////alert("foodTypeLoc"+foodTypeLoc);
						//get the data
						
						//alert("141"+"year="+year+"foodchosen="+foodChosen[i]);
						var g=svg.select("g").append("g").attr("id",foodChosen[i]);
						
						for (var k=foodTypeLoc; k<foodTypeLoc+5; k++){
											
							circleColor = colorSet[foodChosen[i]];
						
							var x = Number(dataset[k].Locationx);
							var y = Number(dataset[k].Locationy);
							var amount = Number(dataset[k][year]);
							var r = Math.sqrt(amount);
							
							var gCountry = g.append("g")
											.attr("class",dataset[k].cName);
											
							gCountry.append("circle")
							.attr("cx",x)
							.attr("cy",y)
							.attr("r",0.01)
							.attr("fill",circleColor)
							.attr("opacity",0.6)
							.attr("class",dataset[k].cName)
							.transition().duration(1000).delay(500).attr("r", r);
			
							var textName=gCountry.append("text")
										  .attr("font-size",12)
										  .attr("font-weight", 700)
										  .attr("x", x)
										  .attr("y", y+5)
										  .attr("text-anchor", "middle")
										  .attr("opacity",0)
										  .attr("class",dataset[k].cName)
										  //.text(dataset[k].cName+" "+dataset[k][year])
										  .text(dataset[k].cName)
										 .attr("fill","#764F38");
							textName.transition().duration(200).delay(1500).attr("opacity",1);
						}
					}
						
					if(result >=0){ //Circle of certain foodtype does exist before, then transfer the radius of the circle
					//alert("184 result= "+result+" i="+i);
							
					//get the location of the element
						for (var j=0; j<dataset.length; j++){
							if (dataset[j].Type == foodChosen[i]){
								////alert("188");
								foodTypeLoc=j+1;//escape the first total element. 
								break;	
							}
						}
						for (var k=foodTypeLoc; k<foodTypeLoc+5; k++){
							var importamount=dataset[k][year];
							var r = Math.sqrt(Number(dataset[k][year]));;
							var existCircle = "#"+foodChosen[i]+" ."+dataset[k].cName+" circle";
							//alert("existCircle"+existCircle);
							d3.select(existCircle)
							  .transition().duration(1000).delay(50).attr("r", r);
							//var existText = "#"+foodChosen[i]+" ."+dataset[k].cName+" text";
							//d3.select(existText).text(dataset[k].cName+" "+dataset[k][year]+"changed");
						}
							
					}
					
					for(var m=0; m<foodPresentList.length; m++){
						var result2 = jQuery.inArray(foodPresentList[m], foodChosen);
						if(result2<0){
							var clearType="#countries #"+foodPresentList[m];
							
							//d3.selectAll(clearType).remove();
							//var clearCircle=clearType+" circle";
							//var clearText=clearType+" text";
							////alert("clearCircle="+clearCircle);
							//d3.selectAll(clearCircle).transition().duration(500).attr("r",0.01).remove();
							//d3.selectAll(clearText).transition().duration(500).attr("opacity",0.01).remove();
							////alert("clearType="+clearType);
							//d3.selectAll(clearType).transition().duration().delay(1500).remove();
							d3.selectAll(clearType).remove();
						}
					}
							
				}
			}else{ //no food item was checked.
				clearType="#countries g"; 
				//clearCircle=clearType+" circle";
				//var clearText=clearType+" text";
				//d3.selectAll(clearCircle).transition().duration(500).attr("r",0.01).remove();
				//d3.selectAll(clearText).transition().duration(500).attr("opacity",0.01).remove();
				//d3.selectAll(clearType).transition().duration().delay(1500).remove();
				d3.selectAll(clearType).remove();
			}
			
			
				//create tooltip
		d3.selectAll("#countries g text").on("mouseover",function(){
			var country=d3.select(this).attr("class");
			//alert("mouseover "+country);
			//var circle = "#countries g circle."+country;
			//var data = d3.select(circle).data;
			var foodList = getFoodType();
			var tip = d3.select('#tip');
			var left=Number(d3.select(this).attr("x"))+490;
			var top=Number(d3.select(this).attr("y"))+220;
			//alert('x= '+left+' y= '+top);
			if (left > 400) left = left - 200; 
			if (top>200) top = top-50;
			
			tip.style('left', left + 'px')
				.style('top', top + 'px')
				.style('display', 'block')
				.transition().duration(100);
			tip.select('.country').text(country);
			tip.select('.year').text(year);
			
			/*get import amount information from csv file*/
			for(var p=0; p<foodList.length; p++){
				//alert(foodList+"year="+year);
				for(var c=0; c<dataset.length; c++){
					//alert(dataset[c].Type);
					if((dataset[c].Type == foodList[p])&&(dataset[c].cName==country)){
						
						var typeText=dataset[c].Type;
						var amountText = dataset[c][year];
						//alert("typeText= "+typeText+" amountText="+amountText);
						var tr=tip.select('.import').append("tr");
						tr.append("td").text(typeText);
						tr.append("td").text('$'+amountText+'M');
					}
				}
			}
		})
		.on('mouseout', function() {
			var tip = d3.select('#tip');
			tip.style('display', 'none');
			tip.selectAll('.import td').remove();
			tip.selectAll('.import tr').remove();
		});	
		} //add
		
		
		function removeItems(array, item) { //used to remove unchecked value from foodChosen. 
			var i = 0;
			while (i < array.length) {
				if (array[i] == item) {
					array.splice(i, 1);
				} else {
					i++;
				}
			}
			return array;
		}
		
		function jsleep(s){
			s=s*1000;
			var a=true;
			var n=new Date();
			var w;
			var sMS=n.getTime();
			while(a){
				w=new Date();
				wMS=w.getTime();
				if(wMS-sMS>s) a=false;
			}
		}
	});
})();