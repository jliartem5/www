<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ElementHelper
 *
 * @author jian
 */
App::uses('FormHelper', 'View/Helper');

class ElementHelper extends FormHelper {

    public static $Key = '';

    public function __construct(\View $View, $settings = array()) {
        parent::__construct($View, $settings);
        ElementHelper::$Key = Configure::read('Security.cipherSeed');
    }

    public static function encrypeData($id) {
        $re = bin2hex(Security::rijndael($id, Configure::read('Security.cipherSeed'), 'encrypt'));
        return $re;
    }

    public static function descriptData($cipher) {
        return Security::rijndael(hex2bin($cipher), Configure::read('Security.cipherSeed'), 'decrypt');
    }

    public function generateMultiElement($elementConfig) {
        $result = '';
        foreach ($elementConfig as $config) {
            $elementName = ucfirst($config['type']) . 'Element';
            $ElementID = $config['id'];
            $config['id'] = ElementHelper::encrypeData($config['id']);
            unset($config['user_id']);
            $result .= $this->_View->element($elementName, array('Form' => $this, 'Config' => $config, 'ElementID' => $ElementID));
        }
        return $result;
    }

    public function generateElement($type) {
        $possible = "0123456789abcdfghjkmnpqrstvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $elementName = ucfirst($type) . 'Element';
        $config = array(
            'id' => substr(str_shuffle($possible), 0, 32),
            'type' => $type
        );
        if ($this->_View->elementExists($elementName)) {
            return $this->_View->element($elementName, array('Form' => $this, 'Config' => $config));
        }else{
            return 'Error';
        }
    }

}
