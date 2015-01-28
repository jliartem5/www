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

        $default_gridster_position = array(
            'data-row' => '1',
            'data-col' => '1',
            'data-sizex' => '1',
            'data-sizey' => '1'
        );

        return array(
            $element_model => array(
                "label" => isset($options['label']) ? $options['label'] . '' : '-',
                'type' => $type,
                'value' => isset($options['value']) ? $options['value'] . '' : '',
                'position' => isset($options['position']) ? json_encode($options['position']) : json_encode($default_gridster_position),
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

    public static function createRichtextElement($options = array()) {
        return NoteElement::createCommunElement("RICHTEXT", $options);
    }

    public function afterFind($results, $primary = false) {
        foreach ($results as $key => $val) {
            if (isset($val['NoteElement']['id'])) {
                $results[$key]['NoteElement']['id'] = UtilityComponent::encrypeData($results[$key]['NoteElement']['id']);
                $results[$key]['NoteElement']['type'] = strtoupper($results[$key]['NoteElement']['type']);
                $results[$key]['NoteElement']['position'] = json_decode($results[$key]['NoteElement']['position']);
            }
        }
        return $results;
    }

    public function beforeSave($options = array()) {
        if (isset($this->data['NoteElement']['position']) && is_array($this->data['NoteElement']['position'])) {
            $this->data['NoteElement']['position'] = json_encode($this->data['NoteElement']['position']);
        }
    }

}
