
			$(document).on('click', '.createFolderBtn', function (event) {					
			event.preventDefault();
			var CreateFolderName;
			var FolderExistsErrors = document.getElementById('createfoldername');
			var addCharUnderScore;			
			var errors = 0;
			

			var getFieldErrors = document.getElementById('createfoldername');
			
			var checkFolder = '<?= $pageUrl ?>/check_for_folder';
			var putImg = '<?= $pageUrl ?>/GetDBImgs';
			var getProgBar = '<?= $pageUrl ?>/cal_progress';
			
			
			if($.trim($('#createfoldername').val()) == ''){
				errors++;
			} else{
				var newFileName = $(getFieldErrors).val().toLowerCase();
				
				addCharUnderScore = (newFileName.replace(/ /g, '_'));

				$(getFieldErrors).css('border', '1px solid #ccc');
				
				var  params = 'FileNameOpt='+addCharUnderScore;
				
				var xhr0 = new XMLHttpRequest();
				xhr0.open('POST', checkFolder, true);
				xhr0.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");					
				xhr0.onload = function () {
				if(xhr0.status === 200){
					if(xhr0.responseText == '1'){
					//console.log('File exists');					
					$(FolderExistsErrors).val('');
					$(FolderExistsErrors).attr('placeholder','Folder already exists!');
					$(FolderExistsErrors).css('border', '1px solid red');					
					return true;						
					}

					if(xhr0.responseText == '2'){
					
					//Proceed to startStage2 function
					startStage2();
					
					}					

				}
			}
			xhr0.send(params);

		
			}
			
			if(errors > 0){
				$(getFieldErrors).attr('placeholder','Field required!');
				$(getFieldErrors).css('border', '1px solid red');	
				return false;
			}
			

			//Begin stage 02
			function startStage2() {
		
			$('#colNewFolder').remove();
			
			$('.modal-header').text("");
			$('.modal-header').text("File upload");				
			var ModOpt02 = 
				'<form id="colFolderProgress">'+
				'<div class="proglbl">' +
				'<div id="msgInfo"></div>' +

				'<div id="holdSpan">' +
				'<span id="spancurrent"></span>' +
				'<span id="spanoff"> of </span>' +
				'<span id="spantotal"></span>' +
				'</div>' +

				'</div>' +

				'<div class="outter">' +
				'<div id="inner_progress" class="inner"></div>' +
				'</div>' +

				'<div id="modBtns" style="text-align: center;">'+
				
				'</div>'+
				"</form>";

			$('.modal-content').append(ModOpt02);


			var prog = document.getElementById('inner_progress');
			var msgFinished = document.getElementById('msgInfo');

			var spanHold = document.getElementById('holdSpan');

			var spanCurrent = document.getElementById('spancurrent');
			var spanTotal = document.getElementById('spantotal');
			var spanOff = document.getElementById('spanoff');			
				
				
			var  params = 'FileNameOpt='+addCharUnderScore;
			var intervalID;
			
			prog.style.width = '0%';
			prog.innerHTML = '0%';

			msgFinished.innerHTML = "";

			$(msgFinished).css('background', '#fff');

			$(spanHold).css('display', 'block');			
			
	
			var xhr1 = new XMLHttpRequest();
			xhr1.open('POST', putImg, true);
			xhr1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");					
			xhr1.onload = function () {
				if(xhr1.status === 200){

					clearInterval(timer);
					timer = null;

					if (timer == null) {

						prog.style.width = '100%';
						prog.innerHTML = '100%';
						$(spanHold).css('display', 'none');

						msgFinished.innerHTML = 'Completed';
						$(msgFinished).css('background', 'green');
					}					


				}
			}
			xhr1.send(params);




		var total_files = 1600;
		var FileNameOpt = addCharUnderScore;

		timer = setInterval(checkProgress, 500);
			
			
			function checkProgress() {
				$.ajax({
					url: getProgBar,
					type: "POST",
					data: { total_files: total_files, FileNameOpt: FileNameOpt},
					dataType: "json",				
					success: function(response) {
						
						var WidthProp = response.percent;

						$(prog).css('width', WidthProp + "%");

						prog.innerHTML = response.percent + "%";

						spanCurrent.innerHTML = response.currentFilecounts;
						spanTotal.innerHTML = response.totalFiles;						
					},
					error: function(xhr, status, error) {
						// Handle error
						console.log("Error retrieving user information: " + error);
					}
				});			  
				
			}


			}
			

});