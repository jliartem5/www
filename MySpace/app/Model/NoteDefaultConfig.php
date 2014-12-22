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
App::import('Model', 'NoteElement');

class NoteDefaultConfig extends AppModel {

    public $name = 'NoteDefaultConfig';

    /**
     * Generer la configuration par default pour le nouveau utilisateur
     */
    public function genereSimpleNoteConfig($user_id) {

        $default_gridster_position = array(
            'data-row' => '1',
            'data-col' => '1',
            'data-sizex' => '1',
            'data-sizey' => '1'
        );

        $default_config = array(
            //Price
            NoteElement::createNumericElement(array(
                'label' => "Price",
                'value' => 0,
                'user_id' => $user_id,
                'position' => array(
                    'data-row' => '1',
                    'data-col' => '1',
                    'data-sizex' => '1',
                    'data-sizey' => '1'
                )
            ))['NoteDefaultConfig'],
            //Raison
            NoteElement::createTextElement(array(
                'label' => 'Why this position ?',
                'user_id' => $user_id,
                'position' => array(
                    'data-row' => '2',
                    'data-col' => '1',
                    'data-sizex' => '4',
                    'data-sizey' => '4'
                )
            ))['NoteDefaultConfig'],
            //Date
            NoteElement::createDateElement(array(
                'label' => 'Position date',
                'user_id' => $user_id,
                'position' => array(
                    'data-row' => '1',
                    'data-col' => '4',
                    'data-sizex' => '1',
                    'data-sizey' => '1'
                )
            ))['NoteDefaultConfig']
        );

        return $default_config;
    }

}
