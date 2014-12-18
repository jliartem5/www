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
class UtilityComponent extends Component{
    public function DateTimeNow(){
        return (new DateTime())->format('Y-m-d H:i:s');
    }
    
    public static function encrypeData($id) {
        $re = bin2hex(Security::rijndael($id, Configure::read('Security.cipherSeed'), 'encrypt'));
        return $re;
    }

    public static function descriptData($cipher) {
        return Security::rijndael(hex2bin($cipher), Configure::read('Security.cipherSeed'), 'decrypt');
    }
}
