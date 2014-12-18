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

}
