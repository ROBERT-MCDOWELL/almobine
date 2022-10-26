<?php

//////// version 1.0 ////////

require("../settings.inc");
require("../algo/lib.inc");
require("../dict/latin/config.inc");

$str = strtolower("Qui va subir une intervention chirurgicale ce Jeudi vingt-deux septembre deux-mille-vingt-deux ?");
$str = alphaUtf8($str);
$resNumArr = almo($str);

print_r($resNumArr);

?>