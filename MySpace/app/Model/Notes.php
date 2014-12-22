<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Notes
 *
 * @author jian
 */
class Notes extends AppModel {

    public $hasMany = array(
        'note_element' => array(
            'className' => 'NoteElement'
        )
    );
    public $belongsTo = array(
        'user' => array(
            'className' => 'User'
        )
    );

    public function afterFind($results, $primary = false) {
        foreach ($results as $key => $val) {
            if (isset($val['Notes']['id'])) {
                $results[$key]['Notes']['id'] = UtilityComponent::encrypeData($results[$key]['Notes']['id']);
            }
        }
        return $results;
    }

}
