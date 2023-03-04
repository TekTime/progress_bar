<?php

	//Check if file exists
	function check_for_folder() {
		
	$filename = $_POST['FileNameOpt'];

	$saveFilePath = 'C:/xampp/htdocs/MASTER-TRONGATE/ftb-treasures/modules/get_from_db_col_options/assets/'.$filename;	

	if (file_exists($saveFilePath)) {
	  echo "1";
	} else {
	  echo "2";
	  mkdir($saveFilePath, 0777, true);

	}		
		
	}


	//Get images from DB and save to folder location 
	function GetDBImgs($jsonData) {

	$folder_name = $_POST['FileNameOpt'];
	
	//folder location to save img files
	$rootDir = 'C:/xampp/htdocs/MASTER-TRONGATE/image_folder/modules/get_from_db_col_options/assets/'.$folder_name.'';

	$getDb_row = $this->model->get('userID', 'img_colour_V2', 800, 1);

	foreach($getDb_row as $getDb_rows) {

	$userID = $getDb_rows->userID;
	$colourID = $getDb_rows->colourID;
	$genderID = $getDb_rows->genderID;
	$itemTypeID = $getDb_rows->itemTypeID;
	$neckTypeID = $getDb_rows->neckTypeID;
	$fitTypeID = $getDb_rows->fitTypeID;
	
	$colourCode = $getDb_rows->colour_code;
	$dirname = $getDb_rows->img_location;
	$colourPalette = $getDb_rows->colour_palette;	
	
	//Image folder location
	$fileLoc = 'MASTER-TRONGATE/site_images/public/img_exports_test/';
	
	$getFileLoc = $fileLoc.$dirname;
	
	$fullLoc = $_SERVER['DOCUMENT_ROOT']. DIRECTORY_SEPARATOR .$getFileLoc;

	$filenames = glob($fullLoc."*.*");

	foreach ($filenames as $filename) {

			$urlSplit = preg_split('~[\\\\/]~', $filename);
			
			$UserMainFolder = $urlSplit[7]; //09OPNGTH 
			$UserSubFolder = $urlSplit[8]; //984BLKDGS
			$itemBaseName = $urlSplit[14]; //img basename

			$noHashTag = str_replace('#', '', $colourCode);

			$newFilePath =  $UserMainFolder.'_'.$UserSubFolder.'_'.$noHashTag.'_'.$colourPalette.'_'.$userID.'_'.$colourID.'_'.$genderID.'_'.$itemTypeID.'_'.$neckTypeID.'_'.$fitTypeID.'_'.$itemBaseName;

			$folderPut = $rootDir. DIRECTORY_SEPARATOR .$newFilePath;
				//save images
				file_put_contents($folderPut, file_get_contents($filename));
				

		}

	}
			
	}	
	
	
	
	//Get progress percentage status
	//I think my problem may be here since it's not displaying until function GetDBImgs has completed? 
	//what do you think?
	function cal_progress($jsonData) {
		header("Content-Type: application/json");
		ini_set('max_execution_time', 0);
		
		$totalFiles = $_POST['total_files'];
		
		$GetNewFileName = $_POST['FileNameOpt'];
		
		$clean_new_file_name = filter_var($GetNewFileName, FILTER_SANITIZE_STRING);	

		$photos = glob('C:/xampp/htdocs/MASTER-TRONGATE/image_folder/modules/get_from_db_col_options/assets/'.$clean_new_file_name.'/*');

		$numberPhotos = count($photos);

		$total = $totalFiles;
		$current = $numberPhotos;
		
		$percent = round(($current / $total) * 100);
		
		$data = array(
		  'totalFiles' => $total,
		  'currentFilecounts' => $current,
		  'percent' => $percent
		);

		// encode the array as JSON
		$jsonData = json_encode($data);

		echo $jsonData;	

		//return  $jsonData; 
		
	}	