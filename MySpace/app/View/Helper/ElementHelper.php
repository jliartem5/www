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
class ElementHelper extends FormHelper{
    public function generateMultiElement($elementConfig){
        $result = '';
        foreach($elementConfig as $config){
            $elementName = ucfirst($config['type']).'Element';
            $ElementID = $config['user_id'];
            unset($config['user_id']);
            $result .= $this->_View->element($elementName, array('Form'=>$this, 'Config'=>$config, 'ElementID'=>$ElementID));
        }
        return $result;
    }
}
