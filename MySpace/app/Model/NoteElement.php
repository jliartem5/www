<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of NoteElement
 *
 * @author jian
 */
class NoteElement extends AppModel {

    public $belongsTo = array(
        'note' => array(
            'className' => 'Note'
        )
    );

    private static function checkLegibility($options = array()) {
        if (isset($options['user_id']) || isset($options['note_id'])) {
            return true;
        }
        throw new Exception('user_id OR note_id must set');
    }

    private static function createCommunElement($type, $options) {
        NoteElement::checkLegibility($options);

        if (!isset($options['user_id']) && !isset($options['note_id'])) {
            throw new Exception('user_id OR note_id must set');
        }
        
        $element_model = 'NoteElement';
        if (isset($options['user_id'])) {
            $element_model = 'NoteDefaultConfig';
        }
        $foreign_field = $element_model == 'NoteElement' ? 'note_id' : 'user_id';

        return array(
            $element_model => array(
                "label" => isset($options['label']) ? $options['label'] . '' : '-',
                'type' => $type,
                'value' => isset($options['value']) ? $options['value'] . '' : '',
                'position' => isset($options['position']) ? $options['position'] : 1,
                $foreign_field => $options[$foreign_field]
            )
        );
    }

    public static function createTextElement($options = array()) {
        return NoteElement::createCommunElement('TEXT', $options);
    }

    public static function createNumericElement($options = array()) {
        return NoteElement::createCommunElement('NUMERIC', $options);
    }

    public static function createDateElement($options = array()) {
        return NoteElement::createCommunElement('Date', $options);
    }

    public static function createComboElement($options = array()) {
        
    }

    public static function createImageElement() {
        
    }

    public static function createRichtextElement() {
        
    }
    
}
