<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of NoteDefaultConfig
 *
 * @author jian
 */
App::import('Model','NoteElement');
class NoteDefaultConfig extends AppModel {

    public $name = 'NoteDefaultConfig';

    /**
     * Generer la configuration par default pour le nouveau utilisateur
     */
    public function genereSimpleNoteConfig($user_id) {

        $default_config = array(
            //Price
            NoteElement::createNumericElement(array(
                'name' => "Price",
                'value' => 0,
                'user_id' => $user_id
            ))['NoteDefaultConfig'],
            //Raison
            NoteElement::createTextElement(array(
                'name' => 'Why this position ?',
                'user_id' => $user_id
            ))['NoteDefaultConfig'],
            //Date
            NoteElement::createDateElement(array(
                'name' => 'Position date',
                'user_id' => $user_id
            ))['NoteDefaultConfig']
        );

        return $default_config;
    }
}
