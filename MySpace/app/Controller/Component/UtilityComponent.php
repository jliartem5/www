<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of UtilityComponent
 *
 * @author jian
 */
class UtilityComponent extends Component {

    public function DateTimeNow() {
        return (new DateTime())->format('Y-m-d H:i:s');
    }

    public static function encrypeData($data) {
        $re = bin2hex(Security::rijndael($data, Configure::read('Security.cipherSeed'), 'encrypt'));
        return $re;
    }

    public static function descriptData($cipher) {
        return Security::rijndael(hex2bin($cipher), Configure::read('Security.cipherSeed'), 'decrypt');
    }

    public static function GUID() {
        if (function_exists('com_create_guid') === true) {
            return trim(com_create_guid(), '{}');
        }

        return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
    }
    public static function isGUID($data){
        return substr_count($data, "-") >= 4;
    }
}
