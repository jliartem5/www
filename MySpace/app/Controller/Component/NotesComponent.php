<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of NotesComponent
 *
 * @author jian
 */
class NotesComponent extends Component {
    public $components = array('Element');
    public $uses = array('NoteDefaultConfig');


    /**
     * Generer la configuration par default pour le nouveau utilisateur
     */
    public function genereSimpleNoteConfig($user_id) {
        $default_config = array(
            array("NoteElement" => array(
                //Prix
                
                )),
            array("NoteElement" => array(
                //Raison(reason)
                )),
            array("NoteElement" => array(
                //Date de position
                ))
        );
        return $default_config;
    }

}
