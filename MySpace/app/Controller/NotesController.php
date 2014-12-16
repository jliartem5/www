<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of NotesController
 *
 * @author jian
 */
App::uses('ElementHelper', 'View/Helper');

class NotesController extends AppController {

    public $uses = array('User', 'Notes', 'NoteElement', 'NoteDefaultConfig');

    public function beforeFilter() {
        parent::beforeFilter();
        if ($this->Auth->loggedIn() == false) {
            return $this->redirect('/pages/index');
        }
    }

    public function index() {
        
    }

    public function write() {
        $completeUser = $this->User->findById($this->Auth->user()['id']);
        $this->set('DefaultConfig', $completeUser['note_default_config']);
    }

    public function save() {
        if ($this->request->is('post')) {
            $this->Notes->create();
            $note_data = array(
                'Note' => array('user_id' => $this->Auth->user()['id']),
                'NoteElement' => array()
            );
            $ds = $this->Notes->getdatasource();
            $note_saved = $this->Notes->save($note_data['Note']);
            if ($note_saved) {
                $default_config_ids = array();

                foreach ($this->request->data['notes'] as $decriptedID => $value) {
                    if (is_numeric($decriptedID)) {
                        $default_config_ids[] = ElementHelper::descriptData($decriptedID);
                    }
                }
                //Default element
                $default_config = $this->NoteDefaultConfig->find('all', array('conditions' => 'id IN (' . implode($default_config_ids, ',') . ')'));

                foreach ($default_config as $config) {
                    unset($config['NoteDefaultConfig']['id']);
                    unset($config['NoteDefaultConfig']['user_id']);
                    $config['NoteDefaultConfig']['note_id'] = $this->Notes->getInsertID();
                    $note_data['NoteElement'][] = array('NoteElement' => $config['NoteDefaultConfig']);
                }
                $element_saved = $this->NoteElement->saveMany($note_data['NoteElement']);
                if ($element_saved) {
                    $this->Session->setFlash('Note saved');
                }
            } else {
                
            }
        }
    }

    public function delete() {
        
    }

    public function element($type) {
        $this->layout = 'ajax';
        if (strlen($type) > 0) {
            $helper = new ElementHelper(new View());
            $html = $helper->generateElement($type);
            $this->set('html', $html);
        }
    }

}
