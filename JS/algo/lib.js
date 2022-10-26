import * as SETTINGS from "../settings.js";
import * as ALPHA from "../dict/latin/config.js";

function leastFactor(n){
	if(isNaN(n) || !isFinite(n)){return NaN;}
	if(n == 0){return 0;}
	if(n % 1 || n * n < 2){return 1;}
	if(n % 2 == 0){return 2;}
	if(n % 3 == 0){return 3;}
	if(n % 5 == 0){return 5;}
	const m = Math.sqrt(n);
	for(let i=7;i<=m;i+=30){
		if(n % i == 0){return i;}
		if(n % (i + 4) == 0){return i + 4;}
		if(n % (i + 6) == 0){return i + 6;}
		if(n % (i + 6) == 0){return i + 6;}
		if(n % (i + 10) == 0){return i + 10;}
		if(n % (i + 12) == 0){return i + 12;}
		if(n % (i + 16) == 0){return i + 16;}
		if(n % (i + 22) == 0){return i + 22;}
		if(n % (i + 24) == 0){return i + 24;}
	}
	return n;
}
function isPrime(n){
	if(isNaN(n) || !isFinite(n) || n % 1 || n < 2){return false;}
	if(n == leastFactor(n)){return true;}
	return false;
}
export function alphaUtf8(str){
	str.trim();
	str.replace('/(?>[\x00-\x1F]|\xC2[\x80-\x9F]|\xE2[\x80-\x8F]{2}|\xE2\x80[\xA4-\xA8]|\xE2\x81[\x9F-\xAF])/',''); // bad utf-8 bytes
	str.replace('/(\xF0\x9F[\x00-\xFF][\x00-\xFF])/',''); // Drop emojis
	str.replace('([\.]{3,})','');
	str.replace('/(?![\'&\.-])\p{P}/u','');
	str.replace('/[<>;:_\\^\-\'\/|\*\t\n\r\\0\\x0B]/','');
	return str;
}
export function almo(str){
	// Sacred Numbers are: 114,23,30,40,63
	const stdObj = {};
	stdObj.totalArr = {"rankNo":0,"rankNoIsPrime":false,"rankNoPrime":null,"rankYes":0,"rankYesIsPrime":false,"rankYesPrime":null};
	stdObj.totalRanks = {"total":0,"mod":[]};
	stdObj.modRankNo = {"M114":[],"M23":[]};
	stdObj.modRankYes = {"M114":[],"M23":[]};
	stdObj.rankSubstract = {"result":0,"rankOfPrime":null};
	stdObj.answer = null;
	
	//////////// STEP 1 ///////////////
	const charsArr = str.split('');
	let prime;
	let rk;
	let rkPrinc;
	let lastRow;
	for(let x=0;x<charsArr.length;x++){
		if(typeof(ALPHA.LATIN_PRIMES[charsArr[x]]) != "undefined"){
			prime = ALPHA.LATIN_PRIMES[charsArr[x]];
			stdObj.totalArr.rankNo += prime;
			stdObj.totalArr.rankYes += prime;
			rk = SETTINGS.PRIME_RANKS[prime];
			stdObj.totalRanks.total += rk;
			while(isPrime(rk) == true){
				stdObj.totalRanks.total += SETTINGS.PRIME_RANKS[rk];
				rk = SETTINGS.PRIME_RANKS[rk];
			}
		}
	}
	stdObj.totalArr.rankYes += stdObj.totalRanks.total;
	if(isPrime(stdObj.totalArr.rankNo)){
		stdObj.totalArr.rankNoIsPrime = true;
		stdObj.totalArr.rankNoPrime = SETTINGS.PRIME_RANKS[stdObj.totalArr.rankNo];
	}
	if(isPrime(stdObj.totalArr.rankYes)){
		stdObj.totalArr.rankYesIsPrime = true;
		stdObj.totalArr.rankYesPrime = SETTINGS.PRIME_RANKS[stdObj.totalArr.rankYes];
	}
	
	//////////// STEP 2 ///////////////
	stdObj.modRankNo.M114[stdObj.modRankNo.M114.length] = stdObj.totalArr.rankNo % 114;
	stdObj.modRankNo.M23[stdObj.modRankNo.M23.length] = stdObj.totalArr.rankNo % 23;
	stdObj.modRankYes.M114[stdObj.modRankYes.M114.length] = stdObj.totalArr.rankYes % 114;
	stdObj.modRankYes.M23[stdObj.modRankYes.M23.length] = stdObj.totalArr.rankYes % 23;
	// TOTAL WITHOUT RANK CALCULATION
	rkPrinc = 0;
	if(stdObj.modRankNo.M114[0] === 0){
		// modulo is zero so use the quotient
		stdObj.modRankNo.M114[0] = parseInt(stdObj.totalArr.rankNo / 114);
	}
	lastRow = stdObj.modRankNo.M114[0];
	while(lastRow >= 23 || isPrime(lastRow)){
		if(rkPrinc === 0){
			if(isPrime(stdObj.modRankNo.M114[0]) && stdObj.modRankNo.M114[0] > 23){
				rkPrinc = SETTINGS.PRIME_RANKS[stdObj.modRankNo.M114[0]];
				stdObj.modRankNo.M114Princ = [rkPrinc];
				while(rkPrinc >= 23){
					stdObj.modRankNo.M114Princ[stdObj.modRankNo.M114Princ.length] = rkPrinc = rkPrinc % 23;
				}
				while(isPrime(rkPrinc)){
					stdObj.modRankNo.M114Princ[stdObj.modRankNo.M114Princ.length] = rkPrinc = SETTINGS.PRIME_RANKS[rkPrinc];
				}
			}else{
				rkPrinc = null;
			}
		}
		if(lastRow >= 23){
			stdObj.modRankNo.M114[stdObj.modRankNo.M114.length] = lastRow % 23;
		}else if(isPrime(lastRow)){
			stdObj.modRankNo.M114[stdObj.modRankNo.M114.length] = SETTINGS.PRIME_RANKS[lastRow];
		}else{
			break;
		}
		lastRow = stdObj.modRankNo.M114[(stdObj.modRankNo.M114.length - 1)];
	}
	rkPrinc = 0;
	if(stdObj.modRankNo.M23[0] === 0){
		// modulo is zero so use the quotient
		stdObj.modRankNo.M23[0] = (stdObj.totalArr.rankNo / 23);
	}
	lastRow = stdObj.modRankNo.M23[0];
	while(lastRow >= 23 || isPrime(lastRow)){
		if(rkPrinc === 0){
			if(isPrime(stdObj.modRankNo.M23[0]) && stdObj.modRankNo.M23[0] > 23){
				rkPrinc =  SETTINGS.PRIME_RANKS[stdObj.modRankNo.M23[0]];
				stdObj.modRankNo.M23Princ = [rkPrinc];
				while(rkPrinc >= 23){
					stdObj.modRankNo.M23Princ[stdObj.modRankNo.M23Princ.length] = rkPrinc = rkPrinc % 23;
				}
				while(isPrime(rkPrinc)){
					stdObj.modRankNo.M23Princ[stdObj.modRankNo.M23Princ.length] = rkPrinc = SETTINGS.PRIME_RANKS[rkPrinc];
				}
			}else{
				rkPrinc = null;
			}
		}
		if(lastRow >= 23){
			stdObj.modRankNo.M23[stdObj.modRankNo.M23.length] = lastRow % 23;
		}else if(isPrime(lastRow)){
			stdObj.modRankNo.M23[stdObj.modRankNo.M23.length] = SETTINGS.PRIME_RANKS[lastRow];
		}else{
			break;
		}
		lastRow = stdObj.modRankNo.M23[(stdObj.modRankNo.M23.length - 1)];
	}
	// TOTAL WIATH RANKS CALCULATION
	rkPrinc = 0;
	if(stdObj.modRankYes.M114[0] === 0){
		// modulo is zero so use the quotient
		stdObj.modRankYes.M114[0] = parseInt(stdObj.totalArr.rankYes / 114);
	}
	lastRow = stdObj.modRankYes.M114[0];
	while(lastRow >= 23 || isPrime(lastRow)){
		if(rkPrinc === 0){
			if(isPrime(stdObj.modRankYes.M114[0]) && stdObj.modRankYes.M114[0] > 23){
				rkPrinc =  SETTINGS.PRIME_RANKS[stdObj.modRankYes.M114[0]];
				stdObj.modRankYes.M114Princ = [rkPrinc];
				while(rkPrinc >= 23){
					stdObj.modRankYes.M114Princ[stdObj.modRankYes.M114Princ.length] = rkPrinc = rkPrinc % 23;
				}
				while(isPrime(rkPrinc)){
					stdObj.modRankYes.M114Princ[stdObj.modRankYes.M114Princ.length] = rkPrinc = SETTINGS.PRIME_RANKS[rkPrinc];
				}
			}else{
				rkPrinc = null;
			}
		}
		if(lastRow >= 23){
			stdObj.modRankYes.M114[stdObj.modRankYes.M114.length] = lastRow % 23;
		}else if(isPrime(lastRow)){
			stdObj.modRankYes.M114[stdObj.modRankYes.M114.length] = SETTINGS.PRIME_RANKS[lastRow];
		}else{
			break;
		}
		lastRow = stdObj.modRankYes.M114[(stdObj.modRankYes.M114.length - 1)];
	}
	rkPrinc = 0;
	if(stdObj.modRankYes.M23[0] === 0){
		// modulo is zero so use the quotient
		stdObj.modRankYes.M23[0] = parseInt(stdObj.totalArr.rankYes / 23);
	}
	lastRow = stdObj.modRankYes.M23[0];
	while(lastRow >= 23 || isPrime(lastRow)){
		if(rkPrinc === 0){
			if(isPrime(stdObj.modRankYes.M23[0]) && stdObj.modRankYes.M23[0] > 23){
				rkPrinc =  SETTINGS.PRIME_RANKS[stdObj.modRankYes.M23[0]];
				stdObj.modRankYes.M23Princ = [rkPrinc];
				while(rkPrinc >= 23){
					stdObj.modRankYes.M23Princ[stdObj.modRankYes.M23Princ.length] = rkPrinc = rkPrinc % 23;
				}
				while(isPrime(rkPrinc)){
					stdObj.modRankYes.M23Princ[stdObj.modRankYes.M23Princ.length] = rkPrinc = SETTINGS.PRIME_RANKS[rkPrinc];
				}
			}else{
				rkPrinc = null;
			}
		}
		if(lastRow >= 23){
			stdObj.modRankYes.M23[stdObj.modRankYes.M23.length] = lastRow % 23;
		}else if(isPrime(lastRow)){
			stdObj.modRankYes.M23[stdObj.modRankYes.M23.length] = SETTINGS.PRIME_RANKS[lastRow];
		}else{
			break;
		}
		lastRow = stdObj.modRankYes.M23[(stdObj.modRankYes.M23.length - 1)];
	}

	//////////// STEP 3 ///////////////
	stdObj.totalRanks.mod[0] = stdObj.totalRanks.total % 114;
	lastRow = stdObj.totalRanks.mod[0];
	while(lastRow >= 23 || isPrime(lastRow)){
		if(lastRow >= 23){
			stdObj.totalRanks.mod[stdObj.totalRanks.mod.length] = lastRow % 23;
		}else if(isPrime(lastRow)){
			stdObj.totalRanks.mod[stdObj.totalRanks.mod.length] = SETTINGS.PRIME_RANKS[lastRow];
		}else{
			break;
		}
		lastRow = stdObj.totalRanks.mod[(stdObj.totalRanks.mod.length - 1)];
	}
	stdObj.rankSubstract.result = stdObj.totalRanks.mod[0];
	for(let x=1;x<stdObj.totalRanks.mod.length;x++){
		stdObj.rankSubstract.result -= stdObj.totalRanks.mod[x];
	}
	stdObj.rankSubstract.rankOfPrime = SETTINGS.RANK_PRIMES[stdObj.rankSubstract.result];
	stdObj.answer = stdObj.totalRanks.total - stdObj.rankSubstract.rankOfPrime;
	
	return stdObj;
}