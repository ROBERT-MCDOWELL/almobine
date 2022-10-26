<?php
function leastFactor($n){
	if(is_nan($n) || !is_finite($n)){return nan;}
	if($n == 0){return 0;}
	if($n % 1 || $n * $n < 2){return 1;}
	if($n % 2 == 0){return 2;}
	if($n % 3 == 0){return 3;}
	if($n % 5 == 0){return 5;}
	$m = sqrt($n);
	for($i=7;$i<=$m;$i+=30){
		if($n % $i == 0){return $i;}
		if($n % ($i + 4) == 0){return $i + 4;}
		if($n % ($i + 6) == 0){return $i + 6;}
		if($n % ($i + 6) == 0){return $i + 6;}
		if($n % ($i + 10) == 0){return $i + 10;}
		if($n % ($i + 12) == 0){return $i + 12;}
		if($n % ($i + 16) == 0){return $i + 16;}
		if($n % ($i + 22) == 0){return $i + 22;}
		if($n % ($i + 24) == 0){return $i + 24;}
	}
	return $n;
}
function isPrime($n){
	if(is_nan($n) || !is_finite($n) || $n % 1 || $n < 2){return false;}
	if($n == leastFactor($n)){return true;}
	return false;
}
function alphaUtf8($str){
	$result = "";
	$result = trim($str);
	$result = iconv('UTF-8','UTF-8//IGNORE',$result); // drop all non utf-8 characters
	$result = preg_replace('/(?>[\x00-\x1F]|\xC2[\x80-\x9F]|\xE2[\x80-\x8F]{2}|\xE2\x80[\xA4-\xA8]|\xE2\x81[\x9F-\xAF])/','',$result); // bad utf-8 bytes
	$result = preg_replace('/(\xF0\x9F[\x00-\xFF][\x00-\xFF])/','',$result); // Drop emojis
	$result = trim($result,'\x00..\x1F'); // drop non printable characters at the start and end of string
	$result = mb_ereg_replace('([\.]{3,})','',$result);
	$result = trim($result); // drop non printable characters at the start and end of string
	$result = preg_replace('/(?![\'&\.-])\p{P}/u','',$result);
	$result = preg_replace('/[<>;:_\$\^\-\'\/|\*\t\n\r\\0\\x0B]/','',$result);
	return $result;
}
function almo($str){

	// Sacred Numbers are: 114,23,30,40,63
	
	global $RANK_PRIMES;
	global $PRIME_RANKS;
	global $LATIN_PRIMES;
	
	$stdObj = new stdClass();
	$stdObj->totalArr = (object)array("rankNo"=>0,"rankNoIsPrime"=>false,"rankNoPrime"=>null,"rankYes"=>0,"rankYesIsPrime"=>false,"rankYesPrime"=>null);
	$stdObj->totalRanks = (object)array("total"=>0,"mod"=>array());
	$stdObj->modRankNo = (object)array("M114"=>array(),"M23"=>array());
	$stdObj->modRankYes = (object)array("M114"=>array(),"M23"=>array());
	$stdObj->rankSubstract = (object)array("result"=>0,"rankOfPrime"=>null);
	$stdObj->answer = null;
	
	//////////// STEP 1 ///////////////
	$charsArr = mb_str_split($str);
	for($x=0;$x<count($charsArr);$x++){
		if(isset($LATIN_PRIMES[$charsArr[$x]])){
			$prime = $LATIN_PRIMES[$charsArr[$x]];
			$stdObj->totalArr->rankNo += $prime;
			$stdObj->totalArr->rankYes += $prime;
			$rk = $PRIME_RANKS[$prime];
			$stdObj->totalRanks->total += $rk;
			while(isPrime($rk) == true){
				$stdObj->totalRanks->total += $PRIME_RANKS[$rk];
				$rk = $PRIME_RANKS[$rk];
			}
		}
	}
	$stdObj->totalArr->rankYes += $stdObj->totalRanks->total;
	if(isPrime($stdObj->totalArr->rankNo)){
		$stdObj->totalArr->rankNoIsPrime = true;
		$stdObj->totalArr->rankNoPrime = $PRIME_RANKS[$stdObj->totalArr->rankNo];
	}
	if(isPrime($stdObj->totalArr->rankYes)){
		$stdObj->totalArr->rankYesIsPrime = true;
		$stdObj->totalArr->rankYesPrime = $PRIME_RANKS[$stdObj->totalArr->rankYes];
	}
	
	//////////// STEP 2 ///////////////
	$stdObj->modRankNo->M114[] = $stdObj->totalArr->rankNo % 114;
	$stdObj->modRankNo->M23[] = $stdObj->totalArr->rankNo % 23;
	$stdObj->modRankYes->M114[] = $stdObj->totalArr->rankYes % 114;
	$stdObj->modRankYes->M23[] = $stdObj->totalArr->rankYes % 23;
	// TOTAL WITHOUT RANK CALCULATION
	$rkPrinc = 0;
	if($stdObj->modRankNo->M114[0] === 0){
		// modulo is zero so use the quotient
		$stdObj->modRankNo->M114[0] = (integer)($stdObj->totalArr->rankNo / 114);
	}
	$lastRow = $stdObj->modRankNo->M114[0];
	while($lastRow >= 23 || isPrime($lastRow)){
		if($rkPrinc === 0){
			if(isPrime($stdObj->modRankNo->M114[0]) && $stdObj->modRankNo->M114[0] > 23){
				$rkPrinc =  $PRIME_RANKS[$stdObj->modRankNo->M114[0]];
				$stdObj->modRankNo->M114Princ = array($rkPrinc);
				while($rkPrinc >= 23){
					$stdObj->modRankNo->M114Princ[] = $rkPrinc = $rkPrinc % 23;
				}
				while(isPrime($rkPrinc)){
					$stdObj->modRankNo->M114Princ[] = $rkPrinc = $PRIME_RANKS[$rkPrinc];
				}
			}else{
				$rkPrinc = null;
			}
		}
		if($lastRow >= 23){
			$stdObj->modRankNo->M114[] = $lastRow % 23;
		}elseif(isPrime($lastRow)){
			$stdObj->modRankNo->M114[] = $PRIME_RANKS[$lastRow];
		}else{
			break;
		}
		$lastRow = $stdObj->modRankNo->M114[(count($stdObj->modRankNo->M114) - 1)];
	}
	$rkPrinc = 0;
	if($stdObj->modRankNo->M23[0] === 0){
		// modulo is zero so use the quotient
		$stdObj->modRankNo->M23[0] = (integer)($stdObj->totalArr->rankNo / 23);
	}
	$lastRow = $stdObj->modRankNo->M23[0];
	while($lastRow >= 23 || isPrime($lastRow)){
		if($rkPrinc === 0){
			if(isPrime($stdObj->modRankNo->M23[0]) && $stdObj->modRankNo->M23[0] > 23){
				$rkPrinc =  $PRIME_RANKS[$stdObj->modRankNo->M23[0]];
				$stdObj->modRankNo->M23Princ = array($rkPrinc);
				while($rkPrinc >= 23){
					$stdObj->modRankNo->M23Princ[] = $rkPrinc = $rkPrinc % 23;
				}
				while(isPrime($rkPrinc)){
					$stdObj->modRankNo->M23Princ[] = $rkPrinc = $PRIME_RANKS[$rkPrinc];
				}
			}else{
				$rkPrinc = null;
			}
		}
		if($lastRow >= 23){
			$stdObj->modRankNo->M23[] = $lastRow % 23;
		}elseif(isPrime($lastRow)){
			$stdObj->modRankNo->M23[] = $PRIME_RANKS[$lastRow];
		}else{
			break;
		}
		$lastRow = $stdObj->modRankNo->M23[(count($stdObj->modRankNo->M23) - 1)];
	}
	// TOTAL WIATH RANKS CALCULATION
	$rkPrinc = 0;
	if($stdObj->modRankYes->M114[0] === 0){
		// modulo is zero so use the quotient
		$stdObj->modRankYes->M114[0] = (integer)($stdObj->totalArr->rankYes / 114);
	}
	$lastRow = $stdObj->modRankYes->M114[0];
	while($lastRow >= 23 || isPrime($lastRow)){
		if($rkPrinc === 0){
			if(isPrime($stdObj->modRankYes->M114[0]) && $stdObj->modRankYes->M114[0] > 23){
				$rkPrinc =  $PRIME_RANKS[$stdObj->modRankYes->M114[0]];
				$stdObj->modRankYes->M114Princ = array($rkPrinc);
				while($rkPrinc >= 23){
					$stdObj->modRankYes->M114Princ[] = $rkPrinc = $rkPrinc % 23;
				}
				while(isPrime($rkPrinc)){
					$stdObj->modRankYes->M114Princ[] = $rkPrinc = $PRIME_RANKS[$rkPrinc];
				}
			}else{
				$rkPrinc = null;
			}
		}
		if($lastRow >= 23){
			$stdObj->modRankYes->M114[] = $lastRow % 23;
		}elseif(isPrime($lastRow)){
			$stdObj->modRankYes->M114[] = $PRIME_RANKS[$lastRow];
		}else{
			break;
		}
		$lastRow = $stdObj->modRankYes->M114[(count($stdObj->modRankYes->M114) - 1)];
	}
	$rkPrinc = 0;
	if($stdObj->modRankYes->M23[0] === 0){
		// modulo is zero so use the quotient
		$stdObj->modRankYes->M23[0] = (integer)($stdObj->totalArr->rankYes / 23);
	}
	$lastRow = $stdObj->modRankYes->M23[0];
	while($lastRow >= 23 || isPrime($lastRow)){
		if($rkPrinc === 0){
			if(isPrime($stdObj->modRankYes->M23[0]) && $stdObj->modRankYes->M23[0] > 23){
				$rkPrinc =  $PRIME_RANKS[$stdObj->modRankYes->M23[0]];
				$stdObj->modRankYes->M23Princ = array($rkPrinc);
				while($rkPrinc >= 23){
					$stdObj->modRankYes->M23Princ[] = $rkPrinc = $rkPrinc % 23;
				}
				while(isPrime($rkPrinc)){
					$stdObj->modRankYes->M23Princ[] = $rkPrinc = $PRIME_RANKS[$rkPrinc];
				}
			}else{
				$rkPrinc = null;
			}
		}
		if($lastRow >= 23){
			$stdObj->modRankYes->M23[] = $lastRow % 23;
		}elseif(isPrime($lastRow)){
			$stdObj->modRankYes->M23[] = $PRIME_RANKS[$lastRow];
		}else{
			break;
		}
		$lastRow = $stdObj->modRankYes->M23[(count($stdObj->modRankYes->M23) - 1)];
	}

	//////////// STEP 3 ///////////////
	$stdObj->totalRanks->mod[0] = $stdObj->totalRanks->total % 114;
	$lastRow = $stdObj->totalRanks->mod[0];
	while($lastRow >= 23 || isPrime($lastRow)){
		if($lastRow >= 23){
			$stdObj->totalRanks->mod[] = $lastRow % 23;
		}elseif(isPrime($lastRow)){
			$stdObj->totalRanks->mod[] = $PRIME_RANKS[$lastRow];
		}else{
			break;
		}
		$lastRow = $stdObj->totalRanks->mod[(count($stdObj->totalRanks->mod) - 1)];
	}
	$stdObj->rankSubstract->result = $stdObj->totalRanks->mod[0];
	for($x=1;$x<count($stdObj->totalRanks->mod);$x++){
		$stdObj->rankSubstract->result -= $stdObj->totalRanks->mod[$x];
	}
	$stdObj->rankSubstract->rankOfPrime = $RANK_PRIMES[$stdObj->rankSubstract->result];
	$stdObj->answer = $stdObj->totalRanks->total - $stdObj->rankSubstract->rankOfPrime;
	
	return $stdObj;
}
?>