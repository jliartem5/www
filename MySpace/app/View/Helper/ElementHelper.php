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
App::uses('AppHelper', 'View/Helper');

class ElementHelper extends FormHelper {

    public static $Key = '';

    public function __construct(\View $View, $settings = array()) {
        parent::__construct($View, $settings);
        ElementHelper::$Key = Configure::read('Security.cipherSeed');
    }

    //Parametres des elements:
    //$HELPER; $ID; $FRONT; $BACK;
    public function generateDefaultElement($elementConfig = null) {
        if ($elementConfig == null) {
            $elementConfig = $this->User->findById($this->Auth->user()['id'])['note_default_config'];
        }

        $result = '';
        foreach ($elementConfig as $config) {
            $elementName = ucfirst($config['type']) . 'Element';
            $ElementID = AppHelper::encrypeData($config['id']);
            $front = array('label' => $config['label'], 'value' => $config['value']);
            unset($config['id']);
            unset($config['value']);
            $back = array('config' => AppHelper::encrypeData(json_encode($config)));

            $result .= $this->_View->element($elementName, array(
                'Helper' => $this,
                'FRONT' => $front,
                'BACK' => $back,
                'ID' => $ElementID));
        }
        return $result;
    }

    public function generateNewElement($type, $label = '', $value = '') {
        $elementName = ucfirst($type) . 'Element';

        $id = AppHelper::encrypeData(uniqid());
        $front = array('label' => $label, 'value' => $value);
        $config = array(
            'type' => $type,
            'label' => $label,
            'position' => 1
        );
        $back = array('config' => AppHelper::encrypeData(json_encode($config)));

        if ($this->_View->elementExists($elementName)) {
            return $this->_View->element($elementName, array(
                        'Helper' => $this,
                        'ID' => $id,
                        'FRONT' => $front,
                        'BACK' => $back));
        } else {
            return 'Error';
        }
    }

}
